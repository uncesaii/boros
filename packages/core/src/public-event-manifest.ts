export * as PublicEventManifest from "./public-event-manifest"

import { Event } from "@boros-ai/schema/event"
import { EventManifest } from "@boros-ai/schema/event-manifest"

export const Definitions = EventManifest.ServerDefinitions
export const Latest = Event.latest(Definitions)
