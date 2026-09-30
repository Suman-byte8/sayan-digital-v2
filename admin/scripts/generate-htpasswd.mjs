// Creates/updates .htpasswd with a real bcrypt-hashed credential for
// .htaccess's HTTP Basic Auth — run this yourself, it never sends the
// password anywhere. Usage: `npm run htpasswd -- <username>` (from admin/),
// then type the password when prompted (input is hidden).
//
// Apache's own httpd expects the "$2y$" bcrypt prefix specifically; bcryptjs
// produces "$2a$"/"$2b$" hashes, which are byte-for-byte the same algorithm
// under a different historical version tag — swapping the prefix is the
// standard, documented workaround (nginx accepts all three natively, only
// Apache's httpd is picky about it).
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import bcrypt from "bcryptjs";

const HTPASSWD_PATH = path.join(import.meta.dirname, "..", ".htpasswd");

function promptHiddenPassword(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    // readline has no public API for muting echo, so this reaches into the
    // internal write hook directly.
    const originalWriteToOutput = rl._writeToOutput;
    rl._writeToOutput = (str) => {
      if (str.trim() !== question.trim()) return;
      originalWriteToOutput.call(rl, str);
    };
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
  });
}

async function main() {
  const username = process.argv[2];
  if (!username) {
    console.error("Usage: npm run htpasswd -- <username>");
    process.exitCode = 1;
    return;
  }

  const password = await promptHiddenPassword(`Password for "${username}": `);
  if (!password) {
    console.error("Password cannot be empty.");
    process.exitCode = 1;
    return;
  }

  const hash = (await bcrypt.hash(password, 12)).replace(/^\$2[ab]\$/, "$2y$");
  const line = `${username}:${hash}`;

  const existingLines = fs.existsSync(HTPASSWD_PATH)
    ? fs.readFileSync(HTPASSWD_PATH, "utf8").split("\n").filter(Boolean)
    : [];
  const otherLines = existingLines.filter((l) => !l.startsWith(`${username}:`));

  fs.writeFileSync(HTPASSWD_PATH, [...otherLines, line].join("\n") + "\n");
  console.log(`Wrote credentials for "${username}" to ${HTPASSWD_PATH}`);
}

main();
