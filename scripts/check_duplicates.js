import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkDuplicates() {
    console.log("🔍 Checking for duplicate products...\n");

    // Get all products
    const { data: products } = await supabase
        .from('products')
        .select('id, name, slug, category_id')
        .order('name');

    // Check for duplicate slugs
    const slugs = {};
    const duplicates = [];

    products.forEach(p => {
        if (slugs[p.slug]) {
            duplicates.push({ slug: p.slug, ids: [slugs[p.slug], p.id] });
        } else {
            slugs[p.slug] = p.id;
        }
    });

    if (duplicates.length > 0) {
        console.log("⚠️ DUPLICATES FOUND:");
        duplicates.forEach(d => console.log(`  - ${d.slug}: ${d.ids.join(', ')}`));
    } else {
        console.log("✅ No duplicate slugs found.");
    }

    // Check GoPro specifically
    const { data: gopros } = await supabase
        .from('products')
        .select('id, name, slug, rating, review_count, pros, cons, description')
        .ilike('name', '%gopro%');

    console.log(`\n📷 GoPro products found: ${gopros.length}`);
    gopros.forEach(g => {
        console.log(`\n  ID: ${g.id}`);
        console.log(`  Name: ${g.name}`);
        console.log(`  Slug: ${g.slug}`);
        console.log(`  Rating: ${g.rating}`);
        console.log(`  Reviews: ${g.review_count}`);
        console.log(`  Pros: ${JSON.stringify(g.pros)}`);
        console.log(`  Cons: ${JSON.stringify(g.cons)}`);
    });
}

checkDuplicates();
