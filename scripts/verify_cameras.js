
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const TARGET_SLUGS = [
    'sony-alpha-7-iv',
    'sony-zv-e10',
    'canon-eos-r50',
    'panasonic-lumix-gh6',
    'sony-alpha-6700',
    'gopro-hero12-black',
    'dji-osmo-action-4',
    'insta360-ace-pro'
];

async function verify() {
    console.log("🔍 Verifying Camera Products...");

    const { data: products, error } = await supabase
        .from('products')
        .select(`
      id, name, slug, category_id, image_url,
      category:categories(name, parent_id),
      offers:product_offers(id, merchant_name, price)
    `)
        .in('slug', TARGET_SLUGS);

    if (error) {
        console.error("❌ DB Error:", error);
        return;
    }

    console.log(`\nFound ${products.length} / ${TARGET_SLUGS.length} products.`);

    products.forEach(p => {
        console.log(`\n✅ [${p.name}]`);
        console.log(`   - ID: ${p.id}`);
        console.log(`   - Category: ${p.category?.name} (Parent: ${p.category?.parent_id ? 'Has Parent' : 'No Parent'})`);
        console.log(`   - Image: ${p.image_url ? '✅ Set' : '❌ MISSING'}`);
        if (p.offers.length > 0) {
            console.log(`   - Offer: ✅ Linked (${p.offers[0].merchant_name}: ${p.offers[0].price}€)`);
        } else {
            console.log(`   - Offer: ❌ NO OFFER FOUND`);
        }
    });
}

verify();
