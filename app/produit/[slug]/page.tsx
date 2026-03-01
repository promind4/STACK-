import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { transformProduct } from "@/lib/transformers";
import { Product } from "@/types/database";
import { stripHtml } from "@/lib/utils";
import { JsonLd } from "@/components/server/JsonLd";
import Image from "next/image";
import Link from "next/link";
import {
    ChevronRight,
    CheckCircle2,
    XCircle,
    ExternalLink,
    Star,
    Users,
    Info,
    AlertTriangle,
    ChevronLeft,
} from "lucide-react";

export const revalidate = 86400; // 24h ISR

// ---- Data Fetching ----
async function getProduct(slug: string): Promise<Product | null> {
    const supabase = createClient();
    const { data } = await supabase
        .from("products")
        .select("*, product_offers(*)")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();
    if (!data) return null;
    return transformProduct(data);
}

async function getRelatedProducts(product: Product): Promise<Product[]> {
    const supabase = createClient();
    const { data } = await supabase
        .from("products")
        .select("*, product_offers(*)")
        .eq("category_id", product.category_id)
        .neq("id", product.id)
        .eq("is_active", true)
        .limit(3);
    if (!data) return [];
    return (data as any[]).map((p) => transformProduct(p));
}

async function getCategory(categoryId: string | undefined): Promise<{ name: string; slug: string } | null> {
    if (!categoryId) return null;
    const supabase = createClient();
    const { data } = await supabase
        .from("categories")
        .select("name, slug")
        .eq("id", categoryId)
        .single();
    return data || null;
}

// ---- Static Params ----
export async function generateStaticParams() {
    const supabase = createClient();
    const { data } = await supabase
        .from("products")
        .select("slug")
        .eq("is_active", true);
    return (data || []).map((p) => ({ slug: p.slug }));
}

// ---- Metadata ----
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProduct(slug);
    if (!product) return { title: "Produit Introuvable" };

    const desc = product.description
        ? stripHtml(product.description).substring(0, 160)
        : "Découvrez ce produit sur Fluxlab.";

    return {
        title: `${product.name} - Avis & Prix | Fluxlab`,
        description: desc,
        alternates: { canonical: `https://fluxlab.fr/produit/${slug}` },
        openGraph: {
            title: `${product.name} - Avis & Prix | Fluxlab`,
            description: desc,
            images: product.image_url ? [product.image_url] : [],
        },
    };
}

// ---- Page Component ----
export default async function ProductPage({ params }: Props) {
    const { slug } = await params;
    const product = await getProduct(slug);
    if (!product) notFound();

    const [relatedProducts, category] = await Promise.all([
        getRelatedProducts(product),
        getCategory(product.category_id),
    ]);

    // Determine category info for breadcrumb
    const categoryName = category?.name || "Catalogue";
    const categorySlug = category?.slug || "audio";

    // JSON-LD — Product Schema (schema.org/Product)
    const allImages = [product.image_url, ...(product.gallery_images || [])].filter(Boolean);
    const anyInStock = (product.offers || []).some(o => o.in_stock);
    const maxPrice = product.offers && product.offers.length > 0
        ? Math.max(...product.offers.map(o => o.price))
        : product.price;

    const productSchema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "@id": `https://fluxlab.fr/produit/${slug}#product`,
        name: product.name,
        image: allImages.length > 1 ? allImages : product.image_url,
        description: product.description
            ? stripHtml(product.description).substring(0, 5000)
            : "",
        brand: { "@type": "Brand", name: product.brand || "Générique" },
        sku: product.id,
        ...(categoryName !== "Catalogue" ? { category: categoryName } : {}),
        offers: {
            "@type": "AggregateOffer",
            "@id": `https://fluxlab.fr/produit/${slug}#offers`,
            url: `https://fluxlab.fr/produit/${slug}`,
            priceCurrency: "EUR",
            lowPrice: product.price,
            highPrice: maxPrice,
            offerCount: product.offers?.length || 1,
            availability: anyInStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            offers: (product.offers || []).map(o => ({
                "@type": "Offer",
                price: o.price,
                priceCurrency: o.currency || "EUR",
                availability: o.in_stock
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
                url: o.affiliate_link,
                seller: { "@type": "Organization", name: o.merchant_name },
            })),
        },
        ...(product.rating && product.rating > 0
            ? {
                aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: product.rating,
                    reviewCount: product.review_count || 1,
                    bestRating: "5",
                    worstRating: "1",
                },
            }
            : {}),
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Accueil",
                item: "https://fluxlab.fr",
            },
            {
                "@type": "ListItem",
                position: 2,
                name: categoryName,
                item: `https://fluxlab.fr/categorie/${categorySlug}`,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: product.name,
                item: `https://fluxlab.fr/produit/${slug}`,
            },
        ],
    };

    const sortedOffers = [...(product.offers || [])].sort(
        (a, b) => a.price - b.price
    );

    return (
        <>
            <JsonLd data={productSchema} />
            <JsonLd data={breadcrumbSchema} />

            <div className="min-h-screen bg-background text-foreground">
                <main className="pt-28 pb-20">
                    <div className="container mx-auto px-6 max-w-[1200px]">
                        {/* Breadcrumb */}
                        <div className="mb-8">
                            <Link
                                href={`/categorie/${categorySlug}`}
                                className="group flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                                Retour — {categoryName}
                            </Link>
                        </div>

                        {/* Disclaimer affiliation */}
                        <div className="mb-6 px-4 py-2.5 bg-secondary/40 border border-border/50 rounded-lg">
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                <Info className="w-3 h-3 inline-block mr-1 -mt-0.5" />
                                <strong>Transparence :</strong> Cette page contient des liens affiliés. Si vous achetez via ces liens, nous percevons une commission sans surcoût pour vous.
                            </p>
                        </div>

                        {/* === BUY BOX === */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-start">
                            {/* Colonne Gauche : Visuel & Galerie */}
                            <div className="lg:col-span-7 flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
                                <div
                                    className="rounded-2xl border border-border/40 shadow-sm p-8 md:p-12 flex items-center justify-center aspect-[4/3] relative overflow-hidden group transition-colors"
                                    style={{ backgroundColor: "#FFFFFF" }}
                                >
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="px-3 py-1 bg-secondary text-foreground text-xs font-mono rounded-full border border-border uppercase">
                                            {product.brand}
                                        </span>
                                    </div>
                                    <Image
                                        src={product.image_url}
                                        alt={`${product.name} – ${product.brand || 'Test'} avis et meilleur prix | Fluxlab`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 58vw"
                                        className="object-contain transition-all duration-300 ease-out group-hover:scale-105"
                                        priority
                                    />
                                </div>

                                {/* Galerie Thumbnails */}
                                {product.gallery_images && product.gallery_images.length > 0 && (
                                    <div className="flex gap-4 overflow-x-auto pb-2">
                                        {[product.image_url, ...product.gallery_images.filter((img: string) => img !== product.image_url)].map(
                                            (img: string, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="relative w-24 h-24 shrink-0 rounded-xl bg-white border border-border/50 p-2 overflow-hidden hover:border-primary/50 transition-all"
                                                >
                                                    <Image
                                                        src={img}
                                                        alt={`${product.name} – Vue ${idx + 1} | Fluxlab`}
                                                        fill
                                                        sizes="96px"
                                                        className="object-contain"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Colonne Droite : Infos & Offres */}
                            <div className="lg:col-span-5 flex flex-col">
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        {product.badge && (
                                            <span
                                                className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide border ${product.badge.color}`}
                                            >
                                                {product.badge.text}
                                            </span>
                                        )}
                                        {product.isPromo && (
                                            <span className="text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide bg-red-100 text-red-700 border border-red-200">
                                                Meilleur Prix
                                            </span>
                                        )}
                                        {(product.rating || 0) > 0 && (
                                            <div className="flex items-center gap-1 px-2 py-1 rounded bg-amber-50 border border-amber-100">
                                                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                                <span className="text-xs font-bold text-amber-700">
                                                    {product.rating}
                                                </span>
                                                <span className="text-[10px] text-amber-600/70">
                                                    ({(product.review_count || 0).toLocaleString()} avis)
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight leading-tight font-serif">
                                        {product.name}
                                    </h1>
                                    {product.description && (
                                        <div
                                            className="text-base text-muted-foreground leading-relaxed font-light max-h-[320px] overflow-hidden [&_h2]:text-base [&_h2]:font-bold [&_h2]:uppercase [&_h2]:mt-5 [&_h2]:mb-1.5 [&_h2]:text-foreground [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1.5 [&_h3]:text-foreground [&_ul]:list-none [&_ul]:pl-0 [&_ul]:my-2 [&_li]:mb-1 [&_p]:mb-3 [&_strong]:text-foreground [&_strong]:font-medium"
                                            dangerouslySetInnerHTML={{
                                                __html: product.description,
                                            }}
                                        />
                                    )}
                                </div>

                                {/* LISTE DES OFFRES MARCHANDS */}
                                <div id="offers" className="space-y-4 mb-8 scroll-mt-32">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                                        Meilleures Offres Disponibles
                                    </h3>

                                    {sortedOffers.length > 0 ? (
                                        sortedOffers.map((offer, idx) => (
                                            <div
                                                key={idx}
                                                className={`flex items-center justify-between p-4 bg-white rounded-xl border shadow-sm transition-all hover:border-primary/50 ${idx === 0
                                                    ? "border-primary/30 ring-1 ring-primary/5"
                                                    : "border-border"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center p-2 overflow-hidden relative">
                                                        {offer.merchant_logo_url ? (
                                                            <Image
                                                                src={offer.merchant_logo_url}
                                                                alt={`Logo ${offer.merchant_name}`}
                                                                fill
                                                                sizes="48px"
                                                                className="object-contain p-2"
                                                                loading="lazy"
                                                            />
                                                        ) : (
                                                            <span className="font-bold text-xs text-muted-foreground">
                                                                {offer.merchant_name
                                                                    .substring(0, 2)
                                                                    .toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-foreground block text-sm">
                                                            {offer.merchant_name}
                                                        </span>
                                                        <span
                                                            className={`text-[10px] flex items-center gap-1 font-bold uppercase ${offer.in_stock
                                                                ? "text-green-600"
                                                                : "text-red-500"
                                                                }`}
                                                        >
                                                            {offer.in_stock ? (
                                                                <>
                                                                    <CheckCircle2 className="w-3 h-3" /> En Stock
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <XCircle className="w-3 h-3" /> Épuisé
                                                                </>
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="block font-bold text-lg text-foreground">
                                                        ≈ {offer.price}{" "}
                                                        {offer.currency === "EUR" ? "€" : offer.currency}
                                                    </span>
                                                    <a
                                                        href={offer.affiliate_link}
                                                        target="_blank"
                                                        rel="nofollow sponsored noopener"
                                                        className={`inline-flex items-center justify-center h-8 px-4 text-xs font-bold mt-1 rounded-md transition-all ${idx === 0
                                                            ? "bg-primary text-white hover:bg-primary/90"
                                                            : "bg-secondary text-foreground hover:bg-border"
                                                            }`}
                                                    >
                                                        Voir l&apos;offre{" "}
                                                        <ExternalLink className="w-3 h-3 ml-2" />
                                                    </a>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 bg-secondary/50 rounded-xl border border-dashed border-border text-center text-sm text-muted-foreground italic">
                                            Aucune offre disponible pour le moment.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* === SECTION : L'AVIS DE LA COMMUNAUTÉ === */}
                        {product.reviews_summary && (
                            <section className="mb-24">
                                <div className="bg-white border border-border rounded-3xl overflow-hidden shadow-sm">
                                    {/* Header : Note Globale */}
                                    <div className="bg-secondary/30 p-8 border-b border-border flex flex-col md:flex-row justify-between items-center gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-white rounded-2xl flex flex-col items-center justify-center border border-border shadow-sm">
                                                <span className="text-2xl font-bold text-foreground">
                                                    {product.rating ||
                                                        product.reviews_summary?.average_rating ||
                                                        0}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground font-bold">
                                                    / 5
                                                </span>
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold font-serif tracking-tight text-foreground">
                                                    Ce qu&apos;en pensent les créateurs
                                                </h2>
                                                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                                    <Users className="w-4 h-4" /> Basé sur{" "}
                                                    <strong>
                                                        {(
                                                            product.review_count ||
                                                            product.reviews_summary?.total_reviews ||
                                                            0
                                                        ).toLocaleString()}{" "}
                                                        avis
                                                    </strong>{" "}
                                                    analysés
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Corps : Pros & Cons */}
                                    <div className="grid grid-cols-1 md:grid-cols-2">
                                        {/* ON AIME (PROS) */}
                                        <div className="p-8 border-b md:border-b-0 md:border-r border-border bg-emerald-50/10">
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-800 flex items-center gap-2 mb-6">
                                                <CheckCircle2 className="w-5 h-5" /> On aime
                                            </h3>
                                            <ul className="space-y-4">
                                                {product.reviews_summary.pros.map(
                                                    (pro: string, idx: number) => (
                                                        <li
                                                            key={idx}
                                                            className="flex items-start gap-3 text-muted-foreground font-light leading-snug"
                                                        >
                                                            <span className="mt-1 w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                                                            {pro}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>

                                        {/* À SAVOIR (CONS) */}
                                        <div className="p-8 bg-amber-50/10">
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-amber-800 flex items-center gap-2 mb-6">
                                                <Info className="w-5 h-5" /> À savoir
                                            </h3>
                                            <ul className="space-y-4">
                                                {product.reviews_summary.cons.map(
                                                    (con: string, idx: number) => (
                                                        <li
                                                            key={idx}
                                                            className="flex items-start gap-3 text-muted-foreground font-light leading-snug"
                                                        >
                                                            <span className="mt-1 w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0" />
                                                            {con}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* === ECOSYSTEME === */}
                        {relatedProducts.length > 0 && (
                            <section className="bg-secondary/30 -mx-6 px-6 py-20 lg:rounded-3xl lg:mx-0 lg:px-12 border-y lg:border border-border/30">
                                <div className="mb-12 text-center max-w-2xl mx-auto">
                                    <h2 className="text-3xl font-bold mb-4 font-serif">
                                        Complétez votre Stack
                                    </h2>
                                    <p className="text-muted-foreground font-light">
                                        D&apos;autres créateurs ont souvent associé ces produits
                                        avec le <strong>{product.name}</strong>.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {relatedProducts.map((related) => (
                                        <Link
                                            key={related.id}
                                            href={`/produit/${related.slug}`}
                                            className="bg-white border border-border rounded-2xl p-6 hover:shadow-lg transition-all group block"
                                        >
                                            <div className="aspect-square w-16 mb-4 bg-secondary/20 rounded-xl p-2 relative">
                                                <Image
                                                    src={related.image_url}
                                                    alt={`${related.name}${related.brand ? ` ${related.brand}` : ''} – Avis et prix | Fluxlab`}
                                                    fill
                                                    sizes="64px"
                                                    className="object-contain"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <h3 className="font-bold text-lg mb-2 line-clamp-1">
                                                {related.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mb-4 font-light line-clamp-2">
                                                {stripHtml(related.description)}
                                            </p>
                                            <div className="pt-4 border-t border-border/50 flex justify-between items-center">
                                                <span className="font-bold">≈ {related.price}€</span>
                                                <span className="text-sm font-medium hover:bg-accent hover:text-accent-foreground px-2 py-1 rounded-md transition-colors">
                                                    Découvrir
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
