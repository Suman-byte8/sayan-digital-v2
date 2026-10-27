import { Cormorant_Garamond, Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { CustomCursor } from "@/components/motion/custom-cursor";
import { MotionProvider } from "@/components/motion/motion-provider";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { JsonLd } from "@/components/seo/json-ld";
import {
  SITE_URL,
  buildLocalBusinessJsonLd,
  buildMetadata,
  buildWebsiteJsonLd,
} from "@/lib/seo";
import { Providers } from "./providers";
import "./globals.css";

const GA_ID = "G-QQC8VCXRBG";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  // Google Search Console domain-ownership verification (renders the
  // <meta name="google-site-verification"> tag).
  verification: { google: "cGacXX8RcdXVUP3YcU8OyImZH5HAnyX1p9bURJPLr0w" },
  ...buildMetadata({
    title: "Sayan Digital | Custom Printing & Personalized Gifts in Malda",
    description:
      "Sayan Digital provides customized sublimation printing, personalized gifts, photo printing, custom T-shirts, mugs, corporate gifts, ID cards and lanyard printing in Malda, West Bengal.",
    path: "/",
  }),
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#15398a",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col bg-background" suppressHydrationWarning>
        <JsonLd data={[buildLocalBusinessJsonLd(), buildWebsiteJsonLd()]} />
        <SmoothScroll />
        <MotionProvider>
          <CustomCursor />
          <Providers>{children}</Providers>
        </MotionProvider>
        <Analytics />
      </body>
      {/* lazyOnload: gtag.js waits until the page has loaded and the browser
          is idle, instead of competing with hydration (it was the largest
          source of Total Blocking Time). Visits that end within the first
          second or so may go unrecorded. */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="lazyOnload"
      />
      <Script id="ga-init" strategy="lazyOnload">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </html>
  );
}
