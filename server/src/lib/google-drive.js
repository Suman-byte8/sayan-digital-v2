import { Readable } from "node:stream";
import { google } from "googleapis";
import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";

let driveClient = null;

function getDriveClient() {
  if (driveClient) return driveClient;

  const { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REFRESH_TOKEN, GOOGLE_DRIVE_FOLDER_ID } =
    env;

  if (
    !GOOGLE_OAUTH_CLIENT_ID ||
    !GOOGLE_OAUTH_CLIENT_SECRET ||
    !GOOGLE_OAUTH_REFRESH_TOKEN ||
    !GOOGLE_DRIVE_FOLDER_ID
  ) {
    throw new ApiError(
      503,
      "Image uploads aren't configured yet — run `npm run drive:auth` in server/ and set the resulting values in server/.env (see server/README.md).",
    );
  }

  // OAuth2 (a real Google account's own consent), not a service account key —
  // some Google Cloud projects have service-account-key creation disabled by
  // an org policy, which this sidesteps entirely.
  const oauth2Client = new google.auth.OAuth2(GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET);
  oauth2Client.setCredentials({ refresh_token: GOOGLE_OAUTH_REFRESH_TOKEN });

  driveClient = google.drive({ version: "v3", auth: oauth2Client });
  return driveClient;
}

// Uploads a file buffer into the shared GOOGLE_DRIVE_FOLDER_ID folder, makes
// it publicly viewable by link, and returns a directly embeddable image URL.
export async function uploadImageToDrive({ buffer, filename, mimeType }) {
  const drive = getDriveClient();

  const { data: file } = await drive.files.create({
    requestBody: {
      name: filename,
      parents: [env.GOOGLE_DRIVE_FOLDER_ID],
    },
    media: {
      mimeType,
      body: Readable.from(buffer),
    },
    fields: "id",
  });

  await drive.permissions.create({
    fileId: file.id,
    requestBody: { role: "reader", type: "anyone" },
  });

  return {
    fileId: file.id,
    // Directly embeddable in an <img>/next/image src, unlike the
    // drive.google.com "view" page URL.
    url: `https://lh3.googleusercontent.com/d/${file.id}`,
  };
}

export async function deleteImageFromDrive(fileId) {
  const drive = getDriveClient();
  await drive.files.delete({ fileId });
}
