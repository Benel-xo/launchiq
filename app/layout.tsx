import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "LaunchIQ — AI Venture Intelligence",
    template: "%s | LaunchIQ",
  },
  description:
    "LaunchIQ helps founders analyze startup ideas, market opportunities, competition, financial feasibility, and business risks with AI-powered venture intelligence.",
  keywords: [
    "startup idea validator",
    "business idea analysis",
    "startup market research",
    "startup competition analysis",
    "AI startup advisor",
    "business idea validator",
    "venture intelligence",
    "startup analysis",
    "market opportunity analysis",
  ],
  authors: [{ name: "LaunchIQ" }],
  creator: "LaunchIQ",
  publisher: "LaunchIQ",

  robots: {
    index: true,
    follow: true,
  },

  verification: {
    google: "EsrwGSrzIEZ1UqK6K2n8CEYysMrFIfcOQgxjCnkxZkU",
  },

  openGraph: {
    title: "LaunchIQ — AI Venture Intelligence",
    description:
      "Analyze startup ideas, market opportunities, competition, financial feasibility, and risks with LaunchIQ.",
    type: "website",
    siteName: "LaunchIQ",
  },

  twitter: {
    card: "summary_large_image",
    title: "LaunchIQ — AI Venture Intelligence",
    description:
      "AI-powered venture intelligence for founders and startup ideas.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}