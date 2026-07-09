# Akeno

Production-style AI missed-call recovery platform prototype for roofing and home-service businesses.

Akeno turns missed roofing calls into structured leads through instant SMS follow-up, roofing-specific AI intake, urgent leak and storm-damage routing, owner alerts, and CRM or Google Sheets handoff. The project is built as a deployable full-stack SaaS-style demo with a polished frontend, onboarding wizard, client dashboard, lead operations views, integration setup screens, privacy/contact pages, and an n8n-oriented automation architecture.

## Demo

- Local app: `http://localhost:3005`
- Key routes:
  - `/` - marketing site
  - `/onboarding?start=1` - client setup wizard
  - `/dashboard` - recovery operations dashboard
  - `/dashboard/leads` - lead operations table
  - `/demo-chat` - animated missed-call recovery story
  - `/privacy` - privacy policy
  - `/contact` - Akeno Builds contact page
  - `/styleguide` - frontend styleguide

## Screenshots

![Homepage mobile](qa-screenshots/senior-qa-home-mobile-viewport.png)

![Dashboard desktop](qa-screenshots/senior-qa-dashboard-desktop-viewport.png)

![Dashboard mobile menu](qa-screenshots/senior-qa-dashboard-mobile-menu.png)

![Onboarding](qa-screenshots/senior-qa-onboarding-recheck-fixed.png)

## What It Shows

- Responsive frontend across marketing, onboarding, dashboard, legal, and support pages
- Product-grade navigation with desktop and mobile drawer behavior
- Lead operations table with search, status filters, urgency filters, sorting, empty state, and CSV export
- Lead detail drawer with conversation history, urgency handling, recommended next action, and human-confirmation boundary
- Onboarding wizard with step validation, draft save state, review summaries, and generated AI setup rules
- Privacy/contact pages with real Akeno Builds domain emails
- Styleguide page documenting UI foundations, badges, cards, forms, and accessibility notes
- n8n/Twilio/OpenAI/CRM workflow architecture for missed-call automation

## Architecture

```text
Homeowner missed call
  -> Twilio-style webhook
  -> n8n workflow
  -> OpenAI roofing intake guardrails
  -> lead record and conversation summary
  -> urgent owner alert
  -> CRM or Google Sheets handoff
  -> dashboard review and human confirmation
```

## Tech Stack

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- Prisma ORM
- Neon/Postgres-ready schema
- Vercel deployment configuration
- n8n-oriented backend workflow design
- Twilio-style SMS/call routing
- OpenAI-style AI agent instructions
- Google Sheets/CRM handoff model

## AI Guardrails

The product is designed around a practical human-in-the-loop boundary:

- Discuss roofing services only
- Treat active leaks, water intrusion, storm damage, and tarp requests as urgent
- Do not diagnose structural safety
- Do not quote final prices
- Do not promise insurance outcomes
- Capture preferred appointment windows, but require a human to confirm scheduling and service commitments

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3005`.

For production-like database work, use a Postgres `DATABASE_URL`. If `DATABASE_URL` is missing or not a Postgres URL, the app intentionally runs in local sandbox mode with demo leads, dashboard stats, onboarding defaults, and sandbox save/test responses.

## Useful Commands

```bash
npm run build
npm run lint
npm run test:e2e
npm run db:migrate
npm run seed
npx prisma studio
```

## Deploy To Vercel

This app needs a persistent Postgres database in production. Do not deploy it with local SQLite.

1. Create a Postgres database with Neon, Vercel Postgres, Supabase, Render, or Railway.
2. Add environment variables:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
AKENO_ACCESS_USERNAME="akeno"
AKENO_ACCESS_PASSWORD="use-a-real-password"
```

3. Deploy with Vercel.

Vercel uses `npm run vercel-build`, which runs Prisma migrations before building.

## Portfolio Positioning

Use this project as:

```text
A deployed production-style prototype of an AI missed-call recovery platform for roofing businesses, including responsive frontend, onboarding, dashboard, lead operations, AI guardrails, n8n/Twilio/OpenAI workflow design, and CRM/Google Sheets handoff.
```

## Production Hardening Still Needed

This is a strong portfolio/demo project, not a fully hardened production SaaS yet. Before live client traffic, add:

- Real authentication and role-based access
- Tenant isolation for multiple companies
- Twilio webhook signature validation
- Rate limiting on public API routes
- Production OpenAI logging and PII redaction
- Retry queues for SMS, CRM, and webhook failures
- Sentry or equivalent error monitoring
- Full consent and opt-out compliance workflow
- API and end-to-end test coverage in CI
