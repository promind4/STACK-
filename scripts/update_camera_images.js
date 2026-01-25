import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Product-to-source mapping: Direct manufacturer/retailer pages with known image galleries
const CAMERA_IMAGES = {
    'sony-alpha-7-iv': {
        main: 'https://m.media-amazon.com/images/I/71RJ1A4EpGL._AC_SL1500_.jpg',
        gallery: [
            'https://m.media-amazon.com/images/I/71RJ1A4EpGL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/71t6CZzxTnL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/61zhT0pNjQL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/71EHlFe3qZL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/61J7gUK7m3L._AC_SL1500_.jpg',
        ]
    },
    'sony-zv-e10': {
        main: 'https://m.media-amazon.com/images/I/71Tn6K3llxL._AC_SL1500_.jpg',
        gallery: [
            'https://m.media-amazon.com/images/I/71Tn6K3llxL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/71c6t-q5wRL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/81nDJ0RXaeL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/71SEdxAJnEL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/71wQlFI3LxL._AC_SL1500_.jpg',
        ]
    },
    'canon-eos-r50': {
        main: 'https://m.media-amazon.com/images/I/71lq7g-iW+L._AC_SL1500_.jpg',
        gallery: [
            'https://m.media-amazon.com/images/I/71lq7g-iW+L._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/71b3XPU-fIL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/71L5QO9m8eL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/81yMWEOvjZL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/61rmFc3xVzL._AC_SL1500_.jpg',
        ]
    },
    'panasonic-lumix-gh6': {
        main: 'https://m.media-amazon.com/images/I/71PKj4okT-L._AC_SL1500_.jpg',
        gallery: [
            'https://m.media-amazon.com/images/I/71PKj4okT-L._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/71YTlIhwZTL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/71lJG+uTbYL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/71x7gBZe2oL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/61PYQVzlFrL._AC_SL1500_.jpg',
        ]
    },
    'sony-alpha-6700': {
        main: 'https://m.media-amazon.com/images/I/71C9FwMeLHL._AC_SL1500_.jpg',
        gallery: [
            'https://m.media-amazon.com/images/I/71C9FwMeLHL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/71LpDpBZQGL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/71dQq5JBc6L._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/71P0rCq6T7L._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/81gEJGiYWpL._AC_SL1500_.jpg',
        ]
    },
    'gopro-hero12-black': {
        main: 'https://m.media-amazon.com/images/I/61VuG9m+EpL._AC_SL1500_.jpg',
        gallery: [
            'https://m.media-amazon.com/images/I/61VuG9m+EpL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/71HbQF3oXeL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/61dP4ePVzjL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/61FXI7vY8yL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/71A6mmJHWKL._AC_SL1500_.jpg',
        ]
    },
    'dji-osmo-action-4': {
        main: 'https://m.media-amazon.com/images/I/61fmNVy8RIL._AC_SL1500_.jpg',
        gallery: [
            'https://m.media-amazon.com/images/I/61fmNVy8RIL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/71wLdqLhLKL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/61AqJI9qhKL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/718pNJdPc5L._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/61G7H0fVl0L._AC_SL1500_.jpg',
        ]
    },
    'insta360-ace-pro': {
        main: 'https://m.media-amazon.com/images/I/61Zj6vvE73L._AC_SL1500_.jpg',
        gallery: [
            'https://m.media-amazon.com/images/I/61Zj6vvE73L._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/71CJZmlRIYL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/61X54fTMF0L._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/61fOkGCmhTL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/71wNRWDuPQL._AC_SL1500_.jpg',
        ]
    }
};

// Webcam images from reliable sources
const WEBCAM_IMAGES = {
    'insta360-link': {
        main: 'https://m.media-amazon.com/images/I/61YL-gXLYPL._AC_SL1500_.jpg',
        gallery: [
            'https://m.media-amazon.com/images/I/61YL-gXLYPL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/71E+XQP2UmL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/71CJOOIaVxL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/61QRSqQ9WIL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/61bOTwWzqjL._AC_SL1500_.jpg',
        ]
    },
    'obsbot-tiny-2': {
        main: 'https://m.media-amazon.com/images/I/61H5lY5Nb0L._AC_SL1500_.jpg',
        gallery: [
            'https://m.media-amazon.com/images/I/61H5lY5Nb0L._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/71PG6xTtf+L._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/61aVXD6c3gL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/61NrL8aVb2L._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/61PNf4tUiTL._AC_SL1500_.jpg',
        ]
    },
    'elgato-facecam-pro': {
        main: 'https://m.media-amazon.com/images/I/61PF4THVXWL._AC_SL1500_.jpg',
        gallery: [
            'https://m.media-amazon.com/images/I/61PF4THVXWL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/71pHxZ7uBVL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/61Nb0l7FKsL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/51xQRUpkJKL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/61Fp7UYmFML._AC_SL1500_.jpg',
        ]
    },
    'elgato-facecam-mk2': {
        main: 'https://m.media-amazon.com/images/I/61s8B0pVvhL._AC_SL1500_.jpg',
        gallery: [
            'https://m.media-amazon.com/images/I/61s8B0pVvhL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/71IJCaB9NxL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/61lMZ6rBN0L._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/61+OqZLVnwL._AC_SL1500_.jpg',
            'https://m.media-amazon.com/images/I/61SbTuB0jYL._AC_SL1500_.jpg',
        ]
    }
};

async function updateImages() {
    console.log("🖼️ UPDATING CAMERA & WEBCAM IMAGES\n");

    // Update Cameras
    for (const [slug, images] of Object.entries(CAMERA_IMAGES)) {
        console.log(`📷 Updating: ${slug}`);

        const { error } = await supabase
            .from('products')
            .update({
                image_url: images.main,
                gallery_images: images.gallery
            })
            .eq('slug', slug);

        if (error) {
            console.log(`   ❌ Error: ${error.message}`);
        } else {
            console.log(`   ✅ Updated (Main + ${images.gallery.length} gallery)`);
        }
    }

    // Update Webcams (need to find by name since slugs might be different)
    console.log("\n📹 Updating Webcams...");

    const webcamMappings = [
        { name: 'Insta360 Link', slug: 'insta360-link' },
        { name: 'Obsbot Tiny 2', slug: 'obsbot-tiny-2' },
        { name: 'Elgato Facecam Pro', slug: 'elgato-facecam-pro' },
        { name: 'Elgato Facecam MK.2', slug: 'elgato-facecam-mk2' },
    ];

    for (const mapping of webcamMappings) {
        const images = WEBCAM_IMAGES[mapping.slug];
        if (!images) continue;

        console.log(`📹 Updating: ${mapping.name}`);

        // Try by name first (more reliable than slug matching)
        const { error } = await supabase
            .from('products')
            .update({
                image_url: images.main,
                gallery_images: images.gallery
            })
            .ilike('name', `%${mapping.name.replace('MK.2', 'MK%')}%`);

        if (error) {
            console.log(`   ❌ Error: ${error.message}`);
        } else {
            console.log(`   ✅ Updated`);
        }
    }

    console.log("\n✨ Done!");
}

updateImages();
