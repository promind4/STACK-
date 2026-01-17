import React from 'react';
import { Button } from './ui/Button';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from './ui/ProductCard';
import { getFeaturedProducts } from '../lib/mockData';

export const FeaturedProducts: React.FC = () => {
  // On récupère les 4 premiers produits pour l'affichage "Featured"
  const featuredProducts = getFeaturedProducts().slice(0, 4);

  return (
    <section className="py-20 bg-background border-b border-border/40">
      <div className="container mx-auto px-6 max-w-[1600px]">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Les Stacks du Moment</h2>
            <p className="text-muted-foreground mt-2">Le matériel le plus plébiscité, avec nos conseils de compatibilité.</p>
          </div>
          <Button variant="ghost" className="hidden md:flex gap-2">
            Voir tout le catalogue <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              // Note: Dans une vraie implémentation, on passerait la fonction de navigation via props ou contexte
              // Pour l'instant, le parent (App.tsx) gère le clic global sur la section
              onClick={() => {}} 
            />
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
            <Button variant="ghost" className="w-full">
            Voir tout le catalogue <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

      </div>
    </section>
  );
};