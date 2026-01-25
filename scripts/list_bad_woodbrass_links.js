
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function listBadLinks() {
    const { data: offers } = await supabase
        .from('product_offers')
        .select('product_id, affiliate_link, products(name)')
        .eq('merchant_name', 'woodbrass');

    const badLinks = offers.filter(o =>
        o.affiliate_link.includes('?keyword=') ||
        o.affiliate_link.includes('recherche?')
    );

    console.log(JSON.stringify(badLinks.slice(10, 20), null, 2)); // Show next 10 (Batch 3)
}

listBadLinks();
