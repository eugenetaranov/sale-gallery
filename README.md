# Sale gallery

A lightweight, buyer-facing gallery for the Airtable **Sale / Items** base — an Airtable
"gallery view" clone with in-page search, category (Kind) filtering, status filtering, sorting,
and an ES/EN/UK/RU description toggle. Next.js (App Router) + Tailwind, deployable to Vercel.

Photos are read **live** from the Airtable API because Airtable's attachment URLs are signed and
expire ~2 h. The page uses ISR (`revalidate = 600`) so image URLs are refreshed every 10 minutes.

Only buyer-facing fields are ever fetched — Retail price, Loss, Recovery %, Notes and Local folder
are never requested from the API.

## Run locally

1. **Create a read-only Airtable token**
   - Go to <https://airtable.com/create/tokens>.
   - Scope: **`data.records:read`**. Access: add the **Sale** base.
   - Copy the token (starts with `pat…`).

2. **Configure env**
   ```bash
   cp .env.local.example .env.local
   # paste your token into AIRTABLE_TOKEN
   ```

3. **Install & run**
   ```bash
   npm install
   npm run dev
   ```
   Open <http://localhost:3000>. By default it shows items with Status **Ready** or **Listed**;
   switch the status dropdown to "Todos los estados" to see everything.

## Deploy to Vercel

1. Push this folder to a GitHub repo (or run `npx vercel`).
2. In the Vercel project, set the three env vars from `.env.local`:
   `AIRTABLE_TOKEN`, `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE_ID`.
3. Deploy. ISR keeps the signed photo URLs fresh in production.

## Data source

- Base **Sale** `appVRg8oE1i6lzT8X`, table **Items** `tblx10ns0xp5ImkWy`.
- Field-id mapping lives in `lib/airtable.ts`.
