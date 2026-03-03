# DEFRAG Security Overview

DEFRAG is built with privacy and security as its core principles. This document outlines the mechanisms used to protect user data and maintain the integrity of the platform.

## Data Storage Summary

- All data is stored in Supabase (PostgreSQL).
- Each user's data is isolated within their own schema and protected by strict Row Level Security (RLS) policies.
- Data deletion is absolute. When a user deletes their account or requests deletion, a verifiably complete wipe occurs within 24 hours, leaving no lingering records.
- DEFRAG strictly prohibits silent AI model training on user data.

## Encryption in Transit

- All communication between the client (web application) and the backend (Supabase, API routes, Stripe) is encrypted using TLS 1.3.
- The DEFRAG engine requires client-side encryption (AES-GCM) of sensitive birth data before transmission.

## Supabase RLS

Supabase Row Level Security (RLS) enforces authorization at the database level.
- Core tables (`users`, `relationship_nodes`, `conflict_events`, `daily_stability`, `decision_events`) require `auth.uid() = user_id` for all read, write, and delete operations.
- Backend cron jobs and AI pipelines use the `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS securely. This key is strictly kept server-side.

## Stripe Webhook Verification

- Payments are processed securely via Stripe.
- The webhook endpoint `/api/webhooks/stripe` verifies the `Stripe-Signature` header using the `STRIPE_WEBHOOK_SECRET` to ensure the payload originated from Stripe.
- Only after successful verification does the backend update the corresponding user's record using the `session_id` passed in the metadata.

## Secret Handling Rules

- Secrets and API keys must never be hardcoded or committed to version control.
- All environment variables containing sensitive information must be loaded securely via `.env.local` or the hosting provider's secret management system.
- The `SUPABASE_SERVICE_ROLE_KEY` must never be exposed to the client bundle. It is restricted entirely to backend routes.
