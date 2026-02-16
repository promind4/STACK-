/**
 * Optimisation SEO Vague 3 : Liste Spécifique Utilisateur (Gefell, Neumann, Telefunken...)
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
    'tg-microphone-type-l': {
        pros: [
            "Le son 'Abbey Road' accessible",
            "Même circuit principal que le grand TG",
            "Corps compact et robuste"
        ],
        cons: [
            "Pas de tape EQ ni d'alim externe (alimentation 48V)",
            "Moins de fonctionnalités que le modèle standard"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Chandler Limited TG Microphone Type L est la porte d'entrée abordable dans l'univers sonore légendaire d'EMI / Abbey Road. Il offre le cœur du son du grand frère "TG Microphone" (la même capsule, le même circuit principal basé sur la console TG12345) mais dans un format simplifié fonctionnant sur alimentation fantôme 48V. C'est le son du rock anglais des années 70, condensé.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Guitaristes Électriques :</strong> C'est une arme absolue sur les amplis guitare, apportant un mordant et une épaisseur uniques.</li>
    <li><strong>Petits Studios :</strong> Qui veulent la couleur Chandler sans le budget du modèle à alimentation externe.</li>
</ul>

<h2>Analyse Technique Approfondie</h2>

<h3>Signature Sonore</h3>
<p>Le Type L sonne "gros". Il a des médiums très solides et des aigus présents mais jamais agressifs, typiques des circuits à transistors (FET) de l'époque. Contrairement aux micros modernes souvent trop brillants, le Type L a une patine sonore qui rappelle les disques des Beatles ou de Pink Floyd. Il "tient" le mix sans effort.</p>

<h3>Simplification Intelligente</h3>
<p>Pour réduire le prix, Chandler a retiré l'alimentation externe (il utilise le 48V classique) et l'égaliseur NAB. Mais la capsule et le transistor FET sont identiques. C'est le même moteur dans une carrosserie plus simple.</p>
`
    },
    'x1a': {
        pros: [
            "Le moins cher des 'vrais' micros studio",
            "Atténuateur et Coupe-bas inclus (incroyable à ce prix)",
            "Châssis tout métal"
        ],
        cons: [
            "Bruit de fond plus élevé que le X1 S",
            "Capsule électret moins raffinée que la 'vraie' capsule du X1 S"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le sE Electronics X1 A est le micro qui tue le marché de l'occasion. Pourquoi acheter un vieux micro cabossé quand on peut avoir un X1 A neuf pour une bouchée de pain ? C'est le petit frère du X1 S, utilisant une technologie de capsule différente mais conservant la qualité de fabrication et les fonctionnalités pro.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Podcasteurs débutants :</strong> Un premier XLR parfait pour apprendre.</li>
    <li><strong>Musiciens fauchés :</strong> Vous pouvez enregistrer une démo entière avec, et ça sonnera bien.</li>
</ul>

<h2>Analyse Technique Approfondie</h2>
<p>Contrairement au X1 S qui a une capsule faite main, le X1 A utilise une capsule électret pré-polarisée plus simple. Le son est un peu moins "3D", mais reste très propre et défini. Et surtout, il garde les switchs -20dB et Low Cut, ce qui est unique à ce prix.</p>
`
    },
    'tf47': {
        pros: [
            "Le grain MId-Forward du U47 vintage",
            "Lampe 5840W et capsule style K47",
            "Gros son vocal autoritaire"
        ],
        cons: [
            "Prix élevé (mais moins qu'un U47 vintage)",
            "Lourd et imposant"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Telefunken TF47 est la réponse moderne au légendaire U47. Il vise à récréer ce son médium épais et percutant qui a défini la voix masculine dans la pop et le rock depuis 60 ans. Si vous cherchez de l'autorité et du poids, c'est celui qu'il vous faut.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Chanteurs Rock/Soul :</strong> Pour une voix qui s'assoit "dans" le mix avec solidité.</li>
    <li><strong>Contrebasse et Amplis Basse :</strong> Il capture le bas du spectre avec une richesse incroyable.</li>
</ul>

<h2>Analyse Technique Approfondie</h2>

<h3>Signature Sonore</h3>
<p>Le TF47 se concentre sur les bas-médiums. Il a des aigus doux ("rolled off") et des graves profonds. C'est l'anti-micro brillant. Il donne du corps aux voix fluettes et dompte les voix agressives.</p>
`
    },
    'tlm-102-bk': {
        pros: [
            "Le son Neumann authentique",
            "Finition Noire (BK) superbe et discrète",
            "Compact et facile à placer"
        ],
        cons: [
            "Pas de suspension incluse (pince simple)",
            "Pas de switchs sur le corps"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Neumann TLM 102 BK est techniquement identique au TLM 102 standard (nickel), mais dans une finition noire mate "Black" sublime. Cette version est souvent préférée pour la vidéo et le streaming car elle capte moins les reflets des lumières et se fait plus discrète à l'image.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Youtubers et Streamers :</strong> C'est le micro "pro" qui ne cache pas votre visage et ne brille pas sous les spots.</li>
    <li><strong>Home-Studios Design :</strong> Il s'intègre parfaitement dans les setups modernes "All Black".</li>
</ul>

<h2>Analyse Technique Approfondie</h2>
<p>Il conserve toutes les qualités du 102 : son équilibré, taille minuscule, capacité à encaisser 144 dB SPL. La grille noire intègre le même filtre anti-pop efficace.</p>
`
    },
    'saturn-2': {
        pros: [
            "Design Retro-Futuriste unique",
            "Polyvalence totale (9 directivités)",
            "Son 'Hifi' britannique"
        ],
        cons: [
            "Son look divise (on adore ou on déteste)",
            "Suspension un peu complexe"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Sontronics Saturn 2 ne ressemble à rien d'autre. Conçu au Royaume-Uni, ce micro multipaterne vise à être le centre de gravité de votre studio. Avec son look inspiré des années 50 et sa bague orbitale, il en jette. Mais le son est tout ce qu'il y a de plus sérieux : large, propre et détaillé.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Studios qui veulent impressionner :</strong> Les clients font toujours "Wow" en le voyant.</li>
    <li><strong>Prise d'ambiance et Piano :</strong> Grâce à ses directivités multiples, il excelle pour capturer l'espace.</li>
</ul>

<h2>Analyse Technique Approfondie</h2>
<p>Contrairement aux micros colorés, le Saturn 2 vise une certaine neutralité "Hifi" avec des aigus très soyeux (la marque de fabrique Sontronics). Il ne sature jamais et garde une clarté impeccable.</p>
`
    },
    'm-921-s': {
        pros: [
            "L'héritage direct de la capsule M7 originale (PVC)",
            "Son à lampe organique et tridimensionnel",
            "Fabriqué à la main en Allemagne (ex-RDA)"
        ],
        cons: [
            "Directivité cardioïde uniquement",
            "Fragilité de la capsule PVC (crains les écarts de température)"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Microtech Gefell M 92.1 S est une pièce d'histoire vivante. Gefell est l'usine originale fondée par Georg Neumann (avant que Neumann Berlin ne devienne une entité séparée). Ce micro utilise la capsule M7 originale en PVC (fabriquée selon les méthodes des années 40), réputée pour être LA capsule la plus musicale jamais créée.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Puristes du Son :</strong> Si vous cherchez le son du Neumann U47 original, Gefell est ironiquement plus proche de la source historique que Neumann Berlin aujourd'hui.</li>
    <li><strong>Voix Solistes :</strong> La capsule M7 a une façon unique de capturer l'émotion dans les médiums.</li>
</ul>

<h2>Analyse Technique Approfondie</h2>
<p>Le PVC vieillit différemment du Mylar, donnant un son plus "organique" et moins clinique. Couplé à un circuit à lampe EF86 éprouvé, c'est le son "Vieux Disque" neuf.</p>
`
    },
    'm149': {
        pros: [
            "Le Flagship moderne de Neumann",
            "9 Directivités + 7 Filtres coupe-bas",
            "Tube + Sortie Transfo-less (Le meilleur des deux mondes)"
        ],
        cons: [
            "Prix stratosphérique",
            "Peut être un peu trop 'propre' pour ceux qui veulent du sale vintage"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Neumann M 149 Tube est le sommet de la gamme actuelle. C'est le micro à lampe le plus polyvalent et le plus technologique du monde. Il combine la capsule K49 (du légendaire M49) avec un circuit à lampe et une sortie sans transformateur ultra-silencieuse. C'est le choix des superstars de la pop.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Studios World-Class :</strong> C'est le micro qu'on sort pour les voix de Beyoncé ou Coldplay.</li>
    <li><strong>Prises de Voix définitives :</strong> Il offre une telle richesse qu'il n'y a quasi rien à mixer.</li>
</ul>

<h2>Analyse Technique Approfondie</h2>
<p>L'innovation géniale est le commutateur de filtre coupe-bas à 7 positions. Il permet d'ajuster l'effet de proximité avec une précision chirurgicale directement sur le micro, avant même le préampli.</p>
`
    },
    'ls-208': {
        pros: [
            "Réjection des bruits hors-axe exceptionnelle",
            "Sonorité 'Radio' découpée au couteau",
            "Filtres passe-haut et bas inclus"
        ],
        cons: [
            "Moins extrême en réjection que le LS-308",
            "Son très typé Broadcast"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Lauten Audio LS-208 est le grand frère du LS-308, mais optimisé pour la voix parlée et le chant avec un son plus ouvert. C'est un micro de studio qui se comporte comme un micro de scène : vous pouvez l'utiliser dans une pièce non traitée, il rejettera l'ambiance pour ne garder que la voix.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Podcasteurs et Radio :</strong> Une alternative statique aux SM7B et RE20, avec plus de niveau et de détail.</li>
    <li><strong>Chant Live en Studio :</strong> Pour enregistrer le chanteur dans la même pièce que le groupe.</li>
</ul>
`
    },
    'm-930---ea-93-set-satin-nickel': {
        pros: [
            "Rapport Taille/Son incroyable",
            "Extrêmement silencieux (7 dBA)",
            "Capsule M930 moderne et précise"
        ],
        cons: [
            "Tellement petit qu'il peut faire 'jouet' (à tort !)",
            "Cardioïde fixe"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Microtech Gefell M 930 est un miracle de miniaturisation et de pureté. C'est un micro large membrane ultra-compact qui délivre un son géant, moderne et universel. Il est devenu un standard secret dans les radios allemandes pour sa précision et son absence totale de coloration désagréable.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Voix Off et Radio :</strong> Sa proximité est riche et ses aigus sont parfaits sans être agressifs (pas de sibilance).</li>
    <li><strong>Studios Mobiles :</strong> Qualité "Neumann" (Gefell) dans la poche.</li>
</ul>
`
    },
    'm-930---ea-93-set-dark-bronze': {
        pros: ["Finition Dark Bronze magnifique", "Mêmes qualités que le Satin Nickel", "Très discret à l'image"],
        cons: ["Cardioïde fixe", "Petit format surprenant"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Version "Dark Bronze" du célèbre M 930. Cette finition antique sombre est non seulement superbe et résistante, mais elle évite aussi les reflets parasites en vidéo. Techniquement identique au modèle argenté : un son pur, moderne et silencieux dans un corps miniature.</p>
`
    },
    'm-950---ea-93-set-dark-bronze': {
        pros: ["Directivité Large Cardioïde (unique)", "Son plus ouvert et naturel", "Moins d'effet de proximité"],
        cons: ["Capte plus la pièce qu'un cardio classique", "Moins isolant"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Microtech Gefell M 950 est la version "Large Cardioïde" (Wide Cardioid) du M 930. Cette directivité rare offre un compromis génial entre l'Omni (naturel, ouvert) et le Cardioïde (isolant). Il est idéal pour les instrumentistes solistes (guitare, piano) car il respire mieux et a moins d'effet de proximité boomy.</p>
`
    },
    'm-950---ea-93-set-satin-nickel': {
        pros: ["Clarté et naturel du Wide Cardioid", "Finition Satin Nickel classique", "Parfait pour piano/guitare"],
        cons: ["Demande une bonne acoustique de pièce", "Moins adapté aux voix très proches"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>La version argentée (Satin Nickel) du M 950. C'est le même micro à directivité cardioïde large. Idéal si vous trouvez les micros cardioïdes classiques trop "étriqués" ou trop chargés en basses quand on s'approche. Il offre un son aéré et majestueux.</p>
`
    },
    'm-940-dark-bronze': {
        pros: ["Directivité Super-Cardioïde focalisée", "Rejet maximal des côtés", "Son précis et sec"],
        cons: ["Sweet spot plus étroit (faut viser)", "Effet de proximité plus marqué"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Gefell M 940 est le sniper de la famille. Avec sa directivité Super-Cardioïde, il va chercher le son avec une précision laser en rejetant au maximum les bruits venant des côtés. C'est l'outil de résolution de problèmes quand l'acoustique est mauvaise ou que les musiciens sont proches les uns des autres.</p>
`
    },
    'm-940-satin-nickel': {
        pros: ["Isolation acoustique supérieure", "Finition Satin Nickel", "Idéal pour voix isolée"],
        cons: ["Demande de la discipline de placement", "Prix Gefell"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Version argentée du M 940 Super-Cardioïde. Parfait pour isoler une caisse claire, une voix dans un groupe, ou tout instrument qui doit être séparé chirurgicalement de son environnement acoustique.</p>
`
    },
    'm-990-dark-bronze': {
        pros: ["Flagship à lampe de Gefell", "Capsule M930 + Tube EF86", "Son moderne mais chaud"],
        cons: ["Prix élevé", "Alimentation externe requise"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Microtech Gefell M 990 est le mariage parfait entre la précision moderne (capsule M930) et la chaleur vintage (lampe EF86). Contrairement aux micros vintage parfois boueux, le M 990 garde une clarté cristalline tout en ajoutant cette soyeuse épaisseur harmonique que seul un tube peut donner. C'est un micro vocal de rêve.</p>
`
    },
    'm-1030---ea-92-set': {
        pros: ["Look moderne et angulaire", "Son 'Bigger than life'", "Bruit de fond record (7 dBA)"],
        cons: ["Design qui ne plait pas à tout le monde", "Très sensible aux pops (filtre requis)"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Gefell M 1030 est conçu pour le 21ème siècle. Avec son corps optimisé acoustiquement pour éviter les réflexions internes, il offre une présence et une largeur stéréo impressionnante (même en mono, le son parait large). C'est un micro universel haute fidélité, avec une légère bosse de présence douce (Green bump) qui flatte tout ce qu'on met devant.</p>
`
    },
    'm-960': {
        pros: ["Omnidirectionnel pur (Correction champ diffus)", "Son le plus naturel possible", "Idéal pour chœurs et orchestres dans de bonnes salles"],
        cons: ["Inutilisable en pièce non traitée (Omni)", "Usage spécifique (AB Stereo, Decca Tree)"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Gefell M 960 est un outil de puriste. C'est un vrai Omnidirectionnel (capsule à pression) calibré pour le champ diffus (Diffuse Field). Cela signifie qu'il est fait pour être placé LOIN de la source, pour capturer l'ensemble d'un orchestre, d'une chorale ou d'un piano dans une belle salle de concert. De près, il sonnera très brillant. De loin, il est parfait.</p>
`
    },
    'lct-640-ts': {
        pros: ["Technologie Dual Output révolutionnaire", "Changer la directivité APRÈS l'enregistrement (Plugin)", "Son Lewitt moderne et précis"],
        cons: ["Nécessite deux entrées XLR pour le mode Dual", "Concept complexe pour les débutants"],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Lewitt LCT 640 TS (Twin System) n'est pas juste un micro, c'est une machine à remonter le temps. Grâce à sa double sortie XLR (une pour chaque diaphragme), vous pouvez enregistrer le signal brut et CHANGER la directivité du micro (Passer d'Omni à Cardio à 8) en post-production via un plugin. C'est l'outil ultime de flexibilité studio.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Sound Designers et Expérimentateurs :</strong> Les possibilités créatives sont infinies (Stéréo MS avec un seul micro, rotation de la phase...).</li>
    <li><strong>Ingés Son indécis :</strong> Plus besoin de choisir la directivité à la prise, décidez au mix !</li>
</ul>
`
    }
};

async function updateDescriptions() {
    console.log('\\n🚀 Starting SEO Optimization for Vague 3 (Gefell, Neumann, Telefunken...)\\n');

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
