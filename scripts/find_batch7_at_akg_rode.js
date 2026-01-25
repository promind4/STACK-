
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function find() {
    console.log("Searching for remaining Audio-Technica, AKG, Rode...");

    // Get existing offers first to exclude them
    const { data: offers } = await supabase.from('product_offers').select('product_id, merchant_name');
    const existingIds = new Set(
        offers
            .filter(o => o.merchant_name === 'amazon' || o.merchant_name === 'woodbrass')
            .map(o => o.product_id)
    );

    // Fetch all AT/AKG/Rode
    // Note: 'Røde' might be stored as 'Rode' or 'Røde', so checking 'Rode' usually covers basics if normalized, but I'll search for 'Røde' too just in case.
    const { data: products } = await supabase
        .from('products')
        .select('id, name, slug')
        .or('name.ilike.%Audio-Technica%,name.ilike.%AKG%,name.ilike.%Rode%,name.ilike.%Røde%');

    // Filter out already processed
    const missing = products.filter(p => !existingIds.has(p.id));

    console.log(`Found ${missing.length} remaining AT/AKG/Rode products.`);
    console.log(JSON.stringify(missing, null, 2));
}

find();
