import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const OFFERS = [
    // --- MICROTECH GEFELL ---
    // M 930 (Dark Bronze/Satin) - ~1500 EUR
    { product_id: 'bf81ee9a-54dd-4a01-afce-5e2ab9f684a0', merchant_name: 'amazon', price: 1530.00, affiliate_link: 'https://www.amazon.fr/s?k=Microtech+Gefell+M+930&tag=stackera-21', currency: 'EUR', in_stock: true },
    { product_id: 'bf81ee9a-54dd-4a01-afce-5e2ab9f684a0', merchant_name: 'woodbrass', price: 1550.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Microtech+Gefell+M+930', currency: 'EUR', in_stock: true },

    // M 990 - ~3000 EUR
    { product_id: '6bb49b30-9475-4690-a068-e3074e6b415c', merchant_name: 'amazon', price: 2999.00, affiliate_link: 'https://www.amazon.fr/s?k=Microtech+Gefell+M+990&tag=stackera-21', currency: 'EUR', in_stock: true },
    { product_id: '6bb49b30-9475-4690-a068-e3074e6b415c', merchant_name: 'woodbrass', price: 2999.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Microtech+Gefell+M+990', currency: 'EUR', in_stock: true },

    // --- UNIVERSAL AUDIO / BOCK ---
    // Bock 187 - ~1219 EUR
    { product_id: 'f5665188-0997-4f56-ae3b-cbf15c9e8de3', merchant_name: 'amazon', price: 1219.00, affiliate_link: 'https://www.amazon.fr/s?k=Universal+Audio+Bock+187&tag=stackera-21', currency: 'EUR', in_stock: true },
    { product_id: 'f5665188-0997-4f56-ae3b-cbf15c9e8de3', merchant_name: 'woodbrass', price: 1219.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Universal+Audio+Bock+187', currency: 'EUR', in_stock: true },
    // Bock 167 - ~3300 EUR
    { product_id: 'c69c2c67-55ab-47cb-b7f0-993c1ce65a9a', merchant_name: 'amazon', price: 3299.00, affiliate_link: 'https://www.amazon.fr/s?k=Universal+Audio+Bock+167&tag=stackera-21', currency: 'EUR', in_stock: true },
    { product_id: 'c69c2c67-55ab-47cb-b7f0-993c1ce65a9a', merchant_name: 'woodbrass', price: 3299.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Universal+Audio+Bock+167', currency: 'EUR', in_stock: true },
    // Bock 251 - ~5500 EUR
    { product_id: 'e78688fd-0704-4449-83ce-c69c684bb8db', merchant_name: 'amazon', price: 5499.00, affiliate_link: 'https://www.amazon.fr/s?k=Universal+Audio+Bock+251&tag=stackera-21', currency: 'EUR', in_stock: true },
    { product_id: 'e78688fd-0704-4449-83ce-c69c684bb8db', merchant_name: 'woodbrass', price: 5499.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Universal+Audio+Bock+251', currency: 'EUR', in_stock: true },

    // --- GOLDEN AGE PREMIER ---
    // GA-47 MKII - ~1950 EUR
    { product_id: 'b7e6c63d-7d57-4363-adb1-9ee46d7486bf', merchant_name: 'amazon', price: 1950.00, affiliate_link: 'https://www.amazon.fr/s?k=Golden+Age+Premier+GA-47&tag=stackera-21', currency: 'EUR', in_stock: true },
    { product_id: 'b7e6c63d-7d57-4363-adb1-9ee46d7486bf', merchant_name: 'woodbrass', price: 1950.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Golden+Age+Premier+GA-47', currency: 'EUR', in_stock: true },
    // GA-8000 - ~3900 EUR
    { product_id: 'f4de7a83-8adc-490f-9b11-7096963e49ba', merchant_name: 'amazon', price: 3890.00, affiliate_link: 'https://www.amazon.fr/s?k=Golden+Age+Premier+GA-8000&tag=stackera-21', currency: 'EUR', in_stock: true },
    { product_id: 'f4de7a83-8adc-490f-9b11-7096963e49ba', merchant_name: 'woodbrass', price: 3890.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Golden+Age+Premier+GA-8000', currency: 'EUR', in_stock: true },

    // --- SOYUZ ---
    // 023 Bomblet - ~1500 EUR
    { product_id: '241bad74-ce7d-4cfb-acab-0a041a476754', merchant_name: 'amazon', price: 1499.00, affiliate_link: 'https://www.amazon.fr/s?k=Soyuz+023+Bomblet&tag=stackera-21', currency: 'EUR', in_stock: true },
    { product_id: '241bad74-ce7d-4cfb-acab-0a041a476754', merchant_name: 'woodbrass', price: 1499.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Soyuz+023+Bomblet', currency: 'EUR', in_stock: true },

    // --- LEWITT AUTHENTICA (High End) ---
    // LCT 940 - 1599 EUR
    { product_id: 'c0e8271f-7459-478c-a875-22bd8e2d8732', merchant_name: 'amazon', price: 1599.00, affiliate_link: 'https://www.amazon.fr/s?k=Lewitt+LCT+940&tag=stackera-21', currency: 'EUR', in_stock: true },
    { product_id: 'c0e8271f-7459-478c-a875-22bd8e2d8732', merchant_name: 'woodbrass', price: 1599.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Lewitt+LCT+940', currency: 'EUR', in_stock: true },
    // LCT 640 TS - ~899 EUR
    { product_id: '17d47660-2e6f-45ea-bab4-e7232b0a4b77', merchant_name: 'amazon', price: 889.00, affiliate_link: 'https://www.amazon.fr/s?k=Lewitt+LCT+640+TS&tag=stackera-21', currency: 'EUR', in_stock: true },
    { product_id: '17d47660-2e6f-45ea-bab4-e7232b0a4b77', merchant_name: 'woodbrass', price: 899.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Lewitt+LCT+640+TS', currency: 'EUR', in_stock: true },

    // --- NEUMANN BCM ---
    // BCM 104 - ~1050 EUR
    { product_id: 'a6cf8dee-75a8-43f6-b869-0c2b3346dae0', merchant_name: 'amazon', price: 1049.00, affiliate_link: 'https://www.amazon.fr/dp/B0002H0S4E?tag=stackera-21', currency: 'EUR', in_stock: true },
    { product_id: 'a6cf8dee-75a8-43f6-b869-0c2b3346dae0', merchant_name: 'woodbrass', price: 1059.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Neumann+BCM+104', currency: 'EUR', in_stock: true }
];

async function insertOffersVerify() {
    console.log(`Upserting ${OFFERS.length} verified offers...`);
    const { error } = await supabase.from('product_offers').upsert(OFFERS, { onConflict: 'product_id, merchant_name' });

    if (error) {
        console.error('Error Upserting:', error);
    } else {
        console.log('✅ Batch 9 (Boutique) Offers updated successfully.');
    }
}

insertOffersVerify();
