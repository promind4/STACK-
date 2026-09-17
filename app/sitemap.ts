import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase";
import { ARTICLES } from "@/lib/articles-meta";
import { PATHWAYS } from "@/lib/data";
import { AUDIO_CATEGORY_SLUGS, isPublicAudioCategory, isPublicAudioGuide } from "@/lib/public-audio-scope";

// Categories were last structurally updated with the June 2026 redesign
const CATEGORIES_LAST_MODIFIED = new Date("2026-06-08");

// Parse article date strings like "22 Feb 2026", "07 Jun 2026"
function parseArticleDate(dateStr: string): Date {
    const d = new Date(dateStr);
    // Fall back to a safe past date if parsing fails
    return isNaN(d.getTime()) ? new Date("2026-01-01") : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = createClient();
    const { data: products } = await supabase
        .from("products")
        .select("slug, updated_at, categories(slug)")
        .eq("is_active", true);

    const BASE = "https://fluxlab.fr";

    // --- Static pages ---
    const staticPages: MetadataRoute.Sitemap = [
        { url: BASE, changeFrequency: "weekly", priority: 1.0, lastModified: new Date("2026-06-17") },
        // Configurateur is the core differentiator — same priority as homepage
        { url: `${BASE}/configurateur`, changeFrequency: "monthly", priority: 0.9, lastModified: new Date("2026-06-08") },
        { url: `${BASE}/guides`, changeFrequency: "weekly", priority: 0.8, lastModified: new Date("2026-06-17") },
        { url: `${BASE}/a-propos`, changeFrequency: "monthly", priority: 0.5, lastModified: new Date("2026-06-08") },
        { url: `${BASE}/auteur/alexandre-dupont`, changeFrequency: "monthly", priority: 0.6, lastModified: new Date("2026-06-19") },
        { url: `${BASE}/methodologie`, changeFrequency: "monthly", priority: 0.5, lastModified: new Date("2026-06-08") },
        { url: `${BASE}/mentions-legales`, changeFrequency: "yearly", priority: 0.3 },
        { url: `${BASE}/confidentialite`, changeFrequency: "yearly", priority: 0.3 },
        { url: `${BASE}/cgu`, changeFrequency: "yearly", priority: 0.3 },
    ];

    // --- Category pages (verticals + sub-categories) ---
    const categoryPages: MetadataRoute.Sitemap = AUDIO_CATEGORY_SLUGS.map((slug) => {
        const isVertical = slug === "audio";
        return {
            url: `${BASE}/categorie/${slug}`,
            lastModified: CATEGORIES_LAST_MODIFIED,
            changeFrequency: "weekly" as const,
            priority: isVertical ? 0.8 : 0.7,
        };
    });

    // --- Guide articles — use real publication/update date ---
    const guidePages: MetadataRoute.Sitemap = ARTICLES
        .filter(isPublicAudioGuide)
        .map((article) => ({
            url: `${BASE}/guide/${article.slug}`,
            lastModified: parseArticleDate(article.updatedAt || article.date),
            changeFrequency: "monthly" as const,
            priority: 0.7,
        }));

    // --- Guide pathways ---
    const pathwayPages: MetadataRoute.Sitemap = PATHWAYS
        .filter((pathway) => isPublicAudioCategory(pathway.ctaCategory))
        .map((pathway) => ({
            url: `${BASE}/guide-path/${pathway.slug}`,
            changeFrequency: "monthly" as const,
            priority: 0.6,
            lastModified: new Date("2026-06-08"),
        }));

    // --- Product pages (from Supabase) ---
    const productPages: MetadataRoute.Sitemap = (products || [])
        .filter((p: any) => {
            const categoryRel = p?.categories;
            const categorySlug = Array.isArray(categoryRel) ? categoryRel[0]?.slug : categoryRel?.slug;
            return isPublicAudioCategory(categorySlug);
        })
        .map((p) => ({
            url: `${BASE}/produit/${p.slug}`,
            lastModified: p.updated_at ? new Date(p.updated_at) : new Date("2026-06-01"),
            changeFrequency: "weekly" as const,
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
