
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import axios from 'axios';
import * as cheerio from 'cheerio';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// --- FILES TO PROCESS ---
const FILES = [
    { p: 'd:\\Projet studio\\products_bras_full.csv', o: 'd:\\Projet studio\\offers_bras.csv' },
    { p: 'd:\\Projet studio\\products_xlr_full.csv', o: 'd:\\Projet studio\\offers_xlr.csv' },
    { p: 'd:\\Projet studio\\products_acoustique_full.csv', o: 'd:\\Projet studio\\offers_acoustique.csv' }
];

// --- DATA LOADING ---
function loadCSV(filepath) {
    try {
        const content = fs.readFileSync(filepath, 'utf-8');
        const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
        // Simple CSV parse, handling keys
        // We only need Name from Products, and Link from Offers (joined by ID)
        const headers = lines[0].split(',').map(h => h.trim());

        return lines.slice(1).map(line => {
            // Basic split by comma. NOTE: description might contain comma, but we only need name (index 2 usually) and ID (index 0).
            // If we assume standard format: id, cat, name, slug... 
            // Be careful with split(',') if name has comma.
            // But these are short names usually.
            const values = line.split(',');
            const obj = {};
            headers.forEach((h, i) => {
                obj[h] = values[i] ? values[i].trim() : '';
            });
            return obj;
        });
    } catch (e) {
        console.error(`Error loading ${filepath}:`, e.message);
        return [];
    }
}

// --- SCRAPING FUNCTION ---
async function scrapeImages(url) {
    try {
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
        };

        const response = await axios.get(url, { headers, timeout: 20000 });
        const html = response.data;
        const $ = cheerio.load(html);

        let mainImage = $("meta[property='og:image']").attr('content');
        let galleryUrls = new Set();
        const scripts = $('script').toArray();

        for (const script of scripts) {
            const content = $(script).html();
            if (content && (content.includes('"media":') || content.includes('bdbmagic'))) {
                const matches = content.match(/https:[\\/]+thumbs\.static-thomann\.de[\\/]+[^"]+\.jpg/g);
                if (matches) {
                    matches.forEach(item => {
                        let clean = item.replace(/\\/g, '/');
                        if (clean.includes('bdbmagic') || clean.includes('_800.jpg')) {
                            galleryUrls.add(clean);
                        } else if (clean.includes('pics/prod')) {
                            let converted = clean.replace('thumb220x220', 'bdbmagic').replace('thumb', 'bdbmagic');
                            galleryUrls.add(converted);
                        }
                    });
                }
            }
        }

        if (galleryUrls.size < 2) {
            $('.media-gallery-item img, .fx-media-gallery-item img').each((i, el) => {
                let src = $(el).attr('data-src') || $(el).attr('src');
                if (src && src.includes('pics/prod')) {
                    let hd = src.replace('thumb220x220', 'bdbmagic').replace('thumb', 'bdbmagic');
                    galleryUrls.add(hd);
                }
            });
        }

        const finalGallery = Array.from(galleryUrls);
        if (mainImage) {
            const idx = finalGallery.indexOf(mainImage);
            if (idx > -1) finalGallery.splice(idx, 1);
            finalGallery.unshift(mainImage);
        }

        return { mainImage, galleryImages: finalGallery.slice(0, 10), success: true };

    } catch (err) {
        if (err.response && err.response.status === 429) {
            return { _rateLimited: true };
        }
        return { success: false };
    }
}

// --- MAIN PROCESS ---
async function run() {
    console.log("🚀 Starting Accessories Image Update...");

    let allProducts = [];

    // 1. DATA AGGREGATION
    for (const fileSet of FILES) {
        const products = loadCSV(fileSet.p);
        const offers = loadCSV(fileSet.o);

        products.forEach(p => {
            // Find offer for this product (Match by ID? product_id in offer matches ID in product)
            // Check CSV structure.
            // products: id, ...
            // offers: id, product_id, ...
            const offer = offers.find(o => o.product_id === p.id);
            if (offer && offer.affiliate_link) {
                allProducts.push({ name: p.name, link: offer.affiliate_link });
            }
        });
    }

    console.log(`Found ${allProducts.length} accessory products to process.`);

    // 2. PROCESSING
    for (const item of allProducts) {
        console.log(`\nProcessing: ${item.name}`);

        // Resolve Fresh ID
        const { data: dbProduct, error: dbError } = await supabase
            .from('products')
            .select('id, gallery_images')
            .eq('name', item.name)
            .maybeSingle();

        if (dbError || !dbProduct) {
            console.log(`   ❌ Not found in DB: ${item.name}`);
            continue;
        }

        // Skip if done
        if (dbProduct.gallery_images && dbProduct.gallery_images.length > 5) {
            console.log(`   ⏩ Skipping (Done).`);
            continue;
        }

        const freshId = dbProduct.id;

        // Scrape
        let result = await scrapeImages(item.link);

        if (result._rateLimited) {
            console.log("   🛑 Rate Limited (429). Waiting 60s...");
            await new Promise(r => setTimeout(r, 60000));
            // Retry
            result = await scrapeImages(item.link);
        }

        if (!result.success || !result.mainImage) {
            console.log("   ⚠️ No images found / Failed.");
            continue;
        }

        console.log(`   ✨ Found ${result.galleryImages.length} images.`);

        const { error: updateError } = await supabase
            .from('products')
            .update({
                image_url: result.mainImage,
                gallery_images: result.galleryImages
            })
            .eq('id', freshId);

        if (updateError) {
            console.error(`   ❌ Update failed: ${updateError.message}`);
        } else {
            console.log(`   ✅ Success.`);
        }

        // DELAY 35s
        process.stdout.write("   ⏳ Wait 35s...");
        await new Promise(r => setTimeout(r, 35000));
        console.log("");
    }
}

run();
