/**
 * Bulk Product Data Completion Script - Batch 2
 * Lenses, Audio, Cameras, Accessories
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
    // === OBJECTIFS SONY ===
    "Sony FE 16-35mm f/2.8 GM II": {
        image_url: "https://static.bhphoto.com/images/images1500x1500/1682439624_1759017.jpg",
        gallery_images: ["https://static.bhphoto.com/images/images1500x1500/1682439624_1759017.jpg"],
        description: "Ultra grand-angle professionnel G Master de 2ème génération. Plus compact et léger que son prédécesseur avec une qualité optique améliorée. AF XD linéaire ultra-rapide et silencieux. Bague d'ouverture sans clic pour la vidéo. Idéal pour l'architecture, le paysage et le vlog.",
        pros: ["Qualité G Master II", "AF XD ultra-rapide", "Plus compact (-20%)", "Bague ouverture déclickable"],
        cons: ["Prix premium", "Objectif massif malgré la réduction"]
    },
    "Sony FE 24-70mm f/2.8 GM II": {
        image_url: "https://static.bhphoto.com/images/images1500x1500/1649774479_1699501.jpg",
        gallery_images: ["https://static.bhphoto.com/images/images1500x1500/1649774479_1699501.jpg"],
        description: "Le zoom standard professionnel ultime. AF XD linéaire quatre fois plus rapide avec suivi parfait. Bokeh onctueux et résolution exceptionnelle bord à bord. Résistant à la poussière et l'humidité. Le must-have pour tout photographe/vidéaste Sony.",
        pros: ["Qualité optique exceptionnelle", "AF 4x plus rapide", "Compact pour un 24-70 2.8", "Construction pro robuste"],
        cons: ["Prix élevé", "Filtre 82mm coûteux"]
    },
    "Sony FE 70-200mm f/2.8 GM OSS II": {
        image_url: "https://static.bhphoto.com/images/images1500x1500/1634664058_1664298.jpg",
        gallery_images: ["https://static.bhphoto.com/images/images1500x1500/1634664058_1664298.jpg"],
        description: "Téléobjectif pro de 2ème génération, 29% plus léger que le Mk I. Quatre moteurs AF XD linéaires pour un suivi ultra-précis. Stabilisation optique de 5,5 stops. Bague d'ouverture et boutons AF personnalisables. Le roi des téléobjectifs f/2.8.",
        pros: ["29% plus léger", "AF ultra-rapide 4 moteurs", "Qualité G Master II", "Stabilisation 5.5 stops"],
        cons: ["Prix flagship", "Reste un investissement lourd"]
    },
    "Sony FE 35mm f/1.4 GM": {
        image_url: "https://static.bhphoto.com/images/images1500x1500/1611079252_1612485.jpg",
        gallery_images: ["https://static.bhphoto.com/images/images1500x1500/1611079252_1612485.jpg"],
        description: "Objectif standard lumineux avec qualité G Master. Bokeh crémeux grâce aux 11 lamelles circulaires. AF XD linéaire ultra-silencieux. Distance de mise au point minimale de 27cm. Parfait pour portraits, street photo et vidéo cinématique.",
        pros: ["Ouverture f/1.4 lumineuse", "Bokeh exceptionnel", "AF silencieux pour vidéo", "Distance min 27cm"],
        cons: ["Moins compact que la concurrence", "Prix G Master"]
    },
    "Sony FE 50mm f/1.2 GM": {
        image_url: "https://static.bhphoto.com/images/images1500x1500/1616432640_1619757.jpg",
        gallery_images: ["https://static.bhphoto.com/images/images1500x1500/1616432640_1619757.jpg"],
        description: "Le nifty fifty ultime avec l'ouverture f/1.2 la plus lumineuse de la gamme Sony. Résolution extraordinaire même à pleine ouverture. AF XD ultra-rapide malgré la lentille massive. 11 lamelles pour un bokeh parfaitement circulaire. Pour les perfectionnistes du portrait.",
        pros: ["f/1.2 ultra-lumineux", "Résolution exceptionnelle", "Bokeh parfait", "AF rapide malgré l'ouverture"],
        cons: ["Lourd et volumineux", "Prix très élevé"]
    },
    "Sony FE 24mm f/1.4 GM": {
        image_url: "https://static.bhphoto.com/images/images1500x1500/1537455661_1435889.jpg",
        gallery_images: ["https://static.bhphoto.com/images/images1500x1500/1537455661_1435889.jpg"],
        description: "Grand-angle compact et lumineux de la série G Master. Seulement 445g pour une qualité optique exceptionnelle. AF linéaire XD silencieux. Idéal pour astrophotographie, paysage et vlog avec son angle généreux et sa grande ouverture.",
        pros: ["Compact et léger (445g)", "f/1.4 lumineux", "Qualité G Master", "Parfait pour astro et paysage"],
        cons: ["Distorsion à corriger", "Prix premium"]
    },
    "Sony FE 85mm f/1.8": {
        image_url: "https://static.bhphoto.com/images/images1500x1500/1487694149_1317409.jpg",
        gallery_images: ["https://static.bhphoto.com/images/images1500x1500/1487694149_1317409.jpg"],
        description: "Portrait prime accessible avec excellent rapport qualité-prix. Seulement 371g avec AF rapide et précis. Bokeh agréable grâce aux 9 lamelles circulaires. Mise au point minimale de 80cm. Le choix intelligent pour débuter en portrait sur Sony.",
        pros: ["Prix accessible", "Léger (371g)", "AF rapide", "Excellent rapport qualité-prix"],
        cons: ["Construction plastique", "Pas de stabilisation"]
    },
    "Sony FE 24-105mm f/4 G OSS": {
        image_url: "https://static.bhphoto.com/images/images1500x1500/1509460855_1359115.jpg",
        gallery_images: ["https://static.bhphoto.com/images/images1500x1500/1509460855_1359115.jpg"],
        description: "Le zoom polyvalent par excellence. Plage 24-105mm couvrant la majorité des situations. Ouverture constante f/4 et stabilisation optique intégrée. Construction semi-pro avec tropicalisation. Le compagnon idéal pour le voyage et le quotidien.",
        pros: ["Plage polyvalente 24-105mm", "Ouverture constante f/4", "Stabilisation OSS intégrée", "Tropicalisé"],
        cons: ["Ouverture f/4 limitée", "Un peu lourd (663g)"]
    },
    "Sony FE 20mm f/1.8 G": {
        image_url: "https://static.bhphoto.com/images/images1500x1500/1582216221_1545787.jpg",
        gallery_images: ["https://static.bhphoto.com/images/images1500x1500/1582216221_1545787.jpg"],
        description: "Ultra grand-angle compact et lumineux de la série G. Seulement 373g pour un 20mm f/1.8. AF linéaire XD ultra-silencieux. Bouton AF-hold personnalisable. Parfait pour astrophoto, paysage nocturne, vlog et intérieurs.",
        pros: ["Ultra-compact (373g)", "f/1.8 lumineux", "AF silencieux pour vidéo", "Excellent pour astro"],
        cons: ["Distorsion à corriger en post", "Pas de stabilisation"]
    },
    // === OBJECTIFS SIGMA ===
    "Sigma 35mm f/1.4 DG DN Art": {
        image_url: "https://images.static-thomann.de/pics/bdb/529621/16828088_800.jpg",
        gallery_images: ["https://images.static-thomann.de/pics/bdb/529621/16828088_800.jpg"],
        description: "Objectif Art natif mirrorless avec qualité optique exceptionnelle. Plus compact et léger que la version DSLR. AF HLA rapide et silencieux. Bague d'ouverture avec mode clic/declic. Un des meilleurs 35mm du marché à prix raisonnable.",
        pros: ["Qualité optique Art", "Compact pour un f/1.4", "AF HLA silencieux", "Excellent prix"],
        cons: ["Pas de stabilisation", "Compatible Sony E / L-mount uniquement"]
    },
    "Sigma 24-70mm f/2.8 DG DN Art": {
        image_url: "https://images.static-thomann.de/pics/bdb/501976/16135067_800.jpg",
        gallery_images: ["https://images.static-thomann.de/pics/bdb/501976/16135067_800.jpg"],
        description: "Zoom standard professionnel Art natif mirrorless. Qualité optique rivalisant avec les sony G Master à prix inférieur. AF HLA ultra-rapide. Construction robuste tropicalisée. Alternative sérieuse aux zooms constructeurs.",
        pros: ["Qualité Art exceptionnelle", "Prix attractif vs GM", "AF HLA rapide", "Tropicalisé"],
        cons: ["Légèrement plus lourd", "Pas de bague d'ouverture"]
    },
    "Sigma 85mm f/1.4 DG DN Art": {
        image_url: "https://images.static-thomann.de/pics/bdb/501978/16135095_800.jpg",
        gallery_images: ["https://images.static-thomann.de/pics/bdb/501978/16135095_800.jpg"],
        description: "Portrait prime Art natif mirrorless. Résolution exceptionnelle et bokeh crémeux. Plus compact que la version DSLR (-40%). AF HLA silencieux pour photo et vidéo. Le choix des portraitistes exigeants avec budget raisonnable.",
        pros: ["Qualité portrait exceptionnelle", "40% plus compact que DSLR", "Bokeh magnifique", "Prix vs Sony GM"],
        cons: ["Pas de stabilisation", "Focus breathing visible"]
    },
    "Sigma 14-24mm f/2.8 DG DN Art": {
        image_url: "https://images.static-thomann.de/pics/bdb/501974/16135045_800.jpg",
        gallery_images: ["https://images.static-thomann.de/pics/bdb/501974/16135045_800.jpg"],
        description: "Ultra grand-angle zoom professionnel Art. Plage 14-24mm exceptionnelle pour architecture et paysage. Lentille avant bombée avec pare-soleil intégré. Construction robuste tropicalisée. Alternative premium aux zooms UGA constructeurs.",
        pros: ["Plage 14-24mm rare", "Qualité Art constante", "Construction pro", "Prix compétitif"],
        cons: ["Pas de filtres frontaux", "Lourd pour un voyage"]
    },
    // === OBJECTIFS CANON ===
    "Canon RF 24-105mm f/4L IS USM": {
        image_url: "https://static.bhphoto.com/images/images1500x1500/1536068447_1433712.jpg",
        gallery_images: ["https://static.bhphoto.com/images/images1500x1500/1536068447_1433712.jpg"],
        description: "Le zoom polyvalent de la série L pour Canon RF. Stabilisation 5 stops et ouverture constante f/4. Construction pro tropicalisée. AF Nano USM ultra-rapide et silencieux. Le kit lens premium que beaucoup gardent à vie.",
        pros: ["Construction série L", "Stabilisation 5 stops", "AF Nano USM silencieux", "Tropicalisé"],
        cons: ["Ouverture f/4 limitée", "Prix kit lens premium"]
    },
    "Canon RF 50mm f/1.8 STM": {
        image_url: "https://static.bhphoto.com/images/images1500x1500/1605197181_1602901.jpg",
        gallery_images: ["https://static.bhphoto.com/images/images1500x1500/1605197181_1602901.jpg"],
        description: "Le nifty fifty RF accessible avec qualité optique améliorée. Seulement 160g ultra-compact. AF STM silencieux pour la vidéo. Distance min de 30cm pour créativité. L'objectif parfait pour débuter sur Canon RF.",
        pros: ["Ultra-léger (160g)", "Prix très accessible", "AF STM silencieux", "Qualité optique correcte"],
        cons: ["Construction plastique", "AF pas le plus rapide"]
    },
    "Canon RF 15-35mm f/2.8L IS USM": {
        image_url: "https://static.bhphoto.com/images/images1500x1500/1566494499_1502502.jpg",
        gallery_images: ["https://static.bhphoto.com/images/images1500x1500/1566494499_1502502.jpg"],
        description: "Ultra grand-angle pro de la sainte trinité RF. Stabilisation 5 stops rare sur un UGA. Ouverture constante f/2.8 et construction L tropicalisée. AF Nano USM ultra-rapide. Pour les pros de l'architecture, paysage et vidéo.",
        pros: ["Stabilisation 5 stops (rare)", "Qualité série L", "f/2.8 constant", "Construction pro"],
        cons: ["Prix très élevé", "Lourd (840g)"]
    },
    // === OBJECTIFS TAMRON ===
    "Tamron 17-28mm f/2.8 Di III RXD": {
        image_url: "https://images.static-thomann.de/pics/bdb/463477/15163145_800.jpg",
        gallery_images: ["https://images.static-thomann.de/pics/bdb/463477/15163145_800.jpg"],
        description: "Ultra grand-angle compact et léger (420g) avec ouverture f/2.8 constante. Se couple parfaitement avec le 28-75mm pour une combo voyage idéale. AF RXD silencieux. Excellent rapport qualité-prix pour Sony E-mount.",
        pros: ["Ultra-compact (420g)", "f/2.8 constant", "Prix attractif", "Combo avec 28-75mm"],
        cons: ["Plage 17-28mm limitée", "Construction base de gamme"]
    },
    "Tamron 28-75mm f/2.8 Di III VXD G2": {
        image_url: "https://images.static-thomann.de/pics/bdb/540157/17219167_800.jpg",
        gallery_images: ["https://images.static-thomann.de/pics/bdb/540157/17219167_800.jpg"],
        description: "Zoom standard f/2.8 de 2ème génération avec AF VXD linéaire ultra-rapide. Distance min de 18cm pour macro occasionnel. Compact et léger (540g) pour un f/2.8. Le best-seller des zooms alternatifs Sony.",
        pros: ["AF VXD rapide", "Compact et léger", "Dist. min 18cm", "Prix imbattable"],
        cons: ["Pas 24mm", "Pas tropicalisé officiellement"]
    },
    // === CABLES ET ACCESSOIRES ===
    "Sommer Cable Galileo 238": {
        image_url: "https://images.static-thomann.de/pics/bdb/483547/17076139_800.jpg",
        gallery_images: ["https://images.static-thomann.de/pics/bdb/483547/17076139_800.jpg"],
        description: "Câble XLR professionnel haut de gamme avec conducteurs en cuivre OFC et blindage double couche. Connecteurs Neutrik plaqués or. Gaine souple résistante aux nœuds. La référence pour studios et installations permanentes.",
        pros: ["Connecteurs Neutrik or", "Cuivre OFC haute pureté", "Blindage double couche", "Très durable"],
        cons: ["Prix premium", "Moins souple que les entrée de gamme"]
    },
    "Vovox Link Protect S350 XLR": {
        image_url: "https://images.static-thomann.de/pics/bdb/459795/14953015_800.jpg",
        gallery_images: ["https://images.static-thomann.de/pics/bdb/459795/14953015_800.jpg"],
        description: "Câble XLR audiophile suisse avec conducteurs massifs et blindage asymétrique breveté. Construction artisanale garantie à vie. Pour les studios et musiciens les plus exigeants cherchant une transparence sonore maximale.",
        pros: ["Fabrication suisse", "Transparence sonore", "Garantie à vie", "Construction artisanale"],
        cons: ["Prix très élevé", "Overkill pour la plupart"]
    },
    "Elgato Wave Panels": {
        image_url: "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/wave-panels/wave-panels-sg-config.png",
        gallery_images: [
            "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/wave-panels/wave-panels-sg-config.png",
            "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/wave-panels/wave-panels.png"
        ],
        description: "Panneaux acoustiques modulaires design pour traitement sonore et esthétique. Installation facile avec système de montage propriétaire. Absorbent les fréquences moyennes et hautes pour réduire la réverbération. Style moderne qui s'intègre dans tout setup de streaming ou podcast.",
        pros: ["Design moderne et épuré", "Installation facile", "Efficaces sur mid/high", "Modulaires et extensibles"],
        cons: ["Traitement partiel (pas les basses)", "Prix élevé par panneau"]
    },
    // === AUTRES CAMERAS ===
    "Panasonic Lumix S5 II": {
        image_url: "https://static.bhphoto.com/images/images1500x1500/1672857681_1740805.jpg",
        gallery_images: ["https://static.bhphoto.com/images/images1500x1500/1672857681_1740805.jpg"],
        description: "Hybride plein format avec AF à détection de phase (première mondiale sur Lumix). Vidéo 6K 30p et 4K 60p illimités. Stabilisation IBIS 5 axes. Double slot carte SD. Le game-changer de Panasonic pour rivaliser avec Sony et Canon.",
        pros: ["AF détection phase (enfin!)", "Vidéo 6K illimitée", "IBIS 5 axes", "Prix compétitif"],
        cons: ["Ergonomie à apprivoiser", "Ecosystem objectifs L"]
    },
    "Razer Kiyo Pro Ultra": {
        image_url: "https://static.bhphoto.com/images/images1500x1500/1672934881_1741299.jpg",
        gallery_images: ["https://static.bhphoto.com/images/images1500x1500/1672934881_1741299.jpg"],
        description: "Webcam 4K avec le plus grand capteur du marché (1/1.2 pouce). Performances exceptionnelles en basse lumière. AF ultra-rapide et HDR. Champ de vision réglable. La webcam ultime pour les streamers exigeants.",
        pros: ["Capteur 1/1.2 pouce géant", "Excellent en basse lumière", "4K HDR", "AF très rapide"],
        cons: ["Prix très élevé", "Encombrante"]
    },
    // === ECLAIRAGES SUPPLEMENTAIRES ===
    "Godox SL-60W": {
        image_url: "https://images.static-thomann.de/pics/bdb/415927/12969789_800.jpg",
        gallery_images: ["https://images.static-thomann.de/pics/bdb/415927/12969789_800.jpg"],
        description: "Torche LED continue d'entrée de gamme avec 60W de puissance. Monture Bowens universelle. Télécommande sans fil incluse. 5600K daylight avec CRI 95+. Le choix budget pour démarrer en vidéo/photo studio.",
        pros: ["Prix très accessible", "Monture Bowens", "CRI 95+ correct", "Télécommande incluse"],
        cons: ["60W limité", "Ventilateur audible"]
    },
    "Aputure 120D II": {
        image_url: "https://images.static-thomann.de/pics/bdb/448558/14372549_800.jpg",
        gallery_images: ["https://images.static-thomann.de/pics/bdb/448558/14372549_800.jpg"],
        description: "Torche LED COB professionnelle de 120W avec rendement lumineux exceptionnel. CRI/TLCI 96+ pour un rendu des couleurs fidèle. Contrôle via app Sidus Link, DMX ou télécommande. Construction robuste pour productions sérieuses.",
        pros: ["120W puissants", "CRI/TLCI 96+", "Contrôle app/DMX", "Construction pro"],
        cons: ["Prix mid-range", "Pas de batterie intégrée"]
    },
    "Neewer 660 LED Panel": {
        image_url: "https://m.media-amazon.com/images/I/71KVxQqFVJL._AC_SL1500_.jpg",
        gallery_images: ["https://m.media-amazon.com/images/I/71KVxQqFVJL._AC_SL1500_.jpg"],
        description: "Panneau LED bicolore avec 660 LEDs réglables 3200-5600K. Alimentation secteur ou batteries NP-F. Diffuseur et barndoors inclus. CRI 96+. L'option budget populaire pour YouTube et portrait.",
        pros: ["Prix très bas", "Bicolore 3200-5600K", "Accessoires inclus", "Batteries NP-F compatibles"],
        cons: ["Construction basique", "Hotspot au centre"]
    },
    "Govee Glide Wall Light": {
        image_url: "https://m.media-amazon.com/images/I/71z7r0GxSqL._AC_SL1500_.jpg",
        gallery_images: ["https://m.media-amazon.com/images/I/71z7r0GxSqL._AC_SL1500_.jpg"],
        description: "Barres LED murales RGBIC modulaires pour éclairage d'ambiance gaming et streaming. Effets de couleur dynamiques synchronisés avec la musique. Compatible Alexa et Google Home. Installation facile avec adhésif 3M.",
        pros: ["RGBIC dynamique", "Sync musique", "Compatibles assistants vocaux", "Installation sans perçage"],
        cons: ["Plastique apparent", "App Govee requise"]
    },
    "Philips Hue Play Bar": {
        image_url: "https://m.media-amazon.com/images/I/61PYCZ5kOBL._AC_SL1500_.jpg",
        gallery_images: ["https://m.media-amazon.com/images/I/61PYCZ5kOBL._AC_SL1500_.jpg"],
        description: "Barre LED RGB premium de l'écosystème Philips Hue. 16 millions de couleurs et blanc réglable. Sync Box compatible pour synchronisation avec TV. Intégration domotique complète (HomeKit, Alexa, Google). L'éclairage d'ambiance premium.",
        pros: ["Écosystème Hue étendu", "Qualité Philips", "Sync Box TV", "Domotique complète"],
        cons: ["Nécessite Bridge Hue", "Prix élevé par barre"]
    },
    "Nanoleaf Shapes": {
        image_url: "https://m.media-amazon.com/images/I/71qXlKZvbML._AC_SL1500_.jpg",
        gallery_images: ["https://m.media-amazon.com/images/I/71qXlKZvbML._AC_SL1500_.jpg"],
        description: "Panneaux LED modulaires hexagonaux ou triangulaires pour créer des installations murales uniques. Chaque panneau adressable individuellement. Touch réactif et synchronisation musique. Le choix créatif pour les setups gaming et streaming originaux.",
        pros: ["Design modulaire créatif", "Touch réactif", "Sync musique", "Très populaire streaming"],
        cons: ["Prix par panneau élevé", "Installation planification requise"]
    },
    "Govee TV Backlight 3": {
        image_url: "https://m.media-amazon.com/images/I/71UaNw-FPML._AC_SL1500_.jpg",
        gallery_images: ["https://m.media-amazon.com/images/I/71UaNw-FPML._AC_SL1500_.jpg"],
        description: "Rétroéclairage LED avec caméra de synchronisation écran en temps réel. RGBIC avec zones indépendantes. Compatible avec écrans 55-65 pouces. Ambiance immersive pour gaming et films. Installation facile derrière le moniteur/TV.",
        pros: ["Sync écran temps réel", "Installation facile", "RGBIC zoné", "Prix accessible"],
        cons: ["Caméra visible", "Nécessite surface lisse"]
    },
    "Elgato Light Bar": {
        image_url: "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/light-strip/light-bar-gallery-main.png",
        gallery_images: ["https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/light-strip/light-bar-gallery-main.png"],
        description: "Barre LED premium pour éclairage de bureau/streaming. 1400 lumens avec température réglable 2900-7000K. Support de montage moniteur inclus. Contrôle via app Elgato Control Center ou Stream Deck. Éclairage d'accent parfait en complément des Key Lights.",
        pros: ["1400 lumens puissants", "Montage moniteur inclus", "Intégration Elgato", "Température ajustable"],
        cons: ["Prix pour une barre", "Moins polyvalent que Key Light"]
    },
    "Corsair iCUE LT100": {
        image_url: "https://m.media-amazon.com/images/I/71VHXe1qYnL._AC_SL1500_.jpg",
        gallery_images: ["https://m.media-amazon.com/images/I/71VHXe1qYnL._AC_SL1500_.jpg"],
        description: "Tours LED d'ambiance avec 46 LEDs adressables par tour. Intégration iCUE pour synchronisation avec périphériques Corsair. Diffusion 360° de la lumière. Mode musique et jeux réactifs. Le choix pour les setups full Corsair.",
        pros: ["Intégration iCUE native", "Diffusion 360°", "Modes réactifs", "Design premium"],
        cons: ["iCUE requis", "Prix par tour"]
    }
};

async function updateProducts() {
    console.log('\n🔄 Mise à jour batch 2...\n');

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

    console.log(`\n=== BATCH 2 ===`);
    console.log(`✅ Mis à jour: ${updated}`);
    console.log(`❌ Échecs: ${failed}`);
}

updateProducts();
