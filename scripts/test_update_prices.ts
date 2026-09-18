import { updatePrices } from '../lib/pricing/index.ts';
import fs from 'fs';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const envContent = fs.readFileSync('.env.local', 'utf8');
envContent.split(/\r?\n/).forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
});

async function test() {
  console.log('Testing updatePrices dryRun with 1 product...');
  try {
    // Test with dryRun = true and limit to 1 product
    const summary = await updatePrices({ dryRun: true, force: true, concurrency: 1 });
    console.log('Success! Total offers inspected:', summary.total);
    console.log('Summary:', {
      total: summary.total,
      unchanged: summary.unchanged,
      failed: summary.failed,
      skippedQuota: summary.skippedQuota,
      sampleDetails: summary.details.slice(0, 3)
    });
  } catch (e: any) {
    console.error('Update prices error:', e.message);
  }
}

test();
