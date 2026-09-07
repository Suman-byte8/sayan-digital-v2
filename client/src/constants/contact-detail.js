/*
 * Content for the /contact page — drafted from a Google Stitch mockup
 * (2026-09-08). Several changes from the mockup, consistent with rules
 * followed on every other page:
 * - Dropped a fabricated "EST. 2018" founding year and a live "Studio
 *   Workshop Active Now" status dot (nothing tracks real-time open/closed
 *   state, so showing it as always "live" would be misleading).
 * - Dropped a specific invented street address/landmark and a stock photo
 *   presented as if it were this shop's actual storefront — contact details
 *   route through the single canonical `constants/brand.js` placeholders
 *   used everywhere else on the site, and the map is the same decorative
 *   CSS grid + pin already used on the homepage's local-trust-section.jsx,
 *   not a fabricated location photo.
 * - Softened an invented "over 120 physical substrate swatches" figure to
 *   a qualitative claim, and an assertion of a specific "founder and
 *   printing technologists" staff structure to generic "our team."
 */

export const QUICK_CONTACT_CARDS = [
  {
    key: "phone",
    icon: "Phone",
    tag: "Live Desk",
    title: "Direct Phone Call",
    description: "Speak directly with our print workshop.",
    ctaLabel: "Call the Workshop",
    tone: "brand",
  },
  {
    key: "whatsapp",
    icon: "MessageCircle",
    tag: "Instant Proofing",
    title: "WhatsApp Quick Chat",
    description: "Send reference images and get live previews.",
    ctaLabel: "Chat on WhatsApp",
    tone: "whatsapp",
  },
  {
    key: "email",
    icon: "Mail",
    tag: "Vector / Bulk Assets",
    title: "Studio Email",
    description: "Send print-ready vectors and bulk order requests.",
    ctaLabel: "Send an Email",
    tone: "gold",
  },
];

export const CONTACT_CATEGORY_OPTIONS = [
  { value: "drinkware", label: "Sublimation Drinkware & Mugs" },
  { value: "corporate", label: "Corporate Identity & Welcome Kits" },
  { value: "idcards", label: "Smart ID Cards & Lanyards" },
  { value: "apparel", label: "Custom Polos, Tees & Caps" },
  { value: "trophies", label: "Trophies, Crystals & Mementos" },
  { value: "frames", label: "UV Flatbed Photo Frames" },
  { value: "other", label: "Other Custom Print Request" },
];

export const CONTACT_QUANTITY_OPTIONS = [
  { value: "single", label: "Single piece / Personalized gift (1 pc)" },
  { value: "tier1", label: "Small batch (10 – 50 pcs)" },
  { value: "tier2", label: "Medium organization (50 – 200 pcs)" },
  { value: "tier3", label: "Bulk institutional (500+ pcs)" },
];

export const CONTACT_FAQS = [
  {
    question: "How do I send my design files or photos for customized printing?",
    answer:
      "You can fill in the quote form above, email vector artwork (.AI, .EPS, .CDR, or layered .PDF) to our studio email, or share high-resolution photos over WhatsApp. If your artwork needs touch-ups or background cleanup, our team can help with basic preparation.",
  },
  {
    question: "What is the typical turnaround time for orders in Malda?",
    answer:
      "Standard individual keepsakes (custom mugs, acrylic blocks, t-shirts) are usually completed within 24 to 48 hours. Bulk institutional orders (200+ ID badges or welcome kits) typically take 3 to 5 business days after final digital mockup approval.",
  },
  {
    question: "Can I order just a single personalized piece, or are there minimum quantities?",
    answer:
      "Single-piece commissions are welcome — a framed portrait, an engraved keepsake, or a custom mug. There's no minimum order quantity on personalized gifting items.",
  },
  {
    question: "Do you provide corporate volume discounts and institutional billing?",
    answer:
      "Yes. We work with schools, colleges, and corporate customers across the region, with slab pricing for larger quantities and GST invoices for institutional orders.",
  },
  {
    question: "Can I visit your Malda studio to inspect samples before ordering?",
    answer:
      "Yes — you're welcome to drop by during working hours to see a range of physical material swatches (matte acrylic, wood, metallic foil, fabric) before placing an order.",
  },
];
