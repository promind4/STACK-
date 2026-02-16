/**
 * Refinement SEO: Sony Alpha 7 IV
 * Upgrade to "Maximum Quality" (Deep Dive)
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const UPDATE = {
    slug: 'sony-alpha-7-iv',
    data: {
        pros: [
            "Autofocus Eye-AF en temps réel (Humains, Animaux, Oiseaux)",
            "33 Mégapixels (Le sweet spot Photo/Vidéo)",
            "Couleurs S-Cinetone (Look cinéma direct)",
            "Focus Breathing Compensation (Magique avec optiques Sony)"
        ],
        cons: [
            "Crop 1.5x en 4K 60fps (Super 35mm)",
            "Rolling shutter visible en mode full frame électronique"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Sony Alpha 7 IV a la lourde tâche de succéder au légendaire A7 III. Et il le fait brillamment. C'est l'appareil "Hybride" par excellence. Il ne sacrifie rien : c'est un appareil photo redoutable de 33 mégapixels ET une caméra de cinéma capable de filmer en 4K 10-bit 4:2:2 en interne.</p>

<h2>Pour qui est cette caméra ?</h2>
<ul>
    <li><strong>Créateurs Hybrides :</strong> Vous faites un shooting portrait le matin et une vidéo YouTube l'après-midi ? C'est le boîtier unique qui fait les deux à la perfection.</li>
    <li><strong>Vidéastes exigeants :</strong> L'ajout du 10-bit 4:2:2 permet enfin d'étalonner l'image (S-Log3) sans que le ciel ne se déchire (banding).</li>
</ul>

<h2>Analyse Technique Approfondie</h2>

<h3>L'Autofocus du Futur</h3>
<p>Il hérite des algorithmes du vaisseau amiral A1. Il ne se contente pas de suivre l'œil, il anticipe les mouvements. Si le sujet se retourne, l'IA continue de tracker la tête. C'est une assurance-vie pour les plans flous.</p>

<h3>Une Exclusivité : Focus Breathing Compensation</h3>
<p>C'est une fonctionnalité révolutionnaire : si vous utilisez des objectifs Sony, le boîtier corrige électroniquement le changement de cadrage qui se produit quand on change la mise au point. Votre optique photo se comporte comme une optique cinéma à 20 000€.</p>

<h3>Le point qui fâche : Le Crop 4K 60p</h3>
<p>Attention, si vous voulez filmer des ralentis fluides en 4K (60 images/seconde), l'appareil va zoomer (crop 1.5x, format Super 35). Vos plans seront plus serrés. C'est le seul vrai compromis face au Canon R6 II.</p>
`
    }
};

async function update() {
    console.log(`\n🚀 Refining ${UPDATE.slug}...\n`);

    const { error } = await supabase
        .from('products')
        .update(UPDATE.data)
        .eq('slug', UPDATE.slug);

    if (error) {
        console.error(`❌ Error updating ${UPDATE.slug}:`, error.message);
    } else {
        console.log(`✅ ${UPDATE.slug} upgraded to Max Quality!`);
    }
}

update();
