# Deployment Environment Variables

This project requires the following Vercel environment variables.

## Required (Preview + Production)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (sensitive)
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (if Turnstile is enabled)

## Stripe (if checkout is enabled)
- `STRIPE_SECRET_KEY` (sensitive)
- `STRIPE_WEBHOOK_SECRET` (sensitive)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## Runtime behavior when missing
- Server routes return `503 { ok: false, error: "misconfigured" }`.
- Authenticated API routes may return `401` when user session is absent.
- `scripts/verify-dev-auth.mjs` auto-skips if required Supabase env vars are not set.

## Minimal setup flow (Vercel)
1. Open project settings in Vercel.
2. Add the variables above to Preview and Production scopes.
3. Redeploy preview and verify `/auth/login`, `/auth/signup`, `/api/system-map`, `/api/daily-briefing`, `/api/live-state`.
