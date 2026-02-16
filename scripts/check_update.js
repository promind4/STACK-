import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function checkProducts() {
    // Check a few products we just updated
    const testProducts = [
        "Elgato Ring Light",
        "Sony FE 24-70mm",
        "Logitech Brio"
    ];

    for (const name of testProducts) {
        const { data, error } = await supabase
            .from('products')
            .select('name, image_url, description, gallery_images, pros, cons')
            .ilike('name', `%${name}%`)
            .limit(1);

        if (data && data[0]) {
            const p = data[0];
            console.log(`\n=== ${p.name} ===`);
            console.log(`Image: ${p.image_url?.substring(0, 60)}...`);
            console.log(`Description: ${p.description?.substring(0, 80)}...`);
            console.log(`Gallery: ${p.gallery_images?.length || 0} images`);
            console.log(`Pros: ${p.pros?.length || 0}, Cons: ${p.cons?.length || 0}`);
        }
    }
}

checkProducts();
