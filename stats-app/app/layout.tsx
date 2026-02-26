import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Navbar } from "@/components/Navbar";
import { DateRangeFilter } from "@/components/filters/DateRangeFilter";
import { ErrorBoundary } from "@/components/ErrorBoundary";
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
  title: "StatCompare",
  description: "Compare NFL player and team statistics",
};

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
          <ErrorBoundary>
            <Suspense>
              <Navbar />
              <DateRangeFilter />
            </Suspense>
            <main className="container mx-auto px-4 py-6">
              {children}
            </main>
          </ErrorBoundary>
        </NuqsAdapter>
      </body>
    </html>
  );
}
