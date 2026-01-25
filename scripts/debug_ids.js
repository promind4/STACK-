
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugIds() {
    const names = [
        "Yamaha HS 5",
        "Beyerdynamic DT-770 Pro 80 Ohm",
        "MOTU M2"
    ];

    console.log("Checking DB IDs for names:", names);

    const { data, error } = await supabase
        .from('products')
        .select('id, name')
        .in('name', names);

    if (error) {
        console.error(error);
    } else {
        data.forEach(p => console.log(`${p.name}: ${p.id}`));
    }
}

debugIds();
