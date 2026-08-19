import { afterEach, expect, test } from "bun:test"
import { LayerNode } from "@boros-ai/core/effect/layer-node"
import { Effect } from "effect"
import { ModelsDev } from "@boros-ai/core/models-dev"
import { FSUtil } from "@boros-ai/core/fs-util"
import { CrossSpawnSpawner } from "@boros-ai/core/cross-spawn-spawner"
import { AppNodeBuilder } from "@boros-ai/core/effect/app-node-builder"
import { Global } from "@boros-ai/core/global"
import { disposeAllInstances, provideInstanceEffect, tmpdirScoped, TestInstance } from "../fixture/fixture"
import { markPluginDependenciesReady } from "../fixture/plugin"
import { Auth } from "@/auth"
import { Config } from "@/config/config"
import { Env } from "../../src/env"
import { Plugin } from "../../src/plugin/index"
import { Provider } from "@/provider/provider"

import { RuntimeFlags } from "@/effect/runtime-flags"
import { InstanceBootstrap } from "@/project/bootstrap"
import { InstanceStore } from "@/project/instance-store"
import { testEffect } from "../lib/effect"
import { ProviderV2 } from "@boros-ai/core/provider"
import { ModelV2 } from "@boros-ai/core/model"
import { mkdir } from "fs/promises"
import path from "path"

const originalEnv = new Map<string, string | undefined>()

const rememberEnv = (k: string) => {
  if (!originalEnv.has(k)) originalEnv.set(k, process.env[k])
}

const setProcessEnv = (k: string, v: string) =>
  Effect.sync(() => {
    rememberEnv(k)
    process.env[k] = v
  })

const set = (k: string, v: string) =>
  Effect.gen(function* () {
    rememberEnv(k)
    process.env[k] = v
    yield* Env.use.set(k, v)
  })

const remove = (k: string) =>
  Effect.gen(function* () {
    rememberEnv(k)
    delete process.env[k]
    yield* Env.use.remove(k)
  })

afterEach(async () => {
  for (const [key, value] of originalEnv) {
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }
  originalEnv.clear()
  await disposeAllInstances()
})

const providerLayer = (flags: Partial<RuntimeFlags.Info> = {}) =>
  LayerNode.compile(
    LayerNode.group([
      Provider.node,
      FSUtil.node,
      Env.node,
      Config.node,
      Auth.node,
      Plugin.node,
      ModelsDev.node,
      RuntimeFlags.node,
    ]),
    [[RuntimeFlags.node, RuntimeFlags.layer(flags)]],
  )

const list = Provider.use.list()

const it = testEffect(LayerNode.compile(LayerNode.group([Provider.node, Env.node, Plugin.node])))
const experimentalModels = testEffect(providerLayer({ enableExperimentalModels: true }))

// Boros ships a single built-in catalog provider: Ollama Cloud. It is loaded
// from the models.dev fixture (see test/preload.ts) and activated by the
// OLLAMA_API_KEY env var. Local Ollama and custom OpenAI-compatible endpoints
// are registered by their own plugins / config.
const OLLAMA_CLOUD = ProviderV2.ID.make("ollama-cloud")

it.instance("ollama-cloud loads from OLLAMA_API_KEY env variable", () =>
  Effect.gen(function* () {
    yield* set("OLLAMA_API_KEY", "test-ollama-key")
    const providers = yield* list
    expect(providers[OLLAMA_CLOUD]).toBeDefined()
    expect(providers[OLLAMA_CLOUD].source).toBe("env")
    expect(providers[OLLAMA_CLOUD].key).toBe("test-ollama-key")
    expect(providers[OLLAMA_CLOUD].models["deepseek-v4-flash"]).toBeDefined()
    expect(providers[OLLAMA_CLOUD].models["deepseek-v4-flash"].api.npm).toBe("@ai-sdk/openai-compatible")
    expect(providers[OLLAMA_CLOUD].models["deepseek-v4-flash"].api.url).toBe("https://ollama.com/v1")
  }),
)

it.instance("ollama-cloud is absent without credentials", () =>
  Effect.gen(function* () {
    yield* remove("OLLAMA_API_KEY")
    const providers = yield* list
    expect(providers[OLLAMA_CLOUD]).toBeUndefined()
  }),
)

it.instance("ollama-cloud filters deprecated models", () =>
  Effect.gen(function* () {
    yield* set("OLLAMA_API_KEY", "test-ollama-key")
    const providers = yield* list
    const models = Object.keys(providers[OLLAMA_CLOUD].models)
    expect(models).toContain("deepseek-v4-flash")
    expect(models).not.toContain("cogito-2.1:671b")
  }),
)

it.instance("ollama-cloud model whitelist filters models", () =>
  Effect.gen(function* () {
    yield* set("OLLAMA_API_KEY", "test-ollama-key")
    const providers = yield* list
    const models = Object.keys(providers[OLLAMA_CLOUD].models)
    expect(models).toContain("deepseek-v4-flash")
    expect(models.length).toBe(1)
  }),
  { config: { provider: { "ollama-cloud": { whitelist: ["deepseek-v4-flash"] } } } },
)

it.instance("ollama-cloud model blacklist excludes specific models", () =>
  Effect.gen(function* () {
    yield* set("OLLAMA_API_KEY", "test-ollama-key")
    const providers = yield* list
    const models = Object.keys(providers[OLLAMA_CLOUD].models)
    expect(models).not.toContain("minimax-m2.5")
    expect(models).toContain("deepseek-v4-flash")
  }),
  { config: { provider: { "ollama-cloud": { blacklist: ["minimax-m2.5"] } } } },
)

it.instance("ollama-cloud custom model alias via config", () =>
  Effect.gen(function* () {
    yield* set("OLLAMA_API_KEY", "test-ollama-key")
    const providers = yield* list
    expect(providers[OLLAMA_CLOUD].models["my-alias"]).toBeDefined()
    expect(providers[OLLAMA_CLOUD].models["my-alias"].name).toBe("My Custom Alias")
  }),
  {
    config: {
      provider: {
        "ollama-cloud": { models: { "my-alias": { id: "deepseek-v4-flash", name: "My Custom Alias" } } },
      },
    },
  },
)

it.instance("ollama-cloud options are merged from config", () =>
  Effect.gen(function* () {
    yield* set("OLLAMA_API_KEY", "test-ollama-key")
    const providers = yield* list
    expect(providers[OLLAMA_CLOUD].options.timeout).toBe(60000)
    expect(providers[OLLAMA_CLOUD].options.headerTimeout).toBe(10000)
  }),
  { config: { provider: { "ollama-cloud": { options: { timeout: 60000, headerTimeout: 10000 } } } } },
)

it.instance("ollama-cloud getModel returns model for valid provider/model", () =>
  Effect.gen(function* () {
    yield* set("OLLAMA_API_KEY", "test-ollama-key")
    const provider = yield* Provider.Service
    const model = yield* provider.getModel(OLLAMA_CLOUD, ModelV2.ID.make("deepseek-v4-flash"))
    expect(model).toBeDefined()
    expect(String(model.providerID)).toBe("ollama-cloud")
    expect(String(model.id)).toBe("deepseek-v4-flash")
  }),
)

it.instance("ollama-cloud getModel throws ModelNotFoundError for invalid model", () =>
  Effect.gen(function* () {
    yield* set("OLLAMA_API_KEY", "test-ollama-key")
    const exit = yield* Provider.use
      .getModel(OLLAMA_CLOUD, ModelV2.ID.make("nonexistent-model"))
      .pipe(Effect.exit)
    expect(exit._tag).toBe("Failure")
  }),
)

it.instance("ollama-cloud getSmallModel selects the preferred small family", () =>
  Effect.gen(function* () {
    yield* set("OLLAMA_API_KEY", "test-ollama-key")
    const model = yield* Provider.use.getSmallModel(OLLAMA_CLOUD)
    expect(model).toBeDefined()
    expect(model?.family).toBe("gemini-flash")
  }),
)

it.instance("ollama-cloud getSmallModel respects config small_model override", () =>
  Effect.gen(function* () {
    yield* set("OLLAMA_API_KEY", "test-ollama-key")
    const model = yield* Provider.use.getSmallModel(OLLAMA_CLOUD)
    expect(model).toBeDefined()
    expect(String(model?.providerID)).toBe("ollama-cloud")
    expect(String(model?.id)).toBe("deepseek-v4-flash")
  }),
  { config: { small_model: "ollama-cloud/deepseek-v4-flash" } },
)

it.instance("ollama-cloud reasoning model generates variants", () =>
  Effect.gen(function* () {
    yield* set("OLLAMA_API_KEY", "test-ollama-key")
    const providers = yield* list
    const model = providers[OLLAMA_CLOUD].models["deepseek-v4-flash"]
    expect(model.capabilities.reasoning).toBe(true)
    expect(model.variants).toBeDefined()
    expect(Object.keys(model.variants!).length).toBeGreaterThan(0)
  }),
)

it.instance("ollama-cloud defaultModel returns a model from the provider", () =>
  Effect.gen(function* () {
    yield* set("OLLAMA_API_KEY", "test-ollama-key")
    const model = yield* Provider.use.defaultModel()
    expect(String(model.providerID)).toBe("ollama-cloud")
    expect(model.modelID).toBeDefined()
  }),
)

it.instance("disabled_providers excludes ollama-cloud even with env var", () =>
  Effect.gen(function* () {
    yield* set("OLLAMA_API_KEY", "test-ollama-key")
    const providers = yield* list
    expect(providers[OLLAMA_CLOUD]).toBeUndefined()
  }),
  { config: { disabled_providers: ["ollama-cloud"] } },
)

it.instance("enabled_providers restricts to only listed providers", () =>
  Effect.gen(function* () {
    yield* set("OLLAMA_API_KEY", "test-ollama-key")
    const providers = yield* list
    expect(providers[OLLAMA_CLOUD]).toBeUndefined()
  }),
  { config: { enabled_providers: ["some-other-provider"] } },
)

// ---------------------------------------------------------------------------
// Custom OpenAI-compatible providers (config-defined)
// ---------------------------------------------------------------------------

it.instance(
  "custom provider with npm package",
  Effect.gen(function* () {
    const providers = yield* list
    expect(providers[ProviderV2.ID.make("custom-provider")]).toBeDefined()
    expect(providers[ProviderV2.ID.make("custom-provider")].name).toBe("Custom Provider")
    expect(providers[ProviderV2.ID.make("custom-provider")].models["custom-model"]).toBeDefined()
  }),
  {
    config: {
      provider: {
        "custom-provider": {
          name: "Custom Provider",
          npm: "@ai-sdk/openai-compatible",
          api: "https://api.custom.com/v1",
          env: ["CUSTOM_API_KEY"],
          models: {
            "custom-model": {
              name: "Custom Model",
              tool_call: true,
              limit: { context: 128000, output: 4096 },
            },
          },
          options: { apiKey: "custom-key" },
        },
      },
    },
  },
)

const alphaProviderConfig = {
  provider: {
    "custom-provider": {
      name: "Custom Provider",
      npm: "@ai-sdk/openai-compatible",
      api: "https://api.custom.com/v1",
      models: {
        "active-model": {
          name: "Active Model",
        },
        "alpha-model": {
          name: "Alpha Model",
          status: "alpha" as const,
        },
      },
      options: { apiKey: "custom-key" },
    },
  },
}

it.instance(
  "filters alpha provider models by default",
  Effect.gen(function* () {
    const providers = yield* list
    expect(providers[ProviderV2.ID.make("custom-provider")].models["active-model"]).toBeDefined()
    expect(providers[ProviderV2.ID.make("custom-provider")].models["alpha-model"]).toBeUndefined()
  }),
  { config: alphaProviderConfig },
)

experimentalModels.instance(
  "includes alpha provider models when experimental models are enabled",
  Effect.gen(function* () {
    const providers = yield* list
    expect(providers[ProviderV2.ID.make("custom-provider")].models["active-model"]).toBeDefined()
    expect(providers[ProviderV2.ID.make("custom-provider")].models["alpha-model"]).toBeDefined()
  }),
  { config: alphaProviderConfig },
)

it.instance(
  "provider with baseURL from config",
  Effect.gen(function* () {
    const providers = yield* list
    expect(providers[ProviderV2.ID.make("custom-openai")]).toBeDefined()
    expect(providers[ProviderV2.ID.make("custom-openai")].options.baseURL).toBe("https://custom.openai.com/v1")
  }),
  {
    config: {
      provider: {
        "custom-openai": {
          name: "Custom OpenAI",
          npm: "@ai-sdk/openai-compatible",
          env: [],
          models: { "gpt-4": { name: "GPT-4", tool_call: true, limit: { context: 128000, output: 4096 } } },
          options: { apiKey: "test-key", baseURL: "https://custom.openai.com/v1" },
        },
      },
    },
  },
)

it.instance(
  "model cost defaults to zero when not specified",
  Effect.gen(function* () {
    const providers = yield* list
    const model = providers[ProviderV2.ID.make("test-provider")].models["test-model"]
    expect(model.cost.input).toBe(0)
    expect(model.cost.output).toBe(0)
    expect(model.cost.cache.read).toBe(0)
    expect(model.cost.cache.write).toBe(0)
  }),
  {
    config: {
      provider: {
        "test-provider": {
          name: "Test Provider",
          npm: "@ai-sdk/openai-compatible",
          env: [],
          models: { "test-model": { name: "Test Model", tool_call: true, limit: { context: 128000, output: 4096 } } },
          options: { apiKey: "test-key" },
        },
      },
    },
  },
)

it.instance(
  "provider api field sets model api.url",
  Effect.gen(function* () {
    const providers = yield* list
    expect(providers[ProviderV2.ID.make("custom-api")].models["model-1"].api.url).toBe("https://api.example.com/v1")
  }),
  {
    config: {
      provider: {
        "custom-api": {
          name: "Custom API",
          npm: "@ai-sdk/openai-compatible",
          api: "https://api.example.com/v1",
          env: [],
          models: { "model-1": { name: "Model 1", tool_call: true, limit: { context: 8000, output: 2000 } } },
          options: { apiKey: "test-key" },
        },
      },
    },
  },
)

it.instance(
  "explicit baseURL overrides api field",
  Effect.gen(function* () {
    const providers = yield* list
    expect(providers[ProviderV2.ID.make("custom-api")].options.baseURL).toBe("https://custom.override.com/v1")
  }),
  {
    config: {
      provider: {
        "custom-api": {
          name: "Custom API",
          npm: "@ai-sdk/openai-compatible",
          api: "https://api.example.com/v1",
          env: [],
          models: { "model-1": { name: "Model 1", tool_call: true, limit: { context: 8000, output: 2000 } } },
          options: { apiKey: "test-key", baseURL: "https://custom.override.com/v1" },
        },
      },
    },
  },
)

it.instance(
  "model modalities default correctly",
  Effect.gen(function* () {
    const providers = yield* list
    const model = providers[ProviderV2.ID.make("test-provider")].models["test-model"]
    expect(model.capabilities.input.text).toBe(true)
    expect(model.capabilities.output.text).toBe(true)
  }),
  {
    config: {
      provider: {
        "test-provider": {
          name: "Test",
          npm: "@ai-sdk/openai-compatible",
          env: [],
          models: { "test-model": { name: "Test Model", tool_call: true, limit: { context: 8000, output: 2000 } } },
          options: { apiKey: "test" },
        },
      },
    },
  },
)

it.instance(
  "model with custom cost values",
  Effect.gen(function* () {
    const providers = yield* list
    const model = providers[ProviderV2.ID.make("test-provider")].models["test-model"]
    expect(model.cost.input).toBe(5)
    expect(model.cost.output).toBe(15)
    expect(model.cost.cache.read).toBe(2.5)
    expect(model.cost.cache.write).toBe(7.5)
  }),
  {
    config: {
      provider: {
        "test-provider": {
          name: "Test",
          npm: "@ai-sdk/openai-compatible",
          env: [],
          models: {
            "test-model": {
              name: "Test Model",
              tool_call: true,
              limit: { context: 8000, output: 2000 },
              cost: { input: 5, output: 15, cache_read: 2.5, cache_write: 7.5 },
            },
          },
          options: { apiKey: "test" },
        },
      },
    },
  },
)

it.instance(
  "provider with multiple env var options only includes apiKey when single env",
  Effect.gen(function* () {
    yield* set("MULTI_ENV_KEY_1", "test-key")
    const providers = yield* list
    expect(providers[ProviderV2.ID.make("multi-env")]).toBeDefined()
    expect(providers[ProviderV2.ID.make("multi-env")].key).toBeUndefined()
  }),
  {
    config: {
      provider: {
        "multi-env": {
          name: "Multi Env Provider",
          npm: "@ai-sdk/openai-compatible",
          env: ["MULTI_ENV_KEY_1", "MULTI_ENV_KEY_2"],
          models: { "model-1": { name: "Model 1", tool_call: true, limit: { context: 8000, output: 2000 } } },
          options: { baseURL: "https://api.example.com/v1" },
        },
      },
    },
  },
)

it.instance(
  "provider with single env var includes apiKey automatically",
  Effect.gen(function* () {
    yield* set("SINGLE_ENV_KEY", "my-api-key")
    const providers = yield* list
    expect(providers[ProviderV2.ID.make("single-env")]).toBeDefined()
    expect(providers[ProviderV2.ID.make("single-env")].key).toBe("my-api-key")
  }),
  {
    config: {
      provider: {
        "single-env": {
          name: "Single Env Provider",
          npm: "@ai-sdk/openai-compatible",
          env: ["SINGLE_ENV_KEY"],
          models: { "model-1": { name: "Model 1", tool_call: true, limit: { context: 8000, output: 2000 } } },
          options: { baseURL: "https://api.example.com/v1" },
        },
      },
    },
  },
)

it.instance(
  "completely new provider not in database can be configured",
  Effect.gen(function* () {
    const providers = yield* list
    expect(providers[ProviderV2.ID.make("brand-new-provider")]).toBeDefined()
    expect(providers[ProviderV2.ID.make("brand-new-provider")].name).toBe("Brand New")
    const model = providers[ProviderV2.ID.make("brand-new-provider")].models["new-model"]
    expect(model.capabilities.reasoning).toBe(true)
    expect(model.capabilities.attachment).toBe(true)
    expect(model.capabilities.input.image).toBe(true)
  }),
  {
    config: {
      provider: {
        "brand-new-provider": {
          name: "Brand New",
          npm: "@ai-sdk/openai-compatible",
          env: [],
          api: "https://new-api.com/v1",
          models: {
            "new-model": {
              name: "New Model",
              tool_call: true,
              reasoning: true,
              attachment: true,
              temperature: true,
              limit: { context: 32000, output: 8000 },
              modalities: { input: ["text", "image"], output: ["text"] },
            },
          },
          options: { apiKey: "new-key" },
        },
      },
    },
  },
)

it.instance(
  "model with tool_call false",
  Effect.gen(function* () {
    const providers = yield* list
    expect(providers[ProviderV2.ID.make("no-tools")].models["basic-model"].capabilities.toolcall).toBe(false)
  }),
  {
    config: {
      provider: {
        "no-tools": {
          name: "No Tools Provider",
          npm: "@ai-sdk/openai-compatible",
          env: [],
          models: { "basic-model": { name: "Basic Model", tool_call: false, limit: { context: 4000, output: 1000 } } },
          options: { apiKey: "test" },
        },
      },
    },
  },
)

it.instance(
  "model defaults tool_call to true when not specified",
  Effect.gen(function* () {
    const providers = yield* list
    expect(providers[ProviderV2.ID.make("default-tools")].models["model"].capabilities.toolcall).toBe(true)
  }),
  {
    config: {
      provider: {
        "default-tools": {
          name: "Default Tools Provider",
          npm: "@ai-sdk/openai-compatible",
          env: [],
          models: { model: { name: "Model", limit: { context: 4000, output: 1000 } } },
          options: { apiKey: "test" },
        },
      },
    },
  },
)

it.instance(
  "model headers are preserved",
  Effect.gen(function* () {
    const providers = yield* list
    const model = providers[ProviderV2.ID.make("headers-provider")].models["model"]
    expect(model.headers).toEqual({
      "X-Custom-Header": "custom-value",
      Authorization: "Bearer special-token",
    })
  }),
  {
    config: {
      provider: {
        "headers-provider": {
          name: "Headers Provider",
          npm: "@ai-sdk/openai-compatible",
          env: [],
          models: {
            model: {
              name: "Model",
              tool_call: true,
              limit: { context: 4000, output: 1000 },
              headers: { "X-Custom-Header": "custom-value", Authorization: "Bearer special-token" },
            },
          },
          options: { apiKey: "test" },
        },
      },
    },
  },
)

it.instance(
  "provider env fallback - second env var used if first missing",
  Effect.gen(function* () {
    yield* set("FALLBACK_KEY", "fallback-api-key")
    const providers = yield* list
    expect(providers[ProviderV2.ID.make("fallback-env")]).toBeDefined()
  }),
  {
    config: {
      provider: {
        "fallback-env": {
          name: "Fallback Env Provider",
          npm: "@ai-sdk/openai-compatible",
          env: ["PRIMARY_KEY", "FALLBACK_KEY"],
          models: { model: { name: "Model", tool_call: true, limit: { context: 4000, output: 1000 } } },
          options: { baseURL: "https://api.example.com" },
        },
      },
    },
  },
)

it.instance(
  "provider name defaults to id when not in database",
  Effect.gen(function* () {
    const providers = yield* list
    expect(providers[ProviderV2.ID.make("my-custom-id")].name).toBe("my-custom-id")
  }),
  {
    config: {
      provider: {
        "my-custom-id": {
          npm: "@ai-sdk/openai-compatible",
          env: [],
          models: { model: { name: "Model", tool_call: true, limit: { context: 4000, output: 1000 } } },
          options: { apiKey: "test" },
        },
      },
    },
  },
)

it.instance(
  "model limit defaults to zero when not specified",
  Effect.gen(function* () {
    const providers = yield* list
    const model = providers[ProviderV2.ID.make("no-limit")].models["model"]
    expect(model.limit.context).toBe(0)
    expect(model.limit.output).toBe(0)
  }),
  {
    config: {
      provider: {
        "no-limit": {
          name: "No Limit Provider",
          npm: "@ai-sdk/openai-compatible",
          env: [],
          models: { model: { name: "Model", tool_call: true } },
          options: { apiKey: "test" },
        },
      },
    },
  },
)

it.instance(
  "getSmallModel selects the latest model in the preferred family",
  Effect.gen(function* () {
    const model = yield* Provider.use.getSmallModel(ProviderV2.ID.make("test-provider"))
    expect(model?.id).toBe(ModelV2.ID.make("new-flash"))
  }),
  {
    config: {
      provider: {
        "test-provider": {
          name: "Test Provider",
          npm: "@ai-sdk/openai-compatible",
          models: {
            "old-flash": { family: "gemini-flash", release_date: "2025-01-01" },
            "new-flash": { family: "gemini-flash", release_date: "2026-01-01" },
            "newer-haiku": { family: "claude-haiku", release_date: "2026-06-01" },
          },
          options: { apiKey: "test-key" },
        },
      },
    },
  },
)

it.instance(
  "getSmallModel matches exact model families",
  Effect.gen(function* () {
    const model = yield* Provider.use.getSmallModel(ProviderV2.ID.make("test-provider"))
    expect(model?.id).toBe(ModelV2.ID.make("claude-haiku"))
  }),
  {
    config: {
      provider: {
        "test-provider": {
          name: "Test Provider",
          npm: "@ai-sdk/openai-compatible",
          models: {
            "glm-flash": { family: "glm-flash", release_date: "2026-06-01" },
            "claude-haiku": { family: "claude-haiku", release_date: "2026-01-01" },
          },
          options: { apiKey: "test-key" },
        },
      },
    },
  },
)

it.instance(
  "getSmallModel ignores model IDs without family metadata",
  Effect.gen(function* () {
    const model = yield* Provider.use.getSmallModel(ProviderV2.ID.make("test-provider"))
    expect(model).toBeUndefined()
  }),
  {
    config: {
      provider: {
        "test-provider": {
          name: "Test Provider",
          npm: "@ai-sdk/openai-compatible",
          models: {
            "gpt-5-nano": { release_date: "2026-01-01" },
          },
          options: { apiKey: "test-key" },
        },
      },
    },
  },
)

it.instance(
  "custom model with variants enabled and disabled",
  Effect.gen(function* () {
    const providers = yield* list
    const model = providers[ProviderV2.ID.make("custom-reasoning")].models["reasoning-model"]
    expect(model.variants).toBeDefined()
    expect(model.variants!["low"]).toBeDefined()
    expect(model.variants!["low"].reasoningEffort).toBe("low")
    expect(model.variants!["medium"]).toBeDefined()
    expect(model.variants!["medium"].reasoningEffort).toBe("medium")
    expect(model.variants!["custom"]).toBeDefined()
    expect(model.variants!["custom"].reasoningEffort).toBe("custom")
    expect(model.variants!["custom"].budgetTokens).toBe(5000)
    expect(model.variants!["high"]).toBeUndefined()
    expect(model.variants!["low"].disabled).toBeUndefined()
    expect(model.variants!["medium"].disabled).toBeUndefined()
    expect(model.variants!["custom"].disabled).toBeUndefined()
  }),
  {
    config: {
      provider: {
        "custom-reasoning": {
          name: "Custom Reasoning Provider",
          npm: "@ai-sdk/openai-compatible",
          env: [],
          models: {
            "reasoning-model": {
              name: "Reasoning Model",
              tool_call: true,
              reasoning: true,
              limit: { context: 128000, output: 16000 },
              variants: {
                low: { reasoningEffort: "low" },
                medium: { reasoningEffort: "medium" },
                high: { reasoningEffort: "high", disabled: true },
                custom: { reasoningEffort: "custom", budgetTokens: 5000 },
              },
            },
          },
          options: { apiKey: "test-key" },
        },
      },
    },
  },
)

// ---------------------------------------------------------------------------
// Generic provider logic
// ---------------------------------------------------------------------------

it.instance("getModel throws ModelNotFoundError for invalid provider", () =>
  Effect.gen(function* () {
    const exit = yield* Provider.use
      .getModel(ProviderV2.ID.make("nonexistent-provider"), ModelV2.ID.make("some-model"))
      .pipe(Effect.exit)
    expect(exit._tag).toBe("Failure")
  }),
)

it.instance("closest returns undefined for nonexistent provider", () =>
  Effect.gen(function* () {
    const result = yield* Provider.use.closest(ProviderV2.ID.make("nonexistent"), ["model"])
    expect(result).toBeUndefined()
  }),
)

it.instance("getProvider returns undefined for nonexistent provider", () =>
  Effect.gen(function* () {
    const provider = yield* Provider.Service.use((svc) => svc.getProvider(ProviderV2.ID.make("nonexistent")))
    expect(provider).toBeUndefined()
  }),
)

it.instance("defaultModel returns a typed error when config excludes every provider", () =>
  Effect.gen(function* () {
    const error = yield* Provider.use.defaultModel().pipe(Effect.flip)
    expect(error).toBeInstanceOf(Provider.NoProvidersError)
    expect(error._tag).toBe("ProviderNoProvidersError")
  }),
  { config: { enabled_providers: [] } },
)

it.instance("enabled_providers with empty array allows no providers", () =>
  Effect.gen(function* () {
    yield* set("OLLAMA_API_KEY", "test-ollama-key")
    const providers = yield* list
    expect(Object.keys(providers).length).toBe(0)
  }),
  { config: { enabled_providers: [] } },
)

it.instance("ModelNotFoundError includes suggestions for typos", () =>
  Effect.gen(function* () {
    yield* set("OLLAMA_API_KEY", "test-ollama-key")
    const error = yield* Provider.use
      .getModel(OLLAMA_CLOUD, ModelV2.ID.make("deepseek-v4-flas"))
      .pipe(Effect.flip)
    expect(error.suggestions).toBeDefined()
    expect((error.suggestions ?? []).length).toBeGreaterThan(0)
    expect(error.message).toContain("Model not found: ollama-cloud/deepseek-v4-flas")
    expect(error.message).toContain("Did you mean:")
  }),
)

it.instance("ModelNotFoundError for provider includes suggestions", () =>
  Effect.gen(function* () {
    yield* set("OLLAMA_API_KEY", "test-ollama-key")
    const error = yield* Provider.use
      .getModel(ProviderV2.ID.make("ollama-clou"), ModelV2.ID.make("deepseek-v4-flash"))
      .pipe(Effect.flip)
    expect(error.suggestions).toBeDefined()
    expect(error.suggestions).toContain("ollama-cloud")
  }),
)

// Pure synchronous unit tests — no Effect runtime needed.

test("parseModel correctly parses provider/model string", () => {
  const result = Provider.parseModel("ollama-cloud/deepseek-v4-flash")
  expect(String(result.providerID)).toBe("ollama-cloud")
  expect(String(result.modelID)).toBe("deepseek-v4-flash")
})

test("parseModel handles model IDs with slashes", () => {
  const result = Provider.parseModel("custom/anthropic/claude-3-opus")
  expect(String(result.providerID)).toBe("custom")
  expect(String(result.modelID)).toBe("anthropic/claude-3-opus")
})

test("provider.sort prioritizes preferred models", () => {
  const models = [
    { id: "random-model", name: "Random" },
    { id: "claude-sonnet-4-latest", name: "Claude Sonnet 4" },
    { id: "gpt-5-turbo", name: "GPT-5 Turbo" },
    { id: "other-model", name: "Other" },
  ] as any[]

  const sorted = Provider.sort(models)
  expect(sorted[0].id).toContain("sonnet-4")
  expect(sorted[0].id).toContain("latest")
  expect(sorted[sorted.length - 1].id).not.toContain("gpt-5")
  expect(sorted[sorted.length - 1].id).not.toContain("sonnet-4")
})

test("models.dev normalization fills required response fields", () => {
  const provider = {
    id: "gateway",
    name: "Gateway",
    env: [],
    models: {
      "gpt-5.4": {
        id: "gpt-5.4",
        name: "GPT-5.4",
        family: "gpt",
        interleaved: "reasoning_text",
        cost: { input: 2.5, output: 15 },
        limit: { context: 1_050_000, input: 922_000, output: 128_000 },
      },
    },
  } as unknown as ModelsDev.Provider

  const model = Provider.fromModelsDevProvider(provider).models["gpt-5.4"]
  expect(model.api.url).toBe("")
  expect(model.capabilities.temperature).toBe(false)
  expect(model.capabilities.reasoning).toBe(false)
  expect(model.capabilities.attachment).toBe(false)
  expect(model.capabilities.toolcall).toBe(true)
  expect(model.capabilities.interleaved).toEqual({ field: "reasoning_text" })
  expect(model.release_date).toBe("")
})

test("public provider info omits invalid models", () => {
  const provider = Provider.fromModelsDevProvider({
    id: "test",
    name: "Test",
    env: [],
    models: {
      valid: {
        id: "valid",
        name: "Valid",
        cost: { input: 1, output: 1 },
        limit: { context: 128_000, output: 16_000 },
      },
    },
  } as unknown as ModelsDev.Provider)
  provider.models.invalid = {
    ...provider.models.valid,
    id: ModelV2.ID.make("invalid"),
    cost: { ...provider.models.valid.cost, input: Number.NaN },
  }

  const result = Provider.toPublicInfo(provider)

  expect(result.models.valid).toBeDefined()
  expect(result.models.invalid).toBeUndefined()
})

// ---------------------------------------------------------------------------
// Plugin config flows (scoped tmpdir + provideInstance)
// ---------------------------------------------------------------------------

const instanceStoreLayer = LayerNode.compile(InstanceStore.node, [
  [InstanceStore.bootstrapNode, InstanceBootstrap.node],
])
const provideMultiInstance = <A, E, R>(eff: Effect.Effect<A, E, R>) =>
  eff.pipe(Effect.provide(instanceStoreLayer), Effect.provide(AppNodeBuilder.build(CrossSpawnSpawner.node)))

it.effect("plugin config providers persist after instance dispose", () =>
  Effect.gen(function* () {
    const dir = yield* tmpdirScoped()
    const configDir = path.join(dir, ".boros")
    const root = path.join(configDir, "plugin")
    yield* Effect.promise(() => mkdir(root, { recursive: true }))
    yield* Effect.promise(() => markPluginDependenciesReady(configDir))
    yield* Effect.promise(() => markPluginDependenciesReady(Global.Path.config))
    yield* Effect.promise(() =>
      Bun.write(
        path.join(root, "demo-provider.ts"),
        [
          "export default {",
          '  id: "demo.plugin-provider",',
          "  server: async () => ({",
          "    async config(cfg) {",
          "      cfg.provider ??= {}",
          "      cfg.provider.demo = {",
          '        name: "Demo Provider",',
          '        npm: "@ai-sdk/openai-compatible",',
          '        api: "https://example.com/v1",',
          "        models: {",
          "          chat: {",
          '            name: "Demo Chat",',
          "            tool_call: true,",
          "            limit: { context: 128000, output: 4096 },",
          "          },",
          "        },",
          "      }",
          "    },",
          "  }),",
          "}",
          "",
        ].join("\n"),
      ),
    )

    const loadAndList = Effect.gen(function* () {
      const plugin = yield* Plugin.Service
      const provider = yield* Provider.Service
      yield* plugin.init()
      return yield* provider.list()
    }).pipe(provideInstanceEffect(dir))

    const first = yield* loadAndList
    expect(first[ProviderV2.ID.make("demo")]).toBeDefined()
    expect(first[ProviderV2.ID.make("demo")].models[ModelV2.ID.make("chat")]).toBeDefined()

    yield* Effect.promise(() => disposeAllInstances())

    const second = yield* loadAndList
    expect(second[ProviderV2.ID.make("demo")]).toBeDefined()
    expect(second[ProviderV2.ID.make("demo")].models[ModelV2.ID.make("chat")]).toBeDefined()
  }).pipe(provideMultiInstance),
)

it.instance(
  "plugin config enabled and disabled providers are honored",
  Effect.gen(function* () {
    const instance = yield* TestInstance
    const configDir = path.join(instance.directory, ".boros")
    const root = path.join(configDir, "plugin")
    yield* Effect.promise(() => mkdir(root, { recursive: true }))
    yield* Effect.promise(() => markPluginDependenciesReady(configDir))
    yield* Effect.promise(() =>
      Bun.write(
        path.join(root, "provider-filter.ts"),
        [
          "export default {",
          '  id: "demo.provider-filter",',
          "  server: async () => ({",
          "    async config(cfg) {",
          '      cfg.enabled_providers = ["ollama-cloud"]',
          '      cfg.disabled_providers = []',
          "    },",
          "  }),",
          "}",
          "",
        ].join("\n"),
      ),
    )

    yield* set("OLLAMA_API_KEY", "test-ollama-key")
    const providers = yield* list
    expect(providers[OLLAMA_CLOUD]).toBeDefined()
  }),
)