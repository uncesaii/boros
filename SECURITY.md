# Security

## IMPORTANT

We do not accept AI generated security reports. We receive a large number of
these and we absolutely do not have the resources to review them all. If you
submit one that will be an automatic ban from the project.

## Legal notice

Boros is offensive-security software. It is intended for authorized
penetration testing, red-team engagements, CTFs, and research on systems you
own or have explicit written permission to test. Unauthorized use is illegal in
most jurisdictions. The authors and contributors are not obligated to assist
you and accept no liability for any consequence of your use.

## Reporting a vulnerability in the tool itself

If you find a defect in Boros (a crash, an unsafe data-handling bug, a
bypass of its own permission prompts, etc.), please report it through the
GitHub Security Advisory tab:

- [Report a vulnerability](https://github.com/uncesaii/boros/security/advisories/new)

After the initial reply, we will keep you informed of progress towards a fix
and may ask for additional information.

## Escalation

If you do not receive an acknowledgement within 6 business days, you may open
a public issue referencing the advisory.

## Threat model

Boros runs a powerful agent locally with access to shell execution, file
operations, and web access. Understand the trust boundaries before running it:

### No sandbox

Boros does **not** sandbox the agent. The permission system exists as a UX
feature to keep you aware of what the agent is doing — it prompts before
executing commands and writing files. It is **not** security isolation.

If you need real isolation, run Boros inside a Docker container or VM.

### Server mode

Server mode is opt-in. When enabled, set `BOROS_SERVER_PASSWORD` (or the
Boros equivalent) to require HTTP Basic Auth. Without it the server runs
unauthenticated (with a warning). Securing the server is the operator's
responsibility; any functionality it exposes is expected behavior, not a
vulnerability.

### Out of scope

| Category                        | Rationale                                                               |
| ------------------------------- | ----------------------------------------------------------------------- |
| **Server access when opted-in** | If you enable server mode, API access is expected behavior              |
| **Sandbox escapes**             | The permission system is not a sandbox (see above)                      |
| **LLM provider data handling**  | Data sent to your configured LLM provider is governed by their policies |
| **MCP server behavior**         | External MCP servers you configure are outside our trust boundary       |
| **Malicious config files**      | Users control their own config; modifying it is not an attack vector    |
| **Resulting compromise of targets** | A successful engagement is the tool working as designed; it is not a bug in Boros |
