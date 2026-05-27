import type { Metadata, Viewport } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NebulaTools — The Ultimate AI Tools Marketplace",
    template: "%s | NebulaTools",
  },
  description: "Access 100+ premium AI tools with one subscription. Writing, image generation, coding, SEO, and more — all in one place.",
  keywords: ["AI tools", "artificial intelligence", "AI marketplace", "AI subscription", "productivity", "writing AI", "image AI"],
  authors: [{ name: "NebulaTools" }],
  creator: "NebulaTools",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "NebulaTools",
    title: "NebulaTools — The Ultimate AI Tools Marketplace",
    description: "Access 100+ premium AI tools with one subscription.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "NebulaTools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NebulaTools — The Ultimate AI Tools Marketplace",
    description: "Access 100+ premium AI tools with one subscription.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-[#080810] text-slate-200 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
