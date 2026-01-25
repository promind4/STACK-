
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const CATEGORY_IDS = [
    '8ce3aa33-cef8-45ee-ad31-8290f685597e', // Cartes Son
    'f5d04d21-4999-419a-916b-eb5d5db71975', // Preamplis
    'e53b8f8a-ab68-4ede-9f53-d892bf785ff6', // Casques Studio
    '35dcf61b-1b56-4635-a3e9-7bba7f165409', // Enceintes
    'ac5335ca-cf63-4e98-90e1-9266e345835e'  // Interface et son (parent)
];

async function verifyCategoryImages() {
    console.log("Verifying images for 'Interface et Son' categories...");

    const { data, error } = await supabase
        .from('products')
        .select('id, name, image_url, gallery_images, category_id')
        .in('category_id', CATEGORY_IDS);

    if (error) {
        console.error("Error:", error);
        return;
    }

    console.log(`Found ${data.length} products in these categories.`);

    let complete = 0;
    let missing = 0;
    const missingList = [];

    data.forEach(p => {
        const hasMain = !!p.image_url;
        const galleryCount = p.gallery_images ? p.gallery_images.length : 0;

        if (hasMain && galleryCount >= 1) { // User asked for 10, but let's see if 1 exists first.
            complete++;
        } else {
            missing++;
            missingList.push(`${p.name} (Main: ${hasMain}, Gallery: ${galleryCount})`);
        }
    });

    console.log(`\n✅ Complete: ${complete}`);
    console.log(`❌ Missing/Incomplete: ${missing}`);

    if (missingList.length > 0) {
        console.log("\nProducts needing attention:");
        missingList.forEach(m => console.log(` - ${m}`));
    }
}

verifyCategoryImages();
