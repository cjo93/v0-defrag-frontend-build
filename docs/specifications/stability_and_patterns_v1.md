# 1️⃣ STABILITY SCORE — RULE-BASED V1

## Objective

Produce a 0–100 Stability Score daily.

This score influences:

* Sensitivity level
* Timing recommendation
* Decision Guard
* Conflict escalation probability

No machine learning in v1.
Pure weighted scoring.

---

## A. INPUT SIGNALS (V1)

All inputs normalized to 0–100.

### 1. Sleep Score (0–100)

Manual entry or wearable.

If no data:
Default = 70
Reduce confidence score.

---

### 2. Self-Reported Stress (0–100)

User slider once daily.

0 = calm
100 = overwhelmed

---

### 3. Conflict Density (Last 7 Days)

Formula:

(conflict_events_last_7_days / 7) * 100

Cap at 100.

---

### 4. Escalation Severity Average (Last 7 Days)

severity_score average (0–100).

---

### 5. Emotional Volatility Flag

If ≥2 entries in 24h with severity >70:
volatility_penalty = 15

Else:
0

---

## B. WEIGHT MODEL (V1)

Explainable weights.

```
Stability Score =
  (Sleep * 0.25)
+ ((100 - Stress) * 0.25)
+ ((100 - ConflictDensity) * 0.20)
+ ((100 - EscalationSeverityAvg) * 0.20)
+ VolatilityAdjustment
```

Where:

VolatilityAdjustment =
-15 if volatility_flag true
0 otherwise

Clamp final score 0–100.

---

## C. STABILITY LABELS

0–39 → Low
40–69 → Moderate
70–100 → Strong

---

## D. USER-FACING LANGUAGE

Never show formula.

Show:

“Stability is lower than usual today.”
“Recent conflict activity may increase reaction speed.”

If low sleep:

“Low rest often increases sensitivity.”

Keep causal but not deterministic.

---

## E. CONFIDENCE SCORE

If sleep missing:
-5 confidence

If stress missing:
-5 confidence

If fewer than 3 conflict entries total:
-10 pattern confidence

---

# 2️⃣ REPEAT DETECTION CLUSTERING MODEL (RULE-BASED V1)

Goal:

Detect recurring relational loops without ML overreach.

---

## A. WHAT DEFINES A “PATTERN”

A pattern exists if:

Same relationship_id
AND
Same topic_tag OR same escalation_trigger
AND
Occurred ≥ 3 times within 30 days

---

## B. DATA REQUIRED

Each conflict_event must include:

* relationship_id
* topic_tag
* trigger_tag
* timestamp
* severity_score
* time_of_day_bucket
  (morning / afternoon / evening / late_night)

---

## C. CLUSTERING LOGIC

Step 1: Filter last 30 days.
Step 2: Group by:

(relationship_id + trigger_tag)

Step 3: If count ≥ 3:
Mark as recurring_cluster.

---

## D. TIME-BASED PATTERN DETECTION

If:

≥60% of cluster occurs in same time_of_day_bucket

Add timing pattern flag.

Example:

“Most escalations occur after 9PM.”

---

## E. ESCALATION PROGRESSION CHECK

If severity_score trend increases across entries:

Mark as intensifying_pattern.

If decreasing:
Mark as improving_pattern.

---

## F. OUTPUT LANGUAGE RULE

Never:

“You keep doing this.”

Instead:

“This dynamic has appeared several times recently.”

If intensifying:

“The intensity of this pattern has been increasing.”

If improving:

“This pattern appears to be softening.”

---

# 3️⃣ EXACT SUPABASE SCHEMA (PRODUCTION STRUCTURE)

Minimal but scalable.

---

## A. USERS

```sql
create table users (
  id uuid primary key,
  email text unique not null,
  created_at timestamp default now()
);
```

---

## B. RELATIONSHIP_NODES

```sql
create table relationship_nodes (
  id uuid primary key,
  user_id uuid references users(id) on delete cascade,
  name text not null,
  relationship_type text,
  created_at timestamp default now()
);
```

---

## C. CONFLICT_EVENTS

```sql
create table conflict_events (
  id uuid primary key,
  user_id uuid references users(id) on delete cascade,
  relationship_id uuid references relationship_nodes(id) on delete cascade,
  timestamp timestamp not null,
  topic_tag text,
  trigger_tag text,
  severity_score int check (severity_score between 0 and 100),
  stability_score int,
  time_of_day_bucket text,
  resolved boolean default false
);
```

Indexes required:

```sql
create index on conflict_events(user_id);
create index on conflict_events(relationship_id);
create index on conflict_events(timestamp);
```

---

## D. DAILY_STABILITY

```sql
create table daily_stability (
  id uuid primary key,
  user_id uuid references users(id) on delete cascade,
  date date not null,
  sleep_score int,
  stress_score int,
  conflict_density int,
  escalation_avg int,
  stability_score int,
  created_at timestamp default now(),
  unique(user_id, date)
);
```

---

## E. DECISION_EVENTS

```sql
create table decision_events (
  id uuid primary key,
  user_id uuid references users(id) on delete cascade,
  decision_type text,
  timestamp timestamp,
  stability_score int,
  conflict_load int,
  pause_recommended boolean,
  pause_followed boolean
);
```

---

## F. PATTERN_CLUSTERS (Materialized View Option)

Instead of computing every request:

Create daily materialized view.

```sql
create materialized view pattern_clusters as
select
  relationship_id,
  trigger_tag,
  count(*) as occurrence_count
from conflict_events
where timestamp > now() - interval '30 days'
group by relationship_id, trigger_tag
having count(*) >= 3;
```
