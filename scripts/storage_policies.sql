-- Policies for the 'images-produit' bucket in Supabase Storage
-- Run this in your Supabase SQL Editor (supabase.com/dashboard -> SQL Editor)

-- 1. Allow anyone to view/download images (public read)
CREATE POLICY "Public read access for images-produit"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'images-produit');

-- 2. Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload to images-produit"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images-produit');

-- 3. Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update in images-produit"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'images-produit');

-- 4. Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete from images-produit"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'images-produit');
