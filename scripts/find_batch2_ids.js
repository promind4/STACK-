
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function find() {
    console.log("Searching for Batch 2 products...");
    const { data, error } = await supabase
        .from('products')
        .select('id, name, slug')
        .or('name.ilike.%770%,name.ilike.%Scarlett%,name.ilike.%Stream%,name.ilike.%Logitech%,name.ilike.%HD 25%,name.ilike.%HD-25%');

    if (error) console.error(error);
    else console.log(JSON.stringify(data, null, 2));
}

find();
