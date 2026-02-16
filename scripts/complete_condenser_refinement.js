/**
 * Optimisation SEO Vague 7 : Refinement (Upgrade to Max Quality)
 * The user requested these specific items again.
 * Previous descriptions might have been too short in the "Massive" batch.
 * Objective: 100% Completeness. Deep content.
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const UPDATES = {
    'wa-47f': {
        pros: ["Le son U47 FET authentique pour la moitié du prix", "Encaisse 147dB SPL (Indestructible)", "Parfait pour Kick et Basse"],
        cons: ["Assez lourd", "Cardioïde fixe (comme l'original)"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Warm Audio WA-47F est une récréation fidèle du Neumann U47 FET, un micro de légende connu pour une chose précise : c'est "Le" son de la grosse caisse (Kick Drum) des années 70 et 80. Contrairement à son grand frère à lampe, le FET est rapide, solide et encaisse des pressions acoustiques démentielles.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Batteurs et Ingés Son :</strong> Placez-le devant la peau de résonance du Kick. C'est le son "Boum" instantané.</li>
    <li><strong>Chanteurs Rock :</strong> Pour les voix hurlées qui saturent les autres micros.</li>
</ul>

<h2>Analyse Technique Approfondie</h2>
<p>Il utilise une reproduction de la capsule K47 et un transformateur TAB-Funkenwerk américain. Ce transfo est la clé : il apporte une saturation harmonique subtile quand on le pousse, donnant du "gras" au son.</p>
`
    },
    'tm1-completevocalrecording': {
        pros: ["Pack Tout-en-un (Micro, Shockmount, Cable, Pop Filter)", "Prix Behringer (Imbattable)", "Capsule 1 pouce plaquée or"],
        cons: ["Bruit de fond moyen (20dB)", "Aigus un peu agressifs"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Behringer TM1 n'est pas juste un micro, c'est un starter pack. Behringer a visé une esthétique très moderne et épurée. C'est une excellente alternative aux micros USB pour ceux qui veulent commencer avec une vraie interface audio XLR.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Débutants complets :</strong> Vous avez tout dans la boîte pour enregistrer votre première chanson.</li>
    <li><strong>Podcasteurs Budget :</strong> Un look pro à la caméra pour un prix minime.</li>
</ul>
`
    },
    'wa-47jr-se': {
        pros: ["Version Silver (SE) élégante", "3 Directivités (Omni, Cardio, 8)", "Circuit FET sans transfo (Rapide et propre)"],
        cons: ["Moins de caractère 'vintage' que le WA-47F", "Suspension un peu rigide"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Warm Audio WA-47jr SE (Silver Edition) est la version sans transformateur du 47. Pourquoi ? Pour offrir un son plus moderne et plus rapide. Il garde la capsule de style K47 (chaude et ronde) mais avec une électronique qui ne colore pas le signal. C'est un caméléon.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Home-Studistes Polyvalents :</strong> Grâce à ses 3 directivités, vous pouvez tout faire : voix, guitare, duos, room.</li>
</ul>
`
    },
    'spirit': {
        pros: ["Transformateur intégré (Iron Sound)", "Look Industriel Indestructible", "Multipaterne"],
        cons: ["Lourd (demande un bon pied)", "Sélecteurs durs à manipuler"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>L'Aston Spirit est le grand frère musclé de l'Origin. La différence majeure ? Il intègre un transformateur audio dans le circuit. Cela change tout : le son est plus dense, plus soyeux, avec des graves plus harmonieux ("Iron sound"). C'est un micro qui a du caractère et qui rivalise avec des modèles à 1000€.</p>

<h2>Analyse Technique Approfondie</h2>
<p>La tête en maille d'acier inoxydable est une signature Aston : elle fait office de filtre anti-pop et de cage de Faraday. Vous pouvez littéralement enfoncer la tête, elle reprendra sa forme (technologie Waveform).</p>
`
    },
    't1': {
        pros: ["Capsule Titane (Réponse ultra-rapide)", "Attaque percussive incroyable", "Cardioïde fixe (Simple et efficace)"],
        cons: ["Peut être trop brillant sur certaines voix", "Pas de multipaterne"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le sE Electronics T1 est un spécialiste de la vitesse. Sa capsule est recouverte de Titane (au lieu d'or). Le titane est plus rigide et léger, donc la membrane bouge plus vite. Résultat : les transitoires (le "clac" de la batterie, le "picking" de la guitare) sont capturés avec une précision absolue, sans le flou des micros classiques.</p>
`
    },
    'u-47': {
        pros: ["Le Roi des Micros (Toutes catégories)", "Lampe VF14K + Capsule M7", "Le son le plus copié de l'histoire"],
        cons: ["Le prix d'un studio complet", "Demande de l'entretien"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Telefunken U47. Il n'y a pas grand-chose à dire qui n'a pas été écrit. C'est le son de Frank Sinatra, des Beatles, de Michael Jackson. C'est le micro qui a défini ce qu'est une "belle voix" dans la culture pop. Il possède une autorité dans les bas-médiums (le "Chest", la poitrine) qu'aucun autre micro n'égale.</p>

<h2>Analyse Technique Approfondie</h2>
<p>Ce modèle est la reconstitution fidèle par Telefunken Elektroakustik USA. Il utilise une lampe VF14K (substitut moderne et stable de la VF14 introuvable) et un transformateur BV8 géant. C'est gros, c'est lourd, c'est magique.</p>
`
    },
    'c314': {
        pros: ["La vraie capsule C414 XLS à double diaphragme", "4 Directivités", "LED de surcharge"],
        cons: ["Corps un peu 'plastique' comparé au C414", "Moins d'options de filtres que le C414"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>L'AKG C314 est le "Sweet Spot" de la gamme AKG. Il coûte bien moins cher que le C414, mais contrairement au C214, il utilise la VRAIE capsule à double diaphragme. Cela signifie que vous avez accès aux directivités Omni et Figure-8, et que la réponse sonore est identique au C414 XLS. C'est la meilleure affaire chez AKG.</p>
`
    },
    'k2': {
        pros: ["Directivité Variable en CONTINU (Unique)", "Son à lampe riche et large", "Faible bruit pour un tube (10dBA)"],
        cons: ["Lourd et encombrant", "Lampe d'origine souvent changée par les puristes"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Røde K2 est un micro à lampe qui offre une fonctionnalité rare même sur des micros à 5000€ : la directivité variable en continu depuis l'alimentation. Vous pouvez tourner le bouton pour passer doucement de l'Omni au Cardioïde puis au Figure-8, en t'arrêtant n'importe où entre les deux. Cela permet d'ajuster l'ambiance de la pièce avec une précision chirurgicale.</p>
`
    },
    'broadcaster': {
        pros: ["Le standard Radio en Australie", "Optimisé pour la voix (effet de proximité taillé)", "Indicateur 'On Air' (Le détail qui tue)"],
        cons: ["Très sensible aux plosives (Filtre externe conseillé malgré l'interne)", "Fixation uniquement par le bas"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Røde Broadcaster porte bien son nom. C'est un micro large membrane à capture frontale conçu pour les stations de radio. Il a une réponse en fréquence taillée pour donner cette voix "Profonde et rassurante" typique des DJs FM. Il a une LED "On Air" intégrée qui peut être pilotée par une console broadcast.</p>
`
    },
    'usm-69i': {
        pros: ["Deux micros U87 en un", "Tête rotative pour XY/MS", "L'outil stéréo ultime"],
        cons: ["Prix astronomique", "Nécessite deux préamplis et un câble 5 broches"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Neumann USM 69 i est un monstre sacré. Imaginez deux capsules de U87 Ai empilées l'une sur l'autre, et imaginez que vous pouvez tourner la capsule du haut. C'est ce qu'est le USM 69 i. C'est le standard mondial pour l'enregistrement stéréo "coïncident" (XY, MS, Blumlein) de pianos, d'orchestres ou de chœurs. Une cohérence de phase parfaite.</p>
`
    },
    // B-STOCKS REFINEMENT (Ensure full length)
    'pure-tube-studio-set-b-stock': {
        pros: ["Silence absolu (7dBA) - Record mondial pour une lampe", "Chaleur sans les défauts du vintage", "Set complet"],
        cons: ["Cardioïde fixe", "Alim externe (inévitable pour du tube)"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>(Version B-Stock). Le Lewitt Pure Tube marque une rupture technologique. Traditionnellement, les micros à lampe sont bruyants (souffle). Le Pure Tube utilise un circuit révolutionnaire sans semi-conducteurs sur le trajet du signal, offrant la chaleur harmonique des tubes mais avec un bruit de fond quasi nul (7 dBA). C'est le meilleur des deux mondes.</p>

<h2>Analyse Technique Approfondie</h2>
<p>Lewitt a supprimé les condensateurs de liaison et les semi-conducteurs qui dégradent le signal. Le résultat est un son pur, énorme, qui prend l'EQ et la compression massive sans faire remonter de souffle.</p>
`
    },
    'ela-m-251e': {
        pros: ["Le plus beau son du monde (Consensus)", "Capsule CK12 + Tube 6072a", "Fait main aux USA"],
        cons: ["Prix ultra-premium", "Crainte du vol"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Telefunken ELA M 251E n'est pas un micro, c'est une expérience religieuse pour un ingénieur du son. Reconnue comme l'une des plus belles réussites acoustiques du 20ème siècle, cette réédition fidèle capture cet "air" magique dans les aigus que l'on entend sur les disques d'or. C'est doux, c'est brillant, mais jamais agressif.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Les voix Diva :</strong> C'est le micro de Celine Dion, Adele, et des plus grandes voix qui ont besoin de capturer toute la texture sans dureté.</li>
</ul>
`
    },
    'lct-441-flex-b-stock': {
        pros: ["8 Directivités dans un format compact", "Son Lewitt moderne", "Excellent rapport qualité/prix"],
        cons: ["Interface sur le micro un peu chargée", "Suspension un peu plastique"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>(Version B-Stock). Le Lewitt LCT 441 FLEX porte bien son nom. C'est probablement le micro large membrane le plus compact offrant 8 directivités (Omni, Cardio, Wide Cardio, Supercardio, Figure-8 + les inversés). Dans un tout petit corps, vous avez un outil d'exploration sonore infini. Idéal pour ceux qui veulent comprendre l'acoustique.</p>
`
    },
    'nt1-5th-generation-sil-b-stock': {
        pros: ["Connectivité Hybride XLR/USB", "32-bit Float (Impossible de clipper)", "Bruit de fond 4dBA (Le plus silencieux du monde)"],
        cons: ["Le 32-bit ne marche qu'en USB", "Design inchangé depuis des années"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>(Version B-Stock, Silver). Le Rode NT1 5th Gen a changé la donne. C'est le premier micro "fusion" studio qui intègre à la fois une sortie XLR classique et une sortie USB-C avec conversion 32-bit Float. En 32-bit, vous ne pouvez littéralement pas saturer l'enregistrement numérique, peu importe le niveau d'entrée. C'est une sécurité totale pour les prises uniques.</p>
`
    },
    'u87-ai-b-stock': {
        pros: ["L'étalon or du studio", "Médiums caractéristiques", "Valeur sûre"],
        cons: ["Prix élevé", "Son 'connu' (pas d'originalité)"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>(Version B-Stock). Le Neumann U87 Ai est le mètre étalon. Quand on teste un micro, on le compare au U87. Pourquoi ? Parce qu'il a une signature fréquentielle dans les médiums qui fait que la voix s'intègre instantanément dans le mixage sans se battre avec les instruments. C'est le choix de la sécurité et de la qualité professionnelle.</p>

<h2>Analyse Technique Approfondie</h2>
<p>Il possède 3 directivités (Omni, Cardio, 8). L'électronique moderne "Ai" a un niveau de sortie plus élevé que l'ancien "i", ce qui le rend moins exigeant sur les préamplis.</p>
`
    },
    'procaster-b-stock': {
        pros: ["Son Broadcast riche", "Rejet excellente", "Filtre pop interne"],
        cons: ["Besoin de gain", "Pas de brillance statique"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>(Version B-Stock). Le Rode Procaster est un pur-sang du broadcast. C'est un micro dynamique (comme le SM7B) qui offre une isolation exceptionnelle. Si vous enregistrez dans un bureau non traité avec un ventilateur d'ordinateur à côté, le Procaster sauvera votre prise. Il donne cette voix "Radio" immédiate.</p>
`
    }
};

async function updateDescriptions() {
    console.log('\\n🚀 Starting SEO Optimization for Vague 7 (Refinement)...\\n');
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
            console.log(`✅ Refined ${slug}`);
            successCount++;
        }
    }

    console.log(`\\n✅ ${successCount} products refined to Max Quality!\\n`);
}

updateDescriptions();
