import { api, ApiRequestError } from "@/lib/api";
import { InvoiceSettingsForm } from "@/components/settings/invoice-settings-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Settings — Sayan Digital Admin",
};

export default async function SettingsPage() {
  let settings = null;
  let loadError = null;

  try {
    settings = (await api.getInvoiceSettings()).data;
  } catch (error) {
    loadError = error instanceof ApiRequestError ? error.message : "Failed to load settings.";
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Business details and defaults used to fill in every new invoice.
        </p>
      </div>

      {loadError ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {loadError}
        </p>
      ) : (
        <InvoiceSettingsForm initial={settings} />
      )}
    </div>
  );
}
