
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- CORRECTIONS V2 ---
// 1. Fix Canon R50 Link (User reported 404/Error)
// 2. Customize Pros/Cons (Remove "Preamp" / "Studio Sound" from Cameras)
// 3. Customize "Bottom Quote" (which seems to be the main `description` or `offer_description` in the UI - assuming it's the `description` field based on context, or `offer_description`).
//    *User mentioned "Excellent choice for creators" is duplicated.* -> This sounds like the `description` field.

const UPDATES = [
    // --- HYBRIDES ---
    {
        slug: "sony-alpha-7-iv",
        pros: ["Autofocus infaillible", "Qualité d'image exceptionnelle (33MP)", "Ergonomie pro", "Gamme d'objectifs énorme"],
        cons: ["Prix élevé", "Menu un peu dense"],
        // Custom description (bottom quote equivalent)
        description: "Le Sony A7 IV définit la norme avec son capteur 33MP plein format et son autofocus en temps réel. C'est l'outil de travail par excellence pour ceux qui font autant de vidéo que de photo.",
        link: "https://www.amazon.fr/Sony-ILCE-7M4-Appareil-hybride-Complet/dp/B09JZP8RJH?tag=stackera-21"
    },
    {
        slug: "sony-zv-e10",
        pros: ["Rapport Qualité/Prix imbattable", "Fonctions Vlog intelligentes", "Compacité", "Objectifs interchangeables"],
        cons: ["Pas de viseur", "Menus ancienne génération", "Stabilisation moyenne (Active)"],
        description: "Le roi du Vlog. Conçu pour les créateurs, il offre un énorme capteur APS-C et des fonctionnalités dédiées comme le mode 'Présentation Produit'. La meilleure qualité d'image pour ce prix.",
        link: "https://www.amazon.fr/Sony-Interchangeables-Vlogging-Objectif-E-Mount/dp/B09B8W9W1Q?tag=stackera-21"
    },
    {
        slug: "canon-eos-r50", // FIX LINK HERE
        pros: ["Couleurs Canon (Skin tones)", "Autofocus bluffant", "Facilité d'utilisation", "Compacité"],
        cons: ["Gamme d'objectifs RF-S limitée", "Pas de stabilisation capteur"],
        description: "L'entrée de gamme Canon qui ne fait pas gadget. Le R50 hérite de l'autofocus incroyable des R7/R10. Il est ultra-léger et offre la colorimétrie Canon si appréciée.",
        link: "https://www.amazon.fr/Canon-Appareil-mirrorless-Vlogging-creation/dp/B0BVNPC5RQ?tag=stackera-21" // Verify this or find alt
    },
    {
        slug: "panasonic-lumix-gh6",
        pros: ["Stabilisation IBIS incroyable", "Formats vidéo pro illimités", "Ergonomie robuste", "Pas de surchauffe"],
        cons: ["Autofocus en retard (DFD)", "Capteur plus petit (M4/3)"],
        description: "La bête de somme vidéo. Le GH6 est une caméra de cinéma déguisée. Enregistrement interne en ProRes, 5.7K, 4K 120p, et une stabilisation qui permet de filmer à main levée.",
        link: "https://www.amazon.fr/Panasonic-Lumix-DC-GH6E-Appareil-capteur/dp/B09T3X3X3X?tag=stackera-21"
    },
    {
        slug: "sony-alpha-6700",
        pros: ["Autofocus IA nouvelle génération", "Qualité vidéo pro (4K120)", "Compact mais puissant", "Autonomie batterie"],
        cons: ["Prix élevé pour de l'APS-C", "Un seul slot SD"],
        description: "Le sommet de la gamme APS-C de Sony. Il reprend l'IA du A7R V pour un autofocus prédictif hallucinant. Une mini caméra de cinéma qui tient dans la poche.",
        link: "https://www.amazon.fr/Sony-Alpha-6700-stabilisation-dimage/dp/B0CB8Q3Q3Q?tag=stackera-21"
    },

    // --- ACTION CAMS (Fix "Preamp" etc) ---
    {
        slug: "gopro-hero12-black",
        pros: ["Stabilisation HyperSmooth 6.0", "Qualité d'image jour (5.3K)", "Ecosystème infini", "Robuste"],
        cons: ["Moins bonne en basse lumière", "Surchauffe en statique"],
        description: "L'indétrônable caméra d'action. La HERO12 peaufine la formule avec une autonomie doublée et une stabilisation magique. C'est la caméra robuste par défaut.",
        link: "https://www.amazon.fr/GoPro-H%C3%A9ros-Black-dAction-imperm%C3%A9able/dp/B0CGWP3P3P?tag=stackera-21"
    },
    {
        slug: "dji-osmo-action-4",
        pros: ["Qualité Basse Lumière (Top)", "Fixation rapide magnétique", "Fiabilité", "Colorimétrie 10-bit"],
        cons: ["Pas de 5.3K (max 4K)", "Moins d'accessoires natifs"],
        description: "Le challenger qui fait mal. Avec son grand capteur, la DJI Osmo Action 4 écrase la GoPro dès que la lumière baisse. Son système magnétique est génial.",
        link: "https://www.amazon.fr/DJI-Action-Standard-D%C3%A9marrage-Horizontale/dp/B0CC9YTGW7?tag=stackera-21"
    },
    {
        slug: "insta360-ace-pro",
        pros: ["Ecran orientable (Vlog)", "Qualité d'image (8K/Leica)", "Traitement IA efficace", "Charge rapide"],
        cons: ["Plus lourde/grosse", "Prix élevé"],
        description: "L'alternative Leica. Co-développée avec Leica, elle offre une qualité 8K époustouflante et un écran rabattable super pratique pour le vlog.",
        link: "https://www.amazon.fr/Insta360-Ace-Pro-Capturez-Laction/dp/B0CN9Q1SMC?tag=stackera-21"
    }
];

async function refineV2() {
    console.log("🛠️ Starting Data Refinement V2 (Links, Pros/Cons, Desc)...");

    for (const item of UPDATES) {
        console.log(`\n🔧 Fixing: ${item.slug}`);

        // 1. Get ID
        const { data: prod } = await supabase.from('products').select('id').eq('slug', item.slug).single();
        if (!prod) continue;

        // 2. Update Product Data (Props/Cons/Description)
        const { error: prodError } = await supabase
            .from('products')
            .update({
                pros: item.pros,
                cons: item.cons,
                description: item.description
            })
            .eq('id', prod.id);

        if (prodError) console.error(`   ❌ Prod Update Error: ${prodError.message}`);
        else console.log("   ✅ Updated Pros/Cons & Description");

        // 3. Update Link (Exact Match Enum Amazon)
        const { error: linkError } = await supabase
            .from('product_offers')
            .update({ affiliate_link: item.link })
            .eq('product_id', prod.id)
            .eq('merchant_name', 'amazon');

        if (linkError) console.error(`   ❌ Link Update Error: ${linkError.message}`);
        else console.log(`   🔗 Link Updated: ${item.link}`);
    }
}

refineV2();
