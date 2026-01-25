import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const CAMERA_SLUGS = [
    'sony-alpha-7-iv',
    'sony-zv-e10',
    'canon-eos-r50',
    'panasonic-lumix-gh6',
    'sony-alpha-6700',
    'gopro-hero12-black',
    'dji-osmo-action-4',
    'insta360-ace-pro'
];

async function verifyAll() {
    console.log("🔍 COMPREHENSIVE CAMERA PRODUCTS VERIFICATION\n");
    console.log("=".repeat(60));

    let issues = [];

    for (const slug of CAMERA_SLUGS) {
        const { data: product, error } = await supabase
            .from('products')
            .select(`
        id, name, slug, rating, review_count, pros, cons, description,
        offers:product_offers(merchant_name, price, affiliate_link, in_stock)
      `)
            .eq('slug', slug)
            .single();

        if (error || !product) {
            console.log(`\n❌ [${slug}] NOT FOUND IN DB`);
            issues.push({ slug, issue: 'Product not found' });
            continue;
        }

        console.log(`\n📦 [${product.name}]`);
        console.log(`   ID: ${product.id}`);

        // Check Pros/Cons
        const hasPros = Array.isArray(product.pros) && product.pros.length > 0;
        const hasCons = Array.isArray(product.cons) && product.cons.length > 0;

        if (hasPros) {
            console.log(`   ✅ Pros: ${product.pros.length} items`);
            product.pros.forEach(p => console.log(`      • ${p}`));
        } else {
            console.log(`   ⚠️ Pros: MISSING or EMPTY`);
            issues.push({ slug, issue: 'Missing pros' });
        }

        if (hasCons) {
            console.log(`   ✅ Cons: ${product.cons.length} items`);
            product.cons.forEach(c => console.log(`      • ${c}`));
        } else {
            console.log(`   ⚠️ Cons: MISSING or EMPTY`);
            issues.push({ slug, issue: 'Missing cons' });
        }

        // Check Offers
        if (product.offers && product.offers.length > 0) {
            console.log(`   📎 Offers: ${product.offers.length}`);
            product.offers.forEach(o => {
                const link = o.affiliate_link || '';
                // Check if link looks valid (basic check)
                const isValidFormat = link.startsWith('https://www.amazon.fr/') || link.startsWith('https://www.thomann.de/');
                const hasASIN = /\/dp\/[A-Z0-9]{10}/.test(link); // Amazon ASIN pattern

                console.log(`      [${o.merchant_name}] ${o.price}€`);
                console.log(`         Link: ${link.substring(0, 80)}...`);

                if (!isValidFormat) {
                    console.log(`         ⚠️ INVALID FORMAT (not Amazon/Thomann)`);
                    issues.push({ slug, issue: `Invalid link format for ${o.merchant_name}` });
                }
                if (link.includes('amazon.fr') && !hasASIN) {
                    console.log(`         ⚠️ MISSING ASIN (Amazon product ID)`);
                    issues.push({ slug, issue: `Missing ASIN in Amazon link` });
                }
            });
        } else {
            console.log(`   ❌ NO OFFERS FOUND`);
            issues.push({ slug, issue: 'No offers' });
        }

        // Check Rating
        if (!product.rating || product.rating === 0) {
            console.log(`   ⚠️ Rating: MISSING`);
            issues.push({ slug, issue: 'Missing rating' });
        } else {
            console.log(`   ✅ Rating: ${product.rating} (${product.review_count} reviews)`);
        }
    }

    console.log("\n" + "=".repeat(60));
    console.log("📊 SUMMARY");
    console.log("=".repeat(60));

    if (issues.length === 0) {
        console.log("✅ All products verified successfully! No issues found.");
    } else {
        console.log(`⚠️ Found ${issues.length} issue(s):\n`);
        issues.forEach(i => console.log(`  - [${i.slug}] ${i.issue}`));
    }
}

verifyAll();
