
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function find() {
    console.log("Searching for Batch 9 Boutique (Gefell, Bock, Soyuz, Premier)...");

    // Get existing offers to exclude
    const { data: offers } = await supabase.from('product_offers').select('product_id, merchant_name');
    const existingIds = new Set(
        offers
            .filter(o => o.merchant_name === 'amazon' || o.merchant_name === 'woodbrass')
            .map(o => o.product_id)
    );

    // Search for the identified groups
    // "M " matches Microtech Gefell often named like "M 930"
    // "Bock"
    // "Premier" (Golden Age Premier)
    // "023" (Soyuz)
    // "Authentica" (Lewitt High End)
    // "Manley"
    // "Chandler"
    const { data: products } = await supabase
        .from('products')
        .select('id, name, slug')
        .or('name.ilike.%M 9%,name.ilike.%M 1%,name.ilike.%Bock%,name.ilike.%Premier%,name.ilike.%023%,name.ilike.%Authentica%,name.ilike.%Manley%,name.ilike.%Chandler%,name.ilike.%Soyuz%');

    // Filter missing
    const missing = products.filter(p => !existingIds.has(p.id));

    console.log(`Found ${missing.length} items for Batch 9.`);
    console.log(JSON.stringify(missing, null, 2));
}

find();
