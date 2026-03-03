# DEFRAG / SOVEREIGN
# 90-DAY PRODUCTION HARDENING ROADMAP (V1)

**Purpose:**
To systematically close all theoretical and practical attack vectors identified in the Production Penetration Checklist. This roadmap transforms DEFRAG from a secure MVP into the enterprise-grade SOVEREIGN infrastructure layer.

**Core Objective:**
Verifiable enforcement of the Master Constitution (Sovereignty, Privacy, Delete Anytime) before scaling API monetization and Enterprise licensing.

---

## 📅 MONTH 1: INFRASTRUCTURE SEALING & RLS MATURITY
*Objective: Eliminate all cross-user data exposure vectors and secure the authentication boundary.*

### Week 1: Strict Isolation & Auth Hardening
*   **Action:** Complete Supabase RLS (Row Level Security) audit.
*   **Deliverable:** 100% of tables (`conflict_events`, `relationship_nodes`, `decision_events`, `daily_stability`) have strict `auth.uid() = user_id` enforcement. Service role keys removed from all client-facing bundles.
*   **Action:** Implement JWT strict validation.
*   **Deliverable:** Session tokens verified on every API request. Refresh token rotation enabled. No long-lived tokens in localStorage.

### Week 2: Cryptographic Verification & Deletion Guarantees
*   **Action:** Verify at-rest encryption configuration in Supabase (Postgres level) and S3 buckets (Audio briefs).
*   **Deliverable:** Documented proof of TLS 1.2+ transit and AES-256 at-rest encryption.
*   **Action:** Implement and test the "True Deletion" cascade.
*   **Deliverable:** A single user-triggered action that successfully purges all relational nodes, conflict events, audio files, and cache within a 24-hour SLA. Zero orphan rows.

### Week 3: Rate Limiting & DoS Protection
*   **Action:** Deploy Redis/Upstash for distributed rate limiting.
*   **Deliverable:** Strict per-user limits on the AI pipeline (e.g., 5 requests/minute). Global IP throttling for login and contact endpoints.
*   **Action:** Implement basic bot detection on public endpoints.

### Week 4: Red Team Cycle 1 (Isolation Focus)
*   **Action:** Conduct internal penetration test focusing exclusively on lateral escalation and cross-user data access.
*   **Deliverable:** Red team report. Any successful cross-user read/write results in an immediate halt to new feature development until patched.

---

## 📅 MONTH 2: AI PIPELINE & LOGGING MATURITY
*Objective: Armor the Kinematic Sandbox and ensure no proprietary logic or user data leaks through the AI interface.*

### Week 5: Prompt Injection & Schema Hardening
*   **Action:** Fortify the Three-Layer AI Defense (Signal Packet, Structured Output, Disclosure Guard).
*   **Deliverable:** Expanded regex blocking for internal taxonomy ("algorithm", "scoring", "tier"). Strict Zod schema validation that rejects non-conforming JSON and safely falls back.
*   **Action:** Jailbreak stress testing.
*   **Deliverable:** Verify the model refuses to leak system prompts or internal weighting logic under adversarial conditions.

### Week 6: Decision Guard Server-Side Enforcement
*   **Action:** Move all Decision Guard risk metric computations strictly to the server.
*   **Deliverable:** The client can only submit events; it cannot dictate `stability_score` or override sensitivity levels. All overrides are logged on the backend.

### Week 7: Logging Hygiene & Retention
*   **Action:** Audit all application and database logs.
*   **Deliverable:** Ensure zero Raw Birth Data, zero PII, and zero full AI conversation histories are retained indefinitely in analytics or debug logs. IP anonymization enabled.
*   **Action:** Configure API with zero-retention mode for LLM providers (e.g., OpenAI Enterprise zero-data retention).

### Week 8: Red Team Cycle 2 (AI Focus)
*   **Action:** Conduct internal penetration test focusing on prompt injection, schema breaking, and XSS via Graph Map injection.
*   **Deliverable:** Red team report. Verify malicious inputs (e.g., `<script>alert(1)</script>`) are escaped and schema boundaries hold.

---

## 📅 MONTH 3: ENTERPRISE API PREP & SOC2 READINESS
*Objective: Prepare the SOVEREIGN infrastructure for B2B scale, automated chronometer services, and formal compliance.*

### Week 9: Audio Pipeline & Cron Security
*   **Action:** Secure the Daily Listen audio generation pipeline.
*   **Deliverable:** Audio files require signed, user-scoped URLs that expire. No guessable filenames.
*   **Action:** Protect the Chronometer service (nightly recalculations).
*   **Deliverable:** Cron endpoints require internal authentication/secrets and reject public invocation.

### Week 10: Privilege Escalation & Role Enforcement
*   **Action:** Audit role-based access control (RBAC).
*   **Deliverable:** Server-side enforcement of user roles. Ensure tampered client payloads cannot elevate privileges to admin or access service endpoints.

### Week 11: SOC2 Type I Gap Analysis
*   **Action:** Begin formal mapping of current controls against SOC2 Trust Services Criteria (Security, Availability, Processing Integrity, Confidentiality, Privacy).
*   **Deliverable:** Gap analysis report. Implementation of required policies (Access Control, Incident Response, Change Management).

### Week 12: Enterprise API Monetization Readiness
*   **Action:** Finalize API endpoint structure (`/conflict-analysis`, `/stability-score`, etc.) with strict Bearer token authentication and per-client data isolation.
*   **Deliverable:** A hardened, rate-limited, and schema-validated API ready for Starter/Pro/Enterprise tier provisioning via Stripe.

---

## 🏁 FINAL CHECKPOINT (Day 90)
Before opening Enterprise licensing or API monetization, the platform must pass the Final Scorecard:

*   [ ] Zero cross-user read capabilities.
*   [ ] Zero system prompt leaks under adversarial testing.
*   [ ] Strict schema validation functioning correctly.
*   [ ] True deletion (purge) verified.
*   [ ] Encrypted storage (at-rest and in-transit) verified.
*   [ ] Decision Guard logic strictly server-side enforced.
*   [ ] No XSS vulnerabilities in user-generated network data.
*   [ ] Rate-limit bypasses closed.
*   [ ] No exposed service role keys.
