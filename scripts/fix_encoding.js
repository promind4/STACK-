
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

const REPLACEMENTS = [
    // É
    { pattern: /Bas/g, replacement: 'Basé' },
    { pattern: /Directivit/g, replacement: 'Directivité' },
    { pattern: /cardiode/g, replacement: 'cardioïde' },
    { pattern: /Cardiode/g, replacement: 'Cardioïde' },
    { pattern: /tapes/g, replacement: 'étapes' },
    { pattern: /intermdiaires/g, replacement: 'intermédiaires' },
    { pattern: /clbre/g, replacement: 'célèbre' },
    { pattern: /pulvrise/g, replacement: 'pulvérisée' },
    { pattern: /plaque/g, replacement: 'plaquée' },
    { pattern: /cl/g, replacement: 'clé' },
    { pattern: /Frquence/g, replacement: 'Fréquence' },
    { pattern: /frquence/g, replacement: 'fréquence' },
    { pattern: /Numrique/g, replacement: 'Numérique' },
    { pattern: /numrique/g, replacement: 'numérique' },
    { pattern: /Stro/g, replacement: 'Stéréo' },
    { pattern: /stro/g, replacement: 'stéréo' },
    { pattern: /Prampli/g, replacement: 'Préampli' },
    { pattern: /prampli/g, replacement: 'préampli' },
    { pattern: /Systme/g, replacement: 'Système' },
    { pattern: /systme/g, replacement: 'système' },
    { pattern: /Intgr/g, replacement: 'Intégré' },
    { pattern: /intgr/g, replacement: 'intégré' },
    { pattern: /Ddi/g, replacement: 'Dédié' },
    { pattern: /ddi/g, replacement: 'dédié' },
    { pattern: /Lgers/g, replacement: 'Légers' },
    { pattern: /lgers/g, replacement: 'légers' },
    { pattern: /Modle/g, replacement: 'Modèle' },
    { pattern: /modle/g, replacement: 'modèle' },
    { pattern: /lment/g, replacement: 'élément' },
    { pattern: /caractristique/g, replacement: 'caractéristique' },
    { pattern: /Caractristique/g, replacement: 'Caractéristique' },
    { pattern: /galement/g, replacement: 'également' },
    { pattern: /quipe/g, replacement: 'équipe' },
    { pattern: /mulation/g, replacement: 'émulation' },
    { pattern: /lev/g, replacement: 'élevé' },
    { pattern: /Attnuation/g, replacement: 'Atténuation' },
    { pattern: /spcial/g, replacement: 'spécial' },
    { pattern: /spciale/g, replacement: 'spéciale' },
    { pattern: /limit/g, replacement: 'limité' },
    { pattern: /limite/g, replacement: 'limitée' },
    { pattern: /lectronique/g, replacement: 'électronique' },
    { pattern: /prcis/g, replacement: 'précis' },
    { pattern: /prcision/g, replacement: 'précision' },
    { pattern: /trs/g, replacement: 'très' },

    // È
    { pattern: /modle/g, replacement: 'modèle' },
    { pattern: /lgre/g, replacement: 'légère' },
    { pattern: /entre/g, replacement: 'entrée' },
    { pattern: /Entre/g, replacement: 'Entrée' },

    // À
    { pattern: /  /g, replacement: ' à ' },
    { pattern: / main/g, replacement: 'à main' },
    { pattern: / condensateur/g, replacement: 'à condensateur' },
    { pattern: / lampe/g, replacement: 'à lampe' },
    { pattern: / ruban/g, replacement: 'à ruban' },
    { pattern: /Jusqu'/g, replacement: "Jusqu'à" },

    // GENERIC FALLBACK (Risky but necessary if specific patterns fail)
    // { pattern: //g, replacement: 'é' } // Disable generic for now, rely on patterns
];

async function fixEncoding() {
    console.log('Fetching products...');
    const { data: products, error } = await supabase
        .from('products')
        .select('id, name, description')
        .not('description', 'is', null);

    if (error) {
        console.error('Fetch error:', error);
        return;
    }

    let updateCount = 0;

    for (const product of products) {
        let newDesc = product.description;
        let originalDesc = product.description;

        if (!newDesc.includes('')) continue;

        REPLACEMENTS.forEach(({ pattern, replacement }) => {
            newDesc = newDesc.replace(pattern, replacement);
        });

        // Check if we still have garbage
        if (newDesc.includes('')) {
            console.warn(`[WARN] Product "${product.name}" still has encoding issues:`);
            console.warn(`Original: ${originalDesc}`);
            console.warn(`Partial : ${newDesc}`);
            // Fallback: mostly it's 'é' or 'à' or 'è'.
            // Common remaining context?
            // "capacit" -> capacité
            // "fidlit" -> fidélité
            // Let's do a safe fallback for common endings
            newDesc = newDesc.replace(/it/g, 'ité');
            newDesc = newDesc.replace(/s/g, 'és');
        }

        if (newDesc !== originalDesc) {
            const { error: updateError } = await supabase
                .from('products')
                .update({ description: newDesc })
                .eq('id', product.id);

            if (updateError) {
                console.error(`Error updating ${product.name}:`, updateError);
            } else {
                console.log(`[FIXED] ${product.name}`);
                updateCount++;
            }
        }
    }

    console.log(`Job complete. Fixed ${updateCount} products.`);
}

fixEncoding();
