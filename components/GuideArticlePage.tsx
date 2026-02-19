import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';

import { ChevronLeft, Clock, Calendar, User, ShoppingBag, ArrowRight } from 'lucide-react';
import { getArticleBySlug } from '../lib/data';
import { supabase } from '../lib/supabaseClient';
import { Product } from '../types/database';
import { transformProduct } from '../lib/transformers';
import { useSEO } from './SEOHelper';

interface GuideArticlePageProps {
  onNavigate: (page: string, slug?: string) => void;
  slug?: string;
}

export const GuideArticlePage: React.FC<GuideArticlePageProps> = ({ onNavigate, slug }) => {
  const article = getArticleBySlug(slug || '');
  const [relatedItems, setRelatedItems] = useState<Product[]>([]);

  // --- SEO & SCHEMA.ORG ---
  const canonicalUrl = article ? `https://fluxlab.fr/guide/${article.slug}` : 'https://fluxlab.fr/guides';

  const articleSchema = article ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "image": [article.image],
    "datePublished": new Date(article.date).toISOString(), // Attention au format date "18 Jan 2025" -> il faudrait parser, mais pour l'instant ISO suffira si valide ou string
    "dateModified": new Date(article.date).toISOString(),
    "author": [{
      "@type": "Person",
      "name": article.author,
      "url": "https://fluxlab.fr/a-propos"
    }],
    "publisher": {
      "@type": "Organization",
      "name": "Fluxlab",
      "logo": {
        "@type": "ImageObject",
        "url": "https://fluxlab.fr/branding/logo.png" // Assurez-vous d'avoir ce logo
      }
    },
    "description": article.intro
  } : undefined;

  useSEO({
    title: article ? article.title : 'Guide introuvable',
    description: article ? article.intro : 'Ce guide n\'existe pas ou a été déplacé.',
    image: article?.image,
    canonical: canonicalUrl,
    jsonLd: articleSchema
  });

  useEffect(() => {
    const fetchRelated = async () => {
      if (article?.relatedProducts && article.relatedProducts.length > 0) {
        const { data } = await supabase
          .from('products')
          .select('*, product_offers(*)')
          .in('slug', article.relatedProducts);

        if (data) {
          const items = (data as any[]).map(p => transformProduct(p));
          setRelatedItems(items);
        }
      } else {
        setRelatedItems([]);
      }
    };

    fetchRelated();
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404 - Article introuvable</h1>
          <Button onClick={() => onNavigate('guides')}>Retour aux guides</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">


      {/* HEADER ARTICLE */}
      <header className="pt-32 pb-16 relative">
        <div className="container mx-auto px-6 max-w-[1000px]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => onNavigate('guides')}
              className="group flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Retour aux guides
            </button>

            <div className="flex items-center gap-3 text-sm font-medium text-primary mb-4">
              <span className="uppercase tracking-widest">{article.category}</span>
              <span className="w-1 h-1 bg-primary rounded-full" />
              <span className="text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-8 font-serif leading-tight">
              {article.title}
            </h1>

            <div className="flex items-center gap-6 border-y border-border py-4">
              {/* Author removed as requested */}
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="w-4 h-4" /> {article.date}
              </div>
            </div>
          </motion.div>
        </div>

        {/* COVER IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="container mx-auto px-6 max-w-[1200px]"
        >
          <div className="aspect-[21/9] rounded-3xl overflow-hidden bg-secondary">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>
        </motion.div>
      </header>

      {/* CONTENT LAYOUT */}
      <div className="container mx-auto px-6 max-w-[1200px] pb-24">
        <div className="flex flex-col lg:flex-row gap-16">

          {/* MAIN TEXT */}
          <main className="lg:w-2/3">
            <div className="prose prose-stone prose-lg max-w-none 
              prose-headings:font-serif prose-headings:font-bold prose-headings:text-foreground
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:font-light
              prose-strong:text-foreground prose-strong:font-bold
              prose-li:text-muted-foreground
            ">
              <p className="lead text-xl text-foreground font-medium mb-8 border-l-4 border-primary pl-4 italic">
                {article.intro}
              </p>

              {typeof article.content === 'string' ? (
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              ) : (
                article.content
              )}
            </div>
          </main>

          {/* SIDEBAR (Sticky) */}
          <aside className="lg:w-1/3 space-y-8">
            <div className="sticky top-28">
              <div className="bg-[#F9F9F9] border border-border rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg font-serif">Dans cet article</h3>
                </div>

                {relatedItems.length > 0 ? (
                  <ul className="space-y-4">
                    {relatedItems.map((product) => (
                      <li
                        key={product.id}
                        className="bg-white p-3 rounded-xl border border-border flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-colors shadow-sm"
                        onClick={() => onNavigate('product', product.slug)}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-12 h-12 bg-white border border-border/50 rounded-lg flex-shrink-0 p-1 flex items-center justify-center">
                            <img src={product.image_url} className="max-w-full max-h-full object-contain mix-blend-multiply" alt={product.name} />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">{product.brand}</span>
                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">{product.name}</span>
                            <span className="text-xs font-bold text-foreground">
                              {product.price > 0 ? `≈ ${product.price}€` : 'Voir prix'}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform flex-shrink-0" />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Aucun produit spécifique mentionné.</p>
                )}

                <div className="mt-6 pt-6 border-t border-border/50 text-center">
                  <Button variant="primary" className="w-full" onClick={() => onNavigate('category', article.relatedCategorySlug)}>
                    Voir la sélection complète
                  </Button>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>


    </div>
  );
};