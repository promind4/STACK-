import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { transformProduct } from "@/lib/transformers";
import { Product } from "@/types/database";
import { stripHtml } from "@/lib/utils";
import { JsonLd } from "@/components/server/JsonLd";
import ProductPageContent from "@/components/client/ProductPageContent";

export const revalidate = 0; // Bypass cache for testing new DB contents

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
        ? stripHtml(product.description).substring(0, 145)
        : "Découvrez ce produit sur Fluxlab.";

    return {
        title: `${product.name} - Avis & Prix`,
        description: desc,
        alternates: { canonical: `https://fluxlab.fr/produit/${slug}` },
        openGraph: {
            title: `${product.name} - Avis & Prix`,
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

    return (
        <>
            <JsonLd data={productSchema} />
            <JsonLd data={breadcrumbSchema} />
            <ProductPageContent
                product={product}
                category={category}
                relatedProducts={relatedProducts}
            />
        </>
    );
}
