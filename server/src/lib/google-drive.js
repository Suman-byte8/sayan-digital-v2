import { Readable } from "node:stream";
import { google } from "googleapis";
import { env } from "../config/env.js";
import { ApiError } from "../utils/api-error.js";

let driveClient = null;

function getDriveClient() {
  if (driveClient) return driveClient;

  if (!env.GOOGLE_SERVICE_ACCOUNT_KEY || !env.GOOGLE_DRIVE_FOLDER_ID) {
    throw new ApiError(
      503,
      "Image uploads aren't configured yet — set GOOGLE_SERVICE_ACCOUNT_KEY and GOOGLE_DRIVE_FOLDER_ID in server/.env (see server/README.md).",
    );
  }

  let credentials;
  try {
    credentials = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_KEY);
  } catch {
    throw new ApiError(500, "GOOGLE_SERVICE_ACCOUNT_KEY is not valid JSON.");
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  driveClient = google.drive({ version: "v3", auth });
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
