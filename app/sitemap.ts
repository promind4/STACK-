import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase";
import { ARTICLES, PATHWAYS } from "@/lib/data";

// Real category slugs — must match CATEGORY_METADATA in app/categorie/[slug]/page.tsx
const CATEGORY_SLUGS = [
    // Verticals
    "audio", "video", "streaming",
    // Audio sub-categories
    "micros-dynamiques", "micros-condensateurs", "micros-usb", "micros-shotgun",
    "cartes-son", "preamplis", "casques-studio", "enceintes",
    "bras-articules", "cable-xlr", "traitement-acoustique",
    // Video sub-categories
    "hybrides-mirrorless", "webcams-pro", "action-cams",
    "keylight", "softbox", "rgb-ambiance",
    "grand-angle", "zoom-polyvalent",
    // Streaming sub-categories
    "fonds-verts", "teleprompteurs", "cable-management",
    "logiciels-apps", "design-overlays", "stream-deck",
    // Problématiques (problem-based routes)
    "espace-bruyant", "plug-and-play", "petit-budget", "createur-nomade",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = createClient();
    const { data: products } = await supabase
        .from("products")
        .select("slug, updated_at")
        .eq("is_active", true);

    const BASE = "https://fluxlab.fr";

    // --- Static pages ---
    const staticPages: MetadataRoute.Sitemap = [
        { url: BASE, changeFrequency: "weekly", priority: 1.0 },
        { url: `${BASE}/configurateur`, changeFrequency: "monthly", priority: 0.7 },
        { url: `${BASE}/guides`, changeFrequency: "weekly", priority: 0.8 },
        { url: `${BASE}/a-propos`, changeFrequency: "monthly", priority: 0.5 },
        { url: `${BASE}/methodologie`, changeFrequency: "monthly", priority: 0.5 },
        { url: `${BASE}/mentions-legales`, changeFrequency: "yearly", priority: 0.3 },
        { url: `${BASE}/confidentialite`, changeFrequency: "yearly", priority: 0.3 },
        { url: `${BASE}/cgu`, changeFrequency: "yearly", priority: 0.3 },
    ];

    // --- Category pages (verticals + sub-categories) ---
    const categoryPages: MetadataRoute.Sitemap = CATEGORY_SLUGS.map((slug) => {
        const isVertical = ["audio", "video", "streaming"].includes(slug);
        return {
            url: `${BASE}/categorie/${slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: isVertical ? 0.8 : 0.7,
        };
    });

    // --- Guide articles ---
    const guidePages: MetadataRoute.Sitemap = ARTICLES.map((article) => ({
        url: `${BASE}/guide/${article.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    // --- Guide pathways ---
    const pathwayPages: MetadataRoute.Sitemap = PATHWAYS.map((pathway) => ({
        url: `${BASE}/guide-path/${pathway.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.6,
    }));

    // --- Product pages (from Supabase) ---
    const productPages: MetadataRoute.Sitemap = (products || []).map((p) => ({
        url: `${BASE}/produit/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
    }));

    return [
        ...staticPages,
        ...categoryPages,
        ...guidePages,
        ...pathwayPages,
        ...productPages,
    ];
}
