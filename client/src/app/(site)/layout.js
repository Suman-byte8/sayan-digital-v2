import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

// Every real page of the site (everything except /coming-soon, which is
// deliberately chromeless) lives under this route group so Navbar/Footer
// render exactly once, centrally, instead of every page importing and
// rendering its own copy — one less place for a future page to miss them
// or compose them slightly differently.
export default function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
