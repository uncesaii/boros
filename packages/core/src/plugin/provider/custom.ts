import { Effect } from "effect"
import { ModelV2 } from "../../model"
import { define } from "../internal"

// Custom OpenAI-compatible endpoint, configured entirely through the
// environment so a private gateway can be used without touching config:
//   BOROS_CUSTOM_OPENAI_BASE_URL  (required; enables the provider)
//   BOROS_CUSTOM_OPENAI_MODEL     (comma-separated model IDs, default "default")
//   BOROS_CUSTOM_OPENAI_API_KEY   (optional; passed through to the endpoint)
export const CustomProviderPlugin = define({
  id: "custom",
  effect: Effect.fn(function* (ctx) {
    yield* ctx.catalog.transform(
      Effect.fn(function* (catalog) {
        const url = process.env.BOROS_CUSTOM_OPENAI_BASE_URL
        if (!url) return
        const models = (process.env.BOROS_CUSTOM_OPENAI_MODEL ?? "default").split(",").map((id) => id.trim())
        const apiKey = process.env.BOROS_CUSTOM_OPENAI_API_KEY ?? ""
        for (const id of models) {
          if (!id) continue
          catalog.provider.update("custom", (provider) => {
            provider.name = "Custom OpenAI"
            provider.api = { type: "aisdk", package: "@ai-sdk/openai-compatible", url }
            provider.request.body.apiKey = apiKey
          })
          catalog.model.update("custom", id, (model) => {
            model.api = { id, type: "aisdk", package: "@ai-sdk/openai-compatible" }
            model.name = id
            model.capabilities = { tools: true, input: ["text"], output: ["text"] }
            model.enabled = true
            model.status = "active"
            model.limit = { context: 200_000, output: 8_192 }
          })
        }
      }),
    )
  }),
})