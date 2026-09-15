import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { LegalPageView } from "@/components/legal/legal-page-view";
import { TERMS_OF_SERVICE_SECTIONS } from "@/constants/legal";

export const metadata = buildMetadata({
  title: "Terms of Service — Sayan Digital",
  description:
    "The terms that apply when you use the Sayan Digital website and order customized printing products or services from us in Malda, West Bengal.",
  path: "/terms-of-service",
});

const BREADCRUMB_ITEMS = [
  { name: "Home", path: "/" },
  { name: "Terms of Service", path: "/terms-of-service" },
];

export default function TermsOfServicePage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(BREADCRUMB_ITEMS)} />
      <LegalPageView
        title="Terms of Service"
        breadcrumbLabel="Terms of Service"
        sections={TERMS_OF_SERVICE_SECTIONS}
      />
    </>
  );
}
