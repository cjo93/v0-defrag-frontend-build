# DEFRAG / SOVEREIGN: SOC2 Control Mapping Matrix

**Purpose:** This matrix directly maps the technical and architectural implementations from the 90-Day Production Hardening Roadmap (Phase 1 & Phase 2) to the relevant SOC2 Trust Services Criteria (TSC). This document serves as the foundational pre-alignment artifact for the internal governance and external audit processes.

**Scope:** The SOVEREIGN platform, including the DEFRAG conflict intelligence engine, API Gateway, and underlying data infrastructure (Supabase, OpenAI via structured proxy).

---

## 1. Security (Common Criteria - CC)
*The system is protected against unauthorized access (both physical and logical).*

| SOC2 Criterion | Description | SOVEREIGN Implementation | Verification Artifact / Metric |
| :--- | :--- | :--- | :--- |
| **CC6.1** | Logical access security | **Zero Cross-User Risk:** Strict Row Level Security (RLS) on all tables (`users`, `conflict_events`, `relationship_nodes`, `daily_stability`, `decision_events`). Server-side JWT validation only. | Penetration test report (Zero cross-user read possible). RLS policy definitions. |
| **CC6.2** | User authentication | **Environment-Aware Auth:** HttpOnly cookies, CSRF protection, Refresh token rotation. No localStorage auth bypass. Single-use 24-hour expiring JWT Magic Links. | Auth codebase (`lib/supabase.ts`, middleware). Audit logs of login attempts. |
| **CC6.3** | Access provisioning | **Strict Tiering:** No public schema access. No service role key in frontend bundle. Internal administration requires separate SSO access (future). | IAM configuration. Frontend bundle analysis. |
| **CC6.6** | External threat protection | **Rate Limiting & Abuse Controls:** Cloudflare WAF configuration. IP-based throttling, bot detection, brute-force login defense. AI endpoint rate limiting (user + IP). | WAF configuration rules. Simulated 500 req/min attack block logs. |
| **CC6.8** | Unauthorized software | **AI Pipeline Lock:** Strict Zod schema validation (Layer 2). Disclosure Guard (Layer 3) blocking internal mapping/logic reveals. Zero-retention mode in model API. | `lib/ai/response-schema.ts`, `lib/ai/disclosure-guard.ts`. Model API configuration. |
| **CC7.2** | Security event monitoring | **Immutable Audit Trail:** All critical actions (logins, AI calls, deletion requests, Decision Guard overrides) logged to immutable `audit_events` table with `metadata_hash`. | Database schema (`audit_events`). Traceability test (<5 minutes to trace incident). |

## 2. Confidentiality (C)
*Information designated as confidential is protected as committed or agreed.*

| SOC2 Criterion | Description | SOVEREIGN Implementation | Verification Artifact / Metric |
| :--- | :--- | :--- | :--- |
| **C1.1** | Confidential data identification | **Signal Packet Isolation:** AI model receives sanitized `SignalPacket`. Raw mapping rules, weights, and user PI (beyond labels) are never transmitted. | `lib/ai/signal-packet.ts` implementation. |
| **C1.2** | Confidential data protection | **Encryption:** DB at-rest encryption enabled (AES-GCM for birth data). TLS enforced for data in transit. Backups encrypted. | Infrastructure configuration (Supabase/Postgres). |
| **C1.2** | Confidential data protection | **Logging Hygiene:** PII stripped from logs. Birth data masked. Raw AI transcripts removed from persistent logs. Structured error logging only. | Log configuration review. Sample audit logs (containing only hashed user IDs). |

## 3. Privacy (P)
*Personal information is collected, used, retained, disclosed, and disposed of in conformity with the commitments in the entity’s privacy notice.*

| SOC2 Criterion | Description | SOVEREIGN Implementation | Verification Artifact / Metric |
| :--- | :--- | :--- | :--- |
| **P3.1** | Collection limitation | **Structured Output Only:** The AI engine enforces structured JSON output, preventing the generation or storage of extraneous free-text personal data. | `DefragCrisisResponseSchema` validation logs. |
| **P4.1** | Use and retention | **True Deletion Compliance:** Hard-delete job for all relational tables, cached audio, S3 assets, and derived analytics. Zero model training claim enforced. | Deletion job script. API vendor agreements (zero retention). |
| **P4.3** | Disposal | **Deletion Verification:** Deletion receipt generation. 24-hour completion SLA. Confirmation log entry. | Automated test: Delete user → verify zero residual records. Deletion receipts. |
| **P5.1** | Access by individuals | **Sovereignty Positioning:** Users control Memory (pause/delete history) and Account Deletion directly from the dashboard. | Dashboard UI. User action logs. |

## 4. Availability (A)
*The system is available for operation and use as committed or agreed.*

| SOC2 Criterion | Description | SOVEREIGN Implementation | Verification Artifact / Metric |
| :--- | :--- | :--- | :--- |
| **A1.2** | Capacity management | **Enterprise API Preparation:** API gateway layer with per-client rate limits and usage metering. Horizontal scaling verified. | Load test results (10k AI calls/hr, 50k relationship map reads). |
| **A1.3** | Recovery | **Resilience Architecture:** Move to production-grade Postgres plan, add read replicas, enable auto-scaling compute, and decouple cron workers from the API server. | Infrastructure diagrams. Backup and recovery procedures. |

## 5. Processing Integrity (PI)
*System processing is complete, valid, accurate, timely, and authorized.*

| SOC2 Criterion | Description | SOVEREIGN Implementation | Verification Artifact / Metric |
| :--- | :--- | :--- | :--- |
| **PI1.2** | System inputs | **Strict Schema Enforcement:** Reject non-conforming model output; regenerate if invalid. | Validation failure logs. |
| **PI1.4** | System processing | **Server-Side Enforcement:** Stability Index and Decision Guard logic computed and enforced server-side only. Client cannot POST custom stability values. | Source code review (`lib/engine/`). Risk scoring tamper test results. |

---

**Next Steps for Phase 3 (Weeks 7-9):**
1. Formalize the internal security documentation referenced in the "Verification Artifact" column.
2. Conduct the internal Red Team exercises against these implemented controls.
3. Prepare the Enterprise API isolation schemas.
