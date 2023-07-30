import { useCallback, useRef, useState } from "react"
import { Readability } from "@mozilla/readability"
import { Input } from "./components/ui/input"
import { Button } from "./components/ui/button"
import { Textarea } from "./components/ui/textarea"
import { Configuration, OpenAIApi } from "openai"
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

type ReadabilityResult = ReturnType<Readability["parse"]>

function requestFromTab<T>(message: unknown): Promise<T> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0].id) {
        reject(new Error("No active tab found"))
        return
      }
      chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
        resolve(response)
      })
    })
  })
}

function App() {
  const formRef = useRef<HTMLFormElement>(null)
  const [openAIKey, setOpenAIKey] = useState<string>("")
  const [prompt, setPrompt] = useState<string>("")
  const [response, setResponse] = useState<string>("")

  const articleQuery = useQuery(["article"], () =>
    requestFromTab<ReadabilityResult>("refreshContent")
  )

  useQuery(["openAIKey"], () => chrome.storage.local.get("openAIKey"), {
    onSuccess: (result) => {
      setOpenAIKey(result.openAIKey)
    },
  })

  const generateMutation = useMutation(
    (prompt: string) => {
      const config = new Configuration({
        apiKey: openAIKey,
      })
      const openai = new OpenAIApi(config)

      return openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `${prompt}\n\nARTICLE:${articleQuery.data?.textContent}`,
          },
        ],
      })
    },
    {
      onSuccess: (data) => {
        setResponse(data.data.choices[0].message?.content || "")
      },
    }
  )

  const handleOpenAIKeyChange = useCallback((v: string) => {
    setOpenAIKey(v)
    chrome.storage.local.set({ openAIKey: v })
  }, [])

  return (
    <div className="w-96 p-8">
      <form
        ref={formRef}
        className="flex flex-col gap-4 mb-4"
        onSubmit={(e) => {
          e.preventDefault()
          generateMutation.mutate(prompt)
        }}
      >
        <Input
          value={openAIKey}
          onChange={(e) => handleOpenAIKeyChange(e.target.value)}
          placeholder="OpenAI API Key"
          type="password"
        />
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Prompt"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              generateMutation.mutate(prompt)
            }
          }}
        />
        <Button type="submit" disabled={generateMutation.isLoading}>
          {generateMutation.isLoading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Run prompt
        </Button>
      </form>
      <a href={`${chrome.runtime.getURL("")}?tabId=12345`} target="_blank">
        {chrome.runtime.getURL("")}
      </a>
      {response.split("\n").map((line, i) => (
        <p key={i}>{line}</p>
      ))}
    </div>
  )
}

const queryClient = new QueryClient()

const FullTabApp = () => {
  const currentURL = window.location.href
  const url = new URL(currentURL)
  const params = new URLSearchParams(url.search)
  const tabId = params.get("tabId")

  return <p>{tabId}</p>
}

const WrappedApp = () => {
  const views = chrome.extension.getViews({ type: "popup" })
  const isInPopupWindow = views.some((view) => view === window)

  return (
    <QueryClientProvider client={queryClient}>
      {isInPopupWindow ? <App /> : <FullTabApp />}
    </QueryClientProvider>
  )
}

export default WrappedApp
