/**
 * Extract all offers from Microdynamique products for verification
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

const CATEGORY_ID = '3339b393-34ce-4144-bc71-a7655e628d2d';

async function extractOffers() {
    console.log('\\n🔍 Extracting Microdynamique Offers...\\n');

    const { data: products, error } = await supabase
        .from('products')
        .select(`
            id,
            name,
            slug,
            brand,
            product_offers (
                id,
                merchant_name,
                price,
                affiliate_link,
                in_stock
            )
        `)
        .eq('category_id', CATEGORY_ID)
        .eq('is_active', true)
        .order('name');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('='.repeat(100));

    for (const product of products) {
        console.log(`\\n📦 ${product.name} (${product.brand})`);
        console.log(`   Slug: ${product.slug}`);
        console.log(`   ID: ${product.id}`);

        if (product.product_offers && product.product_offers.length > 0) {
            console.log('   Offers:');
            for (const offer of product.product_offers) {
                console.log(`\\n   🏪 ${offer.merchant_name}`);
                console.log(`      Price: ${offer.price}€`);
                console.log(`      In Stock: ${offer.in_stock}`);
                console.log(`      Link: ${offer.affiliate_link}`);
                console.log(`      Offer ID: ${offer.id}`);
            }
        } else {
            console.log('   ⚠️  No offers found');
        }
        console.log('\\n' + '-'.repeat(100));
    }

    // Summary
    const totalOffers = products.reduce((sum, p) => sum + (p.product_offers?.length || 0), 0);
    console.log(`\\n📊 TOTAL: ${products.length} products, ${totalOffers} offers\\n`);
}

extractOffers();
