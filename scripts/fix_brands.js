import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY; // Using Anon key might have RLS issues for update? 
// Usually scripts need Service Role key for updates if RLS is on.
// But previous scripts worked? If RLS allows Anon update... likely not.
// I should check if I have a SERVICE_ROLE_KEY in env, or if ANON key works.
// If previous scripts worked, ANON might be fine or RLS is off.
// Let's try. If it fails, I'll ask user or look for service key.

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BRAND_MAPPINGS = [
    { pattern: /Rode|Røde/i, brand: 'Rode' },
    { pattern: /Heil Sound/i, brand: 'Heil Sound' },
    { pattern: /Electro-Voice/i, brand: 'Electro-Voice' },
    { pattern: /Shure/i, brand: 'Shure' },
    { pattern: /Sony/i, brand: 'Sony' },
    { pattern: /Elgato/i, brand: 'Elgato' },
    { pattern: /Logitech/i, brand: 'Logitech' },
    { pattern: /Sennheiser/i, brand: 'Sennheiser' },
    { pattern: /Audio-Technica/i, brand: 'Audio-Technica' },
    { pattern: /Canon/i, brand: 'Canon' },
    { pattern: /Nikon/i, brand: 'Nikon' },
    { pattern: /Panasonic/i, brand: 'Panasonic' },
    { pattern: /Fujifilm/i, brand: 'Fujifilm' },
    { pattern: /Blackmagic/i, brand: 'Blackmagic Design' },
    { pattern: /Neumann/i, brand: 'Neumann' },
    { pattern: /Beyerdynamic/i, brand: 'Beyerdynamic' },
    { pattern: /Mackie/i, brand: 'Mackie' },
    { pattern: /PreSonus/i, brand: 'PreSonus' },
    { pattern: /Audient/i, brand: 'Audient' },
    { pattern: /Focusrite/i, brand: 'Focusrite' },
    { pattern: /Universal Audio/i, brand: 'Universal Audio' },
    { pattern: /Behringer/i, brand: 'Behringer' },
    { pattern: /Aputure/i, brand: 'Aputure' },
    { pattern: /Nanlite/i, brand: 'Nanlite' },
    { pattern: /Godox/i, brand: 'Godox' },
    { pattern: /Amaran/i, brand: 'Amaran' }
];

async function fixBrands() {
    console.log('Fetching products with missing brands...');

    const { data: products, error } = await supabase
        .from('products')
        .select('id, name, brand');

    if (error) {
        console.error('Error fetching:', error);
        return;
    }

    const missing = products.filter(p => !p.brand || p.brand === 'Inconnue' || p.brand === 'Unknown' || p.brand === 'null');

    console.log(`Found ${missing.length} products to fix.`);

    for (const p of missing) {
        let newBrand = null;

        for (const mapping of BRAND_MAPPINGS) {
            if (mapping.pattern.test(p.name)) {
                newBrand = mapping.brand;
                break;
            }
        }

        if (newBrand) {
            console.log(`Fixing [${p.name}]: "${p.brand}" -> "${newBrand}"`);
            const { error: updateError } = await supabase
                .from('products')
                .update({ brand: newBrand })
                .eq('id', p.id);

            if (updateError) console.error(`Failed to update ${p.name}:`, updateError);
        } else {
            console.log(`Could not infer brand for [${p.name}]`);
        }
    }
}

fixBrands();
