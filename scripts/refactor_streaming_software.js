import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function refactorSoftwareCategories() {
    console.log("🔄 REFACTORING STREAMING SOFTWARE CATEGORIES\n");
    console.log("=".repeat(60));

    // 1. Ensure "Logiciels" Root Category exists
    let logicielsParentId;
    const { data: existingParent } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', 'logiciels')
        .single();

    if (existingParent) {
        logicielsParentId = existingParent.id;
        console.log(`✅ Found 'Logiciels' parent: ${logicielsParentId}`);
    } else {
        logicielsParentId = randomUUID();
        console.log(`🆕 Creating 'Logiciels' parent...`);
        const { error } = await supabase.from('categories').insert({
            id: logicielsParentId,
            name: 'Logiciels',
            slug: 'logiciels',
            description: 'Logiciels de streaming et création',
            vertical: 'streaming',
            icon: 'code', // or appropriate icon
            parent_id: null
        });
        if (error) console.log(`❌ Error creating parent: ${error.message}`);
    }

    // 2. Refactor "Obs Studio" -> "Logiciels & Apps"
    console.log("\n🛠Refactoring 'Obs Studio' -> 'Logiciels & Apps'...");
    let appsId;

    // Try to find old category
    const { data: obsCat } = await supabase
        .from('categories')
        .select('id')
        .in('slug', ['obs', 'obs-studio'])
        .single();

    if (obsCat) {
        console.log(`   Found old 'Obs Studio' (${obsCat.id}). Renaming...`);
        appsId = obsCat.id;
        const { error } = await supabase
            .from('categories')
            .update({
                name: 'Logiciels & Apps',
                slug: 'logiciels-apps',
                description: 'Streamlabs, vMix, VoiceMod, etc.',
                parent_id: logicielsParentId // Ensure linked to parent
            })
            .eq('id', appsId);
        if (error) console.log(`   ❌ Rename error: ${error.message}`);
        else console.log(`   ✅ Renamed successfully.`);
    } else {
        // Check if new one already exists
        const { data: existingNew } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', 'logiciels-apps')
            .single();

        if (existingNew) {
            console.log(`   'Logiciels & Apps' already exists (${existingNew.id}).`);
            appsId = existingNew.id;
        } else {
            console.log(`   Old category not found. Creating 'Logiciels & Apps'...`);
            appsId = randomUUID();
            const { error } = await supabase.from('categories').insert({
                id: appsId,
                name: 'Logiciels & Apps',
                slug: 'logiciels-apps',
                description: 'Streamlabs, vMix, VoiceMod, etc.',
                vertical: 'streaming',
                icon: 'app-window',
                parent_id: logicielsParentId
            });
            if (error) console.log(`   ❌ Creation error: ${error.message}`);
            else console.log(`   ✅ Created successfully.`);
        }
    }

    // 3. Refactor "Overlays" -> "Design & Overlays"
    console.log("\n🛠Refactoring 'Overlays' -> 'Design & Overlays'...");
    let designId;

    // Try to find old category
    const { data: overlayCat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', 'overlays')
        .single();

    if (overlayCat) {
        console.log(`   Found old 'Overlays' (${overlayCat.id}). Renaming...`);
        designId = overlayCat.id;
        const { error } = await supabase
            .from('categories')
            .update({
                name: 'Design & Overlays',
                slug: 'design-overlays',
                description: 'Overlays, alertes, logos, bannières',
                parent_id: logicielsParentId
            })
            .eq('id', designId);
        if (error) console.log(`   ❌ Rename error: ${error.message}`);
        else console.log(`   ✅ Renamed successfully.`);
    } else {
        // Check if new one already exists
        const { data: existingNew } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', 'design-overlays')
            .single();

        if (existingNew) {
            console.log(`   'Design & Overlays' already exists (${existingNew.id}).`);
            designId = existingNew.id;
        } else {
            console.log(`   Old category not found. Creating 'Design & Overlays'...`);
            designId = randomUUID();
            const { error } = await supabase.from('categories').insert({
                id: designId,
                name: 'Design & Overlays',
                slug: 'design-overlays',
                description: 'Overlays, alertes, logos, bannières',
                vertical: 'streaming',
                icon: 'palette',
                parent_id: logicielsParentId
            });
            if (error) console.log(`   ❌ Creation error: ${error.message}`);
            else console.log(`   ✅ Created successfully.`);
        }
    }

    // 4. Cleanup "Alerte" -> Merge to "Design & Overlays"
    console.log("\n🧹 Cleaning up 'Alerte'...");

    const { data: alerteCat } = await supabase
        .from('categories')
        .select('id')
        .or('slug.eq.alerte,slug.eq.alerts,slug.eq.alertes') // Check multiple variations
        .single();

    if (alerteCat) {
        console.log(`   Found 'Alerte' category (${alerteCat.id}). Moving products...`);

        // Move products
        const { error: moveError } = await supabase
            .from('products')
            .update({ category_id: designId })
            .eq('category_id', alerteCat.id);

        if (moveError) {
            console.log(`   ❌ Error moving products: ${moveError.message}`);
        } else {
            console.log(`   ✅ Products moved.`);

            // Delete category
            const { error: delError } = await supabase
                .from('categories')
                .delete()
                .eq('id', alerteCat.id);

            if (delError) console.log(`   ❌ Error deleting category: ${delError.message}`);
            else console.log(`   ✅ Category 'Alerte' deleted.`);
        }
    } else {
        console.log(`   'Alerte' category not found. Nothing to cleanup.`);
    }

    console.log("\n" + "=".repeat(60));
    console.log("✨ Refactoring Complete.");
}

refactorSoftwareCategories();
