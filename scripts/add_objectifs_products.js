import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Category IDs from our previous creation
const CATEGORIES = {
    grandAngle: '8a672072-2181-4609-b552-a996d3e005c5',
    focaleFixe: '1f304dde-8d58-4fee-a655-e6d604ad2c35',
    zoomPolyvalent: '9a197706-e267-4c45-9cc0-647b7f451dff'
};

// OBJECTIFS PRODUCTS DATA
const OBJECTIFS_PRODUCTS = [
    // GRAND ANGLE
    {
        category_id: CATEGORIES.grandAngle,
        name: 'Sony FE 16-35mm f/2.8 GM II',
        slug: 'sony-fe-16-35mm-gm2',
        brand: 'Sony',
        description: "Le zoom grand angle ultime de Sony. Le 16-35mm GM II est plus compact et léger que son prédécesseur tout en offrant une qualité optique exceptionnelle.",
        price: 2499,
        rating: 4.9,
        review_count: 420,
        pros: ["Qualité optique exceptionnelle", "Autofocus ultra-rapide", "Compact pour sa catégorie", "Construction tropicalisée"],
        cons: ["Prix premium", "Lourd pour du vlog handheld"],
        specs: { focal: "16-35mm", ouverture: "f/2.8", monture: "Sony E", stabilisation: "Non" }
    },
    {
        category_id: CATEGORIES.grandAngle,
        name: 'Sigma 14-24mm f/2.8 DG DN Art',
        slug: 'sigma-14-24mm-art',
        brand: 'Sigma',
        description: "L'ultra grand angle par excellence. Le Sigma 14-24mm Art offre une plage focale extrême avec une qualité d'image impressionnante à un prix plus accessible que les marques natives.",
        price: 1399,
        rating: 4.8,
        review_count: 650,
        pros: ["Rapport qualité/prix exceptionnel", "Ultra-sharp dès pleine ouverture", "Construction solide", "Flare bien maîtrisé"],
        cons: ["Pas de filetage filtre frontal", "Distorsion à 14mm"],
        specs: { focal: "14-24mm", ouverture: "f/2.8", monture: "Sony E / L-Mount", stabilisation: "Non" }
    },
    {
        category_id: CATEGORIES.grandAngle,
        name: 'Tamron 17-28mm f/2.8 Di III RXD',
        slug: 'tamron-17-28mm',
        brand: 'Tamron',
        description: "Le grand angle compact et accessible. Le Tamron 17-28mm est parfait pour le vlog et le voyage grâce à son poids plume et son excellent rapport qualité-prix.",
        price: 899,
        rating: 4.7,
        review_count: 890,
        pros: ["Ultra-compact et léger", "Excellent rapport qualité/prix", "Filetage filtre 67mm", "AF silencieux"],
        cons: ["Pas aussi sharp que le GM", "Vignettage à 17mm f/2.8"],
        specs: { focal: "17-28mm", ouverture: "f/2.8", monture: "Sony E", stabilisation: "Non" }
    },

    // FOCALE FIXE
    {
        category_id: CATEGORIES.focaleFixe,
        name: 'Sony FE 35mm f/1.4 GM',
        slug: 'sony-35mm-gm',
        brand: 'Sony',
        description: "La focale fixe polyvalente par excellence. Le 35mm GM combine une qualité d'image exceptionnelle, un bokeh crémeux et un autofocus silencieux pour la vidéo.",
        price: 1599,
        rating: 4.9,
        review_count: 520,
        pros: ["Bokeh sublime", "Sharpness incroyable", "AF parfait pour vidéo", "Bague de déclencheur AF/MF"],
        cons: ["Prix élevé", "Assez volumineux pour un 35mm"],
        specs: { focal: "35mm", ouverture: "f/1.4", monture: "Sony E", stabilisation: "Non" }
    },
    {
        category_id: CATEGORIES.focaleFixe,
        name: 'Sigma 85mm f/1.4 DG DN Art',
        slug: 'sigma-85mm-art',
        brand: 'Sigma',
        description: "Le roi du portrait. Le Sigma 85mm Art offre un bokeh spectaculaire et une netteté chirurgicale, parfait pour les portraits et les interviews.",
        price: 1099,
        rating: 4.8,
        review_count: 780,
        pros: ["Bokeh magnifique", "Prix accessible vs concurrence", "Construction premium", "Sharpness exceptionnel"],
        cons: ["Lourd (625g)", "AF parfois lent en basse lumière"],
        specs: { focal: "85mm", ouverture: "f/1.4", monture: "Sony E / L-Mount", stabilisation: "Non" }
    },
    {
        category_id: CATEGORIES.focaleFixe,
        name: 'Sony FE 50mm f/1.2 GM',
        slug: 'sony-50mm-gm',
        brand: 'Sony',
        description: "L'objectif ultime pour les créateurs exigeants. Le 50mm f/1.2 GM offre une lumière incroyable et un rendu cinématographique unique.",
        price: 2099,
        rating: 4.9,
        review_count: 310,
        pros: ["Ouverture f/1.2 unique", "Rendu 3D spectaculaire", "AF Eye parfait", "Build quality irréprochable"],
        cons: ["Prix très élevé", "Lourd (778g)"],
        specs: { focal: "50mm", ouverture: "f/1.2", monture: "Sony E", stabilisation: "Non" }
    },

    // ZOOM POLYVALENT
    {
        category_id: CATEGORIES.zoomPolyvalent,
        name: 'Sony FE 24-70mm f/2.8 GM II',
        slug: 'sony-24-70mm-gm2',
        brand: 'Sony',
        description: "Le zoom standard de référence. Le 24-70mm GM II est l'outil polyvalent ultime, parfait pour tout type de shooting photo et vidéo.",
        price: 2299,
        rating: 4.9,
        review_count: 680,
        pros: ["Qualité GM légendaire", "Autofocus blazing fast", "Polyvalence maximale", "Plus léger que le GM I"],
        cons: ["Prix premium", "Pas de stabilisation"],
        specs: { focal: "24-70mm", ouverture: "f/2.8", monture: "Sony E", stabilisation: "Non" }
    },
    {
        category_id: CATEGORIES.zoomPolyvalent,
        name: 'Tamron 28-75mm f/2.8 Di III VXD G2',
        slug: 'tamron-28-75mm-g2',
        brand: 'Tamron',
        description: "L'alternative accessible au 24-70. Le Tamron 28-75mm G2 offre 90% de la qualité GM pour moins de la moitié du prix.",
        price: 899,
        rating: 4.7,
        review_count: 1450,
        pros: ["Rapport qualité/prix imbattable", "Compact et léger", "AF rapide et silencieux", "Excellent pour vidéo"],
        cons: ["Débute à 28mm (pas 24)", "Build moins premium"],
        specs: { focal: "28-75mm", ouverture: "f/2.8", monture: "Sony E", stabilisation: "Non" }
    },
    {
        category_id: CATEGORIES.zoomPolyvalent,
        name: 'Sony FE 70-200mm f/2.8 GM OSS II',
        slug: 'sony-70-200mm-gm2',
        brand: 'Sony',
        description: "Le téléobjectif de référence. Le 70-200mm GM II est exceptionnellement léger pour sa catégorie et offre une stabilisation intégrée impressionnante.",
        price: 2899,
        rating: 4.9,
        review_count: 420,
        pros: ["Stabilisation OSS efficace", "Incroyablement léger (1045g)", "AF tracking parfait", "Qualité GM"],
        cons: ["Prix très élevé", "Besoin de trépied pour longues sessions"],
        specs: { focal: "70-200mm", ouverture: "f/2.8", monture: "Sony E", stabilisation: "OSS" }
    }
];

async function insertObjectifsProducts() {
    console.log("📸 INSERTING OBJECTIFS PRODUCTS\n");
    console.log("=".repeat(60));

    for (const product of OBJECTIFS_PRODUCTS) {
        const productId = randomUUID();
        console.log(`\n📦 Inserting: ${product.name}`);

        // Insert product
        const { error: prodError } = await supabase
            .from('products')
            .insert({
                id: productId,
                category_id: product.category_id,
                name: product.name,
                slug: product.slug,
                brand: product.brand,
                description: product.description,
                rating: product.rating,
                review_count: product.review_count,
                pros: product.pros,
                cons: product.cons,
                specs: product.specs,
                is_active: true,
                is_featured: product.rating >= 4.9,
                image_url: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&q=80&w=800' // Placeholder
            });

        if (prodError) {
            console.log(`   ❌ Product Error: ${prodError.message}`);
            continue;
        }
        console.log(`   ✅ Product inserted`);

        // Insert Amazon offer
        const { error: offerError } = await supabase
            .from('product_offers')
            .insert({
                id: randomUUID(),
                product_id: productId,
                merchant_name: 'amazon',
                merchant_logo_url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
                price: product.price,
                currency: 'EUR',
                affiliate_link: `https://www.amazon.fr/s?k=${encodeURIComponent(product.name)}&tag=stackera-21`,
                in_stock: true
            });

        if (offerError) {
            console.log(`   ⚠️ Offer Error: ${offerError.message}`);
        } else {
            console.log(`   ✅ Offer added (Amazon: ${product.price}€)`);
        }
    }

    console.log("\n" + "=".repeat(60));
    console.log(`✨ Done! Inserted ${OBJECTIFS_PRODUCTS.length} lens products.`);
}

insertObjectifsProducts();
