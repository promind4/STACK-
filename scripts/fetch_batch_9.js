
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'frontend', '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function fetchBatch9() {
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

    // Batch 8 was 90-110 (relative to original list).
    // Current pending count is ~109. This implies previous batches (0-110) are largely done.
    // We'll peek at the top of the pending list.
    const topPending = pending.slice(0, 10).map(p => p.name);
    console.log("Top 10 Pending Items:", JSON.stringify(topPending, null, 2));

    // We'll speculatively save the first 20 pending items as Batch 9
    const batch = pending.slice(0, 20);

    const fs = await import('fs');
    fs.writeFileSync(path.resolve(process.cwd(), 'frontend', 'scripts', 'batch_9_data.json'), JSON.stringify(batch, null, 2));
    console.log(`Saved ${batch.length} products to batch_9_data.json`);
}

fetchBatch9();
