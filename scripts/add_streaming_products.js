import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Category IDs (from previous run)
const CATEGORIES = {
    cartesAcquisition: 'a3d15265-7395-4059-ac4b-7ea8cf1f7631',
    streamDeck: 'b1267a7e-104f-4da8-9f0a-d7ca34b0257d',
    switchersVideo: '29ec041a-297f-456b-a26e-9ea2e40dca1f',
    fondsVerts: '71d48344-3dee-46f7-bcf8-f27745279301',
    teleprompteurs: '9bfb6e2a-122b-45c4-81d2-802a43faac5d',
    cableManagement: '254a7ad3-37d6-4995-86e6-522ac1378f16'
};

const STREAMING_PRODUCTS = [
    // CARTES D'ACQUISITION
    {
        category_id: CATEGORIES.cartesAcquisition,
        name: 'Elgato Cam Link 4K',
        slug: 'elgato-cam-link-4k',
        brand: 'Elgato',
        description: "Transformez votre appareil photo ou caméscope en webcam 4K. La référence absolue pour une qualité d'image professionnelle en streaming et visioconférence.",
        price: 129,
        rating: 4.6,
        review_count: 12500,
        pros: ["Plug & Play", "4K30 / 1080p60", "Latence ultra-faible", "Compatible tout logiciel"],
        cons: ["Chauffe un peu", "USB 3.0 requis"],
        specs: { resolution: "4K30", interface: "USB 3.0", input: "HDMI" }
    },
    {
        category_id: CATEGORIES.cartesAcquisition,
        name: 'Elgato HD60 X',
        slug: 'elgato-hd60-x',
        brand: 'Elgato',
        description: "La carte de capture externe ultime pour les joueurs. Capturez votre gameplay PS5/Xbox en 4K30 ou 1080p60 HDR tout en jouant en 4K60 HDR grâce au passthrough.",
        price: 199,
        rating: 4.7,
        review_count: 3400,
        pros: ["VRR Support", "4K60 HDR Passthrough", "Latence quasi-nulle", "Compact"],
        cons: ["Prix élevé", "Pas de 4K60 Capture"],
        specs: { capture: "4K30/1080p60", passthrough: "4K60 HDR", vrr: "Oui" }
    },
    {
        category_id: CATEGORIES.cartesAcquisition,
        name: 'AVerMedia Live Gamer Portable 2 Plus',
        slug: 'avermedia-lgp2-plus',
        brand: 'AVerMedia',
        description: "Capturez sans PC ! Le mode 'PC-Free' permet d'enregistrer directement sur carte SD. Idéal pour les déplacements et les tournois.",
        price: 159,
        rating: 4.4,
        review_count: 2200,
        pros: ["Mode PC-Free (Carte SD)", "4K Passthrough", "Utilisation simple", "Commentaires audio intégrés"],
        cons: ["Capture max 1080p60", "Logiciel moins intuitif qu'Elgato"],
        specs: { capture: "1080p60", mode: "PC-Free / PC", stockage: "Micro SD" }
    },

    // STREAM DECK
    {
        category_id: CATEGORIES.streamDeck,
        name: 'Elgato Stream Deck MK.2',
        slug: 'elgato-stream-deck-mk2',
        brand: 'Elgato',
        description: "L'outil indispensable du streamer. 15 touches LCD entièrement personnalisables pour contrôler vos scènes, lancer des médias, régler le son et bien plus.",
        price: 149,
        rating: 4.9,
        review_count: 15600,
        pros: ["15 touches LCD infinies", "Intégration logicielle massive", "Façades interchangeables", "Support détachable"],
        cons: ["Prix", "Câble USB fixe"],
        specs: { touches: "15 LCD", connectivité: "USB 2.0", os: "Mac/PC" }
    },
    {
        category_id: CATEGORIES.streamDeck,
        name: 'Elgato Stream Deck +',
        slug: 'elgato-stream-deck-plus',
        brand: 'Elgato',
        description: "L'évolution tactile. Combine 8 touches LCD, un ruban tactile et 4 molettes pour un contrôle précis du volume, de l'éclairage et de l'étalonnage.",
        price: 229,
        rating: 4.8,
        review_count: 1200,
        pros: ["Molettes analogiques", "Ruban tactile", "Wave Link intégré", "Qualité premium"],
        cons: ["Prix élevé", "Seulement 8 touches"],
        specs: { touches: "8 LCD", molettes: "4", tactile: "OUI" }
    },
    {
        category_id: CATEGORIES.streamDeck,
        name: 'Loupedeck Live',
        slug: 'loupedeck-live',
        brand: 'Loupedeck',
        description: "Le concurrent sérieux pour les créatifs. Conçu pour le streaming mais aussi pour Lightroom, Premiere Pro et Photoshop grâce à ses profils natifs.",
        price: 269,
        rating: 4.3,
        review_count: 850,
        pros: ["Intégration Adobe native", "Écrans tactiles + boutons", "Molettes de qualité", "Compact"],
        cons: ["Logiciel complexe", "Courbe d'apprentissage"],
        specs: { touches: "12 tactiles", molettes: "6", boutons: "8 physiques" }
    },

    // SWITCHERS VIDEO
    {
        category_id: CATEGORIES.switchersVideo,
        name: 'Blackmagic ATEM Mini Pro',
        slug: 'blackmagic-atem-mini-pro',
        brand: 'Blackmagic Design',
        description: "Le standard des régies multicaméras HDMI. Commutez 4 sources, streamez directement via Ethernet et enregistrez sur disque USB. Une télé en miniature.",
        price: 495,
        rating: 4.8,
        review_count: 3500,
        pros: ["Streaming hardware direct", "Enregistrement USB direct", "Multiview", "Qualité broadcast"],
        cons: ["Chauffe", "Pas de bouton power", "Menu software dense"],
        specs: { entrees: "4 HDMI", stream: "Ethernet direct", record: "USB-C" }
    },
    {
        category_id: CATEGORIES.switchersVideo,
        name: 'Roland V-02HD MK II',
        slug: 'roland-v02hd-mk2',
        brand: 'Roland',
        description: "Le mélangeur vidéo le plus compact. Deux entrées HDMI, scaler intégré et effets vidéo, le tout pilotable au pied si besoin.",
        price: 399,
        rating: 4.5,
        review_count: 450,
        pros: ["Ultra-compact", "Scaler sur chaque entrée", "Effets visuels", "Sortie USB Webcam"],
        cons: ["Seulement 2 entrées", "Interface minimaliste"],
        specs: { entrees: "2 HDMI", sortie: "USB Webcam", audio: "2 entrées" }
    },

    // FONDS VERTS
    {
        category_id: CATEGORIES.fondsVerts,
        name: 'Elgato Green Screen',
        slug: 'elgato-green-screen',
        brand: 'Elgato',
        description: "Le fond vert rétractable référence. Se déploie en quelques secondes grâce à son cadre pneumatique en X. Rangement facile sous un lit.",
        price: 159,
        rating: 4.7,
        review_count: 8500,
        pros: ["Déploiement instantané", "Sans plis", "Rangement compact", "Toile qualité pro"],
        cons: ["Largeur limitée (148cm)", "Prix élevé"],
        specs: { dimensions: "148 x 180 cm", type: "Rétractable", materiau: "Dacron" }
    },
    {
        category_id: CATEGORIES.fondsVerts,
        name: 'Neewer Green Screen Mountable',
        slug: 'neewer-green-screen-mountable',
        brand: 'Neewer',
        description: "La solution murale économique. Un système pull-down style store à fixer au mur ou au plafond. Idéal pour les studios fixes.",
        price: 89,
        rating: 4.4,
        review_count: 2200,
        pros: ["Fixation murale/plafond", "Large", "Prix accessible", "Bonne tension"],
        cons: ["Installation permanente", "Mécanisme ressort parfois fragile"],
        specs: { dimensions: "1.8 x 2.8 m", fixations: "Mur/Plafond", type: "Déroulant" }
    },

    // TÉLÉPROMPTEURS
    {
        category_id: CATEGORIES.teleprompteurs,
        name: 'Elgato Prompter',
        slug: 'elgato-prompter',
        brand: 'Elgato',
        description: "Le premier téléprompteur tout-en-un avec écran intégré. Se connecte en USB comme un écran supplémentaire. Parfait pour le chat Twitch ou vos scripts.",
        price: 299,
        rating: 4.8,
        review_count: 650,
        pros: ["Écran 9\" intégré", "Pas besoin de tablette/smartphone", "Drag & Drop windows", "Hub USB intégré"],
        cons: ["Cher", "Uniquement 9 pouces"],
        specs: { ecran: "9\" 1024x600", connexion: "USB-C", compatible: "Cameras/Webcams" }
    },
    {
        category_id: CATEGORIES.teleprompteurs,
        name: 'Parrot Teleprompter 2',
        slug: 'parrot-teleprompter-2',
        brand: 'Padcaster',
        description: "Le prompteur ultra-portable pour smartphones. Se visse directement sur l'objectif. Idéal pour les créateurs vlogging et face-caméra.",
        price: 129,
        rating: 4.3,
        review_count: 1400,
        pros: ["Ultra-portable", "Qualité verre 30R/70T", "Télécommande Bluetooth", "Adaptateurs inclus"],
        cons: ["Smartphone requis", "Petit (pour téléphones)"],
        specs: { taille: "Smartphone", verre: "30/70", poids: "200g" }
    },

    // CÂBLE MANAGEMENT
    {
        category_id: CATEGORIES.cableManagement,
        name: 'D-Line Cable Tidy Box',
        slug: 'd-line-cable-box',
        brand: 'D-Line',
        description: "La solution élégante pour cacher vos multiprises. Sécurité enfant/animaux et design épuré pour un setup clean.",
        price: 19,
        rating: 4.6,
        review_count: 25000,
        pros: ["Cache multiprise complet", "Sécurité", "Design discret", "Plastique ABS robuste"],
        cons: ["Peut être juste pour gros chargeurs", "Prix pour du plastique"],
        specs: { taille: "Grand (415mm)", materiau: "ABS", couleur: "Noir/Blanc" }
    },
    {
        category_id: CATEGORIES.cableManagement,
        name: 'Alex Tech Cable Sleeve',
        slug: 'alex-tech-sleeve',
        brand: 'Alex Tech',
        description: "La gaine tressée extensible. Regroupez tous vos câbles HDMI et USB en un seul faisceau propre. Auto-enroulante.",
        price: 15,
        rating: 4.7,
        review_count: 42000,
        pros: ["Installation facile (split)", "Look pro", "Coupe à longueur", "Pas cher"],
        cons: ["S'effiloche si mal coupé", "Diamètre fixe"],
        specs: { longueur: "3m", diametre: "13mm", type: "Split loom" }
    }
];

async function insertStreamingProducts() {
    console.log("🎬 INSERTING STREAMING PRODUCTS\n");
    console.log("=".repeat(60));

    let added = 0;
    let skipped = 0;

    for (const product of STREAMING_PRODUCTS) {
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

        // Insert product (NO PRICE)
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
                image_url: 'https://images.unsplash.com/photo-1593697909683-bccb1b9e68a4?auto=format&fit=crop&q=80&w=800' // Placeholder tech
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
    console.log(`✨ Done! Added ${added} streaming products, skipped ${skipped}.`);
}

insertStreamingProducts();
