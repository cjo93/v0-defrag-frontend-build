# DEFRAG Auth & Email Setup Guide

## 1. Supabase Auth Redirects Configuration
To ensure authentication emails correctly route users back to the app on both local development and production environments, configure the following settings in your Supabase Dashboard:

**Navigate to:** `Authentication` -> `URL Configuration`

### Site URL
Must be set to the production domain:
`https://defrag.app`

### Additional Redirect URLs
You must explicitly allow the callback and reset routes for both production and local development:
- `https://defrag.app/auth/callback`
- `https://defrag.app/auth/reset`
- `http://localhost:3000/auth/callback`
- `http://localhost:3000/auth/reset`

---

## 2. Environment Variables
The application uses the `NEXT_PUBLIC_SITE_URL` environment variable to dynamically generate redirect links when sending authentication requests to Supabase.

### Production (Vercel)
In your Vercel project environment variables, set:
`NEXT_PUBLIC_SITE_URL=https://defrag.app`

### Local Development
In your `.env.local` file, set:
`NEXT_PUBLIC_SITE_URL=http://localhost:3000`

---

## 3. Branded Custom SMTP Setup
To send emails from a branded DEFRAG address (e.g., `hello@defrag.app` or `support@defrag.app`) instead of the default Supabase sender, enable Custom SMTP. **Resend** is the recommended provider.

**Navigate to:** `Authentication` -> `SMTP`

1. **Enable Custom SMTP**: Toggle the switch to ON.
2. **Configure Provider Details**: Enter your SMTP server details provided by your email provider (e.g., Resend).
    - Host: `smtp.resend.com`
    - Port: `465` (or `587`)
    - Username: `resend`
    - Password: `<Your Resend API Key>` (Do NOT commit this secret!)
    - Sender Email: `hello@defrag.app` (or `support@defrag.app`)
    - Sender Name: `DEFRAG`

---

## 4. Email Templates
Update the default Supabase email templates to reflect DEFRAG's premium, monochrome branding. Ensure links point to the correct routes and all "powered by Supabase" language is removed.

**Navigate to:** `Authentication` -> `Email Templates`

Ensure the templates for the following are updated using plain, trustworthy wording.

### Confirm Signup
**Subject:** Confirm your DEFRAG account
**Message Body:**
```html
<p>Welcome to DEFRAG.</p>
<p>Please confirm your email address to access your account.</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
```

### Magic Link
**Subject:** Sign in to DEFRAG
**Message Body:**
```html
<p>Use the secure link below to sign in to your DEFRAG account.</p>
<p>This link expires automatically and can only be used once.</p>
<p><a href="{{ .ConfirmationURL }}">Sign in to DEFRAG</a></p>
```

### Reset Password
**Subject:** Reset your DEFRAG password
**Message Body:**
```html
<p>Use the secure link below to reset your password for your DEFRAG account.</p>
<p>This link expires automatically.</p>
<p><a href="{{ .ConfirmationURL }}">Reset password</a></p>
```

*Note: Ensure the generated links in the templates utilize the `{{ .ConfirmationURL }}` parameter so that the correct redirect URLs (passed by the application's `SITE_URL` helper) are applied.*
