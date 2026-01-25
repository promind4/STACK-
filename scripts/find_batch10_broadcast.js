
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing environment variables!");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function findBatch10() {
    console.log("Searching for Batch 10 (Broadcast/Dynamic) products...");

    // Terms to search for
    const searchTerms = [
        'DynaCaster',
        'Procaster',
        'Heil',
        'RE20',   // Electro-Voice RE20
        'RE320',
        'SM7dB',
        'PodMic',
        'M 99',   // Beyerdynamic M 99
        'BP40'    // Audio-Technica BP40
    ];

    for (const term of searchTerms) {
        const { data, error } = await supabase
            .from('products')
            .select('id, name')
            .ilike('name', `%${term}%`);

        if (error) {
            console.error(`Error searching for ${term}:`, error);
            continue;
        }

        if (data && data.length > 0) {
            console.log(`\nFound matches for "${term}":`);
            data.forEach(p => console.log(` - ${p.id}: ${p.name}`));
        } else {
            console.log(`\nNo matches for "${term}"`);
        }
    }
}

findBatch10();
