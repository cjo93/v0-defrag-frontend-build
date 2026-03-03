# DEFRAG Launch Checklist

## Production Readiness
- [ ] Production URL mapped and resolving
- [ ] Vercel environment variables confirmed and present (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)
- [ ] Sentry `@sentry/nextjs` error monitoring active and tracking
- [ ] In-memory Rate Limiting active on `/api/ai/chat`
- [ ] Supabase client Lazy Initialization confirmed safe from build crashes

## Architecture & Security
- [ ] `[DEFRAG_API]` prefixed structured error logging active
- [ ] GitHub `main` branch protected by CI workflow (`tsc` + `build`)
- [ ] `hideSourceMaps: true` configured securely in Next.js config

## Monetization
- [ ] Stripe LIVE keys activated
- [ ] Webhook signature verification confirmed
- [ ] Subscription gating state persistence active

## Final PR State
- [ ] All remaining divergent PRs closed
- [ ] Documentation merged (SOC2 Mapping, 90-day Hardening)
