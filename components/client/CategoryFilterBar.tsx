'use client';

import { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, X, Star, ArrowRight } from 'lucide-react';
import { Product } from '@/types/database';
import Link from 'next/link';
import Image from 'next/image';

type SortOption = 'default' | 'price_asc' | 'price_desc' | 'rating' | 'name';

interface CategoryFilterBarProps {
    products: Product[];
}

export default function CategoryFilterBar({ products }: CategoryFilterBarProps) {
    const [sortBy, setSortBy] = useState<SortOption>('default');
    const [selectedBrand, setSelectedBrand] = useState<string>('');

    // Extract unique brands
    const brands = useMemo(() => {
        const brandSet = new Set(products.map(p => p.brand).filter(Boolean));
        return Array.from(brandSet).sort();
    }, [products]);

    // Filter & sort
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Brand filter
        if (selectedBrand) {
            result = result.filter(p => p.brand === selectedBrand);
        }

        // Sort
        switch (sortBy) {
            case 'price_asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'name':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }

        return result;
    }, [products, sortBy, selectedBrand]);

    const hasActiveFilters = selectedBrand || sortBy !== 'default';

    const clearFilters = () => {
        setSortBy('default');
        setSelectedBrand('');
    };

    return (
        <>
            {/* FILTER BAR */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
                {/* Sort dropdown */}
                <div className="relative">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="appearance-none bg-white border border-border rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-foreground cursor-pointer hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    >
                        <option value="default">Trier par : Pertinence</option>
                        <option value="price_asc">Prix : croissant</option>
                        <option value="price_desc">Prix : décroissant</option>
                        <option value="rating">Meilleures notes</option>
                        <option value="name">Nom A → Z</option>
                    </select>
                    <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>

                {/* Brand filter */}
                {brands.length > 1 && (
                    <div className="relative">
                        <select
                            value={selectedBrand}
                            onChange={(e) => setSelectedBrand(e.target.value)}
                            className="appearance-none bg-white border border-border rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-foreground cursor-pointer hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        >
                            <option value="">Toutes les marques</option>
                            {brands.map(brand => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </select>
                        <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                )}

                {/* Clear filters */}
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-4 h-4" />
                        Réinitialiser
                    </button>
                )}

                {/* Product count */}
                <span className="ml-auto text-sm text-muted-foreground">
                    {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''}
                </span>
            </div>

            {/* PRODUCT GRID */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {filteredProducts.map((product) => (
                        <Link
                            key={product.id}
                            href={`/produit/${product.slug}`}
                            className="group bg-white rounded-2xl border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer h-full"
                        >
                            {/* IMAGE AREA */}
                            <div className="aspect-square relative bg-white overflow-hidden p-2">
                                <Image
                                    src={product.image_url}
                                    alt={`${product.name}${product.brand ? ` ${product.brand}` : ''} – Avis et prix | Fluxlab`}
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 p-2"
                                    loading="lazy"
                                />
                                {product.badge && (
                                    <div
                                        className={`absolute top-3 left-3 px-2 py-1 text-[10px] font-bold uppercase rounded border shadow-sm ${product.badge.color}`}
                                    >
                                        {product.badge.text}
                                    </div>
                                )}
                                {product.inStock === false && (
                                    <div className="absolute bottom-3 left-3 px-2 py-1 text-[10px] font-bold uppercase rounded border shadow-sm bg-stone-800 text-white">
                                        Rupture
                                    </div>
                                )}
                            </div>

                            {/* CONTENT AREA */}
                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        {product.brand}
                                    </span>
                                    {product.rating && product.rating > 0 && (
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
                                    <span className="text-xl font-bold">
                                        ≈ {product.price}€
                                    </span>
                                    <span className="hover:bg-accent hover:text-accent-foreground px-2 py-1 rounded-md text-sm font-medium transition-colors inline-flex items-center">
                                        Voir
                                        <ArrowRight className="w-4 h-4 ml-1" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <p className="text-muted-foreground font-light">Aucun produit ne correspond à vos filtres.</p>
                </div>
            )}
        </>
    );
}
