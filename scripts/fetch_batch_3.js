
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function fetchBatch3() {
    const { data, error } = await supabase
        .from('products')
        .select('id, name, description, pros')
        .order('name');

    if (error) {
        console.error(error);
        return;
    }

    // Filter pending (empty pros)
    // Exclude previously done
    const pending = data.filter(p => !p.pros || (Array.isArray(p.pros) && p.pros.length === 0));

    // Take next 10
    const batch = pending.slice(0, 10);

    console.log(JSON.stringify(batch, null, 2));
}

fetchBatch3();
