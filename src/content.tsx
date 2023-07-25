import { Readability } from "@mozilla/readability"

const documentClone = document.implementation.createHTMLDocument()
documentClone.documentElement.innerHTML = document.documentElement.innerHTML

const article = new Readability(documentClone).parse()

chrome.storage.local.set({ article })

console.log("The GPT custom content script is running!")
console.log("The article title is: " + article?.textContent)
