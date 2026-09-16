import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ProductsProvider } from "@/context/products-context";
import { AuthProvider } from "@/context/auth-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { CartProvider } from "@/context/cart-context";
import { api } from "@/lib/api";

// Every real page of the site (everything except /coming-soon, which is
// deliberately chromeless) lives under this route group so Navbar/Footer
// render exactly once, centrally, instead of every page importing and
// rendering its own copy — one less place for a future page to miss them
// or compose them slightly differently.
//
// This layout also does the one server-side fetch of both product
// catalogs (cached by Next's Data Cache — see lib/api.js) and seeds the
// client-side ProductsProvider with it, so every page under this layout
// gets real data in its initial HTML (for SEO/LCP) while also being able
// to read the same data client-side without a second fetch.
export default async function SiteLayout({ children }) {
  const [printingResult, stationeryResult] = await Promise.all([
    api.listProducts({ type: "PRINTING" }).catch(() => ({ data: [] })),
    api.listProducts({ type: "STATIONERY" }).catch(() => ({ data: [] })),
  ]);

  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <ProductsProvider
            initialPrinting={printingResult.data}
            initialStationery={stationeryResult.data}
          >
            <Navbar />
            {children}
            <Footer />
          </ProductsProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
