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

- **Local Mac:** files saved in `uploads/`
- **Vercel:** uses [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)

### Enable uploads on Vercel

1. Vercel project → **Storage** → **Create Database** → **Blob**
2. Connect it to this project (adds `BLOB_READ_WRITE_TOKEN` automatically)
3. **Redeploy**
4. Update Turso schema (one time):

```bash
turso db shell wedding-planner < scripts/turso-add-media.sql
```

On a venue page, scroll to **Photo gallery & menu** (right under the title). Planners: **Edit planner** → **Planner photos**.

## Deploy on Vercel (free)

Vercel’s filesystem is read-only, so production needs a hosted database.

### Database: local vs Turso (Vercel)

**`DATABASE_URL` must always be `file:./dev.db` on your Mac** so `prisma db push` works.  
Do **not** put `libsql://` in `DATABASE_URL` — Prisma will error with P1012.

For Vercel, use **separate** Turso variables (runtime):

| Variable | Where |
|----------|--------|
| `DATABASE_URL` | `file:./dev.db` locally only; on Vercel you can omit or set the same (not used when Turso is set) |
| `TURSO_DATABASE_URL` | `libsql://….turso.io` from Turso dashboard |
| `TURSO_AUTH_TOKEN` | Turso database token |

1. Install the **Turso Cloud CLI** (not Homebrew `turso`, which is a different local tool):

```bash
curl -sSfL https://get.tur.so/install.sh | bash
source ~/.zshrc
turso --version
turso auth login
```

If `turso` is still not found, run it directly:

```bash
/Users/ahmad.altayeh/.turso/turso auth login
```

(Add `export PATH="$PATH:$HOME/.turso"` to `~/.zshrc` if needed.)

2. Create a database:
2. Push **schema** to Turso (one time, or after schema changes):

```bash
export TURSO_DATABASE_URL="libsql://YOUR-DB-org.turso.io"
export TURSO_AUTH_TOKEN="your-token"
npm run db:push:turso -- YOUR_DB_NAME
```

(`YOUR_DB_NAME` is from `turso db list`.)

3. On Vercel → Environment Variables, set `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, plus `APP_PASSWORD` and `SESSION_TOKEN`.
4. Connect GitHub and deploy.

Local data is **not** copied automatically — re-enter venues on production or run **`npm run db:sync:turso`** (see below).

### Copy data from your Mac to Turso

If you already added venues locally and want them on Vercel:

```bash
export TURSO_DATABASE_URL="libsql://..."
export TURSO_AUTH_TOKEN="..."
npm run db:push:turso -- wedding-planner   # tables first, if not done yet
npm run db:sync:turso                      # copy rows from prisma/dev.db
```

Uploaded photos/PDFs stay on your Mac unless you use cloud file storage later.

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
