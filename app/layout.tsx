import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
