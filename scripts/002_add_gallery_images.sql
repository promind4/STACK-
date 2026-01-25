
-- SQL MIGRATION: ADD GALLERY SUPPORT
-- Run this in Supabase SQL Editor

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS gallery_images text[] DEFAULT '{}';

COMMENT ON COLUMN products.gallery_images IS 'Array of URLs for additional product images (thumbnails/gallery)';
