"use client";

import { useLayoutEffect, useRef } from "react";
import { Montserrat } from "next/font/google";
import { ImagePlus, Plus, X } from "lucide-react";
import { formatDate, formatMoney } from "@/lib/invoice-format";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

// The printable invoice. Fixed A4 proportions (794 x 1123 px at 96dpi) and
// px sizing so the PDF capture matches the screen exactly. Everything is
// edited in place: each [data-inv-field] is swapped for plain text in the
// PDF capture (see lib/invoice-pdf.js), anything [data-no-pdf] is dropped.
export const SHEET_WIDTH = 794;

const FIELD_BASE =
  "block w-full resize-none rounded-sm border-0 bg-transparent p-0 outline-none transition-colors placeholder:text-neutral-300 hover:bg-black/5 focus:bg-black/5";

function Field({ value, onChange, placeholder, multiline = false, className = "", type = "text", inputMode, style, collapse = false }) {
  const ref = useRef(null);

  // Textareas grow with their content (no scrollbars in a printed page).
  useLayoutEffect(() => {
    if (!multiline || !ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = `${ref.current.scrollHeight}px`;
  }, [value, multiline]);

  const common = {
    ref,
    value: value ?? "",
    placeholder,
    "data-inv-field": "",
    "data-collapse": collapse ? "" : undefined,
    style,
    className: `${FIELD_BASE} ${className}`,
    onChange: (e) => onChange(e.target.value),
  };

  return multiline ? (
    <textarea rows={1} {...common} />
  ) : (
    <input type={type} inputMode={inputMode} {...common} />
  );
}

function TotalRow({ label, value, bold = false, accent }) {
  return (
    <div className="flex items-center justify-between py-[3px] text-[11.5px]">
      <span className={bold ? "font-bold" : "font-semibold"} style={accent ? { color: accent } : undefined}>
        {label}
      </span>
      <span className={bold ? "font-bold" : "font-semibold"} style={accent ? { color: accent } : undefined}>
        {value}
      </span>
    </div>
  );
}

export function InvoiceSheet({ inv, calc, actions, sheetRef }) {
  const { set, setItem, addItem, removeItem, setBusiness, setPayment, onLogoClick } = actions;
  const accent = inv.accentColor;
  const gst = inv.gstEnabled;
  const columns = gst ? "grid-cols-[1fr_88px_52px_58px_96px]" : "grid-cols-[1fr_104px_60px_104px]";
  const balanceBox = Number(inv.amountPaid) > 0 ? "BALANCE DUE :" : "TOTAL DUE :";
  const discountLabel =
    inv.discountType === "PERCENT" && Number(inv.discountValue) > 0
      ? `DISCOUNT ${Number(inv.discountValue)}% :`
      : "DISCOUNT :";
  const rate = Number(inv.gstRate);

  return (
    <div
      ref={sheetRef}
      className={`${montserrat.className} relative bg-white text-[#14142b]`}
      style={{ width: SHEET_WIDTH, minHeight: 1123, padding: "44px 40px 36px" }}
    >
      {calc.status === "PAID" && (
        <div
          aria-hidden
          className="pointer-events-none absolute top-[44%] right-[70px] -rotate-12 rounded-md border-[5px] border-emerald-600/40 px-6 py-1 text-[54px] font-extrabold tracking-widest text-emerald-600/40"
        >
          PAID
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onLogoClick}
            title="Change logo"
            className={`flex shrink-0 items-center justify-center overflow-hidden ${
              inv.business.logoUrl ? "h-[104px] max-w-[270px]" : "size-[60px]"
            }`}
          >
            {inv.business.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- arbitrary uploaded/remote logo, must stay a plain img for the PDF capture
              <img
                src={inv.business.logoUrl}
                alt="Logo"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                className="h-full w-auto max-w-[270px] object-contain"
              />
            ) : (
              <span data-no-pdf className="flex size-full items-center justify-center rounded-full border-2 border-dashed border-neutral-300 text-neutral-400">
                <ImagePlus size={20} />
              </span>
            )}
          </button>
          {/* The logo stands alone; the typed name only appears as a fallback
              when there is no logo, so the header is never empty. */}
          {!inv.business.logoUrl && (
          <div className="w-[190px]">
            <Field
              value={inv.business.nameLine1}
              onChange={(v) => setBusiness("nameLine1", v)}
              placeholder="Business"
              className="text-[22px] leading-[1.15] font-extrabold"
            />
            <Field
              value={inv.business.nameLine2}
              onChange={(v) => setBusiness("nameLine2", v)}
              placeholder="Name."
              className="text-[22px] leading-[1.15] font-extrabold"
              style={{ color: accent }}
            />
          </div>
          )}
        </div>

        <div className="w-[300px] text-right">
          <p className="text-[38px] leading-none font-extrabold tracking-wide" style={{ color: accent }}>
            {gst ? "TAX INVOICE" : "INVOICE"}
          </p>
          <p className="mt-2 text-[13px] font-bold">{formatDate(inv.issueDate)}</p>
          <div className="mt-1 flex items-center justify-end gap-1.5 text-[11px] font-semibold">
            <span>No.</span>
            <div className="w-[110px]">
              <Field
                value={inv.invoiceNumber}
                onChange={(v) => set("invoiceNumber", v)}
                placeholder="INV-0001"
                className="text-right font-bold"
              />
            </div>
          </div>
          {inv.dueDate && (
            <p className="mt-0.5 text-[11px] font-semibold text-neutral-600">Due {formatDate(inv.dueDate)}</p>
          )}
        </div>
      </div>

      {/* Addresses */}
      <div className="mt-8 flex justify-between gap-8 text-[11.5px] leading-[1.55]">
        <div className="w-[320px]">
          <p className="font-bold">Office Address</p>
          <Field
            multiline
            value={inv.business.address}
            onChange={(v) => setBusiness("address", v)}
            placeholder="Street, city, state, PIN"
          />
          <div className="mt-3">
            <Field value={inv.business.phone} onChange={(v) => setBusiness("phone", v)} placeholder="+91 00000 00000" />
          </div>
          {(gst || inv.business.gstin) && (
            <div className="mt-1 flex items-center gap-1" data-hide-if-empty>
              <span className="shrink-0 font-semibold">GSTIN:</span>
              <Field value={inv.business.gstin} onChange={(v) => setBusiness("gstin", v)} placeholder="Your GSTIN" />
            </div>
          )}
        </div>

        <div className="w-[300px]">
          <p className="font-bold">To :</p>
          <Field
            value={inv.clientName}
            onChange={(v) => set("clientName", v)}
            placeholder="Client name"
            className="text-[13px] font-bold"
          />
          <Field
            multiline
            value={inv.clientAddress}
            onChange={(v) => set("clientAddress", v)}
            placeholder="Client address"
            collapse
          />
          <Field value={inv.clientPhone} onChange={(v) => set("clientPhone", v)} placeholder="Client phone" collapse />
          <Field value={inv.clientEmail} onChange={(v) => set("clientEmail", v)} placeholder="Client email" collapse />
          {(gst || inv.clientGstin) && (
            <div className="flex items-center gap-1" data-hide-if-empty>
              <span className="shrink-0 font-semibold">GSTIN:</span>
              <Field value={inv.clientGstin} onChange={(v) => set("clientGstin", v)} placeholder="Client GSTIN" />
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="mt-7">
        <div
          className={`grid ${columns} items-center px-4 py-[11px] text-[11.5px] font-semibold text-white`}
          style={{ background: accent }}
        >
          <span>Items Description</span>
          <span className="text-center">Unit Price</span>
          <span className="text-center">Qnt</span>
          {gst && <span className="text-center">GST %</span>}
          <span className="text-right">Total</span>
        </div>

        {inv.items.map((item, index) => (
          <div
            key={index}
            className={`group relative grid ${columns} items-start gap-x-2 border-b-[1.5px] border-[#1b1b33] px-4 py-3 text-[11.5px]`}
            style={{ marginRight: 14 }}
          >
            <div className="pr-3">
              <Field
                value={item.description}
                onChange={(v) => setItem(index, "description", v)}
                placeholder="Item name"
                className="text-[12px] font-bold"
              />
              <Field
                multiline
                value={item.details}
                onChange={(v) => setItem(index, "details", v)}
                placeholder="Description (optional)"
                className="text-[9px] leading-[1.45] text-neutral-600"
                collapse
              />
              {gst && (
                <div className="mt-0.5 flex items-center gap-1 text-[9px] text-neutral-500" data-hide-if-empty>
                  <span className="shrink-0">HSN/SAC:</span>
                  <Field value={item.hsn} onChange={(v) => setItem(index, "hsn", v)} placeholder="optional" />
                </div>
              )}
            </div>
            <Field
              inputMode="decimal"
              value={item.unitPrice}
              onChange={(v) => setItem(index, "unitPrice", v)}
              placeholder="0.00"
              className="text-center font-semibold"
            />
            <Field
              inputMode="decimal"
              value={item.qty}
              onChange={(v) => setItem(index, "qty", v)}
              placeholder="1"
              className="text-center font-semibold"
            />
            {gst && (
              <Field
                inputMode="decimal"
                value={item.gstRate ?? ""}
                onChange={(v) => setItem(index, "gstRate", v)}
                placeholder={String(rate)}
                className="text-center font-semibold"
              />
            )}
            <p className="pt-px text-right font-semibold">{formatMoney(calc.lines[index]?.amount ?? 0)}</p>

            {inv.items.length > 1 && (
              <button
                type="button"
                data-no-pdf
                onClick={() => removeItem(index)}
                aria-label="Remove item"
                className="absolute top-2 -right-[14px] hidden size-5 items-center justify-center rounded-full bg-red-500 text-white group-hover:flex"
              >
                <X size={12} />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          data-no-pdf
          onClick={addItem}
          className="mt-2 ml-4 flex items-center gap-1 text-[11px] font-semibold"
          style={{ color: accent }}
        >
          <Plus size={13} />
          Add item
        </button>
      </div>

      {/* Notes + totals */}
      <div className="mt-6 flex justify-between gap-10">
        <div className="w-[300px] pt-1 text-[9.5px] leading-[1.5]" data-hide-if-empty>
          <p className="text-[10px] font-bold">Note:</p>
          <Field
            multiline
            value={inv.notes}
            onChange={(v) => set("notes", v)}
            placeholder="Add a note for the client (optional)"
            className="text-neutral-700"
          />
        </div>

        <div className="w-[290px]">
          <TotalRow label="SUBTOTAL :" value={formatMoney(calc.subtotal)} accent={accent} />
          {calc.discountAmount > 0 && (
            <TotalRow label={discountLabel} value={`- ${formatMoney(calc.discountAmount)}`} />
          )}
          {gst && inv.gstMode === "INTRA" && (
            <>
              <TotalRow label={`CGST ${rate / 2}% :`} value={formatMoney(calc.cgst)} />
              <TotalRow label={`SGST ${rate / 2}% :`} value={formatMoney(calc.sgst)} />
            </>
          )}
          {gst && inv.gstMode === "INTER" && <TotalRow label={`IGST ${rate}% :`} value={formatMoney(calc.igst)} />}
          {calc.roundOffAmount !== 0 && <TotalRow label="ROUND OFF :" value={formatMoney(calc.roundOffAmount)} />}
          {calc.amountPaid > 0 && (
            <>
              <TotalRow label="TOTAL :" value={formatMoney(calc.total)} bold />
              <TotalRow label="PAID :" value={`- ${formatMoney(calc.amountPaid)}`} accent="#15803d" />
            </>
          )}
          <div
            className="mt-3 flex items-center justify-between px-5 py-4 text-[14px] font-bold text-white"
            style={{ background: accent }}
          >
            <span>{calc.status === "PAID" ? "PAID IN FULL" : balanceBox}</span>
            <span>{formatMoney(calc.status === "PAID" ? calc.total : calc.balanceDue)}</span>
          </div>
        </div>
      </div>

      <div className="mt-9">
        <Field
          value={inv.thankYou}
          onChange={(v) => set("thankYou", v)}
          placeholder="Thank you for your Business"
          className="text-[14px] font-bold"
          style={{ color: accent }}
        />
      </div>

      {/* Footer */}
      <div className="mt-6 border-t-[1.5px] pt-4" style={{ borderColor: accent }}>
        <div className="grid grid-cols-[1.5fr_1.2fr_1.2fr] gap-6 text-[9px] leading-[1.5]">
          <div>
            <p className="mb-1 text-[11.5px] font-bold" style={{ color: accent }}>
              Questions?
            </p>
            <div className="flex items-center gap-1">
              <span className="w-[42px] shrink-0">Email us</span>:
              <Field value={inv.business.email} onChange={(v) => setBusiness("email", v)} placeholder="email@example.com" />
            </div>
            <div className="flex items-center gap-1">
              <span className="w-[42px] shrink-0">Call us</span>:
              <Field value={inv.business.phone} onChange={(v) => setBusiness("phone", v)} placeholder="+91 00000 00000" />
            </div>
          </div>

          <div>
            <p className="mb-1 text-[11.5px] font-bold" style={{ color: accent }}>
              Payment Info :
            </p>
            {[
              ["Account", "account", "Account number"],
              ["A/C Name", "accountName", "Account holder"],
              ["Bank Detail", "bank", "Bank / IFSC"],
              ["UPI", "upi", "name@upi"],
            ].map(([label, key, placeholder]) => (
              <div key={key} className="flex items-center gap-1">
                <span className="w-[58px] shrink-0 whitespace-nowrap">{label}</span>:
                <Field value={inv.paymentInfo[key]} onChange={(v) => setPayment(key, v)} placeholder={placeholder} />
              </div>
            ))}
          </div>

          <div>
            <p className="mb-1 text-[11.5px] font-bold" style={{ color: accent }}>
              Terms &amp; Conditions/Note:
            </p>
            <Field
              multiline
              value={inv.terms}
              onChange={(v) => set("terms", v)}
              placeholder="Payment terms, return policy…"
              className="text-[8.5px] leading-[1.5] font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
