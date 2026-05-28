import "./globals.css";
import { CommandPalette } from "@/components/layout/command-palette";
import { Providers } from "@/components/providers";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Lumina LMS - AI-Powered Learning Platform",
  description: "Master new skills with AI-powered coaching, live mentorship, and hands-on projects.",
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <CommandPalette />
          {children}
        </Providers>
      </body>
    </html>
  );
}
