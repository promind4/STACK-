
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function find() {
    console.log("Searching for Secondary Legends...");
    // Searching for classics: SM58, SM57, U87, C414, E835, AT2020 (standard)
    const { data, error } = await supabase
        .from('products')
        .select('id, name, slug')
        .or('name.ilike.%SM58%,name.ilike.%SM57%,name.ilike.%U87%,name.ilike.%C414%,name.ilike.%e 835%,name.ilike.%AT2020%');

    if (error) console.error(error);
    else console.log(JSON.stringify(data, null, 2));
}

find();
