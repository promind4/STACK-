
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function findBatch10() {
    const brands = [
        'DynaCaster', // sE
        'Procaster',  // Rode
        'AT2040',     // Audio-Technica
        'TG ',        // Beyerdynamic (note space to avoid matching other things containing TG)
        'Series Black' // Lauten Audio
    ];

    for (const brand of brands) {
        const { data, error } = await supabase
            .from('products')
            .select('id, name')
            .ilike('name', `%${brand}%`)
            .limit(10);

        if (error) console.error(brand, error);
        else {
            console.log(`\n--- ${brand} ---`);
            data.forEach(p => console.log(`"${p.name}": "${p.id}",`));
        }
    }
}

findBatch10();
