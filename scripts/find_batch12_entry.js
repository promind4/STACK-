
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function findBatch12() {
    console.log("Searching for Batch 12 (Entry/Misc) products...");

    const searchTerms = [
        'SC 600',
        'SC 430',
        'SC 425',
        'SC', // General SC check
        'AT2040',
        'YCM',
        'Lauten',
        'Series Black',
        'NT1 5th Generation Silver',
        'C 104',
        'C 114'
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

findBatch12();
