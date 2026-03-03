# DEFRAG Deployment Checklist

Execute this checklist after every release to production (`main` branch) to verify system stability.
Do not mark a release as complete until all items are verified.

## 1. CI & Build Verification
- [ ] CI passed in GitHub Actions (`build-and-test` job)
- [ ] Vercel Production Build passed
- [ ] Latest commit hash matches production deployment

## 2. Core Flows
- [ ] Homepage loads (`www.defrag.app`) without hydration warnings or Layout Shift
- [ ] Magic Link Signup / Login flow works
- [ ] Contact Form successfully submits
- [ ] Payment test via Stripe completes and updates database
- [ ] Dashboard is gated without an active subscription

## 3. Intelligence Layer Validation
- [ ] AI endpoint successfully validates schema (no fallback generic errors)
- [ ] Safety override verified manually via harm-related prompt
- [ ] Conversational memory disabled when toggled off

## 4. Environment & Data Integrity
- [ ] No `500` errors in Vercel Server Logs
- [ ] No `400` errors in browser Console
- [ ] `NODE_ENV` and production API Keys confirm active

## Completion
**Confirmed By:** [Your Name / Jules]
**Commit Hash:** [Hash]
**Date:** [Date]
