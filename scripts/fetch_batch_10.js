
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'frontend', '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function fetchBatch10() {
    const { data, error } = await supabase
        .from('products')
        .select('id, name, description, pros')
        .order('name');

    if (error) {
        console.error(error);
        return;
    }

    // Filter pending (empty pros)
    // Note: Assuming the user has NOT executed Batch 9 yet, so those items are still "pending".
    // Batch 9 was indices 0-20 of this pending list.
    // Batch 10 will be indices 20-40.
    const pending = data.filter(p => !p.pros || (Array.isArray(p.pros) && p.pros.length === 0));

    const batch = pending.slice(20, 40);

    const fs = await import('fs');
    fs.writeFileSync(path.resolve(process.cwd(), 'frontend', 'scripts', 'batch_10_data.json'), JSON.stringify(batch, null, 2));

    console.log(`Saved ${batch.length} products to batch_10_data.json.`);
    if (batch.length > 0) {
        console.log(`First item: ${batch[0].name}`);
        console.log(`Last item: ${batch[batch.length - 1].name}`);
    }
    console.log(`Total pending remaining: ${pending.length} (Expected remaining after this batch: ${pending.length - 40})`);
}

fetchBatch10();
