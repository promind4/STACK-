
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role for updates

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const SQL_FILE_PATH = 'd:\\Projet studio\\maj_images_42_produits_V5.sql';

async function applyUpdates() {
    console.log(`Reading SQL file: ${SQL_FILE_PATH}`);

    try {
        const content = fs.readFileSync(SQL_FILE_PATH, 'utf-8');
        const lines = content.split('\n').filter(l => l.trim().length > 0);

        console.log(`Found ${lines.length} SQL statements. Executing...`);

        let success = 0;
        let errors = 0;

        for (const line of lines) {
            // Parse the SQL line regex
            // UPDATE products SET image_url = '...', gallery_images = '{...}' WHERE id = '...';
            const match = line.match(/UPDATE products SET image_url = '(.*?)', gallery_images = '{(.*?)}' WHERE id = '(.*?)';/);

            if (!match) {
                console.warn(`Could not parse line: ${line.substring(0, 50)}...`);
                continue;
            }

            const imageUrl = match[1];
            const galleryRaw = match[2]; // comma separated URLs
            const id = match[3];

            // Parse gallery string to array. The input string is like "url1","url2" (double quotes inside single quotes from SQL gen)
            // The python script generates: gallery_images = '{"url1","url2"}'
            // So match[2] will be: "url1","url2"

            // We need to split matching the comma but respecting quotes? 
            // Actually simpler: split by `","` and clean up leading/trailing `"`
            // Or just split by `,` and strip quotes.

            const galleryImages = galleryRaw.split(',').map(s => s.trim().replace(/^"|"$/g, ''));

            // Perform Update
            const { error } = await supabase
                .from('products')
                .update({
                    image_url: imageUrl,
                    gallery_images: galleryImages
                })
                .eq('id', id);

            if (error) {
                console.error(`❌ Error updating ${id}:`, error.message);
                errors++;
            } else {
                // console.log(`✅ Updated ${id}`);
                process.stdout.write('.');
                success++;
            }
        }

        console.log(`\n\n🎉 Done! Success: ${success}, Errors: ${errors}`);

    } catch (err) {
        console.error("Error reading/executing file:", err);
    }
}

applyUpdates();
