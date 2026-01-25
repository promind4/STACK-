
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function analyze() {
    console.log("Fetching all products...");
    const { data: allProducts, error: prodError } = await supabase
        .from('products')
        .select('id, name, slug');

    if (prodError) {
        console.error("Error fetching products:", prodError);
        return;
    }

    console.log(`Total Products: ${allProducts.length}`);

    console.log("Fetching existing offers...");
    const { data: offers, error: offerError } = await supabase
        .from('product_offers')
        .select('product_id, merchant_name');

    if (offerError) {
        console.error("Error fetching offers:", offerError);
        return;
    }

    // Get IDs that have Amazon OR Woodbrass offers
    const productsWithComparator = new Set(
        offers
            .filter(o => o.merchant_name === 'amazon' || o.merchant_name === 'woodbrass')
            .map(o => o.product_id)
    );
    console.log(`Products with Amazon/Woodbrass: ${productsWithComparator.size}`);

    // Filter missing
    const missing = allProducts.filter(p => !productsWithComparator.has(p.id));
    console.log(`Products missing Comparator offers: ${missing.length}`);

    // Group by Brand (first word)
    const brandCounts = {};
    const brandExamples = {};

    missing.forEach(p => {
        const brand = p.name.split(' ')[0].trim(); // First word as proxy for brand
        brandCounts[brand] = (brandCounts[brand] || 0) + 1;

        if (!brandExamples[brand]) brandExamples[brand] = [];
        if (brandExamples[brand].length < 3) brandExamples[brand].push(p.name);
    });

    // Sort by count
    const sortedBrands = Object.entries(brandCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 15); // Top 15

    console.log("\n--- Top Missing Brands ---");
    sortedBrands.forEach(([brand, count]) => {
        console.log(`${brand}: ${count} items`);
        console.log(`   Examples: ${brandExamples[brand].join(', ')}`);
    });
}

analyze();
