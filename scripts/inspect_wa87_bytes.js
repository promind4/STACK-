
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function inspectBytes() {
    const { data: products, error } = await supabase
        .from('products')
        .select('id, name, description')
        .ilike('name', '%WA-87 R2%')
        .limit(1);

    if (error) {
        console.error(error);
        return;
    }

    const desc = products[0].description;
    console.log('Description:', desc);

    // Find "cardio"
    const index = desc.indexOf('cardio');
    if (index !== -1) {
        // Print chars around it
        const snippet = desc.substring(index, index + 10);
        console.log('Snippet:', snippet);
        for (let i = 0; i < snippet.length; i++) {
            console.log(`Char at ${i} (${snippet[i]}): ${snippet.charCodeAt(i)} (0x${snippet.charCodeAt(i).toString(16)})`);
        }
    }
}

inspectBytes();
