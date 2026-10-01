import { prisma } from "../lib/prisma.js";
import { SETTINGS_KEY, loadInvoiceSettings } from "../lib/invoice-settings.js";

// No auth - same trust model as the rest of the admin-facing endpoints
// (see admin-users.controller.js).

export async function getInvoiceSettings(req, res) {
  res.json({ success: true, data: await loadInvoiceSettings() });
}

export async function updateInvoiceSettings(req, res) {
  const value = req.validated.body;
  await prisma.adminSetting.upsert({
    where: { key: SETTINGS_KEY },
    create: { key: SETTINGS_KEY, value },
    update: { value },
  });
  res.json({ success: true, data: await loadInvoiceSettings() });
}
