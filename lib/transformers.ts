import { Product, ProductOffer, ReviewsSummary } from "@/types/database";

/**
 * Transform raw Supabase row into frontend Product type.
 * Works in both Server and Client Components.
 */
export const transformProduct = (raw: any): Product => {
    // Logic to determine lowest price
    const offers = raw.product_offers || [];
    const lowestPrice =
        offers.length > 0 ? Math.min(...offers.map((o: any) => o.price)) : 0;

    // Real data from DB
    const dbRating = raw.rating || 0;
    const dbReviewCount = raw.review_count || 0;

    // Transform Offers
    const AMAZON_LOGO = "https://oxzapjwfttrgsometnwq.supabase.co/storage/v1/object/public/logo/amazon-logo.png";
    const frontendOffers: ProductOffer[] = offers.map((o: any) => {
        let logoUrl = o.merchant_logo_url || "";
        // Fix Amazon logos that still point to Wikimedia (DB trigger prevents direct update)
        if (
            o.merchant_name?.toLowerCase().includes("amazon") &&
            (logoUrl.includes("wikimedia") || logoUrl.includes("wikipedia") || logoUrl === "/branding/amazon-logo.svg")
        ) {
            logoUrl = AMAZON_LOGO;
        }
        return {
            merchant_name: o.merchant_name,
            merchant_logo_url: logoUrl,
            price: o.price,
            currency: o.currency || "EUR",
            affiliate_link: o.affiliate_link,
            in_stock: o.in_stock ?? true,
        };
    });

    // Pros / Cons extraction
    let pros: string[] = [];
    let cons: string[] = [];
    let sentiment = "";

    const dbPros = raw.pros;
    const dbCons = raw.cons;

    if (Array.isArray(dbPros) && dbPros.length > 0) {
        pros = dbPros;
    }
    if (Array.isArray(dbCons) && dbCons.length > 0) {
        cons = dbCons;
    }

    // Legacy: parse short_description
    if (pros.length === 0 && raw.short_description) {
        const desc = raw.short_description as string;
        const prosMatch = desc.match(/✅ ON AIME\s*:\s*([^💡]*)/i);
        if (prosMatch && prosMatch[1]) {
            pros = prosMatch[1]
                .split("•")
                .map((p: string) => p.trim())
                .filter((p: string) => p.length > 0);
        }
        const consMatch = desc.match(/💡 À SAVOIR\s*:\s*(.*)/i);
        if (consMatch && consMatch[1]) {
            cons = [consMatch[1].trim()];
            sentiment = consMatch[1].trim();
        }
    }

    if (!sentiment && raw.description) {
        sentiment = raw.description;
    }

    const reviewsSummary: ReviewsSummary = {
        average_rating: dbRating,
        total_reviews: dbReviewCount,
        pros,
        cons,
        sentiment_summary: sentiment,
    };

    const product: Product = {
        id: raw.id,
        category_id: raw.category_id,
        name: raw.name,
        slug: raw.slug,
        brand: raw.brand || "Marque Inconnue",
        description: raw.description || "Pas de description disponible.",
        short_description: raw.short_description,
        image_url:
            raw.image_url ||
            "https://placehold.co/400x400/e2e8f0/94a3b8?text=No+Image",
        specs: typeof raw.specs === "object" ? raw.specs : {},
        price: lowestPrice || raw.price || 0,
        offers: frontendOffers,
        reviews_summary: reviewsSummary,
        rating: dbRating,
        reviews: dbReviewCount,
        review_count: dbReviewCount,
        inStock: (raw.product_offers || []).some((o: any) => o.in_stock),
        isPromo: false,
        badge: undefined,
        gallery_images: raw.gallery_images || [],
        pros: reviewsSummary.pros,
        cons: reviewsSummary.cons,
        is_active: raw.is_active,
    };

    // BADGE LOGIC
    if (raw.is_featured) {
        product.badge = {
            text: "Top Choix",
            color: "bg-primary/10 text-primary border-primary/20",
        };
    } else if (dbReviewCount > 5000 && dbRating >= 4.5) {
        product.badge = {
            text: "Best Seller",
            color: "bg-amber-100 text-amber-800 border-amber-200",
        };
    } else if (dbRating >= 4.8 && dbReviewCount > 100) {
        product.badge = {
            text: "Excellent",
            color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        };
    } else if (lowestPrice > 0 && lowestPrice < 60 && dbRating >= 4.4) {
        product.badge = {
            text: "Petit Prix",
            color: "bg-blue-100 text-blue-800 border-blue-200",
        };
    }

    return product;
};
