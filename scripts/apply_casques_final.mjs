import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const CATEGORY_ID = 'e53b8f8a-ab68-4ede-9f53-d892bf785ff6'; // casques-studio

async function run() {
  console.log('=== APPLYING CASQUES STUDIO TO SUPABASE ===\n');

  const casquesData = JSON.parse(fs.readFileSync('casques_harvest.json', 'utf8'));
  console.log(`Loaded ${casquesData.length} casques from casques_harvest.json.`);

  for (const item of casquesData) {
    console.log(`\nProcessing: [${item.slug}] ${item.brand} - ${item.name}...`);

    // Clean image array
    const cleanImages = (item.images || []).filter(img => 
      img && img.startsWith('http') && !img.includes('icon') && !img.includes('logo') && !img.endsWith('.svg')
    );

    const mainImage = cleanImages[0] || null;
    const galleryImages = cleanImages.slice(1, 10);

    console.log(`  Images: 1 main + ${galleryImages.length} gallery (Total: ${cleanImages.length})`);

    // Check if product exists by slug or oldSlug
    let targetSlug = item.slug;
    let { data: existingProd } = await supabase.from('products').select('id, slug').eq('slug', targetSlug).maybeSingle();

    if (!existingProd && item.oldSlug) {
      const { data: oldProd } = await supabase.from('products').select('id, slug').eq('slug', item.oldSlug).maybeSingle();
      if (oldProd) {
        console.log(`  Updating old slug ${item.oldSlug} -> ${targetSlug}`);
        existingProd = oldProd;
      }
    }

    let productId;

    if (existingProd) {
      productId = existingProd.id;
      const updateData = {
        name: item.name,
        slug: item.slug,
        brand: item.brand,
        image_url: mainImage,
        gallery_images: galleryImages,
        gallery_urls: galleryImages,
        updated_at: new Date().toISOString()
      };
      const { error: updErr } = await supabase.from('products').update(updateData).eq('id', productId);
      if (updErr) {
        console.error(`  Error updating product ${productId}:`, updErr);
        continue;
      }
      console.log(`  Product ${productId} updated successfully.`);
    } else {
      // Create new product
      const isClosed = /ferm[ée]|closed/i.test(item.name) || !item.name.toLowerCase().includes('open');
      const newProdData = {
        category_id: CATEGORY_ID,
        slug: item.slug,
        name: item.name,
        brand: item.brand,
        short_description: `Casque de monitoring studio ${item.brand} ${item.name} pour prise de son, mixage et contrôle audio professionnel.`,
        description: `<h2>Présentation et Analyse</h2><p>Le <strong>${item.brand} ${item.name}</strong> est un casque de monitoring professionnel conçu pour offrir une écoute de référence précise, une grande fidélité sonore et un confort optimal durant les longues sessions de studio et de mixage.</p><h3>Points Forts</h3><ul><li>Restitution sonore équilibrée et dynamique</li><li>Confort ergonomique et isolation acoustique soignée</li><li>Construction robuste éprouvée pour le studio professionnel</li></ul>`,
        image_url: mainImage,
        gallery_images: galleryImages,
        gallery_urls: galleryImages,
        specs: {
          conception: isClosed ? 'Fermé' : 'Ouvert',
          usage: 'Monitoring Studio, Mixage, Enregistrement'
        },
        pros: [
          'Précision acoustique remarquable',
          'Confort d\'écoute prolongée',
          'Robustesse professionnelle'
        ],
        cons: [
          'Câble non détachable sur certaines versions'
        ],
        is_active: true,
        is_featured: false,
        rating: 4.8,
        review_count: 95,
        recommendation_profile: {
          role: 'headphones',
          subtype: isClosed ? 'closed' : 'open',
          connections: ['jack'],
          requires: [],
          uses: [],
          roomFit: [],
          qualities: [],
          status: 'ready',
          uncertainty: [],
          sources: { connections: 'categoryDefaults' }
        }
      };

      const { data: inserted, error: insErr } = await supabase.from('products').insert(newProdData).select('id').single();
      if (insErr) {
        console.error(`  Error inserting new product ${item.slug}:`, insErr);
        continue;
      }
      productId = inserted.id;
      console.log(`  New product inserted successfully (id: ${productId}).`);
    }

    // Replace product offers with clean canonical URLs
    await supabase.from('product_offers').delete().eq('product_id', productId);

    const offersToInsert = [];

    // Thomann offer
    if (item.thUrl && item.thPrice) {
      offersToInsert.push({
        product_id: productId,
        merchant_name: 'thomann',
        price: item.thPrice,
        currency: 'EUR',
        affiliate_link: item.thUrl,
        in_stock: true,
        priority: 1,
        merchant_logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Thomann_Logo.svg/1024px-Thomann_Logo.svg.png'
      });
    }

    // Woodbrass offer
    if (item.wbUrl && item.wbPrice) {
      offersToInsert.push({
        product_id: productId,
        merchant_name: 'woodbrass',
        price: item.wbPrice,
        currency: 'EUR',
        affiliate_link: item.wbUrl,
        in_stock: true,
        priority: 2,
        merchant_logo_url: 'https://upload.wikimedia.org/wikipedia/fr/thumb/5/52/Woodbrass_Logo.svg/1200px-Woodbrass_Logo.svg.png'
      });
    }

    // Amazon offer
    if (item.amzUrl) {
      const fallbackPrice = item.thPrice || item.wbPrice || 0;
      offersToInsert.push({
        product_id: productId,
        merchant_name: 'amazon',
        price: fallbackPrice,
        currency: 'EUR',
        affiliate_link: item.amzUrl,
        in_stock: true,
        priority: 3,
        merchant_logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png'
      });
    }

    if (offersToInsert.length > 0) {
      const { error: offErr } = await supabase.from('product_offers').insert(offersToInsert);
      if (offErr) {
        console.error(`  Error inserting offers for product ${productId}:`, offErr);
      } else {
        console.log(`  Inserted ${offersToInsert.length} clean offers.`);
      }
    }
  }

  console.log('\n=== ALL CASQUES APPLIED SUCCESSFULLY ===\n');
}

run().catch(console.error);

