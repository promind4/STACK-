import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/panier", "/compte", "/admin", "/api/", "/recherche"],
        },
        sitemap: "https://fluxlab.fr/sitemap.xml",
    };
}
