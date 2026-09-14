/*
 * Full /stationery catalog data for the Sayan Stationery line — a
 * secondary line alongside Sayan Digital's main printing catalog
 * (constants/products-catalog.js). Structure mirrors that file exactly
 * so both catalogs can share the same product-detail route and card
 * components.
 *
 * Prices and minimum order quantities are placeholders (same caveat as
 * products-catalog.js) until real business data is available.
 *
 * Images are real, freely-hotlinkable Unsplash/Pexels photos (credited
 * below, verified individually) — same convention as
 * constants/products-showcase.js. Two are close-but-not-exact matches
 * (desk-organizer is a pen-holder shot, printed-folder shows stacked
 * office binders) — fine for now, swap for real product photography
 * before a real launch, same as every other hotlinked photo on this site.
 */

export const STATIONERY_CATEGORIES = [
  { slug: "all", label: "All Stationery" },
  { slug: "notebooks-diaries", label: "Notebooks & Diaries" },
  { slug: "pens-writing", label: "Pens & Writing" },
  { slug: "files-folders", label: "Files & Folders" },
  { slug: "art-craft", label: "Art & Craft Supplies" },
  { slug: "office-essentials", label: "Office Essentials" },
  { slug: "gifting", label: "Gift Wrap & Cards" },
];

export const STATIONERY_CATALOG = [
  {
    key: "ruled-notebook",
    name: "Hardbound Ruled Notebook",
    description: "Thick 100-GSM ruled pages in a sturdy hardbound cover, built for everyday use.",
    category: "notebooks-diaries",
    categoryLabel: "Notebooks & Diaries",
    badge: "Best for School",
    price: 120,
    unit: "pc",
    minQty: "Min: 1 pc",
    image:
      "https://images.unsplash.com/photo-1733878859915-dc074dd9ee27?fm=jpg&q=60&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0",
    credit: "Dollar Gill / Unsplash",
  },
  {
    key: "leather-diary",
    name: "Personalized Leather Diary",
    description: "Faux-leather bound diary with name embossing, ribbon marker and refillable pages.",
    category: "notebooks-diaries",
    categoryLabel: "Notebooks & Diaries",
    badge: "Customizable",
    price: 350,
    unit: "pc",
    minQty: "Min: 1 pc",
    image:
      "https://images.unsplash.com/photo-1471970471555-19d4b113e9ed?fm=jpg&q=60&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0",
    credit: "Hope House Press / Unsplash",
  },
  {
    key: "gel-pen-set",
    name: "Premium Gel Pen Set",
    description: "Smooth-writing gel pens in a multi-color set, packed in a reusable case.",
    category: "pens-writing",
    categoryLabel: "Pens & Writing",
    badge: "10-Pc Set",
    price: 180,
    unit: "set",
    minQty: "Min: 1 set",
    image: "https://images.pexels.com/photos/998587/pexels-photo-998587.jpeg?auto=compress&cs=tinysrgb&w=1200",
    credit: "Jessica Lewis / Pexels",
  },
  {
    key: "engraved-pen",
    name: "Engraved Metal Ballpoint Pen",
    description: "Brushed-metal ballpoint pen with precision laser-engraved name or message.",
    category: "pens-writing",
    categoryLabel: "Pens & Writing",
    badge: "Laser Engraved",
    price: 220,
    unit: "pc",
    minQty: "Min: 1 pc",
    image:
      "https://images.unsplash.com/photo-1513666639414-f795d25747a8?fm=jpg&q=60&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0",
    credit: "Jess Bailey / Unsplash",
  },
  {
    key: "ring-binder",
    name: "PU Leather Ring Binder",
    description: "A4 ring binder in textured PU leather, with pocket inserts and pen loop.",
    category: "files-folders",
    categoryLabel: "Files & Folders",
    badge: "A4 Size",
    badgeTone: "neutral",
    price: 280,
    unit: "pc",
    minQty: "Min: 1 pc",
    image:
      "https://images.pexels.com/photos/17018372/pexels-photo-17018372.jpeg?auto=compress&cs=tinysrgb&w=1200",
    credit: "Jakub Zerdzicki / Pexels",
  },
  {
    key: "printed-folder",
    name: "Custom Printed Document Folder",
    description: "Full-color branded document folder with inner pockets, for institutions and events.",
    category: "files-folders",
    categoryLabel: "Files & Folders",
    badge: "Bulk Friendly",
    badgeTone: "neutral",
    price: 45,
    unit: "pc",
    minQty: "Min: 50 pcs",
    minQtyTone: "strong",
    image: "https://images.pexels.com/photos/5668485/pexels-photo-5668485.jpeg?auto=compress&cs=tinysrgb&w=1200",
    credit: "Sora Shimazaki / Pexels",
  },
  {
    key: "sketch-kit",
    name: "Sketching & Drawing Kit",
    description: "Graphite pencil set with blending stump, eraser and sharpener in a roll-up pouch.",
    category: "art-craft",
    categoryLabel: "Art & Craft Supplies",
    badge: "12-Pc Kit",
    price: 250,
    unit: "kit",
    minQty: "Min: 1 kit",
    image:
      "https://images.pexels.com/photos/2935006/pexels-photo-2935006.jpeg?auto=compress&cs=tinysrgb&w=1200",
    credit: "Messala Ciulla / Pexels",
  },
  {
    key: "watercolor-set",
    name: "Watercolor Paint Set",
    description: "24-shade watercolor palette with a refillable water brush pen included.",
    category: "art-craft",
    categoryLabel: "Art & Craft Supplies",
    badge: "24 Shades",
    price: 420,
    unit: "set",
    minQty: "Min: 1 set",
    image:
      "https://images.unsplash.com/photo-1578521157034-273977158e71?fm=jpg&q=60&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0",
    credit: "Fallon Michael / Unsplash",
  },
  {
    key: "desk-organizer",
    name: "Desk Organizer Set",
    description: "Multi-compartment desk caddy for pens, clips, sticky notes and small supplies.",
    category: "office-essentials",
    categoryLabel: "Office Essentials",
    badge: "5-in-1",
    price: 380,
    unit: "pc",
    minQty: "Min: 1 pc",
    image:
      "https://images.unsplash.com/photo-1637162706431-f3b60962a82a?fm=jpg&q=60&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0",
    credit: "Behnam Norouzi / Unsplash",
  },
  {
    key: "sticky-note-combo",
    name: "Sticky Notes & Memo Pad Combo",
    description: "Assorted sticky note pads and a ruled memo block for desks and study tables.",
    category: "office-essentials",
    categoryLabel: "Office Essentials",
    badge: "Combo Pack",
    badgeTone: "neutral",
    price: 90,
    unit: "combo",
    minQty: "Min: 1 combo",
    image: "https://images.pexels.com/photos/6991377/pexels-photo-6991377.jpeg?auto=compress&cs=tinysrgb&w=1200",
    credit: "DS stories / Pexels",
  },
  {
    key: "gift-wrap-roll",
    name: "Custom Printed Gift Wrap Roll",
    description: "Branded or pattern-printed gift wrap, sold by the roll for retail or event use.",
    category: "gifting",
    categoryLabel: "Gift Wrap & Cards",
    badge: "Custom Print",
    price: 150,
    unit: "roll",
    minQty: "Min: 5 rolls",
    minQtyTone: "strong",
    image:
      "https://images.pexels.com/photos/28975432/pexels-photo-28975432.jpeg?auto=compress&cs=tinysrgb&w=1200",
    credit: "Terrance Barksdale / Pexels",
  },
  {
    key: "greeting-card-set",
    name: "Handmade Greeting Card Set",
    description: "Hand-finished greeting cards with envelopes, for birthdays, festivals and occasions.",
    category: "gifting",
    categoryLabel: "Gift Wrap & Cards",
    badge: "5-Card Set",
    price: 200,
    unit: "set",
    minQty: "Min: 1 set",
    image: "https://images.pexels.com/photos/3358726/pexels-photo-3358726.jpeg?auto=compress&cs=tinysrgb&w=1200",
    credit: "Jonathan Borba / Pexels",
  },
];
