import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ChevronLeft, Clock, Calendar, User, ShoppingBag, ArrowRight } from 'lucide-react';
import { getArticleBySlug } from '../lib/data';

interface GuideArticlePageProps {
  onNavigate: (page: string, slug?: string) => void;
  slug?: string;
}

export const GuideArticlePage: React.FC<GuideArticlePageProps> = ({ onNavigate, slug }) => {
  const article = getArticleBySlug(slug || '');

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
      <Navbar onNavigate={(page) => onNavigate(page)} />

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
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <User className="w-4 h-4 text-foreground" />
                </div>
                <div className="text-sm">
                  <p className="font-bold text-foreground">{article.author}</p>
                </div>
              </div>
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
              
              {/* Le contenu serait injecté via dangerouslySetInnerHTML dans une vraie app, ici on simule avec un composant children ou direct */}
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

                {article.relatedProducts.length > 0 ? (
                  <ul className="space-y-4">
                    {article.relatedProducts.map((productName, idx) => (
                      <li key={idx} className="bg-white p-3 rounded-xl border border-border flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-colors" onClick={() => onNavigate('product')}>
                        <div className="flex items-center gap-3">
                           {/* Placeholder image produit */}
                           <div className="w-10 h-10 bg-secondary rounded-lg flex-shrink-0" />
                           <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{productName}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Aucun produit spécifique mentionné.</p>
                )}
                
                <div className="mt-6 pt-6 border-t border-border/50 text-center">
                  <Button variant="primary" className="w-full">
                    Voir la sélection complète
                  </Button>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>

      <Footer onNavigate={(page) => onNavigate(page)} />
    </div>
  );
};