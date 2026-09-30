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

## Password-gating with .htaccess (Apache hosting only)

`.htaccess` in this folder adds an HTTP Basic Auth prompt (browser login
popup) in front of the whole app. It only takes effect if this app is
actually served through Apache with `AllowOverride` enabled — traditional
cPanel/shared hosting, or a VPS where Apache reverse-proxies to the Next.js
process. Hosts like Vercel/Railway/Render/Netlify don't run Apache and will
silently ignore the file.

To set it up on an Apache host:

1. From `admin/`, run `npm run htpasswd -- <username>` and enter a password
   at the prompt (input is hidden, nothing is sent anywhere). This writes/
   updates `.htpasswd` with a bcrypt hash in Apache's expected `$2y$` format.
2. Edit `.htaccess`'s `AuthUserFile` line to the **absolute filesystem path**
   to `.htpasswd` on the actual server (Apache needs a real OS path, not a
   URL), e.g. `/home/youruser/public_html/admin/.htpasswd`.
3. `.htpasswd` is gitignored — it holds a real (hashed) credential, so it's
   generated per-deployment, the same way `.env` is never committed.

## Known follow-up (not implemented yet)

No in-app authentication/login — the `.htaccess` Basic Auth above is a
stopgap that only works on Apache hosting. Add real auth (e.g. a login page
backed by the `server/` API, or a proper auth provider) before relying on
this anywhere that isn't behind Apache.
