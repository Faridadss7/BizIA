import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BizIA — Intelligence et Performance Commerciale",
    short_name: "BizIA",
    description: "Analyste de données IA autonome et gestion commerciale pour PME et entreprises.",
    start_url: "/",
    display: "standalone",
    background_color: "#090D16",
    theme_color: "#0F172A",
    icons: [
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    categories: ["business", "finance", "productivity"],
    lang: "fr",
    orientation: "portrait",
  };
}
