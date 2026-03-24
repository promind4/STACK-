
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchLinks() {
  const slugs = ['sony-zv-e10', 'focusrite-scarlett-2i2-4th-gen', 'shure-sm7b', 'shure-mv7x'];
  
  for (const slug of slugs) {
    console.log(`\n--- ${slug} ---`);
    const { data, error } = await supabase
      .from('products')
      .select('name, product_offers(merchant_name, affiliate_link, price)')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error(`Error fetching ${slug}:`, error.message);
      continue;
    }
    
    if (data && data.product_offers) {
      data.product_offers.forEach(offer => {
        console.log(`${offer.merchant_name}: ${offer.affiliate_link} (${offer.price}€)`);
      });
    }
  }
}

fetchLinks();
