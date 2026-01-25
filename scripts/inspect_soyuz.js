
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function inspectSoyuz() {
    const { data, error } = await supabase
        .from('products')
        .select('id, name, description, pros, cons')
        .eq('id', 'de7540e6-741b-40d2-89da-2bb269b8954c'); // 017 FET

    if (error) {
        console.error(error);
    } else {
        console.log(JSON.stringify(data, null, 2));
    }
}

inspectSoyuz();
