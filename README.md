<div align="center">

# 🛡️ Boros
## ⚔️ Exploit Vector Agent

<br>

**Autonomous offensive security AI for guiding pentest processes**

[![Stars](https://img.shields.io/github/stars/uncesaii/boros?style=for-the-badge&color=353535)](https://github.com/uncesaii/boros)
[![Watchers](https://img.shields.io/github/watchers/uncesaii/boros?style=for-the-badge&color=353535)](https://github.com/uncesaii/boros)
[![Forks](https://img.shields.io/github/forks/uncesaii/boros?style=for-the-badge&color=353535)](https://github.com/uncesaii/boros/fork)
[![Repo Views](https://komarev.com/ghpvc/?username=boros&color=353535&style=for-the-badge&label=REPO%20VIEWS)](https://github.com/uncesaii/boros)

[![License](https://img.shields.io/badge/License-MIT-223355.svg?style=for-the-badge)](LICENSE)
[![Security](https://img.shields.io/badge/For-Offensive%20Security-8B0000.svg?style=for-the-badge)](#)
[![AI](https://img.shields.io/badge/AI-Powered-darkblue.svg?style=for-the-badge)](#)

![GitHub issues](https://img.shields.io/github/issues/uncesaii/boros?style=for-the-badge&color=3f3972)
![GitHub pull requests](https://img.shields.io/github/issues-pr/uncesaii/boros?style=for-the-badge&color=3f3972)
![GitHub contributors](https://img.shields.io/github/contributors/uncesaii/boros?style=for-the-badge&color=3f3972)
![GitHub last commit](https://img.shields.io/github/last-commit/uncesaii/boros?style=for-the-badge&color=3f3972)

</div>

<br>

Boros is a single binary that runs an autonomous red-team swarm in your terminal.
Give it an objective and the root orchestrator classifies it, spawns the right
specialist operators, and drives the engagement — reconnaissance, exploitation,
privilege escalation, and evidence — to a verified compromise. Every tool call,
permission prompt, and finding is reviewable in the TUI.

## How it works

```mermaid
flowchart TD
    A(["🎯 Objective"]) --> B["Triage · classify intent"]
    B --> C{"🧠 Root Orchestrator<br/>(build)"}

    C -->|surface| D["🔭 Recon"]
    C -->|access| E["💥 Exploit"]
    C -->|root| F["🪜 Privesc"]
    C -->|web / api| G["🌐 Web"]
    C -->|crypto| H["🔐 Crypto"]
    C -->|ai / llm| I["🤖 LLM Red-Team"]
    C -->|persist| J["🕸️ Post-Exploit"]

    D --> K["📄 Evidence"]
    E --> K
    F --> K
    G --> K
    H --> K
    I --> K
    J --> K

    K --> L{"✅ Verified<br/>compromise?"}
    L -->|yes| M(["🏁 Report"])
    L -->|empty result| C

    style C fill:#223355,stroke:#8B0000,color:#fff
    style M fill:#8B0000,stroke:#fff,color:#fff
    style A fill:#353535,stroke:#fff,color:#fff
```

The swarm **self-heals**: when a specialist comes back empty, the orchestrator
redeploys the objective with a different vector or a different operator.

## Installation

```bash
# Install script (no Node/npm required — downloads a native binary)
curl -fsSL https://raw.githubusercontent.com/uncesaii/boros/main/install | bash

# Or via npm
npm install -g @boros-ai/boros
```

## Quick start

```sh
boros                          # launch the TUI with the offensive orchestrator
boros run "@recon scan example.com"   # run a specialist directly
boros -v                       # print the installed version
```

The root agent auto-classifies your objective on the first turn and delegates
through the task tool — no ceremony required.

---

<div align="center">

Boros is built on the [OpenCode](https://github.com/anomalyco/opencode) terminal
AI shell as a base — reusing its TUI, install/auto-update pipeline, and CI/CD.

**MIT** · [Contributing](CONTRIBUTING.md) · [Security](SECURITY.md)

</div>