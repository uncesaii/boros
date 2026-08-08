declare global {
  const BOROS_VERSION: string
  const BOROS_CHANNEL: string
}

export const InstallationVersion = typeof BOROS_VERSION === "string" ? BOROS_VERSION : "local"
export const InstallationChannel = typeof BOROS_CHANNEL === "string" ? BOROS_CHANNEL : "local"
export const InstallationLocal = InstallationChannel === "local"
