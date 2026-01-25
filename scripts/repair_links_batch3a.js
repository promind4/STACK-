
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing environment variables for Supabase.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const updates = [
    {
        name: 'RAY Autofocus Microphone',
        woodbrass_url: 'https://www.woodbrass.com/microphones-a-large-membrane-lewitt-ray-p392400.html'
    },
    {
        name: 'Stealth',
        woodbrass_url: 'https://www.woodbrass.com/microphones-a-large-membrane-aston-microphones-stealth-p288960.html'
    },
    {
        name: 'Stealth Broadcast',
        woodbrass_url: 'https://www.woodbrass.com/microphones-a-large-membrane-aston-microphones-stealth-p288960.html'
    },
    {
        name: 'WA-251',
        woodbrass_url: 'https://www.woodbrass.com/recherche?keyword=Warm+Audio+WA-251'
    },
    {
        name: 'WA-67',
        woodbrass_url: 'https://www.woodbrass.com/recherche?keyword=Warm+Audio+WA-67'
    },
    {
        name: 'AE 3000',
        woodbrass_url: 'https://www.woodbrass.com/recherche?keyword=Audio-Technica+AE 3000'
    }
];

async function updateLinks() {
    console.log('Starting Batch 3a Link Repair...');

    for (const item of updates) {
        // 1. Find the product ID
        const { data: products, error: productError } = await supabase
            .from('products')
            .select('id, name')
            .eq('name', item.name)
            .limit(1);

        if (productError) {
            console.error(`Error finding product ${item.name}:`, productError);
            continue;
        }

        if (!products || products.length === 0) {
            console.warn(`Product not found: ${item.name}`);
            continue;
        }

        const productId = products[0].id;
        console.log(`Found product: ${products[0].name} (ID: ${productId})`);

        // 2. Upsert the Woodbrass offer
        // We only update the URL, keeping price null if we don't know it, or maybe we just update the URL if the offer exists.
        // Ideally we upsert. If it exists, we update the URL. If not, we insert with a null price?
        // Let's check if an offer exists first to avoid overwriting price with null if we don't have it.
        // Actually, for this repair, we just want to fix the LINK.

        const { data: existingOffer, error: offerError } = await supabase
            .from('product_offers')
            .select('*')
            .eq('product_id', productId)
            .eq('merchant_name', 'woodbrass')
            .single();

        if (offerError && offerError.code !== 'PGRST116') { // PGRST116 is "Row not found"
            console.error(`Error checking offer for ${item.name}:`, offerError);
            continue;
        }

        const offerData = {
            product_id: productId,
            merchant_name: 'woodbrass',
            affiliate_link: item.woodbrass_url,
            updated_at: new Date().toISOString()
        };

        // If we have a direct link (not a search link), we *could* try to fetch price, but for now let's just save the link.
        // If we are using a search link, we definitely don't have a specific price to update right now unless we had one before.
        // So we will preserve existing price if it exists, or leave it null.

        if (existingOffer) {
            console.log(`Updating existing offer for ${item.name}...`);
            // We do NOT want to overwrite price with null if it is already set.
            // So we strictly invoke update on the specific row ID or unique constraint.
            const { error: updateError } = await supabase
                .from('product_offers')
                .update({ affiliate_link: item.woodbrass_url, updated_at: new Date().toISOString() })
                .eq('id', existingOffer.id); // Use the specific offer ID to be safe

            if (updateError) console.error(`Failed to update offer for ${item.name}:`, updateError);
            else console.log(`✓ Updated link for ${item.name}`);

        } else {
            console.log(`Creating new offer entry for ${item.name}...`);
            const { error: insertError } = await supabase
                .from('product_offers')
                .insert([offerData]);

            if (insertError) console.error(`Failed to insert offer for ${item.name}:`, insertError);
            else console.log(`✓ Inserted new offer for ${item.name}`);
        }
    }
    console.log('Batch 3a Repair Complete.');
}

updateLinks();
