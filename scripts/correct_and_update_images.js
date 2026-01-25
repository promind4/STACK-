
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

const PRODUCTS_CSV = 'd:\\Projet studio\\products_filtered.csv';
const OFFERS_CSV = 'd:\\Projet studio\\offers_filtered.csv';

// Expanded Candidates List
const CANDIDATES = {
    "Sennheiser HD 600": ["https://www.thomann.de/fr/sennheiser_hd_600.htm", "https://www.thomann.de/fr/sennheiser_hd_600_new_version_2019.htm"],
    "Steinberg UR22C": ["https://www.thomann.de/fr/steinberg_ur22c.htm", "https://www.thomann.de/fr/steinberg_ur_22_c.htm"],
    "PreSonus Studio 24c": ["https://www.thomann.de/fr/presonus_studio_24c.htm", "https://www.thomann.de/fr/presonus_studio_24_c.htm"],
    "sE Electronics DM1 Dynamite": ["https://www.thomann.de/fr/se_electronics_dm1_dynamite.htm", "https://www.thomann.de/fr/se_electronics_dm1_inline_preamp.htm"],
    "JBL 305P MKII": ["https://www.thomann.de/fr/jbl_305p_mkii.htm", "https://www.thomann.de/fr/jbl_lsr_305_p_mkii.htm"],
    "Mackie CR3-X": ["https://www.thomann.de/fr/mackie_cr3_x.htm", "https://www.thomann.de/fr/mackie_cr3_x_pair.htm"],
    "Audient iD14 MKII": ["https://www.thomann.de/fr/audient_id14_mkii.htm", "https://www.thomann.de/fr/audient_id14_mkii_b.htm"],
    "Focusrite Scarlett 2i2 4th Gen": ["https://www.thomann.de/fr/focusrite_scarlett_2i2_4th_gen.htm", "https://www.thomann.de/fr/focusrite_scarlett_2i2_4th_generation.htm"],
    "Focusrite Scarlett Solo 4th Gen": ["https://www.thomann.de/fr/focusrite_scarlett_solo_4th_gen.htm", "https://www.thomann.de/fr/focusrite_scarlett_solo_4th_generation.htm"],
    "RME Babyface Pro FS": ["https://www.thomann.de/fr/rme_babyface_pro_fs.htm"],
    "Behringer UMC202HD": ["https://www.thomann.de/fr/behringer_umc202hd.htm", "https://www.thomann.de/fr/behringer_u_phoria_umc202hd.htm"],
    "KRK Rokit RP5 G4": ["https://www.thomann.de/fr/krk_rokit_rp5_g4.htm", "https://www.thomann.de/fr/krk_rokit_rp5_g4_wn.htm"],
    "SSL 2+": ["https://www.thomann.de/fr/ssl_2_plus.htm", "https://www.thomann.de/fr/solid_state_logic_ssl_2_plus.htm"],
    "Klark Teknik Mic Booster CT 1": ["https://www.thomann.de/fr/klark_teknik_mic_booster_ct_1.htm", "https://www.thomann.de/fr/klark_teknik_ct_1.htm"],
    "ART Tube MP": ["https://www.thomann.de/fr/art_tube_mp.htm", "https://www.thomann.de/fr/art_tubemp.htm"]
};

// --- DATA LOADING ---
function loadCSV(filepath) {
    const content = fs.readFileSync(filepath, 'utf-8');
    const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
    const headers = lines[0].split(',').map(h => h.trim());

    return lines.slice(1).map(line => {
        const values = line.split(',');
        const obj = {};
        headers.forEach((h, i) => {
            obj[h] = values[i] ? values[i].trim() : '';
        });
        return obj;
    });
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
        return { success: false, status: err.response ? err.response.status : 0 };
    }
}

// --- MAIN PROCESS ---
async function run() {
    console.log("🚀 Starting Image Fix Process (v4 - Multi-Candidate)...");

    const products = loadCSV(PRODUCTS_CSV);
    const offers = loadCSV(OFFERS_CSV);

    const productMap = [];
    products.forEach(p => {
        const offer = offers.find(o => o.product_id === p.id);
        if (offer && offer.affiliate_link) {
            productMap.push({ name: p.name, link: offer.affiliate_link });
        }
    });

    for (const item of productMap) {
        console.log(`\nProcessing: ${item.name}`);

        // Resolve Fresh ID
        const { data: dbProduct, error: dbError } = await supabase
            .from('products')
            .select('id, gallery_images')
            .eq('name', item.name)
            .maybeSingle();

        if (dbError || !dbProduct) continue;

        // Skip if done
        if (dbProduct.gallery_images && dbProduct.gallery_images.length > 5) {
            console.log(`   ⏩ Skipping (Done).`);
            continue;
        }

        const freshId = dbProduct.id;

        // Determine Candidate URLs
        let urlsToTry = [item.link];
        if (CANDIDATES[item.name]) {
            urlsToTry = [...CANDIDATES[item.name], item.link];
        }

        // De-duplicate
        urlsToTry = [...new Set(urlsToTry)];

        let images = null;
        let foundUrl = null;

        // Try each candidate
        for (const url of urlsToTry) {
            if (!url) continue;
            console.log(`   🔎 Trying: ${url}`);
            const result = await scrapeImages(url);

            if (result._rateLimited) {
                console.log("   🛑 Rate Limited (429). Waiting 60s...");
                await new Promise(r => setTimeout(r, 60000));
                // Retry this URL once?
                const retry = await scrapeImages(url);
                if (retry.success && retry.mainImage) {
                    images = retry;
                    foundUrl = url;
                    break;
                }
            } else if (result.success && result.mainImage) {
                images = result;
                foundUrl = url;
                break;
            } else {
                console.log("   ❌ Failed/404.");
            }

            // Small delay between candidates
            await new Promise(r => setTimeout(r, 2000));
        }

        if (!images || !images.mainImage) {
            console.log("   ⚠️ No images found after checking all candidates.");
            continue;
        }

        console.log(`   ✨ Found ${images.galleryImages.length} images.`);

        const { error: updateError } = await supabase
            .from('products')
            .update({
                image_url: images.mainImage,
                gallery_images: images.galleryImages
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
