
import { createClient } from '@supabase/supabase-js';
import { chromium } from 'playwright';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Map of Slugs to Thomann Search Queries or Direct URLs if known
// Prioritizing finding a Thomann equivalent for image quality, even if the affiliate link is Amazon.
const TARGETS = [
    { slug: 'sony-alpha-7-iv', search: 'Sony Alpha 7 IV' },
    { slug: 'sony-zv-e10', search: 'Sony ZV-E10' },
    { slug: 'canon-eos-r50', search: 'Canon EOS R50' }, // Likely fail
    { slug: 'panasonic-lumix-gh6', search: 'Panasonic Lumix GH6' },
    { slug: 'sony-alpha-6700', search: 'Sony Alpha 6700' },
    { slug: 'gopro-hero12-black', search: 'GoPro HERO12' },
    { slug: 'dji-osmo-action-4', search: 'DJI Osmo Action 4' }, // Likely fail
    { slug: 'insta360-ace-pro', search: 'Insta360 Ace Pro' }   // Likely fail
];

async function scrapeImages() {
    console.log("🚀 Starting Camera Image Scraping (Thomann Target)...");

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    for (const t of TARGETS) {
        console.log(`\n🔍 Looking for: ${t.slug} (${t.search})`);

        // 1. Get Product ID
        const { data: prod } = await supabase
            .from('products')
            .select('id, image_url')
            .eq('slug', t.slug)
            .single();

        if (!prod) {
            console.log("   ❌ Product not found in DB.");
            continue;
        }

        // 2. Search on Thomann
        try {
            const searchUrl = `https://www.thomann.de/fr/search_dir.html?sw=${encodeURIComponent(t.search)}`;
            await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

            // Check if we have results (search-result class or fx-product-list-entry)
            const firstProductLink = await page.locator('.fx-product-list-entry a.fx-product-list-entry__link').first();

            if (await firstProductLink.count() > 0) {
                const productUrl = await firstProductLink.getAttribute('href');
                console.log(`   🔗 Found candidate: ${productUrl}`);

                await page.goto(`https://www.thomann.de${productUrl}`, { waitUntil: 'domcontentloaded' }); // handles relative

                // Extract Image
                const imgLocator = page.locator('.fx-product-image__image, .product-image img').first();
                if (await imgLocator.count() > 0) {
                    let newImageUrl = await imgLocator.getAttribute('src');
                    if (!newImageUrl.startsWith('http')) newImageUrl = `https:${newImageUrl}`; // fix protocol relative

                    // Extract Gallery (optional, keep it simple for now, just main image)

                    console.log(`   📸 New Image Found: ${newImageUrl}`);

                    // Update DB
                    const { error } = await supabase
                        .from('products')
                        .update({ image_url: newImageUrl })
                        .eq('id', prod.id);

                    if (error) console.error(`   ❌ DB Error: ${error.message}`);
                    else console.log("   ✅ Updated DB image.");

                } else {
                    console.log("   ❌ No image found on product page.");
                }

            } else {
                console.log("   ⚠️ No results found on Thomann. Keeping existing (Amazon) image.");
            }

        } catch (e) {
            console.error(`   ❌ Scraping Error: ${e.message}`);
        }
    }

    await browser.close();
    console.log("\n✨ Done.");
}

scrapeImages();
