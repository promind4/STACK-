-- ════════════════════════════════════════════════════════════════
--  FLUXLAB — Suivi & historique des prix
--  À exécuter une fois dans Supabase (SQL Editor)
-- ════════════════════════════════════════════════════════════════

-- 1. Colonnes de suivi sur les offres existantes
ALTER TABLE product_offers
  ADD COLUMN IF NOT EXISTS last_checked_at  timestamptz,
  ADD COLUMN IF NOT EXISTS last_price_source text,        -- 'scraping' | 'amazon-paapi' | 'awin' | 'manual'
  ADD COLUMN IF NOT EXISTS price_locked     boolean NOT NULL DEFAULT false; -- true = ne jamais écraser automatiquement

COMMENT ON COLUMN product_offers.price_locked IS
  'Si true, le prix est verrouillé manuellement et le système de MAJ automatique ne le touchera pas.';

-- 2. Historique des prix (1 ligne par relevé qui change le prix)
CREATE TABLE IF NOT EXISTS price_history (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id      uuid        REFERENCES product_offers(id) ON DELETE CASCADE,
  product_id    uuid        REFERENCES products(id)        ON DELETE CASCADE,
  merchant_name text        NOT NULL,
  price         numeric     NOT NULL,
  currency      text        NOT NULL DEFAULT 'EUR',
  source        text        NOT NULL,            -- d'où vient le prix
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_price_history_offer   ON price_history(offer_id);
CREATE INDEX IF NOT EXISTS idx_price_history_product ON price_history(product_id);
CREATE INDEX IF NOT EXISTS idx_price_history_date    ON price_history(created_at DESC);

-- 3. RLS : lecture publique de l'historique (pour afficher les courbes de prix plus tard),
--    écriture réservée au service role (le cron / l'admin serveur).
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "price_history_public_read" ON price_history;
CREATE POLICY "price_history_public_read"
  ON price_history FOR SELECT
  USING (true);

-- (Le service role bypass la RLS, aucune policy d'écriture nécessaire.)
