
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const CSV_PATH = 'd:\\Projet studio\\products_filtered.csv';

async function checkMissing() {
    const content = fs.readFileSync(CSV_PATH, 'utf-8');
    const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
    // Skip header
    const dataLines = lines.slice(1);

    const ids = dataLines.map(l => l.split(',')[0].trim());
    console.log(`Checking ${ids.length} IDs from CSV...`);
    console.log(`Sample IDs: ${ids.slice(0, 3).join(', ')}`);

    const { data, error } = await supabase
        .from('products')
        .select('id, name, image_url, gallery_images')
        .in('id', ids);

    if (error) {
        console.error(error);
        return;
    }

    const missing = [];
    const success = [];

    data.forEach(p => {
        if (!p.image_url || !p.gallery_images || p.gallery_images.length === 0) {
            missing.push(p.name);
        } else {
            success.push(p.name);
        }
    });

    console.log(`\n✅ Success: ${success.length}/${ids.length}`);
    console.log(`❌ Missing: ${missing.length}/${ids.length}`);

    if (missing.length > 0) {
        console.log("\nProducts still missing images:");
        missing.forEach(name => console.log(` - ${name}`));
    }
}

checkMissing();
