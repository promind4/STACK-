import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function auditImages() {
    console.log("📷 CAMERA PRODUCTS IMAGE AUDIT\n");
    console.log("=".repeat(60));

    // Get all camera products from Hybrides and Action Cams
    const { data: products } = await supabase
        .from('products')
        .select('id, name, slug, image_url, gallery_images, category:categories(name)')
        .or('category_id.eq.0bf0a370-3c0c-486e-8e21-05a79cc942a4,category_id.eq.201f8387-789b-4e74-9c5e-5b1312dc531b');

    if (!products) {
        console.log("No products found");
        return;
    }

    console.log(`Found ${products.length} camera products\n`);

    let needsMain = [];
    let needsGallery = [];

    products.forEach(p => {
        const cat = p.category?.name || 'Unknown';
        const hasMainImage = p.image_url && !p.image_url.includes('unsplash') && !p.image_url.includes('placeholder');
        const galleryCount = Array.isArray(p.gallery_images) ? p.gallery_images.length : 0;

        console.log(`[${cat}] ${p.name}`);
        console.log(`  Main Image: ${hasMainImage ? '✅' : '❌ NEEDS FIX'}`);
        console.log(`  Gallery: ${galleryCount} images ${galleryCount >= 5 ? '✅' : '⚠️ NEEDS MORE'}`);
        if (p.image_url) {
            console.log(`  Current URL: ${p.image_url.substring(0, 70)}...`);
        }
        console.log("");

        if (!hasMainImage) needsMain.push(p.slug);
        if (galleryCount < 5) needsGallery.push(p.slug);
    });

    console.log("=".repeat(60));
    console.log("SUMMARY:");
    console.log(`  Products needing main image: ${needsMain.length}`);
    console.log(`  Products needing gallery images: ${needsGallery.length}`);

    if (needsMain.length > 0) {
        console.log("\nProducts needing main images:");
        needsMain.forEach(s => console.log(`  - ${s}`));
    }

    // Also check for Webcams Pro category
    const { data: webcamCat } = await supabase
        .from('categories')
        .select('id, name')
        .ilike('slug', '%webcam%')
        .single();

    if (webcamCat) {
        console.log(`\nFound Webcams category: ${webcamCat.name} (${webcamCat.id})`);

        const { data: webcams } = await supabase
            .from('products')
            .select('id, name, slug, image_url, gallery_images')
            .eq('category_id', webcamCat.id);

        if (webcams && webcams.length > 0) {
            console.log(`Webcam products: ${webcams.length}`);
            webcams.forEach(w => {
                const hasImg = w.image_url && !w.image_url.includes('unsplash');
                const gal = Array.isArray(w.gallery_images) ? w.gallery_images.length : 0;
                console.log(`  - ${w.name}: Main ${hasImg ? '✅' : '❌'} | Gallery: ${gal}`);
            });
        }
    }
}

auditImages();
