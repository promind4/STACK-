/**
 * Correction des liens et prix pour Microdynamique
 * Basé sur vérification manuelle des sites marchands
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Corrections identifiées après vérification manuelle
const CORRECTIONS = [
    // Prix corrections
    {
        offer_id: 'ca709e69-97b4-4869-97a1-74630a9695a3',
        product: 'Shure MV7X',
        merchant: 'Amazon',
        old_price: 189,
        new_price: 195,
        reason: 'Prix vérifié sur Amazon.fr: 194,90€'
    },
    {
        offer_id: 'cc015564-e1fc-444e-9e7c-9c8ea0b3428c',
        product: 'Electro-Voice RE20 Black',
        merchant: 'Thomann',
        old_price: 698,
        new_price: 659,
        reason: 'Prix vérifié sur Thomann: 659€'
    },
    {
        offer_id: '25afb7cb-9eec-4509-94cb-c985c3777460',
        product: 'Røde PodMic',
        merchant: 'Amazon',
        old_price: 98,
        new_price: 85,
        reason: 'Prix vérifié sur Amazon.fr: 85,00€'
    },
    {
        offer_id: '7cfcef04-50d8-47b6-a205-df43fba8895b',
        product: 'Shure SM7B',
        merchant: 'Amazon',
        old_price: 389,
        new_price: 388,
        reason: 'Prix vérifié sur Amazon.fr: 388,00€'
    },
    // Lien + prix corrections (liens cassés 404)
    {
        offer_id: 'cdc66307-1889-4b42-bce7-4abc58fcb10c',
        product: 'Heil Sound PR40',
        merchant: 'Amazon',
        old_price: 369,
        new_price: 545,
        new_link: 'https://www.amazon.fr/dp/B0BFLSCYQ1?tag=stackera-21',
        reason: 'Ancien lien 404, nouveau ASIN B0BFLSCYQ1 trouvé'
    },
    {
        offer_id: 'c0958721-a664-4b10-bd48-6af5c8771f23',
        product: 'Electro-Voice RE20',
        merchant: 'Amazon',
        old_price: 800,
        new_price: 819,
        new_link: 'https://www.amazon.fr/dp/B000Z7LLQ0?tag=stackera-21',
        reason: 'Ancien lien 404, nouveau ASIN B000Z7LLQ0 trouvé'
    }
];

async function applyCorrections() {
    console.log('\\n🔧 Applying Link & Price Corrections...\\n');
    console.log('='.repeat(80));

    let successCount = 0;
    let errorCount = 0;

    for (const correction of CORRECTIONS) {
        console.log(`\\n📦 ${correction.product} - ${correction.merchant}`);
        console.log(`   Reason: ${correction.reason}`);

        const updateData = {
            price: correction.new_price
        };

        if (correction.new_link) {
            updateData.affiliate_link = correction.new_link;
            console.log(`   Link: ${correction.new_link}`);
        }

        console.log(`   Price: ${correction.old_price}€ → ${correction.new_price}€`);

        const { error } = await supabase
            .from('product_offers')
            .update(updateData)
            .eq('id', correction.offer_id);

        if (error) {
            console.log(`   ❌ Error: ${error.message}`);
            errorCount++;
        } else {
            console.log(`   ✅ Updated successfully!`);
            successCount++;
        }
    }

    console.log('\\n' + '='.repeat(80));
    console.log(`\\n📊 SUMMARY:`);
    console.log(`   ✅ Success: ${successCount}/${CORRECTIONS.length}`);
    console.log(`   ❌ Errors: ${errorCount}/${CORRECTIONS.length}`);
    console.log('\\n');
}

applyCorrections();
