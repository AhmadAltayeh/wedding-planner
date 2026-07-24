import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans, Great_Vibes } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/bottom-nav";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
});

const script = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
});

export const metadata: Metadata = {
  title: "Ahmad & Nour · Wedding",
  description: "Venues, budget, and planning for Ahmad and Nour's wedding in Amman",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "A & N" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#3d5c54",
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${script.variable}`}>
      <body className="app-backdrop min-h-dvh font-sans antialiased">
        <main className="relative mx-auto min-h-dvh max-w-lg px-4 pb-28 pt-[max(1rem,env(safe-area-inset-top))]">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
