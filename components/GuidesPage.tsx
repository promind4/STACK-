import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';

import {
  Clock, ArrowRight, Sparkles, Search, X
} from 'lucide-react';
import { ARTICLES, PATHWAYS } from '../lib/data';
import { useSEO } from './SEOHelper';

interface GuidesPageProps {
  onNavigate: (page: string, slug?: string) => void;
}

export const GuidesPage: React.FC<GuidesPageProps> = ({ onNavigate }) => {
  useSEO({
    title: "Fluxlab Academy - Guides & Tutos pour Créateurs",
    description: "Apprenez à maîtriser votre setup audio, vidéo et streaming. Guides pratiques, comparatifs et tutoriels pour tous les niveaux.",
    image: ARTICLES[0]?.image // Use latest article image
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  // Sort articles by date (Newest first) - simplistic parsing assuming format "DD Mon YYYY" works or relying on mock order
  // NOTE: The mock data IDs are not chronological. Sorting manually to ensure "Top 5 Interfaces" (Jan 2025) is first.
  const sortedArticles = useMemo(() => {
    return [...ARTICLES].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);

  const heroArticle = sortedArticles[0];

  // Filtering Logic
  const filteredArticles = useMemo(() => {
    return sortedArticles.filter(article => {
      // Exclude Hero article ONLY if we are in "Default" mode (no search, no filter)
      // If searching/filtering, we might want to see it in the list if it matches.
      // But for layout stability, let's always exclude Hero from the Grid if it's the very first item.
      // Actually, if I filter "Video", and Hero is "Audio", I shouldn't see Hero?
      // Let's decide: Hero is ALWAYS visible at top. Grid shows matching results.
      // If sorting filter applies, the grid updates.

      const matchSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.intro.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === "Tous" || article.category === selectedCategory;
      const isHero = article.id === heroArticle.id;

      // If we have active filters/search, show ALL matches even if it's the hero (so user finds it).
      // If default view, hide hero from grid to avoid duplication.
      if (searchQuery || selectedCategory !== "Tous") {
        return matchSearch && matchCategory;
      }
      return !isHero;
    });
  }, [sortedArticles, searchQuery, selectedCategory, heroArticle]);

  // Extract unique categories
  const categories = ["Tous", ...Array.from(new Set(ARTICLES.map(a => a.category)))];

  return (
    <div className="min-h-screen bg-background text-foreground">


      {/* HERO GUIDES */}
      <section className="pt-32 pb-20 bg-secondary/30 border-b border-border">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
              Fluxlab Academy
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-serif">Guides & Tutoriels pour Créateurs.</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
              Des guides pratiques, des comparatifs honnêtes et des tutoriels techniques pour maîtriser votre matériel.
            </p>
          </div>

          {/* DYNAMIC FEATURED ARTICLE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-3xl overflow-hidden aspect-[21/9] group cursor-pointer shadow-2xl shadow-black/5"
            onClick={() => onNavigate('guide-article', heroArticle.slug)}
          >
            <img
              src={heroArticle.image}
              alt={heroArticle.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-3xl">
              <div className="flex items-center gap-3 mb-4 text-white/80 text-sm font-medium">
                <span className="bg-primary text-white px-2 py-0.5 rounded uppercase text-xs font-bold">À LA UNE</span>
                <span className="bg-white/20 backdrop-blur px-2 py-0.5 rounded uppercase text-xs font-bold">{heroArticle.category}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {heroArticle.readTime}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight font-serif">
                {heroArticle.title}
              </h2>
              <p className="text-lg text-white/80 mb-8 line-clamp-2 md:line-clamp-none font-light">
                {heroArticle.intro}
              </p>
              <Button variant="outline" size="lg" className="bg-white text-black hover:bg-white/90 border-white/50 shadow-lg font-bold">
                Lire l'article <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PARCOURS (Pathways) - Only show if no search filter to reduce noise when searching */}
      {(!searchQuery && selectedCategory === "Tous") && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6 max-w-[1200px]">
            <h3 className="text-2xl font-bold mb-10 flex items-center gap-2 font-serif">
              <Sparkles className="w-6 h-6 text-primary" />
              Quel est votre objectif ?
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {PATHWAYS.map((path) => (
                <motion.div
                  key={path.id}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => onNavigate('guide-path', path.slug)}
                  className="rounded-2xl border border-border bg-card overflow-hidden group cursor-pointer flex flex-col h-full shadow-sm hover:shadow-md"
                >
                  {/* Image Header */}
                  <div className="h-40 overflow-hidden relative">
                    <img
                      src={path.image}
                      alt={path.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-6">
                      <h4 className="text-xl font-bold text-white font-serif">{path.title}</h4>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-sm text-muted-foreground mb-6 flex-1 font-light leading-relaxed">
                      {path.subtitle}
                    </p>
                    <div className="flex items-center text-sm font-bold text-primary group-hover:translate-x-1 transition-transform mt-auto">
                      Voir le parcours <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ARTICLES GRID + FILTERS */}
      <section className="py-20 bg-[#F9F9F9] border-t border-border/50">
        <div className="container mx-auto px-6 max-w-[1200px]">

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

          {/* FILTERS PILLS */}
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

          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {filteredArticles.map((article, i) => (
                <motion.article
                  layout
                  key={article.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => onNavigate('guide-article', article.slug)}
                  className="group cursor-pointer flex flex-col h-full"
                >
                  <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-6 relative shadow-sm border border-border/50">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
                    Lire l'article <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-muted-foreground text-lg">Aucun article ne correspond à votre recherche.</p>
              <Button variant="ghost" className="mt-4" onClick={() => { setSearchQuery(""); setSelectedCategory("Tous"); }}>
                Réinitialiser les filtres
              </Button>
            </div>
          )}

        </div>
      </section>


    </div>
  );
};