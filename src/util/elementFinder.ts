export function getTextArea(): HTMLTextAreaElement {
    return document.querySelector('textarea')
}

export function getFooter(): HTMLDivElement {
    return document.querySelector("div[class*='absolute bottom-0']")
}

export function getRootElement(): HTMLDivElement {
    return document.querySelector('div[id="__next"]')
}

export function getWebChatGPTToolbar(): HTMLElement {
    return document.querySelector("div[class*='wcg-toolbar']")
}

export function getSubmitButton(): HTMLButtonElement {
    const textarea = getTextArea()
    if (!textarea) {
        return null
    }
    return textarea.parentNode.querySelector("button")
}

export function getTargetDiv(): HTMLDivElement {
    return document.querySelector('.flex.flex-col.text-sm.dark\\:bg-gray-800');
  }
  
  export function getSecondDiv(): HTMLDivElement {
    return document.querySelector('.h-32.md\\:h-48.flex-shrink-0');
  }

  export function hideDiv(): HTMLDivElement {
    return document.querySelector('.flex.flex-col.text-sm.dark\\:bg-gray-800')
  }
// export function getTargetDiv(): HTMLDivElement {
//     return document.querySelector('.text-gray-800.w-full.mx-auto.md\\:max-w-2xl.lg\\:max-w-3xl.md\\:h-full.md\\:flex.md\\:flex-col.px-6.dark\\:text-gray-100');
//   }
  
//   export function hideTargetDiv() {
//     const targetDiv = getTargetDiv();
//     if (targetDiv) {
//       targetDiv.style.display = 'none';
//     }
//   }
  
  
  