import { Database } from '../types/supabase';
import { Product, ProductOffer, ReviewsSummary } from '../types/database';

type SupabaseProduct = Database['public']['Tables']['products']['Row'] & {
    product_offers: Database['public']['Tables']['product_offers']['Row'][];
    price?: number;
    short_description?: string;
};

export const transformProduct = (raw: SupabaseProduct): Product => {
    // Logic to determine lowest price
    const offers = raw.product_offers || [];
    const lowestPrice = offers.length > 0 ? Math.min(...offers.map(o => o.price)) : 0;

    // Real data from DB (casting to any as types are not yet regenerated)
    const dbRating = (raw as any).rating || 0;
    const dbReviewCount = (raw as any).review_count || 0;

    // Construct Badge based on logic
    let badge = undefined;
    if (raw.is_featured) {
        badge = { text: "Recommandé", color: "bg-amber-100 text-amber-800 border-amber-200" };
    }

    // Transform Offers
    const frontendOffers: ProductOffer[] = offers.map(o => ({
        merchant_name: o.merchant_name,
        merchant_logo_url: o.merchant_logo_url || "",
        price: o.price,
        currency: o.currency || 'EUR',
        affiliate_link: o.affiliate_link,
        in_stock: o.in_stock ?? true
    }));

    // Construct Reviews Summary
    // PRIORITY 1: Use pros/cons directly from DB if available
    // PRIORITY 2: Parse short_description for pros/cons if available (legacy format)
    // PRIORITY 3: Fallback defaults (should rarely happen now)

    let pros: string[] = [];
    let cons: string[] = [];
    let sentiment = "";

    // First, check for direct DB fields (new data model)
    const dbPros = (raw as any).pros;
    const dbCons = (raw as any).cons;

    if (Array.isArray(dbPros) && dbPros.length > 0) {
        pros = dbPros;
    }
    if (Array.isArray(dbCons) && dbCons.length > 0) {
        cons = dbCons;
    }

    // If no direct pros/cons, try parsing short_description (legacy data)
    if (pros.length === 0 && raw.short_description) {
        const desc = raw.short_description as string;

        // Extract ON AIME
        const prosMatch = desc.match(/✅ ON AIME\s*:\s*([^💡]*)/i);
        if (prosMatch && prosMatch[1]) {
            pros = prosMatch[1]
                .split('•')
                .map(p => p.trim())
                .filter(p => p.length > 0);
        }

        // Extract À SAVOIR
        const consMatch = desc.match(/💡 À SAVOIR\s*:\s*(.*)/i);
        if (consMatch && consMatch[1]) {
            cons = [consMatch[1].trim()];
            sentiment = consMatch[1].trim();
        }
    }

    // Use description as sentiment if no specific sentiment found
    if (!sentiment && raw.description) {
        sentiment = raw.description;
    }

    const reviewsSummary: ReviewsSummary = {
        average_rating: dbRating,
        total_reviews: dbReviewCount,
        pros: pros,
        cons: cons,
        sentiment_summary: sentiment
    };

    const product: Product = {
        id: raw.id,
        category_id: raw.category_id,
        name: raw.name,
        slug: raw.slug,
        brand: raw.brand || "Marque Inconnue",
        description: raw.description || "Pas de description disponible.",
        short_description: raw.short_description,
        image_url: raw.image_url || "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1000",
        specs: typeof raw.specs === 'object' ? raw.specs : {},
        price: lowestPrice || raw.price || 0,
        offers: (raw.product_offers || []).map((o: any) => ({
            merchant_name: o.merchant_name,
            merchant_logo_url: o.merchant_logo_url,
            price: o.price,
            currency: o.currency,
            affiliate_link: o.affiliate_link,
            in_stock: o.in_stock
        })),
        reviews_summary: reviewsSummary,
        rating: dbRating,
        reviews: dbReviewCount,
        review_count: dbReviewCount,
        inStock: (raw.product_offers || []).some((o: any) => o.in_stock),
        isPromo: false,
        badge: undefined,
        // @ts-ignore 
        gallery_images: raw.gallery_images || [],
        // Enrichment
        pros: reviewsSummary.pros,
        cons: reviewsSummary.cons,
        is_active: raw.is_active,
    };

    // BADGE LOGIC (Tiered)
    // 1. Manual Override (Highest Priority)
    if (raw.is_featured) {
        product.badge = { text: "Top Choix", color: "bg-primary/10 text-primary border-primary/20" };
    }
    // 2. Best Seller (High Volume)
    else if (dbReviewCount > 5000 && dbRating >= 4.5) {
        product.badge = { text: "Best Seller", color: "bg-amber-100 text-amber-800 border-amber-200" };
    }
    // 3. Exceptional Rating (Community Favorite)
    else if (dbRating >= 4.8 && dbReviewCount > 100) {
        product.badge = { text: "Excellent", color: "bg-emerald-100 text-emerald-800 border-emerald-200" };
    }
    // 4. Budget Friendly (Low Price + Good Rating)
    else if (lowestPrice > 0 && lowestPrice < 60 && dbRating >= 4.4) {
        product.badge = { text: "Petit Prix", color: "bg-blue-100 text-blue-800 border-blue-200" };
    }

    return product;
};
