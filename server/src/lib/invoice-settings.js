import { prisma } from "./prisma.js";

// Admin-editable defaults for new invoices (Settings page). Stored as one
// JSON row in admin_settings under SETTINGS_KEY, merged over these built-ins
// so a missing/partial row (or a field added later) always has a value.
// An invoice copies these into its own snapshot when created, so changing
// settings never alters an invoice that was already issued.
export const SETTINGS_KEY = "invoice";

export const DEFAULT_INVOICE_SETTINGS = {
  business: {
    nameLine1: "Sayan",
    nameLine2: "Digital.",
    logoUrl: "https://res.cloudinary.com/iopfstic/image/upload/v1789387281/logo.png",
    address: "Gour Road, Mokdumpur, English Bazar,\nMalda, West Bengal 732103",
    phone: "+91-8597507902",
    email: "sayandigital.malda@gmail.com",
    gstin: "",
  },
  paymentInfo: { account: "", accountName: "", bank: "", upi: "" },
  defaults: {
    invoicePrefix: "INV-",
    dueDays: 7,
    thankYou: "Thank you for your Business",
    terms: "Payment is due by the date shown above.",
    notes: "",
    accentColor: "#4a3f94",
    gstEnabled: false,
    gstMode: "INTRA",
    gstRate: 18,
    pricesIncludeGst: false,
    roundOff: true,
  },
};

export async function loadInvoiceSettings() {
  const row = await prisma.adminSetting.findUnique({ where: { key: SETTINGS_KEY } });
  const stored = row?.value ?? {};
  return {
    business: { ...DEFAULT_INVOICE_SETTINGS.business, ...stored.business },
    paymentInfo: { ...DEFAULT_INVOICE_SETTINGS.paymentInfo, ...stored.paymentInfo },
    defaults: { ...DEFAULT_INVOICE_SETTINGS.defaults, ...stored.defaults },
  };
}
