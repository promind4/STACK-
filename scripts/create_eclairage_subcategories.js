import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Éclairage parent ID from the check
const ECLAIRAGE_PARENT_ID = 'aff946d8-3812-4f34-8ce2-e9e62e1d8d47';

async function createEclairageSubcategories() {
    console.log("💡 CREATING ÉCLAIRAGE SUBCATEGORIES\n");
    console.log("=".repeat(60));
    console.log(`Parent: Éclairage (${ECLAIRAGE_PARENT_ID})\n`);

    const subcategories = [
        {
            name: 'Keylight',
            slug: 'keylight',
            description: 'Éclairage principal pour studio et streaming',
            icon: 'sun'
        },
        {
            name: 'Softbox',
            slug: 'softbox',
            description: 'Softbox et diffuseurs pour lumière douce',
            icon: 'square'
        },
        {
            name: 'RGB et Ambiance',
            slug: 'rgb-ambiance',
            description: 'Éclairage RGB et ambiance créative',
            icon: 'palette'
        }
    ];

    for (const sub of subcategories) {
        console.log(`   └── Creating: ${sub.name}`);

        const subId = randomUUID();

        const { error } = await supabase
            .from('categories')
            .insert({
                id: subId,
                name: sub.name,
                slug: sub.slug,
                parent_id: ECLAIRAGE_PARENT_ID,
                description: sub.description,
                icon: sub.icon,
                vertical: 'video'
            });

        if (error) {
            console.log(`       ❌ Error: ${error.message}`);
        } else {
            console.log(`       ✅ Created with ID: ${subId}`);
        }
    }

    console.log("\n" + "=".repeat(60));
    console.log("✨ Done! Éclairage subcategories created.");
    console.log("\nStructure:");
    console.log("📁 Éclairage");
    console.log("   └── Keylight");
    console.log("   └── Softbox");
    console.log("   └── RGB et Ambiance");
}

createEclairageSubcategories();
