import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "3D Hem – Unika 3D-utskrifter från Sverige",
    template: "%s | 3D Hem",
  },
  description:
    "Handgjorda 3D-utskrifter i PLA, PETG och Resin. Figurer, lampor och funktionella föremål tillverkade på beställning i Sverige.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-[#0a0a0a] text-[#f5f1e8] min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
