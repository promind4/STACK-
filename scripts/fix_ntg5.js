
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function fixLink() {
    console.log("Updating Rode NTG5 link...");

    // Rode NTG5 ID: fd7ac549-f6b4-4041-86b9-67327e25ec7f
    const productId = 'fd7ac549-f6b4-4041-86b9-67327e25ec7f';
    const newLink = 'https://www.woodbrass.com/microphones-pour-cameras-rode-ntg5-p311594.html?queryID=25d81a1c976dbcc7e2d4067336c30b05';

    const { error } = await supabase
        .from('product_offers')
        .update({ affiliate_link: newLink })
        .eq('product_id', productId)
        .eq('merchant_name', 'woodbrass');

    if (error) {
        console.error("Error updating link:", error);
    } else {
        console.log("✅ Rode NTG5 Woodbrass link updated to direct product page.");
    }
}

fixLink();
