
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function find() {
    console.log("Searching for Batch 8 Premium Consolidation...");

    // Get existing offers to exclude
    const { data: offers } = await supabase.from('product_offers').select('product_id, merchant_name');
    const existingIds = new Set(
        offers
            .filter(o => o.merchant_name === 'amazon' || o.merchant_name === 'woodbrass')
            .map(o => o.product_id)
    );

    // Search for the identified groups
    const { data: products } = await supabase
        .from('products')
        .select('id, name, slug')
        .or('name.ilike.%NT1 Signature%,name.ilike.%TLM%,name.ilike.%WA-87jr%,name.ilike.%WA-47jr%,name.ilike.%LCT%,name.ilike.%PURE TUBE%');

    // Filter missing
    const missing = products.filter(p => !existingIds.has(p.id));

    console.log(`Found ${missing.length} items for Batch 8.`);
    console.log(JSON.stringify(missing, null, 2));
}

find();
