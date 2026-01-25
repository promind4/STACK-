import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { StarRating } from './ui/StarRating';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useSEO } from './SEOHelper';
import { useProducts } from '../hooks/useProducts';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ExternalLink,
  SearchX,
  Star,
  Users,
  Info,
  Quote,
  XCircle,
  Loader2
} from 'lucide-react';

interface ProductPageProps {
  onBack: () => void;
  onNavigate?: (page: string, slug?: string) => void;
  slug?: string;
}

export const ProductPage: React.FC<ProductPageProps> = ({ onBack, slug, onNavigate }) => {
  const { products, loading, error } = useProducts();

  // State pour l'image sélectionnée dans la galerie
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const product = useMemo(() => {
    if (loading) return null;
    return products.find(p => p.slug === slug);
  }, [slug, products, loading]);

  // Reset selected image when product changes
  useEffect(() => {
    if (product) {
      setSelectedImage(product.image_url);
    }
  }, [product]);

  useSEO({
    title: product ? `${product.name} - Avis & Prix` : 'Produit Introuvable',
    description: product?.description || "Découvrez ce produit sur Stackera.",
    image: product?.image_url
  });

  const relatedProducts = useMemo(() => {
    if (loading) return [];
    return products.filter(p => p.id !== product?.id).slice(0, 3);
  }, [product, products, loading]);

  // Combine main image + gallery for the thumbnails list
  const allImages = useMemo(() => {
    if (!product) return [];
    const main = product.image_url;
    const gallery = product.gallery_images || [];
    // Avoid duplicates if main image is also in gallery
    return [main, ...gallery.filter(img => img !== main)];
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar onNavigate={onNavigate} />
        <div className="flex-1 flex flex-col items-center justify-center pt-20 pb-20 px-6 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-6" />
          <p className="text-muted-foreground">Chargement du produit...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar onNavigate={onNavigate} />
        <div className="flex-1 flex flex-col items-center justify-center pt-20 pb-20 px-6 text-center">
          <AlertTriangle className="w-10 h-10 text-destructive mb-6" />
          <h1 className="text-3xl font-bold mb-2">Erreur</h1>
          <p className="text-muted-foreground mb-8 max-w-md">{error}</p>
          <Button onClick={onBack}>Retourner au catalogue</Button>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar onNavigate={onNavigate} />
        <div className="flex-1 flex flex-col items-center justify-center pt-20 pb-20 px-6 text-center">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
            <SearchX className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Produit introuvable</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            Il semble que ce produit n'existe plus ou que le lien soit incorrect.
          </p>
          <Button onClick={onBack}>Retourner au catalogue</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onNavigate={onNavigate} />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6 max-w-[1200px]">

          {/* Breadcrumb */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <button onClick={onBack} className="group flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Retour au catalogue
            </button>
          </motion.div>

          {/* === BUY BOX === */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-start">

            {/* Colonne Gauche : Visuel & Galerie */}
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-7 flex flex-col gap-4">

              {/* Image Principale */}
              <div
                className="rounded-2xl border border-border/40 shadow-sm p-8 md:p-12 flex items-center justify-center aspect-[4/3] relative overflow-hidden group transition-colors"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 bg-secondary text-foreground text-xs font-mono rounded-full border border-border uppercase">
                    {product.brand}
                  </span>
                </div>
                <img
                  src={selectedImage || product.image_url}
                  alt={product.name}
                  className="w-full h-full object-contain transition-all duration-300 ease-out group-hover:scale-105"
                />
              </div>

              {/* Galerie Thumbnails (seulement si plus d'une image) */}
              {allImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-24 h-24 shrink-0 rounded-xl bg-white border p-2 overflow-hidden transition-all ${selectedImage === img
                        ? 'border-primary ring-2 ring-primary/20 shadow-md'
                        : 'border-border/50 hover:border-primary/50'
                        }`}
                    >
                      <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Colonne Droite : Infos & Offres */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-5 flex flex-col lg:sticky lg:top-32">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  {product.badge && <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide border ${product.badge.color}`}>{product.badge.text}</span>}
                  {product.isPromo && <span className="text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide bg-red-100 text-red-700 border border-red-200">Meilleur Prix</span>}

                  {/* Rating Badge */}
                  {(product.rating || 0) > 0 && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-amber-50 border border-amber-100">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span className="text-xs font-bold text-amber-700">{product.rating}</span>
                      <span className="text-[10px] text-amber-600/70">({(product.review_count || 0).toLocaleString()} avis)</span>
                    </div>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight leading-tight font-serif">{product.name}</h1>
                <p className="text-lg text-muted-foreground leading-relaxed font-light">{product.description}</p>
              </div>

              {/* LISTE DES OFFRES MARCHANDS */}
              <div id="offers" className="space-y-4 mb-8 scroll-mt-32">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Meilleures Offres Disponibles</h3>

                {product.offers && product.offers.length > 0 ? (
                  product.offers.sort((a, b) => a.price - b.price).map((offer, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-4 bg-white rounded-xl border shadow-sm transition-all hover:border-primary/50 ${idx === 0 ? 'border-primary/30 ring-1 ring-primary/5' : 'border-border'}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center p-2 overflow-hidden">
                          {offer.merchant_logo_url ? (
                            <img src={offer.merchant_logo_url} alt={offer.merchant_name} className="w-full h-full object-contain" />
                          ) : (
                            <span className="font-bold text-xs text-muted-foreground">{offer.merchant_name.substring(0, 2).toUpperCase()}</span>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-foreground block text-sm">{offer.merchant_name}</span>
                          <span className={`text-[10px] flex items-center gap-1 font-bold uppercase ${offer.in_stock ? 'text-green-600' : 'text-red-500'}`}>
                            {offer.in_stock ? <><CheckCircle2 className="w-3 h-3" /> En Stock</> : <><XCircle className="w-3 h-3" /> Épuisé</>}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block font-bold text-lg text-foreground">{offer.price} {offer.currency === 'EUR' ? '€' : offer.currency}</span>
                        <a
                          href={offer.affiliate_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center justify-center h-8 px-4 text-xs font-bold mt-1 rounded-md transition-all ${idx === 0 ? 'bg-primary text-white hover:bg-primary/90' : 'bg-secondary text-foreground hover:bg-border'}`}
                        >
                          Voir l'offre <ExternalLink className="w-3 h-3 ml-2" />
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-secondary/50 rounded-xl border border-dashed border-border text-center text-sm text-muted-foreground italic">
                    Aucune offre disponible pour le moment.
                  </div>
                )}
              </div>

              {product.category_id?.includes('mic') && (
                <div className="bg-[#E8DCC4]/50 rounded-2xl p-6 flex gap-4 shadow-sm border border-primary/10">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                    <AlertTriangle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm mb-1">Conseil d'expert Stackera</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Ce microphone nécessite une <strong>alimentation fantôme +48V</strong> pour fonctionner (ou un gain élevé via Cloudlifter pour le SM7B).
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* === SECTION : L'AVIS DE LA COMMUNAUTÉ === */}
          {product.reviews_summary && (
            <section className="mb-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white border border-border rounded-3xl overflow-hidden shadow-sm"
              >
                {/* Header : Note Globale */}
                <div className="bg-secondary/30 p-8 border-b border-border flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-2xl flex flex-col items-center justify-center border border-border shadow-sm">
                      <span className="text-2xl font-bold text-foreground">{product.rating || product.reviews_summary?.average_rating || 0}</span>
                      <span className="text-[10px] text-muted-foreground font-bold">/ 5</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold font-serif tracking-tight text-foreground">Ce qu'en pensent les créateurs</h2>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <Users className="w-4 h-4" /> Basé sur <strong>{(product.review_count || product.reviews_summary?.total_reviews || 0).toLocaleString()} avis</strong> analysés
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1" title={`${product.rating} / 5`}>
                    <StarRating rating={product.rating || product.reviews_summary?.average_rating || 0} size={20} />
                  </div>
                </div>

                {/* Corps : Pros & Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* ON AIME (PROS) */}
                  <div className="p-8 border-b md:border-b-0 md:border-r border-border bg-emerald-50/10">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-800 flex items-center gap-2 mb-6">
                      <CheckCircle2 className="w-5 h-5" /> On aime
                    </h3>
                    <ul className="space-y-4">
                      {product.reviews_summary.pros.map((pro, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-muted-foreground font-light leading-snug">
                          <span className="mt-1 w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* À SAVOIR (CONS) */}
                  <div className="p-8 bg-amber-50/10">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-amber-800 flex items-center gap-2 mb-6">
                      <Info className="w-5 h-5" /> À savoir
                    </h3>
                    <ul className="space-y-4">
                      {product.reviews_summary.cons.map((con, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-muted-foreground font-light leading-snug">
                          <span className="mt-1 w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </motion.div>
            </section>
          )}

          {/* === ECOSYSTEME === */}
          <section className="bg-secondary/30 -mx-6 px-6 py-20 lg:rounded-3xl lg:mx-0 lg:px-12 border-y lg:border border-border/30">
            <div className="mb-12 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4 font-serif">Complétez votre Stack</h2>
              <p className="text-muted-foreground font-light">D'autres créateurs ont souvent associé ces produits avec le <strong>{product.name}</strong>.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((related, idx) => (
                <div key={related.id} className="bg-white border border-border rounded-2xl p-6 hover:shadow-lg transition-all group">
                  <div className="aspect-square w-16 mb-4 bg-secondary/20 rounded-xl p-2"><img src={related.image_url} className="w-full h-full object-contain" alt="" /></div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{related.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 font-light line-clamp-2">{related.description}</p>
                  <div className="pt-4 border-t border-border/50 flex justify-between items-center"><span className="font-bold">{related.price}€</span><Button variant="ghost" size="sm">Découvrir</Button></div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* MOBILE STICKY ACTION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border p-4 pb-6 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            {product.isPromo && <span className="text-[10px] font-bold text-red-600 uppercase">Promo</span>}
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-lg text-foreground">{product.price}€</span>
              {product.brand && <span className="text-xs text-muted-foreground uppercase">{product.brand}</span>}
            </div>
          </div>
          <Button
            className="flex-1 shadow-lg shadow-primary/20"
            onClick={() => document.getElementById('offers')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Voir les offres
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};