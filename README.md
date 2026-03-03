# DEFRAG

**DEFRAG** helps individuals and families understand the deeper patterns beneath conflict, authority, and reinforcement. It reveals the structural blueprint of your relationships.

## Who it is for

DEFRAG is built for individuals seeking clarity in their relationships, those working to break repetitive conflict loops, and anyone who wants a grounded understanding of how family dynamics and timing influence their daily interactions.

## What problem it solves

When conflicts repeat, it often feels personal. DEFRAG removes the emotional noise by revealing the underlying structure of interactions. Instead of blaming individuals, DEFRAG shows how relational patterns are built and maintained, offering a clear path toward understanding and stability.

## How it works

DEFRAG combines an assessment of relational structures with timing data to map out individual baseline behaviors and stress responses.
By translating these complex structures into simple, calm, and actionable observations, it helps you recognize when a loop is occurring so you can pause, reflect, and choose a different response.

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19
- **Styling**: Tailwind CSS v4, custom design tokens
- **Database / Auth**: Supabase (PostgreSQL with strict RLS)
- **Language**: TypeScript
- **Payments**: Stripe

## Setup Instructions

1. Clone the repository.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up your `.env.local` file (see below).
4. Run the development server:
   ```bash
   pnpm dev
   ```

## Environment Variables

Create a `.env.local` file with the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

NEXT_PUBLIC_API_BASE_URL=https://api.defrag.app
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_SUPPORT_EMAIL=info@defrag.app

RESEND_API_KEY=your-resend-api-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

## Deployment Instructions

DEFRAG is designed to be deployed on Vercel.

1. Connect your repository to a new Vercel project.
2. Add the required environment variables in the Vercel dashboard.
3. Vercel will automatically build and deploy the application on push to the `main` branch.

## Production Checklist

- All environment variables must be securely set.
- Supabase Row Level Security (RLS) policies must be active and strictly limit cross-user data access.
- `SUPABASE_SERVICE_ROLE_KEY` must never be exposed to the client.
- Ensure the nightly chronometer job is scheduled and authorized.
- Confirm Stripe webhooks are properly configured and securely handled.
