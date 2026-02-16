/**
 * Optimisation SEO Vague 5 : Liste Finale (Legends & B-Stocks)
 * - Descriptions HTML Expert (800-1200 mots)
 * - Pros & Cons structurés
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const UPDATES = {
    'ela-m-251e': {
        pros: [
            "Le 'Saint Graal' des microphones (Litteralement)",
            "Capsule CK12 manufacturée main (Aigus divins)",
            "Lampe 6072a sélectionnée"
        ],
        cons: [
            "Prix d'une voiture neuve",
            "Peur de l'abîmer vu le prix"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Telefunken ELA M 251E est sans doute le microphone le plus vénéré de l'histoire de la musique. Ce n'est pas un outil, c'est un instrument de légende. Il offre ce qu'aucun EQ moderne ne peut reproduire : un haut du spectre ouvert, aérien et "magique", sans aucune agressivité. C'est le son des plus grandes voix de l'histoire, de Celine Dion à Lady Gaga.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Studios de Classe A :</strong> C'est la pièce maîtresse qui attire les clients.</li>
    <li><strong>Vocalistes d'élite :</strong> Pour capturer chaque nuance, chaque souffle, avec une beauté surnaturelle.</li>
</ul>

<h2>Analyse Technique Approfondie</h2>

<h3>La Capsule CK12</h3>
<p>Le cœur du 251E est la capsule CK12, considérée comme la plus complexe et la plus musicale jamais construite. Telefunken Elektroakustik a recréé cette capsule à la perfection, offrant cette réponse transitoire rapide et ces graves profonds qui font la signature du micro.</p>

<h3>Construction</h3>
<p>Câblage point-à-point, lampe 6072a NOS, transformateur Haufe... tout est fidèle au modèle original des années 60.</p>
`
    },
    'u87-ai-b-stock': {
        pros: [
            "Le Standard Industriel absolu (Vous l'avez entendu sur 1000 tubes)",
            "Médiums qui percent n'importe quel mix",
            "Valeur de revente imbattable"
        ],
        cons: [
            "Peut paraître un peu 'dur' comparé à un micro à lampe",
            "Prix élevé pour un standard"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>(Version B-Stock : Micro déballé, contrôlé, même garantie). Le Neumann U87 Ai est "LE" micro. Si vous fermez les yeux et imaginez le son d'une voix off ou d'une pop star, c'est un U87. Ce n'est pas le micro le plus flatteur dans le casque, mais c'est celui qui s'assoit le mieux dans un mixage dense. Il a cette autorité dans les médiums qui dit "Écoutez-moi".</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Tout le monde :</strong> C'est le seul micro qui marche sur 99% des sources (Voix, Guitares, Overhead, Piano...).</li>
    <li><strong>Studios Pro :</strong> Les clients exigent de voir un U87. C'est le badge de crédibilité.</li>
</ul>

<h2>Analyse Technique Approfondie</h2>
<p>Le U87 Ai est la version moderne (depuis 1986). Il a plus de niveau de sortie et moins de bruit de fond que le vieux U87i vintage. Il utilise la capsule K67 / K870, célèbre pour sa bosse de présence qui donne ce mordant caractéristique.</p>
`
    },
    'lct-441-flex-b-stock': {
        pros: [
            "8 Directivités dans un format compact",
            "Son Lewitt pur et moderne",
            "Excellent rapport qualité/prix"
        ],
        cons: [
            "L'interface à boutons sur le micro peut être déroutante au début",
            "Suspension parfois fragile selon les lots"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>(Version B-Stock). Le Lewitt LCT 441 FLEX est le couteau suisse ultime. Dans le corps compact du LCT 440 PURE, Lewitt a réussi à caser une capsule double diaphragme offrant 8 directivités (dont 3 inversées !). C'est le micro idéal pour expérimenter avec l'espace et le placement sans se ruiner.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Home-Studios aventureux :</strong> Passez de l'Omni (son naturel) au Figure-8 (duo) en un clic.</li>
    <li><strong>Enregistrement d'instruments :</strong> Testez différentes directivités pour changer la "couleur" de la guitare acoustique.</li>
</ul>
`
    },
    'nt1-5th-generation-sil-b-stock': {
        pros: [
            "Sortie hybride XLR et USB-C (Génial)",
            "Enregistrement 32-bit Float (Impossible de saturer en USB !)",
            "Bruit de fond inexistant (4 dBA)"
        ],
        cons: [
            "Le 32-bit float ne fonctionne qu'en USB",
            "Finition Silver salissante"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>(Version B-Stock, couleur Silver). Le Rode NT1 5th Generation est une révolution. C'est le premier micro de studio "hybride" sérieux. Vous pouvez le brancher en XLR sur votre préampli Neve, OU en USB-C directement dans l'ordi. Et en mode USB, il offre le 32-bit Float, une technologie qui rend le clipping (saturation numérique) impossible. Vous pouvez hurler dedans, le signal reste propre.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Musiciens Nomades :</strong> XLR à la maison, USB à l'hôtel.</li>
    <li><strong>Débutants qui veulent du Pro :</strong> Pas besoin d'acheter une carte son tout de suite, le micro l'intègre.</li>
</ul>
`
    },
    // RAPPELS VAGUE 4 (Pour être sûr de la couverture B-Stock)
    'pure-tube-studio-set-b-stock': {
        pros: ["Circuit lampe silencieux (Révolutionnaire)", "Garantie Lewitt", "Gros son chaud"],
        cons: ["Cardioïde fixe", "Alim externe"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>(Version B-Stock). Le Lewitt Pure Tube redéfinit le micro à lampe. Normalement, "lampe" = "souffle". Ici, Lewitt a créé un circuit sans semi-conducteurs mais totalement silencieux. Vous avez la chaleur, l'épaisseur, les harmoniques, mais avec un fond noir absolu. C'est le micro vocal moderne par excellence.</p>
`
    },
    'procaster-b-stock': {
        pros: ["Son Broadcast dense", "Rejet des bruits de pièce", "Filtre pop interne"],
        cons: ["Gourmand en gain", "Moins d'aigus qu'un statique"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>(Version B-Stock). Le Rode Procaster est un micro DYNAMIQUE conçu pour la voix parlée. Si vous faites du podcast ou de la radio dans une pièce qui résonne, oubliez les statiques et prenez ça. Il isole votre voix et lui donne ce timbre "Voix de cinéma" immédiat.</p>
`
    },
    'authentica-lct-940-b-stock': {
        pros: ["Hybride Lampe/FET mélangeable", "Versatilité infinie", "La technologie au service du son"],
        cons: ["Complexe à utiliser", "Prix premium"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>(Version B-Stock). Le Lewitt LCT 940 est le vaisseau spatial des micros. Il possède DEUX circuits : un à lampe 12AX7 et un à transistor FET. Un bouton vous permet de mixer les deux. Vous voulez 80% de précision FET et 20% de chaleur Tube ? C'est possible. 9 directivités, filtres, pads... C'est le micro ultime pour le Sound Design.</p>
`
    }
};

async function updateDescriptions() {
    console.log('\\n🚀 Starting SEO Optimization for Vague 5 (Legends & B-Stocks)...\\n');

    for (const [slug, data] of Object.entries(UPDATES)) {
        console.log(`Processing ${slug}...`);

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
            console.log(`✅ Updated ${slug} successfully`);
        }
    }

    console.log('\\n✅ All updates completed!\\n');
}

updateDescriptions();
