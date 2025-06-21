import localFont from "next/font/local";

export const ppMondwest = localFont({
  src: [
    {
      path: "../public/fonts/mondwest/ppmondwest-regular.otf",
    }
  ],
  variable: "--font-pp-mondwest",
})

export const satoshi = localFont({
  src: [
    {
      path: "../public/fonts/satoshi/Satoshi-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/satoshi/Satoshi-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/satoshi/Satoshi-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/satoshi/Satoshi-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
});
