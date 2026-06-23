# IEEE MIT Bengaluru — Website

The official website and content platform for IEEE MIT Bengaluru — the epicenter
for all society events, articles, and activities. Built as a production-grade,
type-safe base for the full official site.

## Stack

| Layer      | Technology                                                |
| ---------- | --------------------------------------------------------- |
| Framework  | Next.js 16 (App Router) + React 19                        |
| Language   | TypeScript (strict)                                       |
| Styling    | Tailwind CSS v4                                            |
| Database   | Supabase Postgres, accessed via **Drizzle ORM** (server)  |
| Auth       | Supabase Auth (`@supabase/ssr`), role-based admin          |
| Storage    | Supabase Storage (image uploads)                          |
| Validation | Zod                                                       |
| Tests      | Vitest (unit) + Playwright (e2e)                          |
| CI         | GitHub Actions                                            |

## Architecture

- **No client-side database access.** The browser never talks to the database.
  All reads/writes go through a server layer:
  - `db/` — Drizzle schema (`db/schema/*`), client (`db/client.ts`), migrations
    (`drizzle/`), and seed (`db/seed.ts`).
  - `lib/data/*` — the **repository layer**; the only place Drizzle queries live.
    Called from Server Components and Route Handlers.
  - `lib/validations/*` — Zod input schemas (forms/queries).
  - `lib/actions/*` — `'use server'` mutations. Each one: `assertAdmin()` →
    Zod parse → repository write → `revalidatePath()` → redirect.
- **Auth & admin.** `@supabase/ssr` browser/server client split
  (`lib/supabase/*`), session refresh + coarse gating in `proxy.ts`, and
  defense-in-depth role checks: `proxy.ts` → admin layout `requireAdmin()` →
  per-action `assertAdmin()` → Postgres **RLS** (`drizzle/0001_*`).
- **Public pages** (`app/(public)/*`) are Server Components that read the
  repository directly and render dynamically. Filtering/pagination is real,
  server-side `LIMIT/OFFSET` driven by the URL query string.
- **Admin dashboard** (`app/admin/*`) — login at `/admin/login`; the guarded
  dashboard under the `(dashboard)` route group provides CRUD for events,
  articles, societies (+ members), team, announcements, and an inbox.
- **Societies** are data-driven: one dynamic route `app/(public)/societies/[slug]`
  replaces the former 10 near-identical pages.

```
app/
  (public)/            # public site (Navbar + Footer layout)
    page.tsx           # home
    events/  articles/  membership/  societies/  societies/[slug]/
  admin/
    login/             # /admin/login (ungated)
    (dashboard)/       # guarded: requireAdmin() in layout
      page.tsx events/ articles/ societies/ team/ announcements/ inbox/
  auth/                # callback + signout route handlers
components/{public,admin}/
db/{client.ts,schema/,seed.ts}     drizzle/     # migrations
lib/{env,site-config,utils,storage}.ts
lib/{data,validations,actions,auth,supabase}/
tests/{unit,e2e}/
```

## Getting started

### 1. Prerequisites

- Node.js ≥ 20.9
- A Supabase project (free tier is fine)

### 2. Install

```bash
npm install
```

### 3. Configure environment

Copy `.env.example` to `.env.local` and fill in your Supabase values:

```bash
cp .env.example .env.local
```

| Variable                        | Where to find it (Supabase dashboard)                          |
| ------------------------------- | -------------------------------------------------------------- |
| `DATABASE_URL`                  | Database → Connection string → **Transaction pooler** (6543)   |
| `DIRECT_URL`                    | Database → Connection string → **Direct connection** (5432)    |
| `SUPABASE_SERVICE_ROLE_KEY`     | Project Settings → API → `service_role` (secret)               |
| `NEXT_PUBLIC_SUPABASE_URL`      | Project Settings → API → Project URL                           |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API → `anon` public key                     |
| `NEXT_PUBLIC_SITE_URL`          | `http://localhost:3000` for local dev                          |

### 4. Migrate + seed the database

```bash
npm run db:migrate   # applies drizzle/ migrations (schema + RLS + auth wiring)
npm run db:seed      # seeds societies, leadership, CIS members
```

The seed also runs a one-off ETL from a legacy Supabase project if you set
`LEGACY_SUPABASE_DB_URL` (events + articles).

### 5. Create the first admin

1. Create a Storage bucket named **`media`** (public) in the Supabase dashboard
   (used for image uploads).
2. Create an admin user: Supabase dashboard → Authentication → Add user (or sign
   up via the app), then promote them:
   - Set `SEED_ADMIN_EMAIL=<their-email>` in `.env.local` and re-run
     `npm run db:seed`, **or**
   - Run `UPDATE profiles SET role = 'admin' WHERE email = '<email>';` in the SQL
     editor.

### 6. Run

```bash
npm run dev          # http://localhost:3000  (admin at /admin)
```

## Scripts

| Script                | Purpose                                  |
| --------------------- | ---------------------------------------- |
| `npm run dev`         | Dev server                               |
| `npm run build`       | Production build                         |
| `npm run start`       | Run the production build                 |
| `npm run lint`        | ESLint                                   |
| `npm run typecheck`   | `tsc --noEmit`                           |
| `npm run format`      | Prettier write                           |
| `npm test`            | Vitest unit tests                        |
| `npm run test:e2e`    | Playwright e2e (needs a seeded DB)       |
| `npm run db:generate` | Generate a migration from schema changes |
| `npm run db:migrate`  | Apply migrations                         |
| `npm run db:seed`     | Seed the database                        |
| `npm run db:studio`   | Drizzle Studio                           |

## Deployment

Deploy to Vercel (or any Node host). Set all the env vars from `.env.example` in
the host's environment. `next/image` is configured to optimize images served
from your Supabase Storage host (`next.config.ts`).

## Security

⚠️ The previous codebase committed a Supabase URL + anon key to git history
(`src/lib/supabaseClient.js`). This rebuild uses a fresh project and server-only
secrets, but the **old project's keys should be rotated or the project paused**,
since they remain in history.

## Roadmap (phase 2)

Schema and code leave room for: event galleries & RSVPs (tables exist),
full-text search (GIN indexes), keyset pagination, resources/recordings,
real event registrations, a tag taxonomy, and opt-in caching (`use cache` +
tag-based revalidation) once traffic warrants it.
