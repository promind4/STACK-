-- =============================================
-- TABLE : articles (Architecture Modulaire)
-- Chaque article est composé de "blocs" optionnels
-- qui s'affichent dynamiquement si la donnée existe.
-- =============================================

CREATE TABLE IF NOT EXISTS articles (

  -- ═══════════════════════════════════════════
  -- CLÉS ET IDENTIFIANTS
  -- ═══════════════════════════════════════════
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug          TEXT NOT NULL UNIQUE,


  -- ═══════════════════════════════════════════
  -- BLOC 1 : EN-TÊTE & INTRO
  -- ═══════════════════════════════════════════
  title           TEXT NOT NULL,                         -- Titre H1 de l'article
  category        TEXT NOT NULL DEFAULT 'Audio',         -- "Audio", "Video", "Streaming"
  read_time       TEXT DEFAULT '10 min',                 -- Durée de lecture estimée
  published_at    TEXT,                                  -- Date affichée (ex: "25 Feb 2026")
  author          TEXT DEFAULT 'Équipe Fluxlab',         -- Auteur
  hero_image_url  TEXT,                                  -- Grande image d'illustration (hero)
  intro_text      TEXT,                                  -- Texte riche HTML d'introduction / chapeau SEO


  -- ═══════════════════════════════════════════
  -- BLOC 2 : TABLEAU COMPARATIF (Optionnel)
  -- ═══════════════════════════════════════════
  -- Structure JSONB attendue :
  -- {
  --   "headers": ["Interface", "Gain Max", "Style Vocal", "Note Fluxlab"],
  --   "rows": [
  --     { "cells": ["Scarlett Solo", "69 dB (Élevé)", "Air – Présence radio", "4.8 / 5"], "highlight": false },
  --     { "cells": ["Volt 1", "55 dB", "Vintage – Chaud et épais", "4.6 / 5"], "highlight": true }
  --   ]
  -- }
  comparison_table  JSONB DEFAULT NULL,


  -- ═══════════════════════════════════════════
  -- BLOC 3 : BLOCS PRODUITS (Cœur de la conversion)
  -- ═══════════════════════════════════════════
  -- Structure JSONB Array attendue :
  -- [
  --   {
  --     "product_slug":    "focusrite-scarlett-solo-4th-gen",
  --     "badge":           "#1 : La Référence Absolue",
  --     "title":           "Focusrite Scarlett Solo (4th Gen)",
  --     "subtitle":        "Interface audio simple et fiable pour débuter",
  --     "image_url":       "https://...",
  --     "description":     "La 4ème génération redéfinit les standards...",
  --     "pros_title":      "Points Forts",
  --     "pros":            ["Gain massif de 69 dB", "Mode Air légendaire"],
  --     "cons_title":      "Limites réelles",
  --     "cons":            ["Peut frôler les 100€ hors soldes"],
  --     "usage_tip":       "La valeur sûre et robuste par excellence...",
  --     "affiliate_links": [
  --       { "merchant": "thomann", "url": "https://www.thomann.fr/...", "label": "Thomann" },
  --       { "merchant": "amazon",  "url": "https://www.amazon.fr/...",  "label": "Amazon" },
  --       { "merchant": "woodbrass","url": "https://www.woodbrass.com/...","label": "Woodbrass" }
  --     ]
  --   }
  -- ]
  product_blocks  JSONB DEFAULT '[]'::jsonb,


  -- ═══════════════════════════════════════════
  -- BLOC 4 : SIDEBAR "Dans cet article"
  -- ═══════════════════════════════════════════
  -- Référence les ID de la table `products` existante.
  -- Le frontend ira chercher image, nom, prix automatiquement
  -- via une jointure ou un .in() Supabase.
  -- Ex: ['uuid-1', 'uuid-2', 'uuid-3']
  sidebar_product_ids  UUID[] DEFAULT '{}',


  -- ═══════════════════════════════════════════
  -- BLOC 5 : CONTENU RICHE LIBRE (Optionnel)
  -- ═══════════════════════════════════════════
  -- Pour les sections de texte entre les blocs produits
  -- (ex: "Pourquoi acheter une interface audio ?",
  --  "Critères exigeants sous la barre des 200€")
  -- Stocké en HTML brut pour flexibilité totale
  content_sections  JSONB DEFAULT '[]'::jsonb,
  -- Structure :
  -- [
  --   { "order": 1, "title": "Pourquoi acheter une interface ?", "html": "<p>...</p>" },
  --   { "order": 2, "title": "Critères exigeants", "html": "<p>...</p>" }
  -- ]


  -- ═══════════════════════════════════════════
  -- BLOC 6 : CONCLUSION "Le Mot de la Fin"
  -- ═══════════════════════════════════════════
  -- Structure JSONB attendue :
  -- {
  --   "emoji":   "🏆",
  --   "title":   "Le Mot de la Fin",
  --   "content": "<p>Ne vous torturez pas. Si vous avez le budget de 100-120€...</p>"
  -- }
  conclusion_block  JSONB DEFAULT NULL,


  -- ═══════════════════════════════════════════
  -- BLOC 7 : FAQ (Accordéon + SEO JSON-LD)
  -- ═══════════════════════════════════════════
  -- Structure JSONB Array attendue :
  -- [
  --   {
  --     "question": "Le Stream Deck fonctionne-t-il sur Mac et PC ?",
  --     "answer":   "Oui, parfaitement sur les deux écosystèmes..."
  --   }
  -- ]
  -- Le frontend génèrera automatiquement :
  --   1. L'accordéon HTML <details>/<summary>
  --   2. Le bloc <script type="application/ld+json"> FAQPage pour le SEO
  faq_items  JSONB DEFAULT '[]'::jsonb,


  -- ═══════════════════════════════════════════
  -- MÉTADONNÉES & RELATIONS HÉRITÉES
  -- ═══════════════════════════════════════════
  related_products       TEXT[] DEFAULT '{}',             -- Slugs des produits liés (rétro-compat)
  related_category_slug  TEXT,                            -- Slug catégorie pour CTA
  is_published           BOOLEAN DEFAULT true,            -- Masquer sans supprimer

  -- Horodatage
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()

);


-- ═══════════════════════════════════════════
-- INDEX
-- ═══════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_articles_slug       ON articles (slug);
CREATE INDEX IF NOT EXISTS idx_articles_category   ON articles (category);
CREATE INDEX IF NOT EXISTS idx_articles_published  ON articles (is_published);


-- ═══════════════════════════════════════════
-- TRIGGER : updated_at automatique
-- ═══════════════════════════════════════════
CREATE OR REPLACE FUNCTION update_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_articles_updated_at();


-- ═══════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Lecture publique (articles publiés) + admins voient les brouillons
CREATE POLICY "Articles are viewable by everyone"
  ON articles FOR SELECT
  USING (is_published = true OR auth.role() = 'authenticated');

-- Écriture réservée aux utilisateurs authentifiés (admin)
CREATE POLICY "Authenticated users can insert articles"
  ON articles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update articles"
  ON articles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete articles"
  ON articles FOR DELETE
  TO authenticated
  USING (true);
