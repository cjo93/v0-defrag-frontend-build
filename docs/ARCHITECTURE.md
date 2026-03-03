# DEFRAG Architecture

This document provides a technical overview of DEFRAG's infrastructure and components.

## Folder Structure Overview

```
.
├── app/
│   ├── api/          # Serverless endpoints and backend logic
│   ├── auth/         # Login and authentication views
│   ├── chat/         # AI Chat interface
│   ├── components/   # UI and layout components
│   ├── styles/       # Tailwind v4 configuration and design tokens
│   └── (dashboard)   # Core feature modules (Live Map, Daily Listen, Learn)
├── components/       # Shared UI components (e.g., Shadcn UI)
├── docs/             # Technical and platform documentation
├── hooks/            # Custom React hooks
├── lib/              # Core business logic and integrations
│   ├── ai/           # AI response schemas and prompts
│   ├── engine/       # Deterministic rule-based stability and timing logic
│   ├── supabase/     # Supabase client and server configuration
│   └── api.ts        # Internal API client
└── public/           # Static assets
```

## API Routes

- **/api/ai/chat**: Orchestrates AI interactions, handles strict output validation against schemas, and acts as the anti-drift translation layer. This route uses the Node runtime.
- **/api/checkout**: Securely initiates Stripe checkout sessions with the authenticated user’s metadata.
- **/api/webhooks/stripe**: Listens for `checkout.session.completed` events from Stripe to update user records.
- **/api/contact**: A secured and rate-limited endpoint for contact form submissions.

## Auth Flow

DEFRAG relies on Supabase for a hybrid authentication approach:

1. **Sign-up/Login**: Users authenticate using a password or a magic link.
2. **Session Storage**: Supabase securely manages sessions. The application leverages `@supabase/ssr` to share session state across server and client boundaries.
3. **Protection**: Middleware intercepts requests to `/app/*` and redirects unauthenticated users back to `/auth/login`.

## Stripe Flow

1. The user requests premium access or additional features via `/api/checkout`.
2. A Stripe checkout session is created, injecting the `session_id` into the metadata.
3. Upon successful payment, Stripe triggers the `/api/webhooks/stripe` endpoint.
4. The webhook verifies the event using the `STRIPE_WEBHOOK_SECRET` and uses the metadata to correctly identify and update the user in Supabase.

## Cron Flow (Chronometer)

A daily chronometer (cron job) executes every night at 00:00 local time.
- It calculates daily stability scores and updates timing data for each user.
- These calculations use purely rule-based, deterministic logic found in `lib/engine/`.
- Heavy aggregations (like repeat detection) are computed, and results are persisted into user-isolated daily stability tables.
- This job must use the Supabase Service Role Key as it performs backend background operations across all users.

## AI Request Lifecycle

1. A user submits input via the Chat interface.
2. The request is processed by the 3-layer defense mechanism (Signal Packet, Zod schema validation, Disclosure Guard).
3. The AI orchestrator (`/api/ai/chat`) runs with temperature 0.0 to act as an anti-drift translator. It structures the structured JSON output into plain-English UI components.
4. The output is validated against `DefragCrisisResponseSchema`.
5. If the AI hallucinates or produces unsafe output, the request fails closed and is regenerated or rejected.

## Supabase Schema Summary

- **users**: Stores authentication metadata and profile preferences.
- **relationship_nodes**: Defines relational structures and baseline behaviors between users.
- **conflict_events**: Logs interactions or specific trigger points for pattern recognition.
- **daily_stability**: Stores calculated daily stability metrics and historical timing data.
- **decision_events**: Logs key choices for further analysis and reinforcement.
- **pattern_clusters**: A materialized view aggregating conflict events into recognizable patterns.

## RLS Enforcement Explanation

Row Level Security (RLS) is strictly enforced on all core tables. The foundational rule is `auth.uid() = user_id`, guaranteeing that a user can only ever access their own data. Any operation requiring access across users, such as the Chronometer job or the Stripe webhook, must use the `SUPABASE_SERVICE_ROLE_KEY` securely on the server side, ensuring that the client never has elevated privileges.
