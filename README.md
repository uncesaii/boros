<p align="center">
  <b>BOROS</b>
</p>
<p align="center"><i>A terminal-native offensive-security agent swarm.</i></p>
<p align="center">Recon → exploit → escalate → evidence. One binary, one command: a root doctrine agent that automatically delegates to specialist operators and drives a full engagement to a verified compromise — every step reviewable in your terminal.</p>

<p align="center">
  <a href="#installation"><img alt="install" src="https://img.shields.io/badge/install-curl%20%7C%20bash-8a2be2" /></a>
  <a href="https://github.com/uncesaii/boros/releases/latest"><img alt="release" src="https://img.shields.io/github/v/release/uncesaii/boros?logo=github" /></a>
  <a href="https://www.npmjs.com/package/@boros-ai/boros"><img alt="npm" src="https://img.shields.io/npm/v/@boros-ai/boros" /></a>
  <a href="https://github.com/uncesaii/boros/actions/workflows/ci.yml"><img alt="build" src="https://img.shields.io/github/actions/workflow/status/uncesaii/boros/ci.yml?branch=main" /></a>
  <a href="https://github.com/uncesaii/boros/blob/main/LICENSE"><img alt="license" src="https://img.shields.io/badge/license-MIT-8a2be2" /></a>
</p>

---

## What is Boros

Boros is a single binary that runs an autonomous red-team swarm in your
terminal. Bare `boros` launches the full swarm doctrine with no configuration:
the root orchestrator reads your objective, automatically classifies it, spawns
the right specialist subagents, and loads the matching skills for the phase. It
is built to complete the offensive lifecycle — reconnaissance, vulnerability
analysis, exploitation, privilege escalation, pivot, and evidence — rather than
produce advisory-style reports.

Every operation is human-reviewable: tool calls, permission prompts, and
evidence are rendered in the TUI, and the swarm self-heals when a specialist
comes back empty (redeployed with a different vector or a different agent).

### Features

- **Zero-config swarm** — a root doctrine agent (`build`) that orchestrates the
  kill chain and delegates to specialist operators through the task tool.
- **11 native specialist operators** — recon, exploit, exploit-engineer,
  privesc, web, triage, assistant, crypto, llm, post, and harness.
- **64 built-in kill-chain skills** — reconnaissance, cloud (AWS/GCP/K8s),
  Active Directory, frameworks, CWE classes, AI/LLM red teaming,
  cryptography, post-exploitation, harness engineering, and exploit
  development playbooks. They ship inside the binary; no network lookups.
- **Human review at every step** — tool calls, permission prompts, and
  evidence rendered in the TUI; per-step confirmation before risky actions.
- **Self-healing orchestration** — empty results are redeployed with a
  different vector or a different specialist.
- **Auto-updating** — checks for updates and prompts inside the TUI/CLI.

---

## Installation

### Option 1 — Install script (recommended)

Requires no Node, npm, or runtime dependencies; downloads a self-contained
native binary for your platform.

```bash
# Latest release
curl -fsSL https://raw.githubusercontent.com/uncesaii/boros/main/install | bash

# Specific version
curl -fsSL https://raw.githubusercontent.com/uncesaii/boros/main/install | bash -s -- --version 1.0.0

# Custom install directory
BOROS_INSTALL_DIR=/usr/local/bin curl -fsSL https://raw.githubusercontent.com/uncesaii/boros/main/install | bash

# Install from a locally-built binary
./install --binary /path/to/boros
```

The installer places the binary in `$HOME/.boros/bin` and adds that directory
to your shell rc.

### Option 2 — npm

Boros is published as `@boros-ai/boros` with per-platform carrier packages
(`boros-linux-x64`, `boros-darwin-arm64`, `boros-windows-x64`, etc.), so npm
installs the right native binary for your platform.

```bash
npm install -g @boros-ai/boros
```

### Option 3 — GitHub Releases

Grab the prebuilt archive for your platform from the
[latest release](https://github.com/uncesaii/boros/releases/latest):

| Platform | Binary |
| --- | --- |
| macOS (Apple Silicon / Intel) | `boros-darwin-arm64.zip` / `boros-darwin-x64.zip` |
| Linux (glibc / musl) | `boros-linux-x64.tar.gz` / `boros-linux-arm64.tar.gz` |
| Windows | `boros-windows-x64.zip` / `boros-windows-arm64.zip` |

Extract and place the `boros` binary anywhere on your `PATH`.

> [!TIP]
> `boros` checks for updates automatically and prompts to update inside the
> TUI/CLI. You can also run `boros upgrade` manually, or `boros version` to see
> your version.

---

## Quick start

```sh
boros                          # launch the TUI with the offensive orchestrator
boros "@recon scan example.com"   # invoke a specialist directly
boros "@web"                      # switch to the web exploitation operator
```

The root agent auto-classifies your objective on the first turn and delegates
through the task tool — no `/agent` ceremony required. Specialists can also be
summoned directly by name from the chat.

---

## Agents

Boros ships a native swarm: a root orchestrator plus specialist sub-agents.
The primary orchestrator runs the kill chain by delegating; sub-agents run one
focused objective and return evidence.

| Agent | Role | Focus |
| --- | --- | --- |
| **build** *(primary)* | Orchestrator | Runs the offensive kill chain to a verified compromise by delegating to specialist operators |
| **triage** | Intake | Classifies the objective by attacker intent and routes it to the right specialist |
| **recon** | Reconnaissance | Maps the attack surface; produces ranked exploitable leads (versions + vulnerability hypotheses) |
| **exploit** | Exploitation | Turns weaknesses into real access — shells, flags, compromised accounts — with evidence |
| **exploit-engineer** | Exploit development | Reverse-engineering + exploit development: patch-diffing, fuzzing, sanitizer-confirmed PoCs, deterministic exploit code (memory corruption, logic flaws, injection) to real code execution |
| **privesc** | Privilege escalation | Drives a foothold to root/SYSTEM/Domain Admin and proves it |
| **web** | Web exploitation | Breaks web apps/APIs (RCE/SQLi/SSRF/XSS/auth-bypass) with request/response evidence |
| **crypto** | Cryptography | Attacks the crypto layer: TLS/key exchange, cipher modes, tokens/signatures, hashes/brute-forcing, nonce/IV misuse — from oracle attacks (padding, Bleichenbacher, Raccoon-class timing) to offline property breaks |
| **llm** | AI/LLM red teaming | Prompt injection, jailbreaking, RAG/system-leak, tool/MCP abuse, agent confused-deputy, model attacks on LLM apps |
| **post** | Post-exploitation | Credential access, persistence, lateral movement, pivoting/tunneling, C2 flow, evasion, cleanup after a foothold |
| **harness** | Harness engineering | Builds reusable attack machinery: intercepting proxies, target drivers, fuzz harnesses, exploit scaffolds, oracle loops, payload factories |
| **assistant** | Force multiplier | Tooling/payload dev, credential/foothold management, coordination, reporting |

Specialists are *subagents*: they run one focused objective and return evidence,
and they are spawned by the root operator or directly by you in the chat.
Skills are the loadable methodology playbooks (see below); agents are the
actors that decide which methods and steps to use.

---

## Skills

Boros includes 64 built-in kill-chain skills (slash commands): recon, scan
modes, cloud (AWS/GCP/Kubernetes), Active Directory, framework + protocol
playbooks (Django, FastAPI, GraphQL, OAuth), all major CWE classes (SQLi, SSRF,
XSS, SSTI, XXE, deserialization, RCE, race conditions…), an AI/LLM red-team
playbook (prompt injection, jailbreaking, MCP/agent abuse), a cryptography
attack playbook (padding oracles, CBC bit-flipping, length extension, RSA/DH
misuse, side-channels), a post-exploitation playbook (credential access,
persistence, lateral movement, C2), a harness-engineering playbook (reusable
attack machinery: proxies, drivers, fuzz harnesses, exploit scaffolds), and a
full exploit-development playbook (patch-diff, fuzz + sanitizers, ROP/heap
primitives, deterministic PoC).

Type `/` in the TUI to browse the catalog, or `/help` for the list. Skills are
built-in, ship with the binary, and need no network lookups. They live in
`packages/core/src/plugin/skill/boros/`.

---

## Configuration

Boros follows the classic config layout: global config in
`~/.boros/boros.json` (or `boros.jsonc`), and project config in
`.boros/boros.json` — with legacy fallbacks to `.opencode/` paths. It
discovers the first matching file in this order:

1. `boros.json`
2. `boros.jsonc`
3. `opencode.json` (legacy)
4. `opencode.jsonc` (legacy)

---

## Building from source

```sh
bun install          # set up workspace
bun run typecheck    # from the package directories
bun run build        # build all packages
# native binary:
bun run --cwd packages/opencode script/build.ts --single
```

---

## Contributing

All changes go through a pull request into `main`; `main` is protected (CI must
be green) and every commit lives on a date-stamped branch. See
[`AGENTS.md`](./AGENTS.md) for the workflow and style guide.

---

## Legal and acceptable use

Boros is offensive-security software. It can attack, break into, and take over
systems.

- **You are responsible for your use.** Only operate Boros against systems you
  own or have explicit, written authorization to test.
- **Unauthorized use is illegal.** Attacking computers, networks, or services
  that you do not own and do not have permission to test is a crime in most
  jurisdictions, regardless of intent or outcome.
- **No warranty, no liability.** This software is provided "as is", without
  warranty of any kind. The author and contributors are not obligated to help
  you, and are not liable for any damage, loss, or legal consequence arising
  from your use of this software.
- **Authorization is your problem.** Establishing and preserving a lawful
  engagement scope is the operator's responsibility, never the tool's.
