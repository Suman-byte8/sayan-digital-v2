/*
 * Content for the dedicated /services page — drafted from a Google Stitch
 * mockup (2026-09-08). A few of the mockup's most specific technical claims
 * (an exact "ΔE < 1.5" color-accuracy figure, an exact "0.05mm" engraving
 * tolerance, a "Japanese dye" origin claim) read as unverifiable performance
 * history rather than a stated policy, so they were softened to qualitative
 * claims — same line drawn elsewhere on this site between "how we operate"
 * (kept) and "unverifiable achieved stats" (avoided). Generic industry terms
 * (Pantone, CMYK, GSM, CR-80) were kept as-is.
 */

export const SERVICE_TELEMETRY = [
  { label: "Turnaround", value: "24–48 Hours", note: "Express available in Malda" },
  { label: "Color Metric", value: "Pantone-Calibrated", note: "Consistent print-to-screen match" },
  { label: "Production Run", value: "1 to 10,000+", note: "Zero minimum on gifts" },
  { label: "Proofing SLA", value: "120 Minutes", note: "Digital visual check" },
];

export const SERVICE_DETAILS = [
  {
    key: "gifting",
    number: "01",
    tag: "Keepsakes & Sentiment",
    title: "Bespoke Personalized Gifting",
    description:
      "Transform photographs, anniversaries, and personal milestones into lasting physical keepsakes. We calibrate color directly on curved ceramic, cast acrylic, and woven textiles for pigment retention that resists flaking over time.",
    features: [
      "Sublimation Mugs & Photo Cushions",
      "LED Acrylic & 3D Photo Lamps",
      "Free Digital Composition Preview",
      "Gift Box Wrapping",
    ],
    ctaLabel: "Explore Gifting Catalog",
    ctaIcon: "ArrowRight",
    ctaHref: "/products",
    note: "Single-piece orders welcome",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC-RH5IFQ8_v6lyvOwGc8m3zctwDRWFzAE-HeAE-alD1L9VKPdTFl82u1LLzWVNCX0hwWGa8GtvOWiXHNkWAkbt8MCa3Z6JIslUel5wd0YZ2wQYfAp40YrQgThbDfIOqbr7CpqMKGLRF8BLVvCuxqm5Q4Py0nCybqV9ExsDLcFkwXgz1HWqt8UuIj5y8_2-M4vyQVQ5Soq09JRAUPtKJxkag9xUi0JlIKch2qG9YTzWkbMdMjV3H49ndw",
  },
  {
    key: "corporate-kits",
    number: "02",
    tag: "Identity & Culture",
    title: "Corporate Merchandise & Welcome Kits",
    description:
      "Reinforce your brand with tailored gift suites. We combine screen, pad, and UV printing across substrates for consistent brand coloration on office stationery, drinkware, and tech accessories.",
    features: [
      "Custom Rigid Presentation Boxes",
      "Double-Walled Insulated Flasks",
      "Foil-Stamped Soft-Touch Planners",
      "Multi-Branch Batch Logistics",
    ],
    ctaLabel: "Request Corporate Deck",
    ctaIcon: "Briefcase",
    ctaHref: "/contact",
    note: "Tiered bulk pricing",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDCXnACBCm-WMmqprDlbI2cnIUrupzazc8fxufE0D3xgUaEOn-evH1pWm0L47wPn2ITcCqH6yCh6pHmIXuiZp508zQ31y0b7juKC0-40o2TqAeHg2GrOd3n3EMysVQp961jNEBRSV5Y99yQ0GmEclxYNtdjBWa-b8-NtYGgHxYJbk9JTANjHH8xAX-j7wOfr4oOsaO6mQC6sP6YdHCu4fpL0XJRjw6iaToOKo-1gmPUSDSXoE49mKCoNg",
  },
  {
    key: "id-cards",
    number: "03",
    tag: "Security & Operations",
    title: "Institutional ID Cards & Lanyards",
    description:
      "End-to-end identification for schools, healthcare facilities, and commercial complexes — high-density PVC thermal printing paired with smudge-resistant satin lanyards and tamper-evident overlays.",
    features: [
      "CR-80 PVC Cards with Barcode/QR",
      "Continuous Satin Lanyards (16/20mm)",
      "Heavy-Duty Grippers & Retractable Yo-Yos",
      "Student/Staff Data Merge Service",
    ],
    ctaLabel: "Order Sample ID Pack",
    ctaIcon: "IdCard",
    ctaHref: "/contact",
    note: "Instant variable data merge",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCVS79dO3EqsLYBxEH4Z5RJJOCAuxRorxdH4Yaxky8O8xt23k_rUzcFuEknOugWOpQ1lT8zBz8y_KCYC649Jc3gF4CkeGWG8eyJ8J5CLUmVMwKLuppN1hDlKbTTxKsuprqt2gxD9jrt4Lds3oQnB0l9YINyz3XZJwlYw_u90rH1bX2yhMTh74-eVsWIssXdywg8rns3ulczJipT7uWHfj1GqmoskRdzrR5Hgr_Iksi7DVchre-l0EtWEQ",
  },
  {
    key: "apparel",
    number: "04",
    tag: "Apparel & Textiles",
    title: "Dye-Sublimation & Apparel Printing",
    description:
      "High-chroma wearable prints engineered for breathable comfort and wash durability. Using premium sublimation dyes and precise DTF transfer, our textiles resist cracking, fading, and peeling in humid conditions.",
    features: [
      "All-Over 360° Sportswear Sublimation",
      "Bio-Washed Combed Cotton Polos",
      "Wash-Fast Café & Chef Aprons",
      "Pre-Shrunk Sizing & Fabric Swatches",
    ],
    ctaLabel: "View Fabric Samples",
    ctaIcon: "Shirt",
    ctaHref: "/products",
    note: "Multiple GSM options available",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC97dzv51Yjce4jJlgqXk7XxTrr8LjmysqsueUYgguEWjRqyCSfwV-uoBn_S95fojogPMtpq5HTxCQ3WtuTPyfeWLBQMlG1VjESDErpLuqVJjO7CkYfgbF_8zB9vRaR_LBCX4ELiGW6XPIeM-I--iezJyTEJUjTg2sEB8Alxru1i4Txvgv-A_EQLlaTpBqsKu6SclDFqJXWDYfMGXK4t9mDhgqbJlNENzJrIe7sYvRqA0TUiZfM5Bn0eA",
  },
  {
    key: "engraving",
    number: "05",
    tag: "Subtractive Craft",
    title: "Laser Engraving & Wooden Craft",
    description:
      "Fine detail engraving and cutting across hardwood, anodized aluminum, cast brass, and leatherette — used for tactile executive awards, plaques, and bespoke desk mementos.",
    features: [
      "Natural Teak & Beech Hardwood",
      "Cast Acrylic & Beveled Crystal Plaques",
      "Rotary Engraving for Cylindrical Items",
      "Gold & Silver Metallic Accents",
    ],
    ctaLabel: "Inquire on Engraving",
    ctaIcon: "Ruler",
    ctaHref: "/contact",
    note: "Durable relief depth",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDDoIHd-RC0BkzB767MchpWP9QT-qVJ_YF-JMvmyWYXZLXYyKCD03kbh4kYjv8X3jq7JBuQY2ObT6twDrxp_8zi1PpqoiOHVbKvCbUYUEyvA0_EvNY-P9cS7lev9Ica-0dPSIQcE76JL-5hl5tgv519-YbZ8KpTD8b54gFLWf91zU-sUEH0b-KRWuGRNdjGkja94Hak-96eO3eISfyCvfD_zfHafsODcIOiAh-5rNjdFrmG5ARACJRAAg",
  },
  {
    key: "signage",
    number: "06",
    tag: "Urban Scale",
    title: "Large Format & Commercial Signage",
    description:
      "Weather-sealed architectural prints for retail storefronts, expo roll-ups, and promotional sunboard cuts — outdoor inks built for UV and moisture exposure.",
    features: [
      "Tear-Resistant Frontlit & Backlit Flex",
      "Aluminium-Base Roll-Up Standees",
      "3mm & 5mm Sunboard Mounts",
      "Matte or Gloss Weatherproof Lamination",
    ],
    ctaLabel: "Request Signage Specs",
    ctaIcon: "Megaphone",
    ctaHref: "/contact",
    note: "Rush jobs accommodated where possible",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBgYTm01Xqlr54FQz6hxpWMZnAG1W41urfKGFAfXCYMfeN1UyseAi2tLUctpJ5a59dULHFTRQLSmd_m8vRSogryQWu11T7maOv3uXv5KjiW4t0YNmaTlgtbXTdZDGSb6bD7Kcc7kh91iQlgL9rXSDa4Av6fhoSNAw4pzJasA-q64puBb1QRRpya2z_k90PtgOzEiNeD1n-T_-xt7JBZL2Ev2UjXvPHceAyVl_bNeiHMLazbzKU_Uld1tw",
  },
  {
    key: "prepress",
    number: "07",
    tag: "Pre-Press Rigor",
    title: "Design Assistance & Pre-Press Artwork Review",
    description:
      "We audit every submitted file before it reaches production — reconstructing low-resolution logos into scalable vectors and adjusting color curves for accurate reproduction.",
    features: [
      "Vector Redraws of Low-Res Logos",
      "RGB to CMYK Fogra39 Profile Calibration",
      "Bleed and Safe Margin Auditing",
      "Digital Proofing Link Before Print",
    ],
    ctaLabel: "Submit File for Free Audit",
    ctaIcon: "ShieldCheck",
    ctaHref: "/contact",
    note: "Fewer press-run surprises",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCZ1_Q5AOS6iQulI3C41sBtIBO09dICfuWp0bBYX59ujE6ehr1_cNBd-38VJKRFwLEdUck34W6BwJm6ILP0jfVluPlngE6bYEKPtMjpi8IoufIrI6pCqb6RhwdXqQzp2BPOLOU_GyFNCdwe4oYWKe_EfTmDt3kcNnc3jlMWWLU_nq6_krxH0DejKvRyoLmer--IG6AJQa95r5RPsSZahTusLRbIZkfblRF8fpwFW7Cn4N2MLY0a1Mbrbw",
  },
  {
    key: "bulk-fulfillment",
    number: "08",
    tag: "Academic & Institutional",
    title: "Bulk Order Fulfillment & School Kits",
    description:
      "Capacity for academies, colleges, and sports events — coordinated production runs for graduation ceremonies, sports meets, and academic-term kits on tight timelines.",
    features: [
      "Medals with Custom Sublimated Ribbons",
      "Textured Parchment Certificates",
      "Embossed Hardbound Diaries & Planners",
      "Student-Wise Bagged & Labeled Packaging",
    ],
    ctaLabel: "Book Institutional Meeting",
    ctaIcon: "GraduationCap",
    ctaHref: "/contact",
    note: "Bulk dispatch across the region",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBVDE8ia2g0gzwEZO9laznSuHIOk9skhaCeZpZEvZQ5Y_7HjwWUgJXxTN4t0wNY0ZzP__T1JmZE_fKUmg0uRa4WN0FQrOGnKu7_kQsJWX6AdPLaDGnOevZXb_abZdDd_S4IFun2l-10mcC28wrP0FnnAsWPvMlO8HxLpVaSia-JtJB9eozyDW7u5icFprKOhCy8tipjaoGzz8D0hiOT5D6n11ajv8m5ZrtQVmWWRYCuOtL9UDVaTDrRvw",
  },
];

export const SERVICE_PROCESS_STEPS = [
  {
    step: "01",
    tag: "Initiation",
    title: "Consult & Select",
    description:
      "Choose your product, substrate, or custom package. Share your logo, photos, or brief with us via WhatsApp or the contact form.",
  },
  {
    step: "02",
    tag: "Pre-Press",
    title: "Digital Proofing",
    description:
      "Receive a calibrated mockup or vector proof. We check layout, margins, and color until you sign off.",
  },
  {
    step: "03",
    tag: "Manufacturing",
    title: "Precision Printing",
    description:
      "In-house production using sublimation presses, UV flatbeds, or lasers, depending on the product.",
  },
  {
    step: "04",
    tag: "Dispatch",
    title: "Quality & Handover",
    description:
      "Hand-inspected, sealed in protective packaging, and dispatched for courier or studio pickup in Malda.",
  },
];

export const SERVICE_BENCHMARKS = [
  {
    icon: "Rocket",
    title: "24–48h Local Turnaround",
    description:
      "Rush fulfillment from our Malda workshop for urgent events, convocations, and last-minute gifts.",
  },
  {
    icon: "Palette",
    title: "Consistent Color Fidelity",
    description:
      "Printers run on calibrated color profiles so the approved digital proof matches the physical print.",
  },
  {
    icon: "Infinity",
    title: "No Minimum Order",
    description:
      "Order a single personalized mug, plaque, or t-shirt with the same care given to institutional batches.",
  },
  {
    icon: "Store",
    title: "Direct Malda Studio Pickup",
    description:
      "Inspect your prints in person before taking them home, or request courier dispatch across the region.",
  },
];
