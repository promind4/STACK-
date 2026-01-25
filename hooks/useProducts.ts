import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Product } from '../types/database';
import { transformProduct } from '../lib/transformers';
// @ts-ignore - Ignoring type check for now as we don't have the full generated types yet
import { Database } from '../types/supabase';

export const useProducts = (categorySlug?: string) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                // Base Query
                let query = supabase
                    .from('products')
                    .select('*, product_offers(*)')
                    .eq('is_active', true);

                // Filter by category or vertical
                if (categorySlug) {
                    const VERTICALS = ['audio', 'video', 'streaming'];

                    let categoryIds: string[] = [];

                    if (VERTICALS.includes(categorySlug)) {
                        // CASE 1: Vertical (Root) Level e.g. "audio"
                        const { data: cats, error: vError } = await supabase
                            .from('categories')
                            .select('id')
                            .eq('vertical', categorySlug);

                        if (vError) throw vError;
                        if (cats) categoryIds = (cats as any[]).map(c => c.id);

                    } else {
                        // CASE 2: Specific Category (Parent or Child)
                        const { data: category, error: catError } = await supabase
                            .from('categories')
                            .select('id')
                            .eq('slug', categorySlug)
                            .single();

                        if (catError) throw new Error("Catégorie introuvable");

                        if (category) {
                            // Find this category AND its children
                            const { data: children } = await supabase
                                .from('categories')
                                .select('id')
                                .eq('parent_id', (category as any).id);

                            categoryIds = [(category as any).id];
                            if (children) {
                                categoryIds = [...categoryIds, ...children.map((c: any) => c.id)];
                            }
                        }
                    }

                    if (categoryIds.length > 0) {
                        query = query.in('category_id', categoryIds);
                    } else {
                        // If category found but no IDs (shouldn't happen if logic correct), allow empty result
                        // or maybe we want to return empty immediately
                    }
                }

                // Execute Query
                const { data, error: err } = await query;

                if (err) throw err;

                if (data) {
                    // Cast data to expected type since our manual types might be slightly off or strict
                    const transformed = (data as any[]).map(item => transformProduct(item));
                    setProducts(transformed);
                }
            } catch (err: any) {
                console.error('Error fetching products:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categorySlug]); // Re-fetch when slug changes

    return { products, loading, error };
};
