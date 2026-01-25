
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Use SERVICE ROLE KEY for admin updates to bypass RLS
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY!");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const products = [
    // --- sE Electronics ---
    {
        name: "DynaCaster DCM 3",
        id: "c76acc8b-6187-42cf-af65-4cc2c4994279",
        offers: [
            {
                merchant_name: "amazon",
                price: 99, // Approximate
                affiliate_link: "https://www.amazon.fr/dp/B0B8T6X45L?tag=stackera-21",
                in_stock: true
            },
            {
                merchant_name: "woodbrass",
                price: 95,
                affiliate_link: "https://www.woodbrass.com/product_search.php?keyword=se+electronics+dynacaster+dcm+3&af=3524",
                in_stock: true
            }
        ]
    },
    {
        name: "DynaCaster DCM 6",
        id: "f627fde1-3f59-4ca0-aad8-0288208ccc66",
        offers: [
            {
                merchant_name: "amazon",
                price: 149,
                affiliate_link: "https://www.amazon.fr/dp/B0B8T3L8W8?tag=stackera-21",
                in_stock: true
            },
            {
                merchant_name: "woodbrass",
                price: 145,
                affiliate_link: "https://www.woodbrass.com/product_search.php?keyword=se+electronics+dynacaster+dcm+6&af=3524",
                in_stock: true
            }
        ]
    },
    {
        name: "DynaCaster DCM 8",
        id: "8490181b-a4c3-406c-8ba6-77a1619fc6ed",
        offers: [
            {
                merchant_name: "amazon",
                price: 239,
                affiliate_link: "https://www.amazon.fr/s?k=se+electronics+dynacaster&tag=stackera-21",
                in_stock: true
            },
            {
                merchant_name: "woodbrass",
                price: 239,
                affiliate_link: "https://www.woodbrass.com/product_search.php?keyword=se+electronics+dynacaster&af=3524",
                in_stock: true
            }
        ]
    },
    // --- Electro-Voice ---
    {
        name: "Electro-Voice RE20",
        id: "5335ee90-128d-4973-bb1b-b65fec5e6d77",
        offers: [
            {
                merchant_name: "amazon",
                price: 449,
                affiliate_link: "https://www.amazon.fr/dp/B000Z7LLX4?tag=stackera-21",
                in_stock: true
            },
            {
                merchant_name: "woodbrass",
                price: 549,
                affiliate_link: "https://www.woodbrass.com/product_search.php?keyword=electro+voice+re20&af=3524",
                in_stock: true
            }
        ]
    },
    {
        name: "Electro-Voice RE20 Black",
        id: "19b6e53f-a8a1-4844-88e4-28e8d315ece3",
        offers: [
            {
                merchant_name: "amazon",
                price: 559,
                affiliate_link: "https://www.amazon.fr/s?k=electro+voice+re20+black&tag=stackera-21",
                in_stock: true
            },
            {
                merchant_name: "woodbrass",
                price: 559,
                affiliate_link: "https://www.woodbrass.com/product_search.php?keyword=electro+voice+re20+black&af=3524",
                in_stock: true
            }
        ]
    },
    // --- Rode ---
    {
        name: "Rode Procaster",
        id: "ffa87e74-8d02-40c9-a764-f4bc9ce16500",
        offers: [
            {
                merchant_name: "amazon",
                price: 153,
                affiliate_link: "https://www.amazon.fr/dp/B001IP7D58?tag=stackera-21",
                in_stock: true
            },
            {
                merchant_name: "woodbrass",
                price: 169,
                affiliate_link: "https://www.woodbrass.com/product_search.php?keyword=rode+procaster&af=3524",
                in_stock: true
            }
        ]
    },
    {
        name: "Rode PodMic",
        id: "436f7f56-73cb-464e-8337-31d76f103656",
        offers: [
            {
                merchant_name: "amazon",
                price: 98,
                affiliate_link: "https://www.amazon.fr/dp/B07MSCRCVK?tag=stackera-21",
                in_stock: true
            },
            {
                merchant_name: "woodbrass",
                price: 109,
                affiliate_link: "https://www.woodbrass.com/product_search.php?keyword=rode+podmic&af=3524",
                in_stock: true
            }
        ]
    },
    {
        name: "Rode PodMic USB",
        id: "d2120d34-55d2-4b21-84c4-b2a7d3f92027",
        offers: [
            {
                merchant_name: "amazon",
                price: 188,
                affiliate_link: "https://www.amazon.fr/dp/B0C475D6M7?tag=stackera-21",
                in_stock: true
            },
            {
                merchant_name: "woodbrass",
                price: 199,
                affiliate_link: "https://www.woodbrass.com/product_search.php?keyword=rode+podmic+usb&af=3524",
                in_stock: true
            }
        ]
    },
    // --- Heil ---
    {
        name: "Heil PR40",
        id: "e4851913-0343-469c-b5b1-6091ae47df6f",
        offers: [
            {
                merchant_name: "amazon",
                price: 369,
                affiliate_link: "https://www.amazon.fr/dp/B000SOYORM?tag=stackera-21",
                in_stock: true
            },
            {
                merchant_name: "woodbrass",
                price: 389,
                affiliate_link: "https://www.woodbrass.com/product_search.php?keyword=heil+pr40&af=3524",
                in_stock: true
            }
        ]
    }
];

async function insertOffers() {
    console.log(`Starting Batch 10 Insertion for ${products.length} products...`);
    let successCount = 0;
    let failCount = 0;

    for (const product of products) {
        console.log(`Processing ${product.name}...`);
        for (const offer of product.offers) {
            const { error } = await supabase
                .from('product_offers')
                .upsert({
                    product_id: product.id,
                    merchant_name: offer.merchant_name,
                    price: offer.price,
                    currency: 'EUR',
                    affiliate_link: offer.affiliate_link,
                    in_stock: offer.in_stock
                }, { onConflict: 'product_id, merchant_name' });

            if (error) {
                console.error(`  ❌ Error inserting ${offer.merchant_name}:`, error.message);
                failCount++;
            } else {
                console.log(`  ✅ Inserted/Updated ${offer.merchant_name}`);
                successCount++;
            }
        }
    }

    console.log(`\nBatch 10 Complete! Success: ${successCount}, Failed: ${failCount}`);
}

insertOffers();
