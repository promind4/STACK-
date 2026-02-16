
// Helper to check Supabase connection and data retrieval
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("Testing Supabase connection...");
    console.log(`URL: ${supabaseUrl}`);

    const { data, error } = await supabase
        .from('products')
        .select('id, name, slug, price, category_id')
        .eq('is_active', true)
        .limit(5);

    if (error) {
        console.error("❌ Error fetching products:", error);
    } else {
        console.log(`✅ Success! Found ${data.length} active products (sample).`);
        if (data.length > 0) {
            console.log("Sample product:", data[0]);
        } else {
            console.warn("⚠️ No active products found in DB!");
        }
    }

    // Also check total count
    const { count, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

    if (countError) console.error("❌ Error counting:", countError);
    else console.log(`📊 Total Active Products in DB: ${count}`);
}

check();
