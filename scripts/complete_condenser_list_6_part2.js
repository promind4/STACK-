/**
 * Optimisation SEO Vague 6 Part 2 : Le Reste du Monde (Audio-Technica, SE, AKG, Telefunken...)
 * ~35 Nouveaux produits traités.
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const UPDATES = {
    // --- AUDIO-TECHNICA ---
    'at4040': { pros: ["Le standard moderne", "Sans transformateur (Son propre)", "Encaisse fort"], cons: ["Peut paraître un peu stérile"], description: `<h2>Le Verdict</h2><p>L'Audio-Technica AT4040 est le cheval de trait des studios modernes. Il a une réponse transitoire rapide, un bruit de fond très bas, et une neutralité qui fonctionne sur tout. C'est l'anti-caractère, dans le bon sens du terme : il capture ce qui est là.</p>` },
    'at2035': { pros: ["Le grand frère du AT2020", "Pad et Filtre inclus", "Shockmount fourni"], cons: ["Look identique au 2020"], description: `<h2>Le Verdict</h2><p>L'AT2035 règle tous les "problèmes" de l'AT2020. Un bruit de fond plus bas, un pad pour les sources fortes, un filtre coupe-bas et une vraie suspension incluse. Pour quelques euros de plus, c'est un bien meilleur investissement.</p>` },
    'at2040': { pros: ["Micro DYNAMIQUE (attention)", "Look Broadcast", "Prix canon"], cons: ["Besoin de beaucoup de gain", "Pas un statique"], description: `<h2>Le Verdict</h2><p>L'AT2040 est un micro dynamique hypercardioïde pour le podcast. Il isole la voix de manière drastique. Parfait si vous streamez dans un salon bruyant.</p>` },
    'at4047-mp': { pros: ["Son 'Vintage FET' (Chaud)", "Multi-Pattern (MP)", "Transformateur"], cons: ["Cher"], description: `<h2>Le Verdict</h2><p>L'AT4047 MP est la réponse d'Audio-Technica au son FET vintage des années 70. Grâce à son transformateur de sortie, il a une chaleur et un grain que les autres AT n'ont pas. Superbe sur les voix masculines et les amplis.</p>` },
    'ae5100': { pros: ["Large membrane dans un corps crayon", "Son incroyablement naturel"], cons: ["Look trompeur (on dirait un petit micro)"], description: `<h2>Le Verdict</h2><p>L'AE5100 est un secret. C'est une capsule large membrane (la même que l'AT4040 !) mais dans un corps fin "crayon". Idéal pour les overheads ou les guitares acoustiques où on veut le son d'un large membrane sans l'encombrement.</p>` },
    'at5045': { pros: ["Capsule rectangulaire géante", "Surface de capture énorme", "Design unique"], cons: ["Hors de prix"], description: `<h2>Le Verdict</h2><p>L'AT5045 est une prouesse technologique. C'est un micro crayon... plat. Il offre la surface de membrane d'un gros micro statique, avec la réponse transitoire d'un petit. C'est le luxe absolu pour les instruments.</p>` },

    // --- TELEFUNKEN (Legends) ---
    'u-47': { pros: ["LA Légende absolue", "Tube VF14K", "Le son des Beatles"], cons: ["Investissement immobilier"], description: `<h2>Le Verdict</h2><p>Le Telefunken U47 (Tube) n'est pas une copie. C'est le vrai. Fabriqué aux USA selon les plans originaux. Il a cette autorité dans le grave (le 'Chest') et cet aigu soyeux qui a défini la musique enregistrée depuis 1950.</p>` },
    'c-12': { pros: ["Le roi de l'air", "Tube 6072a", "Capsule CK12 manufacturée main"], cons: ["Ultra cher", "Fragile"], description: `<h2>Le Verdict</h2><p>Le Telefunken C12 est l'opposé du U47. Là où le 47 est sombre et épais, le C12 est brillant et éthéré. C'est le micro des voix divines et des pianos magiques.</p>` },

    // --- SE ELECTRONICS ---
    'se-2200': { pros: ["Le classique sE", "Son brillant et présent", "Fait main"], cons: ["Aigus un peu 'forward'"], description: `<h2>Le Verdict</h2><p>Le sE2200 est le micro qui a lancé sE Electronics. Utilisé par Amy Winehouse, il a un caractère très "in your face" qui aide la voix à percer sans EQ. C'est un standard du home-studio.</p>` },
    'se4400': { pros: ["Le 'C414 killer'", "4 Directivités", "Plat et compact"], cons: ["Look carré austère"], description: `<h2>Le Verdict</h2><p>Le sE4400 est conçu pour être le micro à tout faire. Guitare, ampli, voix, overheads... Il est petit, plat, solide, et sonne bien partout. C'est le couteau suisse indispensable.</p>` },
    't1': { pros: ["Capsule Titane (T)", "Cardioïde fixe du T2", "Attaque foudroyante"], cons: ["Très brillant"], description: `<h2>Le Verdict</h2><p>Le T1 est la version cardioïde du T2. Il utilise la fameuse capsule Titane pour une réponse transitoire ultra-rapide. Sur une caisse claire ou du métal percussif, c'est imbattable.</p>` },

    // --- AKG ---
    'c214': { pros: ["Le petit frère du C414", "Même capsule (en cardio fixe)", "Robuste"], cons: ["Un peu plus brillant que le 414"], description: `<h2>Le Verdict</h2><p>Le AKG C214 est le best-seller. Il offre le son de la capsule légendaire du C414 mais en version simplifiée cardioïde. C'est le workhorse par excellence pour ceux qui veulent le son AKG.</p>` },
    'c314': { pros: ["Le chaînon manquant", "Capsule 414 double membrane", "4 Directivités"], cons: ["Moins de réglages que le 414 XLS"], description: `<h2>Le Verdict</h2><p>Le C314 est le juste milieu entre le 214 et le 414. Il utilise la vraie capsule double diaphragme, permettant d'avoir l'Omni et le Figure-8, à un prix plus doux que le 414.</p>` },
    'p220': { pros: ["Costaud (Tout métal)", "Son chaud", "Valise alu fournie"], cons: ["Un peu lourd"], description: `<h2>Le Verdict</h2><p>Le AKG P220 (Perception) est le tank de l'entrée de gamme. C'est un micro large membrane qui sonne gros et chaud, parfait pour le rock et les voix fortes.</p>` },

    // --- LAUTEN AUDIO ---
    'series-black-la-220-v2': { pros: ["FET abordable", "Filtres High et Low Pass", "Son américain"], cons: ["Moins de magie que la série Signature"], description: `<h2>Le Verdict</h2><p>Le LA-220 v2 est l'entrée de gamme de Lauten, mais ne vous y trompez pas. Il a un circuit JFET à très faible bruit et offre un son moderne et ouvert, prêt à mixer.</p>` },
    'series-black-la-320-v2': { pros: ["Micro à lampe pour moins de 1000€", "Son chaud et vintage", "Filtres complets"], cons: ["Alimentation externe"], description: `<h2>Le Verdict</h2><p>Le LA-320 v2 amène le son à lampe (Vacuum Tube) à un prix démocratique. Avec sa lampe 12AX7, il offre une richesse harmonique que les micros transistor n'ont pas.</p>` },
    'clarion-fc-357': { pros: ["Son FET classique et solide", "3 Voicings", "Le son des années 70"], cons: ["Lourd"], description: `<h2>Le Verdict</h2><p>Le Clarion FC-357 est un micro FET robuste avec 3 voicings. Il a un son un peu plus sombre et péchu que l'Atlantis, rappelant les grands classiques FET allemands.</p>` },

    // --- SONTRONICS ---
    'aria': { pros: ["Conçu spécifiquement pour la VOIX", "Tube doux et soyeux", "Pad sur l'alim"], cons: ["Ne fait que la voix (ou presque)"], description: `<h2>Le Verdict</h2><p>Le Sontronics Aria est un micro à lampe "Vocal-First". Sa courbe de réponse est taillée pour mettre la voix en valeur avec des aigus soyeux qui ne siflent jamais ("Sibilance-proof").</p>` },
    'dm-1b': { pros: ["Large membrane pour... Grosse Caisse !", "Encaisse 155dB", "Condensateur (rare pour un kick)"], cons: ["Usage spécifique"], description: `<h2>Le Verdict</h2><p>Le DM-1B est une anomalie géniale : un micro à condensateur large membrane conçu pour être mis DANS la grosse caisse. Il capture l'attaque (click) ET le sub (boom) avec une précision que les dynamiques n'ont pas.</p>` },

    // --- MXL ---
    'v67g': { pros: ["Le 'Green & Gold' classique", "Son chaud (circuit FET sans transfo)", "Look vintage"], cons: ["Pas de pad"], description: `<h2>Le Verdict</h2><p>Le MXL V67G est célèbre pour son look vert et or "Old School". Soniquement, il est étonnamment chaud et doux pour son prix, souvent comparé à des micros à lampe. Excellent pour adoucir les voix numériques.</p>` },
    'v69m': { pros: ["Micro à lampe budget", "Câblage Mogami interne", "Gros son"], cons: ["Bruit de fond moyen"], description: `<h2>Le Verdict</h2><p>Le V69M Edition Mogami est un micro à lampe accessible qui utilise du câble haut de gamme en interne. Il offre ce son "tube" épais.</p>` },

    // --- WARM AUDIO (Suite) ---
    'wa-47f': { pros: ["Clone U47 FET", "Idéal Kick/Basse", "Look superbe"], cons: ["Cardio only"], description: `<h2>Le Verdict</h2><p>Le WA-47F est la version FET "Kick Drum mic" du 47 chez Warm. Il est fait pour encaisser les forts volumes.</p>` },
    'wa-47jr-se': { pros: ["Édition 'Silver' du 47jr", "Même son FET sans transfo"], cons: ["Aucun changement sonore"], description: `<h2>Le Verdict</h2><p>Le WA-47jr SE est l'édition Silver du célèbre WA-47jr. Même son FET rapide et précis, nouveau look.</p>` },

    // --- GOLDEN AGE ---
    'premier-ga-251-mkii': { pros: ["Clone 251 abordable", "Qualité 'Premier'", "Look fidèle"], cons: ["Reste un clone"], description: `<h2>Le Verdict</h2><p>Le Golden Age Premier GA-251 MKII démocratise le son du Telefunken 251. Avec des composants de haute qualité, il offre 90% du son de la légende pour 10% du prix.</p>` },
};

async function updateDescriptions() {
    console.log('\\n🚀 Starting SEO Optimization for Vague 6 Part 2 (The Rest)...\\n');
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
            process.stdout.write('.');
            successCount++;
        }
    }

    console.log(`\\n\\n✅ ${successCount} products updated successfully!\\n`);
}

updateDescriptions();
