# Boros

These instructions apply to coding agents (Codex, the Boros agent, and others)
working in this repository. Keep them durable, repo-scoped, and free of
volatile business metrics.

Boros is a production-grade, terminal-native offensive-security agent swarm. It
is built on the OpenCode terminal AI shell (base: anomalyco/opencode), which
provides the TUI, install/auto-update pipeline, and CI/CD, and adds a native
agent swarm purpose-built for offensive security operations.

**What this is:** a single binary (`boros`) that runs an autonomous red-team
swarm in your terminal. It ships a root doctrine agent plus specialist
subagents (recon, exploit, privesc, web, triage, assistant) and a large library
of offensive-security skills. Bare `boros` = the full swarm doctrine; no
configuration required.

**Goal:** a self-orchestrating offensive-security agent that can run a full
engagement — reconnaissance, exploitation, privilege escalation, web-target
triage — autonomously, with every step human-reviewable in the terminal.

- The core is Effect v4 (`effect` catalog), with the package graph directed
  Schema → Core → Protocol → Server; the CLI lives in `packages/opencode`.
- CI gates every change: `bun typecheck`, `bun turbo test`, and a build smoke
  via `ci.yml`; releases are tag-driven (`v*` → native binaries for 12
  platforms + npm publishing).
- The runtime intentionally preserves all real provider `/model` and
  `/connect` behavior from the OpenCode base; only the OpenCode rate-limit
  upsell paths are stripped.

- To regenerate the legacy JavaScript SDK, run `./packages/sdk/js/script/build.ts`.
- After changing the public Protocol or Server `HttpApi`, run `bun run generate` from `packages/client`. Do not edit `src/generated` or `src/generated-effect` directly.
- Keep runtime dependencies directed from Schema to Core and Protocol, then from Core and Protocol to Server. Client runtime code may depend on Schema and Protocol but never Core or Server; `sdk-next` composes Client, Core, and Server.
- The default branch in this repo is `dev`.
- Local `main` ref may not exist; use `dev` or `origin/dev` for diffs.

## Worktree Dependencies

Each checkout or worktree must have its own `node_modules` links. Never copy,
move, or manually link an installed `node_modules` tree between the main
checkout and another worktree. Sharing bun's global module cache is safe;
sharing the installed dependency tree is not.

After creating a worktree, install its dependencies with
`bun install --frozen-lockfile`. If a checkout reports missing or stale links,
repair it with `bun install --force --frozen-lockfile` before running
development commands.

## Product Direction

Boros is primarily built for individual security practitioners: bug bounty
hunters, solo pentesters, red-teamers, students, and technical builders who want
practical AI-assisted offensive-security workflows. Teams and enterprise
deployments exist, but they are a secondary surface; do not optimize product
decisions, copy, onboarding, or UI around enterprise procurement, compliance
checklists, or admin-heavy workflows unless the task explicitly asks for it.

When working on product, onboarding, agent behavior, or UX, optimize first for
fast solo-user activation: run-bare engagement flow, agent-mode clarity, local
terminal setup, skill discoverability, cost clarity, and trust-through-
transparency over enterprise sales language.

Security and trust work should be candid about current capabilities: public
source code, sandbox boundaries, subprocessors, data deletion, account
security, and any missing formal certifications. Do not imply enterprise-grade
compliance, managed security guarantees, or organizational trust claims unless
they are already implemented and documented. Boros is an offensive-security
tool; document impact honestly and never overstate its guarantees.

For business, analytics, reliability, or production-regression questions, check
the codebase docs and instrumentation first. Avoid hard-coding current revenue,
user counts, pricing, or other volatile metrics in durable instructions; use
qualitative direction and source-of-truth references instead.

## Feature Rollouts and Measurement

For meaningful user-facing features or behavior changes, consider a staged
rollout so the release can be evaluated. Good candidates include new workflows,
changed defaults, onboarding changes, costly Agent behavior, operationally
risky behavior, and UX changes with uncertain impact. Do not require a flag for
every change: routine refactors, minor polish, and correctness or security fixes
that should reach everyone immediately are not flag candidates.

Before implementing a staged rollout, record in the owning issue the
hypothesis, eligible population, primary success metric, guardrail metrics,
rollback condition, owner, and readout date. Start with an explicit allowlist,
then ramp gradually. Assignment must be deterministic and stable.

Shipping the implementation does not complete the rollout. Review the readout
before expanding, removing the gate, or calling the rollout complete. Every
rollout needs an owner and cleanup plan so stale gates do not accumulate.

## Branch Names

Use a short branch name of at most three words, separated by hyphens. Do not use slashes or type prefixes such as `feat/` or `fix/`.

Examples: `session-recovery`, `fix-scroll-state`, `regenerate-sdk`.

## Commits and PR Titles

Use conventional commit-style messages and PR titles: `type(scope): summary`.

Valid types are `feat`, `fix`, `docs`, `chore`, `refactor`, and `test`. Scopes are optional; use the affected package or area when helpful, e.g. `core`, `opencode`, `tui`, `app`, `desktop`, `sdk`, or `plugin`.

Examples: `fix(tui): simplify thinking toggle styling`, `docs: update contributing guide`, `chore(sdk): regenerate types`.

## Pull Request Review Workflow

When a PR has been pushed and is ready for review, do not send the final
completion message until CI and CodeRabbit are complete.

Use this wait pattern:

- Poll once within 30-60 seconds after PR creation to confirm checks started.
- While CI checks are active, poll every 2-3 minutes.
- When only CodeRabbit remains, poll every 3-5 minutes.
- Treat 12-15 minutes as normal CodeRabbit runtime before calling it delayed.
- If the user asks for status, report briefly, then continue waiting unless told
  to stop.

After CodeRabbit finishes:

1. Check PR checks, CodeRabbit review status, review comments, review threads,
   and issue comments.
2. Treat every CodeRabbit suggestion as a hypothesis, not automatically correct.
3. For each actionable comment:
   - If valid, fix it with the smallest appropriate change, commit, push, and
     wait for checks/CodeRabbit again.
   - If false positive or not applicable, leave a brief PR reply explaining why
     no change is needed.
   - If it is a nit, fix it when low-risk and useful; otherwise explain why it
     was skipped.
4. Repeat until CodeRabbit is complete and there are no unresolved valid
   actionable comments.

Only finish when:

- The PR is not draft.
- The branch is pushed.
- The local worktree is clean.
- Required CI checks are passing.
- CodeRabbit is complete.
- Valid CodeRabbit comments are fixed or explicitly answered.
- Visual verification is done when the PR has meaningful UI/user-visible impact.
- Manual verification steps are included when the PR is user-facing, risky,
  important, or needs human validation.
- The only remaining blocker is human review, merge approval, or the listed
  manual verification.

## Thread Coordination

Agents can use separate threads for independent work when that improves
execution, review, or verification.

Consider a separate thread when the work has a clear boundary, such as:

- a distinct feature or bug that should become its own PR;
- broad or high-risk visual QA worth an independent pass;
- a long investigation that can run while implementation or PR checks continue;
- a validation or follow-up task that does not need the current thread's full
  context.

Keep work in the current thread when it is one PR, a tightly coupled refactor, a
small follow-up, overlapping file edits, or depends heavily on context from the
current conversation.

When creating or handing off a thread, include a compact brief with: objective,
repo/worktree/branch, relevant files or PR, constraints, what not to change,
required verification, expected deliverable, and how results should be reported
back.

For multi-PR work, split threads only when each PR can be reviewed and merged
independently. Keep one parent thread responsible for coordinating scope,
avoiding overlap, and integrating results.

## Visual Verification

Use visual verification in the same PR thread by default when the PR changes
the terminal TUI, chat message rendering, file/image display, onboarding,
frontend routes/components, or prompt behavior that creates a meaningful
user-visible result.

Do not require visual checks for backend-only, test-only, prompt-only, CI,
logging, or non-visual agent orchestration changes unless there is a plausible
user-facing impact.

Create a separate visual QA thread only for broad or high-risk UI changes where
independent review is worth the handoff cost, such as multi-screen flows, many
responsive states, or a full visual polish pass. For the TUI, capture output
with `tmux capture-pane` as described in `packages/opencode/AGENTS.md`.

## Manual Verification Notes

After checks and CodeRabbit are complete, include short manual verification
steps when the PR is user-facing, risky, important, or cannot be fully validated
by tests.

Use this for changes involving auth/account security, agent or swarm behavior,
local terminal connections, file operations, browser automation, important
prompt behavior, install/update pipelines, or major UI flows.

Manual steps should say:

- Where to test.
- What to do.
- What should happen.

If manual verification is not needed, say automated validation was sufficient.

## Style Guide

### General Principles

- Keep things in one function unless composable or reusable
- Do not extract single-use helpers preemptively. Inline the logic at the call site unless the helper is reused, hides a genuinely complex boundary, or has a clear independent name that improves the caller.
- Avoid `try`/`catch` where possible
- Avoid using the `any` type
- Use Bun APIs when possible, like `Bun.file()`
- Rely on type inference when possible; avoid explicit type annotations or interfaces unless necessary for exports or clarity
- Prefer functional array methods (flatMap, filter, map) over for loops; use type guards on filter to maintain type inference downstream
- In `src/config`, follow the existing self-export pattern at the top of the file (for example `export * as ConfigAgent from "./agent"`) when adding a new config module.
- In Effect generators, bind services to named variables before calling methods. Do not use nested service yields such as `yield* (yield* Foo.Service).bar()`.

Reduce total variable count by inlining when a value is only used once.

```ts
// Good
const journal = await Bun.file(path.join(dir, "journal.json")).json()

// Bad
const journalPath = path.join(dir, "journal.json")
const journal = await Bun.file(journalPath).json()
```

### Destructuring

Avoid unnecessary destructuring. Use dot notation to preserve context.

```ts
// Good
obj.a
obj.b

// Bad
const { a, b } = obj
```

### Imports

- Never alias imports. Do not use `import { foo as bar } from "..."` or renamed imports like `resolve as pathResolve`.
- Never use star imports. Do not use `import * as Foo from "..."` or `import type * as Foo from "..."`.
- If a namespace-style value is needed, import the module's own exported namespace by name, for example `import { Project } from "@opencode-ai/core/project"`, then reference `Project.ID`.
- Prefer dynamic imports for heavy modules that are only needed in selected code paths, especially in startup-sensitive entrypoints. Destructure dynamic import bindings near the top of the narrowest scope that needs them so they read like normal imports. Avoid inline chains such as `await import("./module").then((mod) => mod.value())` or `(await import("./module")).value()`. Keep branch-specific imports inside the branch that needs them to preserve lazy loading.

### Variables

Prefer `const` over `let`. Use ternaries or early returns instead of reassignment.

```ts
// Good
const foo = condition ? 1 : 2

// Bad
let foo
if (condition) foo = 1
else foo = 2
```

### Control Flow

Avoid `else` statements. Prefer early returns.

```ts
// Good
function foo() {
  if (condition) return 1
  return 2
}

// Bad
function foo() {
  if (condition) return 1
  else return 2
}
```

### Complex Logic

When a function has several validation branches or supporting details, make the main function read as the happy path and move supporting details into small helpers below it.

```ts
// Good
export function loadThing(input: unknown) {
  const config = requireConfig(input)
  const metadata = readMetadata(input)
  return createThing({ config, metadata })
}

function requireConfig(input: unknown) {
  ...
}
```

- Keep helpers close to the code they support, below the main export when that improves readability.
- Do not over-abstract simple expressions into many single-use helpers; extract only when it names a real concept like `requireConfig` or `readMetadata`.
- Do not return `Effect` from helpers unless they actually perform effectful work. Synchronous parsing, validation, and option building should stay synchronous.
- Prefer Effect schema helpers such as `Schema.UnknownFromJsonString` and `Schema.decodeUnknownOption` over manual `JSON.parse` wrapped in `Effect.try` when parsing untrusted JSON strings.
- Add comments for non-obvious constraints and surprising behavior, not for obvious assignments or control flow.

### Schema Definitions (Drizzle)

Use snake_case for field names so column names don't need to be redefined as strings.

```ts
// Good
const table = sqliteTable("session", {
  id: text().primaryKey(),
  project_id: text().notNull(),
  created_at: integer().notNull(),
})

// Bad
const table = sqliteTable("session", {
  id: text("id").primaryKey(),
  projectID: text("project_id").notNull(),
  createdAt: integer("created_at").notNull(),
})
```

## Testing

- Avoid mocks as much as possible, you shouldn't be using globalThis.\* at all unless it's the only option.
- Test actual implementation, do not duplicate logic into tests
- Tests cannot run from repo root (guard: `do-not-run-tests-from-root`); run from package dirs like `packages/opencode`.

## Type Checking

- Always run `bun typecheck` from package directories (e.g., `packages/opencode`), never `tsc` directly.

## V2 Session Core

- Keep durable prompt admission separate from model execution. `SessionV2.prompt(...)` admits one durable `session_input` row before scheduling advisory `SessionExecution.wake(sessionID)` unless `resume: false` requests admit-only behavior. The serialized runner promotes admitted inputs into visible user messages at safe boundaries.
- Reusing a Session ID adopts the existing Session. Reusing a prompt message ID reconciles an exact retry only when Session, prompt, and delivery mode match; conflicting reuse fails. Historical projected prompts lazily synthesize promoted inbox records during exact retry.
- Keep `SessionExecution` process-global and Session-ID based. Its local implementation owns the process-local Session coordinator and discovers placement through `SessionStore` plus `LocationServiceMap.get(session.location)` only when a drain starts; no layer should take a Session ID. V2 interruption targets the active process-local ownership chain for that Session; idle or missing interruption is a no-op.
- Keep `SessionRunner`, model resolution, tool registry, permissions, and filesystem Location-scoped. Omitted `Location.workspaceID` means implicit-local placement; explicit workspace identity remains reserved for future placement semantics.
- Preserve one explicit `llm.stream(request)` call per provider turn and reload projected history before durable continuation. Do not bridge through legacy `SessionPrompt.loop(...)` or delegate orchestration to an in-memory tool loop.
- Keep local Session drains process-local until clustering is implemented. `SessionRunCoordinator` joins explicit same-Session resumes, coalesces prompt wakeups, and allows different Sessions to run concurrently. Advisory wakes drain eligible durable inbox rows only; post-crash continuation recovery requires a separate explicit design before it may retry provider work. A drain has no durable identity or transcript boundary.
- Keep delivery vocabulary explicit. Prompts steer by default and promote at the next safe provider-turn boundary while the current drain requires continuation. An explicit `queue` input remains pending until the Session would otherwise become idle; promote one queued input at that boundary, then reevaluate continuation before promoting another. Promoting any new user input resets the selected agent's provider-turn allowance; a batch of steers resets it once.
- Keep EventV2 replay owner claims separate from clustered Session execution ownership.
- Keep the System Context algebra, registry, and built-ins in `src/system-context`; keep Context Source producers with their observed domains, and keep Session History selection plus Context Epoch persistence Session-owned.

## Production workflow

This is a production codebase. The following conventions are enforced on `main`
and are the responsibility of every contributor (and of the Boros agent when it
lands changes).

### Branching — every commit is a date-stamped branch

No work lands on `main` directly. Each unit of work lives on its own
date-stamped branch so it is individually reviewable and traceable:

- Branch name: `snapshot/YYYY-MM-DDTHHMMSS` (optionally `-<short-topic>`),
  e.g. `snapshot/2026-08-06T143210-agent-permissions`.
- Create it from a clean `git switch -c snapshot/$(date +%Y-%m-%dT%H%M%S)-my-topic`.
- Commit on that branch. The CI workflow `snapshot-branch.yml` automatically
  mirrors every push to `main` onto a fresh `snapshot/YYYY-MM-DDTHHMMSS` branch
  as an audit point; contributors may also use `scripts/new-day.sh` to create the
  branch and open its PR in one step.

### Pull requests — review is mandatory

- All changes go through a pull request into `main`.
- `main` is protected: **at least one approving review** is required, CI
  (`ci.yml`: typecheck + unit tests + build smoke) must be green, and CodeRabbit
  reviews each PR. Do **not** merge your own PRs without a review.
- Use **squash-and-merge** so `main` history stays linear and each commit is
  one coherent unit. Include a concise summary of the change in the PR title.

### Releases — tag-driven CD

- A release is cut by pushing an annotated tag `v<semver>` (e.g. `v1.0.0`) on
  `main`. This triggers `release.yml`, which builds the native binaries for all
  12 platforms and publishes them to the GitHub release, and `npm-publish.yml`,
  which publishes `@boros-ai/boros` (+ per-platform carrier packages) to npm.
- Do not edit `npm/` package files or hand-publish to npm; the workflow does it
  from the tag.
- Patch/minor releases use the `latest` channel; pre-releases use a
  `YYYY.MM.DD-pre.<n>` tag which is published to the matching npm tag.

### Agent review scope

When the Boros agent reviews a PR, it checks:
1. No OpenCode paywall/rate-limit upsell paths are reintroduced (see
   `packages/opencode/src/session/retry.ts`).
2. All real provider `/model` and `/connect` behavior is preserved.
3. No OpenCode-only cloud endpoints are introduced into the terminal path.
4. Native agent/skill registration is consistent with `AGENTS.md` conventions.

## References

- Base / shell: OpenCode — https://github.com/anomalyco/opencode
- Flow: Strix — https://github.com/usestrix/strix
- Exodus — https://github.com/exodialabsxyz/exodus
