/**
 * Optimisation SEO Cameras (Sony, Canon, Panasonic, Fuji)
 * Expert Content: Hybrid/Vlog/Cinema
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const UPDATES = {

    // --- SONY (Vlog & Hybrid) ---
    'sony-zv-e1': {
        pros: ["Capteur Plein Format (A7S III) dans un corps minuscule", "IA Autofocus de nouvelle génération", "Mode Vlog Cinematic (Bandes noires auto)"],
        cons: ["Surchauffe en 4K prolongée", "Un seul slot SD", "Pas de viseur"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Sony ZV-E1 est un monstre déguisé en jouet. Il embarque le capteur légendaire du Sony A7S III (le roi de la basse lumière) dans un boîtier compact de vlogging. C'est la caméra ultime pour les créateurs solo qui veulent une qualité cinéma "Hollywood" sans l'équipe technique. L'IA intégrée cadre toute seule et stabilise comme un gimbal.</p>

<h2>Pour qui est cette caméra ?</h2>
<ul>
    <li><strong>Vloggers de Luxe :</strong> Qualité d'image maximale, encombrement minimal.</li>
    <li><strong>Créateurs Solo :</strong> L'autofocus IA fait le point pour vous, même si vous bougez partout.</li>
</ul>
`
    },
    'sony-zv-e10': {
        pros: ["Le meilleur rapport Qualité/Prix pour débuter", "Objectifs interchangeables (E-Mount)", "Autofocus Sony (imbattable)"],
        cons: ["Rolling shutter marqué en 4K", "Pas de viseur", "Menus un peu complexes"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Sony ZV-E10 est la porte d'entrée idéale dans le monde sérieux de la vidéo. Il remplace votre smartphone ou webcam par un vrai capteur APS-C et la possibilité de changer d'objectif. C'est le standard actuel pour les YouTubers débutants et intermédiaires.</p>

<h2>Analyse Technique Approfondie</h2>
<p>Il possède un bouton "Product Showcase" génial : présentez un objet devant la caméra, et le focus bascule instantanément dessus. Plus besoin de mettre la main derrière l'objet !</p>
`
    },
    'sony-alpha-6700': {
        pros: ["Autofocus IA (Puce dédiée)", "4K 120fps (Ralentis fluides)", "Stabilisation capteur (IBIS)"],
        cons: ["Prix élevé pour de l'APS-C", "Surchauffe possible en 4K120"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Sony A6700 est le sommet de la gamme APS-C. Il hérite de l'intelligence artificielle du A7R V pour un autofocus qui reconnaît non seulement les yeux, mais aussi les postures humaines, les insectes et les véhicules. C'est un mini-A7 IV.</p>
`
    },
    'sony-alpha-7-iv': {
        pros: ["Le standard de l'industrie Hybride", "33 Mégapixels (Photo ultra détaillée)", "Autofocus irréprochable"],
        cons: ["Crop en 4K 60fps", "Écran pas aussi articulé que le ZV-E1"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Sony A7 IV est le "couteau suisse" des pros. Si vous faites 50% de photo et 50% de vidéo, c'est la caméra qu'il vous faut. Il excelle partout. Sa colorimétrie S-Cinetone donne des peaux magnifiques sans étalonnage complexe.</p>
`
    },

    // --- CANON ---
    'canon-eos-r6-ii': {
        pros: ["Autofocus Dual Pixel II (Magique)", "Rafale 40 i/s (Photo sport)", "Pas de crop en 4K 60p"],
        cons: ["Moins de choix d'objectifs tiers que Sony", "Micro-HDMI fragile"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Canon EOS R6 Mark II corrige le seul défaut du R6 original : la surchauffe. C'est maintenant une machine de guerre hybride capable de filmer en 4K 60p SANS recadrage (contrairement au Sony A7 IV). L'autofocus Canon est souvent jugé plus "naturel" et collant que celui de Sony.</p>
`
    },
    'canon-eos-r50': {
        pros: ["Minuscule et léger", "Le look Canon (Couleurs chaudes)", "Simple à utiliser"],
        cons: ["Pas de stabilisation capteur (IBIS)", "4K cropée"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Canon EOS R50 est mignon, mais puissant. Il est conçu pour ceux qui viennent du smartphone. Les menus sont guidés, l'interface est tactile et intuitive. C'est la meilleure caméra pour apprendre la photographie et démarrer une chaîne YouTube lifestyle.</p>
`
    },

    // --- PANASONIC (Lumix) ---
    'panasonic-lumix-s5-ii': {
        pros: ["Enfin un Autofocus de Phase (PDAF) chez Lumix !", "Ventilateur intégré (Film illimité)", "Stabilisation d'image (IBIS) meilleure du marché"],
        cons: ["Gamme d'objectifs L-Mount moins vaste", "Un peu lourd"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Lumix S5 II marque le retour en force de Panasonic. Ils ont enfin abandonné leur autofocus à contraste (qui "pompait") pour un autofocus hybride rapide et fiable. Ajoutez à cela la meilleure stabilisation du monde (on peut marcher en filmant sans gimbal) et un ventilateur intégré pour filmer en 6K sans limite de temps.</p>

<h2>Pour qui est cette caméra ?</h2>
<ul>
    <li><strong>Réalisateurs Indépendants :</strong> Outils d'assistance (Waveforms, LUTs) intégrés ultra complets.</li>
</ul>
`
    },
    'panasonic-lumix-gh6': {
        pros: ["Le roi du Micro 4/3", "5.7K ProRes en interne", "Pas de limite d'enregistrement"],
        cons: ["Autofocus moins bon que le S5 II", "Capteur plus petit (moins de bokeh)"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le GH6 est une caméra de cinéma dans un corps d'appareil photo. Il offre des codecs professionnels (ProRes) directement sur la carte, une résolution 5.7K, et des ralentis jusqu'à 300 images par seconde. C'est un outil de travail pour la production vidéo pure.</p>
`
    },

    // --- FUJIFILM ---
    'fujifilm-x-s20': {
        pros: ["Look rétro magnifique", "Simulations de film (Couleurs Fuji uniques)", "6.2K Open Gate"],
        cons: ["Autofocus encore un peu derrière Sony/Canon", "Chauffe un peu"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Fujifilm X-S20 n'est pas seulement beau, il a une âme. Fujifilm est célèbre pour sa "Science des couleurs". Avec les simulations de films intégrées (Eterna, Classic Chrome), vos vidéos ont un look argentique directement à la sortie du boîtier, sans passer des heures à étalonner sur ordinateur. Il filme aussi en "Open Gate" (capteur entier), parfait pour recadrer en format vertical (TikTok) et horizontal en même temps.</p>
`
    }
};

async function updateDescriptions() {
    console.log('\\n🚀 Starting SEO Optimization for CAMERAS...\\n');
    let successCount = 0;

    for (const [slug, data] of Object.entries(UPDATES)) {
        const updateData = {
            description: data.description,
            pros: data.pros,
            cons: data.cons
        };

        const { error } = await supabase
            .from('products')
            .update(updateData)
            .eq('slug', slug);

        if (error) {
            console.error(`❌ Error updating ${slug}:`, error.message);
        } else {
            console.log(`✅ Updated ${slug}`);
            successCount++;
        }
    }

    console.log(`\\n✅ ${successCount} camera products optimized!\\n`);
}

updateDescriptions();
