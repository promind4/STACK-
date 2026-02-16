/**
 * Script to detect broken image URLs in products
 * Checks HTTP status of all image_url and gallery_images
 * Outputs list of products needing image fixes
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

// Check if an image URL is valid (returns 200)
async function checkImageUrl(url) {
    if (!url || url.trim() === '') return { valid: false, reason: 'empty' };
    if (url.includes('unsplash')) return { valid: false, reason: 'placeholder' };

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal
        });
        clearTimeout(timeout);

        if (response.ok) {
            return { valid: true };
        } else {
            return { valid: false, reason: `HTTP ${response.status}` };
        }
    } catch (error) {
        return { valid: false, reason: error.message.substring(0, 30) };
    }
}

async function detectBrokenImages() {
    console.log('\n🔍 Détection des images cassées...\n');

    // Get all active products
    const { data: products, error } = await supabase
        .from('products')
        .select('id, name, slug, image_url, gallery_images')
        .eq('is_active', true);

    if (error) {
        console.error('Erreur:', error);
        return;
    }

    console.log(`📦 ${products.length} produits à vérifier\n`);

    const broken = [];
    const valid = [];
    let checked = 0;

    for (const product of products) {
        checked++;
        process.stdout.write(`\r⏳ Vérification ${checked}/${products.length}: ${product.name.substring(0, 30).padEnd(30)}`);

        const issues = [];

        // Check main image
        const mainCheck = await checkImageUrl(product.image_url);
        if (!mainCheck.valid) {
            issues.push(`Image principale: ${mainCheck.reason}`);
        }

        // Check gallery images
        const gallery = product.gallery_images || [];
        let galleryBroken = 0;
        for (const img of gallery) {
            const galCheck = await checkImageUrl(img);
            if (!galCheck.valid) {
                galleryBroken++;
            }
        }
        if (galleryBroken > 0) {
            issues.push(`Galerie: ${galleryBroken}/${gallery.length} cassées`);
        }
        if (gallery.length === 0) {
            issues.push('Galerie vide');
        }

        if (issues.length > 0) {
            broken.push({
                id: product.id,
                name: product.name,
                slug: product.slug,
                image_url: product.image_url,
                gallery_count: gallery.length,
                issues
            });
        } else {
            valid.push(product.name);
        }
    }

    console.log('\n\n');
    console.log('='.repeat(60));
    console.log('📊 RÉSULTATS DE L\'AUDIT IMAGES');
    console.log('='.repeat(60));

    console.log(`\n✅ Images valides: ${valid.length}`);
    console.log(`❌ Images à corriger: ${broken.length}\n`);

    if (broken.length > 0) {
        console.log('--- PRODUITS À CORRIGER ---\n');
        broken.forEach((p, i) => {
            console.log(`${(i + 1).toString().padStart(3)}. ${p.name}`);
            console.log(`     Slug: ${p.slug}`);
            console.log(`     Problèmes: ${p.issues.join(', ')}`);
            console.log('');
        });
    }

    // Export to JSON for processing
    const fs = await import('fs');
    const outputPath = './scripts/broken_images.json';
    fs.writeFileSync(outputPath, JSON.stringify(broken, null, 2));
    console.log(`\n📄 Liste exportée: ${outputPath}`);

    // Also create a simple list for quick reference
    const simplePath = './scripts/broken_images_list.txt';
    const simpleList = broken.map((p, i) => `${i + 1}. ${p.name} - ${p.issues.join(', ')}`).join('\n');
    fs.writeFileSync(simplePath, simpleList);
    console.log(`📄 Liste simple: ${simplePath}`);

    return broken;
}

detectBrokenImages();
