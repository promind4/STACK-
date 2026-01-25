import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from frontend/.env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function auditBrands() {
    console.log('Fetching all products...');

    // Fetch columns: id, name, brand
    const { data: products, error } = await supabase
        .from('products')
        .select('id, name, brand');

    if (error) {
        console.error('Error fetching:', error);
        return;
    }

    const missing = products.filter(p => !p.brand || p.brand === 'Inconnue' || p.brand === 'Unknown');

    console.log(`\nTotal products: ${products.length}`);
    console.log(`Products with missing/unknown brand: ${missing.length}`);

    if (missing.length > 0) {
        console.log('\n--- Missing Brands ---');
        missing.forEach(p => {
            console.log(`[${p.id}] ${p.name} (Current: "${p.brand}")`);
        });
    }
}

auditBrands();
