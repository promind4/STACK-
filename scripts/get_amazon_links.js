import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function getLinks() {
    const { data } = await supabase
        .from('product_offers')
        .select('product_id, merchant_name, affiliate_link, products!inner(name, slug)')
        .eq('merchant_name', 'amazon');

    console.log("📎 ALL AMAZON AFFILIATE LINKS FOR CAMERAS:\n");

    data?.forEach(o => {
        const product = (o as any).products;
        console.log(`[${product.name}]`);
        console.log(`  Slug: ${product.slug}`);
        console.log(`  Link: ${o.affiliate_link}`);

        // Extract ASIN
        const asinMatch = o.affiliate_link?.match(/\/dp\/([A-Z0-9]+)/);
        if (asinMatch) {
            console.log(`  ASIN: ${asinMatch[1]}`);
        }
        console.log("");
    });
}

getLinks();
