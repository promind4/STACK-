import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Category IDs
const CATEGORIES = {
    webcamsPro: '50e8e497-e091-4c71-9b6a-9678c232d678',
    actionCams: '201f8387-789b-4e74-9c5e-5b1312dc531b',
    hybrides: '0bf0a370-3c0c-486e-8e21-05a79cc942a4'
};

// POPULAR WEBCAMS & CAMERAS TO ADD
const NEW_PRODUCTS = [
    // WEBCAMS PRO - Popular additions
    {
        category_id: CATEGORIES.webcamsPro,
        name: 'Logitech StreamCam',
        slug: 'logitech-streamcam',
        brand: 'Logitech',
        description: "La webcam 1080p60 de référence pour les streamers. L'autofocus intelligent et les deux options de montage la rendent ultra-polyvalente.",
        price: 139,
        rating: 4.5,
        review_count: 8500,
        pros: ["1080p60 fluide", "Double montage horizontal/vertical", "USB-C", "Autofocus AI"],
        cons: ["Pas de 4K", "Logiciel Capture parfois buggy"],
        specs: { resolution: "1080p60", fov: "78°", autofocus: "Oui" }
    },
    {
        category_id: CATEGORIES.webcamsPro,
        name: 'Logitech Brio 4K',
        slug: 'logitech-brio-4k',
        brand: 'Logitech',
        description: "La webcam 4K premium de Logitech. HDR, Windows Hello et une qualité d'image exceptionnelle pour les réunions professionnelles.",
        price: 199,
        rating: 4.6,
        review_count: 12000,
        pros: ["4K Ultra HD", "HDR", "Windows Hello compatible", "FOV ajustable"],
        cons: ["Prix élevé", "USB 3.0 requis pour 4K"],
        specs: { resolution: "4K30/1080p60", fov: "65-90°", hdr: "Oui" }
    },
    {
        category_id: CATEGORIES.webcamsPro,
        name: 'Razer Kiyo Pro Ultra',
        slug: 'razer-kiyo-pro-ultra',
        brand: 'Razer',
        description: "La première webcam 4K avec un grand capteur Sony STARVIS. Performance exceptionnelle en basse lumière pour streamers exigeants.",
        price: 299,
        rating: 4.4,
        review_count: 2200,
        pros: ["Capteur Sony 1/1.2\"", "4K30 ou 1080p60", "Excellente basse lumière", "Synapse compatible"],
        cons: ["Très cher", "Chauffe un peu"],
        specs: { resolution: "4K30/1080p60", sensor: "Sony STARVIS 1/1.2\"", hdr: "Oui" }
    },
    {
        category_id: CATEGORIES.webcamsPro,
        name: 'Logitech C920 HD Pro',
        slug: 'logitech-c920-hd-pro',
        brand: 'Logitech',
        description: "Le best-seller absolu. La C920 offre un excellent rapport qualité-prix pour débuter en streaming ou visioconférence.",
        price: 79,
        rating: 4.5,
        review_count: 45000,
        pros: ["Prix imbattable", "Très fiable", "Autofocus", "Dual mic intégré"],
        cons: ["1080p30 seulement", "Design un peu daté"],
        specs: { resolution: "1080p30", fov: "78°", autofocus: "Oui" }
    },

    // ACTION CAMS - Popular additions
    {
        category_id: CATEGORIES.actionCams,
        name: 'GoPro HERO11 Black',
        slug: 'gopro-hero11-black',
        brand: 'GoPro',
        description: "La génération précédente toujours excellente. Capteur plus grand, 5.3K et stabilisation HyperSmooth 5.0 à prix réduit.",
        price: 349,
        rating: 4.6,
        review_count: 15000,
        pros: ["5.3K60", "Capteur 1/1.9\"", "HyperSmooth 5.0", "Prix en baisse"],
        cons: ["Moins d'autonomie que le 12", "Chauffe en 5.3K"],
        specs: { resolution: "5.3K60", stabilisation: "HyperSmooth 5.0", waterproof: "10m" }
    },
    {
        category_id: CATEGORIES.actionCams,
        name: 'DJI Pocket 3',
        slug: 'dji-pocket-3',
        brand: 'DJI',
        description: "La caméra de poche avec gimbal intégré. Parfaite pour le vlog avec son grand capteur 1\" et son écran rotatif.",
        price: 519,
        rating: 4.7,
        review_count: 4500,
        pros: ["Capteur 1\" énorme", "Gimbal 3 axes intégré", "Écran rotatif", "4K120"],
        cons: ["Pas waterproof", "Fragile"],
        specs: { resolution: "4K120", sensor: "1\"", gimbal: "3 axes" }
    },
    {
        category_id: CATEGORIES.actionCams,
        name: 'Insta360 GO 3S',
        slug: 'insta360-go-3s',
        brand: 'Insta360',
        description: "L'action cam ultra-compacte. Seulement 39g pour une 4K stabilisée, parfaite pour le POV discret.",
        price: 399,
        rating: 4.5,
        review_count: 3200,
        pros: ["Ultra-compact (39g)", "4K", "FlowState stabilisation", "Magnetic mount"],
        cons: ["Autonomie limitée (38min)", "Petit capteur"],
        specs: { resolution: "4K30", weight: "39g", waterproof: "IPX4" }
    },
    {
        category_id: CATEGORIES.actionCams,
        name: 'Sony FDR-X3000R',
        slug: 'sony-fdr-x3000r',
        brand: 'Sony',
        description: "L'action cam pro Sony avec stabilisation optique Balanced. Qualité d'image exceptionnelle pour les pros.",
        price: 449,
        rating: 4.5,
        review_count: 5800,
        pros: ["Stabilisation optique", "4K", "Qualité Sony", "Live View Remote inclus"],
        cons: ["Design daté", "Pas de front screen"],
        specs: { resolution: "4K30", stabilisation: "Optical SteadyShot", waterproof: "60m (caisson)" }
    },

    // HYBRIDES - Popular additions
    {
        category_id: CATEGORIES.hybrides,
        name: 'Sony ZV-E1',
        slug: 'sony-zv-e1',
        brand: 'Sony',
        description: "Le full frame pour vloggers. Le ZV-E1 combine capteur 12MP full frame, 4K120 et le meilleur autofocus du marché.",
        price: 2499,
        rating: 4.8,
        review_count: 1800,
        pros: ["Full Frame compact", "4K120", "Eye AF parfait", "S-Cinetone intégré"],
        cons: ["Prix élevé", "12MP seulement"],
        specs: { sensor: "Full Frame 12MP", video: "4K120", autofocus: "Real-time Eye AF" }
    },
    {
        category_id: CATEGORIES.hybrides,
        name: 'Canon EOS R6 Mark II',
        slug: 'canon-eos-r6-ii',
        brand: 'Canon',
        description: "L'hybride Canon polyvalent. Parfait équilibre entre photo et vidéo avec 4K60 et 40fps en rafale.",
        price: 2799,
        rating: 4.7,
        review_count: 3500,
        pros: ["4K60 uncropped", "40fps mécanique", "IBIS excellent", "Dual Pixel II"],
        cons: ["Surchauffe en 4K60 HQ", "Crop en 4K120"],
        specs: { sensor: "Full Frame 24MP", video: "4K60", ibis: "8 stops" }
    },
    {
        category_id: CATEGORIES.hybrides,
        name: 'Fujifilm X-S20',
        slug: 'fujifilm-x-s20',
        brand: 'Fujifilm',
        description: "L'hybride APS-C polyvalent de Fuji. Compact, Film Simulations légendaires et 6.2K pour créateurs.",
        price: 1449,
        rating: 4.6,
        review_count: 2200,
        pros: ["Film Simulations Fuji", "6.2K oversampling", "Compact et léger", "Vlog mode"],
        cons: ["Pas d'IBIS", "Rolling shutter visible"],
        specs: { sensor: "APS-C 26MP", video: "6.2K30/4K60", simulations: "19 films" }
    },
    {
        category_id: CATEGORIES.hybrides,
        name: 'Panasonic Lumix S5 II',
        slug: 'panasonic-lumix-s5-ii',
        brand: 'Panasonic',
        description: "Le full frame Panasonic avec Phase Detection enfin! 6K open gate et des specs vidéo pro à prix raisonnable.",
        price: 1999,
        rating: 4.7,
        review_count: 2800,
        pros: ["6K Open Gate", "Phase Detection AF", "Dual Native ISO", "Prix compétitif"],
        cons: ["Codec H.265 only en 6K", "Menu complexe"],
        specs: { sensor: "Full Frame 24MP", video: "6K30/4K60", iso: "Dual Native ISO" }
    }
];

async function enrichCatalog() {
    console.log("📦 ENRICHING CATALOG WITH POPULAR PRODUCTS\n");
    console.log("=".repeat(60));

    for (const product of NEW_PRODUCTS) {
        const productId = randomUUID();
        console.log(`\n📦 Adding: ${product.name}`);

        // Check if already exists
        const { data: existing } = await supabase
            .from('products')
            .select('id')
            .eq('slug', product.slug)
            .single();

        if (existing) {
            console.log(`   ⏭️ Already exists, skipping`);
            continue;
        }

        // Insert product (without price)
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
                is_featured: product.rating >= 4.6,
                image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800'
            });

        if (prodError) {
            console.log(`   ❌ Product Error: ${prodError.message}`);
            continue;
        }

        // Insert offer
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
            console.log(`   ✅ Added (${product.price}€)`);
        }
    }

    console.log("\n" + "=".repeat(60));
    console.log(`✨ Done! Added ${NEW_PRODUCTS.length} products to catalog.`);
}

enrichCatalog();
