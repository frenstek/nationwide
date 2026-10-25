# NPI Expense Tracker

Expense/invoice tracker for Nationwide Projects Investments (NPI). Tracks invoices across three business units: Grocery, Resort, and Servo.

## Tech Stack

- React 19 + Vite 8 + Tailwind CSS 4
- Supabase (PostgreSQL backend, shared DB with nwpi-pm)
- jsPDF for PDF report export
- framer-motion for page transitions
- Single-page app (no router)

## Auth

- Admin password: `npi2026admin` (full CRUD + reports)
- Partner password: `npi2026view` (view-only + reports)
- Stored in sessionStorage

## Database

- Table: `npi_invoices` (see `npi-invoices-migration.sql`)
- Supabase project: pzzdsphxwpywnqkuxutl (shared with nwpi-pm, tables prefixed npi_)

## API

Single endpoint: `/api/npi.js` with `?action=` parameter:
- `setup` (POST) -- creates table
- `list` (GET) -- list invoices with filters
- `stats` (GET) -- aggregate statistics
- `create` (POST) -- create invoice with optional file upload (base64)
- `update` (PATCH) -- update invoice
- `delete` (DELETE) -- delete invoice
- `report` (GET) -- detailed report data

## Environment Variables

Configured on Vercel (server-side):
```
SUPABASE_URL=https://pzzdsphxwpywnqkuxutl.supabase.co
SUPABASE_SERVICE_KEY=<service_role_key>
```

## Deployment

```bash
cd nationwide && npx vercel --prod --yes
```

**Vercel URL:** https://nwpi.au

## Key Notes

- Custom domain: nwpi.au (maintenance mode lifted -- now expense tracker)
- Supabase is shared with the nwpi-pm project (same database, different table prefixes)
- File uploads go to Supabase Storage bucket 'documents' under path 'npi-invoices/'
