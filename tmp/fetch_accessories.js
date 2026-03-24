const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://oxzapjwfttrgsometnwq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94emFwandmdHRyZ3NvbWV0bndxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MDQzOTAsImV4cCI6MjA4MDk4MDM5MH0.PlSk51csar1A6nDG8L92nVezjtPla0VFRjsYuj2-jXA');

async function fetchAccessories() {
  const { data, error } = await supabase
    .from('products')
    .select('slug, name, image_url')
    .or('name.ilike.%battery%,name.ilike.%power%,name.ilike.%sony%,name.ilike.%adapter%');
  
  if (error) {
    console.error('Error:', error);
  } else {
    // Filter for probable dummy batteries
    const relevant = data.filter(p => p.name.toLowerCase().includes('fw50') || p.name.toLowerCase().includes('dummy'));
    console.log(JSON.stringify(relevant, null, 2));
  }
}

fetchAccessories();
