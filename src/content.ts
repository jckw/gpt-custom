import { Readability } from "@mozilla/readability"

function sendPageContent() {
  const documentClone = document.implementation.createHTMLDocument()
  documentClone.documentElement.innerHTML = document.documentElement.innerHTML

  const article = new Readability(documentClone).parse()

  return article
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message === "refreshContent") {
    console.log("Content script refresh content")
    sendResponse(sendPageContent())
  }
})

sendPageContent()

console.log("The GPT custom content script is running!")
