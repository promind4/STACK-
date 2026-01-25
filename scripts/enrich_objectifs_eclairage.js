import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Category IDs
const CATEGORIES = {
    grandAngle: '8a672072-2181-4609-b552-a996d3e005c5',
    focaleFixe: '1f304dde-8d58-4fee-a655-e6d604ad2c35',
    zoomPolyvalent: '9a197706-e267-4c45-9cc0-647b7f451dff',
    keylight: '61eb6e7f-20e8-4a2c-bf66-9fc9ba6ee6aa',
    softbox: '7453b556-3581-4f49-bc18-762df4753870',
    rgbAmbiance: '36351754-3173-412a-b776-e27ae31dcd08'
};

const NEW_PRODUCTS = [
    // GRAND ANGLE - Popular additions
    {
        category_id: CATEGORIES.grandAngle,
        name: 'Sony FE 20mm f/1.8 G',
        slug: 'sony-20mm-g',
        brand: 'Sony',
        description: "L'ultra-grand angle compact et lumineux. Le 20mm f/1.8 G est parfait pour le vlog, l'astro et les paysages.",
        price: 899,
        rating: 4.8,
        review_count: 2200,
        pros: ["Ultra-compact et léger", "f/1.8 lumineux", "Autofocus silencieux", "Rendu stellaire"],
        cons: ["Distorsion en bord de cadre", "Pas de stabilisation"],
        specs: { focal: "20mm", ouverture: "f/1.8", monture: "Sony E", poids: "373g" }
    },
    {
        category_id: CATEGORIES.grandAngle,
        name: 'Canon RF 15-35mm f/2.8L IS USM',
        slug: 'canon-rf-15-35mm',
        brand: 'Canon',
        description: "Le grand angle L-series stabilisé. Parfait pour vidéo grâce à l'IS intégré et la qualité optique Canon.",
        price: 2399,
        rating: 4.8,
        review_count: 1800,
        pros: ["IS intégré", "Qualité optique L-series", "Tropicalisé", "15mm ultra-wide"],
        cons: ["Prix élevé", "Lourd (840g)"],
        specs: { focal: "15-35mm", ouverture: "f/2.8", monture: "Canon RF", stabilisation: "5 stops" }
    },
    {
        category_id: CATEGORIES.grandAngle,
        name: 'Samyang AF 12mm f/2 Sony E',
        slug: 'samyang-12mm-f2',
        brand: 'Samyang',
        description: "L'ultra grand angle budget. Le 12mm Samyang offre un angle de vue extrême pour APS-C à petit prix.",
        price: 349,
        rating: 4.4,
        review_count: 3500,
        pros: ["Prix imbattable", "Ultra compact", "Autofocus", "Ultra wide 12mm"],
        cons: ["APS-C uniquement", "Distorsion élevée"],
        specs: { focal: "12mm", ouverture: "f/2", monture: "Sony E (APS-C)", poids: "213g" }
    },

    // FOCALE FIXE - Popular additions
    {
        category_id: CATEGORIES.focaleFixe,
        name: 'Sony FE 24mm f/1.4 GM',
        slug: 'sony-24mm-gm',
        brand: 'Sony',
        description: "Le 24mm ultime. Bokeh, netteté et compacité réunis dans un objectif GM exceptionnel.",
        price: 1499,
        rating: 4.9,
        review_count: 1500,
        pros: ["Qualité GM", "Ultra compact pour f/1.4", "Bokeh parfait", "AF silencieux"],
        cons: ["Prix premium", "Pas de stabilisation"],
        specs: { focal: "24mm", ouverture: "f/1.4", monture: "Sony E", poids: "445g" }
    },
    {
        category_id: CATEGORIES.focaleFixe,
        name: 'Canon RF 50mm f/1.8 STM',
        slug: 'canon-rf-50mm-stm',
        brand: 'Canon',
        description: "Le \"nifty fifty\" Canon RF. Un rapport qualité-prix imbattable pour débuter le portrait.",
        price: 229,
        rating: 4.6,
        review_count: 8500,
        pros: ["Prix ultra-compétitif", "Léger (160g)", "STM silencieux", "Qualité honnête"],
        cons: ["Build plastique", "Ouverture min f/22"],
        specs: { focal: "50mm", ouverture: "f/1.8", monture: "Canon RF", poids: "160g" }
    },
    {
        category_id: CATEGORIES.focaleFixe,
        name: 'Sony FE 85mm f/1.8',
        slug: 'sony-85mm-f18',
        brand: 'Sony',
        description: "Le portrait accessible. Ce 85mm offre un excellent bokeh et AF précis sans le prix du GM.",
        price: 549,
        rating: 4.7,
        review_count: 4500,
        pros: ["Prix accessible", "Bokeh crémeux", "AF rapide", "Compact"],
        cons: ["Build moins premium que GM", "Pas de boutons custom"],
        specs: { focal: "85mm", ouverture: "f/1.8", monture: "Sony E", poids: "371g" }
    },
    {
        category_id: CATEGORIES.focaleFixe,
        name: 'Sigma 35mm f/1.4 DG DN Art',
        slug: 'sigma-35mm-art',
        brand: 'Sigma',
        description: "Le 35mm Art légendaire en version mirrorless. Netteté chirurgicale et bokeh créatif.",
        price: 799,
        rating: 4.8,
        review_count: 3200,
        pros: ["Qualité optique exceptionnelle", "Prix vs Sony GM", "AF silencieux", "Build premium"],
        cons: ["Un peu lourd (645g)", "Pas de weather sealing"],
        specs: { focal: "35mm", ouverture: "f/1.4", monture: "Sony E / L-Mount", poids: "645g" }
    },

    // ZOOM POLYVALENT - Popular additions
    {
        category_id: CATEGORIES.zoomPolyvalent,
        name: 'Canon RF 24-105mm f/4L IS USM',
        slug: 'canon-rf-24-105mm',
        brand: 'Canon',
        description: "Le zoom polyvalent par excellence. Stabilisé, tropicalisé, parfait pour photo et vidéo au quotidien.",
        price: 1199,
        rating: 4.7,
        review_count: 6500,
        pros: ["Plage focale polyvalente", "IS intégré", "Qualité L-series", "Prix correct"],
        cons: ["f/4 (pas f/2.8)", "Un peu lourd"],
        specs: { focal: "24-105mm", ouverture: "f/4", monture: "Canon RF", stabilisation: "5 stops" }
    },
    {
        category_id: CATEGORIES.zoomPolyvalent,
        name: 'Sony FE 24-105mm f/4 G OSS',
        slug: 'sony-24-105mm-g',
        brand: 'Sony',
        description: "Le zoom tout-terrain Sony. Stabilisation OSS intégrée et qualité G pour voyageurs et vidéastes.",
        price: 1299,
        rating: 4.6,
        review_count: 4200,
        pros: ["OSS intégré", "Qualité G", "Plage 24-105", "Tropicalisé"],
        cons: ["f/4 constant", "AF parfois lent en vidéo"],
        specs: { focal: "24-105mm", ouverture: "f/4", monture: "Sony E", stabilisation: "OSS" }
    },
    {
        category_id: CATEGORIES.zoomPolyvalent,
        name: 'Sigma 24-70mm f/2.8 DG DN Art',
        slug: 'sigma-24-70mm-art',
        brand: 'Sigma',
        description: "L'alternative Art au Sony GM. 90% de la qualité pour la moitié du prix.",
        price: 1049,
        rating: 4.7,
        review_count: 2800,
        pros: ["Prix attractif", "Qualité Art", "AF silencieux", "Build solide"],
        cons: ["Lourd (830g)", "Pas de stabilisation"],
        specs: { focal: "24-70mm", ouverture: "f/2.8", monture: "Sony E / L-Mount", poids: "830g" }
    },

    // KEYLIGHT - Popular additions
    {
        category_id: CATEGORIES.keylight,
        name: 'Elgato Key Light Mini',
        slug: 'elgato-key-light-mini',
        brand: 'Elgato',
        description: "Le Key Light portable. Batterie intégrée, compact et contrôle app pour créateurs nomades.",
        price: 99,
        rating: 4.5,
        review_count: 1500,
        pros: ["Portable (batterie)", "Compact", "Même app Elgato", "Prix accessible"],
        cons: ["Moins puissant (800 lumens)", "Autonomie limitée"],
        specs: { lumens: "800", temperature: "2900K-7000K", batterie: "4h" }
    },
    {
        category_id: CATEGORIES.keylight,
        name: 'Elgato Ring Light',
        slug: 'elgato-ring-light',
        brand: 'Elgato',
        description: "Le Ring Light premium. Lumière flatteuse garantie avec contrôle Stream Deck intégré.",
        price: 189,
        rating: 4.6,
        review_count: 2200,
        pros: ["Lumière ultra-flatteuse", "Pas d'ombres", "Stream Deck compatible", "Build premium"],
        cons: ["Prend de la place", "Montage webcam limité"],
        specs: { lumens: "2500", temperature: "2900K-7000K", taille: "17.4\"" }
    },

    // SOFTBOX - Popular additions
    {
        category_id: CATEGORIES.softbox,
        name: 'Godox SL-150W II',
        slug: 'godox-sl-150w-ii',
        brand: 'Godox',
        description: "La version boostée du SL-60W. 150W de puissance pour les grands espaces ou la vidéo.",
        price: 249,
        rating: 4.6,
        review_count: 1800,
        pros: ["150W puissant", "Silencieux", "Bowens mount", "Prix compétitif"],
        cons: ["Pas de batterie", "Grand format"],
        specs: { puissance: "150W", temperature: "5600K", monture: "Bowens" }
    },
    {
        category_id: CATEGORIES.softbox,
        name: 'Amaran 100d',
        slug: 'amaran-100d',
        brand: 'Amaran',
        description: "L'entrée de gamme Aputure. Qualité Amaran à prix accessible pour débuter en éclairage studio.",
        price: 169,
        rating: 4.5,
        review_count: 2500,
        pros: ["Prix accessible", "Qualité Amaran", "App Sidus", "Compact"],
        cons: ["100W seulement", "Pas de batterie"],
        specs: { puissance: "100W", temperature: "5600K", monture: "Bowens" }
    },
    {
        category_id: CATEGORIES.softbox,
        name: 'Aputure 300d II',
        slug: 'aputure-300d-ii',
        brand: 'Aputure',
        description: "Le standard pro Aputure. 350W de puissance et qualité lumière broadcast pour productions sérieuses.",
        price: 1099,
        rating: 4.8,
        review_count: 1200,
        pros: ["350W ultra-puissant", "Qualité broadcast", "Effets intégrés", "Build tank"],
        cons: ["Prix pro", "Encombrant"],
        specs: { puissance: "350W", temperature: "5600K", monture: "Bowens" }
    },

    // RGB et Ambiance - Popular additions
    {
        category_id: CATEGORIES.rgbAmbiance,
        name: 'Nanoleaf Shapes',
        slug: 'nanoleaf-shapes',
        brand: 'Nanoleaf',
        description: "Les panneaux LED modulaires iconiques. Créez des designs muraux uniques avec sync musique.",
        price: 199,
        rating: 4.5,
        review_count: 8500,
        pros: ["Design modulaire infini", "Sync musique", "Alexa/Google", "Effets dynamiques"],
        cons: ["Prix par panneau élevé", "Installation murale"],
        specs: { panneaux: "9 (kit starter)", rgb: "16M couleurs", smart: "Alexa/Google/HomeKit" }
    },
    {
        category_id: CATEGORIES.rgbAmbiance,
        name: 'Elgato Light Bar',
        slug: 'elgato-light-bar',
        brand: 'Elgato',
        description: "L'éclairage arrière d'écran intelligent. Réduit la fatigue oculaire et crée une ambiance gaming.",
        price: 89,
        rating: 4.4,
        review_count: 1800,
        pros: ["Fix derrière écran", "Stream Deck compatible", "Réduit fatigue", "Contrôle app"],
        cons: ["Moins lumineux que Key Light", "USB powered uniquement"],
        specs: { lumens: "400", temperature: "2900K-7000K", montage: "Arrière écran" }
    },
    {
        category_id: CATEGORIES.rgbAmbiance,
        name: 'Govee TV Backlight 3',
        slug: 'govee-tv-backlight-3',
        brand: 'Govee',
        description: "Le rétro-éclairage TV immersif. Sync vidéo temps réel pour gaming et films.",
        price: 99,
        rating: 4.6,
        review_count: 15000,
        pros: ["Sync vidéo caméra", "16M couleurs", "Prix accessible", "Installation facile"],
        cons: ["Caméra nécessaire", "Fonctionne mieux dans le noir"],
        specs: { taille: "55-65\"", rgb: "RGBIC", sync: "Caméra temps réel" }
    },
    {
        category_id: CATEGORIES.rgbAmbiance,
        name: 'Corsair iCUE LT100',
        slug: 'corsair-icue-lt100',
        brand: 'Corsair',
        description: "Les tours LED gaming Corsair. Parfaites pour setup gaming avec sync iCUE.",
        price: 129,
        rating: 4.3,
        review_count: 2200,
        pros: ["Sync iCUE complet", "Design gaming", "Diffusion douce", "Extensible"],
        cons: ["iCUE requis", "Prix élevé pour 2 tours"],
        specs: { tours: "2", rgb: "iCUE", hauteur: "42.2cm" }
    }
];

async function enrichCatalog() {
    console.log("📦 ENRICHING OBJECTIFS & ÉCLAIRAGE\n");
    console.log("=".repeat(60));

    let added = 0;
    let skipped = 0;

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
            skipped++;
            continue;
        }

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
                is_featured: product.rating >= 4.6,
                image_url: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&q=80&w=800'
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
            added++;
        }
    }

    console.log("\n" + "=".repeat(60));
    console.log(`✨ Done! Added ${added} products, skipped ${skipped}.`);
}

enrichCatalog();
