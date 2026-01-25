import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface SearchSuggestion {
    id: string;
    name: string;
    slug: string;
    brand: string;
    category_id: string;
    image_url: string;
}

export const useSearchSuggestions = (query: string) => {
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!query || query.length < 2) {
                setSuggestions([]);
                return;
            }

            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('id, name, slug, brand, category_id, image_url')
                    .or(`name.ilike.%${query}%,brand.ilike.%${query}%`)
                    .limit(5);

                if (error) throw error;
                setSuggestions(data || []);
            } catch (err) {
                console.error('Error fetching suggestions:', err);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        };

        // Debounce
        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    return { suggestions, loading };
};
