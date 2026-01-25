import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// User agent to mimic real browser
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
};

// Product sources - using various retailers that might be accessible
const PRODUCT_SOURCES = [
    {
        slug: 'sony-alpha-7-iv',
        name: 'Sony Alpha 7 IV',
        urls: [
            'https://www.bhphotovideo.com/c/product/1679877-REG/sony_ilce7m4_b_alpha_a7_iv_mirrorless.html',
            'https://www.digit-photo.com/SONY-Alpha-7-IV-rSOI7M4BODY.html',
        ]
    },
    {
        slug: 'sony-zv-e10',
        name: 'Sony ZV-E10',
        urls: [
            'https://www.bhphotovideo.com/c/product/1648190-REG/sony_ilczve10l_b_zv_e10_mirrorless_camera_with.html',
            'https://www.digit-photo.com/SONY-ZV-E10-Noir-16-50mm-rSOZVE10LBDI.html',
        ]
    },
    {
        slug: 'canon-eos-r50',
        name: 'Canon EOS R50',
        urls: [
            'https://www.bhphotovideo.com/c/product/1766567-REG/canon_5811c012_eos_r50_mirrorless_camera.html',
            'https://www.digit-photo.com/CANON-EOS-R50-Noir-rCAEOSR50BODY.html',
        ]
    },
    {
        slug: 'panasonic-lumix-gh6',
        name: 'Panasonic Lumix GH6',
        urls: [
            'https://www.bhphotovideo.com/c/product/1689858-REG/panasonic_dc_gh6body_lumix_gh6_mirrorless_camera.html',
        ]
    },
    {
        slug: 'sony-alpha-6700',
        name: 'Sony Alpha 6700',
        urls: [
            'https://www.bhphotovideo.com/c/product/1773165-REG/sony_ilce6700_b_alpha_6700_mirrorless_camera.html',
        ]
    },
    {
        slug: 'gopro-hero12-black',
        name: 'GoPro HERO12 Black',
        urls: [
            'https://www.bhphotovideo.com/c/product/1781919-REG/gopro_chdhx_121_rw_hero12_black.html',
        ]
    },
    {
        slug: 'dji-osmo-action-4',
        name: 'DJI Osmo Action 4',
        urls: [
            'https://www.bhphotovideo.com/c/product/1773405-REG/dji_cp_os_00000296_01_osmo_action_4_standard.html',
        ]
    },
    {
        slug: 'insta360-ace-pro',
        name: 'Insta360 Ace Pro',
        urls: [
            'https://www.bhphotovideo.com/c/product/1805608-REG/insta360_cinsaaja_ace_pro_action_camera.html',
        ]
    },
    // Webcams
    {
        slug: 'insta360-link',
        name: 'Insta360 Link',
        urls: [
            'https://www.bhphotovideo.com/c/product/1713478-REG/insta360_cinstbj_a_link_4k_webcam_with.html',
        ]
    },
    {
        slug: 'obsbot-tiny-2',
        name: 'Obsbot Tiny 2',
        urls: [
            'https://www.bhphotovideo.com/c/product/1801088-REG/obsbot_ocu_8060_ai1_tiny_2_ptz_4k.html',
        ]
    },
    {
        slug: 'elgato-facecam-pro',
        name: 'Elgato Facecam Pro',
        urls: [
            'https://www.bhphotovideo.com/c/product/1722668-REG/elgato_10wab9901_facecam_pro_webcam.html',
        ]
    },
    {
        slug: 'elgato-facecam-mk2',
        name: 'Elgato Facecam MK.2',
        urls: [
            'https://www.bhphotovideo.com/c/product/1802419-REG/elgato_10wac9901_facecam_mk_2_webcam.html',
        ]
    }
];

async function extractImagesFromPage(url) {
    try {
        console.log(`   Fetching: ${url.substring(0, 60)}...`);

        const response = await axios.get(url, {
            headers,
            timeout: 15000
        });

        const $ = cheerio.load(response.data);
        const images = [];

        // B&H Photo patterns
        $('img[data-selenium="highResImage"], img.primaryImage, img[data-zoom-image]').each((i, el) => {
            const src = $(el).attr('src') || $(el).attr('data-zoom-image') || $(el).attr('data-src');
            if (src && src.includes('http') && !src.includes('placeholder')) {
                images.push(src.replace(/\/\d+x\d+\//, '/1500x1500/'));
            }
        });

        // Gallery thumbnails on B&H
        $('img[data-selenium="thumbnailImage"]').each((i, el) => {
            let src = $(el).attr('src') || $(el).attr('data-src');
            if (src && src.includes('http')) {
                // Convert thumbnail to full size
                src = src.replace(/\/\d+x\d+\//, '/1500x1500/');
                if (!images.includes(src)) images.push(src);
            }
        });

        // Generic product image patterns
        $('img[class*="product"], img[class*="gallery"], img[id*="product"]').each((i, el) => {
            const src = $(el).attr('src') || $(el).attr('data-src');
            if (src && src.includes('http') && !images.includes(src)) {
                images.push(src);
            }
        });

        // High res data attributes
        $('[data-zoom-image], [data-large-image], [data-full-image]').each((i, el) => {
            const src = $(el).attr('data-zoom-image') || $(el).attr('data-large-image') || $(el).attr('data-full-image');
            if (src && src.includes('http') && !images.includes(src)) {
                images.push(src);
            }
        });

        return images.slice(0, 6); // Max 6 images (1 main + 5 gallery)
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        return [];
    }
}

async function scrapeAllImages() {
    console.log("🖼️ SCRAPING CAMERA IMAGES WITH DELAYS\n");
    console.log("=".repeat(60));
    console.log("Using 5-second delay between requests to avoid rate limiting\n");

    let successCount = 0;
    let failCount = 0;

    for (const product of PRODUCT_SOURCES) {
        console.log(`\n📷 [${product.name}]`);

        let allImages = [];

        for (const url of product.urls) {
            const images = await extractImagesFromPage(url);

            if (images.length > 0) {
                console.log(`   ✅ Found ${images.length} images`);
                allImages = [...allImages, ...images];
                break; // Got images, no need to try other URLs
            }

            // Delay before next attempt
            console.log("   ⏳ Waiting 5 seconds...");
            await delay(5000);
        }

        // Deduplicate
        allImages = [...new Set(allImages)].slice(0, 6);

        if (allImages.length > 0) {
            // Update database
            const mainImage = allImages[0];
            const galleryImages = allImages.slice(0, 5);

            const { error } = await supabase
                .from('products')
                .update({
                    image_url: mainImage,
                    gallery_images: galleryImages
                })
                .eq('slug', product.slug);

            if (error) {
                console.log(`   ❌ DB Error: ${error.message}`);
                failCount++;
            } else {
                console.log(`   ✅ Updated DB (Main + ${galleryImages.length} gallery)`);
                successCount++;
            }
        } else {
            console.log(`   ⚠️ No images found - keeping existing`);
            failCount++;
        }

        // Delay between products
        console.log("   ⏳ Waiting 5 seconds before next product...");
        await delay(5000);
    }

    console.log("\n" + "=".repeat(60));
    console.log(`📊 RESULTS: ${successCount} success, ${failCount} failed`);
}

scrapeAllImages();
