/*
 * Full /products catalog data — drafted from a Google Stitch mockup
 * (2026-09-08). Prices, minimum order quantities, and material specs
 * (GSM, K9 crystal, etc.) are placeholders from that mockup, kept as-is
 * per instruction until a real backend/DB drives this listing.
 *
 * Images are hotlinked from Stitch's own generated-asset host
 * (lh3.googleusercontent.com/aida-public/...) — same caveat as the
 * homepage's Unsplash/Pexels images: fine for now, but fragile long-term
 * and not licensed photography — replace before a real launch.
 */

export const CATEGORIES = [
  { slug: "all", label: "All Products" },
  { slug: "drinkware", label: "Drinkware & Bottles" },
  { slug: "corporate", label: "ID & Corporate Supplies" },
  { slug: "photo-gifts", label: "Photo Frames & Keepsakes" },
  { slug: "apparel", label: "Custom Apparel" },
  { slug: "awards", label: "Awards & Recognition" },
  { slug: "stationery", label: "Stationery & Visiting Cards" },
  { slug: "accessories", label: "Accessories" },
];

export const PRODUCT_CATALOG = [
  {
    key: "ceramic-mug",
    name: "Custom Ceramic Photo Mug",
    description:
      "Grade-A ceramic with microwave-safe, dishwasher-proof vibrant sublimation imprint.",
    category: "drinkware",
    categoryLabel: "Drinkware",
    badge: "Customizable",
    price: 180,
    unit: "pc",
    minQty: "Min: 1 pc",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB_jc_iP9Dga_tQ4hK8vfyzFgjARohi1TQQIch8DE6OPUmEQVP9RnkvLEFYhvFhtb3Q_plryzUbkOualRvUAqxMc9MxiWoc-I919erZhuBCzJu3OSzZGhaCd9cGNxEomxSPV2qiMTN2ON__A7Vd_TcoBVQFoHcsGMEZvCSW4A0gPO9uUIEhSStlpHY0GQRD6jvLN2AUz5p8YbXubIcL5lksGRbvacivInditZWfSeCC-dTym03G9Xhtqw",
  },
  {
    key: "led-bottle",
    name: "Personalized Temperature LED Bottle",
    description:
      "Double-walled 500ml steel with smart touch LED temperature lid & precision laser engraving.",
    category: "drinkware",
    categoryLabel: "Drinkware",
    badge: "Laser Engraved",
    price: 449,
    unit: "pc",
    minQty: "Min: 1 pc",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCqeAbe1xWhiHyZacq-N83EBvgzrKsxMR1YuHu98IwCrNZx6RdxDK_eEUHOprPAdOqlTTWIQFv_NJo74xgUgoOC_sqfpwsXMx8tKVNQHJeHA1to_XgIP0RUnvn6VBy1W5GZNN7rpbjiaRJT8SSybVMS16TAvy3b3KsDgkox9ZGGPUXgH-3qXA-JugWsfO7KVDE_0Rf2cKbQZX0UF5NKFZPmXBvXjTCf5_KVam26KTR7Vx_EDpyw93h0_Q",
  },
  {
    key: "id-card-lanyard",
    name: "HD PVC Smart ID Card & Satin Lanyard",
    description:
      "Thermal sublimation cards with tear-proof 20mm premium multicolour satin neck ribbon.",
    category: "corporate",
    categoryLabel: "Corporate",
    badge: "Bulk Friendly",
    badgeTone: "neutral",
    price: 75,
    unit: "set",
    minQty: "Min: 10 sets",
    minQtyTone: "strong",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBW0Vz4KnegH3eHxAOiZJEd8fm7l3ObI62AeoMjxB2f98JjGpuV0EkBr426lLekvLGyaZyM2xLl1_7MUv_5AxKB0Vbo4-Djc3AzK7iebVBmahYIOBGfA9Ds2o1oEIolkZkPegMgfsAHOj1WZyqr41inZt3WPIFZyY5EtuH2lcrjEze1Jloa8nhjMJtwJlxySeTuy-L4S7AZq3vyAuMWc11y7dNraXiRiooPUAtjnt__llJwVMrwNBVg5Q",
  },
  {
    key: "corporate-gift-set",
    name: "Executive Corporate Gift Set",
    description:
      "Debossed A5 diary, precision rollerball pen, matte thermal flask & leather keychain.",
    category: "corporate",
    categoryLabel: "Corporate",
    badge: "4-in-1 Hamper",
    price: 899,
    unit: "kit",
    minQty: "Min: 5 kits",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA40V0kG4FydyVfSWfKRHnTNH03o7j4YglD63ffS1xN7XR7EYUZUZlw2enAf5ZdcrSrmEKXYpk45_V7GmEb7TIwX0dcBxUkRjxtbriSBi0hifRmbk0wxLBwJsm5D3mRw23iWKMk1fUVW0OmedUSBCbZzHpUKzjVeY5YR1PAqWFd4Hs7R4fHOX9tayEHNMCDM8hb_OQZkP7fmRjVoMdVNeZf6KoCeIwKuMrZin1RhCunr4irmYyyQ8zWOw",
  },
  {
    key: "floating-photo-frame",
    name: "Premium Wooden Floating Photo Frame",
    description:
      "Museum-grade acrylic float frame with scratch-resistant UV cured gallery print.",
    category: "photo-gifts",
    categoryLabel: "Photo & Gift",
    badge: "UV Flatbed",
    price: 550,
    unit: "frame",
    minQty: "Min: 1 pc",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDhK3WsCqlV7WeLLaHvuStgTQ-jG7VVgV4mECxQRITM3OH1odp0rb8u_OofUHiDl9RduKwW-nOw8ZchVvvOoC6B41hhaZw9Ak_-YYkiQu6pPtVc-bPo7w556cxXnloFRGAeBxP45aGerngW1pBgoZ4Squca9cLyCNgubHVEJthDNJOhmBE23bocm7-yL2qqYLbKli72aY-LQ9qa34naezn-Pe21Qn3VaGI9D7r9Qfigoxi17XHdLDW9VQ",
  },
  {
    key: "bio-washed-tshirt",
    name: "Custom Bio-Washed Cotton T-Shirt",
    description:
      "Super-combed 100% cotton fabric with durable DTF / screen printing that never fades.",
    category: "apparel",
    categoryLabel: "Apparel",
    badge: "220 GSM",
    price: 299,
    unit: "pc",
    minQty: "Min: 5 pcs",
    minQtyTone: "strong",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDEQ1F9XetvtWeKcTUGN_Hs3z6dyMd57MGxZ43aXoH8FVqOgu9eiSvqDYowGqt0_2IWv93GDUek-dcy8lo52p00vTzbowJBTzNO-YDJCHbdTbUpNi9sjeQx9NNBCPfCWIrpxyxYjc2ZqW-0jNtk2oyabtNnDiAC0dbQ4uyodFTLXUkT6l7SWBiLLWVZcxzY4ORHgFxHgcA1UD8eKLun8PALBWhQ4noNf1JGTd532Qvq79amIQUJne9iaw",
  },
  {
    key: "crystal-trophy",
    name: "Crystal & Wooden Recognition Trophy",
    description:
      "Optical bevelled crystal with natural hardwood pedestal and 3D sub-surface laser engraving.",
    category: "awards",
    categoryLabel: "Awards",
    badge: "Optical K9",
    price: 750,
    unit: "award",
    minQty: "Min: 1 pc",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDbeN4e2GGkrorL0ZDpoifZCcSSvsB-2CVgc7Z2I_ScFgt_GiRTUA5kyKKoEHeBWgdX3fMM4L5F3UgADy0zJt7Ww9nJeQnzI25kSpyu8bnxh8ZjTdkeDGmAcCb5Llsn33BHIB2z4Ga6dW91CeU64Q-PEzSKh03_rDwIgyc4mUHYB5dadiqXoaV45ynlCHYf8FRTZtuhA3mxIXv1dAMCgRyjNyTaxXBM5dptzHBd6sTggcTkF86AAMwF5w",
  },
  {
    key: "embossed-visiting-cards",
    name: "Velvet Touch Embossed Visiting Cards",
    description:
      "Imported art board, velvety touch lamination, spot UV, and precision foil relief stamping.",
    category: "stationery",
    categoryLabel: "Stationery",
    badge: "450 GSM",
    badgeTone: "neutral",
    price: 450,
    unit: "100 pcs",
    minQty: "Min: 100 pcs",
    minQtyTone: "strong",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAjAG3rqKR0PYcYl3w1ggqD2KU3m4DiH4gDOysEQmdhdW_0nb5NPKMhI66mNe6c9Ikkr_XG4r4l6IzC1zcMMzpXGpnHKlDZInyntV-gh7qairokWF6PM7Sf7pQuUrLiOgNJIrlYXinHaiYFAW1UipchEeomT-y3nCoLC6D8KYLeKCQQceCRBHXi2gd46x-FC-8KhWOIAy64dIRwtalYMhzwY8r8CgLNoZ6kLgulb5ap-BXNKZlh_5oZkQ",
  },
  {
    key: "die-cut-stickers",
    name: "Waterproof Custom Die-Cut Stickers",
    description:
      "Weatherproof, UV-laminated vinyl stickers contoured to any custom shape or illustration.",
    category: "stationery",
    categoryLabel: "Stationery",
    badge: "Vinyl UV",
    price: 2.5,
    unit: "sticker",
    minQty: "Min: 50 pcs",
    minQtyTone: "strong",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDe9CLJINYan3VkXShISFvVE3NkcxBryBWFqVSysW7sDDwBYD44DI-WZ69tTfoqsht6JFk-i0aGpN7yQYh5OCInumSyfFTNQKPEJThanWvOzdiysI_FPZg9C9Oezs8GUfSorqkYlYamAOHG2BfHhzMbaC9iwFM8rZnQ8cFHa-AyPLgQ_kMGALwmILD8heH-VE8_ei9j3Y5oNHIcNIeSvJWuHnqEgkRzR8qKwJk__FQ1UnXXsrMUOX6jUA",
  },
  {
    key: "foil-certificate",
    name: "Foil-Stamped Merit Certificate",
    description:
      "Heavy 300 GSM textured linen paper with metallic security gold foil and anti-counterfeit seals.",
    category: "awards",
    categoryLabel: "Awards",
    badge: "Security Parchment",
    badgeTone: "neutral",
    price: 45,
    unit: "leaf",
    minQty: "Min: 25 pcs",
    minQtyTone: "strong",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDupVa1pGGA7Tszle6hP46cW1Qya5V5Ypwrhlh0auapcG2OiWBaBGgRvWO5h5hiB9YyNolIQMl5e7mfnK4yuryYmTanq0K3Ga25x4_b6HBe8-3D7inFNO3OMB9a9l8R3MgRq3jQCaLu0QJGwdZbDpNdEjneSXrhTLP0Py7CQBIi68Wh_9he0SwVspuY3Djv58UcI4mWt9q23qwyEPAzvdBmHUlIs4XUo2wt9qn0Zbaald6-EDvn8EJtIw",
  },
  {
    key: "phone-case",
    name: "Tough Matte Custom Phone Case",
    description:
      "Dual-layer polycarbonate armor with edge-to-edge 3D sublimation print wrap.",
    category: "accessories",
    categoryLabel: "Accessories",
    badge: "Shockproof",
    price: 280,
    unit: "case",
    minQty: "Min: 1 pc",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDoINVgxLa_oy8a0NzXUcjQYDuqtWphqx_zbqy4fq1_4V9VMdOQk35y362cdzaBz4wToVfNS_8bUoLrach96emIavuFJPyGmv6-6hnxluky4VkFEK2B4wTMgjjetjDO4ZyTwj6cUkv5HeqtS1f594avkNhuUVQ5khTo-Q68m3Y-2FRGx3tD6CnNjBbRL-iL8Thpi7S1tcCn9wrDJIIW_QI0q_iR-ZelOgFDZsoIf_wA1Lh_oTsD6-YVMQ",
  },
  {
    key: "leather-keychain",
    name: "Engraved Metal & Leather Keychain",
    description:
      "Genuine leather loop with brushed gunmetal hardware and precision fiber laser etched monogram.",
    category: "accessories",
    categoryLabel: "Accessories",
    badge: "Laser Etched",
    price: 120,
    unit: "pc",
    minQty: "Min: 1 pc",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB8DNuSrkHbQKpKLXGf16VY1yG49bBXEqXBkUA3xCdymfMb-TzIbPs24TKNJJt2h49BwOILsO9EBCeqqVJ0x2-pq3rF0ITaTcvmTn5rgsjc8NVRUsAeBUp9bB8ezduukn8sMCUPMlZwWJTpVq31lvedQ1lzGGDdQxtctx2dJ3uE2Ozp1klm8g-6xoV4QAdlmQLiQ2bjGgZa9aq9dHFgSJ1nLAUcSoLvbIhdUAgt8OB7dtVr6cY-CPROlA",
  },
];
