
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'frontend', '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function fetchBatch11() {
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

    // Batch 9: 0-20
    // Batch 10: 20-40
    // Batch 11: 40-60
    const batch = pending.slice(40, 60);

    const fs = await import('fs');
    fs.writeFileSync(path.resolve(process.cwd(), 'frontend', 'scripts', 'batch_11_data.json'), JSON.stringify(batch, null, 2));

    console.log(`Saved ${batch.length} products to batch_11_data.json.`);
    if (batch.length > 0) {
        console.log(`First item: ${batch[0].name}`);
        console.log(`Last item: ${batch[batch.length - 1].name}`);
    }
    console.log(`Total pending remaining in DB: ${pending.length} (Expected remaining after this batch: ${pending.length - 60})`);
}

fetchBatch11();
