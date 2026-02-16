import React, { useEffect, useState } from 'react';
import { Button } from './ui/Button';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from './ui/ProductCard';
import { supabase } from '../lib/supabaseClient';
import { transformProduct } from '../lib/transformers';
import { Product } from '../types/database';

interface FeaturedProductsProps {
  onNavigate?: (page: string, slug?: string) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ onNavigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      // Slugs selected based on User Request
      const slugs = [
        'focusrite-scarlett-2i2-4th-gen', // Carte son
        'shure-sm7b',                     // Micro phare
        'sony-zv-e10',                    // Image
        'elgato-stream-deck-mk2'          // Streaming
      ];

      const { data, error } = await supabase
        .from('products')
        .select('*, product_offers(*)')
        .in('slug', slugs);

      if (data) {
        let items = (data as any[]).map(p => transformProduct(p));
        // Sort explicitly to match the desired visual order
        items = items.sort((a, b) => slugs.indexOf(a.slug) - slugs.indexOf(b.slug));
        setProducts(items);
      }
      setLoading(false);
    };

    fetchFeatured();
  }, []);

  if (loading) return <div className="py-20 text-center">Chargement...</div>;

  return (
    <section className="py-20 bg-background border-b border-border/40">
      <div className="container mx-auto px-6 max-w-[1600px]">

        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Les Produits du Moment</h2>
            <p className="text-muted-foreground mt-2">Le matériel le plus plébiscité, avec nos conseils de compatibilité.</p>
          </div>
          <Button variant="ghost" className="hidden md:flex gap-2" onClick={() => onNavigate && onNavigate('category')}>
            Voir tout le catalogue <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={(slug) => onNavigate && onNavigate('product', slug)}
            />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button variant="ghost" className="w-full" onClick={() => onNavigate && onNavigate('category')}>
            Voir tout le catalogue <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

      </div>
    </section>
  );
};