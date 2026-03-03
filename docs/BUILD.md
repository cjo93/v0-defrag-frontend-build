# DEFRAG Build & Deployment

## Requirements

- Node.js >= 18.x
- `pnpm` >= 8.x

## Install Steps

Clone the repository and install the dependencies:

```bash
git clone https://github.com/your-username/defrag.git
cd defrag
pnpm install
```

## Local Dev Steps

Start the Next.js development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Required Env Vars

You must configure the following environment variables in a `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Internal API Client
NEXT_PUBLIC_API_BASE_URL=https://api.defrag.app
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_SUPPORT_EMAIL=info@defrag.app

# Email and Payments
RESEND_API_KEY=your-resend-api-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

## Production Build Steps

To manually build the application for production:

```bash
pnpm build
```

This command generates an optimized version of your application in the `.next` directory.

## Vercel Deployment Steps

DEFRAG is optimized for Vercel.

1. Import the repository into your Vercel account.
2. Under "Environment Variables", add all the keys from the list above.
3. Ensure the `Framework Preset` is set to Next.js.
4. Click **Deploy**. Vercel will handle the rest, automatically applying the `pnpm build` command.

## Common Failure Troubleshooting

- **Supabase Connectivity**: Double-check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Verify that RLS policies are not unintentionally blocking your queries.
- **Tailwind CSS Issues**: Ensure that `app/globals.css` properly imports `tailwindcss` and your design tokens. Custom colors or spacing not rendering is often a sign of a missing token import or syntax error in `app/styles/tokens.css`.
- **Stripe Webhooks**: Ensure the `STRIPE_WEBHOOK_SECRET` is set in your Vercel environment variables. You can test webhooks locally using the Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.
- **AI Route Failures**: Ensure that any routes depending on OpenAI streaming are explicitly using the Node runtime and not `edge`.
