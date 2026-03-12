/**
 * SOURCE DE VÉRITÉ - SCHÉMA SQL SUPABASE
 * Ce fichier reflète strictement la structure de la base de données.
 */

import { type ReactNode } from 'react';

// --- ENUMS & TYPES ---

export type VerticalType = 'audio' | 'video' | 'streaming';
export type CreativeProfileType = 'musician' | 'streamer' | 'videographer';
export type MerchantName = 'amazon' | 'thomann' | 'ldlc' | 'woodbrass' | 'bhphoto' | 'direct' | string;

export interface ReviewsSummary {
  average_rating: number;
  total_reviews: number;
  pros: string[];
  cons: string[];
  sentiment_summary: string;
}

export interface ProductOffer {
  merchant_name: MerchantName;
  merchant_logo_url: string;
  price: number;
  currency: string;
  affiliate_link: string;
  in_stock: boolean;
}

// --- TABLES ---

// 1. PRODUITS
export interface Product {
  id: string;
  category_id?: string;
  name: string;
  slug: string;
  brand: string;
  description: string;
  short_description?: string;
  image_url: string;
  specs?: Record<string, any>;
  price: number; // Facade pour l'affichage rapide (généralement le prix min)

  // Images
  gallery_images?: string[]; // URLs additionnelles

  is_active?: boolean;

  // Offres multi-vendeurs
  offers?: ProductOffer[];

  // Contenu Riche (Enrichment)
  pros?: string[];
  cons?: string[];

  // Synthèse des avis (Social Proof)
  reviews_summary?: ReviewsSummary;

  // UI Helpers
  rating?: number;
  reviews?: number; // @deprecated use review_count
  review_count?: number;
  inStock?: boolean;
  isPromo?: boolean;
  badge?: {
    text: string;
    color: string;
    icon?: ReactNode;
  };
}

// 2. OFFRES (Table SQL jointe ou JSONB)
// Voir ProductOffer ci-dessus pour la structure de détail

// 3. CATÉGORIES
export interface Category {
  id?: string;
  name: string;
  slug: string;
  vertical: VerticalType;
  parent_id?: string | null;
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  creative_profile: CreativeProfileType | null;
}

// 5. ARTICLES (Architecture Modulaire)
export interface AffiliateLink {
  merchant: MerchantName;
  url: string;
  label: string;
}

export interface ArticleProductBlock {
  product_slug: string;
  badge: string;
  title: string;
  subtitle: string;
  image_url: string;
  description: string;
  pros_title: string;
  pros: string[];
  cons_title: string;
  cons: string[];
  usage_tip: string;
  affiliate_links: AffiliateLink[];
  hide_product_link?: boolean;
}

export interface ArticleComparisonRow {
  cells: string[];
  highlight: boolean;
}

export interface ArticleComparisonTable {
  headers: string[];
  rows: ArticleComparisonRow[];
}

export interface ArticleContentSection {
  order: number;
  title: string;
  html: string;
}

export interface ArticleConclusionBlock {
  emoji: string;
  title: string;
  content: string;
}

export interface ArticleFaqItem {
  question: string;
  answer: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  read_time: string | null;
  published_at: string | null;
  author: string | null;
  hero_image_url: string | null;
  intro_text: string | null;

  // JSONB Blocks
  comparison_table: ArticleComparisonTable | null;
  product_blocks: ArticleProductBlock[];
  sidebar_product_ids: string[];
  content_sections: ArticleContentSection[];
  conclusion_block: ArticleConclusionBlock | null;
  faq_items: ArticleFaqItem[];

  // Meta
  related_products: string[];
  related_category_slug: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}
