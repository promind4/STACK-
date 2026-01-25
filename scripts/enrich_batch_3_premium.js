
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

// BATCH 3 PREMIUM UPDATES (Refined descriptions for the same 10 products that failed/need upgrade)
const UPDATES = [
    {
        id: "de7540e6-741b-40d2-89da-2bb269b8954c", // 017 FET
        description: "### Le Son Boutique Russe Moderne\n\nLe **Soyuz 017 FET** représente l'apogée de la facture instrumentale russe contemporaine. Entièrement fabriqué à la main à Tula, ce microphone à condensateur à large membrane n'est pas un simple clone de classiques allemands, mais une véritable création originale qui a su s'imposer dans les plus grands studios mondiaux (Radiohead, Coldplay).\n\n**Signature Sonore**\nContrairement à la tendance moderne vers une brillance excessive, le 017 FET offre un son \"déjà mixé\" : des graves profonds et autoritaires, un médium riche et texturé, et des aigus d'une douceur veloutée qui ne deviennent jamais sibilants. Sa capsule unique, accordée à la main avec une précision d'orfèvre, capture les transitoires avec une rapidité typique des circuits FET tout en conservant une épaisseur harmonique souvent associée aux lampes.\n\n**Applications Idéales**\nC'est le micro de choix pour les voix lead qui manquent de corps. Il excelle également sur les guitares acoustiques, les amplis basse et comme micro de grosse caisse extérieur (kick out) pour un son vintage massif.",
        pros: ["Sonorité 'Big Sound' immédiate", "Aigus soyeux sans dureté", "Fabrication artisanale d'exception"],
        cons: ["Directivité fixe (Cardioïde)"]
    },
    {
        id: "b4afc0ce-1216-451a-891d-fd4dd0f8f69e", // 017 Tube
        description: "### L'Héritage des Légendes\n\nLe **Soyuz 017 TUBE** est bien plus qu'un microphone : c'est un instrument de musique à part entière. Conçu pour rivaliser avec les légendaires U47 et U67 vintage, il offre cette magie indéfinissable des grands micros à lampe : une tridimensionnalité et une profondeur de champ qui placent l'auditeur *dans* la pièce avec l'artiste.\n\n**Technologie et Conception**\nAu cœur du 017 TUBE se trouve une capsule propriétaire à double membrane, tendue et accordée manuellement par les maîtres artisans de Soyuz. Le circuit à lampe, couplé à un transformateur toroïdal bobiné maison, ajoute une saturation harmonique riche et musicale qui s'épaissit à mesure que l'on pousse le niveau. Ce n'est pas un micro neutre ; c'est un micro qui embellit la réalité.\n\n**Verdict Studio**\nIncontournable pour les voix principales pop, rock et jazz, il apporte ce \"fini\" professionnel instantané qui ne nécessite souvent aucune égalisation.",
        pros: ["Richesse harmonique et effet 3D", "Transformateur toroïdal propriétaire", "Esthétique 'Sputnik' iconique"],
        cons: ["Alimentation externe nécessaire (fournie)"]
    },
    {
        id: "241bad74-ce7d-4cfb-acab-0a041a476754", // 023 Bomblet
        description: "### Le Charmeur de Sources\n\nLe **Soyuz 023 Bomblet** tire son nom et sa forme des munitions soviétiques, mais son caractère est tout sauf destructeur. C'est un microphone à condensateur unique, conçu pour être l'antidote au son numérique stérile et agressif.\n\n**La Magie LOMO**\nSa capsule est inspirée des légendaires micros LOMO 19A19 du début des années 70, utilisant une conception rare à triple plaque arrière (triple backplate). Cette architecture complexe confère au Bomblet une réponse en fréquence très particulière : douce, ronde, avec des aigus atténués mais détaillés. C'est le micro idéal pour \"calmer\" des sources agressives.\n\n**Utilisation**\nIl fait des merveilles sur les amplis guitare électriques criards, les trompettes perçantes ou les batteurs qui frappent fort les cymbales. Sur une voix, il apporte une intimité et une rondeur \"crooner\" immédiate.",
        pros: ["Sonorité ronde et crémeuse", "Technologie rare 'Triple Backplate'", "Dompte les aigus agressifs"],
        cons: ["Peut manquer d'air sur des sources déjà sombres"]
    },
    {
        id: "28c8d642-2232-461a-b93c-cf7fd40b5f12", // 023 MALFA
        description: "### L'Élégance Noire et Or\n\nCette **Edition Limitée MALFA** sublime le célèbre Soyuz 023 Bomblet. Fruit d'une collaboration exclusive, elle reprend l'intégralité des composants internes qui ont fait le succès du modèle original, mais les enveloppe dans une finition noire mate et laiton brossé d'une élégance rare.\n\n**Un Cœur Analogique**\nRetrouvez le son épais et coloré du transformateur toroïdal Soyuz. C'est un micro de caractère, conçu pour les artistes qui cherchent une signature sonore forte. Que ce soit sur une grosse caisse, un ampli basse ou une voix rock, le Bomblet MALFA délivre un son \"mix-ready\" avec cette compression naturelle des transitoires qui fait sonner les prises *gros* tout de suite.\n\n**Collection**\nProduit en quantités très limitées, c'est autant un outil de travail redoutable qu'une pièce de collection pour les passionnés de beau matériel.",
        pros: ["Finition collector exclusive", "Sonorité 'Fat' et colorée", "Polyvalence sur les sources fortes"],
        cons: ["Disponibilité très limitée"]
    },
    {
        id: "5df53462-a94d-4d4c-98e5-df50076176b0", // 1973-B
        description: "### Le Nouveau Standard FET\n\nLe **Soyuz 1973** (finition noire) est la réponse de Soyuz aux besoins des home-studios modernes : un microphone de qualité \"boutique\" à un tarif accessible, sans compromis sur la fabrication. Contrairement à ses grands frères de la série 0, le 1973 adopte un corps plus moderne et compact, mais conserve une capsule et un transformateur 100% fabriqués à la main.\n\n**Profil Sonore**\nLe 1973 propose une sonorité légèrement plus moderne et \"en avant\" que le 017. Une légère bosse de présence dans le haut-médium lui permet de traverser des mixages denses sans avoir besoin d'EQ excessive. Les graves restent solides mais plus contrôlés, ce qui le rend plus facile à utiliser dans des pièces à l'acoustique imparfaite.\n\n**Innovation**\nIl intègre un résonateur acoustique interne qui minimise les résonances de boîtier, garantissant un son pur. Attention, il est vendu sans suspension élastique (disponible en option).",
        pros: ["Le son Soyuz authentique", "Présence moderne idéale pour le mix", "Fabrication artisanale"],
        cons: ["Suspension non incluse"]
    },
    {
        id: "55a574fd-9520-4d83-8d1f-31c76757fe53", // 1973-S
        description: "### L'Excellence Artisanale Accessible\n\nLe **Soyuz 1973** (finition argentée) est techniquement identique à la version noire, offrant la même excellence sonore dans une esthétique nickelée classique qui rappelle les micros vintage.\n\n**Polyvalence Tout-Terrain**\nCe microphone est un véritable couteau suisse. Grâce à son pad atténuateur intégré (-10dB / -20dB), il peut encaisser des nivaus de pression acoustique énormes, ce qui le rend parfait pour reprendre des amplis guitare poussés à fond ou des fûts de batterie. Sur les voix, il offre une clarté et un détail qui flattent les chanteurs pop et folk.\n\n**Pourquoi le choisir ?**\nSi vous cherchez votre premier \"vrai\" micro de studio et que vous ne voulez pas d'une copie chinoise sans âme, le 1973 est la porte d'entrée vers le son haut de gamme.",
        pros: ["Pad atténuateur -10/-20dB", "Polyvalence extrême", "Look classique intemporel"],
        cons: ["Nécessite une bonne acoustique"]
    },
    {
        id: "47fe38c6-1b33-4654-97e5-61396b6e00c0", // 2003a
        description: "### Le Secret le Mieux Gardé\n\nLe **MXL 2003a** est un phénomène dans le monde de l'audio pro. Souvent cité sur les forums spécialisés (Gearspace, Audiofanzine) comme le meilleur rapport qualité/prix de tous les temps, il rivalise à l'oreille avec des micros coûtant 5 à 10 fois son prix.\n\n**Une Transparence Rare**\nCe qui distingue le 2003a, c'est sa capsule de 27mm conçue pour une réponse en fréquence remarquablement plate. Contrairement à beaucoup de micros bon marché qui boostent les aigus pour paraître \"détaillés\" (ce qui devient vite agressif), le 2003a reste doux et naturel. Les graves sont profonds mais tendus, et les aigus filent haut sans dureté.\n\n**L'Outil de Travail**\nC'est le micro parfait pour commencer : il ne colore pas excessivement le son, vous apprenant à bien placer votre micro et votre source. Livré avec sa suspension, c'est une affaire en or.",
        pros: ["Neutralité impressionnante", "Rapport Q/P imbattable", "Suspension incluse"],
        cons: ["Construction légère", "Switchs fragiles"]
    },
    {
        id: "10e5e673-4eb6-4662-8ed6-3f187f3cb0b3", // 770
        description: "### La Voix du Rap et du Podcast\n\nLe **MXL 770** s'est imposé comme une référence incontournable pour les voix urbaines et le broadcast amateur. Derrière son look noir et or agressif se cache un microphone à condensateur petit diaphragme (SDC) habillé en grand, une conception qui lui confère une réactivité (transitoires) excellente.\n\n**Le Son 770**\nIl est célèbre pour sa signature en \"V\" : des basses gonflées et chaleureuses (le fameux \"effet radio\") et des aigus brillants qui assurent l'intelligibilité. C'est exactement ce que recherchent les rappeurs et les podcasters pour avoir une voix \"larger than life\" sans traitement complexe.\n\n**Fonctionnalités**\nÉquipé d'un filtre coupe-bas pour nettoyer les grondements et d'un pad -10dB, il est étonnamment bien équipé pour son prix.",
        pros: ["Graves profonds et flatteurs", "Clarté immédiate", "Prix très agressif"],
        cons: ["Peut être sibilant (sifflant)"]
    },
    {
        id: "1fc28376-6016-4cd1-8247-a1337f9d3122", // 990
        description: "### La Légende Champagne\n\nLe **MXL 990** est historique : c'est le micro qui a démocratisé l'enregistrement domicile au début des années 2000. Des millions de musiciens ont fait leurs premières prises avec ce micro à la finition champagne caractéristique.\n\n**Une Douceur Soyeuse**\nContrairement au 770 qui est plus \"scoopé\", le 990 offre un médium plus présent et des aigus plus soyeux. Il est souvent préféré pour les voix féminines, les voix off douces, et surtout les guitares acoustiques où sa brillance contrôlée fait merveille. C'est un micro qui pardonne facilement les erreurs de placement.\n\n**Package Complet**\nLivré dans une valise de transport robuste avec sa suspension, c'est le kit de démarrage idéal. Un classique qui n'a pas pris une ride.",
        pros: ["Sonorité équilibrée et musicale", "Kit complet avec valise", "Robustesse éprouvée"],
        cons: ["Souffle (bruit de fond) moyen"]
    },
    {
        id: "2b76e41d-cf2c-434c-a3a4-3463abd5cc53", // AE 3000
        description: "### L'Outil de Précision\n\nL'**Audio-Technica AE 3000** est un microphone d'ingénieur. Conçu pour le renforcement sonore live et le studio, c'est un condensateur large membrane à adresse latérale (side-address) optimisé pour les sources à fort niveau de pression (SPL).\n\n**Compact et Résistant**\nSa tête grillagée plate permet de le positionner au plus près des peaux de toms ou des grilles d'amplis guitare sans gêner le musicien. Il peut encaisser jusqu'à 158 dB SPL avec le pad activé ! C'est le micro qui capture l'impact physique du son.\n\n**Sonorité**\nIl offre une réponse très détaillée et rapide. Sur les toms, il donne ce son \"tonnerre\" avec beaucoup d'attaque. Sur les amplis guitare, il capture le grain de la distorsion avec une fidélité chirurgicale que les dynamiques ne peuvent égaler.",
        pros: ["Tenue en pression (SPL) exceptionnelle", "Format plat ergonomique", "Précision des transitoires"],
        cons: ["Moins chaleureux pour le chant"]
    }
];

async function updateBatchPremium() {
    console.log(`Enriching batch of ${UPDATES.length} products with PREMIUM content...`);

    for (const update of UPDATES) {
        const { data, error } = await supabase
            .from('products')
            .update({
                description: update.description,
                pros: update.pros,
                cons: update.cons
            })
            .eq('id', update.id)
            .select();

        if (error) {
            console.error(`[ERROR] Failed to update ${update.id}:`, error);
        } else {
            if (data && data.length > 0) {
                console.log(`[SUCCESS] Updated ${update.id} (${data[0].name})`);
            } else {
                console.warn(`[WARN] Update command ran but returned no data for ${update.id}. Check ID or permissions.`);
            }
        }
    }
}

updateBatchPremium();
