import fs from 'fs';

const data = JSON.parse(fs.readFileSync('casques_harvest.json', 'utf8'));

console.log(`Total harvested casques: ${data.length}\n`);

const issues = [];
data.forEach(item => {
  const hasImages = item.imagesCount >= 6;
  const hasTh = !!item.thUrl;
  const hasWb = !!item.wbUrl;
  const hasAmz = !!item.amzUrl;

  console.log(`[${item.slug}] ${item.brand} ${item.name}`);
  console.log(`   Images: ${item.imagesCount} | TH: ${item.thPrice ? item.thPrice + '€' : 'MISSING'} | WB: ${item.wbPrice ? item.wbPrice + '€' : 'MISSING'}`);
  
  if (!hasImages || !hasTh || !hasWb) {
    issues.push({ slug: item.slug, hasImages, hasTh, hasWb, count: item.imagesCount });
  }
});

console.log('\n=== ITEMS WITH ISSUES ===', issues);
