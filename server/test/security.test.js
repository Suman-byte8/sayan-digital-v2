// Security regression tests. They never touch a real database: DATABASE_URL
// points at a closed local port, and every request here is rejected (auth,
// validation, rate limit) before any query would run.
// Run with: npm test
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";

process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "postgresql://test:test@127.0.0.1:1/test";
process.env.JWT_SECRET = "test-secret-".padEnd(48, "x");
process.env.CORS_ORIGIN = "https://sayandigital.in";
delete process.env.UPSTASH_REDIS_REST_URL;
delete process.env.UPSTASH_REDIS_REST_TOKEN;

const { default: app } = await import("../src/app.js");
const { productListQuerySchema } = await import("../src/validations/product.schema.js");
const { isAdminRequest } = await import("../src/lib/admin-auth.js");

let server;
let base;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

const customerToken = () => jwt.sign({ sub: "00000000-0000-0000-0000-000000000000" }, process.env.JWT_SECRET);
const bearer = (token) => ({ Authorization: `Bearer ${token}` });

test("customer endpoints reject requests without a token", async () => {
  for (const path of ["/api/cart", "/api/orders", "/api/profile", "/api/addresses", "/api/wishlist", "/api/proofs"]) {
    const res = await fetch(`${base}${path}`);
    assert.equal(res.status, 401, path);
  }
});

test("customer endpoints reject a forged token", async () => {
  const forged = jwt.sign({ sub: "someone" }, "not-the-real-secret");
  const res = await fetch(`${base}/api/cart`, { headers: bearer(forged) });
  assert.equal(res.status, 401);
});

test("admin endpoints reject anonymous and customer tokens", async () => {
  for (const headers of [{}, bearer(customerToken())]) {
    for (const [method, path] of [
      ["GET", "/api/admin/users"],
      ["GET", "/api/admin/orders"],
      ["POST", "/api/products"],
      ["DELETE", "/api/categories/00000000-0000-0000-0000-000000000000"],
      ["POST", "/api/uploads/image"],
    ]) {
      const res = await fetch(`${base}${path}`, { method, headers });
      assert.equal(res.status, 401, `${method} ${path}`);
    }
  }
});

test("a token signed with JWT_SECRET is not accepted as an admin token", async () => {
  const fakeAdmin = jwt.sign({ sub: "admin", typ: "admin", ver: 1 }, process.env.JWT_SECRET);
  const res = await fetch(`${base}/api/admin/users`, { headers: bearer(fakeAdmin) });
  assert.equal(res.status, 401);
  assert.equal(await isAdminRequest({ headers: bearer(fakeAdmin) }), false);
});

test("customer login is rate limited per account", async () => {
  // Missing password -> 400 from validation, so no database is needed; the
  // limiter runs first and must cut in after 10 attempts.
  const attempt = () =>
    fetch(`${base}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "victim@example.com" }),
    });
  for (let i = 0; i < 10; i++) assert.equal((await attempt()).status, 400);
  const blocked = await attempt();
  assert.equal(blocked.status, 429);
  assert.ok(blocked.headers.get("retry-after"));
});

test("CORS only allows configured origins", async () => {
  const allowed = await fetch(`${base}/health`, { headers: { Origin: "https://sayandigital.in" } });
  assert.equal(allowed.headers.get("access-control-allow-origin"), "https://sayandigital.in");
  const denied = await fetch(`${base}/health`, { headers: { Origin: "https://evil.example" } });
  assert.equal(denied.headers.get("access-control-allow-origin"), null);
});

test("health endpoint does not reveal environment details", async () => {
  const body = await (await fetch(`${base}/health`)).json();
  assert.deepEqual(body, { status: "ok" });
});

test("error responses do not leak internals", async () => {
  const res = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{not json",
  });
  const text = await res.text();
  assert.equal(res.status, 400);
  assert.doesNotMatch(text, /at .+\.js:\d+/); // no stack trace
  assert.doesNotMatch(text, new RegExp(process.env.JWT_SECRET));
});

test('product list parses isActive="false" as false (not true)', () => {
  assert.equal(productListQuerySchema.parse({ isActive: "false" }).isActive, false);
  assert.equal(productListQuerySchema.parse({ isActive: "true" }).isActive, true);
  assert.throws(() => productListQuerySchema.parse({ isActive: "yes" }));
  assert.throws(() => productListQuerySchema.parse({ search: "x".repeat(101) }));
});
