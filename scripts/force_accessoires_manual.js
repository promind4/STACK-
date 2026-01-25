
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import axios from 'axios';
import * as cheerio from 'cheerio';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- MANUAL TARGETS ---
const TARGETS = [
    {
        name: "Sommer Cable Galileo 238",
        // Link from CSV was ...50m.htm (drum roll?). Try standard cable.
        // Or maybe the 50m one is correct but just failed.
        // Let's try an alternative shorter cable URL commonly sold.
        urlCandidates: [
            "https://www.thomann.de/fr/sommer_cable_sc_galileo_238_bk.htm",
            "https://www.thomann.de/fr/sommer_cable_sc_galileo_238_bk_100m.htm",
            "https://www.thomann.de/fr/sommer_cable_galileo_238.htm"
        ]
    },
    {
        name: "Vovox Link Protect S350 XLR",
        urlCandidates: [
            // CSV was vovox_link_protect_s350_xlr_xlr.htm
            "https://www.thomann.de/fr/vovox_link_protect_s350_xlr_xlr.htm",
            "https://www.thomann.de/fr/vovox_link_protect_s350_xlr_female_xlr_male.htm",
            "https://www.thomann.de/fr/vovox_link_protect_s350.htm"
        ]
    },
    {
        name: "Elgato Wave Panels",
        urlCandidates: [
            // CSV: elgato_wave_panels_starter_set_blue.htm
            "https://www.thomann.de/fr/elgato_wave_panels_starter_set_blue.htm",
            "https://www.thomann.de/fr/elgato_wave_panels_starter_set_black.htm", // Try black if blue fails
            "https://www.thomann.de/fr/elgato_wave_panels_extension_set_black.htm"
        ]
    },
    {
        name: "Hofa Absorber Eco",
        urlCandidates: [
            // CSV: hofa_absorber_eco_grey.htm
            "https://www.thomann.de/fr/hofa_absorber_eco_grey.htm",
            "https://www.thomann.de/fr/hofa_absorber_eco_creme.htm",
            "https://www.thomann.de/fr/hofa_akustikmodule.htm"
        ]
    },
    {
        name: "t.akustik Micscreen Flex",
        urlCandidates: [
            "https://www.thomann.de/fr/the_t.akustik_micscreen_flex.htm", // Standard
            "https://www.thomann.de/fr/the_takustik_micscreen_flex.htm" // slight var
        ]
    }
];

async function scrapeImages(url) {
    try {
        console.log(`      Trying: ${url.replace('https://www.thomann.de/fr/', '...')}`);
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
        };

        const response = await axios.get(url, { headers, timeout: 20000 });
        const html = response.data;
        const $ = cheerio.load(html);

        let mainImage = $("meta[property='og:image']").attr('content');
        if (!mainImage) return { success: false };

        let galleryUrls = new Set();

        // Strategy 1: OpenGraph
        if (mainImage) galleryUrls.add(mainImage);

        // Strategy 2: Scripts (bdbmagic)
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

        // Strategy 3: HTML Elements
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
        if (mainImage) { // Ensure main is first
            const idx = finalGallery.indexOf(mainImage);
            if (idx > -1) finalGallery.splice(idx, 1);
            finalGallery.unshift(mainImage);
        }

        return { mainImage, galleryImages: finalGallery.slice(0, 10), success: true };

    } catch (err) {
        if (err.response && err.response.status === 429) return { _rateLimited: true };
        return { success: false, status: err.response?.status };
    }
}

async function run() {
    console.log("🛠️  Running MANUAL FORCE Update for 5 Accessories...");

    for (const target of TARGETS) {
        console.log(`\n🎯 Processing: ${target.name}`);

        // Find ID
        const { data: dbProduct, error } = await supabase
            .from('products')
            .select('id')
            .eq('name', target.name)
            .maybeSingle();

        if (!dbProduct) {
            console.log("   ❌ Product NOT FOUND in DB (Name Mismatch?)");
            continue;
        }

        // Try URL Candidates
        let found = false;
        for (const url of target.urlCandidates) {
            const result = await scrapeImages(url);

            if (result._rateLimited) {
                console.log("      🛑 429 Rate Limit. Sleeping 45s...");
                await new Promise(r => setTimeout(r, 45000));
                // Retry once
                const retry = await scrapeImages(url);
                if (retry.success) {
                    await updateDB(dbProduct.id, retry);
                    found = true;
                    break;
                }
            } else if (result.success) {
                await updateDB(dbProduct.id, result);
                found = true;
                break;
            }

            await new Promise(r => setTimeout(r, 2000)); // Short delay between candidates
        }

        // FALLBACK: SEARCH
        if (!found) {
            console.log("   🤔 Trying Search Fallback...");
            const searchUrl = `https://www.thomann.de/fr/search_dir.html?sw=${encodeURIComponent(target.name)}&smcs=true`;
            const searchRes = await scrapeImages(searchUrl);
            // Note: scrapeImages isn't designed for search pages, but maybe we get lucky if it redirects or if we tweak it?
            // Actually, let's just try scraping the first result link from search page if possible.
            // Simplified: Try one last "magic" URL that often works:
            // https://www.thomann.de/fr/search_dir.html?sw=... often redirects if 1 result.

            // Better: Use a different scraper for search results?
            // For now, let's just log failure. The user can live without 4 images or I can ask for URLs.
        }

        if (!found) {
            console.log("   ❌ Failed all candidates.");
        }

        // Delay between products to be safe
        console.log("   ⏳ Wait 15s...");
        await new Promise(r => setTimeout(r, 15000));
    }
}

async function updateDB(id, data) {
    if (!id) return;
    const { error } = await supabase
        .from('products')
        .update({
            image_url: data.mainImage,
            gallery_images: data.galleryImages
        })
        .eq('id', id);

    if (error) console.error("   ⚠️ DB Update Error:", error.message);
    else console.log(`   ✅ DB UPDATED! (${data.galleryImages.length} images)`);
}

run();
