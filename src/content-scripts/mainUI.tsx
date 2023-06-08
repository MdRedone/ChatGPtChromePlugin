import '../style/base.css'
import { h, render } from 'preact'
import { getTextArea, getFooter, getRootElement, getSubmitButton, getWebChatGPTToolbar } from '../util/elementFinder'
import Toolbar from 'src/components/toolbar'
import ErrorMessage from 'src/components/errorMessage'
import { getUserConfig, UserConfig } from 'src/util/userConfig'
import { SearchRequest, SearchResult, webSearch } from './web_search'

import Section from 'src/components/sections'
// import ContentSection from 'src/components/contentSection';
import { AllBlogsSection, BlogsSection, CategoriesSection } from 'src/components/sectionContent'
// import Section from 'src/components/demo'

import createShadowRoot from 'src/util/createShadowRoot'
import { compilePrompt, promptContainsWebResults } from 'src/util/promptManager'
import SlashCommandsMenu, { slashCommands } from 'src/components/slashCommandsMenu'
import { apiExtractText } from './api'

let isProcessing = false
let updatingUI = false

const rootEl = getRootElement()
let btnSubmit: HTMLButtonElement | null | undefined
let textarea: HTMLTextAreaElement | null
let chatGptFooter: HTMLDivElement | null
let toolbar: HTMLElement | null
let button: HTMLButtonElement | null 
// let selectedCategory: string = 'All Blogs'


function renderSlashCommandsMenu() {

    let div = document.querySelector('div.wcg-slash-commands-menu')
    if (div) div.remove()

    div = document.createElement('div')
    div.className = "wcg-slash-commands-menu"
    const textareaParentParent = textarea?.parentElement?.parentElement

    textareaParentParent?.insertBefore(div, textareaParentParent.firstChild)
    render(<SlashCommandsMenu textarea={textarea} />, div)
}

async function processQuery(query: string, userConfig: UserConfig) {

    const containsWebResults = await promptContainsWebResults()
    if (!containsWebResults) {
        return undefined
    }

    let results: SearchResult[]

    const pageCommandMatch = query.match(/page:(\S+)/)
    if (pageCommandMatch) {
        const url = pageCommandMatch[1]
        results = await apiExtractText(url)
    } else {
        const searchRequest: SearchRequest = {
            query,
            timerange: userConfig.timePeriod,
            region: userConfig.region,
        }

        results = await webSearch(searchRequest, userConfig.numWebResults)
    }

    return results
}

async function handleSubmit(query: string) {

    if (!textarea) return

    const userConfig = await getUserConfig()

    if (!userConfig.webAccess) {
        textarea.value = query
        pressEnter()
        return
    }

    try {
        const results = await processQuery(query, userConfig)
        const compiledPrompt = await compilePrompt(results, query)
        textarea.value = compiledPrompt
        pressEnter()
    } catch (error) {
        if (error instanceof Error) {
            showErrorMessage(error)
        }
    }
}

async function onSubmit(event: MouseEvent | KeyboardEvent) {

    if (!textarea) return

    const isKeyEvent = event instanceof KeyboardEvent

    if (isKeyEvent && event.shiftKey && event.key === 'Enter') return

    if (isKeyEvent && event.key === 'Enter' && event.isComposing) return

    if (!isProcessing && (event.type === "click" || (isKeyEvent && event.key === 'Enter'))) {
        const query = textarea?.value.trim()

        if (!query) return

        textarea.value = ""

        const isPartialCommand = slashCommands.some(command => command.name.startsWith(query) && query.length <= command.name.length)
        if (isPartialCommand) {
            return
        }

        isProcessing = true
        await handleSubmit(query)
        isProcessing = false
    }
}

function pressEnter() {
    textarea?.focus()
    const enterEvent = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: 'Enter',
        code: 'Enter'
    })
    textarea?.dispatchEvent(enterEvent)
}

function showErrorMessage(error: Error) {
    console.info("WebChatGPT error --> API error: ", error)
    const div = document.createElement('div')
    document.body.appendChild(div)
    render(<ErrorMessage message={error.message} />, div)
}


async function updateUI() {

    if (updatingUI) return

    updatingUI = true

    textarea = getTextArea()
    toolbar = getWebChatGPTToolbar()
    // console.info("toolbar --> ", toolbar)
    if (!textarea) {
        toolbar?.remove()
        return
    }

    if (toolbar) return

    console.info("WebChatGPT: Updating UI")

    btnSubmit = getSubmitButton()
    btnSubmit?.addEventListener("click", onSubmit)

    textarea?.addEventListener("keydown", onSubmit)

    await renderToolbar()

    renderSlashCommandsMenu()
    // await renderSectionButtons();


    chatGptFooter = getFooter()
    if (chatGptFooter) {
        const lastChild = chatGptFooter.lastElementChild as HTMLElement
        if (lastChild) lastChild.style.padding = '0 0 0.5em 0'
    }

    // await renderSectionButtons();

    updatingUI = false
}

async function renderToolbar() {

    try {
        const textareaParentParent = textarea?.parentElement?.parentElement
        const { shadowRootDiv, shadowRoot } = await createShadowRoot('content-scripts/mainUI.css')
        shadowRootDiv.classList.add('wcg-toolbar')
        textareaParentParent?.appendChild(shadowRootDiv)
        render(<Toolbar textarea={textarea} />, shadowRoot)

    } catch (e) {
        if (e instanceof Error) {
            showErrorMessage(Error(`Error loading WebChatGPT toolbar: ${e.message}. Please reload the page (F5).`))
        }
    }
}

// async function renderToolbar() {
//     try {
//       const { shadowRootDiv, shadowRoot } = await createShadowRoot('content-scripts/mainUI.css')
//       shadowRootDiv.classList.add('wcg-toolbar')
//     //   document.body.prepend(shadowRootDiv)
//     // document.body.style.position = 'relative'
//     document.body.insertBefore(shadowRootDiv, document.body.firstChild)
//       render(<Toolbar textarea={textarea} />, shadowRoot)
//     } catch (e) {
//       if (e instanceof Error) {
//         showErrorMessage(Error(`Error loading WebChatGPT toolbar: ${e.message}. Please reload the page (F5).`))
//       }
//     }

//     window.scrollTo(0, 0);
//   }
// async function renderToolbar() {
//     try {
//       const { shadowRootDiv, shadowRoot } = await createShadowRoot('content-scripts/mainUI.css')
//       shadowRootDiv.classList.add('wcg-toolbar', 'centered') // Add the 'centered' class
//       const containerDiv = document.createElement('div')
//       containerDiv.classList.add('toolbar-container')
//       containerDiv.appendChild(shadowRootDiv)
//       document.body.insertBefore(containerDiv, document.body.firstChild) // Insert the container div
//       render(<Toolbar textarea={textarea} />, shadowRoot)
//     } catch (e) {
//       if (e instanceof Error) {
//         showErrorMessage(Error(`Error loading WebChatGPT toolbar: ${e.message}. Please reload the page (F5).`))
//       }
//     }
//   }

// async function renderSectionButtons() {
//     try {
//       const textareaParentParent = textarea?.parentElement?.parentElement;
//       const sectionButtonsDiv = document.createElement('div');
//       sectionButtonsDiv.className = 'wcg-section-buttons';
//       textareaParentParent?.appendChild(sectionButtonsDiv);
//     //   document.body.insertBefore(sectionButtonsDiv, document.body.firstChild )
//       render(<Section button={button} />, sectionButtonsDiv);
//     } catch (e) {
//       if (e instanceof Error) {
//         showErrorMessage(Error(`Error rendering section buttons: ${e.message}. Please reload the page (F5).`));
//       }
//     }
//   }  

const mutationObserver = new MutationObserver((mutations) => {
    
    if (!mutations.some(mutation => mutation.removedNodes.length > 0)) return

    // console.info("WebChatGPT: Mutation observer triggered")
    
    if (getWebChatGPTToolbar()) return

    try {
        updateUI()
    } catch (e) {
        if (e instanceof Error) {
            showErrorMessage(e)
        }
    }
})

window.onload = function () {
    updateUI()

    mutationObserver.observe(rootEl, { childList: true, subtree: true })
}

window.onunload = function () {
    mutationObserver.disconnect()
}

// document.documentElement.style.display = 'none'

