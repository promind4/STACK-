/**
 * Optimisation SEO Eclairage (Elgato & Logitech)
 * Expert Content: Streaming Lighting Quality
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const UPDATES = {
    // --- ELGATO ---
    'elgato-key-light': {
        pros: ["Puissance phénoménale (2800 Lumens)", "Zéro chaleur (technologie Edge-lit)", "Gain de place (fixation bureau)"],
        cons: ["Nécessite bon WiFi pour le contrôle", "Prix élevé"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>L'Elgato Key Light est l'étalon or de l'éclairage pour le streaming. Oubliez les softbox énormes qui chauffent la pièce. Ce panneau plat LED se fixe à votre bureau, ne prend aucune place au sol, et éclaire comme une fenêtre en plein jour. C'est propre, c'est puissant, c'est pro.</p>

<h2>Pour qui est cet éclairage ?</h2>
<ul>
    <li><strong>Streamers Pro :</strong> Si vous voulez cette image "TV" nette et sans grain.</li>
    <li><strong>Télétravailleurs Exigeants :</strong> Pour avoir l'air frais et réveillé sur Zoom à 8h du matin.</li>
</ul>

<h2>Analyse Technique Approfondie</h2>
<p>La magie réside dans la diffusion. Les LED ne vous éblouissent pas directement; elles éclairent la tranche du panneau (Edge-lit) et la lumière est redirigée vers vous par des couches de diffusion. Résultat : une lumière douce qui ne fait pas mal aux yeux, même à pleine puissance.</p>

<h2>FAQ & Conseils</h2>
<p><strong>Contrôle WiFi :</strong><br>
Le Key Light n'a PAS de boutons physiques. Tout se fait via le Control Center sur PC/Mac ou Stream Deck. C'est génial pour ajuster la lumière sans se lever, mais assurez-vous que votre PC est sur le même réseau.</p>
`
    },
    'elgato-key-light-air': {
        pros: ["Toute la qualité Elgato en plus petit", "Pied posable (pas de clamp)", "Prix plus doux"],
        cons: ["Moins puissant que le grand frère (1400 Lumens)", "Le pied prend un peu de place sur le bureau"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Elgato Key Light Air est la version "Bureau" du Key Light. Au lieu de se fixer au bord de la table, il possède un pied lesté classique. Il offre la même qualité de lumière diffuse et douce, mais avec une puissance adaptée aux setups plus serrés. C'est le choix idéal si vous ne pouvez pas (ou ne voulez pas) fixer des étaux sur votre bureau.</p>

<h2>Pour qui est cet éclairage ?</h2>
<ul>
    <li><strong>YouTubers Beauté/Tech :</strong> La colorimétrie est ajustable (chaud/froid) pour matcher parfaitement l'ambiance.</li>
</ul>
`
    },
    'elgato-key-light-mini': {
        pros: ["Batterie intégrée (Nomade)", "Aimanté (se colle partout)", "WiFi + Boutons physiques !"],
        cons: ["Autonomie limitée à pleine puissance", "Petit format"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Elgato Key Light Mini est le petit génie de la famille. C'est un Key Light Air qui a mangé une batterie. Il est portable, aimanté, et contrairement à ses grands frères, il a des boutons physiques sur la tranche ! Vous pouvez l'emmener dehors pour un vlog ou l'utiliser en éclairage d'appoint (Hair light) sans câble.</p>

<h2>Analyse Technique Approfondie</h2>
<p>Malgré sa taille (comme un gros smartphone), il balance 800 Lumens. C'est suffisant pour vous déboucher les ombres en appel vidéo ou en stream IRL.</p>
`
    },
    'elgato-ring-light': {
        pros: ["Lumière annulaire parfaite (Regard pétillant)", "Support caméra intégré au centre", "Diffusion laiteuse premium"],
        cons: ["Très grand (encombrant)", "Fixation bureau obligatoire"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Elgato Ring Light n'est pas un ring light "TikTok" à 30€. C'est un outil de production sérieux. Il utilise la même technologie de diffusion que les Key Lights, ce qui donne une lumière ultra-douce qui lisse la peau. Le plus génial ? Votre caméra se fixe AU CENTRE de l'anneau, garantissant un éclairage sans aucune ombre sur le visage.</p>

<h2>Pour qui est cet éclairage ?</h2>
<ul>
    <li><strong>Maquillage & Beauté :</strong> L'anneau crée ce reflet circulaire iconique dans les yeux ("Catchlight") qui donne vie au regard.</li>
</ul>
`
    },
    // --- LOGITECH ---
    'logitech-litra-glow': {
        pros: ["Technologie TrueSoft (Respecte la peau)", "Se pose sur l'écran (Monitor Mount)", "USB-C (Pas d'alim externe !)"],
        cons: ["Pas très puissant (juste pour le visage)", "Câble USBun peu court"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Logitech Litra Glow est la réponse intelligente aux Key Lights. Au lieu d'être un gros panneau, c'est un petit cube qui se pose sur votre écran (comme une webcam). Sa technologie "TrueSoft" est conçue pour flatter les tons chair et éviter l'effet "fantôme blanc". C'est l'éclairage ultime pour ceux qui ne veulent pas de trépieds partout.</p>

<h2>Analyse Technique Approfondie</h2>
<p>Le coup de génie, c'est l'alimentation. Il se branche en USB sur votre ordinateur. Pas de brique d'alimentation qui traîne par terre. Il s'allume avec votre PC.</p>
`
    }
};

async function updateDescriptions() {
    console.log('\\n🚀 Starting SEO Optimization for LIGHTING (Elgato/Logitech)...\\n');
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

    console.log(`\\n✅ ${successCount} lighting products optimized!\\n`);
}

updateDescriptions();
