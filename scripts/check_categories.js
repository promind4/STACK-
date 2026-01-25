import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkCategories() {
    console.log("📂 CHECKING CURRENT CATEGORY STRUCTURE\n");

    // Get all categories with parent info
    const { data: categories, error } = await supabase
        .from('categories')
        .select('id, name, slug, parent_id, description')
        .order('name');

    if (error) {
        console.log("Error:", error.message);
        return;
    }

    // Build tree
    const roots = categories.filter(c => !c.parent_id);

    roots.forEach(root => {
        console.log(`\n📁 ${root.name} (${root.slug})`);
        console.log(`   ID: ${root.id}`);

        // Find children
        const children = categories.filter(c => c.parent_id === root.id);
        children.forEach(child => {
            console.log(`   └── ${child.name} (${child.slug})`);
            console.log(`       ID: ${child.id}`);

            // Find grandchildren
            const grandchildren = categories.filter(c => c.parent_id === child.id);
            grandchildren.forEach(gc => {
                console.log(`       └── ${gc.name} (${gc.slug})`);
            });
        });
    });

    // Check for "Images et Lumière" or "Caméras" parent
    const imagesParent = categories.find(c =>
        c.slug === 'images-et-lumiere' ||
        c.slug === 'cameras' ||
        c.name.toLowerCase().includes('image') ||
        c.name.toLowerCase().includes('caméra')
    );

    console.log("\n" + "=".repeat(60));
    if (imagesParent) {
        console.log(`\n✅ Found parent for lenses: ${imagesParent.name} (${imagesParent.id})`);
    } else {
        console.log("\n⚠️ No 'Images et Lumière' parent found - may need to create it");
    }
}

checkCategories();
