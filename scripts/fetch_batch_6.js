
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'frontend', '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function fetchBatch6() {
    const { data, error } = await supabase
        .from('products')
        .select('id, name, description, pros')
        .order('name'); // Ordering by name ensures consistent slicing

    if (error) {
        console.error(error);
        return;
    }

    // Filter pending (empty pros)
    // Note: This includes Batches 3, 4, and 5 if the user hasn't run the SQL scripts yet.
    const pending = data.filter(p => !p.pros || (Array.isArray(p.pros) && p.pros.length === 0));

    // Batch 3 (10) + Batch 4 (20) + Batch 5 (20) = 50 items already processed but maybe not updated.
    // So we fetch index 50 to 70.
    const batch = pending.slice(50, 70);

    // console.log(JSON.stringify(batch, null, 2));
    const fs = await import('fs');
    fs.writeFileSync(path.resolve(process.cwd(), 'frontend', 'scripts', 'batch_6_data.json'), JSON.stringify(batch, null, 2));
    console.log(`fetching pending.slice(50, 70)`);
    console.log(`Saved ${batch.length} products to batch_6_data.json. Total pending in DB: ${pending.length}`);
}

fetchBatch6();
