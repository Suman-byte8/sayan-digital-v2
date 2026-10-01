import { addDaysYmd, todayYmd } from "@/lib/invoice-format";

// Shop details used the very first time, before any invoice exists to copy
// from. After that, each new invoice starts from the previous one's
// business/payment/terms (see the server's /invoices/defaults).
const FALLBACK_BUSINESS = {
  nameLine1: "Sayan",
  nameLine2: "Digital.",
  address: "Gour Road, Mokdumpur, English Bazar,\nMalda, West Bengal 732103",
  phone: "+91-8597507902",
  email: "sayandigital.malda@gmail.com",
  gstin: "",
  logoUrl: "https://res.cloudinary.com/iopfstic/image/upload/v1789387281/logo.png",
};
const EMPTY_PAYMENT = { account: "", accountName: "", bank: "", upi: "" };

export const EMPTY_ITEM = { description: "", details: "", hsn: "", unitPrice: "", qty: "1", gstRate: "" };

export function blankInvoice(defaults) {
  const issueDate = todayYmd();
  return {
    invoiceNumber: defaults?.invoiceNumber ?? "INV-0001",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    clientAddress: "",
    clientGstin: "",
    issueDate,
    dueDate: addDaysYmd(issueDate, 7),
    items: [{ ...EMPTY_ITEM }],
    gstEnabled: false,
    gstMode: "INTRA",
    gstRate: 18,
    pricesIncludeGst: false,
    discountType: "PERCENT",
    discountValue: "",
    roundOff: true,
    amountPaid: "",
    business: { ...FALLBACK_BUSINESS, ...(defaults?.business ?? {}) },
    paymentInfo: { ...EMPTY_PAYMENT, ...(defaults?.paymentInfo ?? {}) },
    notes: "",
    terms: defaults?.terms ?? "Payment is due by the date shown above.",
    thankYou: defaults?.thankYou ?? "Thank you for your Business",
    accentColor: defaults?.accentColor ?? "#4a3f94",
    driveUrl: "",
  };
}

// API (nulls, numbers) -> editor state (strings for every typed input).
export function fromApi(invoice) {
  return {
    invoiceNumber: invoice.invoiceNumber,
    clientName: invoice.clientName,
    clientPhone: invoice.clientPhone ?? "",
    clientEmail: invoice.clientEmail ?? "",
    clientAddress: invoice.clientAddress ?? "",
    clientGstin: invoice.clientGstin ?? "",
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate ?? "",
    items: invoice.items.map((item) => ({
      description: item.description,
      details: item.details ?? "",
      hsn: item.hsn ?? "",
      unitPrice: String(item.unitPrice),
      qty: String(item.qty),
      gstRate: item.gstRate == null ? "" : String(item.gstRate),
    })),
    gstEnabled: invoice.gstEnabled,
    gstMode: invoice.gstMode,
    gstRate: invoice.gstRate,
    pricesIncludeGst: invoice.pricesIncludeGst,
    discountType: invoice.discountType,
    discountValue: Number(invoice.discountValue) ? String(invoice.discountValue) : "",
    roundOff: invoice.roundOff,
    amountPaid: Number(invoice.amountPaid) ? String(invoice.amountPaid) : "",
    business: { ...FALLBACK_BUSINESS, ...invoice.business },
    paymentInfo: { ...EMPTY_PAYMENT, ...invoice.paymentInfo },
    notes: invoice.notes ?? "",
    terms: invoice.terms ?? "",
    thankYou: invoice.thankYou ?? "",
    accentColor: invoice.accentColor,
    driveUrl: invoice.driveUrl ?? "",
  };
}

const num = (v) => (v === "" || v == null || !Number.isFinite(Number(v)) ? 0 : Number(v));

// Editor state -> API body. Blank item rows are dropped (the editor always
// keeps one empty row to type into).
export function toPayload(inv) {
  const { driveUrl: _driveUrl, ...rest } = inv;
  return {
    ...rest,
    dueDate: inv.dueDate || null,
    gstRate: num(inv.gstRate),
    discountValue: num(inv.discountValue),
    amountPaid: num(inv.amountPaid),
    items: inv.items
      .filter((item) => item.description.trim())
      .map((item) => ({
        description: item.description,
        details: item.details,
        hsn: item.hsn,
        unitPrice: num(item.unitPrice),
        qty: item.qty === "" ? 1 : num(item.qty),
        gstRate: item.gstRate === "" ? null : num(item.gstRate),
      })),
  };
}
