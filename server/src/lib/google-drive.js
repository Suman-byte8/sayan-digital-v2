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

// Runs a Drive call, translating Google's revoked/expired-token error into
// an actionable message (OAuth apps in "Testing" mode expire tokens after
// 7 days).
async function withDrive(fn) {
  const drive = getDriveClient();
  try {
    return await fn(drive);
  } catch (error) {
    if (error?.message === "invalid_grant" || error?.response?.data?.error === "invalid_grant") {
      driveClient = null;
      throw new ApiError(
        503,
        "Google Drive access has expired. Run `npm run drive:auth` in server/ and update GOOGLE_OAUTH_REFRESH_TOKEN in server/.env, then restart the server.",
      );
    }
    throw error;
  }
}

// Uploads a buffer into the shared GOOGLE_DRIVE_FOLDER_ID folder and makes
// it viewable by anyone with the link. Returns the new file's id.
async function createPublicFile(drive, { buffer, filename, mimeType }) {
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

  return file.id;
}

export async function uploadImageToDrive({ buffer, filename, mimeType }) {
  const fileId = await withDrive((drive) => createPublicFile(drive, { buffer, filename, mimeType }));
  return {
    fileId,
    // Directly embeddable in an <img>/next/image src, unlike the
    // drive.google.com "view" page URL.
    url: `https://lh3.googleusercontent.com/d/${fileId}`,
  };
}

// For documents (e.g. invoice PDFs): returns the Drive "view" page link,
// which is what you share, not an embeddable image URL.
export async function uploadFileToDrive({ buffer, filename, mimeType }) {
  const fileId = await withDrive((drive) => createPublicFile(drive, { buffer, filename, mimeType }));
  return { fileId, url: `https://drive.google.com/file/d/${fileId}/view` };
}

export async function deleteImageFromDrive(fileId) {
  await withDrive((drive) => drive.files.delete({ fileId }));
}
