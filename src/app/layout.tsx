import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  title: "Klika.Live — Social Commerce & Live Shopping",
  description:
    "The next-generation AI-first social commerce platform. Discover products, watch live streams, join live auctions, and shop with AI-powered recommendations.",
  keywords: [
    "Klika",
    "social commerce",
    "live shopping",
    "live auctions",
    "AI commerce",
    "marketplace",
    "live streaming",
  ],
  authors: [{ name: "Klika.Live" }],
  icons: {
    icon: "/klika-logo.png",
    apple: "/klika-logo.png",
  },
  openGraph: {
    title: "Klika.Live — Social Commerce & Live Shopping",
    description:
      "Discover, shop, and sell in a social-first experience. Live streams, auctions, and AI-powered commerce.",
    type: "website",
    siteName: "Klika.Live",
  },
  twitter: {
    card: "summary_large_image",
    title: "Klika.Live",
    description: "The next-generation AI-first social commerce platform.",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
