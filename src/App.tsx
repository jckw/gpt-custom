import { useCallback, useState } from "react"
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

function App() {
  const [article, setArticle] = useState<ReadabilityResult>(null)
  const [openAIKey, setOpenAIKey] = useState<string>("")
  const [prompt, setPrompt] = useState<string>("")
  const [response, setResponse] = useState<string>("")

  useQuery(["article"], () => chrome.storage.local.get("article"), {
    onSuccess: (result) => {
      setArticle(result.article)
    },
  })

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
            content: `${prompt}\n\nARTICLE:${article?.textContent}`,
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
    <div className="w-80 p-8 flex flex-col gap-4">
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
      />
      <Button
        onClick={() => generateMutation.mutate(prompt)}
        disabled={generateMutation.isLoading}
      >
        {generateMutation.isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Run prompt
      </Button>
      <p>{response}</p>
    </div>
  )
}

const queryClient = new QueryClient()

const WrappedApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  )
}

export default WrappedApp
