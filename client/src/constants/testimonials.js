// Placeholder content only — no real ratings, review counts or customer
// details exist yet. Swap GOOGLE_RATING and TESTIMONIALS for live data once
// the Google Business Profile is connected; the shape is intentionally
// simple ({ rating, reviewCount } and { name, role, initials, quote }) so
// that swap is a drop-in.
export const GOOGLE_RATING = {
  label: "Google Reviews — Sample Layout",
  note: "Live rating and review count will appear here once connected.",
  isPlaceholder: true,
};

export const TESTIMONIALS = [
  {
    initials: "LB",
    name: "Local Business Owner",
    role: "Sample review",
    quote: "Placeholder testimonial — real customer reviews will appear here once connected to Google.",
  },
  {
    initials: "SC",
    name: "School Coordinator",
    role: "Sample review",
    quote: "Placeholder testimonial — real customer reviews will appear here once connected to Google.",
  },
  {
    initials: "EC",
    name: "Event Client",
    role: "Sample review",
    quote: "Placeholder testimonial — real customer reviews will appear here once connected to Google.",
  },
];
