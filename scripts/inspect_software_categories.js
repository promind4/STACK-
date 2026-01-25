import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function inspectCategories() {
    console.log("🔍 INSPECTING STREAMING/SOFTWARE CATEGORIES\n");

    // Find categories with names related to the request
    const { data: categories, error } = await supabase
        .from('categories')
        .select('id, name, slug, parent_id')
        .or('slug.eq.obs,slug.eq.overlays,slug.eq.alerts,slug.eq.alerte,name.ilike.%obs%,name.ilike.%overlay%,name.ilike.%alert%');

    if (error) {
        console.log(`❌ Error: ${error.message}`);
        return;
    }

    console.log("Found Categories:");
    console.table(categories);

    if (categories.length > 0) {
        // Check products in these categories
        const ids = categories.map(c => c.id);
        const { data: products } = await supabase
            .from('products')
            .select('id, name, category_id')
            .in('category_id', ids);

        console.log("\nProducts in these categories:");
        products.forEach(p => {
            const cat = categories.find(c => c.id === p.category_id);
            console.log(`- [${cat?.name}] ${p.name} (${p.id})`);
        });
    }
}

inspectCategories();
