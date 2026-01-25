import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function debug() {
    console.log("🔍 DEBUGGING CATEGORY LOOKUP\n");

    // 1. Check all Objectifs categories
    const { data: objectifsCats } = await supabase
        .from('categories')
        .select('id, name, slug, parent_id')
        .in('slug', ['grand-angle', 'focale-fixe', 'zoom-polyvalent', 'keylight', 'softbox', 'rgb-ambiance']);

    console.log("📁 New Categories in DB:");
    console.log(JSON.stringify(objectifsCats, null, 2));

    // 2. Check products in grand-angle
    if (objectifsCats && objectifsCats.length > 0) {
        const grandAngleCat = objectifsCats.find(c => c.slug === 'grand-angle');
        if (grandAngleCat) {
            console.log(`\n📦 Products in grand-angle (${grandAngleCat.id}):`);
            const { data: products } = await supabase
                .from('products')
                .select('id, name, slug, category_id')
                .eq('category_id', grandAngleCat.id);
            console.log(JSON.stringify(products, null, 2));
        }
    }

    // 3. Check if Objectifs parent exists
    const { data: objectifsParent } = await supabase
        .from('categories')
        .select('id, name, slug')
        .eq('slug', 'objectifs')
        .single();

    console.log("\n📁 Objectifs parent category:");
    console.log(JSON.stringify(objectifsParent, null, 2));
}

debug();
