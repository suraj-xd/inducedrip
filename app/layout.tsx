import type { Metadata } from 'next'
import './globals.css'
import { instrumentSerif, satoshi, lausanne, nippo } from "@/lib/fonts";

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning lang="en" className={`${satoshi.variable} ${instrumentSerif.variable} ${lausanne.variable} ${nippo.variable} overscroll-contain scroll-smooth`}>
      <body>{children}</body>
    </html>
  )
}
