
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

const UPDATES = [
    {
        id: '70ddf166-76b6-4f4e-bbe0-c79f325abee3', // Shure SM7B
        description: "Le **Shure SM7B** est une véritable légende des studios radio et podcast. Conçu initialement pour la voix parlée, il s'est imposé comme le standard absolu grâce à sa capacité à capturer une voix chaleureuse, ronde et présente, tout en rejetant efficacement les bruits de fond. Sa courbe de réponse plate et large offre une reproduction naturelle exceptionnelle.\n\nSa conception intègre un blindage électromagnétique avancé contre les bourdonnements des écrans et une suspension interne pneumatique qui élimine quasi totalement les bruits de manipulation. C'est le choix incontournable pour les podcasters professionnels et les chanteurs rock/metal (célèbre pour avoir enregistré \"Thriller\" !).",
        pros: [
            "Isolation phonique exceptionnelle",
            "Signature sonore \"Radio\" mythique",
            "Filtrage anti-pop intégré ultra-efficace"
        ],
        cons: [
            "Nécessite un préampli puissant (60dB+) ou un Cloudlifter" // Using cons for "À savoir" / Tech Note
        ]
    },
    {
        id: '0dec4ad3-6e68-4086-962e-bbdf8339f2e3', // U87 Ai
        description: "Le **Neumann U87 Ai** est sans doute le microphone à condensateur le plus célèbre et le plus utilisé au monde. Référence absolue des studios professionnels depuis des décennies, il est prisé pour sa chaleur, sa précision chirurgicale et son équilibre parfait. Il sublime littéralement n'importe quelle source sonore : voix, cordes, piano ou percussions.\n\nCe modèle offre trois directivités commutables (Omnidirectionnelle, Cardioïde, Figure en 8) et intègre un filtre coupe-bas ainsi qu'un atténuateur -10dB, lui permettant d'encaisser de fortes pressions acoustiques sans distorsion. C'est l'investissement ultime pour un studio sérieux.",
        pros: [
            "Le standard de l'industrie : son riche et défini",
            "Polyvalence totale (3 directivités)",
            "Qualité de fabrication et valeur de revente"
        ],
        cons: [
            "Très sensible à l'isolement acoustique de la pièce"
        ]
    },
    {
        id: '4ef7cf10-e340-41c6-9e21-7dc81d36ad78', // AT2020
        description: "L'**Audio-Technica AT2020** est le microphone qui a redéfini le rapport qualité/prix pour le home-studio. Il offre la qualité d'un véritable micro à condensateur de studio à un tarif accessible à tous. Sa conception à faible masse lui permet une réponse en transitoires supérieure et une réponse en fréquence étendue.\n\nIdéal pour les premiers pas en enregistrement, il excelle sur les voix et les instruments acoustiques grâce à sa directivité cardioïde qui isole bien la source sonore. Sa robustesse légendaire en fait un compagnon fiable pour des années.",
        pros: [
            "Rapport qualité/prix imbattable",
            "Sonorité moderne et aérée",
            "Construction robuste"
        ],
        cons: [
            "Livré sans suspension élastique (shockmount)"
        ]
    }
];

async function updatePilot() {
    console.log('Updating 3 pilot products...');

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
            console.log(`[UPDATED] ${update.id}`);
        }
    }
}

updatePilot();
