import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, Swords, Star } from 'lucide-react';
import { Button } from './Button';
import { StarRating } from './StarRating';
import { Product } from '../../types/database';
import { useComparison } from '../../context/ComparisonContext';

interface ProductCardProps {
  product: Product;
  onClick?: (slug: string) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, className = '' }) => {
  const { toggleProduct, isInComparison } = useComparison();
  const isSelected = isInComparison(product.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick && onClick(product.slug)}
      className={`group bg-white rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer h-full ${className} ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
    >
      {/* IMAGE AREA */}
      <div className="aspect-square relative bg-white overflow-hidden p-2">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/e2e8f0/94a3b8?text=No+Image';
          }}
        />

        {/* Overlay Actions */}
        <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 z-10 ${isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`}>
          <button
            className={`w-8 h-8 rounded-full shadow-sm flex items-center justify-center transition-colors ${isSelected ? 'bg-primary text-white border border-primary' : 'bg-white text-muted-foreground hover:text-primary border border-border'}`}
            onClick={(e) => { e.stopPropagation(); toggleProduct(product); }}
            title="Comparer"
          >
            <Swords className="w-4 h-4" />
          </button>

          <button
            className="w-8 h-8 rounded-full bg-white border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"
            onClick={(e) => { e.stopPropagation(); /* Add to wishlist logic */ }}
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>

        {/* Smart Badge */}
        {product.badge && (
          <div className={`absolute top-3 left-3 px-2 py-1 text-[10px] font-bold uppercase rounded border shadow-sm ${product.badge.color}`}>
            {product.badge.text}
          </div>
        )}

        {/* Stock Badge if out of stock */}
        {product.inStock === false && (
          <div className="absolute bottom-3 left-3 px-2 py-1 text-[10px] font-bold uppercase rounded border shadow-sm bg-stone-800 text-white">
            Rupture
          </div>
        )}
      </div>

      {/* CONTENT AREA */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{product.brand}</span>
          <div className="flex items-center gap-1 mt-0.5 bg-secondary/50 px-1.5 py-0.5 rounded text-xs font-bold text-foreground">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span>{product.rating}</span>
          </div>
        </div>

        <h3 className="font-bold text-lg mb-4 text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
          <span className="text-xl font-bold">≈ {product.price}€</span>
          <Button variant="ghost" size="sm" className="group/btn hover:bg-primary hover:text-white px-2">
            Voir
            <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};