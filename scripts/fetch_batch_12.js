
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'frontend', '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function fetchBatch12() {
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

    // Logic:
    // Pending list (49 items) likely contains:
    // 0-20: Batch 10 (Generated)
    // 20-40: Batch 11 (Generated)
    // 40+: Batch 12 (New)

    // We want the new items.
    const batch = pending.slice(40);

    const fs = await import('fs');
    fs.writeFileSync(path.resolve(process.cwd(), 'frontend', 'scripts', 'batch_12_data.json'), JSON.stringify(batch, null, 2));

    console.log(`Saved ${batch.length} products to batch_12_data.json.`);
    if (batch.length > 0) {
        console.log(`First item: ${batch[0].name}`);
        console.log(`Last item: ${batch[batch.length - 1].name}`);
    }
    console.log(`Items in batch: ${batch.map(p => p.name).join(', ')}`);
}

fetchBatch12();
