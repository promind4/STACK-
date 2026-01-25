import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const OFFERS = [
    // SM7B
    { product_id: '70ddf166-76b6-4f4e-bbe0-c79f325abee3', merchant_name: 'amazon', price: 389.00, affiliate_link: 'https://www.amazon.fr/s?k=Shure+SM7B&tag=stackera-21', currency: 'EUR' },
    { product_id: '70ddf166-76b6-4f4e-bbe0-c79f325abee3', merchant_name: 'woodbrass', price: 388.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Shure+SM7B', currency: 'EUR' },

    // NT1 5th
    { product_id: '766e65ff-f4fd-45c4-9db2-526e774c297d', merchant_name: 'amazon', price: 195.00, affiliate_link: 'https://www.amazon.fr/s?k=Rode+NT1+5th&tag=stackera-21', currency: 'EUR' },
    { product_id: '766e65ff-f4fd-45c4-9db2-526e774c297d', merchant_name: 'woodbrass', price: 195.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Rode+NT1+5th', currency: 'EUR' },

    // RE20 Black
    { product_id: '19b6e53f-a8a1-4844-88e4-28e8d315ece3', merchant_name: 'amazon', price: 449.00, affiliate_link: 'https://www.amazon.fr/s?k=Electro-Voice+RE20+Black&tag=stackera-21', currency: 'EUR' },
    { product_id: '19b6e53f-a8a1-4844-88e4-28e8d315ece3', merchant_name: 'woodbrass', price: 598.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Electro-Voice+RE20', currency: 'EUR' },

    // AT2020USB-X
    { product_id: '7a0a8f7c-36dd-4bd8-8f44-6995e2cb9d8c', merchant_name: 'amazon', price: 129.00, affiliate_link: 'https://www.amazon.fr/s?k=AT2020USB-X&tag=stackera-21', currency: 'EUR' },
    { product_id: '7a0a8f7c-36dd-4bd8-8f44-6995e2cb9d8c', merchant_name: 'woodbrass', price: 148.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=AT2020USB-X', currency: 'EUR' },

    // MV7X
    { product_id: '49249f2b-d6a5-4f83-8869-01304f179fcf', merchant_name: 'amazon', price: 189.00, affiliate_link: 'https://www.amazon.fr/s?k=Shure+MV7X&tag=stackera-21', currency: 'EUR' },
    { product_id: '49249f2b-d6a5-4f83-8869-01304f179fcf', merchant_name: 'woodbrass', price: 195.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Shure+MV7X', currency: 'EUR' },

    // PodMic USB
    { product_id: 'd2120d34-55d2-4b21-84c4-b2a7d3f92027', merchant_name: 'amazon', price: 199.00, affiliate_link: 'https://www.amazon.fr/s?k=Rode+PodMic+USB&tag=stackera-21', currency: 'EUR' },
    { product_id: 'd2120d34-55d2-4b21-84c4-b2a7d3f92027', merchant_name: 'woodbrass', price: 238.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Rode+PodMic+USB', currency: 'EUR' },

    // MKH 416
    { product_id: '9200e47e-44ab-48a4-bc03-76eebf84a7c5', merchant_name: 'amazon', price: 849.00, affiliate_link: 'https://www.amazon.fr/s?k=Sennheiser+MKH+416&tag=stackera-21', currency: 'EUR' },
    { product_id: '9200e47e-44ab-48a4-bc03-76eebf84a7c5', merchant_name: 'woodbrass', price: 899.00, affiliate_link: 'https://www.woodbrass.com/recherche?keyword=Sennheiser+MKH+416', currency: 'EUR' }
];

async function insertOffers() {
    console.log(`Inserting ${OFFERS.length} offers...`);
    const { error } = await supabase.from('product_offers').upsert(OFFERS, { onConflict: 'product_id, merchant_name' });
    // Ideally UPSERT but primary key is ID generated auto? Or composite?
    // Usually product_offers has its own ID. I should simple INSERT. 
    // If user wants to replace, I might need to delete old ones first or use upsert if I had IDs.
    // For now, I'll delete existing offers for these merchants/products to be safe and avoid duplicates if run twice. (Optional safety)

    if (error) {
        console.error('Error Inserting:', error);
    } else {
        console.log('✅ Offers inserted successfully.');
    }
}

insertOffers();
