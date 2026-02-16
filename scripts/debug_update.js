import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

// Test a single update with detailed error logging
async function testUpdate() {
    const productName = "Elgato Ring Light";
    const newData = {
        image_url: "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/ring-light/ring-light-gallery-main.png",
        gallery_images: [
            "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/ring-light/ring-light-gallery-main.png"
        ],
        description: "Anneau lumineux premium de 45cm avec 2500 lumens et contrôle précis via app.",
        pros: ["2500 lumens", "Contrôle app", "Support intégré"],
        cons: ["Encombrant", "Pied non inclus"]
    };

    console.log(`\n🔍 Testing update for: ${productName}\n`);

    // 1. Find the product
    const { data: findData, error: findError } = await supabase
        .from('products')
        .select('id, name, image_url')
        .ilike('name', `%${productName}%`)
        .limit(1);

    if (findError) {
        console.log('❌ Find error:', findError);
        return;
    }

    if (!findData || findData.length === 0) {
        console.log('❌ Product not found');
        return;
    }

    const product = findData[0];
    console.log(`Found: ID=${product.id}`);
    console.log(`Current image: ${product.image_url?.substring(0, 50)}...`);

    // 2. Try update
    console.log('\n📝 Attempting update...');
    const { data: updateData, error: updateError } = await supabase
        .from('products')
        .update(newData)
        .eq('id', product.id)
        .select();

    if (updateError) {
        console.log('❌ Update error:', updateError);
        console.log('Error code:', updateError.code);
        console.log('Error details:', updateError.details);
        console.log('Error hint:', updateError.hint);
        return;
    }

    console.log('✅ Update call returned:', updateData);

    // 3. Verify the update
    console.log('\n🔍 Verifying update...');
    const { data: verifyData } = await supabase
        .from('products')
        .select('name, image_url, description')
        .eq('id', product.id)
        .single();

    console.log('After update:');
    console.log('  Image:', verifyData?.image_url?.substring(0, 60));
    console.log('  Description:', verifyData?.description?.substring(0, 60));

    if (verifyData?.image_url?.includes('corsair')) {
        console.log('\n✅✅✅ UPDATE WORKED! ✅✅✅');
    } else {
        console.log('\n❌❌❌ UPDATE FAILED - RLS may be blocking ❌❌❌');
        console.log('\nCheck your Supabase RLS policies for the products table!');
    }
}

testUpdate();
