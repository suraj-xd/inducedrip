import type { Metadata } from "next";
import "./globals.css";
import {
  satoshi,
  ppMondwest,
} from "@/lib/fonts";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AiTryonNotifications } from "@/components/ai-tryon-notifications";
import ProgressBar from "@/components/comman/top-progress-bar";
import { Toaster } from "@/components/ui/sonner";
import { metadata as appMetadata } from "@/lib/app-info";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  ...appMetadata,
  generator: "Inducedrip",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${satoshi.variable} ${ppMondwest.variable} overscroll-contain scroll-smooth`}
    >
      <head>
        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" sizes="16x16 32x32" />
        <link rel="icon" href="/favicon/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon/favicon-96x96.png" sizes="96x96" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme and PWA */}
        <meta name="theme-color" content="#fdfff4" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Inducedrip" />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ProgressBar />
        <TooltipProvider>{children}</TooltipProvider>
        <AiTryonNotifications />
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
