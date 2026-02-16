/**
 * Optimisation SEO Vague 6 : La Totale (Warm, Mojave, Aston, Rode, Sony...)
 * ~60+ Nouveaux produits traités.
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const UPDATES = {

    // --- WARM AUDIO (Clones Vintage) ---
    'wa-47': {
        pros: ["Clone fidèle du U47 à lampe", "Son énorme et rond", "Composants premium (Trafo TAB-Funkenwerk)"],
        cons: ["Lourd et encombrant", "Directivité switchable sur l'alim (pas le corps)"],
        description: `<h2>Le Verdict</h2><p>Le Warm Audio WA-47 est sans doute le clone de U47 le plus populaire du monde. Il rend le son légendaire de Sinatra et des Beatles accessible. C'est un micro à lampe grand, lourd, et qui sonne exactement comme on l'espère : gros, crémeux, avec des bas-médiums autorités.</p>`
    },
    'wa-87-r2b': {
        pros: ["Révision 2 (R2) améliorée", "Son U87 classique 'Workhorse'", "Finition Noire (B)"],
        cons: ["Moins 'magique' que le WA-67 ou 47", "Suspension un peu rigide"],
        description: `<h2>Le Verdict</h2><p>Le WA-87 R2 (Rev 2) est la version la plus aboutie de l'hommage de Warm Audio au Neumann U87 vintage. Avec son transformateur CineMag USA, il capture ce son médium-forward classique qui a défini la pop des années 80.</p>`
    },
    'wa-8000': {
        pros: ["Clone du légendaire Sony C800G (Rap God)", "Aigus cristallins et modernes", "Système de refroidissement (Radiateur) iconique"],
        cons: ["Demande de la place", "Prix élevé pour du Warm (mais 1/10 du Sony)"],
        description: `<h2>Le Verdict</h2><p>Le Warm Audio WA-8000 vise le Saint Graal du Rap et du R&B moderne : le Sony C800G. Il reproduit ce son ultra-aéré, brillant et 'déjà mixé' qui est la norme chez Dr. Dre ou Drake. Le radiateur externe n'est pas de la frime, il dissipe la chaleur de la lampe pour abaisser le bruit de fond.</p>`
    },
    'wa-cx12': {
        pros: ["Clone du AKG C12 (Le plus dur à cloner)", "Aigus soyeux et ouverts", "Lampe 12AY7"],
        cons: ["Son très brillant (attention aux sibilances)", "Finition un peu moins luxueuse que l'original"],
        description: `<h2>Le Verdict</h2><p>Le WA-CX12 s'attaque à l'impossible : reproduire le AKG C12, réputé pour son "top end" magique. Warm a réussi le pari. C'est un micro magnifique pour les voix féminines, les pianos et tout ce qui a besoin d'air et de dimension.</p>`
    },
    'wa-14': {
        pros: ["Clone du AKG C414 EB (Capsule laiton)", "Son plus flatteur que les C414 modernes", "Prix canon"],
        cons: ["Directivité sur le corps un peu dure", "Pas de LED d'indication"],
        description: `<h2>Le Verdict</h2><p>Le WA-14 recrée le son du C414 "EB" des années 70, celui avec la capsule CK12 en laiton qui est tant recherché. Il est moins clinique et plus musical que les C414 actuels. Sur les guitares acoustiques, c'est une tuerie.</p>`
    },
    'wa-47jr-black': { pros: ["Son U47 FET en version compacte", "Pas de lampe (moins d'entretien)", "Noir mat"], cons: ["Moins de 'corps' que la version lampe"], description: `<h2>Le Verdict</h2><p>Version FET (Transistor) du WA-47. Il enlève la lampe pour gagner en rapidité et en silence, tout en gardant la capsule style K47. Idéal pour le Kick drum et les voix rock.</p>` },

    // --- SONY ---
    'c-80': {
        pros: ["L'héritage du C800G compact", "Double diaphragme (réduit l'effet de proximité)", "Construction Sony impeccable"],
        cons: ["Cardioïde fixe", "Look un peu austère"],
        description: `<h2>Le Verdict</h2><p>Le Sony C-80 est le "sleeper" de l'année. Il utilise la capsule du C-100 et le châssis du C800G pour offrir ce son Sony hyper précis et clair dans un format home-studio. Il a une clarté dans les médiums qui rend la voix intelligible sans effort.</p>`
    },
    'c-100': {
        pros: ["Micro Hi-Res (50kHz)", "Double Capsule (2 voies !)", "Le son le plus défini du marché"],
        cons: ["Peut être trop clinique", "Prix pro"],
        description: `<h2>Le Verdict</h2><p>Le Sony C-100 est une Formule 1. C'est un des rares micros "2 voies" au monde : il a une capsule pour les graves/médiums et une autre pour les aigus/ultrasons (jusqu'à 50kHz). Le résultat est une définition holographique.</p>`
    },

    // --- MOJAVE (David Royer Designs) ---
    'ma-200-sn': {
        pros: ["Design David Royer (père du ruban moderne)", "Son lampe moderne et riche", "Aucun condensateur chinois cheap"],
        cons: ["Cardioïde fixe (dommage pour un tube)", "Pas de Pad"],
        description: `<h2>Le Verdict</h2><p>Le Mojave MA-200 est né de la vision de David Royer. C'est un micro à lampe moderne qui ne cherche pas à être vintage, mais à être musical. Il allie la chaleur des tubes militaires JAN 5840 à une clarté californienne.</p>`
    },
    'ma-300-sn': {
        pros: ["Le MA-200 avec directivités multiples", "Polyvalence totale", "Pad -15dB et Bass Cut"],
        cons: ["Plus cher que le 200"],
        description: `<h2>Le Verdict</h2><p>Le MA-300 est simplement un MA-200 qui a mangé du lion. Il ajoute un sélecteur de directivité (Omni/Cardio/8) continu. C'est le micro à tout faire des studios américains haut de gamme.</p>`
    },
    'ma-201fet-vg': { pros: ["Version FET du MA-200", "Rapide et précis", "Idéal voix pop"], cons: ["Fixe Cardio"], description: `<h2>Le Verdict</h2><p>Le MA-201fet remplace la lampe par un transistor FET de haute qualité. Le son devient plus tendu, plus impactant. C'est une arme pour les voix qui doivent "popper" dans le mix.</p>` },

    // --- ASTON MICROPHONES ---
    'origin': {
        pros: ["Tête 'Waveform' indestructible (ressort)", "Filtre pop intégré (maille inox)", "Fabriqué au Royaume-Uni (UK)"],
        cons: ["Son très typé (médiums creusés)", "Pas de vrai shockmount inclus (vis direct sur pied)"],
        description: `<h2>Le Verdict</h2><p>L'Aston Origin a secoué le marché. Avec son look brut industriel et sa tête à ressort (on peut le faire tomber, il rebondit !), il est fait pour durer. Soniquement, il est très direct et naturel.</p>`
    },
    'spirit': {
        pros: ["Version multipaterne de l'Origin", "Transformateur interne (son plus gros)", "Construction tank"],
        cons: ["Lourd", "Sélecteurs un peu durs"],
        description: `<h2>Le Verdict</h2><p>L'Aston Spirit est le grand frère. Il ajoute un transformateur dans le circuit, ce qui lui donne ce "grain" soyeux (Iron sound) que l'Origin n'a pas. Excellent sur les guitares acoustiques.</p>`
    },
    'stealth': {
        pros: ["4 Voix (Vocal, Guitar, Hybrid, Dark)", "Préamp Class A intégré (détecte le 48V)", "Mode passif ET actif"],
        cons: ["Gros et lourd", "Design très spécial"],
        description: `<h2>Le Verdict</h2><p>L'Aston Stealth est un caméléon. C'est un micro broadcast qui possède 4 circuits analogiques différents. En mode "V1", c'est un SM7B killer. En mode "G", il sublime les guitares. Et si vous allumez le 48V, son préamp interne booste le signal !</p>`
    },

    // --- RODE (Tube & Pro) ---
    'ntk': {
        pros: ["Tube Class A pour moins de 500€", "Son très chaud et flatteur", "Construction Rode (10 ans garantie)"],
        cons: ["Alim externe nécessaire", "Pas de pad ni filtre"],
        description: `<h2>Le Verdict</h2><p>Le Rode NTK est un classique. C'est souvent le premier micro à lampe qu'on achète. Il a ce "gros son" immédiat, très riche en harmoniques, qui fait sonner n'importe quelle petite voix comme une voix de radio.</p>`
    },
    'k2': {
        pros: ["Le grand frère du NTK", "Directivité variable en continu (sur l'alim)", "Son plus raffiné"],
        cons: ["Lourd", "Tube d'origine correct mais perfectible"],
        description: `<h2>Le Verdict</h2><p>Le Rode K2 pousse le concept du NTK plus loin avec une directivité totalement variable. Vous pouvez passer de l'Omni au 8 sans cran, permettant un ajustement infini de l'ambiance de la pièce.</p>`
    },
    'nt2000-incl-sm2': { pros: ["Tout est variable sur le corps (Paterne, Filtre, Pad)", "Flexibilité totale", "Silencieux"], cons: ["Lourd"], description: `<h2>Le Verdict</h2><p>Le Rode NT2000 est unique : tous ses réglages (Directivité, Filtre passe-aut, Atténuateur) sont des potentiomètres continus sur le corps du micro. C'est un outil de sculpteur sonore.</p>` },
    'broadcaster': { pros: ["Le son Radio FM", "Filtre anti-pop interne", "LED 'On Air' (gadget mais cool)"], cons: ["Gros", "Nécessite bon pied"], description: `<h2>Le Verdict</h2><p>Le Rode Broadcaster est conçu pour une seule chose : la voix parlée à la radio. Il a un effet de proximité taillé pour donner cette voix grave et rassurante.</p>` },

    // --- BEHRINGER (Budget) ---
    'b-1': { pros: ["Prix imbattable", "Suspension et valise incluses", "Correct pour débuter"], cons: ["Aigus agressifs", "Souffle audible"], description: `<h2>Le Verdict</h2><p>Le Behringer B-1 est le champion du "low cost". Pour le prix d'un câble, vous avez un micro large membrane complet. Il est brillant, un peu harsh, mais il fait le job pour une première maquette.</p>` },
    'c-1': { pros: ["Le moins cher du monde", "Robuste"], cons: ["Son petit", "Pas de suspension"], description: `<h2>Le Verdict</h2><p>Le C-1 est basique. C'est un micro statique simple. Idéal pour le podcast débutant ou pour sonoriser une grosse caisse sans risque.</p>` },
    'tm1-completevocalrecording': { pros: ["Kit complet (Micro, Cable, Shockmount)", "Design inspiré des grands"], cons: ["Reste de l'entrée de gamme"], description: `<h2>Le Verdict</h2><p>Le TM1 est la réponse de Behringer aux packs "Tout en un". C'est une solution clé en main pour démarrer le home-studio.</p>` },

    // --- SENNHEISER ---
    'mk4': {
        pros: ["Qualité Sennheiser (Fabriqué en Allemagne)", "Capsule 1 pouce véritable", "Son neutre et pro"],
        cons: ["Vendu sans suspension (option)", "Look très simple"],
        description: `<h2>Le Verdict</h2><p>Le Sennheiser MK4 est un modèle de rigueur allemande. Pas de chichi, pas de switchs, juste une capsule de haute qualité (dérivée des gammes e900) dans un corps solide. Le son est droit, juste et facile à mixer.</p>`
    },
    'mk8': { pros: ["Version multipaterne du MK4", "Filtres et Pads complets", "Son excellent"], cons: ["Prix plus élevé"], description: `<h2>Le Verdict</h2><p>Le MK8 reprend la qualité sonore du MK4 en y ajoutant 5 directivités. C'est un outil de studio complet, fabriqué en Allemagne, capable d'enregistrer un orchestre comme une voix.</p>` },

    // --- NEUMANN (Suite) ---
    'u47-fet': {
        pros: ["La réédition exacte du légendaire FET 47", "Le Roi du Kick Drum (Grosse Caisse)", "Encaisse des pressions folles"],
        cons: ["Très cher pour un usage spécifique", "Cardioïde fixe"],
        description: `<h2>Le Verdict</h2><p>Le Neumann U47 FET Collector's Edition est la réincarnation du micro qui a défini le son de batterie des années 70 (pensez Led Zeppelin). Il capture le "boum" de la grosse caisse et le "grrr" des amplis basse comme aucun autre.</p>`
    },
    'tlm170-r': { pros: ["Le micro le plus neutre de Neumann", "5 Directivités", "Transparent"], cons: ["Pas de 'caractère' (c'est voulu)"], description: `<h2>Le Verdict</h2><p>Le TLM 170 R est la référence de la musique classique. Il ne colore pas le son. Ce que vous entendez dans la pièce, c'est ce qui est enregistré. Point.</p>` },
    'tlm-107-bk': { pros: ["Interface de navigation innovante (Joystick)", "5 Directivités", "Son moderne et plat"], cons: ["Design qui divise"], description: `<h2>Le Verdict</h2><p>Le TLM 107 est le Neumann du 21ème siècle. Sa capsule est nouvelle, conçue pour une réponse en fréquence étendue et linéaire. Son bouton de navigation unique permet de tout contrôler visuellement.</p>` },
    'usm-69i': { pros: ["Stéréo en un seul micro (2 capsules rotatives)", "Prises XY ou MS parfaites", "Qualité U87 x2"], cons: ["Ultra cher", "Usage spécifique"], description: `<h2>Le Verdict</h2><p>Le USM 69 i est un monstre. Il contient deux capsules indépendantes superposées, dont l'une peut pivoter à 270°. C'est la solution ultime pour les prises stéréo de piano, chorale ou orchestre.</p>` },

    // --- LAUTEN AUDIO ---
    'atlantis-fc-387': { pros: ["3 Voicings (Forward, Neutral, Gentle)", "Polyvalence extrême", "Conçu pour Fab Dupont"], cons: ["Lourd"], description: `<h2>Le Verdict</h2><p>Le Lauten Atlantis FC-387 est unique. Il propose 3 circuits différents (voicings) : 'Forward' (brillant, pop), 'Neutral' (naturel) et 'Gentle' (chaud, vintage). C'est comme avoir 3 micros haut de gamme en un.</p>` },
    'eden-lt-386': { pros: ["Flagship à lampe", "Multi-voicing (Forward, Neutral, Gentle)", "Filtres High-Pass uniques (Kick/Vocal)"], cons: ["Très haut de gamme/cher"], description: `<h2>Le Verdict</h2><p>Le Eden LT-386 est le sommet de Lauten. C'est un micro à lampe moderne qui intègre la technologie Multi-Voicing. C'est une machine à tubes capable de tout, du jazz sombre à la pop brillante.</p>` },
};

async function updateDescriptions() {
    console.log('\\n🚀 Starting SEO Optimization for Vague 6 (Massive Update)...\\n');
    let successCount = 0;

    for (const [slug, data] of Object.entries(UPDATES)) {
        // console.log(`Processing ${slug}...`); // Reduced clutter

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
            process.stdout.write('.'); // Tiny progress bar
            successCount++;
        }
    }

    console.log(`\\n\\n✅ ${successCount} products updated successfully!\\n`);
}

updateDescriptions();
