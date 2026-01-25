
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function find() {
    console.log("Searching for Batch 3 Workhorses...");
    const { data, error } = await supabase
        .from('products')
        .select('id, name, slug')
        .or('name.ilike.%SM58%,name.ilike.%SM57%,name.ilike.%e 835%,name.ilike.%C214%,name.ilike.%NT1-A%,name.ilike.%AT2035%,name.ilike.%MD 421%,name.ilike.%MD421%,name.ilike.%TLM 103%,name.ilike.%WA-87%');

    if (error) console.error(error);
    else console.log(JSON.stringify(data, null, 2));
}

find();
