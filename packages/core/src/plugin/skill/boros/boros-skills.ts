/// <reference path="../../../markdown.d.ts" />

import { AbsolutePath } from "../../../schema"
import { SkillV2 } from "../../../skill"

import skill_0 from "./cloud_aws.txt" with { type: "text" }
import skill_1 from "./cloud_gcp.txt" with { type: "text" }
import skill_2 from "./cloud_kubernetes.txt" with { type: "text" }
import skill_3 from "./coordination_root_agent.txt" with { type: "text" }
import skill_4 from "./coordination_source_aware_whitebox.txt" with { type: "text" }
import skill_5 from "./custom_api_spec_testing.txt" with { type: "text" }
import skill_6 from "./custom_dependency_cve_scanning.txt" with { type: "text" }
import skill_7 from "./custom_source_aware_sast.txt" with { type: "text" }
import skill_8 from "./frameworks_django.txt" with { type: "text" }
import skill_9 from "./frameworks_fastapi.txt" with { type: "text" }
import skill_10 from "./frameworks_nestjs.txt" with { type: "text" }
import skill_11 from "./frameworks_nextjs.txt" with { type: "text" }
import skill_12 from "./protocols_graphql.txt" with { type: "text" }
import skill_13 from "./protocols_oauth.txt" with { type: "text" }
import skill_14 from "./reconnaissance_asset_discovery.txt" with { type: "text" }
import skill_15 from "./scan_modes_deep.txt" with { type: "text" }
import skill_16 from "./scan_modes_quick.txt" with { type: "text" }
import skill_17 from "./scan_modes_standard.txt" with { type: "text" }
import skill_18 from "./technologies_active_directory.txt" with { type: "text" }
import skill_19 from "./technologies_auth0.txt" with { type: "text" }
import skill_20 from "./technologies_firebase_firestore.txt" with { type: "text" }
import skill_21 from "./technologies_grafana_prometheus.txt" with { type: "text" }
import skill_22 from "./technologies_supabase.txt" with { type: "text" }
import skill_23 from "./tooling_agent_browser.txt" with { type: "text" }
import skill_24 from "./tooling_ffuf.txt" with { type: "text" }
import skill_25 from "./tooling_httpx.txt" with { type: "text" }
import skill_26 from "./tooling_katana.txt" with { type: "text" }
import skill_27 from "./tooling_naabu.txt" with { type: "text" }
import skill_28 from "./tooling_nmap.txt" with { type: "text" }
import skill_29 from "./tooling_nuclei.txt" with { type: "text" }
import skill_30 from "./tooling_python.txt" with { type: "text" }
import skill_31 from "./tooling_semgrep.txt" with { type: "text" }
import skill_32 from "./tooling_sqlmap.txt" with { type: "text" }
import skill_33 from "./tooling_subfinder.txt" with { type: "text" }
import skill_34 from "./vulnerabilities_authentication_jwt.txt" with { type: "text" }
import skill_35 from "./vulnerabilities_broken_function_level_authorization.txt" with { type: "text" }
import skill_36 from "./vulnerabilities_business_logic.txt" with { type: "text" }
import skill_37 from "./vulnerabilities_csrf.txt" with { type: "text" }
import skill_38 from "./vulnerabilities_header_injection.txt" with { type: "text" }
import skill_39 from "./vulnerabilities_http_request_smuggling.txt" with { type: "text" }
import skill_40 from "./vulnerabilities_idor.txt" with { type: "text" }
import skill_41 from "./vulnerabilities_information_disclosure.txt" with { type: "text" }
import skill_42 from "./vulnerabilities_insecure_deserialization.txt" with { type: "text" }
import skill_43 from "./vulnerabilities_insecure_file_uploads.txt" with { type: "text" }
import skill_44 from "./vulnerabilities_llm_prompt_injection.txt" with { type: "text" }
import skill_45 from "./vulnerabilities_mass_assignment.txt" with { type: "text" }
import skill_46 from "./vulnerabilities_nosql_injection.txt" with { type: "text" }
import skill_47 from "./vulnerabilities_open_redirect.txt" with { type: "text" }
import skill_48 from "./vulnerabilities_path_traversal_lfi_rfi.txt" with { type: "text" }
import skill_49 from "./vulnerabilities_prototype_pollution.txt" with { type: "text" }
import skill_50 from "./vulnerabilities_race_conditions.txt" with { type: "text" }
import skill_51 from "./vulnerabilities_rce.txt" with { type: "text" }
import skill_52 from "./vulnerabilities_sql_injection.txt" with { type: "text" }
import skill_53 from "./vulnerabilities_ssrf.txt" with { type: "text" }
import skill_54 from "./vulnerabilities_ssti.txt" with { type: "text" }
import skill_55 from "./vulnerabilities_subdomain_takeover.txt" with { type: "text" }
import skill_56 from "./vulnerabilities_weak_password_detection.txt" with { type: "text" }
import skill_57 from "./vulnerabilities_xss.txt" with { type: "text" }
import skill_58 from "./vulnerabilities_xxe.txt" with { type: "text" }

export const BOROS_SKILLS = [
  SkillV2.Info.make({ name: "aws", description: "AWS cloud security testing covering IAM misconfigurations, S3 exposure, metadata abuse, and privilege escalation paths", location: AbsolutePath.make("/builtin/skills/cloud_aws"), content: skill_0 }),
  SkillV2.Info.make({ name: "gcp", description: "GCP cloud security testing covering IAM misconfigurations, public storage buckets, metadata abuse, and service account privilege escalation", location: AbsolutePath.make("/builtin/skills/cloud_gcp"), content: skill_1 }),
  SkillV2.Info.make({ name: "kubernetes", description: "Kubernetes cluster security testing - RBAC, API exposure, container escapes, network policies, secrets, and supply chain", location: AbsolutePath.make("/builtin/skills/cloud_kubernetes"), content: skill_2 }),
  SkillV2.Info.make({ name: "root-agent", description: "Orchestration layer that coordinates specialized subagents for security assessments", location: AbsolutePath.make("/builtin/skills/coordination_root_agent"), content: skill_3 }),
  SkillV2.Info.make({ name: "source-aware-whitebox", description: "Coordination playbook for source-aware white-box testing with static triage and dynamic validation", location: AbsolutePath.make("/builtin/skills/coordination_source_aware_whitebox"), content: skill_4 }),
  SkillV2.Info.make({ name: "api_spec_testing", description: "Spec-driven API pentesting — systematically exercise every endpoint from an ingested OpenAPI/Swagger/Postman inventory for authz, injection, and business-logic flaws", location: AbsolutePath.make("/builtin/skills/custom_api_spec_testing"), content: skill_5 }),
  SkillV2.Info.make({ name: "dependency-cve-scanning", description: "Supply-chain / SCA playbook — scan repository lockfiles for known dependency CVEs and report them with create_dependency_report (no dynamic PoC required)", location: AbsolutePath.make("/builtin/skills/custom_dependency_cve_scanning"), content: skill_6 }),
  SkillV2.Info.make({ name: "source-aware-sast", description: "Practical source-aware SAST and AST playbook for semgrep, ast-grep, gitleaks, and trivy fs", location: AbsolutePath.make("/builtin/skills/custom_source_aware_sast"), content: skill_7 }),
  SkillV2.Info.make({ name: "django", description: "Security testing playbook for Django applications covering ORM injection, middleware gaps, auth/session flaws, and template issues", location: AbsolutePath.make("/builtin/skills/frameworks_django"), content: skill_8 }),
  SkillV2.Info.make({ name: "fastapi", description: "Security testing playbook for FastAPI applications covering ASGI, dependency injection, and API vulnerabilities", location: AbsolutePath.make("/builtin/skills/frameworks_fastapi"), content: skill_9 }),
  SkillV2.Info.make({ name: "nestjs", description: "Security testing playbook for NestJS applications covering guards, pipes, decorators, module boundaries, and multi-transport auth", location: AbsolutePath.make("/builtin/skills/frameworks_nestjs"), content: skill_10 }),
  SkillV2.Info.make({ name: "nextjs", description: "Security testing playbook for Next.js covering App Router, Server Actions, RSC, and Edge runtime vulnerabilities", location: AbsolutePath.make("/builtin/skills/frameworks_nextjs"), content: skill_11 }),
  SkillV2.Info.make({ name: "graphql", description: "GraphQL security testing covering introspection, resolver injection, batching attacks, and authorization bypass", location: AbsolutePath.make("/builtin/skills/protocols_graphql"), content: skill_12 }),
  SkillV2.Info.make({ name: "oauth", description: "OAuth 2.0 and OIDC flow security testing covering redirect manipulation, token leakage, PKCE bypass, and client misconfiguration", location: AbsolutePath.make("/builtin/skills/protocols_oauth"), content: skill_13 }),
  SkillV2.Info.make({ name: "asset-discovery", description: "Passive asset and attack-surface discovery via certificate transparency, TLS SAN pivoting, passive DNS, and ASN/IP enumeration to find hosts beyond subdomain brute force", location: AbsolutePath.make("/builtin/skills/reconnaissance_asset_discovery"), content: skill_14 }),
  SkillV2.Info.make({ name: "deep", description: "Exhaustive security assessment with maximum coverage, depth, and vulnerability chaining", location: AbsolutePath.make("/builtin/skills/scan_modes_deep"), content: skill_15 }),
  SkillV2.Info.make({ name: "quick", description: "Time-boxed rapid assessment targeting high-impact vulnerabilities", location: AbsolutePath.make("/builtin/skills/scan_modes_quick"), content: skill_16 }),
  SkillV2.Info.make({ name: "standard", description: "Balanced security assessment with systematic methodology and full attack surface coverage", location: AbsolutePath.make("/builtin/skills/scan_modes_standard"), content: skill_17 }),
  SkillV2.Info.make({ name: "active_directory", description: "Active Directory / Kerberos domain testing covering roasting, delegation abuse, AD CS (ESC1-ESC17), NTLM coercion+relay, DACL abuse, and credential dumping", location: AbsolutePath.make("/builtin/skills/technologies_active_directory"), content: skill_18 }),
  SkillV2.Info.make({ name: "auth0", description: "Auth0 tenant security testing covering misconfigured rules/actions, scope escalation, MFA bypass, and cross-application token confusion", location: AbsolutePath.make("/builtin/skills/technologies_auth0"), content: skill_19 }),
  SkillV2.Info.make({ name: "firebase-firestore", description: "Firebase/Firestore security testing covering security rules, Cloud Functions, and client-side trust issues", location: AbsolutePath.make("/builtin/skills/technologies_firebase_firestore"), content: skill_20 }),
  SkillV2.Info.make({ name: "grafana_prometheus", description: "Grafana, Prometheus, Alertmanager and exporter security testing — turning exposed observability into SSRF, credential theft, RCE, and lateral movement into the internal network", location: AbsolutePath.make("/builtin/skills/technologies_grafana_prometheus"), content: skill_21 }),
  SkillV2.Info.make({ name: "supabase", description: "Supabase security testing covering Row Level Security, PostgREST, Edge Functions, and service key exposure", location: AbsolutePath.make("/builtin/skills/technologies_supabase"), content: skill_22 }),
  SkillV2.Info.make({ name: "agent_browser", description: "agent-browser CLI for headless Chrome via shell. Snapshot-and-ref workflow, click/fill/extract, screenshots, multi-tab, multi-session, network mocking. Pre-installed in the sandbox; invoke via exec_command.", location: AbsolutePath.make("/builtin/skills/tooling_agent_browser"), content: skill_23 }),
  SkillV2.Info.make({ name: "ffuf", description: "ffuf fuzzing syntax with matcher/filter strategy and non-interactive defaults.", location: AbsolutePath.make("/builtin/skills/tooling_ffuf"), content: skill_24 }),
  SkillV2.Info.make({ name: "httpx", description: "ProjectDiscovery httpx probing syntax, exact probe flags, and automation-safe output patterns.", location: AbsolutePath.make("/builtin/skills/tooling_httpx"), content: skill_25 }),
  SkillV2.Info.make({ name: "katana", description: "Katana crawler syntax, depth/js/known-files behavior, and stable concurrency controls.", location: AbsolutePath.make("/builtin/skills/tooling_katana"), content: skill_26 }),
  SkillV2.Info.make({ name: "naabu", description: "Naabu port-scanning syntax with host input, scan-type, verification, and rate controls.", location: AbsolutePath.make("/builtin/skills/tooling_naabu"), content: skill_27 }),
  SkillV2.Info.make({ name: "nmap", description: "Canonical Nmap CLI syntax, two-pass scanning workflow, and sandbox-safe bounded scan patterns.", location: AbsolutePath.make("/builtin/skills/tooling_nmap"), content: skill_28 }),
  SkillV2.Info.make({ name: "nuclei", description: "Exact Nuclei command structure, template selection, and bounded high-throughput execution controls.", location: AbsolutePath.make("/builtin/skills/tooling_nuclei"), content: skill_29 }),
  SkillV2.Info.make({ name: "python", description: "Run Python through exec_command in the SDK sandbox. Use the image-baked caido_api module for Caido proxy automation from Python scripts.", location: AbsolutePath.make("/builtin/skills/tooling_python"), content: skill_30 }),
  SkillV2.Info.make({ name: "semgrep", description: "Exact Semgrep CLI structure, metrics-off scanning, scoped ruleset selection, and automation-safe output patterns.", location: AbsolutePath.make("/builtin/skills/tooling_semgrep"), content: skill_31 }),
  SkillV2.Info.make({ name: "sqlmap", description: "sqlmap target syntax, non-interactive execution, and common validation/enumeration workflows.", location: AbsolutePath.make("/builtin/skills/tooling_sqlmap"), content: skill_32 }),
  SkillV2.Info.make({ name: "subfinder", description: "Subfinder passive subdomain enumeration syntax, source controls, and pipeline-ready output patterns.", location: AbsolutePath.make("/builtin/skills/tooling_subfinder"), content: skill_33 }),
  SkillV2.Info.make({ name: "authentication-jwt", description: "JWT and OIDC security testing covering token forgery, algorithm confusion, and claim manipulation", location: AbsolutePath.make("/builtin/skills/vulnerabilities_authentication_jwt"), content: skill_34 }),
  SkillV2.Info.make({ name: "broken-function-level-authorization", description: "BFLA testing for action-level authorization failures across endpoints, admin functions, and API operations", location: AbsolutePath.make("/builtin/skills/vulnerabilities_broken_function_level_authorization"), content: skill_35 }),
  SkillV2.Info.make({ name: "business-logic", description: "Business logic testing for workflow bypass, state manipulation, and domain invariant violations", location: AbsolutePath.make("/builtin/skills/vulnerabilities_business_logic"), content: skill_36 }),
  SkillV2.Info.make({ name: "csrf", description: "CSRF testing covering token bypass, SameSite cookies, CORS misconfigurations, and state-changing request abuse", location: AbsolutePath.make("/builtin/skills/vulnerabilities_csrf"), content: skill_37 }),
  SkillV2.Info.make({ name: "header-injection", description: "HTTP header injection testing covering CRLF / response splitting, cache poisoning, Host-header confusion, cookie fixation, and proxy / forwarding header smuggling", location: AbsolutePath.make("/builtin/skills/vulnerabilities_header_injection"), content: skill_38 }),
  SkillV2.Info.make({ name: "http-request-smuggling", description: "HTTP request smuggling testing covering CL.TE, TE.CL, H2.CL, H2.TE, and HTTP/2 desync techniques with practical detection and exploitation methodology", location: AbsolutePath.make("/builtin/skills/vulnerabilities_http_request_smuggling"), content: skill_39 }),
  SkillV2.Info.make({ name: "idor", description: "IDOR/BOLA testing for object-level authorization failures and cross-account data access", location: AbsolutePath.make("/builtin/skills/vulnerabilities_idor"), content: skill_40 }),
  SkillV2.Info.make({ name: "information-disclosure", description: "Information disclosure testing covering error messages, debug endpoints, metadata leakage, and source exposure", location: AbsolutePath.make("/builtin/skills/vulnerabilities_information_disclosure"), content: skill_41 }),
  SkillV2.Info.make({ name: "insecure-deserialization", description: "Insecure deserialization testing for Java, Python, PHP, .NET, Ruby, and Node.js covering gadget chains, type confusion, and safe validation", location: AbsolutePath.make("/builtin/skills/vulnerabilities_insecure_deserialization"), content: skill_42 }),
  SkillV2.Info.make({ name: "insecure-file-uploads", description: "File upload security testing covering extension bypass, content-type manipulation, and path traversal", location: AbsolutePath.make("/builtin/skills/vulnerabilities_insecure_file_uploads"), content: skill_43 }),
  SkillV2.Info.make({ name: "llm-prompt-injection", description: "Testing LLM-backed features for prompt injection, jailbreaks, system-prompt leakage, tool/agent abuse, and unsafe output handling", location: AbsolutePath.make("/builtin/skills/vulnerabilities_llm_prompt_injection"), content: skill_44 }),
  SkillV2.Info.make({ name: "mass-assignment", description: "Mass assignment testing for unauthorized field binding and privilege escalation via API parameters", location: AbsolutePath.make("/builtin/skills/vulnerabilities_mass_assignment"), content: skill_45 }),
  SkillV2.Info.make({ name: "nosql-injection", description: "NoSQL injection testing covering MongoDB operator injection, authentication bypass, blind extraction, GraphQL variable injection, and Redis/DynamoDB/Elasticsearch/Neo4j-specific attack surfaces", location: AbsolutePath.make("/builtin/skills/vulnerabilities_nosql_injection"), content: skill_46 }),
  SkillV2.Info.make({ name: "open-redirect", description: "Open redirect testing for phishing pivots, OAuth token theft, and allowlist bypass", location: AbsolutePath.make("/builtin/skills/vulnerabilities_open_redirect"), content: skill_47 }),
  SkillV2.Info.make({ name: "path-traversal-lfi-rfi", description: "Path traversal and file inclusion testing for local/remote file access and code execution", location: AbsolutePath.make("/builtin/skills/vulnerabilities_path_traversal_lfi_rfi"), content: skill_48 }),
  SkillV2.Info.make({ name: "prototype-pollution", description: "Client and server prototype pollution testing covering JavaScript object merge bugs, Node.js RCE chains, and filter bypasses", location: AbsolutePath.make("/builtin/skills/vulnerabilities_prototype_pollution"), content: skill_49 }),
  SkillV2.Info.make({ name: "race-conditions", description: "Race condition testing for TOCTOU bugs, double-spend, and concurrent state manipulation", location: AbsolutePath.make("/builtin/skills/vulnerabilities_race_conditions"), content: skill_50 }),
  SkillV2.Info.make({ name: "rce", description: "RCE testing covering command injection, deserialization, template injection, and code evaluation", location: AbsolutePath.make("/builtin/skills/vulnerabilities_rce"), content: skill_51 }),
  SkillV2.Info.make({ name: "sql-injection", description: "SQL injection testing covering union, blind, error-based, and ORM bypass techniques", location: AbsolutePath.make("/builtin/skills/vulnerabilities_sql_injection"), content: skill_52 }),
  SkillV2.Info.make({ name: "ssrf", description: "SSRF testing for cloud metadata access, internal service discovery, and protocol smuggling", location: AbsolutePath.make("/builtin/skills/vulnerabilities_ssrf"), content: skill_53 }),
  SkillV2.Info.make({ name: "ssti", description: "Server-side template injection across Jinja / Mako / Velocity / Freemarker / Thymeleaf / Twig / Handlebars / EJS / ERB with engine fingerprinting, sandbox escape, and RCE gadget chains", location: AbsolutePath.make("/builtin/skills/vulnerabilities_ssti"), content: skill_54 }),
  SkillV2.Info.make({ name: "subdomain-takeover", description: "Subdomain takeover testing for dangling DNS records and unclaimed cloud resources", location: AbsolutePath.make("/builtin/skills/vulnerabilities_subdomain_takeover"), content: skill_55 }),
  SkillV2.Info.make({ name: "weak-password-detection", description: "Weak password detection, credential stuffing, and brute-force testing using common passwords, system-generated credentials, and HTTP fuzzing / NSE brute-force tooling", location: AbsolutePath.make("/builtin/skills/vulnerabilities_weak_password_detection"), content: skill_56 }),
  SkillV2.Info.make({ name: "xss", description: "XSS testing covering reflected, stored, and DOM-based vectors with CSP bypass techniques", location: AbsolutePath.make("/builtin/skills/vulnerabilities_xss"), content: skill_57 }),
  SkillV2.Info.make({ name: "xxe", description: "XXE testing for external entity injection, file disclosure, and SSRF via XML parsers", location: AbsolutePath.make("/builtin/skills/vulnerabilities_xxe"), content: skill_58 }),
]
