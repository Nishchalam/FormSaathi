import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FormSaathi — Your guide to becoming an adult",
  description:
    "A multilingual, voice-friendly guide for young Indians navigating government processes — Driving Licence, Voter ID, Passport, and Aadhaar.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-screen font-poppins">{children}</body>
    </html>
  );
}
