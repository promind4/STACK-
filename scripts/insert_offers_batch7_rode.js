import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const OFFERS = [
    // Røde NTG5 (Shotgun)
    {
        product_id: 'fd7ac549-f6b4-4041-86b9-67327e25ec7f',
        merchant_name: 'amazon',
        price: 499.00,
        affiliate_link: 'https://www.amazon.fr/s?k=Rode+NTG5&tag=stackera-21',
        currency: 'EUR',
        in_stock: true
    },
    {
        product_id: 'fd7ac549-f6b4-4041-86b9-67327e25ec7f',
        merchant_name: 'woodbrass',
        price: 489.00,
        affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Rode+NTG5',
        currency: 'EUR',
        in_stock: true
    },

    // Røde VideoMic GO II
    {
        product_id: '185e027b-8a22-4147-9c58-9c7dee5f5949',
        merchant_name: 'amazon',
        price: 99.00,
        affiliate_link: 'https://www.amazon.fr/s?k=Rode+VideoMic+GO+II&tag=stackera-21',
        currency: 'EUR',
        in_stock: true
    },
    {
        product_id: '185e027b-8a22-4147-9c58-9c7dee5f5949',
        merchant_name: 'woodbrass',
        price: 99.00,
        affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Rode+VideoMic+GO+II',
        currency: 'EUR',
        in_stock: true
    },

    // Røde PodMic
    {
        product_id: '436f7f56-73cb-464e-8337-31d76f103656',
        merchant_name: 'amazon',
        price: 109.00,
        affiliate_link: 'https://www.amazon.fr/s?k=Rode+PodMic&tag=stackera-21',
        currency: 'EUR',
        in_stock: true
    },
    {
        product_id: '436f7f56-73cb-464e-8337-31d76f103656',
        merchant_name: 'woodbrass',
        price: 119.00,
        affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Rode+PodMic',
        currency: 'EUR',
        in_stock: true
    },

    // Røde NTG3
    {
        product_id: 'adc688d4-d9cf-49e2-8073-7a2e49e7cde9',
        merchant_name: 'amazon',
        price: 629.00,
        affiliate_link: 'https://www.amazon.fr/s?k=Rode+NTG3&tag=stackera-21',
        currency: 'EUR',
        in_stock: true
    },
    {
        product_id: 'adc688d4-d9cf-49e2-8073-7a2e49e7cde9',
        merchant_name: 'woodbrass',
        price: 639.00,
        affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Rode+NTG3',
        currency: 'EUR',
        in_stock: true
    }
];

async function insertOffersVerify() {
    console.log(`Upserting ${OFFERS.length} verified offers...`);
    const { error } = await supabase.from('product_offers').upsert(OFFERS, { onConflict: 'product_id, merchant_name' });

    if (error) {
        console.error('Error Upserting:', error);
    } else {
        console.log('✅ Batch 7 (Remaining Rode) Offers updated successfully.');
    }
}

insertOffersVerify();
