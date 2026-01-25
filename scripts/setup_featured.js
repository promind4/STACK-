import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const LEGENDS = [
    'shure-sm7b',
    'rode-nt1-5th-generation-black', // Verify slug
    'electro-voice-re20',
    'audio-technica-at2020',
    'shure-mv7-k', // Verify slug
    'rode-podmic',
    'beyerdynamic-dt-770-pro-80-ohm',
    'focusrite-scarlett-2i2-4th-gen',
    'cloud-microphones-cloudlifter-cl-1',
    'elgato-stream-deck-mk2',
    'logitech-c920-hd-pro', // check slug
    'sennheiser-mkh-416',
    'neumann-tlm-102-black', // check slug
    'rode-wireless-go-ii',
    'sennheiser-hd-25'
];

async function setupFeatured() {
    console.log('resetting all featured...');
    await supabase.from('products').update({ is_featured: false }).neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Setting legends...');
    // We use a loose match or exact if we know them. To be safe, let's search by name parts if slugs are unsure, 
    // but looking at previous inputs, slugs are standard. I will try to match by partial slug or name to find ID.

    const searchTerms = [
        'SM7B', 'NT1 5th', 'RE20', 'AT2020', 'MV7', 'PodMic', 'DT-770', 'Scarlett 2i2', 'Cloudlifter', 'Stream Deck', 'C920', 'MKH 416', 'TLM 102', 'Wireless GO II', 'HD-25'
    ];

    const featuredIds = [];

    for (const term of searchTerms) {
        const { data } = await supabase.from('products').select('id, name, slug').ilike('name', `%${term}%`).limit(1);
        if (data && data.length > 0) {
            const p = data[0];
            await supabase.from('products').update({ is_featured: true }).eq('id', p.id);
            console.log(`✅ Featured: ${p.name}`);
            featuredIds.push(p);
        } else {
            console.log(`⚠️ Not found: ${term}`);
        }
    }

    console.log('\n--- IDs for Price Research ---');
    console.log(JSON.stringify(featuredIds, null, 2));
}

setupFeatured();
