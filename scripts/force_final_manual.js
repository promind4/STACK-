
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import axios from 'axios';
import * as cheerio from 'cheerio';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- REFINED TARGETS ---
const TARGETS = [
    {
        name: "Sommer Cable Galileo 238",
        urlCandidates: [
            "https://www.thomann.de/fr/sommer_cable_sc_galileo_238_bk.htm", // Basic
            "https://www.thomann.de/fr/sommer_cable_sc_galileo_238.htm",
            "https://www.thomann.de/fr/sommer_cable_sc_galileo_238_plus_bk.htm", // Plus version?
            "https://www.thomann.de/fr/sommer_cable_galileo_238.htm"
        ]
    },
    {
        name: "Vovox Link Protect S350 XLR",
        urlCandidates: [
            "https://www.thomann.de/fr/vovox_link_protect_s350_xlr_female_xlr_male.htm", // Found in search
            "https://www.thomann.de/fr/vovox_link_protect_s350_xlr_xlr.htm",
            "https://www.thomann.de/fr/vovox_link_protect_s350_trs_xlr_male.htm" // Backup
        ]
    },
    {
        name: "Elgato Wave Panels",
        urlCandidates: [
            "https://www.thomann.de/fr/elgato_wave_panels_starter_set_black.htm", // Blue might be dead, try Black
            "https://www.thomann.de/fr/elgato_wave_panels_extension_set_black.htm", // Backup
            "https://www.thomann.de/fr/elgato_wave_panels_starter_set_blue.htm"
        ]
    },
    {
        name: "Hofa Absorber Eco",
        urlCandidates: [
            // "Eco" seems replaced by "Natural" or search result link
            "https://www.thomann.de/fr/hofa_absorber_eco_grey.htm",
            "https://www.thomann.de/fr/hofa_basstrap_natural_grey.htm", // Proximity
            "https://www.thomann.de/fr/hofa_absorber_natural_grey.htm" // Guess for successor
        ]
    },
    // Micscreen seems standard, maybe just a header issue previously?
    {
        name: "t.akustik Micscreen Flex",
        urlCandidates: [
            "https://www.thomann.de/fr/the_t.akustik_micscreen_flex.htm",
            "https://www.thomann.de/fr/the_takustik_micscreen_flex.htm"
        ]
    }
];

async function scrapeImages(url) {
    try {
        const displayUrl = url.length > 50 ? '...' + url.slice(-40) : url;
        console.log(`      Trying: ${displayUrl}`);
        const headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Cache-Control": "no-cache"
        };

        const response = await axios.get(url, { headers, timeout: 25000 });
        const html = response.data;
        const $ = cheerio.load(html);

        let mainImage = $("meta[property='og:image']").attr('content');
        if (!mainImage) return { success: false };

        let galleryUrls = new Set();
        if (mainImage) galleryUrls.add(mainImage);

        // BDB MAGIC / SCRIPTS
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
                            galleryUrls.add(clean.replace('thumb220x220', 'bdbmagic').replace('thumb', 'bdbmagic'));
                        }
                    });
                }
            }
        }

        // HTML Elements Fallback
        if (galleryUrls.size < 2) {
            $('img').each((i, el) => {
                let src = $(el).attr('data-src') || $(el).attr('src');
                if (src && src.includes('pics/prod') && !src.includes('thumb')) {
                    galleryUrls.add(src);
                }
            });
        }

        const finalGallery = Array.from(galleryUrls);
        return { mainImage, galleryImages: finalGallery.slice(0, 10), success: true };

    } catch (err) {
        if (err.response && err.response.status === 429) return { _rateLimited: true };
        return { success: false, status: err.response?.status };
    }
}

async function run() {
    console.log("🚀 Running FINAL FORCE Manual Update...");

    for (const target of TARGETS) {
        console.log(`\nTARGET: ${target.name}`);

        // Find ID
        const { data: dbProduct } = await supabase
            .from('products')
            .select('id')
            .eq('name', target.name)
            .maybeSingle();

        if (!dbProduct) {
            console.log("   ❌ Not found in DB.");
            continue;
        }

        let found = false;
        for (const url of target.urlCandidates) {
            let result = await scrapeImages(url);

            if (result._rateLimited) {
                console.log("      🛑 429 Rate Limit. Waiting 60s...");
                await new Promise(r => setTimeout(r, 60000));
                result = await scrapeImages(url);
            }

            if (result.success && result.mainImage) {
                console.log(`   ✨ FOUND! (${result.galleryImages.length} images)`);
                await updateDB(dbProduct.id, result);
                found = true;
                break;
            }

            await new Promise(r => setTimeout(r, 3000));
        }

        if (!found) console.log("   ❌ All failed.");

        // Wait
        await new Promise(r => setTimeout(r, 10000));
    }
}

async function updateDB(id, data) {
    await supabase
        .from('products')
        .update({ image_url: data.mainImage, gallery_images: data.galleryImages })
        .eq('id', id);
    console.log("   ✅ Database Updated.");
}

run();
