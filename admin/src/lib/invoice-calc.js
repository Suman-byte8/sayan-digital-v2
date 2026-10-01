// Invoice money math. This file is the authority: the controller recomputes
// every total from the items + settings on save, so a tampered/stale client
// can never persist wrong amounts.
//
// !! admin/src/lib/invoice-calc.js is a byte-for-byte copy used for the live
// !! preview while editing - keep the two identical (admin has no way to
// !! import from server/).
//
// Model:
//   * each line = qty x unitPrice (as typed; includes GST when
//     pricesIncludeGst is set)
//   * everything is taken to an ex-tax basis first, the discount is applied
//     to that subtotal and spread across lines in proportion to their value,
//     then each line's GST is calculated on its discounted ex-tax amount
//     (line gstRate overrides the invoice-wide rate when set)
//   * INTRA-state: tax splits into CGST + SGST; INTER-state: all IGST
//   * optional round-off to the nearest rupee
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export function calcInvoice({
  items = [],
  gstEnabled = false,
  gstMode = "INTRA",
  gstRate = 18,
  pricesIncludeGst = false,
  discountType = "PERCENT",
  discountValue = 0,
  roundOff = true,
  amountPaid = 0,
}) {
  const invoiceRate = toNumber(gstRate);

  const lines = items.map((item) => {
    const entered = toNumber(item.qty) * toNumber(item.unitPrice);
    const hasOwnRate = item.gstRate !== "" && item.gstRate != null && Number.isFinite(Number(item.gstRate));
    const rate = gstEnabled ? (hasOwnRate ? Number(item.gstRate) : invoiceRate) : 0;
    const exTax = gstEnabled && pricesIncludeGst ? entered / (1 + rate / 100) : entered;
    return { entered: round2(entered), exTax, rate };
  });

  const subtotal = round2(lines.reduce((sum, l) => sum + l.exTax, 0));

  const rawDiscount =
    discountType === "FLAT" ? toNumber(discountValue) : (subtotal * toNumber(discountValue)) / 100;
  const discountAmount = round2(Math.min(Math.max(rawDiscount, 0), subtotal));

  let taxableValue = 0;
  let tax = 0;
  for (const line of lines) {
    const share = subtotal > 0 ? (line.exTax / subtotal) * discountAmount : 0;
    const taxable = line.exTax - share;
    taxableValue += taxable;
    tax += (taxable * line.rate) / 100;
  }
  taxableValue = round2(taxableValue);
  const taxAmount = gstEnabled ? round2(tax) : 0;

  const cgst = gstEnabled && gstMode === "INTRA" ? round2(taxAmount / 2) : 0;
  const sgst = gstEnabled && gstMode === "INTRA" ? round2(taxAmount - cgst) : 0;
  const igst = gstEnabled && gstMode === "INTER" ? taxAmount : 0;

  const beforeRound = round2(taxableValue + taxAmount);
  const total = roundOff ? Math.round(beforeRound) : beforeRound;
  const roundOffAmount = round2(total - beforeRound);

  const paid = Math.max(toNumber(amountPaid), 0);
  const balanceDue = round2(Math.max(total - paid, 0));
  const status = total > 0 && balanceDue <= 0 ? "PAID" : paid > 0 ? "PARTIAL" : "UNPAID";

  return {
    lines: lines.map((l) => ({ amount: l.entered, rate: l.rate })),
    subtotal,
    discountAmount,
    taxableValue,
    taxAmount,
    cgst,
    sgst,
    igst,
    roundOffAmount,
    total,
    amountPaid: round2(paid),
    balanceDue,
    status,
  };
}
