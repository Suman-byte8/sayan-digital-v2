// Renders the on-screen invoice sheet to an A4 PDF entirely in the browser.
// The heavy libraries are loaded on first use, so opening the editor does
// not pay for them.
const A4_W_MM = 210;
const A4_H_MM = 297;

// Inputs/textareas don't rasterize their wrapped text reliably, so in the
// cloned DOM that gets captured every editable field becomes a plain div
// with the same classes and the typed value.
function freezeFields(doc) {
  doc.querySelectorAll("[data-inv-field]").forEach((field) => {
    const div = doc.createElement("div");
    div.className = field.className;
    div.textContent = field.value;
    div.style.whiteSpace = "pre-wrap";
    div.style.overflowWrap = "anywhere";
    div.style.minHeight = `${field.offsetHeight}px`;
    div.style.background = "transparent";
    // Accent-coloured fields (business name line 2, thank-you) set colour inline.
    if (field.style.color) div.style.color = field.style.color;
    div.dataset.frozen = field.value.trim() ? "filled" : "empty";
    // Optional lines with nothing typed would only leave blank gaps.
    if (div.dataset.frozen === "empty" && field.hasAttribute("data-collapse")) {
      field.remove();
      return;
    }
    field.replaceWith(div);
  });
  // Rows/blocks that are just a label plus empty fields ("HSN/SAC:", "Note:")
  // are dropped entirely.
  doc.querySelectorAll("[data-hide-if-empty]").forEach((block) => {
    const frozen = [...block.querySelectorAll("[data-frozen]")];
    if (frozen.length > 0 && frozen.every((el) => el.dataset.frozen === "empty")) block.remove();
  });
  // The sheet is shown scaled-to-fit on screen; capture it at true size.
  doc.querySelectorAll("[data-inv-scaler]").forEach((el) => {
    el.style.transform = "none";
    el.style.width = "auto";
    el.style.height = "auto";
  });
}

export async function renderInvoicePdf(sheetElement) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas-pro"),
    import("jspdf"),
  ]);
  await document.fonts?.ready;

  const canvas = await html2canvas(sheetElement, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    ignoreElements: (el) => el.hasAttribute?.("data-no-pdf"),
    onclone: (doc) => freezeFields(doc),
  });

  const pdf = new jsPDF({ unit: "mm", format: "a4", compress: true });
  const pageHeightPx = Math.floor((canvas.width * A4_H_MM) / A4_W_MM);

  // A sheet only a hair taller than A4 (rounding) is squeezed onto one page
  // instead of spilling a nearly-blank second page.
  if (canvas.height <= pageHeightPx * 1.03) {
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, A4_W_MM, Math.min(A4_H_MM, (canvas.height * A4_W_MM) / canvas.width), undefined, "FAST");
    return pdf.output("blob");
  }

  // Longer invoices: slice the capture into A4-high pages.
  for (let offset = 0, page = 0; offset < canvas.height; offset += pageHeightPx, page++) {
    const sliceHeight = Math.min(pageHeightPx, canvas.height - offset);
    const slice = document.createElement("canvas");
    slice.width = canvas.width;
    slice.height = sliceHeight;
    const ctx = slice.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, slice.width, slice.height);
    ctx.drawImage(canvas, 0, offset, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

    if (page > 0) pdf.addPage();
    pdf.addImage(slice.toDataURL("image/png"), "PNG", 0, 0, A4_W_MM, (sliceHeight * A4_W_MM) / canvas.width, undefined, "FAST");
  }

  return pdf.output("blob");
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
