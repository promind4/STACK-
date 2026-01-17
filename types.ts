import React from 'react';

// Enums matching SQL Schema
export enum VerticalType {
  Audio = 'audio',
  Video = 'video',
  Streaming = 'streaming'
}

export enum MerchantType {
  Amazon = 'amazon',
  Thomann = 'thomann',
  Ldlc = 'ldlc',
  Bhphoto = 'bhphoto',
  Woodbrass = 'woodbrass',
  Direct = 'direct'
}

export enum AssetType {
  Preset = 'preset',
  Template = 'template',
  Lut = 'lut',
  SamplePack = 'sample_pack',
  Ebook = 'ebook'
}

// Interface definitions
export interface Category {
  id: string;
  name: string;
  slug: string;
  vertical: VerticalType;
  icon?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  image_url: string;
  price: number; // Simplified for UI display from offers
  description: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}