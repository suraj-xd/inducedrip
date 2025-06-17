import { Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";

export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-instrument-serif",
});

export const lausanne = localFont({
  src: [
    {
      path: "../public/fonts/Lausanne/Lausanne.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-lausanne",
});

export const nippo = localFont({
  src: [
    {
      path: "../public/fonts/nippo/Nippo-Extralight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/nippo/Nippo-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/nippo/Nippo-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/nippo/Nippo-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/nippo/Nippo-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-nippo",
});

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
