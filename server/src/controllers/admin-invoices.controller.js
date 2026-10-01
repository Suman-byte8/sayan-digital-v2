import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { calcInvoice } from "../lib/invoice-calc.js";
import { loadInvoiceSettings } from "../lib/invoice-settings.js";
import { deleteImageFromDrive, uploadFileToDrive } from "../lib/google-drive.js";

// No auth - same trust model as the rest of the admin-facing endpoints
// (see admin-users.controller.js).

const ymd = (date) => (date ? date.toISOString().slice(0, 10) : null);

function serializeInvoice(invoice) {
  return {
    ...invoice,
    issueDate: ymd(invoice.issueDate),
    dueDate: ymd(invoice.dueDate),
    gstRate: Number(invoice.gstRate),
    discountValue: Number(invoice.discountValue),
    subtotal: Number(invoice.subtotal),
    discountAmount: Number(invoice.discountAmount),
    taxAmount: Number(invoice.taxAmount),
    total: Number(invoice.total),
    amountPaid: Number(invoice.amountPaid),
    balanceDue: Number(invoice.balanceDue),
  };
}

// Every stored money column comes from the server-side calculation, never
// from the request body.
function buildData(body) {
  const calc = calcInvoice(body);
  return {
    ...body,
    subtotal: calc.subtotal,
    discountAmount: calc.discountAmount,
    taxAmount: calc.taxAmount,
    total: calc.total,
    amountPaid: calc.amountPaid,
    balanceDue: calc.balanceDue,
    status: calc.status,
  };
}

function rethrowDuplicateNumber(error) {
  if (error?.code === "P2002") {
    throw new ApiError(409, "An invoice with this number already exists");
  }
  throw error;
}

// "INV-0007" -> "INV-0008" (keeps the zero padding of the most recent
// invoice with that prefix); falls back to <prefix>0001.
function nextNumberAfter(last, prefix) {
  const match = last?.match(/^(.*?)(\d+)$/);
  if (!match) return `${prefix}0001`;
  const [, , digits] = match;
  return `${prefix}${String(Number(digits) + 1).padStart(digits.length, "0")}`;
}

function safeFileName(name) {
  const cleaned = String(name ?? "")
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
  return `${cleaned || "Invoice"}.pdf`.replace(/(\.pdf)+$/i, ".pdf");
}

export async function listInvoices(req, res) {
  const { page, limit, status, search } = req.validated.query;

  const where = {
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { invoiceNumber: { contains: search, mode: "insensitive" } },
            { clientName: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      // The list never needs the heavy JSON blobs.
      omit: { items: true, business: true, paymentInfo: true, notes: true, terms: true, thankYou: true },
    }),
    prisma.invoice.count({ where }),
  ]);

  res.json({
    success: true,
    data: invoices.map(serializeInvoice),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  });
}

// Pre-fills a new invoice from the Settings page (business details, payment
// info, GST/terms defaults) plus the next number for the configured prefix.
export async function getInvoiceDefaults(req, res) {
  const settings = await loadInvoiceSettings();
  const { invoicePrefix, ...defaults } = settings.defaults;

  const last = await prisma.invoice.findFirst({
    where: { invoiceNumber: { startsWith: invoicePrefix } },
    orderBy: { createdAt: "desc" },
    select: { invoiceNumber: true },
  });

  res.json({
    success: true,
    data: {
      invoiceNumber: nextNumberAfter(last?.invoiceNumber, invoicePrefix),
      business: settings.business,
      paymentInfo: settings.paymentInfo,
      ...defaults,
    },
  });
}

export async function getInvoice(req, res) {
  const invoice = await prisma.invoice.findUnique({ where: { id: req.validated.params.id } });
  if (!invoice) throw new ApiError(404, "Invoice not found");
  res.json({ success: true, data: serializeInvoice(invoice) });
}

export async function createInvoice(req, res) {
  try {
    const invoice = await prisma.invoice.create({ data: buildData(req.validated.body) });
    res.status(201).json({ success: true, data: serializeInvoice(invoice) });
  } catch (error) {
    rethrowDuplicateNumber(error);
  }
}

export async function updateInvoice(req, res) {
  const { id } = req.validated.params;
  const existing = await prisma.invoice.findUnique({ where: { id }, select: { id: true } });
  if (!existing) throw new ApiError(404, "Invoice not found");

  try {
    const invoice = await prisma.invoice.update({ where: { id }, data: buildData(req.validated.body) });
    res.json({ success: true, data: serializeInvoice(invoice) });
  } catch (error) {
    rethrowDuplicateNumber(error);
  }
}

export async function deleteInvoice(req, res) {
  const { id } = req.validated.params;
  const invoice = await prisma.invoice.findUnique({ where: { id }, select: { driveFileId: true } });
  if (!invoice) throw new ApiError(404, "Invoice not found");

  await prisma.invoice.delete({ where: { id } });
  // Best effort: the invoice row is already gone, a leftover Drive file
  // must not turn that into an error.
  if (invoice.driveFileId) await deleteImageFromDrive(invoice.driveFileId).catch(() => {});
  res.status(204).send();
}

// Receives the PDF the admin's browser rendered, stores it in Drive named
// "<client> - <date>.pdf", and remembers the link. Re-saving replaces the
// previous Drive file so there is only ever one per invoice.
export async function saveInvoicePdf(req, res) {
  const { id } = req.validated.params;
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    select: { driveFileId: true },
  });
  if (!invoice) throw new ApiError(404, "Invoice not found");

  const { fileId, url } = await uploadFileToDrive({
    buffer: req.file.buffer,
    filename: safeFileName(req.body?.filename),
    mimeType: "application/pdf",
  });

  await prisma.invoice.update({ where: { id }, data: { driveFileId: fileId, driveUrl: url } });
  if (invoice.driveFileId) await deleteImageFromDrive(invoice.driveFileId).catch(() => {});

  res.json({ success: true, data: { driveFileId: fileId, driveUrl: url } });
}
