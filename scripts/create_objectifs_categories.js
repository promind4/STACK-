import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function createObjectifsCategories() {
    console.log("📂 CREATING OBJECTIFS CATEGORIES\n");
    console.log("=".repeat(60));

    // 1. Create "Objectifs" as ROOT category (same level as Caméras, Éclairage)
    const objectifsId = randomUUID();

    console.log("\n📁 Creating: Objectifs (root category)");

    const { error: parentError } = await supabase
        .from('categories')
        .insert({
            id: objectifsId,
            name: 'Objectifs',
            slug: 'objectifs',
            parent_id: null, // ROOT category - no parent
            description: 'Objectifs photo et vidéo pour tous types de prises de vue',
            icon: 'aperture',
            vertical: 'video'
        });

    if (parentError) {
        console.log(`   ❌ Error: ${parentError.message}`);
        return;
    }
    console.log(`   ✅ Created with ID: ${objectifsId}`);

    // 2. Create subcategories
    const subcategories = [
        {
            name: 'Grand Angle',
            slug: 'grand-angle',
            description: 'Objectifs grand angle pour paysages, architecture et vlogs',
            icon: 'scan'
        },
        {
            name: 'Focale Fixe',
            slug: 'focale-fixe',
            description: 'Objectifs à focale fixe pour portraits et faible luminosité',
            icon: 'circle-dot'
        },
        {
            name: 'Zoom Polyvalent',
            slug: 'zoom-polyvalent',
            description: 'Zooms polyvalents pour toutes situations',
            icon: 'zoom-in'
        }
    ];

    for (const sub of subcategories) {
        console.log(`\n   └── Creating: ${sub.name}`);

        const subId = randomUUID();

        const { error: subError } = await supabase
            .from('categories')
            .insert({
                id: subId,
                name: sub.name,
                slug: sub.slug,
                parent_id: objectifsId, // Child of Objectifs
                description: sub.description,
                icon: sub.icon,
                vertical: 'video'
            });

        if (subError) {
            console.log(`       ❌ Error: ${subError.message}`);
        } else {
            console.log(`       ✅ Created with ID: ${subId}`);
        }
    }

    console.log("\n" + "=".repeat(60));
    console.log("✨ Done! Objectifs category structure created.");
    console.log("\nStructure:");
    console.log("📁 Objectifs (root)");
    console.log("   └── Grand Angle");
    console.log("   └── Focale Fixe");
    console.log("   └── Zoom Polyvalent");
}

createObjectifsCategories();
