import { notFound, unstable_rethrow } from "next/navigation";
import { ApiRequestError } from "@/lib/api";
import { api } from "@/lib/api-server";
import { fromApi } from "@/lib/invoice-state";
import { InvoiceEditor } from "@/components/invoices/invoice-editor";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Invoice — Sayan Digital Admin",
};

export default async function InvoiceDetailPage({ params }) {
  const { id } = await params;

  let invoice;
  try {
    invoice = (await api.getInvoice(id)).data;
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof ApiRequestError && (error.status === 404 || error.status === 400)) notFound();
    return (
      <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        {error instanceof ApiRequestError ? error.message : "Failed to load invoice."}
      </p>
    );
  }

  return <InvoiceEditor initial={fromApi(invoice)} invoiceId={invoice.id} />;
}
