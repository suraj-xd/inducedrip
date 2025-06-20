import type { Metadata } from "next";
import "./globals.css";
import {
  instrumentSerif,
  satoshi,
  lausanne,
  nippo,
  abcOracle,
  ppMondwest,
} from "@/lib/fonts";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AiTryonNotifications } from "@/components/ai-tryon-notifications";
import ProgressBar from "@/components/comman/top-progress-bar";

export const metadata: Metadata = {
  title: "Inducedrip",
  description: "Inducedrip",
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
      className={`${satoshi.variable} ${instrumentSerif.variable} ${lausanne.variable} ${nippo.variable} ${abcOracle.variable} ${ppMondwest.variable} overscroll-contain scroll-smooth`}
    >
      <body>
        <ProgressBar />
        <TooltipProvider>{children}</TooltipProvider>
        <AiTryonNotifications />
      </body>
    </html>
  );
}
