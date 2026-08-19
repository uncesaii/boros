import { AgentV2 } from "@boros-ai/core/agent"
import { AISDK } from "@boros-ai/core/aisdk"
import { Catalog } from "@boros-ai/core/catalog"
import { CommandV2 } from "@boros-ai/core/command"
import { Credential } from "@boros-ai/core/credential"
import { AppNodeBuilder } from "@boros-ai/core/effect/app-node-builder"
import { LayerNodePlatform } from "@boros-ai/core/effect/app-node-platform"
import { LayerNode } from "@boros-ai/core/effect/layer-node"
import { EventV2 } from "@boros-ai/core/event"
import { FileSystem } from "@boros-ai/core/filesystem"
import { FSUtil } from "@boros-ai/core/fs-util"
import { Integration } from "@boros-ai/core/integration"
import { Location } from "@boros-ai/core/location"
import { Npm } from "@boros-ai/core/npm"
import { PluginV2 } from "@boros-ai/core/plugin"
import { Reference } from "@boros-ai/core/reference"
import { SkillV2 } from "@boros-ai/core/skill"
import { Effect, Layer } from "effect"
import { tempLocationLayer } from "../fixture/location"

const npmLayer = Layer.succeed(
  Npm.Service,
  Npm.Service.of({
    add: () => Effect.succeed({ directory: "", entrypoint: undefined }),
    install: () => Effect.void,
    which: () => Effect.succeed(undefined),
  }),
)

export const PluginTestLayer = AppNodeBuilder.build(
  LayerNode.group([
    FileSystem.node,
    FSUtil.node,
    Location.node,
    Npm.node,
    Credential.node,
    EventV2.node,
    LayerNodePlatform.httpClient,
    PluginV2.node,
    AgentV2.node,
    AISDK.node,
    Catalog.node,
    CommandV2.node,
    Integration.node,
    Reference.node,
    SkillV2.node,
  ]),
  [
    [Location.node, tempLocationLayer],
    [Npm.node, npmLayer],
  ],
)
