import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../types/database';

interface ComparisonContextType {
    selectedProducts: Product[];
    toggleProduct: (product: Product) => void;
    clearSelection: () => void;
    isInComparison: (productId: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const ComparisonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

    const toggleProduct = (product: Product) => {
        setSelectedProducts(prev => {
            const exists = prev.find(p => p.id === product.id);
            if (exists) {
                return prev.filter(p => p.id !== product.id);
            }
            if (prev.length >= 2) {
                // Replace the first one or prevent?
                // Better UX: Remove first (FIFO) or Toast "Max 2"? 
                // User pattern: "Max 2". Let's try FIFO (replace oldest) to keep it fluid, 
                // OR strict "Max 2" requiring deselect. 
                // Let's go strict with replacement of FIRST element (queue) so user doesn't have to deselect manually.
                const [, second] = prev;
                return [second, product];
            }
            return [...prev, product];
        });
    };

    const clearSelection = () => setSelectedProducts([]);

    const isInComparison = (productId: string) => selectedProducts.some(p => p.id === productId);

    return (
        <ComparisonContext.Provider value={{ selectedProducts, toggleProduct, clearSelection, isInComparison }}>
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
