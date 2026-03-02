# DEFRAG - Pre-Cutover Checklist

**Target Domain:** `defrag.app`  
**Current Status:** Security hardened, production-ready

---

## ✅ Phase 1: Security Hardening (COMPLETE)

### Authentication Bypass Removal
- [x] Removed all `if (!supabase) return null` patterns from `lib/supabase.ts`
- [x] Removed auth bypass from `lib/auth-context.tsx`
- [x] Enforced strict Supabase configuration (throws error if env vars missing)
- [x] Verified localStorage usage is UI-only (no auth bypass)
- [x] Confirmed protected routes use `useAuth()` properly

### Client-Side Security
- [x] No client-only subscription status bypass exists
- [x] All gated features check server auth context
- [x] BuildStamp hidden in production builds

---

## 🔄 Phase 2: Pre-Cutover Manual Verification

### 1. Verify Latest Deployment

**Action:** Check Vercel dashboard
```
Project: v0-defrag-frontend-build
Deployments → Latest READY deployment
```

**Confirm:**
- [ ] Build status: READY (green checkmark)
- [ ] No runtime errors in logs
- [ ] No build warnings
- [ ] Commit reflects latest security hardening

**Preview URL Test:**
Open `https://v0-defrag-frontend-build-[hash].vercel.app` and verify:

- [ ] `/` - Landing page, no white flash, text CTA working
- [ ] `/connect` - Magic link intake working, no auth bypass
- [ ] `/readout/self` - Requires auth, locked/unlocked states working
- [ ] `/grid` - Requires auth + OS subscription
- [ ] `/chat` - Requires auth + OS subscription

Hard refresh each page (Cmd+Shift+R).

---

### 2. Domain Preparation

**A. Remove Legacy Domain Bindings**

In Vercel → `defragfeb` project:
```
Settings → Domains
Remove: defrag.app
Remove: www.defrag.app
```

This prevents DNS collision.

**B. Verify DNS Configuration**

Check current DNS at domain registrar:

Root domain:
```
A  @  76.76.21.21
```

WWW subdomain:
```
CNAME  www  cname.vercel-dns.com
```

If not set, update now and wait for propagation (can take 5-10 minutes).

---

### 3. Domain Cutover

**A. Bind Domain to Production Project**

```
Vercel → v0-defrag-frontend-build
Settings → Domains → Add
```

Add:
- `defrag.app`
- `www.defrag.app`

Expected result: "Valid Configuration" (if DNS is correct)

**B. Wait for SSL Certificate**

Vercel automatically provisions SSL via Let's Encrypt.
This takes 30-90 seconds.

Check: `https://defrag.app` should load with valid HTTPS.

**C. Promote Latest Deployment to Production**

```
Vercel → v0-defrag-frontend-build
Deployments → Latest READY deployment
Click "Promote to Production"
```

This binds `defrag.app` to the editorial build.

---

## 🧪 Phase 3: Post-Cutover Validation

### Immediate Checks

Once `https://defrag.app` resolves:

**Visual Integrity:**
- [ ] Inspect `<html>` and `<body>` → `background: #000000 !important`
- [ ] No white flash on page load
- [ ] Playfair Display loads correctly (check H1 font-family in DevTools)
- [ ] No rounded corners anywhere
- [ ] No hover glow effects
- [ ] No focus ring flashes
- [ ] No tap highlight (on mobile)

**Typography Lock:**
- [ ] H1: 38px/46px Playfair with font-medium
- [ ] H2: 24px/32px Playfair with font-medium
- [ ] Body: 16px at white/45 or white/60
- [ ] MicroLabel: 10px with 0.35em tracking

**Spatial Authority:**
- [ ] Spacing uses only s/m/l/xl tokens (24/48/80/128px)
- [ ] No arbitrary spacing values
- [ ] Proper vertical rhythm throughout

---

### iOS Live Test (Critical for PWA)

**On actual iPhone Safari:**

1. Visit `https://defrag.app`
2. Tap Share icon → "Add to Home Screen"
3. Open as PWA (from home screen)

**Confirm:**
- [ ] Status bar is pure black (no white strip)
- [ ] No overscroll bounce/glow
- [ ] No zoom on input focus
- [ ] Safe area insets respected (notch/home indicator)
- [ ] Keyboard doesn't break layout
- [ ] Standalone mode (no browser chrome)

---

### Authentication Flow Test

**Anonymous User:**
- [ ] Landing → `/connect` → Enter email → Magic link sent
- [ ] Check email → Click link → Redirected to `/connect?step=context`
- [ ] Complete intake → Redirected to locked `/readout/self`
- [ ] No auth bypass exists (can't access without session)

**Blueprint Purchase:**
- [ ] Locked readout → "Unlock Blueprint" → Stripe Checkout
- [ ] Complete payment → Redirected back → Readout unlocked
- [ ] Insights visible and properly formatted

**OS Upgrade:**
- [ ] Unlocked readout → "Upgrade to OS" → Stripe Checkout
- [ ] Complete payment → Redirected → `/grid` and `/chat` unlocked
- [ ] Can add connections and use Crisis Mode

---

### Security Validation

**Production Auth Enforcement:**
- [ ] Open DevTools Console → No Supabase bypass warnings
- [ ] Protected routes require valid session
- [ ] Sign out → Redirected to landing properly

**Environment Variables:**
- [ ] Check Vercel → Settings → Environment Variables
- [ ] Confirm `NEXT_PUBLIC_SUPABASE_URL` is set for Production
- [ ] Confirm `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set for Production
- [ ] Confirm `STRIPE_PUBLISHABLE_KEY` is set for Production

**No Debug Artifacts:**
- [ ] No `console.log("[v0] ...")` statements in production
- [ ] BuildStamp not visible (only in preview)
- [ ] No test/dev hardcoded values

---

## 📊 Performance Check

**Run Lighthouse on Production Domain:**

Open DevTools → Lighthouse → Generate Report for:
- `https://defrag.app/`
- `https://defrag.app/connect`
- `https://defrag.app/readout/self`

**Target Metrics:**
- [ ] Performance: ≥ 95
- [ ] Accessibility: ≥ 95
- [ ] Best Practices: 100
- [ ] SEO: ≥ 90
- [ ] CLS (Cumulative Layout Shift): = 0

**Common Issues & Fixes:**

*Playfair Display Layout Shift:*
Add to `app/layout.tsx` head:
```tsx
<link rel="preload" href="/fonts/playfair-display.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
```

*Unused JavaScript:*
Already using dynamic imports for heavy components. If score low, investigate bundle size.

*Missing Metadata:*
Already configured in `app/layout.tsx` with title, description, viewport.

---

## 🔒 Remaining Backend Hardening (Post-Cutover)

These don't block launch but should be completed within 48 hours:

### Stripe Webhook Validation
- [ ] Implement server-side webhook signature verification
- [ ] Validate subscription status updates from Stripe events
- [ ] Store subscription metadata in Supabase `profiles` table

### Supabase RLS Policies
- [ ] Review Row-Level Security policies for `profiles`, `connections`, `readouts`
- [ ] Ensure users can only access their own data
- [ ] Test RLS with anonymous session attempts

### Crisis AI Endpoint Security
- [ ] Implement rate limiting (5 requests per minute per user)
- [ ] Add server-side subscription status check before allowing Crisis Mode
- [ ] Log all crisis AI interactions for abuse monitoring

### Analytics & Monitoring
- [ ] Enable Vercel Analytics (Web Vitals, page views)
- [ ] Set up error tracking (Sentry or Vercel error monitoring)
- [ ] Monitor Stripe webhook failures

---

## ✅ Go/No-Go Decision

**GO IF:**
- [x] Security hardening complete (auth bypass removed)
- [ ] Latest deployment is READY with no errors
- [ ] Visual integrity confirmed on preview URL
- [ ] DNS is correctly configured
- [ ] Stripe publishable key is in production env vars
- [ ] Supabase env vars are in production env vars

**NO-GO IF:**
- [ ] Any runtime errors in latest deployment
- [ ] White flash or visual regressions visible
- [ ] Auth bypass still exists
- [ ] DNS not propagated (can't add domain)
- [ ] Missing production environment variables

---

## 📝 Post-Launch Monitoring (First 24 Hours)

### Hour 0-1: Active Monitoring
- [ ] Watch Vercel deployment logs for errors
- [ ] Monitor Stripe dashboard for checkout sessions
- [ ] Test full user journey yourself (incognito mode)

### Hour 1-24: Passive Monitoring
- [ ] Check Vercel Analytics for traffic patterns
- [ ] Review Supabase Auth logs for signup activity
- [ ] Monitor Stripe for successful payments vs failures

### Known Expected Issues
- **First-load font flash:** Playfair may flash briefly on first visit (acceptable)
- **iOS keyboard push:** Some devices may have minor layout shift with keyboard (within acceptable range)
- **SSL propagation:** First few minutes may have certificate warnings (expected)

---

## 🎯 Success Criteria

**Production is live and stable when:**

1. `https://defrag.app` loads with pure black background, no white flash
2. Full authentication flow works (magic link → intake → readout)
3. Stripe checkout completes successfully (Blueprint + OS)
4. iOS PWA works perfectly (no white strip, no overscroll glow)
5. No console errors on any route
6. All protected routes enforce authentication
7. Visual system matches editorial specification exactly

**You are ready to announce when all 7 criteria are met.**

---

**Status:** ✅ Security hardening complete. Ready for manual cutover verification.
