'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Product } from '@/types/database';

export interface ComparisonProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  image_url: string;
  price?: number;
}

interface ComparisonContextType {
  selectedProducts: ComparisonProduct[];
  toggleProduct: (product: ComparisonProduct) => void;
  clearSelection: () => void;
  isInComparison: (productId: string) => boolean;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const STORAGE_KEY = 'fluxlab_duel_selection';

export const ComparisonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedProducts, setSelectedProducts] = useState<ComparisonProduct[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hydrate from sessionStorage if available
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setSelectedProducts(parsed.slice(0, 2));
      }
    } catch (e) {
      // Ignore sessionStorage error
    }
  }, []);

  const toggleProduct = (product: ComparisonProduct) => {
    setSelectedProducts(prev => {
      let next: ComparisonProduct[];
      const exists = prev.find(p => p.id === product.id || p.slug === product.slug);
      if (exists) {
        next = prev.filter(p => p.id !== product.id && p.slug !== product.slug);
      } else if (prev.length >= 2) {
        // Keep the second one and append the new one
        next = [prev[1], product];
      } else {
        next = [...prev, product];
      }
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedProducts([]);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  };

  const isInComparison = (productIdOrSlug: string) => {
    return selectedProducts.some(p => p.id === productIdOrSlug || p.slug === productIdOrSlug);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <ComparisonContext.Provider
      value={{
        selectedProducts,
        toggleProduct,
        clearSelection,
        isInComparison,
        isModalOpen,
        openModal,
        closeModal
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};

