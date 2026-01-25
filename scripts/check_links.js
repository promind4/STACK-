
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkLinks() {
    console.log("Checking affiliate links for recent offers...");
    const { data: offers, error } = await supabase
        .from('product_offers')
        .select('merchant_name, price, affiliate_link, products(name)')
        .order('updated_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error("Error:", error);
    } else {
        console.log(JSON.stringify(offers, null, 2));
    }
}

checkLinks();
