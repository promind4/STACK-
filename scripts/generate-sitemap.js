import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Config env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables from .env.local
dotenv.config({ path: path.join(rootDir, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Supabase environment variables missing.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const DOMAIN = 'https://fluxlab.fr';

async function generateSitemap() {
    console.log('🔍 Starting sitemap generation...');

    // 1. Static Pages
    const staticPages = [
        '',
        '/categorie/audio',
        '/categorie/video',
        '/categorie/streaming',
        '/configurateur',
        '/guides',
        '/a-propos',
        '/mentions-legales',
        '/confidentialite',
        '/cgu'
    ];

    let urls = [];

    // Add Static Pages
    staticPages.forEach(page => {
        urls.push({
            loc: `${DOMAIN}${page}`,
            changefreq: 'weekly',
            priority: page === '' ? '1.0' : '0.8'
        });
    });

    // 2. Fetch Products
    console.log('📦 Fetching products from Supabase...');
    const { data: products, error } = await supabase
        .from('products')
        .select('slug, updated_at');

    if (error) {
        console.error('❌ Error fetching products:', error);
    } else {
        console.log(`✅ Found ${products.length} products.`);
        products.forEach(product => {
            urls.push({
                loc: `${DOMAIN}/produit/${product.slug}`,
                changefreq: 'daily',
                priority: '0.9',
                lastmod: product.updated_at ? new Date(product.updated_at).toISOString().split('T')[0] : undefined
            });
        });
    }

    // 3. Extract Articles from lib/data.ts (Regex parsing to avoid TS compilation)
    console.log('📄 Parsing articles from lib/data.ts...');
    try {
        const dataFilePath = path.join(rootDir, 'lib', 'data.ts');
        const dataContent = fs.readFileSync(dataFilePath, 'utf-8');

        // Regex to find slugs in ARTICLES array
        // primitive but effective for this file structure
        const articleRegex = /slug:\s*["']([^"']+)["']/g;
        let match;
        let count = 0;

        // We need to be careful not to capture slugs from PATHWAYS or mapped categories if possible
        // But since the format is consistent, we can just grab all slugs? 
        // Actually, distinct article blocks usually start with { id: "...", slug: "..."

        // Let's refine: look for slugs inside the ARTICLES array specifically?
        // The file has `export const ARTICLES: Article[] = [`

        const articlesBlock = dataContent.split('export const ARTICLES: Article[] = [')[1].split('];')[0];

        while ((match = articleRegex.exec(articlesBlock)) !== null) {
            urls.push({
                loc: `${DOMAIN}/guide/${match[1]}`,
                changefreq: 'monthly',
                priority: '0.7'
            });
            count++;
        }
        console.log(`✅ Found ${count} articles.`);

    } catch (err) {
        console.error('❌ Error parsing data.ts:', err);
    }

    // 4. Generate XML
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>${url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

    // 5. Write File
    const outputPath = path.join(rootDir, 'public', 'sitemap.xml');
    fs.writeFileSync(outputPath, sitemapContent);
    console.log(`🎉 Sitemap generated successfully at ${outputPath}`);
}

generateSitemap();
