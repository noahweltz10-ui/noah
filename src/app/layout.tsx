import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import GlobalReveal from "@/components/GlobalReveal";
import { CartProvider } from "@/components/CartProvider";
import CartDrawer from "@/components/CartDrawer";
import { isShopifyConfigured } from "@/lib/shopify";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["300", "400", "500"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const SITE_URL = "https://shiftcultr.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "shift culture",
    template: "%s — shift culture",
  },
  description:
    "shift culture — drop 001. cream and midnight pullovers, sweatpants, and tees.",
  openGraph: {
    title: "shift culture",
    description:
      "shift culture — drop 001. cream and midnight pullovers, sweatpants, and tees.",
    url: SITE_URL,
    siteName: "shift culture",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "shift culture",
    description:
      "shift culture — drop 001. cream and midnight pullovers, sweatpants, and tees.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full bg-paper text-ink antialiased">
        <SmoothScroll />
        <CustomCursor />
        <GlobalReveal />
        <CartProvider isConfigured={isShopifyConfigured}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[999] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
          >
            skip to content
          </a>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
