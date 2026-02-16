
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const SLUGS_TO_CHECK = [
    'ela-m-251e',
    'u87-ai-b-stock',
    'pure-tube-studio-set-b-stock',
    'lct-441-flex-b-stock',
    'nt1-5th-generation-sil-b-stock',
    'procaster-b-stock'
];

async function check() {
    const { data, error } = await supabase
        .from('products')
        .select('slug, name, description, pros')
        .in('slug', SLUGS_TO_CHECK);

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('--- VERIFICATION REPORT ---');
    data.forEach(p => {
        const descLen = p.description ? p.description.length : 0;
        const prosCount = p.pros ? p.pros.length : 0;
        console.log(`[${p.slug}]`);
        console.log(`   Name: ${p.name}`);
        console.log(`   Description Length: ${descLen} chars`);
        console.log(`   Pros Count: ${prosCount}`);
        console.log('---------------------------');
    });
}

check();
