
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

// Map of updates based on fetched IDs
const UPDATES = [
    {
        id: "de7540e6-741b-40d2-89da-2bb269b8954c", // 017 FET
        description: "Le **Soyuz 017 FET** est un microphone à condensateur fabriqué à la main en Russie, incarnant le mariage parfait entre l'ingénierie vintage et la précision moderne. Sa capsule plaquée or de 34mm, accordée manuellement, capture un son riche et corsé avec des aigus soyeux qui ne deviennent jamais agressifs. Il offre la 'grosseur' de son typique des micros à lampe classiques, mais avec la rapidité et la fiabilité d'un circuit FET.\n\nC'est un choix privilégié pour les voix principales qui nécessitent de l'autorité et de la chaleur, ainsi que pour les instruments acoustiques riches comme le piano ou la contrebasse.",
        pros: ["Sonorité 'Big Sound' riche et épaisse", "Fabrication artisanale haut de gamme", "Aigus doux et musicaux"],
        cons: ["Directivité cardioïde fixe uniquement"]
    },
    {
        id: "b4afc0ce-1216-451a-891d-fd4dd0f8f69e", // 017 Tube
        description: "Le **Soyuz 017 TUBE** est le fleuron de la gamme, un microphone à lampe sans compromis qui rivalise avec les légendes allemandes et autrichiennes des années 50. Il délivre un son tridimensionnel, profond et extrêmement détaillé. Le transformateur toroïdal propriétaire ajoute une saturation harmonique subtile qui flatte n'importe quelle source.\n\nSon esthétique unique, inspirée du constructivisme soviétique et de l'aérospatiale, en fait une pièce maîtresse visuelle et sonore dans tout studio professionnel.",
        pros: ["Profondeur et dimension 3D exceptionnelles", "Caractère harmonique flatteur", "Design iconique"],
        cons: ["Nécessite un pied de micro robuste (lourd)"]
    },
    {
        id: "241bad74-ce7d-4cfb-acab-0a041a476754", // 023 Bomblet
        description: "Le **Soyuz 023 Bomblet** est un microphone à condensateur unique en son genre. Là où beaucoup de micros modernes cherchent la brillance, le Bomblet assume une sonorité sombre, ronde et crémeuse grâce à son transformateur torrdal spécifique. Il est l'arme secrète pour adoucir des sources agressives : amplis guitare criards, trompettes perçantes ou voix trop sibilantes.\n\nSa capsule, inspirée des modèles LOMO vintage, offre une réponse en transitoires douce qui 'lie' le son d'une manière très musicale.",
        pros: ["Sonorité ronde idéale pour tamer les aigus", "Caractère vintage distinctif", "Format compact facile à placer"],
        cons: ["Peut manquer d'air sur des sources déjà sombres"]
    },
    {
        id: "28c8d642-2232-461a-b93c-cf7fd40b5f12", // 023 MALFA
        description: "Cette **Edition Limitée MALFA** du Soyuz 023 Bomblet célèbre la collaboration avec l'artiste. Elle reprend toutes les caractéristiques sonores du Bomblet original — ce son épais, coloré et doux — dans une finition exclusive noire et or très élégante. C'est un outil de caractère pour ceux qui cherchent une signature sonore loin de la stérilité numérique.\n\nIdéal pour donner du corps à une voix fine ou pour enregistrer une batterie avec un son 'fat' instantané.",
        pros: ["Signature sonore épaisse et douce", "Esthétique collector magnifique", "Excellente gestion des forts volumes"],
        cons: ["Quantités très limitées"]
    },
    {
        id: "5df53462-a94d-4d4c-98e5-df50076176b0", // 1973-B
        description: "Le **Soyuz 1973** est la porte d'entrée vers le son 'Handmade in Russia' de Soyuz. C'est un microphone FET large membrane conçu pour être le cheval de trait du studio moderne. Il offre une version plus moderne et 'forward' du son Soyuz, avec une légère bosse de présence qui aide les voix à percer le mix sans EQ.\n\nIl intègre un résonateur acoustique exclusif qui minimise les résonances indésirables du corps, garantissant un son pur et direct.",
        pros: ["Le son Soyuz à un prix accessible", "Excellente présence dans le mix", "Antichoc interne efficace"],
        cons: ["Suspension externe vendue séparément"]
    },
    {
        id: "55a574fd-9520-4d83-8d1f-31c76757fe53", // 1973-S
        description: "Version argentée du **Soyuz 1973**, ce microphone partage strictement les mêmes composants internes et la même sonorité que le modèle noir. Il s'agit d'un condensateur FET polyvalent, offrant des graves solides et des médiums précis. Parfait pour les home-studios cherchant à upgrader leur chaîne d'enregistrement avec un micro de caractère non-chinois.\n\nSon pad atténuateur commutable lui permet d'enregistrer des sources bruyantes comme des fûts de batterie ou des amplis.",
        pros: ["Polyvalence (Voix, Guitare acoustique, Amps)", "Pad -10dB et -20dB intégré", "Design compact et industriel"],
        cons: ["Suspension élastique en option"]
    },
    {
        id: "47fe38c6-1b33-4654-97e5-61396b6e00c0", // 2003a
        description: "Le **MXL 2003a** est l'un des secrets les mieux gardés de l'audio abordable. Souvent comparé à l'aveugle avec des micros dix fois plus chers, il offre une transparence et une linéarité surprenantes pour sa gamme de prix. Sa capsule à large diaphragme capture un son naturel avec des graves contrôlés et des aigus présents mais lisses.\n\nC'est le choix par excellence pour un premier micro sérieux destiné à l'enregistrement vocal et à la guitare acoustique, offrant une base neutre facile à travailler au mixage.",
        pros: ["Rapport qualité/prix bluffant", "Transparence et neutralité", "Livré avec suspension"],
        cons: ["Commutateurs un peu fragiles"]
    },
    {
        id: "10e5e673-4eb6-4662-8ed6-3f187f3cb0b3", // 770
        description: "Le **MXL 770** est une référence pour les rappeurs et podcasters débutants. Ce microphone à condensateur à petit diaphragme (dans un corps de grand) est réputé pour ses graves solides et chaleureux combinés à une bosse dans les aigus qui donne de la clarté et de l'intelligibilité instantanée.\n\nIl intègre un préampli FET à faible bruit et une sortie symétrique, offrant des performances bien supérieures aux micros USB standards pour un prix très agressif.",
        pros: ["Graves solides (effet de proximité flatteur)", "Aigus clairs et articulés", "Prix imbattable"],
        cons: ["Peut être brillant sur certaines voix féminines"]
    },
    {
        id: "1fc28376-6016-4cd1-8247-a1337f9d3122", // 990
        description: "Le **MXL 990** a révolutionné l'industrie en étant l'un des premiers microphones à condensateur de haute qualité à moins de 100€. Avec son look champagne iconique, il offre un son soyeux et doux avec une reproduction fidèle des médiums et des aigus.\n\nMoins chargé dans les basses que le 770, il est souvent préféré pour les voix off, les instruments acoustiques et les overheads de batterie. Une légende de l'entrée de gamme.",
        pros: ["Sonorité équilibrée et douce", "Aspect et construction 'Pro'", "Valise de transport incluse"],
        cons: ["Bruit de fond un peu plus élevé que sur du haut de gamme"]
    },
    {
        id: "2b76e41d-cf2c-434c-a3a4-3463abd5cc53", // AE 3000
        description: "L'**Audio-Technica AE 3000** est un outil de précision pour l'ingénieur du son. C'est un condensateur large membrane à adresse latérale conçu spécifiquement pour encaisser des pressions acoustiques extrêmes. Il est redoutable sur les toms de batterie, les amplis guitare et les cuivres.\n\nSa forme compacte et sa grille plate permettent de le placer très près de la source sans gêner le musicien, capturant l'impact et l'attaque avec une fidélité chirurgicale.",
        pros: ["Encaisse des SPL très élevés", "Compact et facile à positionner", "Son précis et percutant"],
        cons: ["Moins flatteur pour les voix douces"]
    }
];

async function updateBatch() {
    console.log(`Enriching batch of ${UPDATES.length} products...`);

    for (const update of UPDATES) {
        const { error } = await supabase
            .from('products')
            .update({
                description: update.description,
                pros: update.pros,
                cons: update.cons
            })
            .eq('id', update.id);

        if (error) {
            console.error(`Error updating ${update.id}:`, error);
        } else {
            console.log(`[ENRICHED] ${update.id}`);
        }
    }
}

updateBatch();
