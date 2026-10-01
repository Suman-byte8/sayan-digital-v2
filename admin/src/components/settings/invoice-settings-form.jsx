"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Save, Trash2, Upload } from "lucide-react";
import { api, ApiRequestError } from "@/lib/api";

function Section({ title, description, children }) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      {description && <p className="mt-0.5 mb-4 text-xs text-muted-foreground">{description}</p>}
      {!description && <div className="mb-4" />}
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({ label, hint, error, wide = false, children }) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function Check({ checked, onChange, children }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-4 rounded border-border" />
      {children}
    </label>
  );
}

export function InvoiceSettingsForm({ initial }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [saving, startSaving] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const logoInput = useRef(null);

  const setIn = (group, field, value) => {
    setSaved(false);
    setValues((prev) => ({ ...prev, [group]: { ...prev[group], [field]: value } }));
  };
  const business = (field) => ({
    value: values.business[field],
    onChange: (e) => setIn("business", field, e.target.value),
    className: "input",
  });
  const payment = (field) => ({
    value: values.paymentInfo[field],
    onChange: (e) => setIn("paymentInfo", field, e.target.value),
    className: "input",
  });
  const defaults = (field) => ({
    value: values.defaults[field],
    onChange: (e) => setIn("defaults", field, e.target.value),
    className: "input",
  });

  async function handleLogoPicked(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const { data } = await api.uploadImage(file);
      setIn("business", "logoUrl", data.url);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Logo upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    setSaved(false);
    startSaving(async () => {
      try {
        const { data } = await api.updateInvoiceSettings({
          ...values,
          defaults: { ...values.defaults, dueDays: Number(values.defaults.dueDays) || 0, gstRate: Number(values.defaults.gstRate) || 0 },
        });
        setValues(data);
        setSaved(true);
        router.refresh();
      } catch (err) {
        if (err instanceof ApiRequestError) {
          setError(err.message);
          setFieldErrors(err.details ?? {});
        } else {
          setError("Something went wrong. Please try again.");
        }
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      <input ref={logoInput} type="file" accept="image/*" className="hidden" onChange={handleLogoPicked} />

      {error && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <Section title="Logo" description="Shown at the top-left of every invoice. Without a logo, the business name below is shown instead.">
        <div className="flex items-center gap-4 sm:col-span-2">
          <div className="flex h-24 w-56 items-center justify-center rounded-md border border-dashed border-border bg-background p-2">
            {values.business.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- arbitrary uploaded/remote logo
              <img referrerPolicy="no-referrer" src={values.business.logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
            ) : (
              <span className="text-xs text-muted-foreground">No logo</span>
            )}
          </div>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => logoInput.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-60"
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {uploading ? "Uploading…" : values.business.logoUrl ? "Change logo" : "Upload logo"}
            </button>
            {values.business.logoUrl && (
              <button
                type="button"
                onClick={() => setIn("business", "logoUrl", "")}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive"
              >
                <Trash2 size={13} />
                Remove logo
              </button>
            )}
          </div>
        </div>
        <Field label="Business name — line 1" hint="Only shown when there is no logo.">
          <input {...business("nameLine1")} placeholder="Sayan" />
        </Field>
        <Field label="Business name — line 2">
          <input {...business("nameLine2")} placeholder="Digital." />
        </Field>
      </Section>

      <Section title="Business details" description="Printed on the invoice: the office address, and the footer’s “Questions?” block.">
        <Field label="Office address" wide>
          <textarea rows={3} {...business("address")} placeholder="Street, area, city, state, PIN" />
        </Field>
        <Field label="Phone / contact">
          <input {...business("phone")} placeholder="+91 00000 00000" />
        </Field>
        <Field label="Email" error={fieldErrors.business?.[0]}>
          <input type="email" {...business("email")} placeholder="name@example.com" />
        </Field>
        <Field label="GSTIN" hint="Shown on tax invoices.">
          <input {...business("gstin")} placeholder="Your GST number" />
        </Field>
      </Section>

      <Section title="Payment info" description="Where clients should pay — printed in the invoice footer.">
        <Field label="Account number">
          <input {...payment("account")} />
        </Field>
        <Field label="Account holder name">
          <input {...payment("accountName")} />
        </Field>
        <Field label="Bank / IFSC">
          <input {...payment("bank")} placeholder="Bank name - IFSC" />
        </Field>
        <Field label="UPI ID">
          <input {...payment("upi")} placeholder="name@upi" />
        </Field>
      </Section>

      <Section title="Invoice defaults" description="Starting values for each new invoice. You can still change any of them on the invoice itself.">
        <Field label="Invoice number prefix" hint="Numbers continue from the last invoice with this prefix, e.g. INV-0008." error={fieldErrors.defaults?.[0]}>
          <input {...defaults("invoicePrefix")} placeholder="INV-" />
        </Field>
        <Field label="Payment due after (days)">
          <input type="number" min="0" max="365" {...defaults("dueDays")} />
        </Field>
        <Field label="Thank-you line" wide>
          <input {...defaults("thankYou")} />
        </Field>
        <Field label="Terms & conditions" wide>
          <textarea rows={3} {...defaults("terms")} />
        </Field>
        <Field label="Default note" wide hint="Optional text for the “Note:” area.">
          <textarea rows={2} {...defaults("notes")} />
        </Field>
        <Field label="Accent colour">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={values.defaults.accentColor}
              onChange={(e) => setIn("defaults", "accentColor", e.target.value)}
              className="h-9 w-14 cursor-pointer rounded border border-border bg-background p-0.5"
            />
            <span className="text-xs text-muted-foreground">{values.defaults.accentColor}</span>
          </div>
        </Field>
        <div className="space-y-2.5 sm:col-span-2">
          <Check checked={values.defaults.gstEnabled} onChange={(v) => setIn("defaults", "gstEnabled", v)}>
            Charge GST on new invoices by default
          </Check>
          {values.defaults.gstEnabled && (
            <div className="grid gap-4 pl-6 sm:grid-cols-2">
              <Field label="Supply type">
                <select {...defaults("gstMode")}>
                  <option value="INTRA">Same state — CGST + SGST</option>
                  <option value="INTER">Other state — IGST</option>
                </select>
              </Field>
              <Field label="GST rate (%)">
                <input inputMode="decimal" {...defaults("gstRate")} />
              </Field>
              <div className="sm:col-span-2">
                <Check checked={values.defaults.pricesIncludeGst} onChange={(v) => setIn("defaults", "pricesIncludeGst", v)}>
                  Prices already include GST
                </Check>
              </div>
            </div>
          )}
          <Check checked={values.defaults.roundOff} onChange={(v) => setIn("defaults", "roundOff", v)}>
            Round invoice totals to the nearest rupee
          </Check>
        </div>
      </Section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:opacity-90 disabled:opacity-60"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? "Saving…" : "Save settings"}
        </button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-green-700">
            <CheckCircle2 size={15} />
            Saved
          </span>
        )}
        <p className="text-xs text-muted-foreground">
          Applies to new invoices. Invoices you have already created keep the details they were issued with.
        </p>
      </div>
    </form>
  );
}
