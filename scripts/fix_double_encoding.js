
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

const REPAIRS = [
    { pattern: /éé/g, replacement: 'é' },
    { pattern: /èè/g, replacement: 'è' },
    { pattern: /àà/g, replacement: 'à' },
    { pattern: /Directivitéé/g, replacement: 'Directivité' },
    { pattern: /cardioïdee/g, replacement: 'cardioïde' }, // cardioïde + e ?
    { pattern: /légère/g, replacement: 'légère' }, // Check if lgré became légèré? 
    // pattern /lgre/ -> légèr
    // if légèrre -> légèrre
    { pattern: /Fréquencee/g, replacement: 'Fréquence' },
    { pattern: /fréquencee/g, replacement: 'fréquence' },
    { pattern: /  /g, replacement: ' ' }, // Double spaces
    { pattern: / \?/g, replacement: '?' }, // Space before ?
    { pattern: / :/g, replacement: ':' },
    { pattern: / ::/g, replacement: ':' },
];

async function fixDoubleEncoding() {
    console.log('Fetching products for repair...');
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
        const originalDesc = product.description;

        REPAIRS.forEach(({ pattern, replacement }) => {
            newDesc = newDesc.replace(pattern, replacement);
            // Run twice to catch ééé -> éé -> é
            newDesc = newDesc.replace(pattern, replacement);
        });

        if (newDesc !== originalDesc) {
            const { error: updateError } = await supabase
                .from('products')
                .update({ description: newDesc })
                .eq('id', product.id);

            if (updateError) {
                console.error(`Error updating ${product.name}:`, updateError);
            } else {
                console.log(`[REPAIRED] ${product.name}`);
                updateCount++;
            }
        }
    }

    console.log(`Repair complete. Fixed ${updateCount} products.`);
}

fixDoubleEncoding();
