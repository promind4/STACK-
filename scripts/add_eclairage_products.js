import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Category IDs from our previous creation
const CATEGORIES = {
    keylight: '61eb6e7f-20e8-4a2c-bf66-9fc9ba6ee6aa',
    softbox: '7453b556-3581-4f49-bc18-762df4753870',
    rgbAmbiance: '36351754-3173-412a-b776-e27ae31dcd08'
};

// ÉCLAIRAGE PRODUCTS DATA
const ECLAIRAGE_PRODUCTS = [
    // KEYLIGHT
    {
        category_id: CATEGORIES.keylight,
        name: 'Elgato Key Light',
        slug: 'elgato-key-light',
        brand: 'Elgato',
        description: "L'éclairage de référence pour les streamers et créateurs. Le Key Light offre 2800 lumens contrôlables via app ou Stream Deck.",
        price: 199,
        rating: 4.7,
        review_count: 3200,
        pros: ["Intégration Stream Deck parfaite", "Lumière douce et flatteuse", "Contrôle app intuitive", "Design épuré"],
        cons: ["Prix élevé", "Pas de batterie intégrée"],
        specs: { lumens: "2800", temperature: "2900K-7000K", alimentation: "Secteur" }
    },
    {
        category_id: CATEGORIES.keylight,
        name: 'Elgato Key Light Air',
        slug: 'elgato-key-light-air',
        brand: 'Elgato',
        description: "Le Key Light en version compacte. Parfait pour les petits espaces, il offre 1400 lumens avec le même contrôle app que son grand frère.",
        price: 129,
        rating: 4.6,
        review_count: 1850,
        pros: ["Compact et discret", "Prix plus accessible", "Même app que Key Light", "Montage facile"],
        cons: ["Moins puissant (1400 lumens)", "Pas de support inclus"],
        specs: { lumens: "1400", temperature: "2900K-7000K", alimentation: "Secteur" }
    },
    {
        category_id: CATEGORIES.keylight,
        name: 'Logitech Litra Glow',
        slug: 'logitech-litra-glow',
        brand: 'Logitech',
        description: "L'alternative Logitech au Key Light. Le Litra Glow est compact, certifié TrueGlow et s'intègre parfaitement à l'écosystème Logitech G.",
        price: 59,
        rating: 4.4,
        review_count: 980,
        pros: ["Très abordable", "Compact", "Certifié TrueGlow", "USB-C powered"],
        cons: ["Moins puissant", "Pas d'app dédiée avancée"],
        specs: { lumens: "250", temperature: "2700K-6500K", alimentation: "USB-C" }
    },

    // SOFTBOX
    {
        category_id: CATEGORIES.softbox,
        name: 'Godox SL-60W',
        slug: 'godox-sl-60w',
        brand: 'Godox',
        description: "Le softbox professionnel accessible. Le SL-60W est le choix des créateurs YouTube qui veulent un éclairage studio sans se ruiner.",
        price: 149,
        rating: 4.6,
        review_count: 2400,
        pros: ["Rapport qualité/prix excellent", "Monture Bowens compatible", "Télécommande incluse", "Silencieux"],
        cons: ["Softbox vendu séparément", "Pas de batterie"],
        specs: { puissance: "60W", temperature: "5600K", monture: "Bowens" }
    },
    {
        category_id: CATEGORIES.softbox,
        name: 'Aputure 120D II',
        slug: 'aputure-120d-ii',
        brand: 'Aputure',
        description: "L'éclairage pro par excellence. L'Aputure 120D II offre une puissance de 135W et une qualité de lumière digne du cinéma.",
        price: 745,
        rating: 4.8,
        review_count: 890,
        pros: ["Qualité lumière cinéma", "Effet Storm très créatif", "App Sidus Link", "Construction robuste"],
        cons: ["Prix élevé", "Ventilateur audible en mode turbo"],
        specs: { puissance: "135W", temperature: "5500K", monture: "Bowens" }
    },
    {
        category_id: CATEGORIES.softbox,
        name: 'Neewer 660 LED Panel',
        slug: 'neewer-660-led',
        brand: 'Neewer',
        description: "Le panneau LED entrée de gamme. Le Neewer 660 est parfait pour débuter avec un éclairage studio à petit prix.",
        price: 79,
        rating: 4.3,
        review_count: 4500,
        pros: ["Prix imbattable", "660 LEDs bicolores", "Télécommande 2.4G", "Batteries optionnelles"],
        cons: ["Build quality moyenne", "Pas de soft diffusion"],
        specs: { led: "660", temperature: "3200K-5600K", alimentation: "Secteur/Batterie" }
    },

    // RGB ET AMBIANCE
    {
        category_id: CATEGORIES.rgbAmbiance,
        name: 'Elgato Light Strip',
        slug: 'elgato-light-strip',
        brand: 'Elgato',
        description: "Le bandeau LED connecté pour streamers. Le Light Strip s'intègre à Stream Deck et permet de créer des ambiances dynamiques pendant vos lives.",
        price: 89,
        rating: 4.5,
        review_count: 1200,
        pros: ["Intégration Stream Deck", "16 millions de couleurs", "Extensible", "App Elgato"],
        cons: ["Prix élevé vs concurrence", "Adhésif parfois faible"],
        specs: { longueur: "2m", led: "60/m", rgb: "16M couleurs" }
    },
    {
        category_id: CATEGORIES.rgbAmbiance,
        name: 'Govee Glide Wall Light',
        slug: 'govee-glide-wall',
        brand: 'Govee',
        description: "L'éclairage mural design. Les barres Govee Glide créent une ambiance moderne et gaming avec des effets RGBIC spectaculaires.",
        price: 79,
        rating: 4.6,
        review_count: 2800,
        pros: ["Effets RGBIC impressionnants", "Design moderne", "Compatible Alexa/Google", "Prix accessible"],
        cons: ["Installation murale nécessaire", "App parfois buggy"],
        specs: { barres: "6", rgb: "RGBIC", smart: "Alexa/Google" }
    },
    {
        category_id: CATEGORIES.rgbAmbiance,
        name: 'Philips Hue Play Bar',
        slug: 'philips-hue-play',
        brand: 'Philips',
        description: "L'éclairage d'ambiance premium. Les barres Hue Play offrent un écosystème complet avec sync TV/musique et une qualité de couleur exceptionnelle.",
        price: 129,
        rating: 4.7,
        review_count: 3400,
        pros: ["Qualité couleur incroyable", "Écosystème Hue complet", "Sync TV/Musique", "Fiabilité Philips"],
        cons: ["Nécessite Bridge Hue", "Prix premium"],
        specs: { lumens: "530", rgb: "16M couleurs", smart: "Hue Bridge" }
    }
];

async function insertEclairageProducts() {
    console.log("💡 INSERTING ÉCLAIRAGE PRODUCTS\n");
    console.log("=".repeat(60));

    for (const product of ECLAIRAGE_PRODUCTS) {
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
                is_featured: product.rating >= 4.7,
                image_url: 'https://images.unsplash.com/photo-1579261428085-2f3c4e8e9d7f?auto=format&fit=crop&q=80&w=800' // Placeholder
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
    console.log(`✨ Done! Inserted ${ECLAIRAGE_PRODUCTS.length} lighting products.`);
}

insertEclairageProducts();
