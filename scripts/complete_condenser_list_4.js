/**
 * Optimisation SEO Vague 4 : Liste Soyuz, Ehrlund, Lewitt, MXL...
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
    'pure-tube-studio-set-b-stock': {
        pros: [
            "Son à lampe SANS le bruit de fond (Silicon-based circuit)",
            "Garantie à vie Lewitt (incroyable)",
            "Son 'Hifi' moderne et énorme"
        ],
        cons: [
            "Pas de directivités multiples (Cardio fixe)",
            "L'alimentation externe est nécessaire"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>(Note : Ceci est une version B-Stock, donc déballée ou retour client, mais techniquement identique au neuf). Le Lewitt Pure Tube est une anomalie. C'est un micro à lampe conçu pour avoir... aucun bruit de fond. Zéro. Lewitt a créé un circuit révolutionnaire sans semi-conducteurs dans le chemin du signal audio, mais ultra-silencieux. C'est le son chaud des lampes, sans le souffle vintage.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Chanteurs Modernes :</strong> Qui veulent la chaleur d'un U47 mais la propreté d'une production Billie Eilish.</li>
    <li><strong>Voix Off :</strong> Le silence absolu (7 dBA) permet une compression extrême sans remontée de souffle.</li>
</ul>

<h2>Analyse Technique Approfondie</h2>
<p>La capsule 1 pouce est optimisée pour la voix (effet de proximité riche). Lewitt offre une "Garantie à vie" sur ce modèle, ce qui prouve leur confiance absolue dans la construction.</p>
`
    },
    'procaster-b-stock': {
        pros: [
            "Le son 'Radio FM' par excellence",
            "Insensible aux bruits de la pièce (Dynamique)",
            "Filtre anti-pop interne ultra-efficace"
        ],
        cons: [
            "Nécessite beaucoup de gain (Préamp puissant requis)",
            "Son un peu plus 'fermé' qu'un statique"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Attention : Le Rode Procaster est un micro DYNAMIQUE (pas à condensateur), conçu spécifiquement pour le broadcast et la voix parlée. C'est la réponse de l'Australie au SM7B. Il offre ce son radio dense, grave et autoritaire, tout en ignorant superbement l'acoustique médiocre de votre pièce.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Podcasteurs et Streamers :</strong> C'est LE choix si vous enregistrez dans une chambre ou un bureau non traité.</li>
    <li><strong>Voix Off Youtube :</strong> Pour ce son "narrateur de documentaire" immédiat.</li>
</ul>
`
    },
    'm-930-dark-bronze': {
        pros: ["Format miniature, Son géant", "Finition Dark Bronze discrète", "Silence absolu"],
        cons: ["Cardioïde fixe", "Peut sembler fragile (il ne l'est pas)"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Version "Dark Bronze" du M 930 vendu seul (hors set). Ce micro est la preuve que la taille ne compte pas. Il délivre un son large membrane complet, riche et détaillé, dans un corps qui tient dans le creux de la main. C'est la technologie moderne au service de la discrétion.</p>
`
    },
    'm-990-satin-nickel': {
        pros: ["Le Flagship Tube de Gefell", "Capsule M930 + Tube EF86", "Finition Satin Nickel classique"],
        cons: ["Prix élevé", "Alim externe"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>La version argentée (Satin Nickel) du M 990. C'est le mariage de la précision moderne (capsule M930) et de la luxure vintage (Lampe). Idéal pour ceux qui trouvent les micros modernes trop "cliniques" et les micros vintage trop "sales".</p>
`
    },
    'm-930-satin-nickel': {
        pros: ["Standard Broadcast allemand", "Format ultra-compact", "Son neutre et précis"],
        cons: ["Cardioïde fixe", "Look utilitaire"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Version "Satin Nickel" (Argent) du M 930 vendu seul. C'est le standard dans de nombreuses stations de radio allemandes pour une raison simple : il capture la voix avec une fidélité absolue sans occuper tout l'espace visuel devant l'animateur.</p>
`
    },
    'tlm-102': {
        pros: [
            "La porte d'entrée dans le son Neumann",
            "Taille compacte, son énorme",
            "Encaisse 144 dB SPL"
        ],
        cons: [
            "Pas de switchs (Pad/Cut)",
            "Suspension vendue séparément"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Neumann TLM 102 est le "Petit Prince" du studio. Plus compact et abordable que ses grands frères, il n'en sacrifie pas pour autant la qualité. Fabriqué en Allemagne, il offre un son équilibré, avec des aigus doux et une capacité à encaisser des volumes hallucinants (batterie, amplis). C'est le premier "vrai" Neumann de beaucoup d'ingénieurs.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Home-Studistes :</strong> Le badge Neumann sur votre bureau, avec le son qui va avec.</li>
    <li><strong>Voix Off :</strong> Sa taille réduite permet de lire le texte sans gêne.</li>
</ul>
`
    },
    'authentica-lct-940-b-stock': {
        pros: [
            "Le meilleur des deux mondes : Lampe ET Transistor (mélangeable !)",
            "Télécommande avec écran éclairé",
            "Polyvalence ultime (9 directivités)"
        ],
        cons: [
            "Prix premium",
            "Système complexe (câbles, alim, télécommande)"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Lewitt LCT 940 est un chef-d'œuvre d'ingénierie. C'est un micro hybride qui intègre DEUX circuits complets : un à lampe (chaud, riche) et un à transistor FET (clair, silencieux). Le génie ? Un potentiomètre vous permet de mixer les deux à volonté ! 50% Lampe, 50% FET ? Possible. C'est comme avoir 100 micros en un.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Studios Pro et Sound Designers :</strong> La palette sonore est infinie.</li>
    <li><strong>Chanteurs exigeants :</strong> On peut adapter le micro à chaque morceau (Ballade = Tube, Pop rapide = FET).</li>
</ul>
`
    },
    '1973-s': {
        pros: [
            "Son FET boutique fabriqué main en Russie",
            "Design industriel soviétique superbe",
            "Un 'Baby 017' abordable"
        ],
        cons: [
            "Pas de suspension dans la version standard",
            "Marque encore de niche (mais culte)"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Soyuz 1973 (Silver) est une déclaration d'amour aux années 70. Fabriqué à la main à Tula, en Russie, il offre ce son "mid-forward" organique et vivant qui manque cruellement aux micros chinois modernes. C'est un micro FET avec une âme, parfait pour sortir du lot.</p>
`
    },
    'nano': {
        pros: [
            "Capsule Triangulaire (Brevet Ehrlund) unique au monde",
            "Résonance quasi inexistante (Son ultra-naturel)",
            "Taille minuscule"
        ],
        cons: [
            "Très sensible et précis (ne pardonne pas)",
            "Fixation magnétique spéciale"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>L'Ehrlund NANO utilise une technologie que personne d'autre n'a : une membrane triangulaire (inspirée de l'aérospatiale). Pourquoi ? Pour casser les résonances naturelles des capsules rondes. Le résultat est un son d'une pureté et d'un réalisme effrayants. C'est comme s'il n'y avait pas de micro.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Instruments Acoustiques (Guitare, Violon) :</strong> Il capture les transitoires avec une fidélité absolue.</li>
</ul>
`
    },
    '017-tube': {
        pros: [
            "Le 'New Classic' : Rivalise direct avec le U47/U67",
            "Fabrication artisanale Russe (Comme une montre de luxe)",
            "Son énorme, tridimensionnel, légendaire"
        ],
        cons: [
            "Très cher",
            "Lourd"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Soyuz 017 TUBE est, pour beaucoup d'ingénieurs (dont Nigel Godrich de Radiohead), le futur classique. Il a détrôné les Neumann vintage dans bien des studios. Son son est indescriptiblement grand : des aigus soyeux qui ne saturent jamais, un bas énorme, une présence magique. C'est le son des hits modernes qui cherchent une âme.</p>
`
    },
    '1973-b': {
        pros: ["Finition Black (Noire) exclusive", "Même son organique que le Silver", "Robuste"],
        cons: ["Pas de suspension incluse", "Cardioïde fixe"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Version noire (Black) du Soyuz 1973. C'est le même micro FET fabriqué main, avec ce caractère "boutique" unique, mais dans une robe noire mate discrète et élégante. Parfait pour le rock et les setups sombres.</p>
`
    },
    '023-malfa-deluxe-ltd-edition': {
        pros: [
            "Édition Limitée 'Malfa' exclusive",
            "Capsule 'Bomblet' (Gros son ruban-esque)",
            "Coffret bois luxe et accessoires inclus"
        ],
        cons: [
            "Son typé (pas neutre)",
            "Collector (difficile à trouver)"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Soyuz 023 "The Bomblet" édition MALFA est une pièce de collection. Il utilise une capsule rare (inspirée des micros LOMO soviétiques) qui donne un son épais, crémeux, presque comme un micro à ruban mais avec le niveau d'un condensateur. C'est l'arme secrète pour les guitares électriques et les voix qui ont besoin de "gras".</p>
`
    },
    '017-fet': {
        pros: [
            "Le son de la capsule 017 sans la lampe (plus rapide)",
            "Alim 48V (plus pratique)",
            "Moins cher que la version Tube"
        ],
        cons: [
            "Un peu moins de 'magie' multidimensionnelle que le Tube",
            "Reste un investissement"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Soyuz 017 FET offre la même capsule légendaire faite main que le modèle Tube, mais avec un circuit à transistor. Le son est plus rapide, plus punchy, plus "in your face". C'est le choix idéal pour les voix pop/rap modernes qui doivent être ultra-précises tout en gardant du caractère.</p>
`
    },
    '2003a': {
        pros: [
            "Le joyau caché de MXL (Copie U87 vintage)",
            "Capsule large diaphragme de qualité",
            "Prix dérisoire pour le son"
        ],
        cons: [
            "Corps un peu léger/cheap",
            "Aigus parfois un peu sibilants (mais gérables)"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Ne jugez pas le MXL 2003a à son prix ou sa marque. C'est un secret de studio bien gardé. Sa capsule et son circuit sont conçus pour imiter la réponse d'un U87 vintage. Il offre des médiums détaillés et un son très "focus". Pour le prix, c'est une affaire incroyable.</p>
`
    },
    'mercury': {
        pros: [
            "Directivité VARIABLE en continu sur le corps (Unique)",
            "Son à lampe britannique soyeux",
            "Garantie à vie Sontronics"
        ],
        cons: [
            "Très lourd",
            "Alim externe requise"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Sontronics Mercury est un flagship à lampe magnifique. Sa particularité ? Le potentiomètre de directivité (Omni à 8 en passant par tout le reste) est situé SUR l'alimentation, permettant de sculpter l'espace sonore sans toucher au micro. Son très doux, très "anglais", parfait pour les voix délicates.</p>
`
    },
    '770': {
        pros: [
            "Spécialiste du RAP et des basses",
            "Gros boost dans les graves",
            "Look noir 'Badass'"
        ],
        cons: [
            "Trop coloré pour être polyvalent",
            "Aigus un peu harsh"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le MXL 770 est connu comme le "micro du Rap budget". Pourquoi ? Parce qu'il a une réponse en fréquence avec des basses gonflées et des aigus perçants. Cela donne tout de suite une voix "Radio/Mix Tape" sans avoir besoin d'EQ. C'est un micro à effet, et il le fait bien.</p>
`
    },
    '990': {
        pros: [
            "Le premier micro de millions de musiciens",
            "Look 'Champagne' sympa",
            "Pas cher du tout"
        ],
        cons: [
            "Petite capsule (son un peu fin)",
            "Bruit de fond audible"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le MXL 990 est le grand classique de l'ultra-entrée de gamme. Attention, sous son look de large membrane, c'est en réalité une petite capsule (format 3/4 pouce). Il offre un son correct pour démarrer, mais manque du corps et de la profondeur des vrais larges diaphragmes.</p>
`
    },
    't2': {
        pros: [
            "Capsule en TITANE (Réponse transitoire folle)",
            "Idéal pour percussions et attaques rapides",
            "Multipaterne complet"
        ],
        cons: [
            "Son très percussif (peut être dur sur les voix)",
            "Usage spécifique"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le sE Electronics T2 ("Titanium") est spécial. Sa capsule est pulvérisée au Titane (au lieu de l'Or). Le Titane étant plus rigide et léger, la membrane réagit beaucoup plus vite. Résultat : une capture des transitoires (attaques) phénoménale. C'est LE micro pour les percussions, les batteries et le slap bass.</p>
`
    },
    'mt-71-s-satin-nickel': {
        pros: [
            "Capsule M7 originale en version FET (Transistor)",
            "Précision Gefell + Caractère M7",
            "Bon rapport qualité/prix pour du Gefell"
        ],
        cons: [
            "Cardioïde fixe",
            "Moins 'magique' que la version lampe M92.1S"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Microtech Gefell MT 71 S offre la légendaire capsule M7 en PVC (la même que le U47) mais couplée à un circuit à transistor moderne et silencieux sans transformateur. C'est un micro de "soliste" par excellence, offrant une présence incroyable dans le mix avec une clarté technique parfaite.</p>
`
    },
    'sc-600': {
        pros: [
            "Multipaterne (Omni/Cardio) pour un prix dérisoire",
            "Filtre coupe-bas et Pad",
            "Construction métal"
        ],
        cons: [
            "Son un peu fin et brillant",
            "Composants budget"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le the t.bone SC 600 est l'upgrade logique du SC 400. Pour quelques euros de plus, vous gagnez l'Omnidirectionnel et les switches de pad/filtre. C'est l'outil d'apprentissage idéal pour comprendre comment la directivité change le son, ou pour enregistrer des chœurs en mode Omni avec un budget serré.</p>
`
    }
};

async function updateDescriptions() {
    console.log('\\n🚀 Starting SEO Optimization for Vague 4 (Boutique & Specials)...\\n');

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
