import { Cormorant_Garamond, Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { CustomCursor } from "@/components/motion/custom-cursor";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { JsonLd } from "@/components/seo/json-ld";
import {
  SITE_URL,
  buildLocalBusinessJsonLd,
  buildMetadata,
  buildWebsiteJsonLd,
} from "@/lib/seo";
import "./globals.css";

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
        <CustomCursor />
        {children}
      </body>
      <GoogleAnalytics gaId="G-QQC8VCXRBG" />
    </html>
  );
}
