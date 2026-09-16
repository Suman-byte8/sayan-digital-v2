# Sayan Digital — Backend API

Express + Prisma ORM REST API, backed by PostgreSQL (Supabase in production).

## Stack

- **Express 5** — HTTP server/routing
- **Prisma 7** (driver adapter mode via `@prisma/adapter-pg` + `pg`) — type-safe Postgres access
- **Zod** — env validation and request validation (body/params/query)
- **helmet**, **cors**, **morgan** — security headers, CORS, request logging

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in `DATABASE_URL`:
   - **Supabase**: Project → Settings → Database → Connection string (use the
     "Transaction" pooler URI for most deployments, or "Session"/direct for a
     long-lived server process).
   - **Local Postgres**: `postgresql://user:password@localhost:5432/dbname`
3. Apply the schema to your database:
   ```bash
   npm run prisma:migrate -- --name init
   ```
   (First run creates the `products` table and a `prisma/migrations` history.
   Use `npm run prisma:deploy` instead in production/CI — it applies existing
   migrations without prompting or generating new ones.)
4. `npm run dev` — starts the API on `http://localhost:4000` (nodemon,
   auto-restarts on file changes).

## Prisma 7 driver-adapter setup (why this looks different from older Prisma)

Prisma 7 removed the schema-level `datasource.url` — the CLI reads the
connection string from `prisma.config.js` (used by `prisma migrate`/`studio`),
and `PrismaClient` at runtime gets it via an explicit driver adapter
(`src/lib/prisma.js`, using `@prisma/adapter-pg`). Both ultimately read the
same `DATABASE_URL` from `.env`. The generated client itself lives in
`src/generated/prisma` (gitignored — regenerate with `npm run prisma:generate`
after any `schema.prisma` change or fresh `npm install`).

## API

Base URL: `http://localhost:4000/api`

| Method | Path             | Body                                    | Description         |
| ------ | ---------------- | ---------------------------------------- | -------------------- |
| GET    | `/products`      | —                                         | List (paginated: `?page=&limit=&category=&search=`) |
| GET    | `/products/:id`  | —                                         | Get one product     |
| POST   | `/products`      | `{ name, slug, price, ... }`             | Create a product    |
| PUT    | `/products/:id`  | any subset of the create fields          | Update a product    |
| DELETE | `/products/:id`  | —                                         | Delete a product    |
| POST   | `/uploads/image` | multipart form, field name `file`        | Upload an image, returns `{ url, fileId }` |

All responses are JSON: `{ success, data }` on success, `{ success: false, error, details? }` on failure.

`GET /health` — liveness check, returns `{ status: "ok" }`.

## Image uploads (Google Drive)

Product images upload to a Drive folder in a real Google account via OAuth2
(**not** a service account key — many Google Cloud projects now have
service-account-key creation disabled by an org policy, `Secure by Default`,
so OAuth sidesteps that entirely). One-time setup:

1. [Google Cloud Console](https://console.cloud.google.com/) → create (or
   pick) a project → **APIs & Services → Library** → enable the
   **Google Drive API**.
2. **APIs & Services → OAuth consent screen** → set it up (External user
   type is fine for a personal/small-business Google account): app name,
   your email as support/developer contact. You don't need to add any scopes
   here or submit for verification.
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
   Application type: **Desktop app**. Name it anything. This gives you a
   **Client ID** and **Client secret** — put those in `.env` as
   `GOOGLE_OAUTH_CLIENT_ID` / `GOOGLE_OAUTH_CLIENT_SECRET`.
4. Run:
   ```bash
   npm run drive:auth
   ```
   This opens your browser to sign in and approve access (use whichever
   Google account you want the product images stored under), then prints
   two lines — paste them into `.env`:
   - `GOOGLE_OAUTH_REFRESH_TOKEN` — long-lived, used to authenticate every
     future upload without signing in again.
   - `GOOGLE_DRIVE_FOLDER_ID` — a "Sayan Digital Product Images" folder the
     script creates in that account's Drive for uploads to live in.
5. **APIs & Services → OAuth consent screen → Publishing status → Publish
   app** (moves it from "Testing" to "In production"). Because this only
   requests the non-sensitive `drive.file` scope (access limited to files
   *this app* creates — never your whole Drive), publishing doesn't require
   Google's verification review. **Do this** — apps left in "Testing" get a
   refresh token that expires after 7 days, so uploads would silently start
   failing a week in otherwise.

Uploaded files are made viewable by "anyone with the link" (required for
them to render as `<img>`s anywhere outside Drive itself) and served back as
`https://lh3.googleusercontent.com/d/<fileId>` — directly embeddable, unlike
Drive's own "view" page URL. Without all four env vars set, every other
endpoint still works; only `POST /uploads/image` responds `503` until
configured.

## Caching (Upstash Redis)

Optional — set `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` (from
your Upstash console → the database → REST API section) in `.env` and the
read-heavy, public catalog endpoints (`GET /products`, `GET /products/:id`,
`GET /products/slug/:slug`, `GET /categories`) cache their results in Redis
instead of hitting Postgres on every request. Without those two vars set,
the server runs exactly as before — every `cached()` call in
`src/lib/cache.js` just falls through to the database, same for a Redis
outage or a free-tier quota being hit mid-request (never fails the request
over it, just stops caching until Redis is reachable again).

- Product/category **list** queries: 60s TTL, no active invalidation on
  write — deliberately, since there's no cheap way to know every filter/page
  combination that might be cached; a short TTL means an edit shows up in a
  listing within a minute, at the cost of exactly one extra Redis read per
  list request (no "check a version key" round trip).
- Single **product lookups** (by id or slug): 300s TTL, actively invalidated
  the moment that product is updated or deleted (including the *old* slug's
  key, if the slug itself changed) — exact keys are cheap to invalidate, so
  there's no reason to wait out the TTL here.
- **Categories list**: 600s TTL, actively invalidated on create/delete
  (admin-only, infrequent writes).

Upstash's free tier is a **monthly command budget** (500K commands, ~16.7K/
day) — every cache GET/SET/DEL counts as one, which is why invalidation is
deliberately narrow (exact keys only, no `SCAN`-based pattern deletion) and
why list queries don't pay for an extra per-request version check.

## Known dev-tooling advisory

`npm audit` reports 4 high-severity issues in `deepmerge-ts`/`mysql2`, both
transitive dependencies of the `prisma` CLI package itself (pulled in for its
MySQL-provider support, unused here) — not of the running Express server.
`npm audit fix --force` would downgrade `prisma` to 6.x, which breaks this
project's Prisma 7 driver-adapter setup, so it hasn't been applied. Revisit
when Prisma publishes a patched 7.x release.
