# Website Audit & Security Remediation Report

**Project:** Sayan Digital: storefront (`client/`, Next.js), admin panel (`admin/`, Next.js on Netlify), API (`server/`, Express 5 + Prisma 7 + Postgres on Render)
**Remediation branch:** `fix/security-remediation`
**Date:** 2026-10-27

This report covers what was checked in source code and local builds. It is not a guarantee that the site is secure. Anything marked as needing production testing has not been verified against the live site.

---

## 1. Summary

| | Count |
|---|---|
| Findings reviewed | 25 |
| Fixed and verified (automated test, audit or lint) | 7 |
| Fixed, verification pending (needs DB-backed or live check) | 4 |
| Partially mitigated | 1 |
| Requires manual configuration | 2 |
| Not fixed: needs your approval, accepted trade-off, or performance work | 10 |
| False positives | 1 |

No secrets were found in git history or tracked files. No credential rotation is required as a result of this audit.

---

## 2. Findings and status

### Security

| ID | Finding | Severity | Root cause | Status | Files changed |
|---|---|---|---|---|---|
| S1 | Dependency advisories (Next.js critical, `proxy-addr` critical, `multer`/`sharp`/`zod`/`body-parser` high) | P1 | Outdated packages | **Fixed and verified**: `npm audit --omit=dev` reports 0 vulnerabilities in all three apps; both Next apps build | `*/package.json`, `*/package-lock.json` |
| S2 | Customer refresh cookie (`SameSite=Lax`) is not sent between `sayandigital.in` and `*.onrender.com`, so sessions likely drop on reload | P1 | Storefront and API are on different sites | **Requires manual configuration**: see §4 | none |
| S3 | No rate limit on customer login, signup, refresh | P1 | Only admin login was limited | **Fixed and verified**: test confirms the 11th login attempt per account gets 429 | `server/src/middleware/rate-limit.js` (new), `server/src/routes/auth.routes.js` |
| S4 | Public `GET /api/products` listed hidden (inactive) products | P2 | Filter only applied when the caller asked for it | **Fixed, verification pending**: anonymous list is now forced to active; admin (valid token) still sees all. Needs a DB-backed check. | `products.controller.js`, `lib/admin-auth.js` |
| B1 | `isActive=false` was parsed as `true` | P2 | `z.coerce.boolean("false") === true` | **Fixed and verified** (unit test) | `validations/product.schema.js` |
| B2 | Prisma errors on any route said "Product not found" / "A product with this…"; concurrent refresh raised an unhandled 404 | P2 | Product-specific messages in the global error handler; `delete` instead of `deleteMany` | **Fixed, verification pending**: the refresh race needs a DB-backed test | `middleware/error-handler.js`, `controllers/auth.controller.js` |
| S5 | Unbounded `search` string (also used as a Redis cache key) | P3 | No max length | **Fixed and verified**: max 100 chars | `validations/product.schema.js` |
| S5b | Malformed JSON body returned 500 | P3 | Body-parser errors fell through to the generic handler | **Fixed and verified**: now 400 (or 413 for oversized bodies) | `middleware/error-handler.js` |
| S6 | One `CORS_ORIGIN` entry has a trailing `/`, so it never matches | P3 | Config typo | **Requires manual configuration**: see §4 | none |
| S7 | `/health` revealed the environment name | P4 | Extra field in the response | **Fixed and verified** | `server/src/app.js` |
| S8 | Deleted user's access token valid for up to 15 min | P4 | Stateless JWT by design | **Not fixed**: accepted trade-off of short-lived JWTs | none |
| H1 | Admin panel had no clickjacking protection or `noindex` header; storefront had no frame protection | P3 | No headers configured | **Fixed, verification pending**: builds pass; check the response headers after deploy | `admin/next.config.mjs`, `client/next.config.mjs` |
| O1 | Checkout accepted products/variants hidden after being added to the cart | P3 | No availability re-check | **Fixed, verification pending**: syntax-checked; checkout flow not tested against a DB | `controllers/orders.controller.js` |
| X1 | Admin `/proxy` path traversal / SSRF | — | — | **False positive**: segments are `encodeURIComponent`-ed, `..` is rejected, the target host is fixed | none |

### Data integrity (not changed, needs approval)

| ID | Finding | Severity | Why not fixed |
|---|---|---|---|
| D1 | Deleting a customer cascades to their orders (`Order.user onDelete: Cascade`) | P1 | Requires a Prisma schema migration on the production database. Proposed: make `Order.userId` nullable with `onDelete: SetNull`. Take a DB backup first. |
| D2 | No indexes on `orders.userId`, `sessions.userId`, `products(type, isActive)` | P3 | Requires a migration (non-destructive, but still a production DB change). |
| D3 | Expired sessions never deleted | P3 | Needs a scheduled job; low urgency. |

### Performance, SEO, quality (outside this security pass)

| ID | Finding | Status |
|---|---|---|
| P1 | Hero video downloaded twice (`preload="auto"` on both crossfade `<video>`s), no poster | Not fixed: performance |
| P2 | Hero video hosted on a third-party upload bucket | Not fixed: move to your own Cloudinary/`public` |
| P3 | Storefront fetches max 100 products per type | Not fixed: fine until the catalog grows |
| P4 | Three `<img>` tags in profile tabs (lint warnings) | Not fixed |
| P5 | Unused 2.1 MB `public/assets/custom_mug_product.png` | Not fixed |
| P6 | Lenis `lerp: 3` (valid range 0–1) | Not fixed |
| Q1 | Admin ESLint linted its own build output (695 false errors) | **Fixed and verified**: `admin/eslint.config.mjs` |
| Q2 | No automated tests | **Partially mitigated**: 9 server security tests added (`server/test/security.test.js`, `npm test`) |

---

## 3. Verification performed

| Command | Result |
|---|---|
| `npm audit --omit=dev` (server, admin, client), before | 9 / 4 / 14 vulnerabilities |
| `npm audit fix` (no `--force`) + `next@16.4.3` | Applied |
| `npm audit --omit=dev`, after | **0 / 0 / 0** |
| `server: npm test` (9 tests) | **9 passed** |
| `server: node --check` on all source files | Passed |
| `client: npx eslint .` | 0 errors, 3 pre-existing `<img>` warnings |
| `admin: npx eslint .` | Passed, no problems |
| `client: npm run build` | Passed (37 pages) |
| `admin: npm run build` | Passed |
| Server boot against a real database | **Not run**: avoided connecting to a live DB |
| Browser test of login, checkout, header presence | **Not run**: do after deploy (§5) |
| Lighthouse / Core Web Vitals | **Not run** |

The security tests cover:
- Anonymous and forged tokens are rejected on customer routes.
- Anonymous and customer tokens are rejected on admin routes.
- A token signed with the customer secret can't pass as an admin token.
- Login rate limiting returns 429.
- CORS rejects unknown origins.
- `/health` returns no environment details.
- Bad JSON returns a 400 with no stack trace or secret in the body.
- `isActive` and `search` are validated correctly.

All of these run without touching a database.

---

## 4. Manual actions required

1. **API custom domain (fixes S2).** This is the most important manual step.
   - Render → the API service → *Settings → Custom Domains* → add `api.sayandigital.in`.
   - Hostinger DNS: add the `CNAME` record Render shows you (`api` → `<service>.onrender.com`).
   - Wait for Render to issue the certificate.
   - Update the storefront host's environment variable `NEXT_PUBLIC_API_URL=https://api.sayandigital.in`, then redeploy the storefront. It's baked in at build time.
   - Update the admin panel's API URL environment variable on Netlify the same way, then redeploy.
2. **CORS (S6).** In Render → Environment, set `CORS_ORIGIN` with no trailing slashes:
   `https://sayandigital.in,https://admin.sayandigital.in,https://adminsayandigital.netlify.app`
3. **Install scripts.** npm now warns that some packages' install scripts are pending approval: `prisma`, `@prisma/engines`, `sharp` and others. Render runs its own `npm install`, so make sure the build still runs `prisma generate` (`postinstall`) and that image uploads work after deploy.
4. **HSTS.** Not enabled. Once HTTPS is confirmed on every subdomain of `sayandigital.in`, consider `Strict-Transport-Security: max-age=31536000` (without `includeSubDomains` at first).

No credential rotation is needed: no secrets were found in tracked files or git history.

---

## 5. Deployment and rollback

- **Order:**
  1. Deploy the API.
  2. Deploy the admin panel.
  3. Deploy the storefront.

  No database migration is included in this branch.
- **After deploy, check:**
  - Customer sign-in, reload `/profile` (S2 is still open until §4.1 is done), add to cart, place a COD order.
  - Admin sign-in, product list shows hidden products, hide/unhide a product.
  - `curl -I https://sayandigital.in` shows `X-Frame-Options: SAMEORIGIN`.
- **Rollback:** redeploy the previous commit on each host. All changes in this branch are code or dependency changes, with no data changes.

## 6. Remaining risks

- S2 (session cookie across sites) stays open until the custom domain is set up.
- D1: deleting a customer still deletes their order history.
- The in-memory rate limiters reset on restart and are per instance. That's fine for one Render instance; switch to Redis if you scale out.
- No full Content-Security-Policy. It was intentionally not added because of Google Analytics and the external image/video hosts; it would need its own audit.
- Customer login/checkout and admin flows were verified by build and unit tests only, not end to end.
