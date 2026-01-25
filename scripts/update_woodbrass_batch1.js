
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const UPDATES = [
    { name: 'Electro-Voice RE20', link: 'https://www.woodbrass.com/microphones-dynamiques-electrovoice-re-20-p170796.html' },
    { name: 'LCT 440 PURE', link: 'https://www.woodbrass.com/microphones-a-large-membrane-lewitt-lct-440-pure-p259027.html' },
    { name: '023', link: 'https://www.woodbrass.com/microphones-a-large-membrane-soyuz-023-bomblet-p302070.html' }, // DB name is '023' for Soyuz 023
    { name: 'Shure SM7B', link: 'https://www.woodbrass.com/microphones-dynamiques-shure-sm7b-p9415.html' },
    { name: 'NT1 5th Generation Black', link: 'https://www.woodbrass.com/microphones-a-large-membrane-rode-nt1-gen-5-black-p373379.html' }
];

async function updateLinks() {
    console.log("Updating 5 verified Woodbrass links...");

    for (const update of UPDATES) {
        // Find product ID first to be safe
        const { data: products } = await supabase
            .from('products')
            .select('id')
            .ilike('name', `%${update.name}%`)
            .limit(1);

        if (products && products.length > 0) {
            const pid = products[0].id;
            const { error } = await supabase
                .from('product_offers')
                .update({ affiliate_link: update.link })
                .eq('product_id', pid)
                .eq('merchant_name', 'woodbrass');

            if (!error) console.log(`✅ Updated ${update.name}`);
            else console.error(`❌ Error updating ${update.name}:`, error.message);
        } else {
            console.warn(`⚠️ Product not found for ${update.name}`);
        }
    }
}

updateLinks();
