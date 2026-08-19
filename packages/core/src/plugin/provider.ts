import { CustomProviderPlugin } from "./provider/custom"
import { DynamicProviderPlugin } from "./provider/dynamic"
import { OllamaPlugin } from "./provider/ollama"
import { OpenAICompatiblePlugin } from "./provider/openai-compatible"
import type { PluginInternal } from "./internal"
import type { Scope } from "effect"

// Boros ships a minimal provider surface: local Ollama, Ollama Cloud (via the
// models.dev catalog), and any custom OpenAI-compatible endpoint. Anything
// else is reachable through the dynamic provider (an arbitrary @ai-sdk package
// chosen in the TUI).
export const ProviderPlugins: PluginInternal.Plugin<PluginInternal.Requirements | Scope.Scope>[] = [
  OllamaPlugin,
  CustomProviderPlugin,
  OpenAICompatiblePlugin,
  DynamicProviderPlugin,
]
