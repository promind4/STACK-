
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY!");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
    // --- LEWITT ---
    {
        name: "LCT 441 FLEX",
        id: "54f37e1f-7bfe-4076-8f01-bc9c7417f8d6",
        price: 339,
        search: "lewitt lct 441 flex"
    },
    {
        name: "LCT 640 TS",
        id: "17d47660-2e6f-45ea-bab4-e7232b0a4b77",
        price: 849,
        search: "lewitt lct 640 ts"
    },
    {
        name: "PURE TUBE Essential",
        id: "401d72e0-021c-4c1a-9350-221823c8438f",
        price: 999,
        search: "lewitt pure tube essential"
    },
    {
        name: "PURE TUBE Studio",
        id: "1ff3a635-44f6-4785-b50b-c9827a5a0cb9",
        price: 1199,
        search: "lewitt pure tube studio"
    },

    // --- WARM AUDIO WA-87jr ---
    {
        name: "WA-87jr",
        id: "daa3f373-dd55-4b6e-9845-23b2a45f261b",
        price: 349,
        search: "warm audio wa-87jr"
    },
    {
        name: "WA-87jr Black",
        id: "ddefe140-1373-4746-a0d5-278b396f612d",
        price: 349,
        search: "warm audio wa-87jr black"
    },

    // --- WARM AUDIO WA-47jr ---
    {
        name: "WA-47jr",
        id: "052fdc2d-1140-45c4-8bd8-d555c0e86d70",
        price: 329,
        search: "warm audio wa-47jr"
    },
    {
        name: "WA-47jr Black",
        id: "d6d8d372-997d-415a-b61a-4b9ac1a57616",
        price: 329,
        search: "warm audio wa-47jr black"
    }
];

async function insertOffers() {
    console.log(`Starting Batch 11 Insertion for ${products.length} products...`);
    let successCount = 0;
    let failCount = 0;

    for (const product of products) {
        console.log(`Processing ${product.name}...`);

        // Construct offers
        const offers = [
            {
                product_id: product.id,
                merchant_name: "amazon",
                price: product.price,
                currency: 'EUR',
                affiliate_link: `https://www.amazon.fr/s?k=${encodeURIComponent(product.search)}&tag=stackera-21`,
                in_stock: true
            },
            {
                product_id: product.id,
                merchant_name: "woodbrass",
                price: product.price, // Using same base price or slight variation? Assuming same roughly.
                currency: 'EUR',
                affiliate_link: `https://www.woodbrass.com/product_search.php?keyword=${encodeURIComponent(product.search)}&af=3524`,
                in_stock: true
            }
        ];

        for (const offer of offers) {
            const { error } = await supabase
                .from('product_offers')
                .upsert(offer, { onConflict: 'product_id, merchant_name' });

            if (error) {
                console.error(`  ❌ Error inserting ${offer.merchant_name}:`, error.message);
                failCount++;
            } else {
                console.log(`  ✅ Inserted/Updated ${offer.merchant_name}`);
                successCount++;
            }
        }
    }

    console.log(`\nBatch 11 Complete! Success: ${successCount}, Failed: ${failCount}`);
}

insertOffers();
