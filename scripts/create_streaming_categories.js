import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function createStreamingCategories() {
    console.log("🎬 CREATING STREAMING CATEGORIES\n");
    console.log("=".repeat(60));

    // 1. Create CAPTATION parent category
    const captationId = randomUUID();
    console.log("\n📁 Creating: Captation (parent)");

    const { error: captError } = await supabase
        .from('categories')
        .insert({
            id: captationId,
            name: 'Captation',
            slug: 'captation',
            parent_id: null,
            description: 'Équipements de capture vidéo et contrôle pour streaming',
            icon: 'video',
            vertical: 'streaming'
        });

    if (captError) {
        console.log(`   ❌ Error: ${captError.message}`);
    } else {
        console.log(`   ✅ Created: ${captationId}`);
    }

    // 2. Create SETUP LIVE parent category
    const setupLiveId = randomUUID();
    console.log("\n📁 Creating: Setup Live (parent)");

    const { error: setupError } = await supabase
        .from('categories')
        .insert({
            id: setupLiveId,
            name: 'Setup Live',
            slug: 'setup-live',
            parent_id: null,
            description: 'Équipements pour optimiser votre espace de streaming',
            icon: 'layout',
            vertical: 'streaming'
        });

    if (setupError) {
        console.log(`   ❌ Error: ${setupError.message}`);
    } else {
        console.log(`   ✅ Created: ${setupLiveId}`);
    }

    // 3. Create CAPTATION subcategories
    const captationSubs = [
        { name: "Cartes d'acquisition", slug: 'cartes-acquisition', desc: 'Cam Link, cartes de capture pour streaming', icon: 'hard-drive' },
        { name: 'Stream Deck', slug: 'stream-deck', desc: 'Contrôleurs Elgato et alternatives', icon: 'grid-3x3' },
        { name: 'Switchers Vidéo', slug: 'switchers-video', desc: 'ATEM Mini et mélangeurs vidéo', icon: 'combine' }
    ];

    console.log("\n   Subcategories for Captation:");
    for (const sub of captationSubs) {
        const subId = randomUUID();
        const { error } = await supabase
            .from('categories')
            .insert({
                id: subId,
                name: sub.name,
                slug: sub.slug,
                parent_id: captationId,
                description: sub.desc,
                icon: sub.icon,
                vertical: 'streaming'
            });

        if (error) {
            console.log(`   └── ❌ ${sub.name}: ${error.message}`);
        } else {
            console.log(`   └── ✅ ${sub.name} (${subId})`);
        }
    }

    // 4. Create SETUP LIVE subcategories
    const setupLiveSubs = [
        { name: 'Fonds Verts', slug: 'fonds-verts', desc: 'Green screens et chroma key', icon: 'square' },
        { name: 'Téléprompteurs', slug: 'teleprompteurs', desc: 'Pour lire vos scripts devant la caméra', icon: 'file-text' },
        { name: 'Câble Management', slug: 'cable-management', desc: 'Organisation et gestion des câbles', icon: 'cable' }
    ];

    console.log("\n   Subcategories for Setup Live:");
    for (const sub of setupLiveSubs) {
        const subId = randomUUID();
        const { error } = await supabase
            .from('categories')
            .insert({
                id: subId,
                name: sub.name,
                slug: sub.slug,
                parent_id: setupLiveId,
                description: sub.desc,
                icon: sub.icon,
                vertical: 'streaming'
            });

        if (error) {
            console.log(`   └── ❌ ${sub.name}: ${error.message}`);
        } else {
            console.log(`   └── ✅ ${sub.name} (${subId})`);
        }
    }

    console.log("\n" + "=".repeat(60));
    console.log("✨ Done! Streaming categories created.");
    console.log("\nStructure:");
    console.log("📁 Captation");
    console.log("   └── Cartes d'acquisition");
    console.log("   └── Stream Deck");
    console.log("   └── Switchers Vidéo");
    console.log("📁 Setup Live");
    console.log("   └── Fonds Verts");
    console.log("   └── Téléprompteurs");
    console.log("   └── Câble Management");
}

createStreamingCategories();
