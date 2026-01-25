
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'frontend', '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function fetchBatch7() {
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

    // Batch 6 was 50-70.
    // Batch 7 is 70-90.
    const batch = pending.slice(70, 90);

    const fs = await import('fs');
    fs.writeFileSync(path.resolve(process.cwd(), 'frontend', 'scripts', 'batch_7_data.json'), JSON.stringify(batch, null, 2));
    console.log(`fetching pending.slice(70, 90)`);
    console.log(`Saved ${batch.length} products to batch_7_data.json. Total pending in DB: ${pending.length}`);
}

fetchBatch7();
