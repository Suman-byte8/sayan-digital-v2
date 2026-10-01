import { unstable_rethrow } from "next/navigation";
import { ApiRequestError } from "@/lib/api";
import { api } from "@/lib/api-server";
import { AccountSettingsForm } from "@/components/settings/account-settings-form";
import { InvoiceSettingsForm } from "@/components/settings/invoice-settings-form";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Settings — Sayan Digital Admin",
};

export default async function SettingsPage() {
  let settings = null;
  let username = "";
  let loadError = null;

  try {
    const [settingsResult, me] = await Promise.all([api.getInvoiceSettings(), api.getAdminMe()]);
    settings = settingsResult.data;
    username = me.data.username;
  } catch (error) {
    unstable_rethrow(error);
    loadError = error instanceof ApiRequestError ? error.message : "Failed to load settings.";
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Your login, plus the business details and defaults used to fill in every new invoice.
        </p>
      </div>

      {loadError ? (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {loadError}
        </p>
      ) : (
        <div className="space-y-8">
          <AccountSettingsForm username={username} />
          <InvoiceSettingsForm initial={settings} />
        </div>
      )}
    </div>
  );
}
