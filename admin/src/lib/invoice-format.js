export function formatMoney(value) {
  const n = Number(value);
  return `₹${(Number.isFinite(n) ? n : 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(ymd) {
  if (!ymd) return "";
  const date = new Date(`${ymd}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// "Client Name - 2026-10-01.pdf" - the same name for the local download
// and the Drive copy. Characters Drive/Windows reject are replaced.
export function invoiceFileName(clientName, issueDate) {
  const client = (clientName || "Invoice").replace(/[\\/:*?"<>|]/g, " ").replace(/\s+/g, " ").trim();
  return `${client} - ${issueDate}.pdf`;
}

// Indian-first: a bare 10-digit number gets +91; anything longer is assumed
// to already include a country code.
export function whatsappNumber(phone) {
  const digits = String(phone ?? "").replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 11 && digits.startsWith("0")) return `91${digits.slice(1)}`;
  return digits;
}

export function whatsappLink({ phone, clientName, invoiceNumber, businessName, total, balanceDue, dueDate, driveUrl }) {
  const lines = [
    `Hello ${clientName || ""},`.replace(" ,", ","),
    `Here is invoice ${invoiceNumber} from ${businessName}: total ${formatMoney(total)}` +
      (balanceDue > 0
        ? `, balance due ${formatMoney(balanceDue)}${dueDate ? ` by ${formatDate(dueDate)}` : ""}.`
        : " - paid in full. Thank you!"),
    driveUrl,
  ];
  const number = whatsappNumber(phone);
  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function todayYmd() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function addDaysYmd(ymd, days) {
  const d = new Date(`${ymd}T00:00:00`);
  d.setDate(d.getDate() + days);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
