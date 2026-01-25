
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function fetchBatch5() {
    const { data, error } = await supabase
        .from('products')
        .select('id, name, description, pros')
        .order('name');

    if (error) {
        console.error(error);
        return;
    }

    // Filter pending (empty pros)
    const pending = data.filter(p => !p.pros || (Array.isArray(p.pros) && p.pros.length === 0));

    // Take next 20
    const batch = pending.slice(0, 20);

    console.log(JSON.stringify(batch, null, 2));
    console.log(`Found ${batch.length} products to enrich out of ${pending.length} pending.`);
}

fetchBatch5();
