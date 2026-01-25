
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function fixWA87() {
    console.log('Fixing WA-87 R2 products...');

    // Fetch products with the issue
    // Note: Searching for the replacement character  might be tricky depending on DB collation/encoding,
    // so we'll fetch by name and do JS replacement.
    const { data: products, error } = await supabase
        .from('products')
        .select('id, name, description')
        .ilike('name', '%WA-87 R2%');

    if (error) {
        console.error('Fetch error:', error);
        return;
    }

    for (const product of products) {
        let newDesc = product.description;
        // Replace the replacement character  textually if it appears as such or hex
        // We'll target the specific substring "cardiode" we saw in logs:
        // It might be represented as \uFFFD in JS string.

        // Try explicit replacement character
        newDesc = newDesc.replace(/cardio.de/g, 'cardioïde');
        // The . matches any single char, including . 
        // Safer might be to check if it contains the broken version first.

        if (newDesc !== product.description) {
            const { error: updateError } = await supabase
                .from('products')
                .update({ description: newDesc })
                .eq('id', product.id);

            if (updateError) {
                console.error(`Error updating ${product.name}:`, updateError);
            } else {
                console.log(`[FIXED] ${product.name}`);
            }
        } else {
            console.log(`[NO CHANGE] ${product.name} (Pattern did not match?)`);
            console.log(`Current desc: ${product.description}`);
        }
    }
}

fixWA87();
