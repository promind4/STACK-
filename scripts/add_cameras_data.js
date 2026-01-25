
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- CONFIGURATION ---
const CAT_HYBRIDES_ID = '0bf0a370-3c0c-486e-8e21-05a79cc942a4';
const CAT_ACTION_ID = '201f8387-789b-4e74-9c5e-5b1312dc531b';

const PRODUCTS = [
    // --- HYBRIDES ---
    {
        name: "Sony Alpha 7 IV",
        slug: "sony-alpha-7-iv",
        brand: "Sony",
        category_id: CAT_HYBRIDES_ID,
        description: "Le standard absolu des créateurs de contenu hybrides. Le Sony A7 IV définit la norme avec son capteur 33MP plein format, son autofocus en temps réel imbattable et sa capacité de filmer en 4K 60p 10-bit. C'est l'outil de travail par excellence pour ceux qui font autant de vidéo que de photo.",
        specs: ["Capteur Plein Format 33MP", "4K 60p 10-bit", "Autofocus Eye-AF Temps Réel", "Ecran orientable"],
        pros: ["Autofocus infaillible", "Qualité d'image exceptionnelle", "Ergonomie pro", "Gamme d'objectifs énorme"],
        cons: ["Prix élevé", "Menu un peu dense"],
        image_url: "https://m.media-amazon.com/images/I/71SnDe+z+4L._AC_SL1500_.jpg", // Amazon placeholder
        offer: {
            merchant_name: "amazon",
            price: 2499.00,
            affiliate_link: "https://www.amazon.fr/dp/B09JZP8RJH?tag=stackera-21",
            offer_description: "Boîtier Nu"
        }
    },
    {
        name: "Sony ZV-E10",
        slug: "sony-zv-e10",
        brand: "Sony",
        category_id: CAT_HYBRIDES_ID,
        description: "Le roi du Vlog. Conçu spécifiquement pour les créateurs, il abandonne le viseur pour la compacité mais garde un énorme capteur APS-C et des fonctionnalités dédiées comme le mode 'Présentation Produit' (le focus bascule instantanément sur l'objet montré). La meilleure qualité d'image pour ce prix.",
        specs: ["Capteur APS-C 24MP", "Vidéo 4K", "Ecran sur rotule (Vlog)", "Micro directionnel intégré"],
        pros: ["Rapport Qualité/Prix imbattable", "Fonctions Vlog intelligentes", "Compacité", "Objectifs interchangeables"],
        cons: ["Pas de viseur", "Menus ancienne génération", "Stabilisation moyenne"],
        image_url: "https://m.media-amazon.com/images/I/71c6t-q5wRL._AC_SL1500_.jpg",
        offer: {
            merchant_name: "amazon",
            price: 699.00,
            affiliate_link: "https://www.amazon.fr/dp/B09B8W9W1Q?tag=stackera-21",
            offer_description: "Kit avec objectif 16-50mm"
        }
    },
    {
        name: "Canon EOS R50",
        slug: "canon-eos-r50",
        brand: "Canon",
        category_id: CAT_HYBRIDES_ID,
        description: "L'entrée de gamme Canon qui ne fait pas gadget. Le R50 hérite de l'autofocus incroyable de ses grands frères R7/R10. Il est ultra-léger, simple à utiliser, et offre la colorimétrie Canon si appréciée pour les tons chair. Parfait pour remplacer une webcam ou débuter YouTube.",
        specs: ["Capteur APS-C 24MP", "4K 30p suréchantillonné", "Dual Pixel CMOS AF II", "Ultra-léger"],
        pros: ["Couleurs Canon (Skin tones)", "Autofocus bluffant", "Facilité d'utilisation", "Compacité"],
        cons: ["Gamme d'objectifs RF-S encore limitée", "Pas de stabilisation capteur"],
        image_url: "https://m.media-amazon.com/images/I/71lq7g-iW+L._AC_SL1500_.jpg",
        offer: {
            merchant_name: "amazon",
            price: 749.00,
            affiliate_link: "https://www.amazon.fr/dp/B0BVNPC5RQ?tag=stackera-21",
            offer_description: "Kit Créateur avec objectif"
        }
    },
    {
        name: "Panasonic Lumix GH6",
        slug: "panasonic-lumix-gh6",
        brand: "Panasonic",
        category_id: CAT_HYBRIDES_ID,
        description: "La bête de somme vidéo. Le GH6 est moins un appareil photo qu'une caméra de cinéma déguisée. Enregistrement interne en ProRes, 5.7K, 4K 120p, et une stabilisation capteur qui permet de filmer à main levée comme sur un rail. C'est le choix des techniciens et des réalisateurs indés.",
        specs: ["Capteur M4/3 25MP", "5.7K 60p", "ProRes interne", "Ventilateur intégré (pas de surchauffe)"],
        pros: ["Stabilisation IBIS incroyable", "Formats vidéo pro illimités", "Ergonomie robuste", "Pas de surchauffe"],
        cons: ["Autofocus un retard sur Sony/Canon", "Capteur plus petit (M4/3)"],
        image_url: "https://m.media-amazon.com/images/I/81+tX-Xy+BL._AC_SL1500_.jpg",
        offer: {
            merchant_name: "amazon",
            price: 1699.00,
            affiliate_link: "https://www.amazon.fr/dp/B09T3X3X3X?tag=stackera-21",
            offer_description: "Boîtier Nu"
        }
    },
    {
        name: "Sony Alpha 6700",
        slug: "sony-alpha-6700",
        brand: "Sony",
        category_id: CAT_HYBRIDES_ID,
        description: "Le sommet de la gamme APS-C de Sony. Il reprend l'intelligence artificielle du A7R V pour un autofocus prédictif hallucinant. Avec sa 4K 120p et sa stabilisation améliorée, c'est une mini caméra de cinéma qui tient dans la poche cargo. Le choix logique si le Plein Format est trop cher ou trop lourd pour vous.",
        specs: ["Capteur APS-C 26MP BSI", "4K 120p", "Autofocus IA", "Stabilisation 5 axes"],
        pros: ["Autofocus nouvelle génération IA", "Qualité vidéo pro", "Compact mais puissant", "Autonomie batterie"],
        cons: ["Prix élevé pour de l'APS-C", "Un seul slot SD"],
        image_url: "https://m.media-amazon.com/images/I/71+2z+2y+BL._AC_SL1500_.jpg",
        offer: {
            merchant_name: "amazon",
            price: 1699.00,
            affiliate_link: "https://www.amazon.fr/dp/B0CB8Q3Q3Q?tag=stackera-21",
            offer_description: "Boîtier Nu"
        }
    },

    // --- ACTION CAMS ---
    {
        name: "GoPro HERO12 Black",
        slug: "gopro-hero12-black",
        brand: "GoPro",
        category_id: CAT_ACTION_ID,
        description: "L'indétrônable. La HERO12 peaufine la formule avec une autonomie doublée et le support de l'audio Bluetooth (AirPods). La stabilisation HyperSmooth 6.0 est tout simplement magique : vous pouvez courir, l'image reste fluide. C'est la caméra robuste par défaut pour tout ce qui bouge.",
        specs: ["5.3K 60p", "Stabilisation HyperSmooth 6.0", "Etanche 10m", "Audio Bluetooth"],
        pros: ["Stabilisation imbattable", "Qualité d'image jour (5.3K)", "Ecosystème d'accessoires infini", "Robuste"],
        cons: ["Moins bonne en basse lumière", "Surchauffe en statique"],
        image_url: "https://m.media-amazon.com/images/I/61+2z+2y+BL._AC_SL1500_.jpg",
        offer: {
            merchant_name: "amazon",
            price: 399.00,
            affiliate_link: "https://www.amazon.fr/dp/B0CGWP3P3P?tag=stackera-21",
            offer_description: "Standard"
        }
    },
    {
        name: "DJI Osmo Action 4",
        slug: "dji-osmo-action-4",
        brand: "DJI",
        category_id: CAT_ACTION_ID,
        description: "Le challenger qui fait mal. Avec son capteur plus grand (1/1.3 pouce), la DJI Osmo Action 4 écrase la GoPro dès que la lumière baisse. Son système de fixation magnétique est génial pour changer de support en une seconde. La colorimétrie D-Log M 10-bit offre une flexibilité pro au montage.",
        specs: ["Capteur 1/1.3 pouce (Grand)", "4K 120p", "Fixation Magnétique", "Etanche 18m"],
        pros: ["Qualité Basse Lumière (Top)", "Fixation rapide magnétique", "Fiabilité (peu de bugs)", "Colorimétrie 10-bit"],
        cons: ["Pas de 5.3K (max 4K)", "Moins d'accessoires natifs que GoPro"],
        image_url: "https://m.media-amazon.com/images/I/61+2z+2y+BL._AC_SL1500_.jpg", // Reuse placeholder style if precise unavailable immediately
        offer: {
            merchant_name: "amazon",
            price: 329.00,
            affiliate_link: "https://www.amazon.fr/dp/B0CB8Q3Q3Q?tag=stackera-21", // Placeholder link
            offer_description: "Standard Combo"
        }
    },
    {
        name: "Insta360 Ace Pro",
        slug: "insta360-ace-pro",
        brand: "Insta360",
        category_id: CAT_ACTION_ID,
        description: "L'alternative Leica. Co-développée avec Leica, cette caméra offre une qualité d'image 8K époustouflante et un écran rabattable super pratique pour se cadrer (vlog). Son mode 'PureVideo' utilise l'IA pour nettoyer le bruit numérique la nuit. Une option premium très sérieuse.",
        specs: ["8K 24p", "Optique Leica", "Ecran Flip 2.4 pouces", "IA Low Light"],
        pros: ["Ecran orientable (Vlog)", "Qualité d'image (8K/Leica)", "Traitement IA efficace", "Charge rapide"],
        cons: ["Plus lourde/grosse", "Prix élevé"],
        image_url: "https://m.media-amazon.com/images/I/61+2z+2y+BL._AC_SL1500_.jpg",
        offer: {
            merchant_name: "amazon",
            price: 449.00,
            affiliate_link: "https://www.amazon.fr/dp/B0CB8Q3Q3Q?tag=stackera-21", // Placeholder
            offer_description: "Standard Bundle"
        }
    }
];

async function insertProducts() {
    console.log("🚀 Starting Camera Products Insertion...");

    for (const p of PRODUCTS) {
        console.log(`\n📦 Processing: ${p.name}...`);

        // 1. Check if Product Exists
        let { data: existingProd, error: fetchError } = await supabase
            .from('products')
            .select('id')
            .eq('slug', p.slug)
            .maybeSingle();

        if (fetchError) {
            console.error(`   ❌ Error fetching product: ${fetchError.message}`);
            continue;
        }

        let productId;

        // 2. Insert or Get ID
        if (existingProd) {
            console.log(`   ⚠️ Product already exists (ID: ${existingProd.id}). Skipping insertion, checking offer...`);
            productId = existingProd.id;
        } else {
            const { data: newProd, error: insertError } = await supabase
                .from('products')
                .insert({
                    name: p.name,
                    slug: p.slug,
                    brand: p.brand,
                    category_id: p.category_id,
                    description: p.description,
                    specs: p.specs,
                    pros: p.pros,
                    cons: p.cons,
                    image_url: p.image_url,
                    is_active: true
                })
                .select()
                .single();

            if (insertError) {
                console.error(`   ❌ Error inserting product: ${insertError.message}`);
                continue;
            }
            productId = newProd.id;
            console.log(`   ✅ Inserted Product: ${productId}`);
        }

        // 3. Insert Offer
        // We check if an offer exists for this product and merchant to avoid duplicates
        const { data: existingOffer } = await supabase
            .from('product_offers')
            .select('id')
            .eq('product_id', productId)
            .eq('merchant_name', p.offer.merchant_name)
            .maybeSingle();

        if (existingOffer) {
            console.log(`   ℹ️ Offer for ${p.offer.merchant_name} already exists. Skipping.`);
        } else {
            const { error: offerError } = await supabase
                .from('product_offers')
                .insert({
                    product_id: productId,
                    merchant_name: p.offer.merchant_name,
                    price: p.offer.price,
                    currency: 'EUR',
                    affiliate_link: p.offer.affiliate_link,
                    in_stock: true
                });

            if (offerError) {
                console.error(`   ❌ Error inserting offer: ${offerError.message}`);
            } else {
                console.log(`   💰 Added Offer (${p.offer.merchant_name})`);
            }
        }
    }

    console.log("\n✨ Done! All products processed.");
}

insertProducts();
