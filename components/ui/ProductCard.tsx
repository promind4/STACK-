'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Product } from '@/types/database';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
    product: Product;
    className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className={`group bg-white rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer h-full ${className}`}
        >
            <Link href={`/produit/${product.slug}`} className="contents">
                {/* IMAGE AREA */}
                <div className="aspect-square relative bg-white overflow-hidden p-2">
                    <Image
                        src={product.image_url}
                        alt={`${product.name}${product.brand ? ` ${product.brand}` : ''} – Avis, test et meilleur prix | Fluxlab`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 p-2"
                        loading="lazy"
                    />

                    {/* Smart Badge */}
                    {product.badge && (
                        <div className={`absolute top-3 left-3 px-2 py-1 text-[10px] font-bold uppercase rounded border shadow-sm ${product.badge.color}`}>
                            {product.badge.text}
                        </div>
                    )}
                </div>

                {/* CONTENT AREA */}
                <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{product.brand}</span>
                        {product.rating !== undefined && product.rating > 0 && (
                            <div className="flex items-center gap-1 mt-0.5 bg-secondary/50 px-1.5 py-0.5 rounded text-xs font-bold text-foreground">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                <span>{product.rating}</span>
                            </div>
                        )}
                    </div>

                    <h3 className="font-bold text-lg mb-4 text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                    </h3>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
                        <span className="text-xl font-bold">≈ {product.price}€</span>
                        <span className="hover:bg-primary hover:text-white px-2 py-1 rounded-md text-sm font-medium transition-colors group/btn flex items-center gap-1">
                            Voir
                            <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};
