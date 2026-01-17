/**
 * SOURCE DE VÉRITÉ - SCHÉMA SQL SUPABASE
 * Ce fichier reflète strictement la structure de la base de données.
 */

import React from 'react';

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
  link: string;
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
  image_url: string;
  specs?: Record<string, any>;
  price: number; // Facade pour l'affichage rapide (généralement le prix min)
  
  // Offres multi-vendeurs
  offers?: ProductOffer[];
  
  // Synthèse des avis (Social Proof)
  reviews_summary?: ReviewsSummary;
  
  // UI Helpers
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  isPromo?: boolean;
  badge?: { 
    text: string; 
    color: string;
    icon?: React.ReactNode;
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

// 4. UTILISATEURS (PROFILES)
export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  creative_profile: CreativeProfileType | null;
}
