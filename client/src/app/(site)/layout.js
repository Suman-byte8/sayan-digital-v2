import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AuthProvider } from "@/context/auth-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { CartProvider } from "@/context/cart-context";

// Every real page of the site (everything except /coming-soon, which is
// deliberately chromeless) lives under this route group so Navbar/Footer
// render exactly once, centrally, instead of every page importing and
// rendering its own copy — one less place for a future page to miss them
// or compose them slightly differently.
//
// Product data is fetched by each page that needs it (server-side, cached
// by Next's Data Cache — see lib/api.js), not here: seeding a layout-level
// client provider embedded both full catalogs in every page's HTML.
export default function SiteLayout({ children }) {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
