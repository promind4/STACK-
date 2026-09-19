'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import type { Product } from '@/types/database';
import { areProductsComparable, getComparableFamily, getFamilyDisplayName, ComparableFamily } from '@/lib/duelEngine';

export interface ComparisonProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  image_url: string;
  price?: number;
  category_slug?: string;
}

interface IncompatibleNotice {
  message: string;
  blockedProduct: ComparisonProduct;
  activeFamily: ComparableFamily | null;
}

interface ComparisonContextType {
  selectedProducts: ComparisonProduct[];
  toggleProduct: (product: ComparisonProduct) => void;
  replaceSelectionWith: (product: ComparisonProduct) => void;
  clearSelection: () => void;
  isInComparison: (productId: string) => boolean;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  incompatibleNotice: IncompatibleNotice | null;
  clearIncompatibleNotice: () => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const STORAGE_KEY = 'fluxlab_duel_selection';

export const ComparisonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedProducts, setSelectedProducts] = useState<ComparisonProduct[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [incompatibleNotice, setIncompatibleNotice] = useState<IncompatibleNotice | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearIncompatibleNotice = () => setIncompatibleNotice(null);

  // Hydrate from sessionStorage if available
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          if (parsed.length === 2 && !areProductsComparable(parsed[0], parsed[1])) {
            setSelectedProducts([parsed[0]]);
          } else {
            setSelectedProducts(parsed.slice(0, 2));
          }
        }
      }
    } catch (e) {
      // Ignore sessionStorage error
    }
  }, []);

  const replaceSelectionWith = (product: ComparisonProduct) => {
    setSelectedProducts([product]);
    setIncompatibleNotice(null);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify([product]));
    } catch (e) {}
  };

  const toggleProduct = (product: ComparisonProduct) => {
    // Clear any previous notice timer
    if (timerRef.current) clearTimeout(timerRef.current);

    setSelectedProducts(prev => {
      let next: ComparisonProduct[];
      const exists = prev.find(p => p.id === product.id || p.slug === product.slug);

      if (exists) {
        next = prev.filter(p => p.id !== product.id && p.slug !== product.slug);
        setIncompatibleNotice(null);
      } else if (prev.length === 0) {
        next = [product];
        setIncompatibleNotice(null);
      } else if (prev.length === 1) {
        const first = prev[0];
        if (areProductsComparable(first, product)) {
          next = [first, product];
          setIncompatibleNotice(null);
        } else {
          // Incompatible categories! Block pairing and display polite notice
          const fam1 = getComparableFamily(first);
          const fam2 = getComparableFamily(product);
          const label1 = getFamilyDisplayName(fam1);
          const label2 = getFamilyDisplayName(fam2);

          setIncompatibleNotice({
            message: `Duel impossible entre catégories différentes (${label1} vs ${label2}). Les duels comparent des produits de même usage.`,
            blockedProduct: product,
            activeFamily: fam1
          });

          timerRef.current = setTimeout(() => {
            setIncompatibleNotice(null);
          }, 6000);

          return prev; // keep previous selection without adding
        }
      } else {
        // prev.length >= 2
        // Check if product is comparable with current selection
        if (areProductsComparable(prev[0], product)) {
          next = [prev[0], product];
          setIncompatibleNotice(null);
        } else {
          // User selected a completely different category -> Switch selection to new product
          const fam2 = getComparableFamily(product);
          const label2 = getFamilyDisplayName(fam2);
          next = [product];
          setIncompatibleNotice({
            message: `Nouvelle catégorie sélectionnée (${label2}). Choisissez un second produit pour lancer le duel.`,
            blockedProduct: product,
            activeFamily: fam2
          });
          timerRef.current = setTimeout(() => {
            setIncompatibleNotice(null);
          }, 4500);
        }
      }

      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedProducts([]);
    setIncompatibleNotice(null);
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
        replaceSelectionWith,
        clearSelection,
        isInComparison,
        isModalOpen,
        openModal,
        closeModal,
        incompatibleNotice,
        clearIncompatibleNotice
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

