
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function auditProducts() {
    const { data: products, error } = await supabase
        .from('products')
        .select('id, name, slug, image_url, gallery_images, description, pros, cons')
        .eq('is_active', true);

    if (error) {
        console.error('Error:', error);
        return;
    }

    // Scoring function for completeness
    const scoreProduct = (p) => {
        let score = 0;
        let issues = [];

        // Image principale (30 points)
        if (p.image_url && !p.image_url.includes('unsplash') && !p.image_url.includes('placeholder')) {
            score += 30;
        } else {
            issues.push('IMAGE_MANQUANTE');
        }

        // Galerie (20 points)
        const gallery = p.gallery_images || [];
        if (Array.isArray(gallery) && gallery.length >= 3) {
            score += 20;
        } else if (Array.isArray(gallery) && gallery.length > 0) {
            score += 10;
            issues.push(`GALERIE_INCOMPLETE (${gallery.length}/3+)`);
        } else {
            issues.push('GALERIE_VIDE');
        }

        // Description (20 points)
        if (p.description && p.description.length > 100) {
            score += 20;
        } else if (p.description && p.description.length > 30) {
            score += 10;
            issues.push('DESCRIPTION_COURTE');
        } else {
            issues.push('DESCRIPTION_MANQUANTE');
        }

        // Pros (15 points)
        const pros = p.pros || [];
        if (Array.isArray(pros) && pros.length >= 2) {
            score += 15;
        } else {
            issues.push('PROS_MANQUANTS');
        }

        // Cons (15 points)
        const cons = p.cons || [];
        if (Array.isArray(cons) && cons.length >= 1) {
            score += 15;
        } else {
            issues.push('CONS_MANQUANTS');
        }

        return { score, issues };
    };

    // Score all products
    const scored = products.map(p => {
        const { score, issues } = scoreProduct(p);
        return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            score,
            issues,
            image_url: p.image_url,
            gallery_count: (p.gallery_images || []).length
        };
    });

    // Sort by score (ascending = incomplete first)
    scored.sort((a, b) => a.score - b.score);

    // Output results
    console.log('\n=== AUDIT PRODUITS - TRIÉS PAR COMPLÉTUDE ===\n');
    console.log('Score | Produit | Problèmes');
    console.log('------|---------|----------');

    // Show incomplete products first (score < 70)
    const incomplete = scored.filter(p => p.score < 70);
    const complete = scored.filter(p => p.score >= 70);

    console.log('\n--- PRODUITS INCOMPLETS (Priorité haute) ---\n');
    incomplete.slice(0, 50).forEach(p => {
        console.log(`${p.score.toString().padStart(3)}% | ${p.name.slice(0, 40).padEnd(40)} | ${p.issues.join(', ')}`);
    });

    console.log(`\n... et ${incomplete.length - 50} autres produits incomplets.`);

    console.log('\n--- STATISTIQUES ---');
    console.log(`Total produits: ${products.length}`);
    console.log(`Incomplets (< 70%): ${incomplete.length}`);
    console.log(`Complets (>= 70%): ${complete.length}`);

    // Export liste pour scraping
    const toScrape = incomplete.filter(p => p.issues.includes('IMAGE_MANQUANTE') || p.issues.includes('GALERIE_VIDE'));
    console.log(`\nProduits à scraper (image/galerie manquante): ${toScrape.length}`);

    // Output JSON for further processing
    const outputPath = './scripts/products_to_scrape.json';
    const fs = await import('fs');
    fs.writeFileSync(outputPath, JSON.stringify(toScrape.slice(0, 100), null, 2));
    console.log(`\nListe exportée vers: ${outputPath}`);
}

auditProducts();
