/**
 * Optimisation SEO Lenses (Sony, Tamron, Sigma)
 * Expert Content: Wide Angle Masters
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const UPDATES = {

    // --- SONY ---
    'sony-20mm-g': {
        pros: ["Focale 20mm idéale pour le Vlog", "Ouverture f/1.8 (Flou d'arrière-plan magnifique)", "Léger et compact (Série G)"],
        cons: ["Pas de stabilisation optique (repose sur le boîtier)", "Pas aussi large qu'un 16mm"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Sony FE 20mm f/1.8 G est l'objectif secret des YouTubers. Pourquoi ? Parce que 20mm est la focale parfaite pour se filmer à bout de bras sans avoir une tête déformée, tout en montrant assez de décor. Il est ultra-piqué dès la pleine ouverture, compact, et son autofocus suit vos yeux sans jamais lâcher.</p>

<h2>Pour qui est cet objectif ?</h2>
<ul>
    <li><strong>Vloggers Face-Cam :</strong> C'est le cadrage "YouTube Standard" par excellence.</li>
    <li><strong>Astrophotographes :</strong> À f/1.8, il avale la lumière des étoiles sans aucune coma dans les coins.</li>
</ul>

<h2>Analyse Technique Approfondie</h2>
<p>C'est un objectif de la série "G", juste en dessous des "GM". Mais honnêtement, optiquement, il rivalise avec les GM. Il possède une bague d'ouverture décranquable (Click ON/OFF) pour les vidéaste.</p>
`
    },
    'sony-fe-16-35mm-gm2': {
        pros: ["La V2 du zoom grand angle ultime", "Plus léger et petit que la V1", "Piqué démentiel d'un bord à l'autre"],
        cons: ["Prix astronomique", "Extension du fût au zoom (pas de zoom interne)"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Sony 16-35mm f/2.8 GM II est le roi de la montagne. Sony a réussi l'impossible : améliorer le piqué tout en réduisant la taille et le poids par rapport à la version 1. C'est le zoom grand-angle standard pour les pro qui ne peuvent pas se permettre une seule image molle.</p>

<h2>Analyse Technique Approfondie</h2>
<p>Il intègre 4 moteurs linéaires XD pour un autofocus instantané et silencieux. Le "Focus Breathing" est quasi inexistant, ce qui le rend parfait pour la vidéo narrative.</p>
`
    },

    // --- TAMRON ---
    'tamron-17-28mm': {
        pros: ["Rapport Qualité/Prix imbattable", "Zoom interne (ne s'allonge pas !)", "Léger comme une plume"],
        cons: ["S'arrête à 28mm (un peu court)", "Moins de boutons que les Sony"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Tamron 17-28mm f/2.8 Di III RXD est l'objectif qui a fait trembler Sony. Pour la moitié du prix d'un GM, il offre 95% de la qualité d'image. Son gros point fort pour la vidéo sur gimbal ? C'est un zoom interne : l'objectif ne change pas de longueur quand on zoom, donc vous n'avez pas besoin de rééquilibrer votre stabilisateur !</p>
`
    },

    // --- SIGMA ---
    'sigma-14-24mm-art': {
        pros: ["L'angle le plus large (14mm !)", "Qualité optique 'Art' (Zéro distorsion)", "Construction tank"],
        cons: ["Pas de filetage pour filtre à l'avant (lentille bombée)", "Lourd"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Sigma 14-24mm f/2.8 DG DN Art est pour ceux qui trouvent que 16mm n'est pas assez large. À 14mm, vous capturez des paysages épiques ou des pièces entières sans recul. La série "Art" de Sigma est célèbre pour son piqué chirurgical, et cet objectif ne déçoit pas. C'est le choix des photographes d'architecture et de paysage.</p>

<h2>Analyse Technique Approfondie</h2>
<p>Attention, la lentille frontale est bombée ("Bulb"), donc vous ne pouvez pas visser de filtres ND classiques. Il faut un système de porte-filtre arrière ou spécialisé.</p>
`
    }
};

async function updateDescriptions() {
    console.log('\\n🚀 Starting SEO Optimization for LENSES...\\n');
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

    console.log(`\\n✅ ${successCount} lens products optimized!\\n`);
}

updateDescriptions();
