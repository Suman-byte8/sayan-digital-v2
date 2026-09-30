import Link from "next/link";
import { BRAND } from "@/constants/brand";

// Plain, crawlable statement of what this website/app is for and what it
// does with user data — required for Google OAuth brand verification (the
// home page must explain the app's purpose) and useful to visitors.
export function SitePurposeSection() {
  return (
    <section aria-labelledby="site-purpose-heading" className="bg-background py-12">
      <div className="container-premium max-w-3xl">
        <h2 id="site-purpose-heading" className="text-xl font-semibold text-foreground">
          What this website is for
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {BRAND.name} is the online store and ordering site of a customized printing studio in{" "}
          {BRAND.location}. Customers can browse printing products and stationery, create an
          account, save favourites, place orders, and track them in their profile.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The site uses the Google Drive API only to store product photos uploaded by our staff
          and profile pictures uploaded by customers, in a Drive folder owned by {BRAND.name}. We
          never read, list or access anyone&rsquo;s personal Google Drive or other Google data.
          Details are in our{" "}
          <Link href="/privacy-policy" className="text-(--brand) underline underline-offset-2">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms-of-service" className="text-(--brand) underline underline-offset-2">
            Terms of Service
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
