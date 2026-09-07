"use client";

import { useId, useState } from "react";
import { ArrowRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BRAND } from "@/constants/brand";
import { CONTACT_CATEGORY_OPTIONS, CONTACT_QUANTITY_OPTIONS } from "@/constants/contact-detail";

const INITIAL_FORM = {
  name: "",
  phone: "",
  email: "",
  category: "",
  quantity: "",
  fileName: "",
  details: "",
  wantsProof: true,
};

// No backend is wired up yet, so submitting builds a pre-filled email to
// the studio's real address instead of faking a "message received" state
// that would silently go nowhere.
function buildMailto(form) {
  const categoryLabel = CONTACT_CATEGORY_OPTIONS.find((c) => c.value === form.category)?.label;
  const quantityLabel = CONTACT_QUANTITY_OPTIONS.find((q) => q.value === form.quantity)?.label;

  const lines = [
    `Name: ${form.name}`,
    `Phone / WhatsApp: ${form.phone}`,
    form.email && `Email: ${form.email}`,
    categoryLabel && `Product Category: ${categoryLabel}`,
    quantityLabel && `Quantity Needed: ${quantityLabel}`,
    form.wantsProof && "Requesting a digital proof before production.",
    "",
    "Project details:",
    form.details || "(none provided)",
  ].filter(Boolean);

  const subject = `Print Inquiry — ${form.name || "New Customer"}`;
  return `mailto:${BRAND.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    lines.join("\n")
  )}`;
}

export function ContactForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const fileInputId = useId();

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    window.location.href = buildMailto(form);
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-7 shadow-premium md:p-9">
      <p className="eyebrow-label">Direct Atelier Dispatch</p>
      <h2 className="mt-3 text-2xl font-semibold text-foreground">
        Send an Inquiry or Quote Request
      </h2>
      <p className="body-copy mt-2">
        Tell us about your print concept — this opens a pre-filled email to our studio with your
        details.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact-name">Full Name</Label>
            <Input
              id="contact-name"
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g., Sourav Mukherjee"
              className="h-11"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact-phone">Contact Number (WhatsApp)</Label>
            <Input
              id="contact-phone"
              type="tel"
              required
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+91 98XXX XXXXX"
              className="h-11"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-email">Email Address</Label>
          <Input
            id="contact-email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="name@company.com"
            className="h-11"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label>Product Category</Label>
            <Select value={form.category} onValueChange={(v) => update("category", v)}>
              <SelectTrigger className="h-11 w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CONTACT_CATEGORY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Quantity Needed</Label>
            <Select value={form.quantity} onValueChange={(v) => update("quantity", v)}>
              <SelectTrigger className="h-11 w-full">
                <SelectValue placeholder="Select quantity" />
              </SelectTrigger>
              <SelectContent>
                {CONTACT_QUANTITY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={fileInputId}>Attach Artwork / Reference File</Label>
          <label
            htmlFor={fileInputId}
            data-cursor="hover"
            className="flex cursor-pointer flex-col items-center gap-2 rounded-xl bg-muted p-6 text-center transition-colors hover:bg-muted/70"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-(--brand)/10 text-(--brand)">
              <Upload size={18} />
            </span>
            <span className="text-[13px] font-medium text-foreground">
              {form.fileName || "Click to choose a reference file"}
            </span>
            <span className="text-[12px] text-muted-foreground">
              PDF, AI, EPS, or a high-res image
            </span>
            <input
              id={fileInputId}
              type="file"
              className="hidden"
              onChange={(e) => update("fileName", e.target.files?.[0]?.name ?? "")}
            />
          </label>
          <p className="text-[11px] text-muted-foreground/70">
            This form opens an email draft — please attach the file there before sending, since
            it can&apos;t be uploaded directly here yet.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-details">Project Details / Customization Notes</Label>
          <Textarea
            id="contact-details"
            rows={4}
            value={form.details}
            onChange={(e) => update("details", e.target.value)}
            placeholder="Substrate preferences, dimensions, event deadlines, packaging needs..."
          />
        </div>

        <label className="flex items-start gap-3 text-[13px] text-foreground">
          <Checkbox
            checked={form.wantsProof}
            onCheckedChange={(checked) => update("wantsProof", checked === true)}
            className="mt-0.5"
          />
          I&apos;d like a digital proof sent to my WhatsApp / email before production starts.
        </label>

        <Button type="submit" data-cursor="hover" className="h-12 gap-2 rounded-lg">
          Continue by Email
          <ArrowRight size={16} />
        </Button>
      </form>
    </div>
  );
}
