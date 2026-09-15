// One-time helper: exchanges your Google login (via OAuth2 consent) for a
// long-lived refresh token, so the server can upload to Drive as your own
// account instead of a service account key, then creates the destination
// Drive folder using that same grant and prints both values to paste into
// server/.env. Run with:
//   npm run drive:auth
// Requires GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET already set
// in server/.env (create an OAuth Client ID, type "Desktop app", in Google
// Cloud Console → APIs & Services → Credentials first — see server/README.md).
import "dotenv/config";
import http from "node:http";
import { exec } from "node:child_process";
import { google } from "googleapis";

const PORT = 53682;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;

const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error(
    "Set GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET in server/.env first, then re-run this script.",
  );
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  // Forces the consent screen every time, which guarantees Google issues a
  // refresh_token (it's otherwise only issued on a user's very first consent).
  prompt: "consent",
  // drive.file (not the broader "drive" scope) - only ever touches files
  // this app itself creates. Non-sensitive, so it doesn't require Google's
  // OAuth verification review even once the consent screen is published.
  scope: ["https://www.googleapis.com/auth/drive.file"],
});

function openInBrowser(url) {
  const command =
    process.platform === "win32"
      ? `start "" "${url}"`
      : process.platform === "darwin"
        ? `open "${url}"`
        : `xdg-open "${url}"`;
  exec(command, () => {});
}

console.log("\nOpen this URL, sign in with the Google account you want Drive uploads to use,");
console.log("and approve access:\n");
console.log(authUrl, "\n");
openInBrowser(authUrl);

const server = http.createServer(async (req, res) => {
  if (!req.url.startsWith("/oauth2callback")) {
    res.writeHead(404).end();
    return;
  }

  const url = new URL(req.url, REDIRECT_URI);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    res.writeHead(400, { "Content-Type": "text/plain" }).end(`Authorization failed: ${error}`);
    console.error(`\nAuthorization failed: ${error}`);
    server.close(() => process.exit(1));
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
      res
        .writeHead(200, { "Content-Type": "text/plain" })
        .end("No refresh token returned — see the terminal.");
      console.warn(
        "\nNo refresh_token was returned — this Google account likely already has an active grant for" +
          " this app. Revoke it at https://myaccount.google.com/permissions (find this app's name) and" +
          " run this script again.",
      );
      server.close(() => process.exit(1));
      return;
    }

    // Create the destination folder with this same token so the app "owns"
    // it (drive.file scope only grants access to files/folders the app
    // itself created - it can't write into a folder it didn't create).
    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const { data: folder } = await drive.files.create({
      requestBody: {
        name: "Sayan Digital Product Images",
        mimeType: "application/vnd.google-apps.folder",
      },
      fields: "id",
    });

    res
      .writeHead(200, { "Content-Type": "text/plain" })
      .end("Success — you can close this tab and go back to the terminal.");

    console.log("\nAdd these to server/.env:\n");
    console.log(`GOOGLE_OAUTH_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log(`GOOGLE_DRIVE_FOLDER_ID=${folder.id}\n`);
    console.log(
      `(Created a "Sayan Digital Product Images" folder in this account's Drive to hold uploads.)\n`,
    );
  } catch (tokenError) {
    res.writeHead(500, { "Content-Type": "text/plain" }).end("Something failed — check the terminal.");
    console.error("\nFailed:", tokenError.message);
  } finally {
    server.close(() => process.exit(0));
  }
});

server.listen(PORT, () => {
  console.log(`Waiting for the browser redirect on http://localhost:${PORT} ...`);
});
