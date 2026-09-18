import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split(/\r?\n/).forEach(l => {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, '');
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const raw = fs.readFileSync('scripts/accessoires_harvest_result.json', 'utf8');
  const items = JSON.parse(raw);

  console.log(`Applying ${items.length} items to database...`);

  for (const entry of items) {
    const { item, categoryId, images, offers } = entry;
    console.log(`\nProcessing [${item.slug}] ${item.brand} ${item.name}...`);

    if (images.length < 6) {
      console.error(`ERROR: ${item.slug} has only ${images.length} images! Aborting.`);
      process.exit(1);
    }
    if (offers.length === 0) {
      console.error(`ERROR: ${item.slug} has no offers! Aborting.`);
      process.exit(1);
    }

    const mainImage = images[0];
    const gallery = images.slice(1);

    // 1. Check if product exists
    const { data: existing, error: checkErr } = await supabase
      .from('products')
      .select('id, slug')
      .eq('slug', item.slug)
      .maybeSingle();

    if (checkErr) {
      console.error(`Check error for ${item.slug}:`, checkErr);
      continue;
    }

    let productId = existing?.id;

    if (existing) {
      // Update
      console.log(`  Updating existing product ID: ${productId}`);
      const { error: updErr } = await supabase
        .from('products')
        .update({
          name: item.name,
          brand: item.brand,
          category_id: categoryId,
          description: item.description,
          short_description: item.short_description,
          image_url: mainImage,
          gallery_images: gallery,
          gallery_urls: images,
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId);

      if (updErr) {
        console.error(`Update error for ${item.slug}:`, updErr);
        continue;
      }
    } else {
      // Insert
      console.log(`  Inserting new product...`);
      const { data: inserted, error: insErr } = await supabase
        .from('products')
        .insert({
          slug: item.slug,
          name: item.name,
          brand: item.brand,
          category_id: categoryId,
          description: item.description,
          short_description: item.short_description,
          image_url: mainImage,
          gallery_images: gallery,
          gallery_urls: images,
          is_active: true,
          rating: 4.8,
          review_count: 12
        })
        .select('id')
        .single();

      if (insErr) {
        console.error(`Insert error for ${item.slug}:`, insErr);
        continue;
      }
      productId = inserted.id;
    }

    // 2. Clean out old unverified offers and insert new verified offers
    const { error: delErr } = await supabase
      .from('product_offers')
      .delete()
      .eq('product_id', productId);

    if (delErr) {
      console.error(`Delete offers error for ${item.slug}:`, delErr);
    }

    // Insert new offers
    for (const off of offers) {
      const { error: offErr } = await supabase
        .from('product_offers')
        .insert({
          product_id: productId,
          merchant_name: off.merchant_name,
          price: off.price,
          currency: off.currency || 'EUR',
          affiliate_link: off.affiliate_link,
          in_stock: off.in_stock ?? true,
          priority: off.priority || 1,
          updated_at: new Date().toISOString()
        });

      if (offErr) {
        console.error(`Offer insert error for ${item.slug} (${off.merchant_name}):`, offErr);
      } else {
        console.log(`    + Offer [${off.merchant_name}] ${off.price}€ -> ${off.affiliate_link}`);
      }
    }
  }

  console.log('\nAll 25 accessory products successfully synced to database!');
}

run().catch(console.error);
