
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function findCandidates() {
    const { data, error } = await supabase
        .from('products')
        .select('id, name')
        .or('name.ilike.%SM7B%,name.ilike.%U87%,name.ilike.%AT2020%,name.ilike.%Scarlett%,name.ilike.%Cloudlifter%');

    if (error) {
        console.error(error);
        return;
    }
    console.log(JSON.stringify(data, null, 2));
}

findCandidates();
