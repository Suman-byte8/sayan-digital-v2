import { ComingSoonView } from "@/components/coming-soon/coming-soon-view";

export const metadata = {
  title: "Under Process — Sayan Digital",
  description:
    "Sayan Digital's site is currently under development. Leave your email to be notified when it's ready, or preview the site in progress.",
  // Temporary gate page — must never be what gets indexed in place of the
  // real site, regardless of how many crawlers land here via the proxy redirect.
  robots: { index: false, follow: false },
};

export default function ComingSoonPage() {
  return <ComingSoonView />;
}
