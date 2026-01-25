
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const batch10Ids = [
    "c76acc8b-6187-42cf-af65-4cc2c4994279", // DynaCaster DCM 3
    "f627fde1-3f59-4ca0-aad8-0288208ccc66", // DynaCaster DCM 6
    "8490181b-a4c3-406c-8ba6-77a1619fc6ed", // DynaCaster DCM 8
    "5335ee90-128d-4973-bb1b-b65fec5e6d77", // RE20
    "19b6e53f-a8a1-4844-88e4-28e8d315ece3", // RE20 Black
    "ffa87e74-8d02-40c9-a764-f4bc9ce16500", // Procaster
    "436f7f56-73cb-464e-8337-31d76f103656", // PodMic
    "d2120d34-55d2-4b21-84c4-b2a7d3f92027", // PodMic USB
    "e4851913-0343-469c-b5b1-6091ae47df6f"  // Heil PR40
];

async function checkImages() {
    console.log("Checking image status for Batch 10 products...\n");

    const { data, error } = await supabase
        .from('products')
        .select('name, image_url, gallery_images')
        .in('id', batch10Ids);

    if (error) {
        console.error("Error fetching products:", error);
        return;
    }

    data.forEach(p => {
        const hasMain = !!p.image_url;
        const galleryCount = p.gallery_images ? p.gallery_images.length : 0;
        const status = hasMain ? "✅ OK" : "❌ MISSING";

        console.log(`${status} | ${p.name.padEnd(30)} | Main: ${hasMain ? 'Yes' : 'No'} | Gallery: ${galleryCount}`);
    });
}

checkImages();
