import type { Metadata, Viewport } from "next";
import { Allura, Cormorant_Garamond, Montserrat } from "next/font/google";
import { wedding } from "@/data/wedding";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Montserrat({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const script = Allura({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: `${wedding.couple.fullNames} Wedding Invitation`,
  description: `Digital wedding passport for ${wedding.couple.fullNames}, ${wedding.date.display} in ${wedding.destination.display}.`,
  other: {
    // Older Samsung Internet builds look for this name before they force-dark a page.
    "supported-color-schemes": "light",
  },
};

export const viewport: Viewport = {
  // Exact value Samsung Internet documents. CSS below still uses `only light` for Chrome.
  colorScheme: "light",
  themeColor: "#f8f5ee",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${script.variable} h-full`}
      style={{ colorScheme: "only light", backgroundColor: "#f8f5ee" }}
    >
      <head>
        <meta name="color-scheme" content="light" />
      </head>
      <body
        className="min-h-full antialiased"
        style={{ colorScheme: "only light", backgroundColor: "#f8f5ee" }}
      >
        {children}
      </body>
    </html>
  );
}
