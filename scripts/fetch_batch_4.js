
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function fetchBatch4() {
    const { data, error } = await supabase
        .from('products')
        .select('id, name, description, pros')
        .order('name');

    if (error) {
        console.error(error);
        return;
    }

    // Filter pending (empty pros)
    // And filter out the ones we know we just did (Batch 3 IDs were fixed manually via SQL, so DB might actullay reflect it now if user ran it!)
    // EXCEPT: The user ran the SQL, so the DB *should* have populated pros for Batch 3.
    // So the filter "empty pros" should correctly SKIP Batch 3.
    const pending = data.filter(p => !p.pros || (Array.isArray(p.pros) && p.pros.length === 0));

    // Take next 20
    const batch = pending.slice(0, 20);

    console.log(JSON.stringify(batch, null, 2));
    console.log(`Found ${batch.length} products to enrich out of ${pending.length} pending.`);
}

fetchBatch4();
