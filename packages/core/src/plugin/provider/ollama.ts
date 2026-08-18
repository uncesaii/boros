import { Effect } from "effect"
import { define } from "../internal"

// Local Ollama (https://ollama.com). Models are discovered at startup from the
// Ollama REST API (`GET /api/tags`) so the catalog always matches what is
// actually installed. Override the endpoint with BOROS_OLLAMA_BASE_URL
// (default http://127.0.0.1:11434). If Ollama is not running the provider
// stays empty and no error is raised.
const DEFAULT_BASE_URL = "http://127.0.0.1:11434"

type OllamaTag = {
  name: string
  details?: {
    family?: string
    parameter_size?: string
    quantization_level?: string
  }
}

export const OllamaPlugin = define({
  id: "ollama",
  effect: Effect.fn(function* (ctx) {
    const baseUrl = (process.env.BOROS_OLLAMA_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/$/, "")
    yield* ctx.catalog.transform(
      Effect.fn(function* (catalog) {
        let tags: OllamaTag[]
        try {
          const res = yield* Effect.promise(() => fetch(`${baseUrl}/api/tags`, { signal: AbortSignal.timeout(2000) }))
          if (!res.ok) return
          const body = (yield* Effect.promise(() => res.json())) as { models?: OllamaTag[] }
          tags = body.models ?? []
        } catch {
          return
        }
        if (tags.length === 0) return
        catalog.provider.update("ollama", (provider) => {
          provider.name = "Ollama"
          provider.api = { type: "aisdk", package: "@ai-sdk/openai-compatible", url: `${baseUrl}/v1` }
        })
        for (const tag of tags) {
          // Ollama model names may include a tag (e.g. "llama3.2:latest"); the
          // OpenAI-compatible endpoint expects exactly that name.
          const id = tag.name
          catalog.model.update("ollama", id, (model) => {
            model.api = { id, type: "aisdk", package: "@ai-sdk/openai-compatible" }
            model.name = id
            model.family = tag.details?.family
            model.capabilities = { tools: true, input: ["text"], output: ["text"] }
            model.enabled = true
            model.status = "active"
            model.limit = { context: 131_072, output: 8_192 }
          })
        }
      }),
    )
  }),
})