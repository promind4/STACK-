/**
 * Analyse des produits de la catégorie Micros Statiques / Condensateurs
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

async function findCategoryAndProducts() {
    console.log('\\n🔍 Searching for "Condensateur" or "Statique" category...\\n');

    // 1. Find Category
    const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('id, name, slug')
        .or('name.ilike.%condensateur%,name.ilike.%statique%,slug.ilike.%condenser%,slug.ilike.%static%');

    if (catError) {
        console.error('Error fetching categories:', catError);
        return;
    }

    if (!categories || categories.length === 0) {
        console.log('No matching category found.');
        return;
    }

    console.log('Found categories:');
    categories.forEach(c => console.log(`- ${c.name} (Slug: ${c.slug}) [ID: ${c.id}]`));

    // Assuming the first one or asking user (I'll pick the most relevant one if multiple)
    // For now, let's fetch products for ALL found categories to see which one has the target products like AT2020, NT1

    for (const cat of categories) {
        console.log(`\\n📦 Inspecting products for category: ${cat.name}...`);

        const { data: products, error: prodError } = await supabase
            .from('products')
            .select('id, name, brand, description')
            .eq('category_id', cat.id);

        if (prodError) {
            console.error(`Error fetching products for ${cat.name}:`, prodError);
            continue;
        }

        console.log(`Found ${products.length} products:`);
        products.slice(0, 5).forEach(p => console.log(`  - ${p.name} (${p.brand})`));
        if (products.length > 5) console.log(`  ... and ${products.length - 5} more.`);

        // Log IDs for next step
        if (products.length > 0) {
            console.log(`TARGET CATEGORY SEEMS TO BE: ${cat.id}`);
        }
    }
}

findCategoryAndProducts();
