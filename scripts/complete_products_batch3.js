/**
 * Batch 3: Remaining products with missing images
 * Stream Decks, Capture Cards, Software, Cameras, etc.
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

const PRODUCT_DATA = {
    // === STREAM DECKS & CONTROLLERS ===
    "Elgato Stream Deck +": {
        image_url: "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/stream-deck-plus/stream-deck-plus-gallery-main.png",
        gallery_images: [
            "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/stream-deck-plus/stream-deck-plus-gallery-main.png"
        ],
        description: "Stream Deck avec 8 touches LCD, 4 cadrans rotatifs tactiles et écran tactile. Les cadrans permettent un contrôle précis du volume, de l'éclairage ou de tout paramètre continu. Parfait pour les créateurs audio-visuels exigeants.",
        pros: ["8 touches + 4 cadrans", "Écran tactile central", "Contrôle précis audio/vidéo", "Intégration Wave Link"],
        cons: ["Prix élevé", "Courbe d'apprentissage"]
    },
    "Loupedeck Live": {
        image_url: "https://static.bhphoto.com/images/images1500x1500/1604671561_1597387.jpg",
        gallery_images: ["https://static.bhphoto.com/images/images1500x1500/1604671561_1597387.jpg"],
        description: "Console créative avec écrans tactiles, boutons physiques et molettes pour un contrôle ultime de Lightroom, Premiere, OBS et plus. 12 touches LCD, 6 boutons analogiques et 2 molettes. L'outil des éditeurs professionnels.",
        pros: ["Touches LCD + molettes", "Compatible Lightroom/Premiere", "Construction premium", "Profils personnalisables"],
        cons: ["Prix très élevé", "Configuration complexe"]
    },
    // === CAPTURE CARDS ===
    "AVerMedia Live Gamer Portable 2 Plus": {
        image_url: "https://static.bhphoto.com/images/images1500x1500/1542389087_1438817.jpg",
        gallery_images: ["https://static.bhphoto.com/images/images1500x1500/1542389087_1438817.jpg"],
        description: "Carte de capture externe portable avec enregistrement sur carte SD sans PC. Capture 4K passthrough, 1080p60 HDR. Mode PC-Free pour streaming nomade. Compatible toutes consoles et PC.",
        pros: ["Enregistrement sans PC", "4K passthrough", "Portable et compact", "Carte SD intégrée"],
        cons: ["1080p60 max en capture", "Pas de VRR"]
    },
    "Blackmagic ATEM Mini Pro": {
        image_url: "https://static.bhphoto.com/images/images1500x1500/1582558237_1545976.jpg",
        gallery_images: ["https://static.bhphoto.com/images/images1500x1500/1582558237_1545976.jpg"],
        description: "Mélangeur vidéo broadcast avec 4 entrées HDMI et streaming direct intégré. Enregistrement USB et Ethernet streaming simultanés. Transitions, PiP et chroma key matériels. Le standard des productions multi-caméras en direct.",
        pros: ["4 entrées HDMI", "Streaming direct intégré", "Qualité broadcast", "Enregistrement USB"],
        cons: ["Pas de monitoring audio pro", "1080p max"]
    },
    "Roland V-02HD MK II": {
        image_url: "https://static.bhphoto.com/images/images1500x1500/1673532059_1741885.jpg",
        gallery_images: ["https://static.bhphoto.com/images/images1500x1500/1673532059_1741885.jpg"],
        description: "Mélangeur vidéo professionnel 2 canaux compact. Transitions, PiP, et effets en temps réel. Mixage audio intégré. Parfait pour présentations, conférences et productions légères.",
        pros: ["Qualité Roland", "Compact et portable", "Mixage audio intégré", "Effets temps réel"],
        cons: ["2 entrées seulement", "Prix élevé pour 2 canaux"]
    },
    // === CAMERAS ===
    "Sony FDR-X3000R": {
        image_url: "https://static.bhphoto.com/images/images1500x1500/1472046295_1275412.jpg",
        gallery_images: ["https://static.bhphoto.com/images/images1500x1500/1472046295_1275412.jpg"],
        description: "Caméra d'action Sony avec stabilisation optique Balanced (B.O.SS). 4K 30fps et 1080p 120fps slow motion. Télécommande LiveView incluse. Boîtier étanche 60m. Alternative premium à GoPro.",
        pros: ["Stabilisation B.O.SS optique", "Télécommande LiveView", "Étanche 60m", "Qualité Sony"],
        cons: ["Interface vieillissante", "Moins d'accessoires que GoPro"]
    },
    // === TELEPROMPTEURS ===
    "Elgato Prompter": {
        image_url: "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/prompter/prompter-gallery-main.png",
        gallery_images: ["https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/prompter/prompter-gallery-main.png"],
        description: "Téléprompteur premium avec verre sans reflet et app dédiée. Compatible webcams Facecam et caméras DSLR. Contrôle via app, Stream Deck ou clavier. L'outil des créateurs de contenu scriptés.",
        pros: ["Verre anti-reflet", "App Elgato dédiée", "Compatible webcam/DSLR", "Contrôle Stream Deck"],
        cons: ["Prix premium", "Setup initial complexe"]
    },
    "Parrot Teleprompter 2": {
        image_url: "https://m.media-amazon.com/images/I/71lQk3FWNOL._AC_SL1500_.jpg",
        gallery_images: ["https://m.media-amazon.com/images/I/71lQk3FWNOL._AC_SL1500_.jpg"],
        description: "Téléprompteur smartphone compact et portable. Montage sur trépied avec adaptateur. Miroir réfléchissant sans reflet. App gratuite iOS/Android. Solution budget pour vidéastes YouTube.",
        pros: ["Prix accessible", "Ultra-portable", "App gratuite", "Compatible tout smartphone"],
        cons: ["Taille écran limitée", "Qualité optique moyenne"]
    },
    // === GREEN SCREENS ===
    "Neewer Green Screen Mountable": {
        image_url: "https://m.media-amazon.com/images/I/71Px7J6mX1L._AC_SL1500_.jpg",
        gallery_images: ["https://m.media-amazon.com/images/I/71Px7J6mX1L._AC_SL1500_.jpg"],
        description: "Fond vert fixable au mur avec système de retrait facile. Tissu anti-plis chroma key. Montage mural discret. Idéal pour setups permanents avec espace limité.",
        pros: ["Montage mural", "Prix accessible", "Anti-plis", "Compact rangé"],
        cons: ["Installation murale requise", "Qualité tissu moyenne"]
    },
    // === SOFTWARE (Images logos) ===
    "OBS Studio": {
        image_url: "https://obsproject.com/assets/images/new_icon_small-r.png",
        gallery_images: ["https://obsproject.com/assets/images/new_icon_small-r.png"],
        description: "Logiciel de streaming et enregistrement open-source gratuit. Support multi-plateforme (Windows, Mac, Linux). Plugins communautaires massifs. La référence pour streamers Twitch et YouTube. Totalement gratuit et sans limitations.",
        pros: ["100% gratuit", "Open-source", "Plugins illimités", "Multi-plateforme"],
        cons: ["Courbe d'apprentissage", "Support communautaire seulement"]
    },
    "Streamlabs Desktop": {
        image_url: "https://cdn.streamlabs.com/static/imgs/logos/streamlabs-logo.png",
        gallery_images: ["https://cdn.streamlabs.com/static/imgs/logos/streamlabs-logo.png"],
        description: "Fork d'OBS avec interface simplifiée et intégrations natives (alertes, widgets, thèmes). App Store d'overlays et alertes. Version gratuite avec fonctions premium optionnelles.",
        pros: ["Interface simplifiée", "Alertes intégrées", "App Store overlays", "Thèmes gratuits"],
        cons: ["Plus lourd qu'OBS", "Fonctions premium payantes"]
    },
    "vMix Pro": {
        image_url: "https://www.vmix.com/images/vmix-logo.png",
        gallery_images: ["https://www.vmix.com/images/vmix-logo.png"],
        description: "Solution de production vidéo professionnelle tout-en-un. Streaming, enregistrement, transitions, titrage en direct. Support NDI, 4K, et multi-caméra avancé. Le choix des productions broadcast.",
        pros: ["Qualité broadcast", "4K et NDI natifs", "Titrage avancé", "Multi-caméra pro"],
        cons: ["Prix licence élevé", "Windows uniquement"]
    },
    "VoiceMod Pro": {
        image_url: "https://www.voicemod.net/v7/wp-content/uploads/2023/07/voicemod-logo.png",
        gallery_images: ["https://www.voicemod.net/v7/wp-content/uploads/2023/07/voicemod-logo.png"],
        description: "Modulateur de voix en temps réel avec effets humoristiques et créatifs. Soundboard intégré. Compatible Discord, Zoom, et jeux. Parfait pour streamers et créateurs de contenu divertissant.",
        pros: ["Effets temps réel", "Soundboard intégré", "Compatible tout logiciel", "Updates régulières"],
        cons: ["Abonnement Pro requis", "Latence légère"]
    },
    // === CABLES ===
    "Alex Tech Cable Sleeve": {
        image_url: "https://m.media-amazon.com/images/I/81qKz0Q3cCL._AC_SL1500_.jpg",
        gallery_images: ["https://m.media-amazon.com/images/I/81qKz0Q3cCL._AC_SL1500_.jpg"],
        description: "Gaine de câble tressée extensible pour organiser et protéger vos câbles. Disponible en plusieurs diamètres et couleurs. Coupe facile aux ciseaux. Solution économique pour un setup propre.",
        pros: ["Prix très bas", "Extensible et flexible", "Plusieurs couleurs", "Coupe facile"],
        cons: ["Pose manuelle requise", "Qualité variable"]
    },
    "D-Line Cable Tidy Box": {
        image_url: "https://m.media-amazon.com/images/I/61LLnlzpReL._AC_SL1500_.jpg",
        gallery_images: ["https://m.media-amazon.com/images/I/61LLnlzpReL._AC_SL1500_.jpg"],
        description: "Boîte de rangement pour multiprises et câbles excédentaires. Cache les blocs d'alimentation et organise le bureau. Ventilation intégrée. Design discret blanc ou noir.",
        pros: ["Cache multiprises", "Ventilation intégrée", "Design discret", "Installation facile"],
        cons: ["Taille limitée", "Un seul point d'entrée câble"]
    },
    // === SAMYANG LENS ===
    "Samyang AF 12mm f/2 Sony E": {
        image_url: "https://images.static-thomann.de/pics/bdb/563215/18408259_800.jpg",
        gallery_images: ["https://images.static-thomann.de/pics/bdb/563215/18408259_800.jpg"],
        description: "Ultra grand-angle AF compact pour Sony APS-C. Parfait pour vlog, astro et intérieurs. Ouverture f/2 lumineuse. AF silencieux pour vidéo. Prix imbattable pour un 12mm AF.",
        pros: ["f/2 lumineux", "AF silencieux", "Ultra-compact", "Prix très attractif"],
        cons: ["APS-C uniquement", "Qualité optique correcte (pas premium)"]
    },
    // === MICROPHONES NEEDING DATA ===
    "LCT 640 TS Authentica B-Stock": {
        image_url: "https://images.static-thomann.de/pics/bdb/429095/13517619_800.jpg",
        gallery_images: [
            "https://images.static-thomann.de/pics/bdb/429095/13517619_800.jpg",
            "https://images.static-thomann.de/pics/bdb/429095/13517620_800.jpg",
            "https://images.static-thomann.de/pics/bdb/429095/13517621_800.jpg"
        ],
        description: "Microphone à condensateur multi-pattern studio de Lewitt. Capsule double pour post-production du pattern polaire. Qualité d'enregistrement exceptionnelle avec bruit de fond ultra-bas. B-Stock à prix réduit mais qualité garantie.",
        pros: ["Multi-pattern ajustable en post", "Bruit ultra-bas", "Qualité studio", "Prix B-Stock avantageux"],
        cons: ["B-Stock (pas neuf)", "Nécessite interface pro"]
    },
    // === OVERLAYS & GRAPHICS ===
    "Own3d.tv Complete Package": {
        image_url: "https://www.own3d.tv/images/logo-own3d.png",
        gallery_images: ["https://www.own3d.tv/images/logo-own3d.png"],
        description: "Pack complet d'overlays, alertes et panneaux pour streamers. Thèmes professionnels personnalisables. Compatible OBS, Streamlabs et XSplit. Abonnement avec accès illimité au catalogue.",
        pros: ["Catalogue massif", "Thèmes pro", "Compatible tous logiciels", "Updates régulières"],
        cons: ["Abonnement requis", "Certains thèmes datés"]
    },
    "Nerd or Die Overlays": {
        image_url: "https://nerdordie.com/wp-content/uploads/2020/03/nerd-or-die-logo.png",
        gallery_images: ["https://nerdordie.com/wp-content/uploads/2020/03/nerd-or-die-logo.png"],
        description: "Overlays et alertes premium pour Twitch et YouTube. Designs modernes et animés. Packs thématiques par jeu. Qualité reconnue dans la communauté streaming.",
        pros: ["Designs modernes", "Packs par jeu", "Qualité reconnue", "Support réactif"],
        cons: ["Prix par pack", "Pas d'abonnement tout inclus"]
    },
    "Visuals by Impulse (VBI)": {
        image_url: "https://visualsbyimpulse.com/images/vbi-logo.png",
        gallery_images: ["https://visualsbyimpulse.com/images/vbi-logo.png"],
        description: "Studio d'overlays et transitions personnalisées pour streamers. Travail sur-mesure et packs préfaits. Qualité broadcast utilisée par des streamers professionnels.",
        pros: ["Qualité broadcast", "Personnalisation sur-mesure", "Utilisé par les pros", "Designs uniques"],
        cons: ["Prix premium", "Délais custom"]
    },
    "Placeit by Envato": {
        image_url: "https://placeit.net/images/logo-placeit.png",
        gallery_images: ["https://placeit.net/images/logo-placeit.png"],
        description: "Générateur en ligne de logos, thumbnails et mockups. Templates massifs pour YouTube, Twitch et réseaux sociaux. Abonnement illimité ou achat à l'unité.",
        pros: ["Templates illimités", "Génération rapide", "Multi-format", "Prix accessible"],
        cons: ["Designs génériques", "Pas d'animations"]
    }
};

async function updateProducts() {
    console.log('\n🔄 Mise à jour batch 3...\n');

    let updated = 0;
    let failed = 0;

    for (const [productName, data] of Object.entries(PRODUCT_DATA)) {
        console.log(`📦 ${productName}...`);

        const { data: products, error: findError } = await supabase
            .from('products')
            .select('id, name')
            .ilike('name', `%${productName}%`)
            .limit(1);

        if (findError || !products?.length) {
            console.log(`  ❌ Non trouvé`);
            failed++;
            continue;
        }

        const { error: updateError } = await supabase
            .from('products')
            .update({
                image_url: data.image_url,
                gallery_images: data.gallery_images,
                description: data.description,
                pros: data.pros,
                cons: data.cons
            })
            .eq('id', products[0].id);

        if (updateError) {
            console.log(`  ❌ ${updateError.message}`);
            failed++;
        } else {
            console.log(`  ✅ OK`);
            updated++;
        }
    }

    console.log(`\n=== BATCH 3 ===`);
    console.log(`✅ Mis à jour: ${updated}`);
    console.log(`❌ Échecs: ${failed}`);
}

updateProducts();
