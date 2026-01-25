import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Use ANON key to simulate frontend
const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function testFrontendAccess() {
    console.log("🔐 TESTING ANON/FRONTEND ACCESS TO NEW CATEGORIES\n");
    console.log("=".repeat(60));

    // Test 1: Can we read the grand-angle category?
    console.log("\n1️⃣ Testing category lookup (grand-angle)...");
    const { data: cat, error: catErr } = await supabase
        .from('categories')
        .select('id, name, slug')
        .eq('slug', 'grand-angle')
        .single();

    if (catErr) {
        console.log(`   ❌ CATEGORY ERROR: ${catErr.message}`);
        console.log(`   Code: ${catErr.code}`);
        return;
    }
    console.log(`   ✅ Found: ${cat.name} (${cat.id})`);

    // Test 2: Can we read products in that category?
    console.log("\n2️⃣ Testing products in grand-angle...");
    const { data: products, error: prodErr } = await supabase
        .from('products')
        .select('id, name, slug')
        .eq('category_id', cat.id)
        .eq('is_active', true);

    if (prodErr) {
        console.log(`   ❌ PRODUCTS ERROR: ${prodErr.message}`);
        console.log(`   Code: ${prodErr.code}`);
        return;
    }
    console.log(`   ✅ Found ${products.length} products:`);
    products.forEach(p => console.log(`      - ${p.name}`));

    console.log("\n" + "=".repeat(60));
    console.log("✅ All tests passed! Frontend should be able to access these.");
}

testFrontendAccess();
