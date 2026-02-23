import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NFL Stats",
  description: "Compare NFL player and team statistics",
};

function FiltersSkeleton() {
  return (
    <div className="rounded-lg border border-foreground/10 bg-foreground/2 p-4 h-18 animate-pulse" />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NuqsAdapter>
          <Suspense fallback={<FiltersSkeleton />}>
              <main className="container mx-auto px-4 py-6">
                {children}
              </main>
          </Suspense>
        </NuqsAdapter>
      </body>
    </html>
  );
}
