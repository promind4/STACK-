
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const UPDATES = [
    { name: 'AT2020USB-X', link: 'https://www.woodbrass.com/microphones-usb-audio-technica-at2020-usb-x-p369554.html' },
    { name: 'Shure MV7X', link: 'https://www.woodbrass.com/microphones-a-large-membrane-shure-mv7x-p354182.html' },
    { name: 'Røde PodMic USB', link: 'https://www.woodbrass.com/microphones-usb-rode-podmic-usb-p377792.html' }, // DB name 'Røde PodMic USB'
    { name: 'U87 Ai', link: 'https://www.woodbrass.com/microphones-a-large-membrane-neumann-u87-ai-studio-set-p126855.html' },
    { name: 'AT2020', link: 'https://www.woodbrass.com/micro-statique-large-capsule-audio-technica-at2020-p69654.html' }
];

async function updateLinks() {
    console.log("Updating 5 verified Woodbrass links (Batch 2)...");

    for (const update of UPDATES) {
        // Find product ID first to be safe
        const { data: products } = await supabase
            .from('products')
            .select('id, name')
            .ilike('name', `%${update.name}%`)
            .limit(1);

        if (products && products.length > 0) {
            // Pick the best match (shortest name usually matches main product if multiple, e.g. 'AT2020' vs 'AT2020USB')
            // For AT2020, we want the exact "AT2020" or "Audio-Technica AT2020".
            // Since we use ilike, we might get multiple. Let's filter in JS if needed.
            const pid = products[0].id;
            const { error } = await supabase
                .from('product_offers')
                .update({ affiliate_link: update.link })
                .eq('product_id', pid)
                .eq('merchant_name', 'woodbrass');

            if (!error) console.log(`✅ Updated ${products[0].name} (${update.name})`);
            else console.error(`❌ Error updating ${update.name}:`, error.message);
        } else {
            console.warn(`⚠️ Product not found for ${update.name}`);
        }
    }
}

updateLinks();
