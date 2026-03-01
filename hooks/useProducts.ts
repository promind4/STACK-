'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Product } from '../types/database';
import { transformProduct } from '@/lib/transformers';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const useProducts = (categorySlug?: string) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                let query = supabase
                    .from('products')
                    .select('*, product_offers(*)')
                    .eq('is_active', true);

                if (categorySlug) {
                    const VERTICALS = ['audio', 'video', 'streaming'];
                    let categoryIds: string[] = [];

                    if (VERTICALS.includes(categorySlug)) {
                        const { data: cats, error: vError } = await supabase
                            .from('categories')
                            .select('id')
                            .eq('vertical', categorySlug);

                        if (vError) throw vError;
                        if (cats) categoryIds = (cats as any[]).map(c => c.id);

                    } else {
                        const { data: category, error: catError } = await supabase
                            .from('categories')
                            .select('id')
                            .eq('slug', categorySlug)
                            .single();

                        if (catError) throw new Error("Catégorie introuvable");

                        if (category) {
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
                    }
                }

                const { data, error: err } = await query;

                if (err) throw err;

                if (data) {
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
    }, [categorySlug]);

    return { products, loading, error };
};
