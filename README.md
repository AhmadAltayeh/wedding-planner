# Amman Wedding Planner

Mobile-first web app to compare **venues & hotels**, **planners**, **vendors**, **budget** (JOD), and a **checklist** while planning a wedding in Amman, Jordan.

Built with **Next.js**, **Tailwind CSS**, and **Prisma** (SQLite locally).

## Run locally

```bash
npm install
npm run db:push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your phone (same Wi‑Fi) using your computer’s IP, or use the browser devtools mobile view.

### “Internal Server Error” in dev

This usually means the `.next` folder got corrupted — often because **`npm run build` ran while `npm run dev` was still open**. Dev and production builds both write to `.next` and can clash.

Fix:

```bash
# stop the dev server (Ctrl+C), then:
npm run dev:clean
```

Do not run `npm run build` until you’ve stopped `npm run dev`.

## Private access

Set in `.env` (and in Vercel environment variables when you deploy):

- `APP_PASSWORD` — one shared password you and your fiancé use to sign in
- `SESSION_TOKEN` — long random secret (run `openssl rand -hex 32`); do not share this, only the password

When both are set, every page requires login. Share **only** `APP_PASSWORD` with your fiancé.

## Venue photos & menus

Uploads are stored in the `uploads/` folder on disk — works when you run locally on your Mac. Vercel cannot persist local files; for cloud deploy you will need [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) or similar (can be added later).

## Deploy on Vercel (free)

Vercel’s filesystem is read-only, so production needs a hosted database.

### Option A — Turso (recommended, free tier)

1. Create a database at [turso.tech](https://turso.tech).
2. Copy the connection URL (`libsql://...`) and auth token.
3. In Vercel → Project → Settings → Environment Variables:
   - `DATABASE_URL` = your Turso URL (with `?authToken=...` if required by your setup)
4. Push schema once from your machine:

```bash
DATABASE_URL="libsql://..." npx prisma db push
```

5. Connect the GitHub repo to Vercel and deploy.

### Option B — Keep it local only

Run `npm run dev` on your laptop and bookmark it on your phone via LAN, or use a tunnel (ngrok, Cloudflare Tunnel).

## Features

| Tab | What you can track |
|-----|-------------------|
| **Venues** | Per-person price, min/max guests, buffet vs seated, inclusions (food, DJ, lights, tables, chairs, zaffe), hall rental, available dates, priced add-ons |
| **Compare** | Side-by-side estimated totals for your guest count |
| **Planners** | Full / partial / day-of, package price, vendor coordination |
| **Vendors** | Photo, video, florist, cake, makeup, henna, transport, etc. |
| **Budget** | Line items in JOD, estimated vs actual, paid flag |
| **Tasks** | Pre-filled Jordan-focused checklist + your own tasks |
| **Settings** | Couple names, wedding date, guest estimate (drives venue math), total budget |

## Tech

- Next.js App Router + Server Actions
- Prisma ORM + SQLite (dev) / Turso libSQL (prod)
- Responsive layout with bottom navigation and safe-area padding for iPhone
