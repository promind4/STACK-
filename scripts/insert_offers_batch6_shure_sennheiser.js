import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const OFFERS = [
    // Sennheiser MKE 600
    {
        product_id: '29a478fb-8489-4604-94b4-94164f90fe6f',
        merchant_name: 'amazon',
        price: 299.00,
        affiliate_link: 'https://www.amazon.fr/s?k=Sennheiser+MKE+600&tag=stackera-21',
        currency: 'EUR',
        in_stock: true
    },
    {
        product_id: '29a478fb-8489-4604-94b4-94164f90fe6f',
        merchant_name: 'woodbrass',
        price: 299.00,
        affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Sennheiser+MKE+600',
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
        console.log('✅ Batch 6 (Shure/Sennheiser Remaining) Offers updated successfully.');
    }
}

insertOffersVerify();
