
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const OFFERS = [
    // Microtech Gefell M 930 (Satin Nickel)
    {
        product_id: '577765f3-b9f4-4256-a92e-53e896f32987',
        merchant_name: 'woodbrass',
        price: 1308.00,
        affiliate_link: 'https://www.woodbrass.com/microphones-a-large-membrane-microtech-gefell-m930-p185005.html',
        currency: 'EUR'
    },
    // Microtech Gefell M 92.1 S
    {
        product_id: 'f45762b3-a08e-43e7-964a-1c0aa0c45acf',
        merchant_name: 'woodbrass',
        price: 3354.00,
        affiliate_link: 'https://www.woodbrass.com/microphones-a-lampe-microtech-gefell-m92-1s-p184974.html',
        currency: 'EUR'
    },
    // Lewitt LCT 540 S
    {
        product_id: '46f331ae-1739-4a38-93dc-df095fdb7c4e',
        merchant_name: 'woodbrass',
        price: 554.00,
        affiliate_link: 'https://www.woodbrass.com/microphones-a-large-membrane-lewitt-lct-540-s-p384182.html',
        currency: 'EUR'
    },
    // Lewitt LCT 1040
    {
        product_id: '3dfda4c9-4863-4c6d-8674-47027d0af03f',
        merchant_name: 'woodbrass',
        price: 2599.00,
        affiliate_link: 'https://www.woodbrass.com/microphones-a-lampe-lewitt-lct-1040-p359189.html',
        currency: 'EUR'
    }
];

// Add generic search offers for other Microtech/Lewitt items to ensure coverage? 
// For now, only focused on the verified ones. 
// User wants "complete catalog" coverage, so fallback links are better than nothing.
// I will fetch all M* and LCT* products and add search links if no offer exists.
// Logic:
// 1. Insert verified offers.
// 2. Fetch all products starting with 'M ' or 'LCT '.
// 3. For each, if no offer exists (checked locally against verified list), add a search link with NULL price.

async function insertOffers() {
    console.log(`Inserting ${OFFERS.length} verified offers...`);
    const { error } = await supabase.from('product_offers').upsert(OFFERS, { onConflict: 'product_id, merchant_name' });
    if (error) console.error('Error Inserting Verified:', error);
    else console.log('✅ Verified offers inserted.');

    // Fallback for others
    const { data: mProducts } = await supabase.from('products').select('id, name').ilike('name', 'M %');
    const { data: lctProducts } = await supabase.from('products').select('id, name').ilike('name', 'LCT %');

    const allCandidates = [...(mProducts || []), ...(lctProducts || [])];
    const verifiedIds = new Set(OFFERS.map(o => o.product_id));

    const flightOffers = [];

    for (const p of allCandidates) {
        if (!verifiedIds.has(p.id)) {
            // Check if offer already exists to avoid overwriting valid data with generic link
            const { data: existing } = await supabase.from('product_offers').select('id').eq('product_id', p.id).eq('merchant_name', 'woodbrass').single();
            if (!existing) {
                flightOffers.push({
                    product_id: p.id,
                    merchant_name: 'woodbrass',
                    price: null, // Unknown
                    // Clean name for search: Remove 'Satin Nickel', 'Dark Bronze', etc. if possible, or just use full name
                    affiliate_link: `https://www.woodbrass.com/recherche?keyword=${encodeURIComponent(p.name)}`,
                    currency: 'EUR'
                });
            }
        }
    }

    if (flightOffers.length > 0) {
        console.log(`Inserting ${flightOffers.length} fallback search offers...`);
        const { error: flightError } = await supabase.from('product_offers').insert(flightOffers); // Insert, duplicate check handled by existing check but can fail on race. Insert is safer if we checked `!existing`.
        if (flightError) console.error('Error Inserting Fallbacks:', flightError);
        else console.log('✅ Fallback offers inserted.');
    }

}

insertOffers();
