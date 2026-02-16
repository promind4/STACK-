/**
 * Update products with verified Amazon image URLs
 * These URLs have been manually verified via browser
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

// Verified Amazon URLs (HD, white background)
const VERIFIED_IMAGES = {
    // ELGATO PRODUCTS
    "elgato-stream-deck-mk2": {
        image_url: "https://m.media-amazon.com/images/I/61gtdFnK+UL._AC_SL1500_.jpg",
        gallery_images: [
            "https://m.media-amazon.com/images/I/61gtdFnK+UL._AC_SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71Nj9K0XRRL._AC_SL1500_.jpg",
            "https://m.media-amazon.com/images/I/71zy7NQgURL._AC_SL1500_.jpg"
        ]
    }
};

async function updateVerifiedImages() {
    console.log('\n🔄 Applying verified image URLs...\n');

    for (const [slug, data] of Object.entries(VERIFIED_IMAGES)) {
        console.log(`📷 ${slug}...`);

        const { error } = await supabase
            .from('products')
            .update({
                image_url: data.image_url,
                gallery_images: data.gallery_images
            })
            .eq('slug', slug);

        if (error) {
            console.log(`  ❌ ${error.message}`);
        } else {
            console.log(`  ✅ Updated`);
        }
    }

    console.log('\n✨ Done!');
}

updateVerifiedImages();
