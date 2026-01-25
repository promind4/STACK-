
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Try to use Service Role Key if available to bypass RLS
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing credentials");
    process.exit(1);
}

console.log(`Using key type: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SERVICE_ROLE (Bypassing RLS)' : 'ANON (Subject to RLS)'}`);

const supabase = createClient(supabaseUrl, supabaseKey);

const updates = [
    { id: '29a478fb-8489-4604-94b4-94164f90fe6f', name: 'Sennheiser MKE 600', rating: 4.8, review_count: 222 },
    { id: 'adc688d4-d9cf-49e2-8073-7a2e49e7cde9', name: 'Røde NTG3', rating: 4.8, review_count: 63 },
    { id: '9200e47e-44ab-48a4-bc03-76eebf84a7c5', name: 'Sennheiser MKH 416 P48', rating: 4.9, review_count: 59 },
    { id: 'fd7ac549-f6b4-4041-86b9-67327e25ec7f', name: 'Røde NTG5', rating: 4.5, review_count: 25 },
    { id: '185e027b-8a22-4147-9c58-9c7dee5f5949', name: 'Røde VideoMic GO II', rating: 5.0, review_count: 2 }
];

async function runEnrichment() {
    console.log("Starting enrichment...");

    let successCount = 0;

    for (const item of updates) {
        const { data, error } = await supabase
            .from('products')
            .update({
                rating: item.rating,
                review_count: item.review_count
            })
            .eq('id', item.id)
            .select();

        if (error) {
            console.error(`❌ Failed to update ${item.name}:`, error.message);
        } else if (!data || data.length === 0) {
            console.log(`⚠️  Update attempted on ${item.name} but NO ROWS updated. RLS likely blocking anon update.`);
        } else {
            console.log(`✅ Updated ${item.name}: ${item.rating} stars / ${item.review_count} reviews`);
            successCount++;
        }
    }

    console.log(`Enrichment complete. Success: ${successCount}/${updates.length}`);
}

runEnrichment();
