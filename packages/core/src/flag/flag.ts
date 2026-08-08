import { Config } from "effect"

export function truthy(key: string) {
  const value = process.env[key]?.toLowerCase()
  return value === "true" || value === "1"
}

const copy = process.env["BOROS_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"] ?? process.env["OPENCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"]
const fff = process.env["BOROS_DISABLE_FFF"] ?? process.env["OPENCODE_DISABLE_FFF"]

function enabledByExperimental(key: string, legacyKey: string) {
  const value = process.env[key] ?? process.env[legacyKey]
  return value === undefined ? truthy("BOROS_EXPERIMENTAL") || truthy("OPENCODE_EXPERIMENTAL") : truthy(key) || truthy(legacyKey)
}

function env(borosKey: string, legacyKey: string): string | undefined {
  return process.env[borosKey] ?? process.env[legacyKey]
}

export const Flag = {
  OTEL_EXPORTER_OTLP_ENDPOINT: process.env["OTEL_EXPORTER_OTLP_ENDPOINT"],
  OTEL_EXPORTER_OTLP_HEADERS: process.env["OTEL_EXPORTER_OTLP_HEADERS"],

  BOROS_AUTO_HEAP_SNAPSHOT: truthy("BOROS_AUTO_HEAP_SNAPSHOT") || truthy("OPENCODE_AUTO_HEAP_SNAPSHOT"),
  BOROS_GIT_BASH_PATH: env("BOROS_GIT_BASH_PATH", "OPENCODE_GIT_BASH_PATH"),
  BOROS_CONFIG: env("BOROS_CONFIG", "OPENCODE_CONFIG"),
  BOROS_CONFIG_CONTENT: env("BOROS_CONFIG_CONTENT", "OPENCODE_CONFIG_CONTENT"),
  BOROS_DISABLE_AUTOUPDATE: truthy("BOROS_DISABLE_AUTOUPDATE") || truthy("OPENCODE_DISABLE_AUTOUPDATE"),
  BOROS_ALWAYS_NOTIFY_UPDATE: truthy("BOROS_ALWAYS_NOTIFY_UPDATE") || truthy("OPENCODE_ALWAYS_NOTIFY_UPDATE"),
  BOROS_DISABLE_PRUNE: truthy("BOROS_DISABLE_PRUNE") || truthy("OPENCODE_DISABLE_PRUNE"),
  BOROS_DISABLE_TERMINAL_TITLE: truthy("BOROS_DISABLE_TERMINAL_TITLE") || truthy("OPENCODE_DISABLE_TERMINAL_TITLE"),
  BOROS_SHOW_TTFD: truthy("BOROS_SHOW_TTFD") || truthy("OPENCODE_SHOW_TTFD"),
  BOROS_DISABLE_AUTOCOMPACT: truthy("BOROS_DISABLE_AUTOCOMPACT") || truthy("OPENCODE_DISABLE_AUTOCOMPACT"),
  BOROS_DISABLE_MODELS_FETCH: truthy("BOROS_DISABLE_MODELS_FETCH") || truthy("OPENCODE_DISABLE_MODELS_FETCH"),
  BOROS_DISABLE_MOUSE: truthy("BOROS_DISABLE_MOUSE") || truthy("OPENCODE_DISABLE_MOUSE"),
  BOROS_FAKE_VCS: env("BOROS_FAKE_VCS", "OPENCODE_FAKE_VCS"),
  BOROS_SERVER_PASSWORD: env("BOROS_SERVER_PASSWORD", "OPENCODE_SERVER_PASSWORD"),
  BOROS_SERVER_USERNAME: env("BOROS_SERVER_USERNAME", "OPENCODE_SERVER_USERNAME"),
  BOROS_DISABLE_FFF: fff === undefined ? process.platform === "win32" : truthy("BOROS_DISABLE_FFF") || truthy("OPENCODE_DISABLE_FFF"),

  // Experimental
  BOROS_EXPERIMENTAL_FILEWATCHER: Config.boolean("BOROS_EXPERIMENTAL_FILEWATCHER").pipe(
    Config.withDefault(false),
  ),
  BOROS_EXPERIMENTAL_DISABLE_FILEWATCHER: Config.boolean("BOROS_EXPERIMENTAL_DISABLE_FILEWATCHER").pipe(
    Config.withDefault(false),
  ),
  BOROS_EXPERIMENTAL_DISABLE_COPY_ON_SELECT:
    copy === undefined ? process.platform === "win32" : truthy("BOROS_EXPERIMENTAL_DISABLE_COPY_ON_SELECT") || truthy("OPENCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"),
  BOROS_MODELS_URL: env("BOROS_MODELS_URL", "OPENCODE_MODELS_URL"),
  BOROS_MODELS_PATH: env("BOROS_MODELS_PATH", "OPENCODE_MODELS_PATH"),
  BOROS_DB: env("BOROS_DB", "OPENCODE_DB"),

  BOROS_WORKSPACE_ID: env("BOROS_WORKSPACE_ID", "OPENCODE_WORKSPACE_ID"),
  BOROS_EXPERIMENTAL_WORKSPACES: enabledByExperimental("BOROS_EXPERIMENTAL_WORKSPACES", "OPENCODE_EXPERIMENTAL_WORKSPACES"),

  // Evaluated at access time (not module load) because tests, the CLI, and
  // external tooling set these env vars at runtime.
  get BOROS_DISABLE_PROJECT_CONFIG() {
    return truthy("BOROS_DISABLE_PROJECT_CONFIG") || truthy("OPENCODE_DISABLE_PROJECT_CONFIG")
  },
  get BOROS_EXPERIMENTAL_REFERENCES() {
    return enabledByExperimental("BOROS_EXPERIMENTAL_REFERENCES", "OPENCODE_EXPERIMENTAL_REFERENCES")
  },
  get BOROS_TUI_CONFIG() {
    return env("BOROS_TUI_CONFIG", "OPENCODE_TUI_CONFIG")
  },
  get BOROS_CONFIG_DIR() {
    return env("BOROS_CONFIG_DIR", "OPENCODE_CONFIG_DIR")
  },
  get BOROS_PURE() {
    return truthy("BOROS_PURE") || truthy("OPENCODE_PURE")
  },
  get BOROS_PERMISSION() {
    return env("BOROS_PERMISSION", "OPENCODE_PERMISSION")
  },
  get BOROS_PLUGIN_META_FILE() {
    return env("BOROS_PLUGIN_META_FILE", "OPENCODE_PLUGIN_META_FILE")
  },
  get BOROS_CLIENT() {
    return env("BOROS_CLIENT", "OPENCODE_CLIENT") ?? "cli"
  },
}
