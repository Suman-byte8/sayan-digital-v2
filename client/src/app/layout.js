import { Cormorant_Garamond, Inter } from "next/font/google";
import { CustomCursor } from "@/components/motion/custom-cursor";
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
  title: "Sayan Digital — Customized Printing in Malda, West Bengal",
  description:
    "Sayan Digital is a customized printing and personalization store in Malda, West Bengal — premium sublimation printing, personalized gifts, corporate merchandise and more.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} scroll-smooth antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-background">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
