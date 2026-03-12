/**
 * SCRIPT DE MIGRATION : data.ts → Supabase (table articles - Architecture Modulaire)
 * 
 * Usage : node scripts/migrate-articles.js
 * 
 * Ce script :
 * 1. Lit les articles du tableau ARTICLES dans lib/data.ts
 * 2. Décompose le HTML de chaque article en blocs modulaires (JSONB)
 * 3. Insère le tout dans la table Supabase `articles`
 * 
 * ⚠️  NE PAS LANCER AVANT D'AVOIR CRÉÉ LA TABLE VIA LE SQL ⚠️
 * ⚠️  UTILISE LE SERVICE_ROLE_KEY (bypass RLS) ⚠️
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// --- Configuration Supabase ---
const SUPABASE_URL = 'https://oxzapjwfttrgsometnwq.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94emFwandmdHRyZ3NvbWV0bndxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTQwNDM5MCwiZXhwIjoyMDgwOTgwMzkwfQ.O9PU7yqQU_t8A1lrmdB6_5hq92_zcIkuSFh5WXrCHZw';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ═══════════════════════════════════════════
// HELPERS : Extraction HTML → Structures JSONB
// ═══════════════════════════════════════════

/**
 * Extraire le tableau comparatif d'un article HTML
 * Retourne un objet { headers: [], rows: [{ cells: [], highlight: bool }] } ou null
 */
function extractComparisonTable(html) {
    // Match <table> with thead and tbody
    const tableMatch = html.match(/<table[^>]*>([\s\S]*?)<\/table>/i);
    if (!tableMatch) return null;

    const tableHtml = tableMatch[1];

    // Extract headers from <th> tags
    const headers = [];
    const thRegex = /<th[^>]*>([\s\S]*?)<\/th>/gi;
    let thMatch;
    while ((thMatch = thRegex.exec(tableHtml)) !== null) {
        headers.push(stripHtml(thMatch[1]).trim());
    }
    if (headers.length === 0) return null;

    // Extract rows from <tr> in <tbody>
    const tbodyMatch = tableHtml.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
    if (!tbodyMatch) return null;

    const rows = [];
    const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let trMatch;
    while ((trMatch = trRegex.exec(tbodyMatch[1])) !== null) {
        const cells = [];
        const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
        let tdMatch;
        while ((tdMatch = tdRegex.exec(trMatch[1])) !== null) {
            cells.push(stripHtml(tdMatch[1]).trim());
        }
        if (cells.length > 0) {
            rows.push({ cells, highlight: false });
        }
    }

    return rows.length > 0 ? { headers, rows } : null;
}

/**
 * Extraire les blocs produits depuis le HTML d'un article
 */
function extractProductBlocks(html) {
    const blocks = [];

    // Pattern for product cards: look for the card container pattern
    // Two main patterns in data.ts:
    // 1. Old style: <div id="..." class="bg-card border...">
    // 2. New style (interface-audio): <div class="bg-card border border-border rounded-3xl...">

    // We'll use a broad approach: find all product card sections
    // by looking for the affiliate links div which always marks the end of a product card
    const affiliateRegex = /<div\s+class\s*=\s*"[^"]*flex[^"]*wrap[^"]*gap[^"]*mt[^"]*"\s*>([\s\S]*?)<\/div\s*>/gi;

    let match;
    while ((match = affiliateRegex.exec(html)) !== null) {
        const innerHtml = match[1];

        // Extract product slug from href="/produit/..."
        const hrefMatch = innerHtml.match(/href\s*=\s*"([^"]*produit[^"]*)"/i);
        if (!hrefMatch) continue;

        const cleanHref = hrefMatch[1].replace(/\s/g, '');
        const slugMatch = cleanHref.match(/\/produit\/(.+)$/);
        if (!slugMatch) continue;

        const productSlug = slugMatch[1];

        // Extract affiliate links (non-internal links)
        const affiliateLinks = [];
        const linkRegex = /<a\s+href\s*=\s*"(https?:\/\/[^"]+)"[^>]*>[\s\S]*?<img[^>]*alt\s*=\s*"([^"]*)"[\s\S]*?<\/a>/gi;
        let linkMatch;
        while ((linkMatch = linkRegex.exec(innerHtml)) !== null) {
            const url = linkMatch[1];
            const altText = linkMatch[2].trim();
            let merchant = altText.toLowerCase();
            // Normalize merchant names
            if (merchant.includes('thomann')) merchant = 'thomann';
            else if (merchant.includes('amazon')) merchant = 'amazon';
            else if (merchant.includes('woodbrass')) merchant = 'woodbrass';

            affiliateLinks.push({
                merchant,
                url,
                label: altText || merchant.charAt(0).toUpperCase() + merchant.slice(1)
            });
        }

        // Now look backwards in the HTML to find the full product card context
        const matchStart = match.index;

        // Find the nearest product card container before this affiliate div
        // Look for h3 with product name
        const beforeHtml = html.substring(Math.max(0, matchStart - 5000), matchStart);

        // Extract title (h3)
        const h3Matches = [...beforeHtml.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)];
        const lastH3 = h3Matches.length > 0 ? h3Matches[h3Matches.length - 1] : null;
        const title = lastH3 ? stripHtml(lastH3[1]).trim() : productSlug;

        // Extract subtitle (p after h3 with tracking-wider)
        const subtitleMatch = beforeHtml.match(/<p[^>]*tracking-wider[^>]*>([\s\S]*?)<\/p>/i);
        const subtitle = subtitleMatch ? stripHtml(subtitleMatch[1]).trim() : '';

        // Extract description (main <p> text)
        const descMatches = [...beforeHtml.matchAll(/<p[^>]*(?:leading-relaxed|text-foreground)[^>]*>([\s\S]*?)<\/p>/gi)];
        const description = descMatches.length > 0 ? stripHtml(descMatches[descMatches.length - 1][1]).trim() : '';

        // Extract image
        const imgMatch = beforeHtml.match(/<img[^>]*src\s*=\s*"([^"]+)"[^>]*alt\s*=\s*"([^"]*)"[^>]*>/i);
        const imageUrl = imgMatch ? imgMatch[1] : '';

        // Extract pros
        const prosMatch = beforeHtml.match(/Points?\s*Forts?<\/h4>\s*<ul[^>]*>([\s\S]*?)<\/ul>/i)
            || beforeHtml.match(/On\s*aime<\/h4>\s*<ul[^>]*>([\s\S]*?)<\/ul>/i);
        const pros = prosMatch ? extractListItems(prosMatch[1]) : [];

        // Extract cons
        const consMatch = beforeHtml.match(/Limites?\s*réelles?<\/h4>\s*<ul[^>]*>([\s\S]*?)<\/ul>/i)
            || beforeHtml.match(/On\s*aime\s*moins<\/h4>\s*<ul[^>]*>([\s\S]*?)<\/ul>/i);
        const cons = consMatch ? extractListItems(consMatch[1]) : [];

        // Extract usage tip
        const tipMatch = beforeHtml.match(/Notre\s*conseil\s*d['']usage\s*:\s*<\/strong>\s*([\s\S]*?)\s*<\/div>/i);
        const usageTip = tipMatch ? stripHtml(tipMatch[1]).trim() : '';

        // Extract badge (e.g., "#1 : La Référence Absolue")
        const badgeMatch = beforeHtml.match(/tracking-widest\s*uppercase[^>]*>\s*([\s\S]*?)\s*<\/div>/i);
        const badge = badgeMatch ? stripHtml(badgeMatch[1]).trim() : '';

        blocks.push({
            product_slug: productSlug,
            badge: badge || null,
            title: title.replace(/^\d+\.\s*/, ''), // Remove leading "1. " numbers
            subtitle: subtitle || null,
            image_url: imageUrl || null,
            description: description || null,
            pros_title: 'Points Forts',
            pros,
            cons_title: 'Limites réelles',
            cons,
            usage_tip: usageTip || null,
            affiliate_links: affiliateLinks
        });
    }

    return blocks;
}

/**
 * Extraire le bloc conclusion ("Le Mot de la Fin")
 */
function extractConclusion(html) {
    // Pattern: div with emoji icon + h2 "Mot de la Fin" + paragraph
    const conclusionMatch = html.match(
        /<div[^>]*bg-primary\/5[^>]*>\s*<div[^>]*>\s*<span[^>]*>([\s\S]*?)<\/span>\s*<\/div>\s*<div[^>]*>\s*<h2[^>]*>([\s\S]*?)<\/h2>\s*<p[^>]*>([\s\S]*?)<\/p>/i
    );

    if (!conclusionMatch) return null;

    return {
        emoji: stripHtml(conclusionMatch[1]).trim(),
        title: stripHtml(conclusionMatch[2]).trim(),
        content: conclusionMatch[3].trim() // Keep HTML for rich formatting (links, bold, etc.)
    };
}

/**
 * Extraire les items FAQ depuis le HTML
 */
function extractFaqItems(html) {
    const items = [];

    // Match <details> blocks containing questions and answers
    const detailsRegex = /<details[^>]*>([\s\S]*?)<\/details>/gi;
    let detailMatch;

    while ((detailMatch = detailsRegex.exec(html)) !== null) {
        const detailHtml = detailMatch[1];

        // Extract question from <summary> > <span>
        const questionMatch = detailHtml.match(/<summary[^>]*>[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/i);
        // Extract answer from <p>
        const answerMatch = detailHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/i);

        if (questionMatch && answerMatch) {
            items.push({
                question: stripHtml(questionMatch[1]).trim(),
                answer: stripHtml(answerMatch[1]).trim()
            });
        }
    }

    return items;
}

/**
 * Extraire les sections de contenu libre (entre les blocs structurés)
 * Ex: "Pourquoi acheter une interface audio ?", "Critères exigeants..."
 */
function extractContentSections(html) {
    const sections = [];
    let order = 1;

    // Find standalone h2 sections that aren't FAQ or Conclusion headers
    const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>\s*(<p[^>]*>[\s\S]*?<\/p>(?:\s*<p[^>]*>[\s\S]*?<\/p>)*)/gi;
    let h2Match;

    while ((h2Match = h2Regex.exec(html)) !== null) {
        const title = stripHtml(h2Match[1]).trim();
        const contentHtml = h2Match[2].trim();

        // Skip FAQ, Conclusion, and product recommendation headers
        if (title.match(/FAQ|Mot de la Fin|Recommandation|Analyse|Top 5/i)) continue;

        sections.push({
            order: order++,
            title,
            html: contentHtml
        });
    }

    return sections;
}

// ═══════════════════════════════════════════
// UTILITY HELPERS
// ═══════════════════════════════════════════

function stripHtml(html) {
    return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&apos;/g, "'");
}

function extractListItems(ulHtml) {
    const items = [];
    const liRegex = /<li>([\s\S]*?)<\/li>/gi;
    let liMatch;
    while ((liMatch = liRegex.exec(ulHtml)) !== null) {
        items.push(stripHtml(liMatch[1]).trim());
    }
    return items;
}

// ═══════════════════════════════════════════
// ARTICLE EXTRACTION FROM data.ts
// ═══════════════════════════════════════════

function extractArticlesFromDataTs() {
    const filePath = path.join(__dirname, '..', 'lib', 'data.ts');
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Find the ARTICLES array
    const articlesStart = fileContent.indexOf('export const ARTICLES: Article[] = [');
    if (articlesStart === -1) {
        throw new Error('Cannot find "export const ARTICLES" in data.ts');
    }

    // Find PATHWAYS to know where articles end
    const pathwaysStart = fileContent.indexOf('export const PATHWAYS');
    const articlesSection = fileContent.substring(articlesStart, pathwaysStart > 0 ? pathwaysStart : undefined);

    const articles = [];

    // Match each article object. The key/value pairs inside use " for strings and ` for content
    const articleRegex = /\{\s*id:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]*(?:\\.[^"]*)*)",\s*category:\s*"([^"]+)",\s*readTime:\s*"([^"]+)",\s*date:\s*"([^"]+)",\s*author:\s*"([^"]*(?:\\.[^"]*)*)",\s*image:\s*"([^"]+)",\s*intro:\s*"([^"]*(?:\\.[^"]*)*)",\s*relatedProducts:\s*\[([^\]]*)\],\s*relatedCategorySlug:\s*"([^"]+)",\s*content:\s*`([\s\S]*?)`\s*\}/g;

    let match;
    while ((match = articleRegex.exec(articlesSection)) !== null) {
        const relatedProductsRaw = match[10];
        const relatedProducts = relatedProductsRaw
            .split(',')
            .map(s => s.trim().replace(/^["']|["']$/g, ''))
            .filter(s => s.length > 0);

        const rawContent = match[12];

        // Decompose into modular blocks
        const comparisonTable = extractComparisonTable(rawContent);
        const productBlocks = extractProductBlocks(rawContent);
        const conclusionBlock = extractConclusion(rawContent);
        const faqItems = extractFaqItems(rawContent);
        const contentSections = extractContentSections(rawContent);

        articles.push({
            slug: match[2],
            title: match[3].replace(/\\"/g, '"'),
            category: match[4],
            read_time: match[5],
            published_at: match[6],
            author: match[7].replace(/\\"/g, '"'),
            hero_image_url: match[8],
            intro_text: match[9].replace(/\\"/g, '"'),
            related_products: relatedProducts,
            related_category_slug: match[11],
            is_published: true,
            // Modular JSONB blocks
            comparison_table: comparisonTable,
            product_blocks: productBlocks,
            conclusion_block: conclusionBlock,
            faq_items: faqItems,
            content_sections: contentSections,
            sidebar_product_ids: [] // Will be populated later from products table
        });
    }

    return articles;
}

// ═══════════════════════════════════════════
// MIGRATION MAIN
// ═══════════════════════════════════════════

async function migrate() {
    console.log('═══════════════════════════════════════════');
    console.log('  MIGRATION data.ts → Supabase (articles)');
    console.log('═══════════════════════════════════════════\n');

    // 1. Extract articles
    console.log('📖 Extraction des articles depuis lib/data.ts...\n');
    let articles;
    try {
        articles = extractArticlesFromDataTs();
    } catch (err) {
        console.error('❌ Erreur d\'extraction :', err.message);
        process.exit(1);
    }

    console.log(`📦 ${articles.length} article(s) trouvé(s) :\n`);
    articles.forEach((a, i) => {
        console.log(`  ${i + 1}. [${a.category}] ${a.title}`);
        console.log(`     slug: ${a.slug}`);
        console.log(`     blocs produits: ${a.product_blocks.length}`);
        console.log(`     FAQ: ${a.faq_items.length} items`);
        console.log(`     tableau comparatif: ${a.comparison_table ? '✅' : '—'}`);
        console.log(`     conclusion: ${a.conclusion_block ? '✅' : '—'}`);
        console.log(`     sections contenu: ${a.content_sections.length}`);
        console.log('');
    });

    // 2. Connect to Supabase
    console.log('🔌 Connexion à Supabase...');
    const { data: testData, error: testError } = await supabase
        .from('articles')
        .select('id')
        .limit(1);

    if (testError) {
        console.error('❌ Erreur de connexion à la table articles :', testError.message);
        console.error('   → As-tu bien exécuté le script SQL pour créer la table ?');
        process.exit(1);
    }
    console.log('✅ Table articles accessible.\n');

    // 3. Check for duplicates
    const { data: existing } = await supabase.from('articles').select('slug');
    const existingSlugs = (existing || []).map(a => a.slug);

    if (existingSlugs.length > 0) {
        console.log(`⚠️  ${existingSlugs.length} article(s) déjà présent(s).`);
        console.log(`   Slugs existants : ${existingSlugs.join(', ')}`);
        console.log('   Les doublons seront ignorés.\n');
    }

    const newArticles = articles.filter(a => !existingSlugs.includes(a.slug));

    if (newArticles.length === 0) {
        console.log('✅ Tous les articles sont déjà dans Supabase. Rien à migrer.');
        return;
    }

    // 4. Resolve sidebar_product_ids from related_products slugs
    console.log('🔗 Résolution des product IDs pour la sidebar...');
    const allSlugs = [...new Set(newArticles.flatMap(a => a.related_products))];

    if (allSlugs.length > 0) {
        const { data: productRows } = await supabase
            .from('products')
            .select('id, slug')
            .in('slug', allSlugs);

        const slugToId = {};
        (productRows || []).forEach(p => { slugToId[p.slug] = p.id; });

        newArticles.forEach(a => {
            a.sidebar_product_ids = a.related_products
                .map(slug => slugToId[slug])
                .filter(Boolean);

            const found = a.sidebar_product_ids.length;
            const total = a.related_products.length;
            if (found < total) {
                console.log(`   ⚠️  ${a.slug}: ${found}/${total} produits trouvés dans Supabase`);
            }
        });

        console.log(`   ${Object.keys(slugToId).length}/${allSlugs.length} produits résolus.\n`);
    }

    // 5. Insert
    console.log(`🚀 Insertion de ${newArticles.length} article(s)...\n`);

    const { data: inserted, error: insertError } = await supabase
        .from('articles')
        .insert(newArticles)
        .select('id, slug, title');

    if (insertError) {
        console.error('❌ Erreur d\'insertion :', insertError.message);
        console.error('   Détails :', JSON.stringify(insertError, null, 2));
        process.exit(1);
    }

    console.log(`✅ ${inserted.length} article(s) migré(s) avec succès !\n`);
    inserted.forEach(a => {
        console.log(`   ✓ ${a.title} (${a.slug})`);
    });

    console.log('\n═══════════════════════════════════════════');
    console.log('  🎉 Migration terminée !');
    console.log('═══════════════════════════════════════════');
}

migrate().catch(err => {
    console.error('💥 Erreur fatale :', err);
    process.exit(1);
});
