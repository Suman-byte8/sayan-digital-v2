import { api } from "@/lib/api-server";
import { blankInvoice } from "@/lib/invoice-state";
import { InvoiceEditor } from "@/components/invoices/invoice-editor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Generate Invoice — Sayan Digital Admin",
};

export default async function NewInvoicePage() {
  // Next invoice number + business/payment details from the last invoice.
  // If this fails the editor still works with built-in defaults.
  const defaults = await api
    .getInvoiceDefaults()
    .then((result) => result.data)
    .catch(() => null);

  return <InvoiceEditor initial={blankInvoice(defaults)} />;
}
