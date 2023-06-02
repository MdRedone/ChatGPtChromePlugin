import { h } from 'preact'
import { useState, useEffect, useRef, useLayoutEffect } from 'preact/hooks'
import { getTranslation, localizationKeys } from 'src/util/localization'
import { deletePrompt, getDefaultPrompt, getSavedPrompts, Prompt, savePrompt } from 'src/util/promptManager'
import TooltipWrapper from './tooltipWrapper'

const PromptEditor = (
    props: {
        language: string
    }
) => {
    const [savedPrompts, setSavedPrompts] = useState<Prompt[]>([])
    const [prompt, setPrompt] = useState<Prompt>(getDefaultPrompt())
    const [hasWebResultsPlaceholder, setHasWebResultsPlaceholder] = useState(false)
    const [hasQueryPlaceholder, setHasQueryPlaceholder] = useState(false)
    const [deleteBtnText, setDeleteBtnText] = useState("delete")
    const [selectedCategory, setSelectedCategory] = useState("");
    const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);


    const [showErrors, setShowErrors] = useState(false)
    const [nameError, setNameError] = useState(false)
    const [textError, setTextError] = useState(false)
    const [webResultsError, setWebResultsError] = useState(false)
    const [queryError, setQueryError] = useState(false)

    useLayoutEffect(() => {
        updateSavedPrompts()
    }, [])


    const updateSavedPrompts = async () => {
        const prompts = await getSavedPrompts(false, selectedCategory)
        setSavedPrompts(prompts)
        if (prompt.uuid === 'default') {
            setPrompt(prompts[0])
        }
    }

    useEffect(() => {
        updateSavedPrompts()
    }, [props.language])

    useEffect(() => {
        updatePlaceholderButtons(prompt.text)
    }, [prompt])

    useEffect(() => {
        setNameError(prompt.name.trim() === '')
        setTextError(prompt.text.trim() === '')
        // setWebResultsError(!prompt.text.includes('{web_results}'))
        setQueryError(!prompt.text.includes('{query}'))
    }, [prompt])
      

    async function updateList() {
        getSavedPrompts(false, selectedCategory).then(sp => {
            setSavedPrompts(sp)
        })
    }
    // async function updateList() {
    //     const category = " "; // Replace "your_category_value" with the actual category value
    //     getSavedPrompts(false, category).then(sp => {
    //       setSavedPrompts(sp);
    //     });
    //   }

    useEffect(() => {
    // Update the filtered prompts whenever the selectedCategory or savedPrompts state changes
    const filterPromptsByCategory = () => {
      const filtered = savedPrompts.filter(prompt => prompt.category === selectedCategory);
      setFilteredPrompts(filtered);
    };

    filterPromptsByCategory();
  }, [selectedCategory, savedPrompts]);

    const handleSelect = (prompt: Prompt) => {
        setShowErrors(false)
        setPrompt(prompt)
        setDeleteBtnText("delete")
    }


    const handleAdd = () => {
        setShowErrors(false)
        setPrompt({ name: '', text: '', category: '' })
        setDeleteBtnText("delete")
        if (nameInputRef.current) {
            nameInputRef.current.focus()
        }
    }

    const handleSave = async () => {
        setShowErrors(true)
        if (nameError || textError || webResultsError || queryError) {
            return
        }
        console.log("Selected Category:", selectedCategory); // Debug statement

        await savePrompt(prompt, selectedCategory)
        console.log("Prompt saved under category:", selectedCategory); // Debug statement
        await updateList()
        console.log("Updated prompt list"); // Debug statement
    }

    const handleDeleteBtnClick = () => {
        if (deleteBtnText === "delete") {
            setDeleteBtnText("check")
        } else {
            handleDelete()
        }
    }

    const handleDelete = async () => {
        await deletePrompt(prompt, selectedCategory)
        updateList()
        handleAdd()
    }


    const nameInputRef = useRef<HTMLInputElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const handleInsertText = (text: string) => {
        if (textareaRef.current) {
            const start = textareaRef.current.selectionStart
            const end = textareaRef.current.selectionEnd
            const currentText = textareaRef.current.value
            const newText = currentText.substring(0, start) + text + currentText.substring(end, currentText.length)
            textareaRef.current.setSelectionRange(start + text.length, start + text.length)
            textareaRef.current.focus()

            setPrompt({ ...prompt, text: newText })
        }
    }

    const handleTextareaChange = (e: Event) => {
        const text = (e.target as HTMLTextAreaElement).value
        if (text !== prompt.text) {
            setTextError(false)
            setPrompt({ ...prompt, text })
        }
    }

    const updatePlaceholderButtons = (text: string) => {
        setHasWebResultsPlaceholder(text.includes("{web_results}"))
        setHasQueryPlaceholder(text.includes("{query}"))
    }

    // const handleCategoryChange = (e: Event) => {
    //     const category = (e.target as HTMLSelectElement).value;
    //     setSelectedCategory(category);
    //   };
    const handleCategoryChange = (e: h.JSX.TargetedEvent<HTMLSelectElement, Event>) => {
        const category = e.currentTarget.value;
        setSelectedCategory(category);
      };
      
      
    
      const dropdownOptions = [
        { value: 'category1', label: 'Category 1' },
        { value: 'category2', label: 'Category 2' }
      ];
    
      const dropdown = (
        <select
          className="wcg-select wcg-flex-1 wcg-py-2 wcg-px-2 wcg-text-base"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="">Select Category</option>
          {dropdownOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );

    const actionToolbar = (
        <div className={`wcg-mt-4 wcg-flex wcg-flex-row wcg-justify-between
                        ${prompt.uuid === 'default' || prompt.uuid === 'default_en' ? "wcg-hidden" : ""}`}
        >
            <div className="wcg-flex wcg-flex-row wcg-gap-4">
                {/* <TooltipWrapper tip={showErrors ? getTranslation(localizationKeys.placeHolderTips.webResults) : ""}> */}
                <TooltipWrapper tip={getTranslation(localizationKeys.placeHolderTips.webResults)}>
                    <button
                        // ${showErrors && webResultsError ? "wcg-btn-error" : hasWebResultsPlaceholder ? "wcg-btn-success" : "wcg-btn-warning"}
                        className={`wcg-btn wcg-text-base wcg-text-white wcg-p-1 wcg-lowercase wcg-bg-rose-600 hover:wcg-bg-rose-900`}
                        onClick={() => {
                            // setWebResultsError(false)
                            handleInsertText('{web_results}')
                        }}
                    >
                        {"{web_results}"}
                    </button>
                </TooltipWrapper>
                {/* <TooltipWrapper tip={showErrors ? getTranslation(localizationKeys.placeHolderTips.query) : ""}> */}
                <TooltipWrapper tip={getTranslation(localizationKeys.placeHolderTips.query)}>
                    <button
                        className={`wcg-btn
                        ${showErrors && queryError ? "wcg-btn-error" : hasQueryPlaceholder ? "wcg-bg-rose-600" : "wcg-btn-warning"}
                        wcg-py-1 wcg-px-1 wcg-lowercase wcg-text-base wcg-text-white  hover:${hasQueryPlaceholder ? "wcg-bg-rose-900" : ""}`}
                        onClick={() => {
                            setQueryError(false)
                            handleInsertText('{query}')
                        }}
                    >
                        {"{query}"}
                    </button>
                </TooltipWrapper>

                <TooltipWrapper tip={getTranslation(localizationKeys.placeHolderTips.currentDate)}>
                    <button
                        className="wcg-text-base wcg-text-white wcg-bg-rose-600 hover:wcg-bg-rose-900 wcg-btn wcg-p-1 wcg-lowercase"
                        onClick={() => handleInsertText('{current_date}')}
                    >
                        {"{current_date}"}
                    </button>
                </TooltipWrapper>
            </div>

            <button
                type={"button"}
                className="wcg-bg-violet-600 hover:wcg-bg-violet-900 wcg-btn wcg-text-base wcg-text-white wcg-outline wcg-outline-offset-2 wcg-outline-2 wcg-outline-violet-200"
                onClick={handleSave}
            >
                {getTranslation(localizationKeys.buttons.save)}
            </button>
        </div >
    )


    // const PromptList = (
    //     <div>
    //         <button
    //             type={"button"}
    //             className="wcg-btn-primary wcg-btn wcg-w-full wcg-text-base"
    //             onClick={handleAdd}>
    //             <span class="material-symbols-outlined wcg-mr-2">
    //                 add
    //             </span>
    //             {getTranslation(localizationKeys.buttons.newPrompt)}
    //         </button>
    //         <ul className="wcg-scroll-y wcg-menu wcg-mt-4 wcg-flex wcg-max-h-96 wcg-scroll-m-0 wcg-flex-col
    //                 wcg-flex-nowrap wcg-overflow-auto wcg-border-2
    //                 wcg-border-solid wcg-border-white/20 wcg-p-0">
    //             {savedPrompts.map((prmpt: Prompt) => (
    //                 <li
    //                     key={prmpt.uuid}
    //                     onClick={() => handleSelect(prmpt)}
    //                 >
    //                     <a className={`wcg-text-base ${prmpt.uuid === prompt.uuid ? 'wcg-active' : ''}`}>
    //                         📝 {prmpt.name}
    //                     </a>
    //                 </li>
    //             ))}
    //         </ul>
    //     </div>
    // )
const PromptList = (
  <div>
    <button
      type="button"
      className="wcg-btn wcg-w-full wcg-text-base wcg-bg-violet-600 hover:wcg-bg-violet-900 wcg-text-white wcg-py-2 wcg-px-4 wcg-rounded-md wcg-shadow-sm mb-4 wcg-outline wcg-outline-offset-2 wcg-outline-2 wcg-outline-violet-200"
      onClick={handleAdd}
    >
      <span className="material-symbols-outlined wcg-mr-2">add</span>
      {getTranslation(localizationKeys.buttons.newPrompt)}
    </button>
    <ul className="wcg-scroll-y wcg-menu wcg-max-h-96 wcg-overflow-auto wcg-p-0">
      {filteredPrompts.map((prmpt: Prompt) => (
        <li
          key={prmpt.uuid}
          onClick={() => handleSelect(prmpt)}
          className={`wcg-text-base ${
            prmpt.uuid === prompt.uuid ? 'wcg-active' : ''
          }`}
        >
          <a className="wcg-flex wcg-items-center wcg-py-2 wcg-px-4 hover:wcg-bg-gray-600 wcg-rounded-md">
            ✍ {prmpt.name}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

    const nameInput = (
        <input
            ref={nameInputRef}
            className={`wcg-input-bordered wcg-input wcg-flex-1
                        ${showErrors && nameError ? "wcg-input-error" : ""}`
            }
            placeholder={getTranslation(localizationKeys.placeholders.namePlaceholder)}
            value={prompt.name}
            onInput={(e: Event) => {
                setNameError(false)
                setPrompt({ ...prompt, name: (e.target as HTMLInputElement).value })
            }}
            disabled={prompt.uuid === 'default' || prompt.uuid === 'default_en'}
        />
    )

    const btnDelete = (
        <button
            type={"button"}
            className={`wcg-btn wcg-text-base
                    ${deleteBtnText === "check" ? "wcg-btn-error" : "wcg-bg-red-800 hover:wcg-bg-red-900"}
                    ${prompt.uuid === 'default' || prompt.uuid === 'default_en' ? "wcg-hidden" : ""}`}
            onClick={handleDeleteBtnClick}
        >
            <span class="material-symbols-outlined">
                {deleteBtnText}
            </span>
        </button>
    )

    const textArea = (
        <textarea
            ref={textareaRef}
            className={`wcg-textarea-bordered wcg-textarea
                        ${showErrors && textError ? "wcg-textarea-error" : ""}
                        wcg-mt-2 wcg-h-96 wcg-resize-none wcg-text-base`}
            value={prompt.text}
            onInput={handleTextareaChange}
            disabled={prompt.uuid === 'default' || prompt.uuid === 'default_en'}
            title="Prompt template text"
        />
    )

    return (
        <div className="wcg-rounded-box wcg-flex wcg-min-h-[32rem] wcg-w-4/5 wcg-flex-col wcg-gap-4 wcg-border wcg-py-6">
            
            <h1 className="wcg-m-0 wcg-p-2 wcg-text-2xl">Prompt Editor</h1>
            <div className="wcg-flex wcg-flex-row wcg-gap-4">
                <div className="wcg-w-1/3">
                    {PromptList}
                </div>

                <div className="wcg-flex wcg-w-2/3 wcg-flex-col">
                    <div className="wcg-flex wcg-flex-row wcg-items-center wcg-gap-2">
                        {nameInput}
                        {btnDelete}
                    </div>
                    <div className="wcg-flex wcg-items-center wcg-mt-2">
                        <label className="wcg-p-2 wcg-w-32">Category:</label>
                        {dropdown}
                    </div>
                    {textArea}

                    {actionToolbar}
                </div>
            </div >
        </div >
    )
}

export default PromptEditor
