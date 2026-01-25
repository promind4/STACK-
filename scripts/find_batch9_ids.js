
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function findBatch9() {
    // 1. Microtech Gefell (M ...)
    const { data: mProducts } = await supabase.from('products').select('id, name').ilike('name', 'M %').limit(20);

    // 2. t.bone (SC ...)
    const { data: scProducts } = await supabase.from('products').select('id, name').ilike('name', 'SC %').limit(20);

    // 3. Lewitt (LCT ...)
    const { data: lctProducts } = await supabase.from('products').select('id, name').ilike('name', 'LCT %').limit(10);

    // 4. Lewitt (PURE ...)
    const { data: pureProducts } = await supabase.from('products').select('id, name').ilike('name', 'PURE %').limit(10);

    console.log("--- Microtech Gefell ---");
    mProducts?.forEach(p => console.log(`"${p.name}": "${p.id}",`));

    console.log("\n--- t.bone ---");
    scProducts?.forEach(p => console.log(`"${p.name}": "${p.id}",`));

    console.log("\n--- Lewitt LCT ---");
    lctProducts?.forEach(p => console.log(`"${p.name}": "${p.id}",`));

    console.log("\n--- Lewitt PURE ---");
    pureProducts?.forEach(p => console.log(`"${p.name}": "${p.id}",`));
}

findBatch9();
