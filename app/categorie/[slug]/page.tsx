import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { transformProduct } from "@/lib/transformers";
import { Product } from "@/types/database";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import CategoryFilterBar from "@/components/client/CategoryFilterBar";
import { JsonLd } from "@/components/server/JsonLd";

export const revalidate = 3600; // 1h ISR

// Category metadata dictionary (matches old SPA exactly)
const CATEGORY_METADATA: Record<string, { title: string; subtitle: string }> = {
    audio: { title: "Studio & Son", subtitle: "Tout l'équipement audio pour une qualité professionnelle." },
    video: { title: "Image & Lumière", subtitle: "Caméras, objectifs et éclairage pour sublimer vos contenus." },
    streaming: { title: "Streaming", subtitle: "Captation et régie pour le direct." },
    "micros-dynamiques": { title: "Micros Dynamiques", subtitle: "Robustesse et fiabilité pour la scène et le studio." },
    "micros-condensateurs": { title: "Micros Condensateurs", subtitle: "Précision et détails pour le studio (XLR)." },
    "micros-usb": { title: "Micros USB", subtitle: "La simplicité plug-and-play sans compromis." },
    "micros-shotgun": { title: "Micros Shotgun", subtitle: "Captation directionnelle pour la vidéo." },
    "cartes-son": { title: "Interfaces Audio", subtitle: "Le pont essentiel entre votre voix et l'ordinateur." },
    "preamplis": { title: "Préamplis & Cloudlifter", subtitle: "Boostez le gain de vos microphones dynamiques." },
    "casques-studio": { title: "Casques Studio", subtitle: "Entendez chaque détail de votre mixage." },
    "enceintes": { title: "Enceintes Monitoring", subtitle: "Écoute de référence pour votre mixage." },
    "bras-articules": { title: "Bras Articulés", subtitle: "Rode, Elgato et alternatives pour votre micro." },
    "cable-xlr": { title: "Câbles XLR", subtitle: "Connexions haute qualité pour votre studio." },
    "traitement-acoustique": { title: "Traitement Acoustique", subtitle: "Mousses et panneaux pour un son propre." },
    "hybrides-mirrorless": { title: "Hybrides Mirrorless", subtitle: "Sony Alpha, Canon R et plus." },
    "webcams-pro": { title: "Webcams Pro", subtitle: "Elgato Facecam, Razer et alternatives." },
    "action-cams": { title: "Action Cams", subtitle: "GoPro, DJI et caméras d'action." },
    "keylight": { title: "Key Lights", subtitle: "Lumière principale pour vos contenus." },
    "softbox": { title: "Softbox", subtitle: "Diffusion douce pour un éclairage flatteur." },
    "rgb-ambiance": { title: "RGB & Ambiance", subtitle: "Tubes LED, rubans et ambiance colorée." },
    "grand-angle": { title: "Objectifs Grand Angle", subtitle: "Pour le vlogging et les plans larges." },
    "zoom-polyvalent": { title: "Zooms Polyvalents", subtitle: "Objectifs tout terrain." },
    "fonds-verts": { title: "Fonds Verts", subtitle: "Incrustation propre pour vos streams." },
    "teleprompteurs": { title: "Téléprompteurs", subtitle: "Lisez vos scripts professionnellement." },
    "cable-management": { title: "Cable Management", subtitle: "Organisation de votre setup." },
    // "logiciels-apps": { title: "Logiciels & Apps", subtitle: "OBS, vMix, VoiceMod et plus." },
    // "design-overlays": { title: "Design & Overlays", subtitle: "Alertes, transitions, logos pour vos streams." },
    "stream-deck": { title: "Stream Deck", subtitle: "Contrôle total de votre régie." },
    // Problématiques (problem-based routes)
    "espace-bruyant": { title: "Espace Bruyant / Écho", subtitle: "Micros dynamiques, traitement acoustique et casques isolants pour dompter le bruit." },
    "plug-and-play": { title: "Setup Plug & Play", subtitle: "Micros USB, webcams et matériel prêt à l'emploi, sans interface ni câble XLR." },
    "petit-budget": { title: "Petit Budget — Moins de 150€", subtitle: "Les meilleurs rapports qualité-prix pour débuter sans se ruiner." },
    "createur-nomade": { title: "Créateur Nomade / IRL", subtitle: "Solutions sans fil, compactes et portables pour créer partout." },
};

// Vertical → sub-category mapping for fetching
const VERTICALS: Record<string, string[]> = {
    audio: [
        "micros-dynamiques", "micros-condensateurs", "micros-usb", "micros-shotgun",
        "cartes-son", "preamplis", "casques-studio", "enceintes",
        "bras-articules", "cable-xlr", "traitement-acoustique",
    ],
    video: [
        "hybrides-mirrorless", "webcams-pro", "action-cams",
        "keylight", "softbox", "rgb-ambiance",
        "grand-angle", "zoom-polyvalent",
    ],
    streaming: [
        "fonds-verts", "teleprompteurs", "cable-management",
        // "logiciels-apps", "design-overlays", 
        "stream-deck",
    ],
    // Problématiques (problem-based verticals)
    "espace-bruyant": [
        "micros-dynamiques", "traitement-acoustique", "casques-studio", "bras-articules",
    ],
    "plug-and-play": [
        "micros-usb", "webcams-pro", "stream-deck",
    ],
    "petit-budget": [
        "micros-usb", "micros-dynamiques", "cartes-son",
    ],
    "createur-nomade": [
        "micros-usb", "action-cams",
    ],
};

// Maximum price filter for problem-based routes (in euros)
const PRICE_CAPS: Record<string, number> = {
    "petit-budget": 250,
};

// Blacklisted categories for MVP (Hardware focus)
const CATEGORY_BLACKLIST = ["logiciels-apps", "design-overlays"];

async function getProducts(slug: string): Promise<Product[]> {
    if (CATEGORY_BLACKLIST.includes(slug)) return [];

    const supabase = createClient();

    // Check if it's a vertical or a direct category
    const subCategories = VERTICALS[slug];

    if (subCategories) {
        // Vertical: fetch all sub-categories
        const { data: categories } = await supabase
            .from("categories")
            .select("id")
            .in("slug", subCategories);

        if (!categories || categories.length === 0) return [];

        const categoryIds = categories.map((c) => c.id);
        const { data } = await supabase
            .from("products")
            .select("*, product_offers(*)")
            .in("category_id", categoryIds)
            .eq("is_active", true)
            .order("name");

        let products = (data || []).map((p: any) => transformProduct(p));

        // Apply price cap if defined for this route
        const priceCap = PRICE_CAPS[slug];
        if (priceCap) {
            products = products.filter((p) => p.price > 0 && p.price <= priceCap);
        }

        return products;
    }

    // Single category slug
    const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", slug)
        .single();

    if (!cat) return [];

    const { data } = await supabase
        .from("products")
        .select("*, product_offers(*)")
        .eq("category_id", cat.id)
        .eq("is_active", true)
        .order("name");

    return (data || []).map((p: any) => transformProduct(p));
}

export async function generateStaticParams() {
    return Object.keys(CATEGORY_METADATA).map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const meta = CATEGORY_METADATA[slug];
    const title = meta ? `${meta.title} — Comparateur de Prix | Fluxlab` : "Catalogue | Fluxlab";
    const rawDesc = meta
        ? `${meta.subtitle} Comparez les prix et trouvez les meilleures offres sur Fluxlab.`
        : "Explorez notre catalogue complet de matériel audio, vidéo et streaming.";
    const desc = rawDesc.length > 160
        ? rawDesc.substring(0, rawDesc.lastIndexOf(" ", 157)) + "…"
        : rawDesc;

    return {
        title,
        description: desc,
        alternates: { canonical: `https://fluxlab.fr/categorie/${slug}` },
        openGraph: { title, description: desc },
    };
}

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;

    const meta = CATEGORY_METADATA[slug];
    if (!meta) notFound();

    const products = await getProducts(slug);

    const title = meta.title;
    const subtitle = meta.subtitle;

    // JSON-LD ItemList for category
    const itemListSchema = products.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: title,
        numberOfItems: products.length,
        itemListElement: products.slice(0, 20).map((p: Product, idx: number) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: p.name,
            url: `https://fluxlab.fr/produit/${p.slug}`,
        })),
    } : null;

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: "https://fluxlab.fr" },
            { "@type": "ListItem", position: 2, name: title, item: `https://fluxlab.fr/categorie/${slug}` },
        ],
    };

    return (
        <>
            {itemListSchema && <JsonLd data={itemListSchema} />}
            <JsonLd data={breadcrumbSchema} />
            <div className="min-h-screen bg-background text-foreground">
                {/* HEADER PAGE */}
                <div className="pt-32 pb-8 md:pb-12 border-b border-border bg-background">
                    <div className="container mx-auto px-6 max-w-[1600px]">
                        {/* BREADCRUMB */}
                        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                            <Link href="/" className="hover:text-primary transition-colors">
                                Accueil
                            </Link>
                            <ChevronRight className="w-4 h-4 opacity-50" />
                            <span className="font-bold text-foreground line-clamp-1">
                                {title}
                            </span>
                        </nav>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                            <div>
                                <div className="flex items-baseline gap-4 mb-3">
                                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight font-serif capitalize">
                                        {title}
                                    </h1>
                                </div>
                                <p className="text-sm md:text-lg text-muted-foreground font-light">
                                    {subtitle}
                                </p>

                                {/* Quick Links for Root Verticals */}
                                {VERTICALS[slug] && (
                                    <div className="flex flex-wrap gap-2 mt-6">
                                        {VERTICALS[slug].slice(0, 6).map((subSlug) => {
                                            const subMeta = CATEGORY_METADATA[subSlug];
                                            return subMeta ? (
                                                <Link
                                                    key={subSlug}
                                                    href={`/categorie/${subSlug}`}
                                                    className="border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 text-xs inline-flex items-center justify-center rounded-md font-medium transition-colors"
                                                >
                                                    {subMeta.title}
                                                </Link>
                                            ) : null;
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* PRODUCT GRID */}
                <div className="container mx-auto px-6 max-w-[1600px] py-8 md:py-12">
                    {products.length > 0 ? (
                        <CategoryFilterBar products={products} />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center bg-secondary/20 rounded-3xl border border-dashed border-border px-6">
                            <h3 className="text-xl font-bold mb-2 font-serif">
                                Aucun produit trouvé
                            </h3>
                            <p className="text-muted-foreground mb-8 max-w-sm font-light">
                                Désolé, cette catégorie ne contient pas encore de produits.
                            </p>
                            <Link
                                href="/categorie/audio"
                                className="border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 inline-flex items-center justify-center rounded-md font-medium transition-colors"
                            >
                                Voir Studio &amp; Son
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

