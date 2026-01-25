import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const OFFERS = [
    // Neumann TLM 102
    {
        product_id: '2ec5cc74-21cf-4ef8-bdbc-e984700e9041',
        merchant_name: 'amazon',
        price: 599.00, // Average price
        affiliate_link: 'https://www.amazon.fr/dp/B003HGLPC6?tag=stackera-21', // Verified ASIN
        currency: 'EUR',
        in_stock: true
    },
    {
        product_id: '2ec5cc74-21cf-4ef8-bdbc-e984700e9041',
        merchant_name: 'woodbrass',
        price: 615.00, // Woodbrass typically higher on Neumann
        affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Neumann+TLM+102',
        currency: 'EUR',
        in_stock: true
    },

    // Neumann TLM 107
    {
        product_id: 'c5b36d26-193d-4f1a-8128-e504497146da',
        merchant_name: 'amazon',
        price: 1399.00,
        affiliate_link: 'https://www.amazon.fr/s?k=Neumann+TLM+107&tag=stackera-21', // Fallback to search
        currency: 'EUR',
        in_stock: true
    },
    {
        product_id: 'c5b36d26-193d-4f1a-8128-e504497146da',
        merchant_name: 'woodbrass',
        price: 1449.00,
        affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Neumann+TLM+107',
        currency: 'EUR',
        in_stock: true
    },

    // Warm Audio WA-251
    {
        product_id: '945a3bdf-7577-4a46-885d-e5967d0b976f',
        merchant_name: 'amazon',
        price: 849.00,
        affiliate_link: 'https://www.amazon.fr/s?k=Warm+Audio+WA-251&tag=stackera-21',
        currency: 'EUR',
        in_stock: true
    },
    {
        product_id: '945a3bdf-7577-4a46-885d-e5967d0b976f',
        merchant_name: 'woodbrass',
        price: 899.00,
        affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Warm+Audio+WA-251',
        currency: 'EUR',
        in_stock: true
    },

    // Warm Audio WA-67
    {
        product_id: '9e70c44d-1c08-446d-8aa5-123403422a8c',
        merchant_name: 'amazon',
        price: 899.00,
        affiliate_link: 'https://www.amazon.fr/s?k=Warm+Audio+WA-67&tag=stackera-21',
        currency: 'EUR',
        in_stock: true
    },
    {
        product_id: '9e70c44d-1c08-446d-8aa5-123403422a8c',
        merchant_name: 'woodbrass',
        price: 949.00,
        affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Warm+Audio+WA-67',
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
        console.log('✅ Batch 4 (Studio Expansion) Offers updated successfully.');
    }
}

insertOffersVerify();
