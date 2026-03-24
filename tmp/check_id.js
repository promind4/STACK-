const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://oxzapjwfttrgsometnwq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94emFwandmdHRyZ3NvbWV0bndxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MDQzOTAsImV4cCI6MjA4MDk4MDM5MH0.PlSk51csar1A6nDG8L92nVezjtPla0VFRjsYuj2-jXA');

async function checkID() {
  const { data, error } = await supabase
    .from('products')
    .select('slug, name, image_url')
    .ilike('image_url', '%528341%');
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

checkID();
