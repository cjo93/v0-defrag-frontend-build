# DEFRAG — Recommendations & Next Steps

## 1. iOS / Mobile-First Optimization

### PWA Enhancements
- **Splash screen**: Add `apple-touch-startup-image` meta tags for each iOS device size. Current `manifest.json` has `standalone` display — good foundation.
- **Status bar**: Add `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">` to layout.tsx for edge-to-edge feel.
- **Home screen icon**: Ensure 180x180 `apple-touch-icon.png` and 512x512 maskable icon exist.
- **Offline fallback**: Add a service worker (via `next-pwa` or `@serwist/next`) to cache the landing page, auth pages, and design tokens for offline access.

### Touch & Gesture
- All tap targets should be minimum 44x44px (iOS HIG). Audit smaller links in footer and nav.
- Consider `overscroll-behavior: none` on main containers to prevent rubber-band bouncing.
- Add `touch-action: manipulation` to prevent 300ms tap delay on older WebViews.

### Native App Bridge (Future)
- Wrap in Capacitor.js for App Store distribution without rewriting.
- Apple Sign-In already configured via Supabase — required for App Store apps with third-party login.
- Push notifications via Capacitor Push Notifications plugin + Supabase Edge Functions.

---

## 2. Security Hardening

### Immediate
- **Remove `typescript.ignoreBuildErrors: true`** from `next.config.mjs`. This masks type errors that could cause runtime crashes. Fix any type errors it reveals instead.
- **Content Security Policy**: Add CSP headers via `next.config.mjs` `headers()` function. At minimum: `default-src 'self'; script-src 'self' 'unsafe-inline' https://js.stripe.com; frame-src https://js.stripe.com; connect-src 'self' https://*.supabase.co`.
- **Rate limiting**: Already implemented on checkout — extend to `/api/ai/chat` (most expensive endpoint).

### Cloudflare
- **DNS proxy**: Route `defrag.app` through Cloudflare for DDoS protection, SSL termination, and caching.
- **WAF rules**: Block automated scanners and rate-limit `/api/*` routes at the edge (before they hit Vercel).
- **Bot management**: Enable Cloudflare Bot Management to protect auth endpoints from credential stuffing.
- **Page Rules**: Cache static assets (fonts, icons) at the edge with long TTLs.
- **Note**: Vercel + Cloudflare can conflict on SSL — use "Full (strict)" SSL mode in Cloudflare, not "Flexible".

### Data Privacy
- Row-level security is enabled — good. Audit all RLS policies to ensure `user_id = auth.uid()` is enforced on every table.
- Add `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin` headers.
- Implement account deletion endpoint that cascades through all tables (GDPR compliance).

---

## 3. UI/UX Improvements

### Navigation
- Consider a mobile bottom tab bar for authenticated pages (Dashboard, People, Chat, Settings) — standard iOS pattern.
- Add breadcrumbs or section headers on deeper pages.
- The landing page footer links to `/contact` and `/principles` which exist but weren't part of this sprint — verify their content matches the new visual style.

### Animations
- ConstellationMap: Consider adding subtle pulse animation on tension nodes (red glow oscillation).
- Page transitions: Use `framer-motion` `AnimatePresence` with `layoutId` for smooth route transitions.
- Skeleton loading states on dashboard and chat pages — avoid blank white flash.

### Typography
- Geist Sans is the correct choice. Consider bumping body text to 16px minimum on mobile for readability.
- Line height of 1.85 on long-form pages (terms, about, why) is good — maintain this.

### Dark Mode Consistency
- `design-tokens.css` still has `--accent-risk: #e8613a` (orange). Remove or replace with a grey/white variant to maintain monochrome purity.
- Audit all components for any remaining hardcoded colors that aren't in the monochrome palette.

---

## 4. Email Branding (Resend)

### Current State
Supabase sends its own auth emails (confirm, reset) with default branding. `lib/email.ts` uses Resend from `info@defrag.app`.

### Recommended Setup
1. **Custom SMTP in Supabase**: Go to Supabase Dashboard > Authentication > SMTP Settings. Configure Resend as the SMTP provider:
   - Host: `smtp.resend.com`
   - Port: `465`
   - Username: `resend`
   - Password: Your Resend API key
   - Sender: `DEFRAG <info@defrag.app>`
2. **Email templates**: Customize Supabase auth email templates (confirm, reset, magic link) in Dashboard > Authentication > Email Templates. Use minimal dark-themed HTML matching the site aesthetic.
3. **Domain verification**: Ensure `defrag.app` is verified in both Resend and Supabase for deliverability.

---

## 5. Performance

- **Image optimization**: Use `next/image` for any images added in the future. Currently the site is text-heavy which is fast.
- **Font loading**: Geist is loaded via `next/font/google` — already optimized with font-display: swap.
- **Bundle analysis**: Run `ANALYZE=true next build` with `@next/bundle-analyzer` to identify any oversized client bundles.
- **Edge runtime**: Consider `export const runtime = 'edge'` on lightweight API routes like `/api/health` for lower latency.

---

## 6. Broken/Orphaned Routes to Clean Up

- `/connect` and `/blueprint` now redirect to `/dashboard` — consider removing them entirely once confirmed they're not needed.
- `/grid`, `/login`, `/signup` (root-level) — verify these aren't duplicates of `/auth/login` and `/auth/signup`.
- `components/navigation.tsx` was reported as dead code — verify and remove if unused.

---

## 7. Stripe Configuration Checklist

- [ ] Enable Apple Pay in Stripe Dashboard > Settings > Payment Methods
- [ ] Enable Google Pay in Stripe Dashboard > Settings > Payment Methods  
- [ ] Enable Link (Stripe's 1-click checkout) in Dashboard
- [ ] Verify webhook endpoint `https://defrag.app/api/webhooks/stripe` is receiving events
- [ ] Test subscription lifecycle: create, upgrade, downgrade, cancel, reactivate
- [ ] Set up Stripe Customer Portal for self-service subscription management
