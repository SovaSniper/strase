import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { aeonik } from "@/lib/fonts";
import { ConnectorBanner } from "@/components/core/homepage/connect-banner";
import { RenderNavBar } from "@/components/core/nav/render-nav";
import { Toaster } from "@/components/ui/sonner"

import "./globals.css";
import '@coinbase/onchainkit/styles.css';

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
          <ConnectorBanner />
          <RenderNavBar />
          {children}
          <Toaster richColors={true} />
        </Providers>
      </body>
    </html>
  );
}
