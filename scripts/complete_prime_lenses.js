/**
 * Optimisation SEO Prime Lenses (Focales Fixes)
 * Expert Content: Bokeh & Low Light Masters
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const UPDATES = {

    // --- 35MM (Reportage & Polyvalence) ---
    'sony-35mm-gm': {
        pros: ["Le 35mm f/1.4 le plus compact du marché", "Piqué d'un autre monde (G Master)", "Moteurs XD ultra rapides"],
        cons: ["Cher (Qualité GM)", "Focus breathing léger (mais corrigé par les boîtiers récents)"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Sony FE 35mm f/1.4 GM a redéfini ce qui est possible. Avant lui, un 35mm f/1.4 de haute qualité était gros et lourd (coucou Sigma Art ancienne génération). Sony a réussi à faire tenir une qualité optique parfaite dans un corps qui tient dans la main. C'est l'objectif de reportage ultime.</p>

<h2>Pour qui est cet objectif ?</h2>
<ul>
    <li><strong>Photographes de Mariage :</strong> C'est la focale à tout faire, du portrait ambiance à la soirée dansante.</li>
    <li><strong>Vidéastes :</strong> Compact, léger sur un gimbal, et lumineux.</li>
</ul>
`
    },
    'sigma-35mm-art': {
        pros: ["Le look 'Art' (contraste et piqué)", "Moins cher que le Sony GM", "Construction solide"],
        cons: ["Bien plus lourd et gros que le Sony GM", "Autofocus un poil moins nerveux"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Sigma 35mm f/1.4 DG DN Art est la version moderne conçue pour les hybrides. Il garde ce qui a fait la légende de la série Art : une netteté chirurgicale et un contraste marqué qui donne du "pop" aux images. C'est l'alternative intelligente au GM pour ceux qui acceptent un peu plus de poids.</p>
`
    },

    // --- 50MM (Standard & Portrait) ---
    'sony-50mm-gm': {
        pros: ["Ouverture f/1.2 (Lumière extrême)", "Plus petit que le Canon f/1.2", "Bokeh crémeux à souhait"],
        cons: ["Très cher", "Demande une mise au point précise à f/1.2"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Sony FE 50mm f/1.2 GM est une démonstration de force. Ouvrir à f/1.2 avec un autofocus qui accroche l'œil instantanément était un rêve il y a 10 ans. Sony l'a fait. C'est l'objectif qui transforme n'importe quel arrière-plan banal en une aquarelle floue artistique.</p>

<h2>Analyse Technique Approfondie</h2>
<p>Les lentilles XA (Extreme Aspherical) garantissent que les ronds de bokeh sont parfaitement circulaires, sans effet "oignon" (onion ring) disgracieux.</p>
`
    },
    'canon-rf-50mm-stm': {
        pros: ["Le 'Nifty Fifty' moderne", "Minuscule et léger", "Prix cadeau"],
        cons: ["Moteur STM un peu bruyant (audible en vidéo calme)", "Pas de stabilisation (compte sur le boîtier)"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Canon RF 50mm f/1.8 STM est l'objectif que tout possesseur de Canon DOIT avoir. Il coûte une fraction du prix des autres, mais il délivre une image lumineuse et un flou d'arrière-plan très pro. C'est le meilleur rapport qualité/prix de tout le catalogue Canon.</p>
`
    },

    // --- 85MM (Portrait Roi) ---
    'sony-85mm-f18': {
        pros: ["Le meilleur rapport qualité/prix Sony", "Piqué excellent dès f/1.8", "Autofocus silencieux"],
        cons: ["Pas de bague d'ouverture", "Bokeh un peu moins crémeux que le GM"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Sony FE 85mm f/1.8 est souvent cité comme "l'objectif que Sony a oublié de vendre cher". Il est compact, léger, ultra-rapide, et pique fort. Pour le portrait, c'est un no-brainer absolu si vous ne voulez pas dépenser le triple pour le GM.</p>
`
    },
    'sigma-85mm-art': {
        pros: ["Designed for Mirrorless (DN)", "Taille réduite (rien à voir avec l'ancien reflex)", "Bokeh Sigma signature"],
        cons: ["Distorsion en coussinet (corrigée auto par le boîtier)", "Pas de stabilisation optique"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Sigma 85mm f/1.4 DG DN Art est une merveille. Sigma a tout repris à zéro pour cette version "DN". Il est beaucoup plus petit que l'ancienne version reflex, tout en améliorant la qualité optique. C'est le concurrent direct et sérieux du Sony 85 GM, souvent préféré pour son rendu des peaux.</p>
`
    },

    // --- 24MM (Large & Lumineux) ---
    'sony-24mm-gm': {
        pros: ["Le roi de l'Astrophoto", "Coma inexistant dans les coins", "Léger comme une plume pour un f/1.4"],
        cons: ["Vignetage marqué à f/1.4", "Focus breathing visible"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Sony FE 24mm f/1.4 GM a choqué tout le monde à sa sortie par sa taille. Comment ont-ils fait ? C'est l'objectif grand-angle lumineux ultime. En vidéo, sur un gimbal, il donne ce look "cinéma grand angle" avec un flou d'arrière-plan que les zooms f/2.8 ne peuvent pas atteindre.</p>

<h2>Analyse Technique Approfondie</h2>
<p>Il est particulièrement prisé des astrophotographes car il ne déforme pas les étoiles dans les coins de l'image (Coma correction), ce qui est rarissime.</p>
`
    }
};

async function updateDescriptions() {
    console.log('\\n🚀 Starting SEO Optimization for PRIME LENSES...\\n');
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

    console.log(`\\n✅ ${successCount} prime lens products optimized!\\n`);
}

updateDescriptions();
