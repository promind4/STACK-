/**
 * Sélection des meilleurs micros à condensateur pour optimisation prioritaire
 * Filtre par mots-clés populaires
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const CATEGORY_ID = '43d5be4c-a70b-4f24-b7b1-402422c17937';

const TARGET_KEYWORDS = [
    'NT1',
    'AT2020',
    'TLM 102',
    'TLM 103',
    'X1 S',
    'Bluebird',
    'Spark',
    'LCT 440',
    'LCT 240',
    'C214',
    'C414'
];

async function selectTopProducts() {
    console.log('\\n🔍 Filtering Top Condenser Mics...\\n');

    const { data: products, error } = await supabase
        .from('products')
        .select('id, name, slug, brand')
        .eq('category_id', CATEGORY_ID);

    if (error) {
        console.error('Error:', error);
        return;
    }

    // Filter locally
    const selected = products.filter(p => {
        return TARGET_KEYWORDS.some(k => p.name.includes(k) || p.slug.includes(k.replace(/\s+/g, '-').toLowerCase()));
    });

    console.log(`Found ${selected.length} priority products matching keywords: ${TARGET_KEYWORDS.join(', ')}\\n`);

    for (const p of selected) {
        console.log(`🎯 ${p.name} (${p.brand}) [Slug: ${p.slug}]`);
    }

    // Sort alphabetically to maintain order
    selected.sort((a, b) => a.name.localeCompare(b.name));

    return selected;
}

selectTopProducts();
