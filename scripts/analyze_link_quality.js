
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function analyzeLinks() {
    // Fetch all offers
    const { data: offers } = await supabase
        .from('product_offers')
        .select('id, merchant_name, affiliate_link, products(name)');

    let searchLinks = 0;
    let directLinks = 0;
    let woodbrassSearch = 0;
    let amazonSearch = 0;

    offers.forEach(offer => {
        const link = offer.affiliate_link;
        const isSearch = link.includes('?k=') || link.includes('?keyword=') || link.includes('/s?k='); // Woodbrass & Amazon search patterns

        if (isSearch) {
            searchLinks++;
            if (offer.merchant_name === 'woodbrass') woodbrassSearch++;
            if (offer.merchant_name === 'amazon') amazonSearch++;
        } else {
            directLinks++;
        }
    });

    console.log(`Total Offers: ${offers.length}`);
    console.log(`Direct Product Links (Good): ${directLinks}`);
    console.log(`Fallback Search Links (To Fix): ${searchLinks}`);
    console.log(`  - Woodbrass Search Links: ${woodbrassSearch}`);
    console.log(`  - Amazon Search Links: ${amazonSearch}`);
}

analyzeLinks();
