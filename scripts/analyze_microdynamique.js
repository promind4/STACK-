/**
 * Analyse des produits de la catégorie Micros Dynamiques
 * Identifie les fiches incomplètes nécessitant une complétion
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Category ID for "Micros Dynamiques"
const CATEGORY_ID = '3339b393-34ce-4144-bc71-a7655e628d2d';

// Minimum thresholds
const MIN_DESCRIPTION_LENGTH = 1500;
const MIN_PROS = 3;
const MIN_CONS = 1;

async function analyzeProducts() {
    console.log('\\n🎤 Analysing MICROS DYNAMIQUES Category...\\n');

    // Fetch all products in the category with their offers
    const { data: products, error } = await supabase
        .from('products')
        .select(`
            id,
            name,
            slug,
            brand,
            description,
            pros,
            cons,
            image_url,
            gallery_images,
            product_offers (
                id,
                merchant_name,
                price,
                affiliate_link,
                in_stock
            )
        `)
        .eq('category_id', CATEGORY_ID)
        .eq('is_active', true);

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    console.log(`Found ${products.length} products in Micros Dynamiques\\n`);
    console.log('='.repeat(80));

    const incomplete = [];
    const complete = [];

    for (const product of products) {
        const descLength = (product.description || '').length;
        const prosCount = Array.isArray(product.pros) ? product.pros.length : 0;
        const consCount = Array.isArray(product.cons) ? product.cons.length : 0;
        const offersCount = product.product_offers?.length || 0;

        const issues = [];

        if (descLength < MIN_DESCRIPTION_LENGTH) {
            issues.push(`Description: ${descLength} chars (need ${MIN_DESCRIPTION_LENGTH}+)`);
        }
        if (prosCount < MIN_PROS) {
            issues.push(`Pros: ${prosCount} (need ${MIN_PROS}+)`);
        }
        if (consCount < MIN_CONS) {
            issues.push(`Cons: ${consCount} (need ${MIN_CONS}+)`);
        }
        if (offersCount === 0) {
            issues.push('No offers');
        }

        if (issues.length > 0) {
            incomplete.push({ product, issues, descLength, prosCount, consCount, offersCount });
        } else {
            complete.push(product);
        }
    }

    // Print results
    console.log('\\n✅ COMPLETE PRODUCTS:');
    console.log('-'.repeat(40));
    for (const p of complete) {
        console.log(`  • ${p.name} (${p.brand})`);
    }

    console.log('\\n⚠️  INCOMPLETE PRODUCTS:');
    console.log('-'.repeat(40));
    for (const { product, issues, descLength, prosCount, consCount, offersCount } of incomplete) {
        console.log(`\\n  📦 ${product.name} (${product.brand})`);
        console.log(`     Slug: ${product.slug}`);
        console.log(`     Description: ${descLength} chars`);
        console.log(`     Pros: ${prosCount} | Cons: ${consCount} | Offers: ${offersCount}`);
        console.log(`     Issues:`);
        for (const issue of issues) {
            console.log(`       ❌ ${issue}`);
        }
    }

    console.log('\\n' + '='.repeat(80));
    console.log(`\\n📊 SUMMARY:`);
    console.log(`   Complete: ${complete.length}/${products.length}`);
    console.log(`   Incomplete: ${incomplete.length}/${products.length}`);
    console.log('\\n');

    return { complete, incomplete, products };
}

analyzeProducts();
