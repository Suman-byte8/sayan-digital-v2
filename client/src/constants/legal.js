import { BRAND } from "@/constants/brand";

// Content for /privacy-policy and /terms-of-service. The privacy policy
// covers accounts, orders, uploads and the Google Drive API use (needed for
// Google OAuth brand verification) - keep it in sync with any new data the
// site collects, e.g. when online payments (Razorpay) are added.
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
      "This Privacy Policy explains how Sayan Digital (\"we\", \"us\", \"our\"), a customized printing and personalization studio based in Malda, West Bengal, India, collects, uses, stores and shares information when you use our website at sayandigital.in (the \"Service\").",
      "The Service lets you browse our printing products and stationery, create an account, save favourites, place orders and track them. By using the Service you agree to the practices described here.",
    ],
  },
  {
    heading: "Information we collect",
    body: [
      "Account information: when you register we collect your name, email address and a password. Your password is never stored in readable form — only a one-way cryptographic hash. You can optionally add a phone number, business name, GST number and a profile picture.",
      "Order and delivery information: saved addresses (name, phone, street address, city, state, PIN code), the items in your cart, wishlist and orders, order totals, the payment method you choose (for example cash on delivery), and order status. We do not collect or store payment card numbers.",
      "Files you upload: a profile picture, or design/artwork files you provide for printing.",
      "Enquiries: whatever you share when you contact us by phone, WhatsApp, email or our contact form (typically your name, contact details and the nature of your enquiry).",
      "Automatic information: we use Google Analytics to understand how the site is used (pages viewed, approximate location, device and browser information inferred from your IP address, via cookies and similar technologies). Our servers may also log technical data such as IP address and request time for security and troubleshooting.",
    ],
  },
  {
    heading: "How we use your information",
    body: [
      "To create and secure your account and keep you signed in.",
      "To process, fulfil, deliver and support your orders, and to contact you about them.",
      "To respond to enquiries and quote requests.",
      "To understand overall site usage and improve our pages, products and services.",
      "To prevent fraud and abuse, and to comply with legal obligations.",
    ],
  },
  {
    heading: "Google user data and Google APIs",
    body: [
      "Sayan Digital does not ask visitors or customers to sign in with Google and does not access any visitor's or customer's Google account or personal Google data.",
      "Our server uses the Google Drive API, with the limited https://www.googleapis.com/auth/drive.file scope, authorized once by the business owner for the business's own Google account. It is used solely to store and serve images uploaded through the Service (product photos uploaded by our staff, and profile pictures or artwork uploaded by customers) in a dedicated Drive folder owned by Sayan Digital. The scope only permits access to files our app itself creates; it cannot see or read any other file in any Drive.",
      "Sayan Digital's use and transfer of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements. We do not use this data for advertising, do not sell it, do not transfer it to third parties except as needed to provide the Service or comply with law, and do not allow humans to read it except with your consent, for security purposes, or to comply with law.",
    ],
  },
  {
    heading: "Cookies, local storage and analytics",
    body: [
      "We use cookies and browser storage to keep you signed in, remember your cart and preferences, and (via Google Analytics) measure site usage. You can control or delete cookies in your browser settings, or opt out of Google Analytics using Google's browser opt-out tools. Blocking cookies may stop sign-in and the cart from working, but you can still browse the site and contact us.",
    ],
  },
  {
    heading: "Sharing your information",
    body: [
      "We do not sell your personal information.",
      "We share information only with service providers that help us run the Service, under their own terms: cloud hosting and database providers that store our data, Google (Analytics, and Drive for image storage as described above), and delivery partners who need your name, phone number and address to deliver your order.",
      "We may disclose information if required by law, or to protect our rights, safety or property.",
    ],
  },
  {
    heading: "Data retention and deletion",
    body: [
      "We keep account information for as long as your account is active, and order records for as long as needed for accounting, tax and legal purposes. Uploaded images are kept until you replace or delete them or ask us to.",
      "You can ask us to delete your account and associated personal data at any time by emailing us; we will do so except for records we must legally retain.",
    ],
  },
  {
    heading: "Data security",
    body: [
      "We use reasonable safeguards, including encrypted connections (HTTPS), hashed passwords and access controls. No method of transmission or storage is completely secure, so we cannot guarantee absolute security. Please do not send payment card details over email or our contact form.",
    ],
  },
  {
    heading: "Your rights",
    body: [
      "Under India's Digital Personal Data Protection Act, 2023, and other applicable law, you may have the right to access, correct or request deletion of the personal information we hold about you, and to withdraw consent. You can edit most details in your profile; for anything else, contact us using the details below.",
    ],
  },
  {
    heading: "Children's privacy",
    body: [
      "The Service is intended for general audiences and is not directed at children. We do not knowingly collect personal information from children.",
    ],
  },
  {
    heading: "Changes to this policy",
    body: [
      "We may update this policy as the Service evolves. The \"last updated\" date on this page reflects the most recent revision, and material changes will be noted on the site.",
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
