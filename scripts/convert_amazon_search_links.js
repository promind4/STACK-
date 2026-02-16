/**
 * Conversion des liens d'affiliation vers des liens de recherche
 * Amazon: /dp/ASIN → /s?k=ProductName
 * Woodbrass/Thomann: garder les liens valides, corriger les morts
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const CATEGORY_ID = '3339b393-34ce-4144-bc71-a7655e628d2d';
const AFFILIATE_TAG = 'stackera-21';

// Fonction pour générer un lien de recherche Amazon
function generateAmazonSearchLink(productName, brand) {
    const searchQuery = `${brand}+${productName}`.replace(/\s+/g, '+').replace(/[^\w+\-]/g, '');
    return `https://www.amazon.fr/s?k=${encodeURIComponent(searchQuery)}&tag=${AFFILIATE_TAG}`;
}

// Mapping produit -> terme de recherche optimisé
const SEARCH_TERMS = {
    'shure-sm7b': 'Shure SM7B',
    'shure-mv7x': 'Shure MV7X',
    'electro-voice-re20': 'Electro-Voice RE20',
    'electro-voice-re20-black': 'Electro-Voice RE20 Black',
    'rode-podmic': 'Rode PodMic',
    'heil-sound-pr40': 'Heil Sound PR40',
    'cr77': 'MXL CR77',
    'dynacaster-dcm-3': 'SE Electronics DynaCaster DCM3',
    'dynacaster-dcm6': 'SE Electronics DynaCaster DCM6',
    'dynacaster-dcm-8': 'SE Electronics DynaCaster DCM8'
};

async function convertLinks() {
    console.log('\\n🔗 Converting Affiliate Links to Search Format...\\n');

    // Fetch all products with offers
    const { data: products, error } = await supabase
        .from('products')
        .select(`
            id,
            name,
            slug,
            brand,
            product_offers (
                id,
                merchant_name,
                affiliate_link
            )
        `)
        .eq('category_id', CATEGORY_ID)
        .eq('is_active', true);

    if (error) {
        console.error('Error:', error);
        return;
    }

    const updates = [];

    for (const product of products) {
        const searchTerm = SEARCH_TERMS[product.slug] || `${product.brand} ${product.name}`;

        for (const offer of product.product_offers || []) {
            const currentLink = offer.affiliate_link;

            // Amazon: convertir /dp/ links en /s?k= links
            if (offer.merchant_name.toLowerCase() === 'amazon') {
                // Vérifier si c'est déjà un lien de recherche
                if (currentLink.includes('/s?k=') || currentLink.includes('/s?k%3D')) {
                    console.log(`✅ ${product.name} - Amazon: Already search link`);
                    continue;
                }

                // Convertir en lien de recherche
                const newLink = `https://www.amazon.fr/s?k=${encodeURIComponent(searchTerm)}&tag=${AFFILIATE_TAG}`;

                updates.push({
                    offer_id: offer.id,
                    product_name: product.name,
                    merchant: 'Amazon',
                    old_link: currentLink,
                    new_link: newLink
                });
            }

            // Woodbrass: vérifier si c'est un lien de recherche valide
            if (offer.merchant_name.toLowerCase() === 'woodbrass') {
                // Les liens de recherche Woodbrass sont déjà au bon format
                if (currentLink.includes('product_search.php?keyword=')) {
                    console.log(`✅ ${product.name} - Woodbrass: Already search link`);
                    continue;
                }

                // Si c'est un lien direct, on le garde (les liens directs sont valides)
                if (currentLink.includes('.html')) {
                    console.log(`✅ ${product.name} - Woodbrass: Direct product link (keeping)`);
                    continue;
                }
            }

            // Thomann: les liens directs sont généralement valides
            if (offer.merchant_name.toLowerCase() === 'thomann') {
                console.log(`✅ ${product.name} - Thomann: Direct link (keeping)`);
                continue;
            }
        }
    }

    console.log('\\n' + '='.repeat(80));
    console.log(`\\n📊 Found ${updates.length} Amazon links to convert:\\n`);

    for (const update of updates) {
        console.log(`\\n📦 ${update.product_name} - ${update.merchant}`);
        console.log(`   Old: ${update.old_link}`);
        console.log(`   New: ${update.new_link}`);
    }

    // Apply updates
    if (updates.length > 0) {
        console.log('\\n🔄 Applying updates...\\n');

        for (const update of updates) {
            const { error } = await supabase
                .from('product_offers')
                .update({ affiliate_link: update.new_link })
                .eq('id', update.offer_id);

            if (error) {
                console.log(`❌ ${update.product_name}: ${error.message}`);
            } else {
                console.log(`✅ ${update.product_name}: Updated successfully`);
            }
        }
    }

    console.log('\\n✅ Conversion complete!\\n');
}

convertLinks();
