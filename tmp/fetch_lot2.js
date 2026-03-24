const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://oxzapjwfttrgsometnwq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94emFwandmdHRyZ3NvbWV0bndxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MDQzOTAsImV4cCI6MjA4MDk4MDM5MH0.PlSk51csar1A6nDG8L92nVezjtPla0VFRjsYuj2-jXA');

async function fetchLot2Products() {
  const { data, error } = await supabase
    .from('products')
    .select('slug, name, image_url, gallery_images')
    .or('slug.eq.shure-sm7b,name.ilike.%dummy battery%,slug.eq.focusrite-scarlett-2i2-4th-gen,slug.eq.sony-zv-e10,slug.eq.shure-mv7x');
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

fetchLot2Products();
