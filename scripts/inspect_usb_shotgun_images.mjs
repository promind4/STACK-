import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function inspect() {
  const { data: prods } = await supabase.from('products')
    .select('id, slug, name, image_url, gallery_images, category_id, categories(slug)')
    .order('name');

  const filtered = (prods || []).filter(p => p.categories && ['micros-usb', 'micros-shotgun'].includes(p.categories.slug));
  console.log('Total USB + Shotgun found:', filtered.length);
  for (const p of filtered) {
    const cat = p.categories?.slug;
    const galleryCount = (p.gallery_images || []).length;
    console.log('[' + cat + '] ' + p.slug + ' (' + p.name + '):');
    console.log('  image_url: ' + p.image_url);
    console.log('  gallery: ' + galleryCount + ' items');
  }
}
inspect();
