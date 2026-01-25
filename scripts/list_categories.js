
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug');

    if (error) {
        console.error(error);
    } else {
        console.log("Categories found:");
        data.forEach(c => console.log(`${c.slug.padEnd(20)} | ${c.name} (${c.id})`));
    }
}

listCategories();
