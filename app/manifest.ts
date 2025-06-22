import { type MetadataRoute } from "next";
import { appInfo } from "@/lib/app-info";

export default function Manifest(): MetadataRoute.Manifest {
  return {
    name: appInfo.title || "Inducedrip - Swagstore for Induced AI",
    short_name: "Inducedrip",
    description: appInfo.description || "Swagstore for Induced AI",
    start_url: "/",
    display: "standalone",
    background_color: "#fdfff4",
    theme_color: "#fdfff4",
    orientation: "portrait-primary",
    scope: "/",
    lang: "en",
    icons: [
      {
        src: "/favicon/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/favicon/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon.ico",
        sizes: "16x16 32x32",
        type: "image/x-icon",
        purpose: "any",
      },
      {
        src: "/favicon/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    categories: ["shopping", "lifestyle", "business"],
    shortcuts: [
      {
        name: "Shop All Products",
        short_name: "Shop All",
        description: "Browse all available products",
        url: "/all",
        icons: [
          {
            src: "/favicon/favicon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
        ],
      },
    ],
  };
}
