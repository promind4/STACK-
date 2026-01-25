import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const OFFERS = [
    // --- RODE NT1 SIGNATURE (Various Colors) ---
    // Approx 159 EUR for all colors
    { product_id: '417c5d65-ca29-4333-b326-95e96a409afb', merchant_name: 'amazon', price: 159.00, affiliate_link: 'https://www.amazon.fr/s?k=Rode+NT1+Signature&tag=stackera-21', currency: 'EUR', in_stock: true },
    { product_id: '417c5d65-ca29-4333-b326-95e96a409afb', merchant_name: 'woodbrass', price: 159.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Rode+NT1+Signature', currency: 'EUR', in_stock: true },
    // Purple
    { product_id: 'a3aca668-9bcc-4e82-a4d5-5e2414e8cf22', merchant_name: 'amazon', price: 159.00, affiliate_link: 'https://www.amazon.fr/s?k=Rode+NT1+Signature+Purple&tag=stackera-21', currency: 'EUR', in_stock: true },
    { product_id: 'a3aca668-9bcc-4e82-a4d5-5e2414e8cf22', merchant_name: 'woodbrass', price: 159.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Rode+NT1+Signature', currency: 'EUR', in_stock: true },
    // Black
    { product_id: 'cb76dd20-b0ec-4f37-a5b6-1810b6f67472', merchant_name: 'amazon', price: 159.00, affiliate_link: 'https://www.amazon.fr/s?k=Rode+NT1+Signature+Black&tag=stackera-21', currency: 'EUR', in_stock: true },
    { product_id: 'cb76dd20-b0ec-4f37-a5b6-1810b6f67472', merchant_name: 'woodbrass', price: 159.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Rode+NT1+Signature', currency: 'EUR', in_stock: true },
    // Green
    { product_id: '001b2308-e067-49af-9b8f-05cb2e865e73', merchant_name: 'amazon', price: 159.00, affiliate_link: 'https://www.amazon.fr/s?k=Rode+NT1+Signature+Green&tag=stackera-21', currency: 'EUR', in_stock: true },
    { product_id: '001b2308-e067-49af-9b8f-05cb2e865e73', merchant_name: 'woodbrass', price: 159.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Rode+NT1+Signature', currency: 'EUR', in_stock: true },
    // Blue
    { product_id: '4d5e62d9-433e-4fca-8d4f-519fd3ff8cd5', merchant_name: 'amazon', price: 159.00, affiliate_link: 'https://www.amazon.fr/s?k=Rode+NT1+Signature+Blue&tag=stackera-21', currency: 'EUR', in_stock: true },
    { product_id: '4d5e62d9-433e-4fca-8d4f-519fd3ff8cd5', merchant_name: 'woodbrass', price: 159.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Rode+NT1+Signature', currency: 'EUR', in_stock: true },

    // --- LEWITT LCT ---
    // LCT 240 PRO (~139 EUR)
    { product_id: 'fb05bc6a-5f29-4e60-9c56-be16f574b842', merchant_name: 'amazon', price: 139.00, affiliate_link: 'https://www.amazon.fr/s?k=Lewitt+LCT+240+PRO&tag=stackera-21', currency: 'EUR', in_stock: true },
    { product_id: 'fb05bc6a-5f29-4e60-9c56-be16f574b842', merchant_name: 'woodbrass', price: 139.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Lewitt+LCT+240', currency: 'EUR', in_stock: true },
    // LCT 240 Vocal Set
    { product_id: '190a9fa6-299d-406f-927c-c5a9bf48127d', merchant_name: 'amazon', price: 149.00, affiliate_link: 'https://www.amazon.fr/s?k=Lewitt+LCT+240+PRO&tag=stackera-21', currency: 'EUR', in_stock: true },
    { product_id: '190a9fa6-299d-406f-927c-c5a9bf48127d', merchant_name: 'woodbrass', price: 155.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Lewitt+LCT+240', currency: 'EUR', in_stock: true },
    // LCT 440 PURE (~265 EUR)
    { product_id: '81422e7f-7da7-412e-9610-ff857104c7b8', merchant_name: 'amazon', price: 265.00, affiliate_link: 'https://www.amazon.fr/s?k=Lewitt+LCT+440+PURE&tag=stackera-21', currency: 'EUR', in_stock: true },
    { product_id: '81422e7f-7da7-412e-9610-ff857104c7b8', merchant_name: 'woodbrass', price: 269.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Lewitt+LCT+440', currency: 'EUR', in_stock: true },
    // LCT 540 S (Subzero)
    { product_id: '46f331ae-1739-4a38-93dc-df095fdb7c4e', merchant_name: 'amazon', price: 649.00, affiliate_link: 'https://www.amazon.fr/s?k=Lewitt+LCT+540+S&tag=stackera-21', currency: 'EUR', in_stock: true },
    { product_id: '46f331ae-1739-4a38-93dc-df095fdb7c4e', merchant_name: 'woodbrass', price: 649.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Lewitt+LCT+540', currency: 'EUR', in_stock: true },

    // --- WARM AUDIO JR ---
    // WA-47jr
    { product_id: '052fdc2d-1140-45c4-8bd8-d555c0e86d70', merchant_name: 'amazon', price: 299.00, affiliate_link: 'https://www.amazon.fr/s?k=Warm+Audio+WA-47jr&tag=stackera-21', currency: 'EUR', in_stock: true },
    { product_id: '052fdc2d-1140-45c4-8bd8-d555c0e86d70', merchant_name: 'woodbrass', price: 299.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Warm+Audio+WA-47jr', currency: 'EUR', in_stock: true },
    // WA-87jr
    { product_id: 'daa3f373-dd55-4b6e-9845-23b2a45f261b', merchant_name: 'amazon', price: 299.00, affiliate_link: 'https://www.amazon.fr/s?k=Warm+Audio+WA-87jr&tag=stackera-21', currency: 'EUR', in_stock: true },
    { product_id: 'daa3f373-dd55-4b6e-9845-23b2a45f261b', merchant_name: 'woodbrass', price: 299.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Warm+Audio+WA-87jr', currency: 'EUR', in_stock: true },

    // --- NEUMANN VARIANTS ---
    // TLM 102 BK (Black)
    { product_id: '9b28608c-4f1d-4089-ac4b-5f6f351b8321', merchant_name: 'amazon', price: 615.00, affiliate_link: 'https://www.amazon.fr/s?k=Neumann+TLM+102&tag=stackera-21', currency: 'EUR', in_stock: true },
    { product_id: '9b28608c-4f1d-4089-ac4b-5f6f351b8321', merchant_name: 'woodbrass', price: 625.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Neumann+TLM+102', currency: 'EUR', in_stock: true },
    // TLM 103 mt (Matte Black)
    { product_id: '8a5d2f08-f83a-4d8c-8fd1-6f60c3eb3b73', merchant_name: 'amazon', price: 1195.00, affiliate_link: 'https://www.amazon.fr/s?k=Neumann+TLM+103&tag=stackera-21', currency: 'EUR', in_stock: true },
    { product_id: '8a5d2f08-f83a-4d8c-8fd1-6f60c3eb3b73', merchant_name: 'woodbrass', price: 1199.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Neumann+TLM+103', currency: 'EUR', in_stock: true },
    // TLM 49
    { product_id: '2f605a39-5cfb-4f20-b992-1c1530baf09a', merchant_name: 'amazon', price: 1549.00, affiliate_link: 'https://www.amazon.fr/s?k=Neumann+TLM+49&tag=stackera-21', currency: 'EUR', in_stock: true },
    { product_id: '2f605a39-5cfb-4f20-b992-1c1530baf09a', merchant_name: 'woodbrass', price: 1599.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Neumann+TLM+49', currency: 'EUR', in_stock: true }
];

async function insertOffersVerify() {
    console.log(`Upserting ${OFFERS.length} verified offers...`);
    const { error } = await supabase.from('product_offers').upsert(OFFERS, { onConflict: 'product_id, merchant_name' });

    if (error) {
        console.error('Error Upserting:', error);
    } else {
        console.log('✅ Batch 8 (Premium Consolidation) Offers updated successfully.');
    }
}

insertOffersVerify();
