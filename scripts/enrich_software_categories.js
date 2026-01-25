import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function enrichSoftwareCategories() {
    console.log("💾 ENRICHING SOFTWARE CATEGORIES\n");
    console.log("=".repeat(60));

    // 1. Get Category IDs
    const { data: categories } = await supabase
        .from('categories')
        .select('id, slug')
        .in('slug', ['logiciels-apps', 'design-overlays']);

    const appsCat = categories.find(c => c.slug === 'logiciels-apps');
    const designCat = categories.find(c => c.slug === 'design-overlays');

    if (!appsCat || !designCat) {
        console.error("❌ Categories not found! Run refactoring script first.");
        return;
    }

    const PRODUCTS = [
        // LOGICIELS & APPS
        {
            category_id: appsCat.id,
            name: 'OBS Studio',
            slug: 'obs-studio',
            brand: 'Open Source',
            description: "Le logiciel de streaming gratuit et open source incontournable. Puissant, flexible et soutenu par une immense communauté.",
            price: 0,
            rating: 4.9,
            review_count: 50000,
            pros: ["Gratuit & Open Source", "Plugins infinis", "Performance optimisée", "Contrôle total"],
            cons: ["Courbe d'apprentissage", "Interface austère"],
            specs: { os: "Windows/Mac/Linux", type: "Broadcasting", license: "GPLv2" },
            image: "https://obsproject.com/assets/images/new_icon_small.png" // Fallback to be replaced
        },
        {
            category_id: appsCat.id,
            name: 'vMix Pro',
            slug: 'vmix-pro',
            brand: 'StudioCoast',
            description: "La régie de production live professionnelle. Idéal pour les événements hybrides, le sport et les productions multicaméras complexes.",
            price: 630, // Basic HD equivalent or average
            rating: 4.8,
            review_count: 2500,
            pros: ["Fonctionnalités TV Broadcast", "vMix Call (invités)", "Replay instantané", "Support NDI complet"],
            cons: ["Windows uniquement", "Prix élevé (licences)"],
            specs: { os: "Windows", type: "Production Live", inputs: "Illimités (selon licence)" },
            image: "https://www.vmix.com/images/vmix-box-shot-2018.png"
        },
        {
            category_id: appsCat.id,
            name: 'VoiceMod Pro',
            slug: 'voicemod-pro',
            brand: 'VoiceMod',
            description: "Le changeur de voix temps réel ultime. Transformez votre voix en robot, démon ou célébrité pour divertir votre audience.",
            price: 29, // Lifetime approx
            rating: 4.6,
            review_count: 15000,
            pros: ["Soundboard intégrée", "Effets temps réel qualitatifs", "Intégration Stream Deck", "Compatible Discord/OBS"],
            cons: ["Abonnement ou Lifetime", "Parfois instable"],
            specs: { os: "Windows/Mac", effets: "100+", type: "Audio FX" },
            image: "https://www.voicemod.net/wp-content/uploads/2022/05/voicemod-logo.png"
        },
        {
            category_id: appsCat.id,
            name: 'Streamlabs Desktop',
            slug: 'streamlabs-desktop',
            brand: 'Logitech',
            description: "La solution tout-en-un basée sur OBS. Intègre alertes, chat et widgets pour simplifier la vie des nouveaux streamers.",
            price: 0,
            rating: 4.5,
            review_count: 32000,
            pros: ["Tout-en-un (Alertes/Chat)", "Installation facile", "Thèmes inclus", "Backup Cloud"],
            cons: ["Gourmand en ressources", "Publicité pour Prime"],
            specs: { os: "Windows/Mac", base: "OBS Fork", type: "Broadcasting" }
        },

        // DESIGN & OVERLAYS
        {
            category_id: designCat.id,
            name: 'Own3d.tv Complete Package',
            slug: 'own3d-overlay-package',
            brand: 'Own3d',
            description: "Des packages d'overlays animés complets pour Twitch et YouTube. Inclut scènes, alertes, bannières et transitions.",
            price: 39,
            rating: 4.7,
            review_count: 8500,
            pros: ["Installation 1-clic (OBS)", "Design pro animé", "Large choix de thèmes", "Support réactif"],
            cons: ["Designs très utilisés", "Payant"],
            specs: { format: "WebM/PNG", compatibilité: "OBS/Streamlabs", contenu: "Pack complet" }
        },
        {
            category_id: designCat.id,
            name: 'Nerd or Die Overlays',
            slug: 'nerd-or-die-overlays',
            brand: 'Nerd or Die',
            description: "Des designs e-sport et gaming premium. Hautement personnalisables via leurs fichiers sources After Effects souvent inclus.",
            price: 30,
            rating: 4.8,
            review_count: 6200,
            pros: ["Qualité ultra-premium", "Widgets customisables", "Fichiers sources AE", "Tutos d'installation"],
            cons: ["Choix moins vaste qu'Own3d", "Prix"],
            specs: { format: "WebM/AE", style: "E-sport/Tech", setup: "Scripts inclus" }
        },
        {
            category_id: designCat.id,
            name: 'Placeit by Envato',
            slug: 'placeit-logos',
            brand: 'Envato',
            description: "Le générateur de logos et assets gaming. Créez une identité visuelle complète en quelques minutes sans compétences graphiques.",
            price: 9, // Sub month approx
            rating: 4.5,
            review_count: 12000,
            pros: ["Création instantanée", "Mockups inclus", "Pas besoin de Photoshop", "Illimité (avec sub)"],
            cons: ["Designs génériques", "Abonnement récurrent"],
            specs: { type: "Générateur Web", export: "PNG/Video", usage: "Logos/Bannières" }
        },
        {
            category_id: designCat.id,
            name: 'Visuals by Impulse (VBI)',
            slug: 'visuals-by-impulse',
            brand: 'Elgato',
            description: "Maintenant Elgato Marketplace. Des designs exclusifs et des widgets interactifs révolutionnaires pour l'engagement.",
            price: 25,
            rating: 4.9,
            review_count: 4500,
            pros: ["Integration Stream Deck", "Widgets interactifs", "Qualité studio", "Partenaire Elgato"],
            cons: ["Prix premium", "Catalogue sélect"],
            specs: { plateforme: "Elgato Marketplace", type: "Interactive Design" }
        }
    ];

    let added = 0;

    for (const product of PRODUCTS) {
        const productId = randomUUID();
        console.log(`\n📦 Adding: ${product.name}`);

        let currentProductId = productId;

        // Check existing
        const { data: existing } = await supabase
            .from('products')
            .select('id')
            .eq('slug', product.slug)
            .single();

        if (existing) {
            console.log(`   ⏭️ Product exists (${existing.id}). Checking offers...`);
            currentProductId = existing.id;
        } else {
            // Insert Product
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
                    // Using a generic tech/software placeholder from Unsplash
                    image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800'
                });

            if (prodError) {
                console.log(`   ❌ Error: ${prodError.message}`);
                continue;
            }
        }

        // Check offers
        const { data: offers } = await supabase
            .from('product_offers')
            .select('id')
            .eq('product_id', currentProductId);

        if (offers && offers.length > 0) {
            console.log('   ✅ Offers already exist.');
            continue;
        }

        // Insert "Offer" (Link to official site/shop)
        // Using 'direct' as merchant_name which is likely the valid enum value for direct/download
        const { error: offerError } = await supabase
            .from('product_offers')
            .insert({
                id: randomUUID(),
                product_id: currentProductId,
                merchant_name: 'direct', // Correct generic merchant
                merchant_logo_url: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Globe_icon.svg',
                price: product.price,
                currency: 'EUR',
                affiliate_link: `https://google.com/search?q=${encodeURIComponent(product.name)}`, // Fallback for now
                in_stock: true
            });

        if (offerError) console.log(`   ⚠️ Offer error: ${offerError.message}`);
        else console.log(`   ✅ Added Offer (${product.price}€)`);

        added++;
    }

    console.log("\n" + "=".repeat(60));
    console.log(`✨ Done! Added ${added} software products.`);
}

enrichSoftwareCategories();
