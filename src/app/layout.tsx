import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const sans = Space_Grotesk({
  variable: "--font-sans-family",
  subsets: ["latin"],
});

const mono = Space_Mono({
  variable: "--font-mono-family",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Vercel injects VERCEL_PROJECT_PRODUCTION_URL (host only, no protocol) at
// build time, so Open Graph and canonical URLs stay correct even if the project
// is renamed. The literal is only a local-dev fallback.
const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "https://portfolio-omega-three-hw8q4rw3hx.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Anupreet Singh — Portfolio",
    template: "%s — Anupreet Singh",
  },
  description:
    "Personal portfolio and project showcase by Anupreet Singh.",
  openGraph: {
    title: "Anupreet Singh — Portfolio",
    description:
      "Personal portfolio and project showcase by Anupreet Singh.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
