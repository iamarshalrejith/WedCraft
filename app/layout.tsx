import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "WedCraft",
  description: "Invite with Style",
  openGraph: {
    title: "WedCraft",
    description: "Invite with Style",
    url: baseUrl,
    siteName: "WedCraft",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "WedCraft Invitation",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WedCraft",
    description: "Invite with Style",
    images: ["/og-default.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", figtree.variable)}  data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-200`}
      >
        <AuthProvider>
          <Navbar />
          <main className="pt-24">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
