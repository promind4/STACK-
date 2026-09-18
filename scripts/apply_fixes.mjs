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

async function applyUpdates() {
  console.log('--- Step 1: Fix Images ---');
  // 1. Audio-Technica BP40 image
  const { error: imgErr1 } = await supabase
    .from('products')
    .update({ image_url: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_36/368980/10720777_800.jpg' })
    .eq('slug', 'audio-technica-bp40');
  console.log('BP40 image update:', imgErr1 ? imgErr1.message : 'OK');

  // 2. Shure SM57 image
  const { error: imgErr2 } = await supabase
    .from('products')
    .update({ image_url: 'https://thumbs.static-thomann.de/thumb/padthumb1000x1000/pics/bdb/_10/105768/7930429_800.jpg' })
    .eq('slug', 'shure-sm57');
  console.log('SM57 image update:', imgErr2 ? imgErr2.message : 'OK');

  console.log('\n--- Step 2: Fix Audio-Technica BP40 Offers ---');
  const { data: bp40 } = await supabase.from('products').select('id').eq('slug', 'audio-technica-bp40').single();
  if (bp40) {
    // Thomann price update to 353
    const { error: thErr } = await supabase
      .from('product_offers')
      .update({ price: 353 })
      .eq('product_id', bp40.id)
      .eq('merchant_name', 'thomann');
    console.log('BP40 Thomann price updated to 353€:', thErr ? thErr.message : 'OK');

    // Woodbrass update to real product URL and 353
    const { error: wbErr } = await supabase
      .from('product_offers')
      .update({
        price: 353,
        affiliate_link: 'https://woodbrass.com/products/audio-technica-bp40-229660?af=3524'
      })
      .eq('product_id', bp40.id)
      .eq('merchant_name', 'woodbrass');
    console.log('BP40 Woodbrass URL & price updated:', wbErr ? wbErr.message : 'OK');

    // Delete Amazon offer because BP40 is not sold on Amazon
    const { error: amzErr } = await supabase
      .from('product_offers')
      .delete()
      .eq('product_id', bp40.id)
      .eq('merchant_name', 'amazon');
    console.log('BP40 Amazon offer removed:', amzErr ? amzErr.message : 'OK');
  }

  console.log('\n--- Step 3: Update Woodbrass Direct URLs ---');
  const wbUpdates = [
    { slug: 'shure-sm58', url: 'https://woodbrass.com/products/shure-sm58-20154?af=3524', price: 115 },
    { slug: 'shure-sm57', url: 'https://woodbrass.com/products/shure-sm57-9764?af=3524', price: 111 },
    { slug: 'shure-sm7db', url: 'https://woodbrass.com/products/shure-sm7db-382677?af=3524', price: 525 },
    { slug: 'rode-podmic', url: 'https://woodbrass.com/products/rode-podmic-333408?af=3524', price: 76 },
    { slug: 'sennheiser-e-835', url: 'https://woodbrass.com/products/sennheiser-evolution-e835-19778?af=3524', price: 88 },
    { slug: 'se-electronics-v7', url: 'https://woodbrass.com/products/se-electronics-v7-377669?af=3524', price: 98 },
    { slug: 'sennheiser-md-421-kompakt', url: 'https://woodbrass.com/products/sennheiser-md-421-kompakt-398919?af=3524', price: 269 },
    { slug: 'electro-voice-re320', url: 'https://woodbrass.com/products/electrovoice-re320-248122?af=3524', price: 339 },
    { slug: 'electro-voice-re20-black', url: 'https://woodbrass.com/products/electrovoice-re-20-black-418164?af=3524', price: 692 }
  ];

  for (const item of wbUpdates) {
    const { data: prod } = await supabase.from('products').select('id').eq('slug', item.slug).single();
    if (!prod) continue;
    const { error: err } = await supabase
      .from('product_offers')
      .update({
        affiliate_link: item.url,
        price: item.price
      })
      .eq('product_id', prod.id)
      .eq('merchant_name', 'woodbrass');
    console.log(`Woodbrass update [${item.slug}]:`, err ? err.message : `OK (${item.price}€)`);
  }

  console.log('\n--- Step 4: Remove Dead Woodbrass Offers (Not Sold on Woodbrass) ---');
  const wbDeletions = ['procaster', 'heil-sound-pr40', 'dynacaster-dcm6', 'dynacaster-dcm-8'];
  for (const slug of wbDeletions) {
    const { data: prod } = await supabase.from('products').select('id').eq('slug', slug).single();
    if (!prod) continue;
    const { error: err } = await supabase
      .from('product_offers')
      .delete()
      .eq('product_id', prod.id)
      .eq('merchant_name', 'woodbrass');
    console.log(`Woodbrass removed [${slug}]:`, err ? err.message : 'OK');
  }

  console.log('\nDone applying updates.');
}

applyUpdates().catch(console.error);
