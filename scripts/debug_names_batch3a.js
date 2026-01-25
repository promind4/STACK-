
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

const keywords = ['RAY', 'Stealth', 'WA-251', 'WA-67', 'AE 3000', 'AE3000'];

async function checkNames() {
    for (const k of keywords) {
        const { data, error } = await supabase
            .from('products')
            .select('id, name')
            .ilike('name', `%${k}%`);

        if (error) console.error(k, error);
        else {
            console.log(`Results for "${k}":`);
            data.forEach(d => console.log(` - ${d.name} (${d.id})`));
        }
    }
}

checkNames();
