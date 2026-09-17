async function check() {
  const routes = [
    { url: 'http://localhost:3001/', expectedStatus: 200 },
    { url: 'http://localhost:3001/categorie/audio', expectedStatus: 200 },
    { url: 'http://localhost:3001/categorie/micros-dynamiques', expectedStatus: 200 },
    { url: 'http://localhost:3001/categorie/video', expectedStatus: 404 },
    { url: 'http://localhost:3001/categorie/streaming', expectedStatus: 404 },
    { url: 'http://localhost:3001/produit/sony-zv-e10', expectedStatus: 404 },
    { url: 'http://localhost:3001/guide/setup-youtube-debutant-2026', expectedStatus: 404 },
    { url: 'http://localhost:3001/sitemap.xml', expectedStatus: 200 },
  ];

  let failed = false;
  for (const r of routes) {
    try {
      const res = await fetch(r.url);
      const ok = res.status === r.expectedStatus;
      console.log(`${ok ? 'PASS' : 'FAIL'}: ${r.url} -> Status ${res.status} (expected ${r.expectedStatus})`);
      if (!ok) failed = true;
    } catch (e) {
      console.log(`ERROR: ${r.url} -> ${e.message}`);
      failed = true;
    }
  }

  // Check sitemap content
  const sitemapRes = await fetch('http://localhost:3001/sitemap.xml');
  const sitemapText = await sitemapRes.text();
  const hasVideo = sitemapText.includes('/categorie/video') || sitemapText.includes('sony-zv-e10');
  console.log(`Sitemap has video/streaming content: ${hasVideo ? 'FAIL (found)' : 'PASS (clean)'}`);
  if (hasVideo) failed = true;

  // Check search API
  const searchRes = await fetch('http://localhost:3001/api/search?q=sony');
  const searchJson = await searchRes.json();
  const products = Array.isArray(searchJson) ? searchJson : (searchJson.products || []);
  console.log('Search "sony" results:', products.map(p => p.name));
  const hasNonAudioInSearch = products.some(p => p.slug === 'sony-zv-e10');
  console.log(`Search contains non-audio: ${hasNonAudioInSearch ? 'FAIL (found sony-zv-e10)' : 'PASS (audio only)'}`);
  if (hasNonAudioInSearch) failed = true;

  if (failed) process.exit(1);
}

check();
