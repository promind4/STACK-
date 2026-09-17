ALTER TABLE products
  ADD COLUMN IF NOT EXISTS recommendation_profile jsonb NOT NULL DEFAULT '{}'::jsonb;
CREATE INDEX IF NOT EXISTS idx_products_recommendation_profile
  ON products USING gin (recommendation_profile);
