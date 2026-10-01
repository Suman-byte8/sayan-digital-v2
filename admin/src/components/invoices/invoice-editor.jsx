"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  ExternalLink,
  Loader2,
  MessageCircle,
  Save,
  Trash2,
  Upload,
  UploadCloud,
} from "lucide-react";
import { api, ApiRequestError } from "@/lib/api";
import { calcInvoice } from "@/lib/invoice-calc";
import { addDaysYmd, formatMoney, invoiceFileName, whatsappLink } from "@/lib/invoice-format";
import { EMPTY_ITEM, toPayload } from "@/lib/invoice-state";
import { InvoiceSheet, SHEET_WIDTH } from "@/components/invoices/invoice-sheet";

const GST_PRESETS = [5, 12, 18, 28];
const STATUS_STYLES = {
  PAID: "bg-green-100 text-green-700",
  PARTIAL: "bg-amber-100 text-amber-700",
  UNPAID: "bg-red-100 text-red-700",
};

// Dirty tracking ignores driveUrl: it changes when a PDF is uploaded, not
// when the invoice itself was edited.
const snapshotOf = (state) => JSON.stringify({ ...state, driveUrl: "" });

const errorMessage = (err, fallback) => (err instanceof ApiRequestError ? err.message : fallback);

function Panel({ title, children }) {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Label({ text, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{text}</span>
      {children}
    </label>
  );
}

function Toggle({ checked, onChange, children }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 rounded border-border"
      />
      {children}
    </label>
  );
}

export function InvoiceEditor({ initial, invoiceId }) {
  const [inv, setInv] = useState(initial);
  const [savedId, setSavedId] = useState(invoiceId ?? null);
  const [savedSnapshot, setSavedSnapshot] = useState(() => (invoiceId ? snapshotOf(initial) : ""));
  const [busy, setBusy] = useState(null); // "save" | "pdf" | "drive" | "whatsapp" | "logo"
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [waLink, setWaLink] = useState("");

  const sheetRef = useRef(null);
  const containerRef = useRef(null);
  const logoInputRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [sheetHeight, setSheetHeight] = useState(1123);

  // Live totals while typing; blank-named rows are dropped on save, so
  // they're excluded here too and the preview matches what gets stored.
  const calc = useMemo(
    () =>
      calcInvoice({
        ...inv,
        items: inv.items.map((item) => (item.description.trim() ? item : { ...item, unitPrice: 0 })),
      }),
    [inv],
  );

  const dirty = snapshotOf(inv) !== savedSnapshot;

  // Fit the fixed-width A4 sheet to the available column.
  useEffect(() => {
    const container = containerRef.current;
    const sheet = sheetRef.current;
    if (!container || !sheet) return;
    const measure = () => {
      setScale(Math.min(1, container.clientWidth / SHEET_WIDTH));
      setSheetHeight(sheet.offsetHeight);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(sheet);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // ---- state updaters ----
  const set = useCallback((field, value) => setInv((prev) => ({ ...prev, [field]: value })), []);
  const setBusiness = useCallback(
    (field, value) => setInv((prev) => ({ ...prev, business: { ...prev.business, [field]: value } })),
    [],
  );
  const setPayment = useCallback(
    (field, value) => setInv((prev) => ({ ...prev, paymentInfo: { ...prev.paymentInfo, [field]: value } })),
    [],
  );
  const setItem = useCallback(
    (index, field, value) =>
      setInv((prev) => ({
        ...prev,
        items: prev.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
      })),
    [],
  );
  const addItem = useCallback(
    () => setInv((prev) => ({ ...prev, items: [...prev.items, { ...EMPTY_ITEM }] })),
    [],
  );
  const removeItem = useCallback(
    (index) => setInv((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) })),
    [],
  );

  // ---- actions ----
  async function handleLogoPicked(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy("logo");
    setError("");
    try {
      const { data } = await api.uploadImage(file);
      setBusiness("logoUrl", data.url);
    } catch (err) {
      setError(errorMessage(err, "Logo upload failed."));
    } finally {
      setBusy(null);
    }
  }

  function validate() {
    if (!inv.clientName.trim()) return "Enter the client name first.";
    if (!inv.invoiceNumber.trim()) return "Enter an invoice number.";
    if (!inv.items.some((item) => item.description.trim())) return "Add at least one item with a name.";
    return "";
  }

  // Creates or updates; resolves to the saved invoice id.
  async function persist() {
    const payload = toPayload(inv);
    const { data } = savedId ? await api.updateInvoice(savedId, payload) : await api.createInvoice(payload);
    if (!savedId) {
      setSavedId(data.id);
      // Move to the invoice's own URL without remounting the editor.
      window.history.replaceState(null, "", `/invoices/${data.id}`);
    }
    setSavedSnapshot(snapshotOf(inv));
    return data.id;
  }

  async function run(kind, task) {
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setBusy(kind);
    setError("");
    setNotice("");
    setWaLink("");
    try {
      await task();
    } catch (err) {
      setError(errorMessage(err, "Something went wrong. Please try again."));
    } finally {
      setBusy(null);
    }
  }

  const fileName = invoiceFileName(inv.clientName, inv.issueDate);

  const handleSave = () =>
    run("save", async () => {
      await persist();
      setNotice("Invoice saved.");
    });

  const handlePdf = () =>
    run("pdf", async () => {
      const { renderInvoicePdf, downloadBlob } = await import("@/lib/invoice-pdf");
      downloadBlob(await renderInvoicePdf(sheetRef.current), fileName);
      setNotice(`Downloaded "${fileName}".`);
    });

  async function saveToDrive() {
    const id = await persist();
    const { renderInvoicePdf } = await import("@/lib/invoice-pdf");
    const blob = await renderInvoicePdf(sheetRef.current);
    const { data } = await api.uploadInvoicePdf(id, blob, fileName);
    setInv((prev) => ({ ...prev, driveUrl: data.driveUrl }));
    return data.driveUrl;
  }

  const handleDrive = () =>
    run("drive", async () => {
      await saveToDrive();
      setNotice(`Saved to Google Drive as "${fileName}".`);
    });

  function handleWhatsApp() {
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    // Opened synchronously, inside the click, so the popup blocker allows
    // it; pointed at WhatsApp once the PDF is in Drive.
    const popup = window.open("", "_blank");
    run("whatsapp", async () => {
      try {
        const driveUrl = await saveToDrive();
        const link = whatsappLink({
          phone: inv.clientPhone,
          clientName: inv.clientName,
          invoiceNumber: inv.invoiceNumber,
          businessName: `${inv.business.nameLine1} ${inv.business.nameLine2}`.replace(/\.$/, "").trim(),
          total: calc.total,
          balanceDue: calc.balanceDue,
          dueDate: inv.dueDate,
          driveUrl,
        });
        if (popup) popup.location.href = link;
        else setWaLink(link);
        setNotice("PDF saved to Drive — WhatsApp opened with the link.");
      } catch (err) {
        popup?.close();
        throw err;
      }
    });
  }

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const actions = { set, setItem, addItem, removeItem, setBusiness, setPayment, onLogoClick: () => logoInputRef.current?.click() };
  const disabled = busy !== null;
  const btn = "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium disabled:opacity-60";
  const spin = (kind, Icon) => (busy === kind ? <Loader2 size={15} className="animate-spin" /> : <Icon size={15} />);

  return (
    <div>
      <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoPicked} />

      {/* Toolbar */}
      <div className="sticky top-0 z-10 -mx-8 -mt-2 mb-5 flex flex-wrap items-center gap-3 border-b border-border bg-background/95 px-8 py-3 backdrop-blur">
        <Link href="/invoices" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={15} />
          All invoices
        </Link>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[calc.status]}`}>
          {calc.status}
        </span>
        {dirty && <span className="text-xs text-amber-600">Unsaved changes</span>}

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button type="button" onClick={handleSave} disabled={disabled} className={`${btn} bg-brand text-brand-foreground hover:opacity-90`}>
            {spin("save", Save)}
            {busy === "save" ? "Saving…" : "Save"}
          </button>
          <button type="button" onClick={handlePdf} disabled={disabled} className={`${btn} border border-border text-foreground hover:bg-muted`}>
            {spin("pdf", Download)}
            {busy === "pdf" ? "Creating PDF…" : "Download PDF"}
          </button>
          <button type="button" onClick={handleDrive} disabled={disabled} className={`${btn} border border-border text-foreground hover:bg-muted`}>
            {spin("drive", UploadCloud)}
            {busy === "drive" ? "Uploading…" : "Save to Drive"}
          </button>
          <button
            type="button"
            onClick={handleWhatsApp}
            disabled={disabled}
            className={`${btn} bg-[#25D366] text-white hover:opacity-90`}
          >
            {spin("whatsapp", MessageCircle)}
            {busy === "whatsapp" ? "Preparing…" : "Share on WhatsApp"}
          </button>
        </div>
      </div>

      {(error || notice || waLink || inv.driveUrl) && (
        <div className="mb-4 space-y-2">
          {error && (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          {notice && (
            <p className="flex items-center gap-1.5 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              <CheckCircle2 size={15} />
              {notice}
            </p>
          )}
          {waLink && (
            <a href={waLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm font-medium text-[#128C7E] underline">
              <MessageCircle size={15} />
              Popup was blocked — click to open WhatsApp
            </a>
          )}
          {inv.driveUrl && (
            <a href={inv.driveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
              <ExternalLink size={13} />
              Open the PDF saved in Google Drive
            </a>
          )}
        </div>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        {/* The invoice (editable in place) */}
        <div ref={containerRef} className="min-w-0">
          <div style={{ height: sheetHeight * scale }}>
            <div
              data-inv-scaler
              className="shadow-lg ring-1 ring-black/5"
              style={{ width: SHEET_WIDTH, transform: `scale(${scale})`, transformOrigin: "top left" }}
            >
              <InvoiceSheet inv={inv} calc={calc} actions={actions} sheetRef={sheetRef} />
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Click any text on the invoice to edit it. Hover an item row to remove it.
          </p>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <Panel title="Payment">
            <Label text="Amount paid (₹)">
              <input
                inputMode="decimal"
                value={inv.amountPaid}
                onChange={(e) => set("amountPaid", e.target.value)}
                placeholder="0"
                className="input"
              />
            </Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => set("amountPaid", String(calc.total))}
                className="flex-1 rounded-md border border-border px-2 py-1.5 text-xs font-medium hover:bg-muted"
              >
                Mark fully paid
              </button>
              <button
                type="button"
                onClick={() => set("amountPaid", "")}
                className="flex-1 rounded-md border border-border px-2 py-1.5 text-xs font-medium hover:bg-muted"
              >
                Clear
              </button>
            </div>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Total</dt><dd className="font-medium">{formatMoney(calc.total)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Paid</dt><dd className="font-medium text-green-700">{formatMoney(calc.amountPaid)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Due</dt><dd className="font-semibold">{formatMoney(calc.balanceDue)}</dd></div>
            </dl>
          </Panel>

          <Panel title="Dates">
            <Label text="Invoice date">
              <input type="date" value={inv.issueDate} onChange={(e) => set("issueDate", e.target.value)} className="input" />
            </Label>
            <Label text="Due date">
              <input type="date" value={inv.dueDate} onChange={(e) => set("dueDate", e.target.value)} className="input" />
            </Label>
            <div className="flex gap-1.5">
              {[7, 15, 30].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => set("dueDate", addDaysYmd(inv.issueDate, days))}
                  className="flex-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-muted"
                >
                  +{days} days
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="GST">
            <Toggle checked={inv.gstEnabled} onChange={(v) => set("gstEnabled", v)}>
              Charge GST (Tax invoice)
            </Toggle>
            {inv.gstEnabled && (
              <>
                <Label text="Supply type">
                  <select value={inv.gstMode} onChange={(e) => set("gstMode", e.target.value)} className="input">
                    <option value="INTRA">Same state — CGST + SGST</option>
                    <option value="INTER">Other state — IGST</option>
                  </select>
                </Label>
                <Label text="GST rate (%)">
                  <input
                    inputMode="decimal"
                    value={inv.gstRate}
                    onChange={(e) => set("gstRate", e.target.value)}
                    className="input"
                  />
                </Label>
                <div className="flex gap-1.5">
                  {GST_PRESETS.map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => set("gstRate", rate)}
                      className={`flex-1 rounded-md border px-2 py-1 text-xs ${
                        Number(inv.gstRate) === rate ? "border-brand bg-brand/10 text-brand" : "border-border hover:bg-muted"
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
                <Toggle checked={inv.pricesIncludeGst} onChange={(v) => set("pricesIncludeGst", v)}>
                  Prices already include GST
                </Toggle>
                <p className="text-xs text-muted-foreground">
                  A different rate for one item can be typed in that row&rsquo;s GST % cell.
                </p>
              </>
            )}
          </Panel>

          <Panel title="Discount & rounding">
            <div className="flex gap-2">
              <select
                value={inv.discountType}
                onChange={(e) => set("discountType", e.target.value)}
                className="input w-24 shrink-0"
              >
                <option value="PERCENT">%</option>
                <option value="FLAT">₹ flat</option>
              </select>
              <input
                inputMode="decimal"
                value={inv.discountValue}
                onChange={(e) => set("discountValue", e.target.value)}
                placeholder="0"
                className="input"
              />
            </div>
            <Toggle checked={inv.roundOff} onChange={(v) => set("roundOff", v)}>
              Round total to the nearest rupee
            </Toggle>
          </Panel>

          <Panel title="Branding">
            <Label text="Accent colour">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={inv.accentColor}
                  onChange={(e) => set("accentColor", e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded border border-border bg-background p-0.5"
                />
                <button
                  type="button"
                  onClick={() => set("accentColor", "#4a3f94")}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Reset
                </button>
              </div>
            </Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                disabled={busy === "logo"}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border px-2 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-60"
              >
                {busy === "logo" ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                {inv.business.logoUrl ? "Change logo" : "Upload logo"}
              </button>
              {inv.business.logoUrl && (
                <button
                  type="button"
                  onClick={() => setBusiness("logoUrl", "")}
                  aria-label="Remove logo"
                  className="rounded-md border border-border px-2 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              New invoices start from your <Link href="/settings" className="text-brand hover:underline">Settings</Link> (logo, address, contact, payment info). Edits here only change this invoice.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
