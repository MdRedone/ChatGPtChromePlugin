import Browser from "webextension-polyfill"
import { v4 as uuidv4 } from 'uuid'
import { getCurrentLanguageName, getLocaleLanguage, getTranslation, localizationKeys } from "./localization"
import { getUserConfig } from "./userConfig"
import { SearchResult } from "src/content-scripts/web_search"

export const SAVED_PROMPTS_KEY = 'saved_prompts'
export const SAVED_PROMPTS_MOVED_KEY = 'saved_prompts_moved_to_local'

export interface Prompt {
    uuid?: string,
    name: string,
    text: string,
    category: string
}

const removeCommands = (query: string) => query.replace(/\/page:(\S+)\s*/g, '').replace(/\/site:(\S+)\s*/g, '')

export const promptContainsWebResults = async () => {
    const currentPrompt = await getCurrentPrompt()
    return currentPrompt.text.includes('{web_results}')
}

// export const compilePrompt = async (results: SearchResult[] | undefined, query: string) => {
//     const currentPrompt = await getCurrentPrompt()
//     const prompt = replaceVariables(currentPrompt.text, {
//         '{web_results}': formatWebResults(results),
//         '{query}': removeCommands(query),
//         '{current_date}': new Date().toLocaleDateString()
        
//     })
//     console.log("prompt: ", prompt)
//     return prompt
// }

export const compilePrompt = async (results: SearchResult[] | undefined, query: string, selectedPrompt: Prompt | null) => {
    let prompt = '';
  
    if (selectedPrompt) {
      // If a saved prompt is selected, use the query from the input box
      prompt = replaceVariables(selectedPrompt.text, {
        '{web_results}': formatWebResults(results),
        '{query}': removeCommands(query),
        '{current_date}': new Date().toLocaleDateString()
      });
    } else {
      // No saved prompt selected, use only the query from the input box
      prompt = query;
    }
  
    console.log("prompt: ", prompt);
    return prompt;
  };
  

const formatWebResults = (results: SearchResult[] | undefined) => {
    if (!results) {
        return ""
    }

    if (results.length === 0) {
        return "No results found.\n"
    }

    let counter = 1
    return results.reduce((acc, result): string => acc += `[${counter++}] "${result.body}"\nURL: ${result.url}\n\n`, "")
}

const replaceVariables = (prompt: string, variables: { [key: string]: string }) => {
    let newPrompt = prompt
    for (const key in variables) {
        try {
            newPrompt = newPrompt.replaceAll(key, variables[key])
        } catch (error) {
            console.info("WebChatGPT error --> API error: ", error)
        }
    }
    return newPrompt
}

export const getDefaultPrompt = () => {
    return {
        name: 'Default prompt',
        text: getTranslation(localizationKeys.defaultPrompt, 'en') + (getLocaleLanguage() !== 'en' ? `\nReply in ${getCurrentLanguageName()}` : ''),
        uuid: 'default',
        category: 'default category'
    }
}

const getDefaultEnglishPrompt = () => {
    return { name: 'Default English', text: getTranslation(localizationKeys.defaultPrompt, 'en'), uuid: 'default_en', category: 'default_category' }
}

export const getCurrentPrompt = async () => {
    const userConfig = await getUserConfig()
    const currentPromptUuid = userConfig.promptUUID
    const savedPrompts = await getSavedPrompts(true, userConfig.category)
    return savedPrompts.find((i: Prompt) => i.uuid === currentPromptUuid) || getDefaultPrompt()
}

export const getSavedPrompts = async (addDefaults = true, category: string) => {
    const { [SAVED_PROMPTS_KEY]: localPrompts, [SAVED_PROMPTS_MOVED_KEY]: promptsMoved } = await Browser.storage.local.get({ [SAVED_PROMPTS_KEY]: [], [SAVED_PROMPTS_MOVED_KEY]: false })

    let savedPrompts = localPrompts

    if (!promptsMoved) {
        const syncStorage = await Browser.storage.sync.get({ [SAVED_PROMPTS_KEY]: [] })
        const syncPrompts = syncStorage?.[SAVED_PROMPTS_KEY] ?? []

        savedPrompts = localPrompts.reduce((prompts: Prompt[], prompt: Prompt) => {
            if (!prompts.some(({ uuid }) => uuid === prompt.uuid)) prompts.push(prompt);
            return prompts
        }, syncPrompts)

        await Browser.storage.local.set({ [SAVED_PROMPTS_KEY]: savedPrompts, [SAVED_PROMPTS_MOVED_KEY]: true })
        await Browser.storage.sync.set({ [SAVED_PROMPTS_KEY]: [] })
    }
    const filteredPrompts = savedPrompts.filter((prompt: Prompt) => prompt.category === category);


    return addDefaults ? addDefaultPrompts(savedPrompts) : savedPrompts
}

function addDefaultPrompts(prompts: Prompt[]) {

    if (getLocaleLanguage() !== 'en') {
        addPrompt(prompts, getDefaultEnglishPrompt())
    }
    addPrompt(prompts, getDefaultPrompt())
    return prompts

    function addPrompt(prompts: Prompt[], prompt: Prompt) {
        const index = prompts.findIndex((i: Prompt) => i.uuid === prompt.uuid)
        if (index >= 0) {
            prompts[index] = prompt
        } else {
            prompts.unshift(prompt)
        }
    }
}

export const savePrompt = async (prompt: Prompt, category: string) => {
    const savedPrompts = await getSavedPrompts(false, category)
    const index = savedPrompts.findIndex((i: Prompt) => i.uuid === prompt.uuid)
    if (index >= 0) {
        savedPrompts[index] = {...prompt, category }
    } else {
        prompt.uuid = uuidv4()
        savedPrompts.push({...prompt, category})
    }

    await Browser.storage.local.set({ [SAVED_PROMPTS_KEY]: savedPrompts })
}

export const deletePrompt = async (prompt: Prompt, category: string) => {
    let savedPrompts = await getSavedPrompts(true, category)
    savedPrompts = savedPrompts.filter((i: Prompt) => i.uuid !== prompt.uuid)
    await Browser.storage.local.set({ [SAVED_PROMPTS_KEY]: savedPrompts })
}
