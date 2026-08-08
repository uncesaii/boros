/// <reference path="../markdown.d.ts" />

export * as SkillPlugin from "./skill"

import { define } from "./internal"
import { Effect } from "effect"
import { AbsolutePath } from "../schema"
import { SkillV2 } from "../skill"
import customizeBorosContent from "./skill/customize-boros.md" with { type: "text" }
import { BOROS_SKILLS } from "./skill/boros/boros-skills"

export const CustomizeBorosContent = customizeBorosContent

export const Plugin = define({
  id: "skill",
  effect: Effect.fn(function* (ctx) {
    yield* ctx.skill.transform((draft) => {
      draft.source(
        SkillV2.EmbeddedSource.make({
          type: "embedded",
          skill: SkillV2.Info.make({
            name: "customize-boros",
            description:
              "Use ONLY when the user is editing or creating Boros' own configuration: boros.json, boros.jsonc, files under .boros/, or files under ~/.config/boros/. Also use when creating or fixing Boros agents, subagents, commands, skills, plugins, MCP servers, or permission rules. Do not use for the user's own application code, or for any project that is not configuring Boros itself.",
            location: AbsolutePath.make("/builtin/customize-boros.md"),
            content: CustomizeBorosContent,
          }),
        }),
      )

      for (const skill of BOROS_SKILLS) {
        draft.source(
          SkillV2.EmbeddedSource.make({
            type: "embedded",
            skill,
          }),
        )
      }
    })
  }),
})
