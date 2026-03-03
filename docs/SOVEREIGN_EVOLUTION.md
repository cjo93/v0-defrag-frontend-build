# SOVEREIGN PLATFORM ARCHITECTURE

**Project:** DEFRAG → SOVEREIGN (Year 3 Infrastructure Level)

## I. PLATFORM STRUCTURE
* **Parent Platform:** SOVEREIGN
* **Core Module:** DEFRAG (Conflict Intelligence)

**Why:** DEFRAG alone solves conflict moments. Long-term leadership requires broader stability protection. SOVEREIGN becomes the umbrella for Conflict, Stability, Decision protection, and Timing.
**How:** Keep DEFRAG as public-facing product. Gradually introduce Stability Index, Decision Guard, and Relationship Map. Rebrand internally first, externally later.

## II. FULL YEAR 3 CAPABILITY

### 1. Conflict-Frequency Correlation Modeling
* **Why:** Data-backed visibility creates behavior change. Tracking frequency allows repeat detection, timing correlation, stress correlation, and person-specific escalation mapping.
* **What:** Track conflict count, time-of-day, day-of-week, topic category, stability score, escalation severity. Detect high-frequency cycles and stress-linked spikes. Output simplified language (e.g., "Conversations after 9PM escalate more often").
* **How:** Add `conflict_events` table (user_id, related_person_id, timestamp, severity_score, stability_score, topic_tag, resolved_flag).

### 2. Decision Guard (Major Commitment Protection)
* **Why:** Permanent decisions made during unstable states cause long-term damage. Adding friction before irreversible actions increases user trust.
* **What:** Trigger detection for breakup language, resignation language, major purchases, investment moves, ultimatums. System checks Stability Index, recent conflict load, volatility window. If risk is high, recommend pause window (24–72 hours).
* **How:** Add `decision_events` table (user_id, decision_type, timestamp, stability_score, conflict_load, volatility_state, pause_recommended, pause_followed). Run rule-based threshold first.

### 3. Multi-Person Relationship Mapping
* **Why:** Mapping networks increases retention and expands B2B potential.
* **What:** Add contacts (Partner, Parent, Child, Manager, Team member). Display status indicators (Calm, Sensitive, Reactive) and conflict frequency, pattern summary, stability note.
* **How:** Add `relationship_nodes` and `relationship_edges` tables. Build simple graph rendering layer.

## III. STRUCTURED FULL GUIDANCE MODEL (Replacing One-Line Scripts)
* **Why:** One-line scripts oversimplify. Full guidance increases trust for high-stakes users.
* **What to return:**
  1. What is happening
  2. Why it may be happening
  3. Risk level
  4. Best timing option
  5. Suggested response (2–5 sentences)
  6. Expandable data tooltips (conflict history count, stability level, pattern frequency, volatility score)
* **How:** Update response schema: `{ headline, risk_level, timing_recommendation, explanation, suggested_response, data_tooltips, confidence_score }`. Validate schema before display.

## IV. STABILITY INDEX
* **Why:** Conflict risk increases when stability drops.
* **What:** Inputs: Sleep, stress self-report, emotional volatility logs, conflict frequency. Output: Stability Score (0–100). Labels: Low, Moderate, Strong.
* **How:** Start with rule-based weighted scoring. Keep model interpretable.

## V. TIMING SIGNAL ENGINE
* **Why:** Correct advice at wrong time fails.
* **What:** Daily state: Push Day, Neutral Day, Protect Day. Derived from Stability, conflict load, recent escalation density.
* **How:** Daily scheduled job recalculates using simple threshold model.

## VI. API & INFRASTRUCTURE
* **Why:** Infrastructure creates moat. API enables B2B scale.
* **What:** Structured API only. Endpoints: `/conflict-analysis`, `/stability-score`, `/timing-signal`, `/decision-risk`, `/relationship-map`. All return strict JSON.
* **Stripe Model:** Meter per call. Tiers: Starter, Pro, Enterprise.
* **Data Isolation:** Each client isolated schema. No cross-client pooling. No training without opt-in.

## VII. MIGRATION STRATEGY
* Phase 1: DEFRAG only.
* Phase 2: Add Stability inside DEFRAG.
* Phase 3: Rename header to "SOVEREIGN Platform."
* Phase 4: Expose other modules gradually.

## VIII. PRIVACY & TRANSPARENCY
* **Requirements:** Encryption at rest/transit, per-user data segregation, hard delete, no resale, no silent model training. Transparency Dashboard showing stored data, derived signals, delete button, export option.

## IX. LANGUAGE RULES
All system output must be Simple, Direct, Non-judgmental, Non-diagnostic, Non-mystical. Avoid OS metaphors, spiritual framing, deterministic claims, psychiatric labels.

## X. FINAL OBJECTIVE
Build SOVEREIGN as a Human Stability Platform. DEFRAG remains the Conflict Intelligence engine. Goals: Reduce escalation frequency, increase pause adoption, increase timing awareness, reduce regret decisions.
