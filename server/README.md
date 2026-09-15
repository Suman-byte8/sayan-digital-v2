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

| Method | Path            | Body                              | Description         |
| ------ | --------------- | ---------------------------------- | -------------------- |
| GET    | `/products`     | —                                   | List (paginated: `?page=&limit=&category=&search=`) |
| GET    | `/products/:id` | —                                   | Get one product     |
| POST   | `/products`     | `{ name, slug, price, ... }`       | Create a product    |
| PUT    | `/products/:id` | any subset of the create fields    | Update a product    |
| DELETE | `/products/:id` | —                                   | Delete a product    |

All responses are JSON: `{ success, data }` on success, `{ success: false, error, details? }` on failure.

`GET /health` — liveness check, returns `{ status: "ok" }`.

## Known dev-tooling advisory

`npm audit` reports 4 high-severity issues in `deepmerge-ts`/`mysql2`, both
transitive dependencies of the `prisma` CLI package itself (pulled in for its
MySQL-provider support, unused here) — not of the running Express server.
`npm audit fix --force` would downgrade `prisma` to 6.x, which breaks this
project's Prisma 7 driver-adapter setup, so it hasn't been applied. Revisit
when Prisma publishes a patched 7.x release.
