import type { Product, ProductOffer, ReviewsSummary } from "../types/database.ts";
import { cleanImageUrl, buildAffiliateLink } from "./utils.ts";
import { selectAvailableOffers } from "./atelier/offers.ts";
import type { AtelierOffer } from "./atelier/types.ts";

/**
 * Transform raw Supabase row into frontend Product type.
 * Works in both Server and Client Components.
 */
export const transformProduct = (raw: any): Product => {
    const offers = Array.isArray(raw.product_offers) ? raw.product_offers : [];

    // Real data from DB
    const dbRating = raw.rating || 0;
    const dbReviewCount = raw.review_count || 0;

    // Transform Offers
    const MERCHANT_LOGOS: Record<string, string> = {
        amazon: "https://oxzapjwfttrgsometnwq.supabase.co/storage/v1/object/public/logo/amazon-logo.png",
        thomann: "https://oxzapjwfttrgsometnwq.supabase.co/storage/v1/object/public/logo/THOMANN.png",
        woodbrass: "https://oxzapjwfttrgsometnwq.supabase.co/storage/v1/object/public/logo/woodbrass.jpeg",
    };

    const offerCandidates: Array<{ offer: AtelierOffer; frontendOffer: ProductOffer }> = offers.map((o: any) => {
        let logoUrl = o.merchant_logo_url || "";
        const mName = o.merchant_name?.toLowerCase().trim() || "";

        // Force official logos for main merchants
        if (mName.includes("amazon")) {
            logoUrl = MERCHANT_LOGOS.amazon;
        } else if (mName === "thomann") {
            logoUrl = MERCHANT_LOGOS.thomann;
        } else if (mName === "woodbrass") {
            logoUrl = MERCHANT_LOGOS.woodbrass;
        }

        const offer: AtelierOffer = {
            merchantName: o.merchant_name,
            price: o.price,
            currency: o.currency,
            affiliateLink: buildAffiliateLink(o.affiliate_link, o.merchant_name),
            inStock: o.in_stock === true,
            lastCheckedAt: o.last_checked_at,
        };

        return {
            offer,
            frontendOffer: {
                merchant_name: o.merchant_name,
                merchant_logo_url: logoUrl,
                price: offer.price,
                currency: offer.currency,
                affiliate_link: offer.affiliateLink,
                in_stock: offer.inStock,
            },
        };
    });
    const frontendOffersByOffer = new Map(offerCandidates.map(candidate => [candidate.offer, candidate.frontendOffer]));
    const availableOffers = selectAvailableOffers(offerCandidates.map(candidate => candidate.offer));
    const bestAvailableOffer = availableOffers[0] ?? null;
    const frontendOffers: ProductOffer[] = availableOffers.map(offer => frontendOffersByOffer.get(offer)!);
    const lowestPrice = bestAvailableOffer?.price ?? 0;

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
            (raw.slug === "shure-sm7b"
                ? "https://oxzapjwfttrgsometnwq.supabase.co/storage/v1/object/public/images-produit/shure-sm7b-studio.webp"
                : cleanImageUrl(raw.image_url)) ||
            "https://placehold.co/400x400/e2e8f0/94a3b8?text=No+Image",
        specs: typeof raw.specs === "object" ? raw.specs : {},
        price: lowestPrice || raw.price || 0,
        offers: frontendOffers,
        reviews_summary: reviewsSummary,
        rating: dbRating,
        reviews: dbReviewCount,
        review_count: dbReviewCount,
        inStock: bestAvailableOffer !== null,
        isPromo: false,
        badge: undefined,
        gallery_images: (raw.gallery_images || []).map((img: string) => cleanImageUrl(img)),
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
