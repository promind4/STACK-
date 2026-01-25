import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function auditCatalog() {
    console.log("📊 FULL CATALOG AUDIT\n");
    console.log("=".repeat(70));

    // Get all categories with product counts
    const { data: categories } = await supabase
        .from('categories')
        .select('id, name, slug, parent_id')
        .order('name');

    // Get products per category
    const { data: products } = await supabase
        .from('products')
        .select('id, name, category_id, rating, review_count')
        .eq('is_active', true);

    // Build category tree with product counts
    const catMap = {};
    categories.forEach(c => {
        catMap[c.id] = {
            ...c,
            productCount: 0,
            products: []
        };
    });

    // Count products per category
    products.forEach(p => {
        if (catMap[p.category_id]) {
            catMap[p.category_id].productCount++;
            catMap[p.category_id].products.push(p.name);
        }
    });

    // Find root categories
    const roots = Object.values(catMap).filter(c => !c.parent_id);

    // Print tree
    roots.forEach(root => {
        console.log(`\n📁 ${root.name.toUpperCase()} (${root.productCount} products)`);

        // Find children
        const children = Object.values(catMap).filter(c => c.parent_id === root.id);
        children.forEach(child => {
            const status = child.productCount < 5 ? '⚠️ NEEDS MORE' :
                child.productCount < 10 ? '📦 OKAY' : '✅ GOOD';
            console.log(`   └── ${child.name}: ${child.productCount} products ${status}`);

            if (child.productCount < 10) {
                console.log(`       Products: ${child.products.slice(0, 5).join(', ')}${child.products.length > 5 ? '...' : ''}`);
            }
        });
    });

    // Summary
    console.log("\n" + "=".repeat(70));
    console.log("📋 ENRICHMENT PRIORITIES:\n");

    const needsEnrichment = Object.values(catMap)
        .filter(c => c.productCount > 0 && c.productCount < 8)
        .sort((a, b) => a.productCount - b.productCount);

    needsEnrichment.forEach(c => {
        console.log(`   ⚠️ ${c.name}: ${c.productCount} products → Target: 10-15`);
    });

    // Categories with 0 products (might need products)
    const emptyCategories = Object.values(catMap)
        .filter(c => c.productCount === 0 && !Object.values(catMap).some(child => child.parent_id === c.id));

    if (emptyCategories.length > 0) {
        console.log("\n   📭 Empty categories (no products):");
        emptyCategories.forEach(c => {
            console.log(`      - ${c.name} (${c.slug})`);
        });
    }
}

auditCatalog();
