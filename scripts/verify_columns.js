
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
    console.log("Checking columns in 'products' table...");

    // Fetch one product with all standard columns
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(1);

    if (error) {
        console.error("Error fetching product:", error);
        return;
    }

    if (!data || data.length === 0) {
        console.log("No products found to check columns against.");
        return;
    }

    const product = data[0];
    console.log("--- COLUMNS FOUND ---");
    const keys = Object.keys(product);
    console.log(keys);

    console.log("--- SPECIFIC CHECK ---");
    console.log("rating exists:", 'rating' in product);
    console.log("review_count exists:", 'review_count' in product);
    console.log("----------------------");
}

checkColumns();
