import { Marquee } from "@/components/motion/marquee";

const ITEMS = [
  { label: "Sublimation Printing", icon: "Printer" },
  { label: "Customized Mugs", icon: "Coffee" },
  { label: "ID Cards", icon: "IdCard" },
  { label: "Lanyard Printing", icon: "CreditCard" },
  { label: "Photo Frames", icon: "Frame" },
  { label: "Corporate Merchandise", icon: "Building2" },
  { label: "Personalized Gifts", icon: "Gift" },
  { label: "Bulk Printing", icon: "Layers" },
];

export function MarqueeStrip() {
  return (
    <div className="border-y border-border bg-(--brand) py-4">
      <Marquee items={ITEMS} tone="dark" />
    </div>
  );
}
