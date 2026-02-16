
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkInventory() {
    const { data: products, error } = await supabase
        .from('products')
        .select('name, slug, description')
        .eq('is_active', true);

    if (error) {
        console.error('Error:', error);
        return;
    }

    const categories = {
        'Cable': 0,
        'Stand/Bras': 0,
        'Headphone/Casque': 0,
        'Green Screen': 0,
        'Treatment/Mousse': 0,
        'Interface': 0,
        'Mic': 0,
        'Camera': 0
    };

    const details = {
        'Cable': [],
        'Stand/Bras': [],
        'Headphone/Casque': [],
        'Treatment/Mousse': []
    };

    products.forEach(p => {
        const text = (p.name + ' ' + p.slug + ' ' + (p.description || '')).toLowerCase();

        if (text.includes('cable') || text.includes('câble') || text.includes('xlr')) {
            categories['Cable']++;
            details['Cable'].push(p.name);
        }
        if (text.includes('stand') || text.includes('bras') || text.includes('boom') || text.includes('pied') || text.includes('arm')) {
            categories['Stand/Bras']++;
            details['Stand/Bras'].push(p.name);
        }
        if (text.includes('casque') || text.includes('headphone') || text.includes('dt 770')) {
            categories['Headphone/Casque']++;
            details['Headphone/Casque'].push(p.name);
        }
        if (text.includes('green screen') || text.includes('fond vert')) {
            categories['Green Screen']++;
        }
        if (text.includes('mousse') || text.includes('panel') || text.includes('akustik') || text.includes('traitement')) {
            categories['Treatment/Mousse']++;
            details['Treatment/Mousse'].push(p.name);
        }
        if (text.includes('interface') || text.includes('carte son')) {
            categories['Interface']++;
        }
        if (text.includes('mic') || text.includes('micro')) {
            categories['Mic']++;
        }
        if (text.includes('cam') || text.includes('brio') || text.includes('sony')) {
            categories['Camera']++;
        }
    });

    console.log('--- INVENTORY REPORT ---');
    console.table(categories);

    console.log('\n--- DETAILS: CABLES ---');
    console.log(details['Cable'].slice(0, 10));

    // console.log('\n--- DETAILS: STANDS ---');
    // console.log(details['Stand/Bras'].slice(0, 10));

    // console.log('\n--- DETAILS: HEADPHONES ---');
    // console.log(details['Headphone/Casque'].slice(0, 10));

    // console.log('\n--- DETAILS: TREATMENT ---');
    // console.log(details['Treatment/Mousse'].slice(0, 10));
}

checkInventory();
