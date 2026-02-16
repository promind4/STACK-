
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Mapping: Product Name -> Official HD Image URLs (primary + gallery)
// These are hand-curated from official product pages / press kits
const PRODUCT_IMAGES = {
    "Elgato Wave Panels": {
        image_url: "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/wave-panels/wave-panels-sg-config.png",
        gallery: [
            "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/wave-panels/wave-panels-sg-config.png",
            "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/wave-panels/wave-panels.png",
            "https://www.mediamarkt.de/assets/product_images/ELGATO-Wave-Panels-1/xlarge/elgato-wave-panels-starter-set-akustik-paneel-weiss.webp"
        ]
    },
    "Sommer Cable Galileo 238": {
        image_url: "https://images.static-thomann.de/pics/bdb/483547/17076139_800.jpg",
        gallery: [
            "https://images.static-thomann.de/pics/bdb/483547/17076139_800.jpg",
            "https://images.static-thomann.de/pics/bdb/483547/17076140_800.jpg"
        ]
    },
    "Vovox Link Protect S350 XLR": {
        image_url: "https://images.static-thomann.de/pics/bdb/459795/14953015_800.jpg",
        gallery: [
            "https://images.static-thomann.de/pics/bdb/459795/14953015_800.jpg"
        ]
    },
    "Elgato Ring Light": {
        image_url: "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/ring-light/ring-light-gallery-main.png",
        gallery: [
            "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/ring-light/ring-light-gallery-main.png",
            "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/ring-light/ring-light-gallery-2.png",
            "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/ring-light/ring-light-gallery-3.png"
        ]
    },
    "Elgato Key Light": {
        image_url: "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/key-light/key-light-gallery-main.png",
        gallery: [
            "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/key-light/key-light-gallery-main.png",
            "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/key-light/key-light-gallery-2.png"
        ]
    },
    "Elgato Key Light Air": {
        image_url: "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/key-light-air/key-light-air-hero.png",
        gallery: [
            "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/key-light-air/key-light-air-hero.png"
        ]
    },
    "Elgato Key Light Mini": {
        image_url: "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/key-light-mini/key-light-mini-gallery-main.png",
        gallery: [
            "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/key-light-mini/key-light-mini-gallery-main.png"
        ]
    },
    "Elgato Light Bar": {
        image_url: "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/light-strip/light-bar-gallery-main.png",
        gallery: [
            "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/light-strip/light-bar-gallery-main.png"
        ]
    },
    "Elgato Light Strip": {
        image_url: "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/light-strip/light-strip-gallery-main.png",
        gallery: [
            "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/light-strip/light-strip-gallery-main.png"
        ]
    },
    "Elgato Facecam Pro": {
        image_url: "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/facecam-pro/facecam-pro-gallery-main.png",
        gallery: [
            "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/facecam-pro/facecam-pro-gallery-main.png",
            "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/facecam-pro/facecam-pro-gallery-2.png"
        ]
    },
    "Elgato Green Screen": {
        image_url: "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/green-screen/green-screen-gallery-main.png",
        gallery: [
            "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/green-screen/green-screen-gallery-main.png"
        ]
    },
    "Elgato Stream Deck MK.2": {
        image_url: "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/stream-deck-mk2/stream-deck-mk2-gallery-main.png",
        gallery: [
            "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/stream-deck-mk2/stream-deck-mk2-gallery-main.png"
        ]
    },
    "Elgato Stream Deck +": {
        image_url: "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/stream-deck-plus/stream-deck-plus-gallery-main.png",
        gallery: [
            "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/stream-deck-plus/stream-deck-plus-gallery-main.png"
        ]
    },
    "Elgato Cam Link 4K": {
        image_url: "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/cam-link-4k/cam-link-4k-gallery-main.png",
        gallery: [
            "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/cam-link-4k/cam-link-4k-gallery-main.png"
        ]
    },
    "Elgato HD60 X": {
        image_url: "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/hd60-x/hd60-x-gallery-main.png",
        gallery: [
            "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/hd60-x/hd60-x-gallery-main.png"
        ]
    },
    "Elgato Prompter": {
        image_url: "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/prompter/prompter-gallery-main.png",
        gallery: [
            "https://assets.corsair.com/image/upload/q_auto/f_auto/v1/corsair-redesign-resources/images/elgato/prompter/prompter-gallery-main.png"
        ]
    },
    "Logitech Brio 4K": {
        image_url: "https://resource.logitech.com/w_1200,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/webcams/brio/gallery/brio-gallery-1.png",
        gallery: [
            "https://resource.logitech.com/w_1200,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/webcams/brio/gallery/brio-gallery-1.png"
        ]
    },
    "Logitech StreamCam": {
        image_url: "https://resource.logitech.com/w_1200,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/webcams/streamcam/gallery/streamcam-graphite-gallery-1.png",
        gallery: [
            "https://resource.logitech.com/w_1200,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/webcams/streamcam/gallery/streamcam-graphite-gallery-1.png"
        ]
    },
    "Logitech C920 HD Pro": {
        image_url: "https://resource.logitech.com/w_1200,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/webcams/c920/gallery/c920-gallery-1.png",
        gallery: [
            "https://resource.logitech.com/w_1200,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/webcams/c920/gallery/c920-gallery-1.png"
        ]
    },
    "Logitech Litra Glow": {
        image_url: "https://resource.logitech.com/w_1200,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/lighting/litra-glow/gallery/litra-glow-gallery-1.png",
        gallery: [
            "https://resource.logitech.com/w_1200,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/lighting/litra-glow/gallery/litra-glow-gallery-1.png"
        ]
    },
    "Rode PSA1": {
        image_url: "https://images.static-thomann.de/pics/bdb/233022/10379287_800.jpg",
        gallery: [
            "https://images.static-thomann.de/pics/bdb/233022/10379287_800.jpg",
            "https://images.static-thomann.de/pics/bdb/233022/10379288_800.jpg"
        ]
    },
    "Focusrite Scarlett 2i2 4th Gen": {
        image_url: "https://images.static-thomann.de/pics/bdb/578571/18977095_800.jpg",
        gallery: [
            "https://images.static-thomann.de/pics/bdb/578571/18977095_800.jpg",
            "https://images.static-thomann.de/pics/bdb/578571/18977096_800.jpg",
            "https://images.static-thomann.de/pics/bdb/578571/18977097_800.jpg"
        ]
    },
    "Sennheiser MKE 600": {
        image_url: "https://images.static-thomann.de/pics/bdb/272477/7988215_800.jpg",
        gallery: [
            "https://images.static-thomann.de/pics/bdb/272477/7988215_800.jpg",
            "https://images.static-thomann.de/pics/bdb/272477/7988216_800.jpg"
        ]
    }
};

async function updateProductImages() {
    let updated = 0;
    let failed = 0;

    for (const [productName, images] of Object.entries(PRODUCT_IMAGES)) {
        console.log(`\nUpdating: ${productName}...`);

        // Find product by name
        const { data: products, error: findError } = await supabase
            .from('products')
            .select('id, name')
            .ilike('name', `%${productName}%`)
            .limit(1);

        if (findError || !products?.length) {
            console.log(`  ❌ Not found: ${productName}`);
            failed++;
            continue;
        }

        const productId = products[0].id;

        // Update the product
        const { error: updateError } = await supabase
            .from('products')
            .update({
                image_url: images.image_url,
                gallery_images: images.gallery
            })
            .eq('id', productId);

        if (updateError) {
            console.log(`  ❌ Update failed: ${updateError.message}`);
            failed++;
        } else {
            console.log(`  ✅ Updated: ${products[0].name} (ID: ${productId})`);
            updated++;
        }
    }

    console.log(`\n=== SUMMARY ===`);
    console.log(`Updated: ${updated}`);
    console.log(`Failed: ${failed}`);
}

updateProductImages();
