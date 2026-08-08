<p align="center"><b>Boros</b> — a terminal-native offensive-security agent swarm.</p>
<p align="center">Recon → exploit → escalate → evidence. One binary, one command: a root doctrine agent that automatically delegates to specialist operators and drives a full engagement to a verified compromise — every step reviewable in your terminal.</p>
<p align="center">
  <a href="https://github.com/uncesaii/boros#install"><img alt="install" src="https://img.shields.io/badge/install-curl%20%7C%20bash-8a2be2" /></a>
  <a href="https://github.com/uncesaii/boros/releases/latest"><img alt="release" src="https://img.shields.io/github/v/release/uncesaii/boros?logo=github" /></a>
  <a href="https://github.com/uncesaii/boros/actions/workflows/ci.yml"><img alt="build" src="https://img.shields.io/github/actions/workflow/status/uncesaii/boros/ci.yml?branch=main" /></a>
</p>

### What is Boros

Boros is a single binary that runs an autonomous red-team swarm in your terminal. Bare `boros` launches the full swarm doctrine with no configuration: the root orchestrator reads your objective, automatically classifies it, spawns the right specialist subagents, and loads the matching skills for the phase. It is built to complete the offensive lifecycle — reconnaissance, vulnerability analysis, exploitation, privilege escalation, pivot, and evidence — rather than produce advisory-style reports.

Every operation is human-reviewable: tool calls, permission prompts, and evidence are rendered in the TUI, and the swarm self-heals when a specialist comes back empty (redeployed with a different vector or a different agent).

### Installation

```bash
# Latest release
curl -fsSL https://raw.githubusercontent.com/uncesaii/boros/main/install | bash

# Specific version
curl -fsSL https://raw.githubusercontent.com/uncesaii/boros/main/install | bash -s -- --version 1.0.0

# Or install from a locally-built binary
./install --binary /path/to/boros
```

The installer downloads a self-contained native binary (no Node/npm required) for your
platform and places it in `$HOME/.boros/bin`, adding that directory to your shell rc.

```bash
# Custom install directory
BOROS_INSTALL_DIR=/usr/local/bin curl -fsSL https://raw.githubusercontent.com/uncesaii/boros/main/install | bash
```

> [!TIP]
> `boros` checks for updates automatically and prompts to update inside the TUI/CLI.
> You can also run `boros upgrade` manually, or `boros version` to see your version.

### Quick start

```sh
boros                     # launch the TUI with the offensive orchestrator
boros "@recon scan example.com"     # invoke a specialist directly
boros "@web"                          # switch to the web exploitation operator
```

The root agent auto-classifies your objective on the first turn and delegates through
the task tool — no `/agent` ceremony required. Specialists can also be summoned
directly by name from the chat.

### Agents

Boros ships a native swarm (root + specialist sub-agents). The primary orchestrator
runs the kill chain by delegating; sub-agents run one focused objective and return
evidence:

- **root** *(primary)* — orchestrator: classifies the objective, spawns specialists, chains results
- **triage** — intake: classifies intent/target and routes to the right specialist
- **recon** — maps the attack surface; produces ranked exploitable leads (version + vulnerability hypothesis)
- **exploit** — turns weaknesses into access: shells, flags, compromised accounts, with evidence
- **exploit-engineer** — exploit development: reverse-engineering, patch-diffing, fuzzing, sanitizer-confirmed PoCs, deterministic exploit code
- **privesc** — drives a foothold to root/SYSTEM/Domain Admin and proves it
- **web** — breaks web apps/APIs: RCE, SQLi, SSRF, XSS, auth bypass, IDOR, with request/response evidence
- **crypto** — attacks the cryptography layer: cipher modes, tokens/signatures, TLS/key exchange, nonce/IV misuse, oracle attacks, hash brute-forcing
- **llm** — AI/LLM red team: prompt injection, jailbreaking, RAG/system leakage, tool & MCP abuse, agent confused-deputy attacks
- **post** — post-exploitation: credential access, persistence, lateral movement, pivoting, C2 flow, evasion, cleanup
- **harness** — harness engineering: reusable attack machinery (proxies, target drivers, fuzz harnesses, exploit scaffolds, oracle loops, payload factories)
- **assistant** — force multiplier: tooling, payload development, credential/foothold management, reporting

Specialists are *subagents*: they run one focused objective and return evidence, and
they are spawned by the root operator or directly by you in the chat. Skills are the
loadable methodology playbooks (see below); agents are the actors that decide which
methods and steps to use.

### Skills

Boros includes 64 built-in kill-chain skills (slash commands) — recon, scan modes, cloud
(AWS/GCP/Kubernetes), Active Directory, framework + protocol playbooks (Django, FastAPI,
GraphQL, OAuth), all major CWE classes (SQLi, SSRF, XSS, SSTI, XXE, deserialization, RCE,
race conditions…), an AI/LLM red-team playbook (prompt injection, jailbreaking, MCP/agent
abuse), a cryptography attack playbook (padding oracles, CBC bit-flipping, length
extension, RSA/DH misuse, side-channels), a post-exploitation playbook (credential access,
persistence, lateral movement, C2), a harness-engineering playbook (reusable attack
machinery: proxies, drivers, fuzz harnesses, exploit scaffolds), and a full
exploit-development playbook (patch-diff, fuzz + sanitizers, ROP/heap primitives,
deterministic PoC). Type `/` in the TUI to browse the catalog, or `/help` for the list.
Skills are built-in, ship with the binary, and need no network lookups. They live in
`packages/core/src/plugin/skill/boros/`.

### Building from source

```sh
bun install          # set up workspace
bun run typecheck    # from the package directories
bun run build        # build all packages
# native binary:
bun run --cwd packages/opencode script/build.ts --single
```

### Contributing

All changes go through a pull request into `main`; `main` is protected (CI must be
green) and every commit lives on a date-stamped branch. See
[`AGENTS.md`](./AGENTS.md) for the workflow and style guide.

### Legal and acceptable use

Boros is offensive-security software. It can attack, break into, and take over
systems.

- **You are responsible for your use.** Only operate Boros against systems you own
  or have explicit, written authorization to test.
- **Unauthorized use is illegal.** Attacking computers, networks, or services that
  you do not own and do not have permission to test is a crime in most
  jurisdictions, regardless of intent or outcome.
- **No warranty, no liability.** This software is provided "as is", without
  warranty of any kind. The author and contributors are not obligated to help you,
  and are not liable for any damage, loss, or legal consequence arising from your
  use of this software.
- **Authorization is your problem.** Establishing and preserving a lawful
  engagement scope is the operator's responsibility, never the tool's.
