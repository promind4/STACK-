import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { CheckCircle2, Mic, Video, Radio, Sparkles, ArrowRight, LayoutGrid } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (page: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-20 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] left-[20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 max-w-[1600px] text-center relative z-10">

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6"
        >
          Votre Setup. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-500 to-primary animate-gradient bg-[length:200%_auto]">
            Juste plus Intelligent.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Trouvez le meilleur prix pour votre matériel. Nous analysons la compatibilité et vous alertons sur ce qu'il manque.
        </motion.p>

        {/* ACTION BUTTONS (Replacement for Search Bar) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 z-20"
        >
          {/* Primary CTA - Configurator */}
          <Button
            variant="primary"
            size="lg"
            className="rounded-full px-8 h-14 text-base shadow-xl shadow-primary/20 hover:shadow-primary/30 w-full sm:w-auto transition-all hover:scale-105"
            onClick={() => onNavigate('configurator')}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Trouver mon Setup
          </Button>

          {/* Secondary CTA - Catalog */}
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 h-14 text-base bg-white/50 backdrop-blur border-border hover:bg-white w-full sm:w-auto group"
            onClick={() => onNavigate('category')}
          >
            <LayoutGrid className="w-5 h-5 mr-2 text-muted-foreground group-hover:text-foreground transition-colors" />
            Explorer le catalogue
          </Button>
        </motion.div>

        {/* Navigation Pills (Quick Links) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-16"
        >
          <button
            onClick={() => onNavigate('category')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wide hover:bg-amber-100 hover:scale-105 transition-all cursor-pointer"
          >
            <Mic className="w-3 h-3" />
            Audio
          </button>
          <button
            onClick={() => onNavigate('category')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-50 border border-stone-100 text-stone-900 text-xs font-bold uppercase tracking-wide hover:bg-stone-100 hover:scale-105 transition-all cursor-pointer"
          >
            <Video className="w-3 h-3" />
            Vidéo
          </button>
          <button
            onClick={() => onNavigate('category')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border border-rose-100 text-rose-900 text-xs font-bold uppercase tracking-wide hover:bg-rose-100 hover:scale-105 transition-all cursor-pointer"
          >
            <Radio className="w-3 h-3" />
            Streaming
          </button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-12 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span>Comparateur Multi-Boutiques</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span>Compatibilité Vérifiée</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};