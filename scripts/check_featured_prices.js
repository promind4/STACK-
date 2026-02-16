
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const slugs = [
    'focusrite-scarlett-2i2-4th-gen',
    'shure-sm7b',
    'sony-zv-e10',
    'elgato-stream-deck-mk2'
];

async function check() {
    const { data, error } = await supabase
        .from('products')
        .select('slug, price')
        .in('slug', slugs);

    if (error) {
        console.log('Error:', error);
    } else {
        console.table(data);
    }
}

check();
