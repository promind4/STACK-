/**
 * Script to create the 'images-produit' bucket in Supabase Storage
 * 
 * NOTE: Creating buckets requires the SUPABASE_SERVICE_ROLE_KEY (admin key)
 * not the anon key. If you don't have it, create the bucket manually:
 * 
 * 1. Go to https://supabase.com/dashboard
 * 2. Select your project
 * 3. Go to Storage > Buckets
 * 4. Click "New bucket"
 * 5. Name: images-produit
 * 6. Check "Public bucket"
 * 7. Click "Create bucket"
 * 
 * After creating, add this RLS policy:
 * - Policy name: "Allow public read"
 * - Operation: SELECT
 * - Target roles: public (anon)
 * - Policy: true
 * 
 * And for uploads (authenticated users only):
 * - Policy name: "Allow authenticated uploads"
 * - Operation: INSERT
 * - Target roles: authenticated
 * - Policy: true
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Try service role key first, fall back to anon key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    console.log('\nPlease ensure you have either:');
    console.log('  - SUPABASE_SERVICE_ROLE_KEY (required to create buckets)');
    console.log('  - Or create the bucket manually in Supabase Dashboard');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'images-produit';

async function setupBucket() {
    console.log(`\n🔧 Setting up Supabase Storage bucket: ${BUCKET_NAME}\n`);

    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
        console.error('❌ Error listing buckets:', listError.message);
        console.log('\n⚠️  This usually means you need the SUPABASE_SERVICE_ROLE_KEY');
        console.log('   Add it to your .env.local file or create the bucket manually.');
        return;
    }

    const bucketExists = buckets?.some(b => b.name === BUCKET_NAME);

    if (bucketExists) {
        console.log(`✅ Bucket '${BUCKET_NAME}' already exists!`);
    } else {
        console.log(`📦 Creating bucket '${BUCKET_NAME}'...`);

        const { data, error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
            public: true,
            fileSizeLimit: 5 * 1024 * 1024, // 5MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/jpg']
        });

        if (createError) {
            console.error('❌ Error creating bucket:', createError.message);
            console.log('\n📋 Please create the bucket manually:');
            console.log('   1. Go to Supabase Dashboard → Storage');
            console.log('   2. Click "New bucket"');
            console.log('   3. Name: images-produit');
            console.log('   4. Check "Public bucket"');
            console.log('   5. Click "Create bucket"');
            return;
        }

        console.log(`✅ Bucket '${BUCKET_NAME}' created successfully!`);
    }

    // Test upload
    console.log('\n🧪 Testing upload...');
    const testFile = new Blob(['test'], { type: 'text/plain' });
    const testPath = `_test_${Date.now()}.txt`;

    const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(testPath, testFile);

    if (uploadError) {
        console.error('❌ Upload test failed:', uploadError.message);
        console.log('\n⚠️  You may need to configure RLS policies for the bucket.');
    } else {
        console.log('✅ Upload test successful!');

        // Clean up test file
        await supabase.storage.from(BUCKET_NAME).remove([testPath]);
        console.log('🧹 Test file cleaned up.');
    }

    // Get public URL format
    const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl('example.jpg');
    console.log('\n📎 Public URL format:', urlData.publicUrl.replace('example.jpg', '<filename>'));

    console.log('\n✨ Setup complete!');
}

setupBucket();
