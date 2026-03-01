'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Clock, ArrowRight, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

interface Article {
    id: string;
    slug: string;
    title: string;
    category: string;
    readTime: string;
    date: string;
    image: string;
    intro: string;
}

interface GuidesClientProps {
    articles: Article[];
    categories: string[];
}

export default function GuidesClient({ articles, categories }: GuidesClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Tous");

    const filteredArticles = useMemo(() => {
        return articles.filter(article => {
            const matchSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.intro.toLowerCase().includes(searchQuery.toLowerCase());
            const matchCategory = selectedCategory === "Tous" || article.category === selectedCategory;
            return matchSearch && matchCategory;
        });
    }, [articles, searchQuery, selectedCategory]);

    return (
        <>
            {/* FILTERS */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <h3 className="text-2xl font-bold font-serif min-w-fit">Tous nos Guides</h3>

                <div className="flex flex-col md:flex-row gap-4 flex-1 justify-end">
                    {/* SEARCH */}
                    <div className="relative w-full md:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Rechercher un guide..."
                            className="w-full pl-9 pr-4 py-2 rounded-full border border-border bg-white text-sm focus:outline-none focus:border-primary/50 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-primary">
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* FILTER PILLS */}
            <div className="flex flex-wrap gap-2 mb-12">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all border ${selectedCategory === cat
                            ? 'bg-primary text-white border-primary shadow-sm'
                            : 'bg-white text-muted-foreground border-border hover:border-primary/30 hover:text-foreground'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* ARTICLES GRID */}
            {filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    <AnimatePresence>
                        {filteredArticles.map((article) => (
                            <motion.article
                                layout
                                key={article.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="group cursor-pointer flex flex-col h-full"
                            >
                                <Link href={`/guide/${article.slug}`} className="flex flex-col h-full">
                                    <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-6 relative shadow-sm border border-border/50">
                                        <Image
                                            src={article.image}
                                            alt={article.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-2 py-1 bg-white/95 backdrop-blur text-xs font-bold uppercase tracking-wider rounded border border-black/5 shadow-sm">
                                                {article.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 font-medium">
                                        <Clock className="w-3 h-3" />
                                        {article.readTime} de lecture
                                        <span className="w-1 h-1 rounded-full bg-border md:mx-1" />
                                        {article.date}
                                    </div>

                                    <h4 className="text-xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors font-serif">
                                        {article.title}
                                    </h4>

                                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1 font-light">
                                        {article.intro}
                                    </p>

                                    <div className="flex items-center text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                                        Lire l&apos;article <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            </motion.article>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="py-20 text-center">
                    <p className="text-muted-foreground text-lg">Aucun article ne correspond à votre recherche.</p>
                    <Button variant="ghost" className="mt-4" onClick={() => { setSearchQuery(""); setSelectedCategory("Tous"); }}>
                        Réinitialiser les filtres
                    </Button>
                </div>
            )}
        </>
    );
}
