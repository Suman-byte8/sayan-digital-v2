import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";
import { LegalPageView } from "@/components/legal/legal-page-view";
import { PRIVACY_POLICY_SECTIONS } from "@/constants/legal";

export const metadata = buildMetadata({
  title: "Privacy Policy — Sayan Digital",
  description:
    "How Sayan Digital collects, uses, and protects information when you use our website in Malda, West Bengal.",
  path: "/privacy-policy",
});

const BREADCRUMB_ITEMS = [
  { name: "Home", path: "/" },
  { name: "Privacy Policy", path: "/privacy-policy" },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(BREADCRUMB_ITEMS)} />
      <LegalPageView
        title="Privacy Policy"
        breadcrumbLabel="Privacy Policy"
        sections={PRIVACY_POLICY_SECTIONS}
      />
    </>
  );
}
