import type { Metadata } from "next";
import { Instrument_Serif, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Treasury - Team Contributions",
  description: "Track team contributions across currencies with live FX conversion",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${instrumentSerif.variable} ${geist.variable} ${geistMono.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  );
}
