
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual .env parser
const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, val] = line.split('=');
    if (key && val) env[key.trim()] = val.trim().replace(/^["']|["']$/g, ''); // simple trim
});

const supabaseUrl = env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("Testing Supabase connection...");
    console.log(`URL: ${supabaseUrl}`); // Verify URL (safe to log publicly usually, but keeping concise)

    const { data, error } = await supabase
        .from('products')
        .select('id, name, slug, is_active')
        .eq('is_active', true)

    // .limit(5); // Let's count them all first

    if (error) {
        console.error("❌ Error fetching products:", error);
    } else {
        console.log(`✅ Success! Found ${data.length} active products.`);
        if (data.length > 0) {
            console.log("Sample:", data[0].name);
        }
    }
}

check();
