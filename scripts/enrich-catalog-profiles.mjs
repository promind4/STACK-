process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire('D:/Stackera/fluxlab-next/package.json');
const { createClient } = require('@supabase/supabase-js');

const envConfig = fs.readFileSync('D:/Stackera/fluxlab-next/.env.local', 'utf-8');
const env = {};
for (const line of envConfig.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx !== -1) env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const write = process.argv.includes('--write');
console.log(`Running in ${write ? 'WRITE' : 'DRY-RUN'} mode...`);

// Preserved slugs with manual rich editorial overrides
const PRESERVED_SLUGS = new Set([
  'nt1-5th-generation-sil-b-stock',
  'nt1-5th-generation-black',
  'nt1-5th-generation-silver',
  'focusrite-scarlett-2i2-4th-gen',
  'hofa-absorber-eco'
]);

async function runEnrichment() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, brand, description, pros, specs, categories(slug), recommendation_profile')
    .eq('is_active', true);

  if (error) {
    console.error('Fetch error:', error);
    return;
  }

  console.log(`Fetched ${products.length} active products.`);

  let updatedCount = 0;
  let skippedCount = 0;

  for (const product of products) {
    if (PRESERVED_SLUGS.has(product.slug)) {
      skippedCount++;
      continue;
    }

    const catSlug = Array.isArray(product.categories) ? product.categories[0]?.slug : product.categories?.slug;
    const nameLower = (product.name + ' ' + product.slug).toLowerCase();
    const currentProfile = product.recommendation_profile || {};

    let targetProfile = null;

    if (catSlug === 'micros-dynamiques' || catSlug === 'micros-condensateurs' || catSlug === 'micros-shotgun') {
      const isUsb = nameLower.includes('usb') || (currentProfile.connections && currentProfile.connections.includes('USB'));
      const subtype = catSlug === 'micros-dynamiques' ? 'dynamic' : catSlug === 'micros-condensateurs' ? 'condenser' : 'shotgun';
      targetProfile = {
        role: 'microphone',
        subtype,
        connections: isUsb ? ['USB'] : ['XLR'],
        requires: isUsb ? [] : ['interface'],
        uses: currentProfile.uses || [],
        roomFit: currentProfile.roomFit || [],
        qualities: currentProfile.qualities || [],
        status: 'ready',
        uncertainty: [],
        sources: { subtype: 'editorial', connections: 'editorial' }
      };
    } else if (catSlug === 'micros-usb') {
      targetProfile = {
        role: 'microphone',
        subtype: currentProfile.subtype || undefined,
        connections: ['USB'],
        requires: [],
        uses: currentProfile.uses || [],
        roomFit: currentProfile.roomFit || [],
        qualities: currentProfile.qualities || [],
        status: 'ready',
        uncertainty: [],
        sources: { subtype: 'editorial', connections: 'categoryDefaults' }
      };
    } else if (catSlug === 'cartes-son') {
      const isOneInput = /solo|volt-1|volt 1|id4|m-track/i.test(nameLower);
      const capacity = isOneInput ? 1 : 2;
      targetProfile = {
        role: 'interface',
        sourceCapacity: capacity,
        connections: ['USB', 'XLR'],
        requires: [],
        uses: currentProfile.uses || [],
        roomFit: [],
        qualities: currentProfile.qualities || [],
        status: 'ready',
        uncertainty: [],
        sources: { sourceCapacity: 'editorial', connections: 'editorial' }
      };
    } else if (catSlug === 'casques-studio') {
      const isClosed = /ferm[ée]|closed/i.test((product.description || '') + ' ' + (product.pros || []).join(' '));
      targetProfile = {
        role: 'headphones',
        subtype: isClosed ? 'closed' : currentProfile.subtype || undefined,
        connections: ['jack'],
        requires: [],
        uses: currentProfile.uses || [],
        roomFit: [],
        qualities: currentProfile.qualities || [],
        status: 'ready',
        uncertainty: [],
        sources: { connections: 'categoryDefaults' }
      };
    } else if (catSlug === 'enceintes') {
      targetProfile = {
        role: 'monitors',
        connections: ['XLR', 'TRS'],
        requires: [],
        uses: currentProfile.uses || [],
        roomFit: ['treated'],
        qualities: currentProfile.qualities || [],
        status: 'ready',
        uncertainty: [],
        sources: { connections: 'categoryDefaults' }
      };
    } else if (catSlug === 'webcams-pro') {
      targetProfile = {
        role: 'camera',
        subtype: 'webcam',
        connections: ['USB'],
        requires: [],
        uses: ['streaming', 'video'],
        roomFit: [],
        qualities: currentProfile.qualities || [],
        status: 'ready',
        uncertainty: [],
        sources: { subtype: 'categoryDefaults', connections: 'categoryDefaults' }
      };
    } else if (catSlug === 'hybrides-mirrorless') {
      targetProfile = {
        role: 'camera',
        subtype: 'mirrorless',
        connections: ['HDMI'],
        requires: [],
        uses: ['streaming', 'video'],
        roomFit: [],
        qualities: currentProfile.qualities || [],
        status: 'ready',
        uncertainty: [],
        sources: { connections: 'categoryDefaults' }
      };
    } else if (catSlug === 'action-cams') {
      targetProfile = {
        role: 'camera',
        subtype: 'action_cam',
        connections: ['USB'],
        requires: [],
        uses: ['streaming', 'video'],
        roomFit: [],
        qualities: currentProfile.qualities || [],
        status: 'ready',
        uncertainty: [],
        sources: { connections: 'categoryDefaults' }
      };
    } else if (catSlug === 'keylight') {
      targetProfile = {
        role: 'lighting',
        subtype: 'keylight',
        connections: [],
        requires: [],
        uses: ['streaming', 'video'],
        roomFit: [],
        qualities: currentProfile.qualities || [],
        status: 'ready',
        uncertainty: [],
        sources: { subtype: 'categoryDefaults' }
      };
    } else if (catSlug === 'softbox') {
      targetProfile = {
        role: 'lighting',
        subtype: 'softbox',
        connections: [],
        requires: [],
        uses: ['streaming', 'video'],
        roomFit: [],
        qualities: currentProfile.qualities || [],
        status: 'ready',
        uncertainty: [],
        sources: { subtype: 'categoryDefaults' }
      };
    } else if (catSlug === 'rgb-ambiance') {
      targetProfile = {
        role: 'lighting',
        subtype: 'ambient',
        connections: [],
        requires: [],
        uses: ['streaming', 'video'],
        roomFit: [],
        qualities: currentProfile.qualities || [],
        status: 'ready',
        uncertainty: [],
        sources: { subtype: 'categoryDefaults' }
      };
    } else if (catSlug === 'traitement-acoustique') {
      targetProfile = {
        role: 'treatment',
        subtype: 'absorption',
        connections: [],
        requires: [],
        uses: currentProfile.uses || [],
        roomFit: ['untreated', 'treated'],
        qualities: currentProfile.qualities || [],
        status: 'ready',
        uncertainty: [],
        sources: { subtype: 'categoryDefaults' }
      };
    } else if (catSlug === 'cable-xlr') {
      targetProfile = {
        role: 'cable',
        subtype: 'xlr',
        connections: ['XLR'],
        requires: [],
        uses: [],
        roomFit: [],
        qualities: [],
        status: 'ready',
        uncertainty: [],
        sources: { subtype: 'categoryDefaults', connections: 'categoryDefaults' }
      };
    } else if (catSlug === 'bras-articules') {
      targetProfile = {
        role: 'stand',
        subtype: 'boom_arm',
        connections: [],
        requires: [],
        uses: [],
        roomFit: [],
        qualities: [],
        status: 'ready',
        uncertainty: [],
        sources: { subtype: 'categoryDefaults' }
      };
    }

    if (targetProfile) {
      updatedCount++;
      if (write) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ recommendation_profile: targetProfile })
          .eq('id', product.id);

        if (updateError) {
          console.error(`Failed to update ${product.slug}:`, updateError.message);
        }
      }
    }
  }

  console.log(`Done! ${updatedCount} products ${write ? 'updated' : 'would be updated'}. ${skippedCount} preserved.`);
}

runEnrichment().catch(console.error);
