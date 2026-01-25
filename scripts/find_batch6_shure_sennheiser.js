
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function find() {
    console.log("Searching for remaining Shure & Sennheiser...");

    // Get existing offers first to exclude them
    const { data: offers } = await supabase.from('product_offers').select('product_id, merchant_name');
    const existingIds = new Set(
        offers
            .filter(o => o.merchant_name === 'amazon' || o.merchant_name === 'woodbrass')
            .map(o => o.product_id)
    );

    // Fetch all Shure/Sennheiser
    const { data: products } = await supabase
        .from('products')
        .select('id, name, slug')
        .or('name.ilike.%Shure%,name.ilike.%Sennheiser%');

    // Filter out already processed
    const missing = products.filter(p => !existingIds.has(p.id));

    console.log(`Found ${missing.length} remaining Shure/Sennheiser products.`);
    console.log(JSON.stringify(missing, null, 2));
}

find();
