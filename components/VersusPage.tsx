import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Button } from './ui/Button';
import { useSEO } from './SEOHelper';
import {
  Zap,
  ChevronLeft,
  ArrowRight,
  ShoppingBag,
  CheckCircle2,
  SearchX,
  MessageSquareQuote
} from 'lucide-react';
import { useProducts } from '../hooks/useProducts';

interface VersusPageProps {
  onNavigate: (page: string, slug?: string) => void;
  slug?: string; // Format attendu: "product-a-vs-product-b"
}
export const VersusPage: React.FC<VersusPageProps> = ({ onNavigate, slug }) => {
  const { products, loading, error } = useProducts();

  // --- DATA PARSING ---
  // On décompose le slug pour trouver les deux produits
  const [productA, productB] = useMemo(() => {
    if (!slug || loading) return [null, null];
    const parts = slug.split('-vs-');
    if (parts.length !== 2) return [null, null];

    const pA = products.find(p => p.slug === parts[0]);
    const pB = products.find(p => p.slug === parts[1]);

    return [pA, pB];
  }, [slug, products, loading]);

  // SEO Dynamique
  useSEO({
    title: productA && productB ? `${productA.name} vs ${productB.name} : Le Duel 2026` : "Comparatif Matériel",
    description: `Quel est le meilleur choix entre le ${productA?.name} et le ${productB?.name} ? Découvrez notre analyse comparative complète.`
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar onNavigate={onNavigate} />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          {/* Simple loader placeholder */}
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Préparation du duel...</p>
        </div>
        <Footer onNavigate={onNavigate} />
      </div>
    );
  }

  // --- RENDU CAS 404 ---
  if (!productA || !productB) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar onNavigate={onNavigate} />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <SearchX className="w-16 h-16 text-muted-foreground mb-4" />
          <h1 className="text-3xl font-bold mb-2">Duel introuvable</h1>
          <p className="text-muted-foreground mb-8">Nous n'avons pas pu charger les données de ce comparatif.</p>
          <Button onClick={() => onNavigate('category')}>Retour au catalogue</Button>
        </div>
        <Footer onNavigate={onNavigate} />
      </div>
    );
  }

  // --- MOCK SPECS (Dans une vraie app, cela viendrait du JSONB 'specs' en base) ---
  const specs = [
    { label: 'Prix', valA: `${productA.price}€`, valB: `${productB.price}€`, winner: productA.price < productB.price ? 'A' : 'B' },
    { label: 'Marque', valA: productA.brand, valB: productB.brand, winner: null },
    { label: 'Type', valA: 'Dynamique XLR', valB: 'Condensateur XLR/USB', winner: null },
    { label: 'Usage', valA: 'Broadcast / Voix', valB: 'Détails / Studio', winner: null },
    { label: 'Note Clients', valA: `${productA.rating}/5`, valB: `${productB.rating}/5`, winner: (productA.rating || 0) > (productB.rating || 0) ? 'A' : 'B' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">

      {/* 1. HERO : LE DUEL */}
      <section className="pt-32 pb-20 relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background border-b border-border">
        <div className="container mx-auto px-6 max-w-[1200px] relative z-10">

          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onClick={() => onNavigate('category')}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-12"
          >
            <ChevronLeft className="w-4 h-4" /> Retour au catalogue
          </motion.button>

          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
              Le Duel • Comparatif Expert
            </span>
            <h1 className="text-4xl md:text-7xl font-bold tracking-tighter mb-4 font-serif">
              {productA.name} <span className="text-primary/40 italic">vs</span> {productB.name}
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto font-light leading-relaxed">
              Lequel choisir pour votre setup créatif en 2026 ? Performance, prix et synergie passés au crible.
            </p>
          </div>

          {/* VISUEL CÔTE À CÔTE */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">

            {/* Eclair VS Central */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(211,178,123,0.5)] border-4 border-background"
              >
                <Zap className="w-8 h-8 text-white fill-current" />
              </motion.div>
            </div>

            {/* Produit A */}
            <motion.div
              initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
              className="w-full md:w-[45%] bg-white rounded-3xl border border-border p-8 shadow-sm flex flex-col items-center group cursor-pointer hover:border-primary/50 transition-all"
              onClick={() => onNavigate('product', productA.slug)}
            >
              <div className="aspect-square w-48 mb-6">
                <img src={productA.image_url} alt={productA.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-xl font-bold mb-1">{productA.name}</h3>
              <span className="text-sm text-primary font-bold">{productA.price}€</span>
            </motion.div>

            {/* Produit B */}
            <motion.div
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
              className="w-full md:w-[45%] bg-white rounded-3xl border border-border p-8 shadow-sm flex flex-col items-center group cursor-pointer hover:border-primary/50 transition-all"
              onClick={() => onNavigate('product', productB.slug)}
            >
              <div className="aspect-square w-48 mb-6">
                <img src={productB.image_url} alt={productB.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-xl font-bold mb-1">{productB.name}</h3>
              <span className="text-sm text-primary font-bold">{productB.price}€</span>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. TABLEAU COMPARATIF */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-[900px]">
          <h2 className="text-2xl font-bold mb-12 text-center font-serif">Comparaison Technique</h2>

          <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-secondary/30">
                  <th className="py-6 px-6 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground w-1/3 border-b border-border">Caractéristique</th>
                  <th className="py-6 px-6 text-center text-sm font-bold border-b border-border">{productA.name}</th>
                  <th className="py-6 px-6 text-center text-sm font-bold border-b border-border">{productB.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {specs.map((spec, idx) => (
                  <tr key={idx} className="hover:bg-secondary/10 transition-colors">
                    <td className="py-5 px-6 font-medium text-sm text-muted-foreground">{spec.label}</td>
                    <td className={`py-5 px-6 text-center text-sm ${spec.winner === 'A' ? 'font-bold text-primary' : 'text-foreground'}`}>
                      <div className="flex items-center justify-center gap-2">
                        {spec.winner === 'A' && <CheckCircle2 className="w-4 h-4" />}
                        {spec.valA}
                      </div>
                    </td>
                    <td className={`py-5 px-6 text-center text-sm ${spec.winner === 'B' ? 'font-bold text-primary' : 'text-foreground'}`}>
                      <div className="flex items-center justify-center gap-2">
                        {spec.winner === 'B' && <CheckCircle2 className="w-4 h-4" />}
                        {spec.valB}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. VERDICT DE L'EXPERT */}
      <section className="py-24 bg-secondary/20 border-y border-border">
        <div className="container mx-auto px-6 max-w-[1000px]">
          <div className="bg-white rounded-3xl border border-border p-8 md:p-12 shadow-xl relative overflow-hidden">
            {/* Filigrane Logo */}
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Zap className="w-64 h-64 text-primary" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                <MessageSquareQuote className="w-10 h-10 text-primary" />
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-6 font-serif tracking-tight">Le Verdict de l'Atelier Stackera</h2>
                <div className="prose prose-stone prose-lg max-w-none text-muted-foreground font-light leading-relaxed space-y-6">
                  <p>
                    Le duel entre le <strong>{productA.brand} {productA.name}</strong> et le <strong>{productB.brand} {productB.name}</strong> n'est pas qu'une question de prix, mais de philosophie de setup.
                  </p>
                  <p>
                    Si votre environnement n'est pas traité acoustiquement et que vous cherchez ce grain "Radio" si particulier, le <strong>{productA.name}</strong> reste la référence absolue malgré son besoin en gain élevé.
                  </p>
                  <p>
                    À l'inverse, si vous privilégiez la polyvalence (USB/XLR) et un niveau de détail chirurgical, le <strong>{productB.name}</strong> l'emporte, surtout pour les setups nomades ou minimalistes.
                  </p>
                  <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl mt-8">
                    <h4 className="font-bold text-foreground text-base mb-2">Notre Recommandation :</h4>
                    <p className="text-sm font-medium text-foreground">
                      Pour un premier studio "Future-Proof" : <span className="text-primary underline decoration-2 underline-offset-4">{productB.name}</span>. <br />
                      Pour une voix signature iconique : <span className="text-primary underline decoration-2 underline-offset-4">{productA.name}</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. STICKY ACTION BAR (Mobile & Desktop) */}
      <div className="fixed bottom-0 left-0 w-full bg-background/80 backdrop-blur-xl border-t border-border p-4 md:p-6 z-40 shadow-2xl">
        <div className="container mx-auto max-w-[1200px] flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="hidden lg:block">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">L'un de ces deux produits vous tente ?</p>
            <h4 className="font-bold text-lg">Finalisez votre Stack</h4>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none border-border group"
              onClick={() => window.open(`https://www.amazon.fr/s?k=${encodeURIComponent(productA.name)}`, '_blank')}
            >
              Acheter {productA.name} <ArrowRight className="w-4 h-4 ml-2 opacity-50 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="primary"
              className="flex-1 sm:flex-none group"
              onClick={() => window.open(`https://www.amazon.fr/s?k=${encodeURIComponent(productB.name)}`, '_blank')}
            >
              Acheter {productB.name} <ShoppingBag className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
};