import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { NavBar } from "@/components/core/nav/navbar";
import { aeonik } from "@/lib/fonts";
import { cn } from "@/lib/utils";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PayNoun",
  description: "Pay Noun, Earn Now",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${aeonik.variable} font-sans`}>
        <Providers>
          <NavBar />

          {children}
        </Providers>
      </body>
    </html>
  );
}
