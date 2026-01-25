
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkState() {
    console.log("🔍 Checking DB State for GoPro & Canon R50...");
    console.log(`📡 URL: ${supabaseUrl}`);

    const { data: gopro } = await supabase
        .from('products')
        .select('name, rating, review_count, pros, cons, description, offers:product_offers(affiliate_link)')
        .eq('slug', 'gopro-hero12-black')
        .single();

    console.log("\n📷 GoPro Data in DB:");
    console.log(JSON.stringify(gopro, null, 2));

    const { data: canon } = await supabase
        .from('products')
        .select('name, offers:product_offers(affiliate_link)')
        .eq('slug', 'canon-eos-r50')
        .single();

    console.log("\n📷 Canon R50 Link in DB:");
    console.log(JSON.stringify(canon, null, 2));
}

checkState();
