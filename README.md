<p align="center">
  <a href="https://opencode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="OpenCode logo">
    </picture>
  </a>
</p>
<p align="center"><b>Boros</b> — an offensive AI agent. Recon → exploit → escalate → evidence. Drive a swarm of security specialists to a verified compromise.</p>
<p align="center">
  <a href="https://github.com/uncesaii/boros#install"><img alt="install" src="https://img.shields.io/badge/install-curl%20%7C%20bash-8a2be2" /></a>
  <a href="https://github.com/uncesaii/boros/releases/latest"><img alt="release" src="https://img.shields.io/github/v/release/uncesaii/boros?logo=github" /></a>
  <a href="https://github.com/uncesaii/boros/actions/workflows/ci.yml"><img alt="build" src="https://img.shields.io/github/actions/workflow/status/uncesaii/boros/ci.yml?branch=main" /></a>
</p>
<p align="center">
  <a href="https://opencode.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://www.npmjs.com/package/opencode-ai"><img alt="npm" src="https://img.shields.io/npm/v/opencode-ai?style=flat-square" /></a>
  <a href="https://github.com/anomalyco/opencode/actions/workflows/publish.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/anomalyco/opencode/publish.yml?style=flat-square&branch=dev" /></a>
</p>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.gr.md">Ελληνικά</a> |
  <a href="README.vi.md">Tiếng Việt</a>
</p>

[![OpenCode Terminal UI](packages/web/src/assets/lander/screenshot.png)](https://opencode.ai)

---

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

### Desktop App (BETA)

Boros is primarily a terminal agent. A desktop app is not yet published; run `boros`
from your terminal for the full interactive TUI.

#### Installation Directory

The install script respects the following priority order for the installation path:

1. `$BOROS_INSTALL_DIR` - Custom installation directory
2. `$XDG_BIN_DIR` - XDG Base Directory Specification compliant path
3. `$HOME/bin` - Standard user binary directory (if it exists or can be created)
4. `$HOME/.boros/bin` - Default fallback

```bash
# Examples
BOROS_INSTALL_DIR=/usr/local/bin curl -fsSL https://raw.githubusercontent.com/uncesaii/boros/main/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://opencode.ai/install | bash
```

### Agents

Boros ships with a native offensive agent swarm (V2 runtime). The default
`root_agent` is an orchestrator that plans and delegates; bare `boros` runs it.
Subagents can be summoned at any time with `@agent` from the TUI/chat:

- **root_agent** *(primary)* — orchestrator: plans the operation, assigns tools
- **recon** — scanning & enumeration (`nmap`, `masscan`, `amass`)
- **exploit** — vulnerability exploitation & payload staging
- **privesc** — privilege escalation & kernel exploits
- **web** — web recon, fuzzing & injection (`nuclei`, `ffuf`, `sqlmap`)
- **triage** — findings aggregation, risk scoring & evidence capture
- **assistant** — utility/dojo helper (sandbox ops, not on target)

```bash
boros            # launch the TUI with the offensive orchestrator
boros "@recon scan example.com -sn"     # run a subagent directly
boros "@web nuclei -u https://target"
```

### Skills

Boros includes 59 built-in skills (slash commands) covering the full kill chain:
`/recon`, `/exploit`, `/enum`, `/exfil`, `/pivot`, `/clean`, `/evidence`, `/report`,
`/regen`, `/c2`, `/linpeas`, `/bloodhound`, `/mimikatz`, `/impacket`, `/msfconsole`,
`/sqlmap`, `/ffuf`, `/nuclei`, `/burpsuite`, `/zap`, `/gitsploit`, `/subzy`, and many more.
Type `/` in the TUI to browse the full catalog, or `/help` for the list.

All skills are registered as built-in OpenCode skills and are available after install
with no network lookup. They are implemented in
`packages/core/src/plugin/skill/boros/` and sourced from the legacy Boros skill library.

### Documentation

See [`docs/`](./packages/core/src/plugin/skill/boros/README.md) for skill reference and
[`AGENTS.md`](./AGENTS.md) for coding-style guidance.

### Contributing

Boros is an OpenCode fork. To contribute, read [`AGENTS.md`](./AGENTS.md) first,
then open a PR against `main`. For the upstream contribution guide,
see [`CONTRIBUTING.md`](./CONTRIBUTING.md).

### Building

```bash
bun install        # set up workspace
bun run typecheck  # from repo root
bun run build      # build all packages
# binaries:
./packages/opencade/script/build.ts     # builds to dist/<name>/bin/boros
```

**Join our community** [Discord](https://discord.gg/opencode) | [X.com](https://x.com/opencode)
