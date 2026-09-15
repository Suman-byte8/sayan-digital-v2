import { BRAND } from "@/constants/brand";

// Content for /privacy-policy and /terms-of-service. Scoped to what the
// site actually does today (product catalog + phone/WhatsApp/email/contact
// -form inquiries, Google Analytics) — not a real online checkout/payment
// flow yet, so the copy doesn't claim one. Update alongside any future
// checkout/accounts/payment feature.
export const LEGAL_LAST_UPDATED = "September 2026";

const CONTACT_SECTION = {
  heading: "Contact us",
  body: [
    `Questions about this page? Reach us at ${BRAND.email}, or by phone at ${BRAND.phone} / ${BRAND.phoneSecondary}. We're based at ${BRAND.addressLine}.`,
  ],
};

export const PRIVACY_POLICY_SECTIONS = [
  {
    heading: "Overview",
    body: [
      "This Privacy Policy explains how Sayan Digital (\"we\", \"us\", \"our\"), a customized printing and personalization studio based in Malda, West Bengal, India, handles information in connection with this website.",
      "We are a small, locally-run business — this policy is written in plain terms rather than dense legal boilerplate, and covers exactly what the site does today.",
    ],
  },
  {
    heading: "Information we collect",
    body: [
      "Information you provide directly: if you reach out via our contact form, phone, WhatsApp, or email, we receive whatever you choose to share — typically your name, contact details, and the nature of your enquiry. Our contact form opens your own email app to send that message directly to us; we don't run a server-side database that stores form submissions, but we do keep the resulting emails in our inbox to respond to you.",
      "Information collected automatically: we use Google Analytics to understand how visitors use this site (pages viewed, general location/device information inferred from your IP address and browser, and similar usage data), via cookies and similar technologies. This helps us understand what's useful and improve the site.",
    ],
  },
  {
    heading: "How we use your information",
    body: [
      "To respond to enquiries, quote requests, and customer support questions.",
      "To understand overall site usage and improve our pages, products, and services.",
      "To comply with legal obligations where applicable.",
    ],
  },
  {
    heading: "Cookies and analytics",
    body: [
      "Google Analytics sets cookies in your browser to distinguish visitors and measure site usage. You can control or delete cookies through your browser settings, or opt out of Google Analytics tracking using Google's own browser opt-out tools. Blocking cookies won't affect your ability to browse the site or contact us.",
    ],
  },
  {
    heading: "Sharing your information",
    body: [
      "We do not sell your personal information.",
      "We share limited usage data with Google, as our analytics provider, under their own privacy terms.",
      "We may disclose information if required to do so by law, or to protect our rights, safety, or property.",
    ],
  },
  {
    heading: "Data security",
    body: [
      "We take reasonable steps to protect information we hold, but no method of transmission or storage is completely secure. Please avoid sending highly sensitive information (such as payment card details) over email or our contact form.",
    ],
  },
  {
    heading: "Your rights",
    body: [
      "Under India's Digital Personal Data Protection Act, 2023, and applicable law, you may have the right to access, correct, or request deletion of personal information we hold about you (for example, past email correspondence). To make a request, contact us using the details below.",
    ],
  },
  {
    heading: "Children's privacy",
    body: [
      "This site is intended for general audiences and is not directed at children. We do not knowingly collect personal information from children.",
    ],
  },
  {
    heading: "Changes to this policy",
    body: [
      `We may update this policy as our site and services evolve — for example, if we introduce online ordering or accounts in the future. The "last updated" date below will reflect the most recent revision.`,
    ],
  },
  CONTACT_SECTION,
];

export const TERMS_OF_SERVICE_SECTIONS = [
  {
    heading: "Acceptance of terms",
    body: [
      "By accessing or using this website, you agree to these Terms of Service. If you do not agree, please do not use the site.",
    ],
  },
  {
    heading: "About this site",
    body: [
      "This site showcases Sayan Digital's customized printing products and services — sublimation printing, personalized gifts, apparel, corporate merchandise, stationery, and related offerings — based in Malda, West Bengal, India.",
      "Product listings, images, and prices shown are for reference and are subject to confirmation. Final pricing, specifications, and availability for any order are confirmed directly with us via phone, WhatsApp, email, or in person before any order is placed.",
    ],
  },
  {
    heading: "Orders and customization",
    body: [
      "Orders, quotes, and custom print jobs are arranged directly between you and Sayan Digital outside of an automated checkout on this site. Turnaround times, minimum quantities, and pricing discussed with us for a specific order take precedence over general information shown on the site.",
      "When you submit artwork, photos, or designs for printing, you confirm that you own the rights to that content, or have permission to use it, and that it does not infringe on any third party's rights. You remain responsible for the content you ask us to print.",
    ],
  },
  {
    heading: "Intellectual property",
    body: [
      "The Sayan Digital name, logo, and the design, layout, text, and images on this site (excluding content you submit to us for printing) are owned by Sayan Digital or used with permission, and may not be reproduced without our consent.",
    ],
  },
  {
    heading: "Acceptable use",
    body: [
      "Please don't use this site to attempt unauthorized access to our systems, interfere with its normal operation, or submit content for printing that is unlawful, infringing, or fraudulent.",
    ],
  },
  {
    heading: "Limitation of liability",
    body: [
      "This site and its content are provided \"as is\". While we aim to keep information accurate and up to date, we don't guarantee the site will always be error-free or uninterrupted, and we aren't liable for indirect or consequential losses arising from your use of it, to the extent permitted by law.",
    ],
  },
  {
    heading: "Governing law",
    body: [
      "These Terms are governed by the laws of India. Any disputes will be subject to the jurisdiction of the courts at Malda, West Bengal.",
    ],
  },
  {
    heading: "Changes to these terms",
    body: [
      "We may update these Terms from time to time, particularly as our services evolve. The \"last updated\" date below reflects the most recent revision.",
    ],
  },
  CONTACT_SECTION,
];
