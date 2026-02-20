# DEFRAG Production Deployment Checklist

**Target:** `defrag.app`  
**Date:** [Fill in deployment date]

---

## Pre-Deployment Verification

### 1. Environment Variables (Vercel Dashboard)

**Production Scope** (Required for defrag.app):
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Set to production Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Set to production anon key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Set to production service role key
- [ ] `STRIPE_SECRET_KEY` - Set to `sk_live_xxx` (NOT test key)
- [ ] `STRIPE_WEBHOOK_SECRET` - Set to `whsec_xxx` (production webhook)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Set to `pk_live_xxx`
- [ ] `NEXT_PUBLIC_VERCEL_ENV` - Should auto-set to `production`

**Preview Scope** (Optional but recommended):
- [ ] Same variables as above OR accept auth screens won't function in preview

### 2. Visual System Check

Test these surfaces on the **latest deployment URL** (not defrag.app yet):
- [ ] `/` - Landing page with correct typography, no chrome
- [ ] `/connect` - All 4 steps (email → verify → context → baseline)
- [ ] `/readout/self` - Locked and unlocked states
- [ ] `/grid` - Connection list with editorial styling
- [ ] `/chat` - Crisis console with 5-field responses

**Visual Standards:**
- Pure black backgrounds (`#000000`)
- Playfair Display headlines
- No rounded corners or glow effects
- Border-bottom inputs only
- Text action buttons (no filled backgrounds)

### 3. Clean Build

In Vercel Dashboard:
1. [ ] Navigate to Project → Deployments
2. [ ] Select latest deployment
3. [ ] Click "Redeploy"
4. [ ] Choose **"Redeploy without cache"**
5. [ ] Wait for status: ✅ Ready

### 4. Domain Configuration

**A. Assign Domain in Vercel**

In Vercel → Project → Settings → Domains:
1. [ ] Add `defrag.app` as primary domain
2. [ ] Add `www.defrag.app` (Vercel will auto-redirect to apex)
3. [ ] Verify which project currently owns defrag.app

**B. DNS Configuration** (only if not using Vercel nameservers)

At your DNS provider:
- [ ] A record: `@` → `76.76.21.21`
- [ ] CNAME: `www` → `cname.vercel-dns.com`
- [ ] TTL: 3600 seconds

### 5. Stripe Webhook Update

Update Stripe webhook endpoint:
- [ ] Change from: `https://[preview].vercel.app/api/webhook/stripe`
- [ ] Change to: `https://defrag.app/api/webhook/stripe`
- [ ] Verify webhook secret matches `STRIPE_WEBHOOK_SECRET` env var

---

## Post-Deployment Verification

### Critical Flows (Test on defrag.app)

**1. Sign Up → Onboarding**
- [ ] Enter email on `/connect`
- [ ] Receive magic link
- [ ] Click link → redirects to context step
- [ ] Complete context (city + timezone)
- [ ] Complete baseline (DOB + birth city)
- [ ] Redirects to `/readout/self`

**2. Blueprint Purchase**
- [ ] See locked state on `/readout/self`
- [ ] Click "Unlock Blueprint"
- [ ] Stripe checkout opens with $11 one-time price
- [ ] Complete test purchase
- [ ] Redirects back → readout now shows insights
- [ ] Refresh page → readout still unlocked (persisted in DB)

**3. OS Upgrade**
- [ ] See upgrade CTA at bottom of `/readout/self`
- [ ] Click "Upgrade to OS"
- [ ] Stripe checkout opens with $33/month subscription
- [ ] Complete test purchase
- [ ] Redirects back
- [ ] Navigate to `/grid` → should see interface (not locked)
- [ ] Navigate to `/chat` → should see input (not locked)

**4. Connection Management**
- [ ] On `/grid`, click "Add person"
- [ ] Form expands inline
- [ ] Fill: name, DOB, birth time (optional), relationship type
- [ ] Submit → connection appears in list with tether line
- [ ] Click connection → navigates to `/readout/[id]`
- [ ] Readout shows connection insights with editorial styling

**5. Crisis Chat**
- [ ] Navigate to `/chat`
- [ ] Enter situation: "Partner said they need space"
- [ ] Submit
- [ ] Response appears with 5 labeled sections:
  - Headline (Playfair 24px)
  - What's happening
  - Do this now
  - Avoid
  - Say this
- [ ] No algorithm/scoring language appears in response
- [ ] All sections use editorial typography

### Security Validation

- [ ] Navigate to `/grid` without auth → redirects to `/connect`
- [ ] Navigate to `/chat` without OS subscription → shows locked screen
- [ ] Inspect Network tab → no API keys visible in responses
- [ ] Check Console → no Supabase warnings (production has strict config)
- [ ] Verify BuildStamp is hidden in production (check bottom-right corner)

### iOS/Mobile Check

- [ ] Open `defrag.app` on iPhone Safari
- [ ] Add to Home Screen
- [ ] Launch from home screen → opens in standalone mode (no Safari chrome)
- [ ] Black status bar with white text
- [ ] No scroll bounce on inputs
- [ ] No zoom on input focus
- [ ] Safe area insets respected (notch/home indicator)

### Performance Benchmarks

Use Vercel Analytics or Chrome DevTools:
- [ ] First Contentful Paint: < 1.5s
- [ ] Largest Contentful Paint: < 2.5s
- [ ] Time to Interactive: < 3.5s
- [ ] Cumulative Layout Shift: < 0.1

---

## Rollback Procedure

If critical issues are found after cutover:

1. **Immediate**: Revert domain in Vercel
   - Settings → Domains → Remove `defrag.app`
   - This makes preview URL primary again

2. **Fix**: Address issues on preview deployment
   - Make code changes
   - Test thoroughly on preview URL
   - Verify all 5 critical flows work

3. **Retry**: Re-assign `defrag.app` when ready
   - Follow deployment checklist again

---

## Post-Launch Monitoring (48 hours)

### Error Tracking
- [ ] Vercel Dashboard → Logs → Filter: Errors
- [ ] Check for auth failures
- [ ] Check for Stripe webhook failures
- [ ] Check for Supabase connection errors

### User Flow Analytics
- [ ] Monitor sign-up completion rate
- [ ] Monitor Blueprint purchase conversion
- [ ] Monitor OS upgrade conversion
- [ ] Monitor time-to-first-connection

### Performance Monitoring
- [ ] Vercel Analytics → Speed Score
- [ ] Check for any regressions vs preview

---

## Emergency Contacts

**Vercel Support**: [vercel.com/help](https://vercel.com/help)  
**Stripe Support**: [dashboard.stripe.com](https://dashboard.stripe.com)  
**Supabase Support**: [supabase.com/dashboard](https://supabase.com/dashboard)

---

## Sign-Off

- [ ] All pre-deployment checks passed
- [ ] Clean build completed successfully
- [ ] All 5 critical flows tested on defrag.app
- [ ] Security validation passed
- [ ] iOS/mobile check passed
- [ ] Performance benchmarks met

**Deployed by:** ___________________  
**Date:** ___________________  
**Deployment ID:** ___________________  
**Git SHA:** ___________________
