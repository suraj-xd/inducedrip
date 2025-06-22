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

export const metadata: Metadata = {
  title: "Inducedrip",
  description: "Swagstore for Inducedrip",
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
      <body>
        <ProgressBar />
        <TooltipProvider>{children}</TooltipProvider>
        <AiTryonNotifications />
        <Toaster />
      </body>
    </html>
  );
}
