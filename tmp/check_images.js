const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkImages() {
  const { data: products, error } = await supabase.from('products').select('slug, image_url');
  
  if (error) {
    console.error("Error fetching products:", error);
    return;
  }
  
  console.log(`Found ${products.length} products.`);
  
  const working = [];
  const broken = [];
  
  for (const p of products) {
    if (!p.image_url) continue;
    
    // Check if it's absolute or relative
    let isAbsolute = p.image_url.startsWith('http');
    let hasSpaces = p.image_url.includes(' ');
    let hasSpecial = /[^\w\d\-\.\/:]/.test(p.image_url);
    
    console.log(`[${p.slug}] URL: ${p.image_url.substring(0, 50)}... | Abs: ${isAbsolute} | Spaces: ${hasSpaces} | Special: ${hasSpecial}`);
  }
}

checkImages();
