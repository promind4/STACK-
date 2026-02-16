
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data, error } = await supabase
        .from('products')
        .select('description')
        .eq('slug', 'ycm705-w')
        .single();

    if (error) {
        console.log('Error:', error);
    } else {
        console.log('--- CONTENT START ---');
        console.log(data.description);
        console.log('--- CONTENT END ---');
    }
}

check();
