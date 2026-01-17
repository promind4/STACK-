import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { 
  Clock, ArrowRight, Sparkles
} from 'lucide-react';
import { ARTICLES, PATHWAYS, getLatestArticles } from '../lib/data';

interface GuidesPageProps {
  onNavigate: (page: string, slug?: string) => void;
}

export const GuidesPage: React.FC<GuidesPageProps> = ({ onNavigate }) => {
  const latestArticles = getLatestArticles();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onNavigate={(page) => onNavigate(page)} />

      {/* HERO GUIDES */}
      <section className="pt-32 pb-20 bg-secondary/30 border-b border-border">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
              Stackera Academy
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-serif">Devenez un meilleur créateur.</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
              Des guides pratiques, des comparatifs honnêtes et des tutoriels techniques pour maîtriser votre matériel.
            </p>
          </div>

          {/* FEATURED ARTICLE (Static for now, could be dynamic) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-3xl overflow-hidden aspect-[21/9] group cursor-pointer shadow-2xl shadow-black/5"
            onClick={() => onNavigate('guide-article', 'insonorisation')}
          >
            <img 
              src="https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&q=80&w=1600" 
              alt="Studio Setup" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-3xl">
              <div className="flex items-center gap-3 mb-4 text-white/80 text-sm font-medium">
                <span className="bg-primary text-white px-2 py-0.5 rounded">À LA UNE</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 10 min de lecture</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight font-serif">
                Comment construire un Home Studio professionnel dans 10m² ?
              </h2>
              <p className="text-lg text-white/80 mb-8 line-clamp-2 md:line-clamp-none font-light">
                Le guide complet de l'agencement, du traitement acoustique et du choix du matériel pour les petits espaces.
              </p>
              <Button size="lg" className="bg-white text-black hover:bg-white/90 border-none">
                Lire le guide complet
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PARCOURS (Pathways) */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <h3 className="text-2xl font-bold mb-10 flex items-center gap-2 font-serif">
            <Sparkles className="w-6 h-6 text-primary" />
            Quel est votre objectif ?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PATHWAYS.map((path, idx) => (
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

      {/* ARTICLES GRID */}
      <section className="py-20 bg-[#F9F9F9] border-t border-border/50">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <h3 className="text-2xl font-bold mb-10 font-serif">Articles Récents</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {ARTICLES.map((article, i) => (
              <motion.article 
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
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
          
           <div className="mt-16 text-center">
            <Button variant="outline" size="lg">
              Voir tous les articles
            </Button>
          </div>

        </div>
      </section>

      <Footer onNavigate={(page) => onNavigate(page)} />
    </div>
  );
};