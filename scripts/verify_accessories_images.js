
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const CATEGORIES = [
    { name: 'Bras articulés', id: '60d48356-1a67-415e-8e47-cda221d4a8d5' },
    { name: 'Câbles XLR', id: 'b99cc6bc-39c6-4236-be26-708456b06f97' },
    { name: 'Traitement Acoustique', id: '40b8f65e-df8b-4c85-a6e0-5e4b986d7235' }
];

async function run() {
    console.log("🔍 Verifying Accessories Images...\n");

    let totalProducts = 0;
    let totalComplete = 0;

    for (const cat of CATEGORIES) {
        console.log(`--- Category: ${cat.name} ---`);

        const { data: products, error } = await supabase
            .from('products')
            .select('name, image_url, gallery_images')
            .eq('category_id', cat.id);

        if (error) {
            console.error(`Error fetching category ${cat.name}:`, error.message);
            continue;
        }

        products.forEach(p => {
            totalProducts++;
            const hasMain = !!p.image_url;
            const galleryCount = p.gallery_images ? p.gallery_images.length : 0;
            const isComplete = hasMain && galleryCount >= 1; // At least one gallery image

            if (isComplete) totalComplete++;

            let status = isComplete ? "✅ OK" : "❌ MISSING";
            if (!hasMain) status += " (No Main)";
            if (galleryCount === 0) status += " (No Gallery)";

            console.log(`${status.padEnd(20)} | ${p.name} (Gallery: ${galleryCount})`);
        });
        console.log("");
    }

    console.log(`\n📊 Summary: ${totalComplete}/${totalProducts} Accessoires Complete.`);
}

run();
