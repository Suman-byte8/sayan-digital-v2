# Sayan Digital — Admin Panel

Internal admin tool for managing the Sayan Digital product catalog. Next.js
(App Router) + Tailwind CSS v4, same versions/setup as `client/`.

Talks to the `server/` Express API — this app has no database access of its
own, it's a UI over that REST API.

## Setup

1. Get the `server/` API running first (see `server/README.md`) — it must be
   reachable for any page here to load data.
2. `npm install`
3. Copy `.env.example` to `.env.local` (defaults to `http://localhost:4000/api`,
   change `NEXT_PUBLIC_API_URL` if the backend runs elsewhere).
4. `npm run dev` — runs on **http://localhost:3002** (client uses 3000/3001,
   so this avoids a port clash when running both apps at once).

## What's here

- `/products` — table of all products, with edit/delete.
- `/products/new` — create form.
- `/products/[id]/edit` — edit form.
- `src/lib/api.js` — the only place that talks to the backend; every CRUD
  call goes through this one small wrapper.

`noindex, nofollow` is set site-wide (`src/app/layout.js` metadata) since
this is an internal tool, not meant to be publicly discoverable.

## Known follow-up (not implemented yet)

No authentication/login — anyone who can reach this app's URL can edit the
catalog. Fine for local-only use during development; add auth (e.g. a simple
password gate or a real auth provider) before deploying this anywhere
publicly reachable.
