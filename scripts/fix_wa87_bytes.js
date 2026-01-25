
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function fixWA87Bytes() {
    console.log('Fixing WA-87 R2 products (byte level)...');

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
        // Explicitly target the replacement character \uFFFD
        // Pattern: cardio + \uFFFD + de -> cardioïde
        newDesc = newDesc.replace(/cardio\uFFFDde/g, 'cardioïde');

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
            console.log(`[NO CHANGE] ${product.name} (Pattern not found)`);
        }
    }
}

fixWA87Bytes();
