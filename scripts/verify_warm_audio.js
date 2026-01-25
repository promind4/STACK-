
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'frontend', '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function verifyWarmAudio() {
    // Fetch all products with 'WA-' or 'Warm Audio' in name
    const { data, error } = await supabase
        .from('products')
        .select('id, name, description, pros')
        .ilike('name', '%WA-%') // Warm Audio usually starts with WA-
        .order('name');

    if (error) {
        console.error(error);
        return;
    }

    // Also try ILIKE 'Warm Audio%' just in case
    const { data: data2, error: error2 } = await supabase
        .from('products')
        .select('id, name, description, pros')
        .ilike('name', '%Warm Audio%')
        .order('name');

    // Merge unique by ID
    const combined = [...data, ...(data2 || [])];
    const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());

    // Sort
    unique.sort((a, b) => a.name.localeCompare(b.name));

    console.log(`Found ${unique.length} Warm Audio products.`);
    console.log(JSON.stringify(unique, null, 2));
}

verifyWarmAudio();
