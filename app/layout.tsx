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

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
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
        <TooltipProvider>{children}</TooltipProvider>
        <AiTryonNotifications />
      </body>
    </html>
  );
}
