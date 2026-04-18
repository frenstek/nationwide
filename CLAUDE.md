# Nationwide Projects

Marketing website and estimator tool for Nationwide Projects (NWPI) -- a construction company. Features a public-facing marketing site, project estimator, and inclusions list.

## Tech Stack

- React 19 + Vite 8 + Tailwind CSS 4
- Supabase (PostgreSQL backend)
- Single-page app

## Setup

```bash
git clone https://github.com/kraegeronimo-tech/nationwide.git
cd nationwide
npm install
npm run dev
```

## Environment Variables

Environment variables are configured on Vercel only (server-side API functions):

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

> These are server-only variables -- not exposed to the client.

## Deployment

```bash
npx vercel --prod --yes
```

**Vercel URL:** https://nwpi.au

## Features

- Marketing site with company info
- Project estimator tool
- Inclusions list

## Key Notes

- Custom domain: nwpi.au
- Supabase is shared with the nwpi-pm project (same database, different table prefixes).
