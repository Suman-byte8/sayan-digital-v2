import { InvoiceTabs } from "@/components/invoices/invoice-tabs";

export default function InvoicesLayout({ children }) {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-foreground">Invoices</h1>
        <p className="text-sm text-muted-foreground">
          Create, share and keep track of client invoices.
        </p>
      </div>
      <InvoiceTabs />
      {children}
    </div>
  );
}
