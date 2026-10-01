// Sets (or resets) the admin panel's single login. Run from server/:
//   npm run admin:set-credentials -- <username> [password]
// With no password a strong random one is generated and printed ONCE - the
// database only ever stores its bcrypt hash. Also revokes all existing
// admin sessions. The password can later be changed from the admin
// panel's Settings page.
import crypto from "node:crypto";
import "../src/config/env.js";
import { prisma } from "../src/lib/prisma.js";
import { setAdminCredentials } from "../src/lib/admin-auth.js";

const [username, passwordArg] = process.argv.slice(2);

if (!username || !/^[A-Za-z0-9._-]{3,50}$/.test(username)) {
  console.error("Usage: npm run admin:set-credentials -- <username> [password]");
  console.error("Username: 3-50 characters, letters/numbers/. _ -");
  process.exit(1);
}
if (passwordArg && passwordArg.length < 10) {
  console.error("Password must be at least 10 characters.");
  process.exit(1);
}

const generated = !passwordArg;
// Unambiguous alphabet (no 0/O/1/l/I), easy to read out or type.
const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
const password =
  passwordArg ?? Array.from(crypto.randomBytes(16), (b) => alphabet[b % alphabet.length]).join("");

await setAdminCredentials({ username, password, bumpVersion: true });
console.log("\nAdmin login saved.");
console.log(`  Username: ${username}`);
console.log(generated ? `  Password: ${password}   (shown once - store it somewhere safe)` : "  Password: (the one you provided)");
console.log("");
await prisma.$disconnect();
