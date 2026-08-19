import { Config, ConfigProvider, Context, Effect, Layer, Option } from "effect"
import { ConfigService } from "@/effect/config-service"

const legacy = (name: string) => `OPENCODE_${name.replace("BOROS_", "")}`
const bool = (name: string) =>
  Config.boolean(name).pipe(
    Config.orElse(() => Config.boolean(legacy(name))),
    Config.withDefault(false),
  )
const positiveInteger = (name: string) =>
  Config.number(name).pipe(
    Config.map(sanitizePositiveInteger),
    Config.orElse(() => Config.number(legacy(name)).pipe(Config.map(sanitizePositiveInteger))),
    Config.orElse(() => Config.succeed(undefined)),
  )
const sanitizePositiveInteger = (value: number) =>
  Number.isInteger(value) && value > 0 ? value : undefined
const experimental = bool("BOROS_EXPERIMENTAL")
const enabledByExperimental = (name: string) =>
  Config.all({
    experimental,
    enabled: Config.boolean(name).pipe(Config.option),
    legacyEnabled: Config.boolean(legacy(name)).pipe(Config.option),
  }).pipe(
    Config.map((flags) =>
      Option.orElse(flags.enabled, () => flags.legacyEnabled).pipe(Option.getOrElse(() => flags.experimental)),
    ),
  )

export class Service extends ConfigService.Service<Service>()("@boros/RuntimeFlags", {
  autoShare: bool("BOROS_AUTO_SHARE"),
  pure: bool("BOROS_PURE"),
  disableDefaultPlugins: bool("BOROS_DISABLE_DEFAULT_PLUGINS"),
  disableEmbeddedWebUi: bool("BOROS_DISABLE_EMBEDDED_WEB_UI"),
  disableExternalSkills: bool("BOROS_DISABLE_EXTERNAL_SKILLS"),
  disableLspDownload: bool("BOROS_DISABLE_LSP_DOWNLOAD"),
  disableClaudeCodePrompt: Config.all({
    broad: bool("BOROS_DISABLE_CLAUDE_CODE"),
    direct: bool("BOROS_DISABLE_CLAUDE_CODE_PROMPT"),
  }).pipe(Config.map((flags) => flags.broad || flags.direct)),
  disableClaudeCodeSkills: Config.all({
    broad: bool("BOROS_DISABLE_CLAUDE_CODE"),
    direct: bool("BOROS_DISABLE_CLAUDE_CODE_SKILLS"),
  }).pipe(Config.map((flags) => flags.broad || flags.direct)),
  enableExa: Config.all({
    experimental,
    enabled: bool("BOROS_ENABLE_EXA"),
    legacy: bool("BOROS_EXPERIMENTAL_EXA"),
  }).pipe(Config.map((flags) => flags.experimental || flags.enabled || flags.legacy)),
  enableParallel: Config.all({
    enabled: bool("BOROS_ENABLE_PARALLEL"),
    legacy: bool("BOROS_EXPERIMENTAL_PARALLEL"),
  }).pipe(Config.map((flags) => flags.enabled || flags.legacy)),
  enableExperimentalModels: bool("BOROS_ENABLE_EXPERIMENTAL_MODELS"),
  enableQuestionTool: bool("BOROS_ENABLE_QUESTION_TOOL"),
  experimentalReferences: enabledByExperimental("BOROS_EXPERIMENTAL_REFERENCES"),
  experimentalBackgroundSubagents: enabledByExperimental("BOROS_EXPERIMENTAL_BACKGROUND_SUBAGENTS"),
  experimentalLspTy: bool("BOROS_EXPERIMENTAL_LSP_TY"),
  experimentalLspTool: enabledByExperimental("BOROS_EXPERIMENTAL_LSP_TOOL"),
  experimentalOxfmt: enabledByExperimental("BOROS_EXPERIMENTAL_OXFMT"),
  experimentalPlanMode: enabledByExperimental("BOROS_EXPERIMENTAL_PLAN_MODE"),
  experimentalCodeMode: enabledByExperimental("BOROS_EXPERIMENTAL_CODE_MODE"),
  experimentalEventSystem: enabledByExperimental("BOROS_EXPERIMENTAL_EVENT_SYSTEM"),
  experimentalWorkspaces: enabledByExperimental("BOROS_EXPERIMENTAL_WORKSPACES"),
  experimentalIconDiscovery: enabledByExperimental("BOROS_EXPERIMENTAL_ICON_DISCOVERY"),
  outputTokenMax: positiveInteger("BOROS_EXPERIMENTAL_OUTPUT_TOKEN_MAX"),
  bashDefaultTimeoutMs: positiveInteger("BOROS_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS"),
  experimentalNativeLlm: bool("BOROS_EXPERIMENTAL_NATIVE_LLM"),
  experimentalWebSockets: bool("BOROS_EXPERIMENTAL_WEBSOCKETS"),
  client: Config.string("BOROS_CLIENT").pipe(
    Config.orElse(() => Config.string("OPENCODE_CLIENT")),
    Config.withDefault("cli"),
  ),
}) {}

export type Info = Context.Service.Shape<typeof Service>

const emptyConfigLayer = Service.layer.pipe(
  Layer.provide(ConfigProvider.layer(ConfigProvider.fromUnknown({}))),
  Layer.orDie,
)

export const layer = (overrides: Partial<Info> = {}) =>
  Layer.effect(
    Service,
    Effect.gen(function* () {
      const flags = yield* Service
      return Service.of({ ...flags, ...overrides })
    }),
  ).pipe(Layer.provide(emptyConfigLayer))

export const node = LayerNode.make({ service: Service, layer: Service.layer.pipe(Layer.orDie), deps: [] })

export * as RuntimeFlags from "./runtime-flags"
import { LayerNode } from "@boros-ai/core/effect/layer-node"
