# PRODUCTION CHECKLIST (SHIP GATE)

Before deploying to production, verify the following are fully passing and verified:

- [ ] Typecheck passes (`pnpm tsc --noEmit` returns zero errors)
- [ ] Build passes (`pnpm build` creates static/dynamic routes with zero errors)
- [ ] Env vars validated (All required vars in Vercel configuration)
- [ ] Stripe webhook verified (Endpoint configured and securely signed)
- [ ] RLS confirmed (Cross-user read isolation verified in Supabase)
- [ ] Cron confirmed (Nightly chronometer executes via `SUPABASE_SERVICE_ROLE_KEY`)
- [ ] Mobile layout verified (Responsive adjustments apply properly)
- [ ] AI rate limit confirmed (No abusive queries bypassing rate limits)

**All items must be strictly verified. The app is not complete until types are clean, build is clean, deploy is clean, Stripe works, and subscription gating is enforced.**
