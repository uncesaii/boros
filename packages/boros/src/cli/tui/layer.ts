import { run as runTui, type TuiInput } from "@boros-ai/tui"
import { Global } from "@boros-ai/core/global"
import { AppNodeBuilder } from "@boros-ai/core/effect/app-node-builder"
import { Effect } from "effect"

export function run(input: TuiInput) {
  return runTui(input).pipe(Effect.provide(AppNodeBuilder.build(Global.node)))
}
