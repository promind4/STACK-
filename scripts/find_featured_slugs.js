import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function findSlugs() {
    const queries = ['Focusrite', 'Stream Deck', 'Sony', 'Shure SM7B', 'Key Light'];

    for (const q of queries) {
        const { data } = await supabase
            .from('products')
            .select('name, slug')
            .ilike('name', `%${q}%`)
            .limit(5);

        console.log(`\n--- Results for "${q}" ---`);
        data?.forEach(p => console.log(`${p.slug}  |  ${p.name}`));
    }
}

findSlugs();
