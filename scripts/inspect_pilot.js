
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function inspectPilot() {
    const { data, error } = await supabase
        .from('products')
        // SM7B ID from pilot script
        .select('id, name, description, pros')
        .eq('id', '70ddf166-76b6-4f4e-bbe0-c79f325abee3');

    if (error) {
        console.error(error);
    } else {
        console.log(JSON.stringify(data, null, 2));
    }
}

inspectPilot();
