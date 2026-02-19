import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { StarRating } from './ui/StarRating';

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
  Loader2,
  ChevronDown
} from 'lucide-react';

interface ProductPageProps {
  onBack: () => void;
  onNavigate?: (page: string, slug?: string) => void;
  slug?: string;
}

// Utility: strip HTML tags for plain text display
const stripHtml = (html: string): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
};

// Complementary category mapping (UUID-based from Supabase)
// Key = category_id of current product → Value = array of complementary category_ids
const COMPLEMENTARY_CATEGORIES: Record<string, string[]> = {
  // Micros Dynamiques → Cartes Son, Préamplis, Casques Studio, Bras articulés, Câble XLR
  '3339b393-34ce-4144-bc71-a7655e628d2d': ['8ce3aa33-cef8-45ee-ad31-8290f685597e', 'f5d04d21-4999-419a-916b-eb5d5db71975', 'e53b8f8a-ab68-4ede-9f53-d892bf785ff6', '60d48356-1a67-415e-8e47-cda221d4a8d5', 'b99cc6bc-39c6-4236-be26-708456b06f97'],
  // Micros Condensateurs → Cartes Son, Préamplis, Casques Studio, Traitement acoustique
  '43d5be4c-a70b-4f24-b7b1-402422c17937': ['8ce3aa33-cef8-45ee-ad31-8290f685597e', 'f5d04d21-4999-419a-916b-eb5d5db71975', 'e53b8f8a-ab68-4ede-9f53-d892bf785ff6', '40b8f65e-df8b-4c85-a6e0-5e4b986d7235'],
  // Micros USB → Casques Studio, Bras articulés, Enceintes Monitoring
  '9db1b605-feb6-44ee-aee5-982a2bdbbe3a': ['e53b8f8a-ab68-4ede-9f53-d892bf785ff6', '60d48356-1a67-415e-8e47-cda221d4a8d5', '35dcf61b-1b56-4635-a3e9-7bba7f165409'],
  // Micros Shotgun → Hybrides, Casques Studio, Bras articulés
  'de19d5b6-0cf5-4613-ad7c-72c999dcbfbb': ['0bf0a370-3c0c-486e-8e21-05a79cc942a4', 'e53b8f8a-ab68-4ede-9f53-d892bf785ff6', '60d48356-1a67-415e-8e47-cda221d4a8d5'],
  // Cartes Son → Micros Dynamiques, Micros Condensateurs, Casques Studio, Enceintes
  '8ce3aa33-cef8-45ee-ad31-8290f685597e': ['3339b393-34ce-4144-bc71-a7655e628d2d', '43d5be4c-a70b-4f24-b7b1-402422c17937', 'e53b8f8a-ab68-4ede-9f53-d892bf785ff6', '35dcf61b-1b56-4635-a3e9-7bba7f165409'],
  // Préamplis → Micros Dynamiques, Micros Condensateurs, Cartes Son
  'f5d04d21-4999-419a-916b-eb5d5db71975': ['3339b393-34ce-4144-bc71-a7655e628d2d', '43d5be4c-a70b-4f24-b7b1-402422c17937', '8ce3aa33-cef8-45ee-ad31-8290f685597e'],
  // Casques Studio → Cartes Son, Micros Dynamiques, Enceintes Monitoring
  'e53b8f8a-ab68-4ede-9f53-d892bf785ff6': ['8ce3aa33-cef8-45ee-ad31-8290f685597e', '3339b393-34ce-4144-bc71-a7655e628d2d', '35dcf61b-1b56-4635-a3e9-7bba7f165409'],
  // Enceintes Monitoring → Cartes Son, Casques Studio, Traitement acoustique
  '35dcf61b-1b56-4635-a3e9-7bba7f165409': ['8ce3aa33-cef8-45ee-ad31-8290f685597e', 'e53b8f8a-ab68-4ede-9f53-d892bf785ff6', '40b8f65e-df8b-4c85-a6e0-5e4b986d7235'],
  // Hybrides (Mirrorless) → Objectifs (Grand Angle, Focale Fixe, Zoom), Éclairage (Keylight, Softbox)
  '0bf0a370-3c0c-486e-8e21-05a79cc942a4': ['8a672072-2181-4609-b552-a996d3e005c5', '1f304dde-8d58-4fee-a655-e6d604ad2c35', '9a197706-e267-4c45-9cc0-647b7f451dff', '61eb6e7f-20e8-4a2c-bf66-9fc9ba6ee6aa', '7453b556-3581-4f49-bc18-762df4753870'],
  // Grand Angle → Hybrides, Focale Fixe, Zoom Polyvalent, Éclairage
  '8a672072-2181-4609-b552-a996d3e005c5': ['0bf0a370-3c0c-486e-8e21-05a79cc942a4', '1f304dde-8d58-4fee-a655-e6d604ad2c35', '9a197706-e267-4c45-9cc0-647b7f451dff', '61eb6e7f-20e8-4a2c-bf66-9fc9ba6ee6aa'],
  // Focale Fixe → Hybrides, Grand Angle, Zoom, Éclairage
  '1f304dde-8d58-4fee-a655-e6d604ad2c35': ['0bf0a370-3c0c-486e-8e21-05a79cc942a4', '8a672072-2181-4609-b552-a996d3e005c5', '9a197706-e267-4c45-9cc0-647b7f451dff', '61eb6e7f-20e8-4a2c-bf66-9fc9ba6ee6aa'],
  // Zoom Polyvalent → Hybrides, Focale Fixe, Grand Angle, Éclairage
  '9a197706-e267-4c45-9cc0-647b7f451dff': ['0bf0a370-3c0c-486e-8e21-05a79cc942a4', '1f304dde-8d58-4fee-a655-e6d604ad2c35', '8a672072-2181-4609-b552-a996d3e005c5', '61eb6e7f-20e8-4a2c-bf66-9fc9ba6ee6aa'],
  // Keylight → Hybrides, Softbox, RGB
  '61eb6e7f-20e8-4a2c-bf66-9fc9ba6ee6aa': ['0bf0a370-3c0c-486e-8e21-05a79cc942a4', '7453b556-3581-4f49-bc18-762df4753870', '36351754-3173-412a-b776-e27ae31dcd08'],
  // Softbox → Hybrides, Keylight, RGB
  '7453b556-3581-4f49-bc18-762df4753870': ['0bf0a370-3c0c-486e-8e21-05a79cc942a4', '61eb6e7f-20e8-4a2c-bf66-9fc9ba6ee6aa', '36351754-3173-412a-b776-e27ae31dcd08'],
  // RGB → Keylight, Softbox, Stream Deck
  '36351754-3173-412a-b776-e27ae31dcd08': ['61eb6e7f-20e8-4a2c-bf66-9fc9ba6ee6aa', '7453b556-3581-4f49-bc18-762df4753870', 'b1267a7e-104f-4da8-9f0a-d7ca34b0257d'],
  // Stream Deck → Hybrides, Cartes d'acquisition, Fonds Verts
  'b1267a7e-104f-4da8-9f0a-d7ca34b0257d': ['0bf0a370-3c0c-486e-8e21-05a79cc942a4', 'a3d15265-7395-4059-ac4b-7ea8cf1f7631', '71d48344-3dee-46f7-bcf8-f27745279301'],
  // Bras articulés → Micros Dynamiques, Micros Condensateurs, Micros USB
  '60d48356-1a67-415e-8e47-cda221d4a8d5': ['3339b393-34ce-4144-bc71-a7655e628d2d', '43d5be4c-a70b-4f24-b7b1-402422c17937', '9db1b605-feb6-44ee-aee5-982a2bdbbe3a'],
  // Traitement acoustique → Micros Condensateurs, Enceintes, Cartes Son
  '40b8f65e-df8b-4c85-a6e0-5e4b986d7235': ['43d5be4c-a70b-4f24-b7b1-402422c17937', '35dcf61b-1b56-4635-a3e9-7bba7f165409', '8ce3aa33-cef8-45ee-ad31-8290f685597e'],
};

export const ProductPage: React.FC<ProductPageProps> = ({ onBack, slug, onNavigate }) => {
  const { products, loading, error } = useProducts();

  // State pour l'image sélectionnée dans la galerie
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [descNeedsTruncation, setDescNeedsTruncation] = useState(false);
  const descRef = useRef<HTMLDivElement>(null);

  const product = useMemo(() => {
    if (loading) return null;
    return products.find(p => p.slug === slug);
  }, [slug, products, loading]);

  // Reset selected image and description state when product changes
  useEffect(() => {
    if (product) {
      setSelectedImage(product.image_url);
      setIsDescExpanded(false);
    }
  }, [product]);

  // Check if description needs truncation
  useEffect(() => {
    if (descRef.current) {
      setDescNeedsTruncation(descRef.current.scrollHeight > 320);
    }
  }, [product?.description]);

  // --- SEO & SCHEMA.ORG ---
  const canonicalUrl = product ? `https://fluxlab.fr/produit/${product.slug}` : 'https://fluxlab.fr';

  const productSchema = product ? {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.image_url,
    "description": product.description ? stripHtml(product.description).substring(0, 160) : "",
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Generique"
    },
    "sku": product.id,
    "offers": {
      "@type": "AggregateOffer",
      "url": canonicalUrl,
      "priceCurrency": "EUR",
      "lowPrice": product.price,
      "highPrice": product.price, // Si range, adapter
      "offerCount": product.offers?.length || 1,
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": (product.rating || 0) > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.review_count || 1,
      "bestRating": "5",
      "worstRating": "1"
    } : undefined
  } : undefined;

  useSEO({
    title: product ? `${product.name} - Avis & Prix` : 'Produit Introuvable',
    description: product ? stripHtml(product.description || "Découvrez ce produit sur Fluxlab.") : "Découvrez ce produit sur Fluxlab.",
    image: product?.image_url,
    canonical: canonicalUrl,
    jsonLd: productSchema
  });

  const relatedProducts = useMemo(() => {
    if (loading || !product) return [];
    const complementaryIds = COMPLEMENTARY_CATEGORIES[product.category_id] || [];
    // 1. Complementary products from mapped categories
    const complementary = products.filter(p => p.id !== product.id && complementaryIds.includes(p.category_id));
    if (complementary.length >= 3) return complementary.slice(0, 3);
    // 2. Fallback: same category products
    const sameCategory = products.filter(p => p.id !== product.id && p.category_id === product.category_id);
    const pool = [...complementary, ...sameCategory];
    if (pool.length >= 3) return pool.slice(0, 3);
    // 3. Final fallback: any other products
    const others = products.filter(p => p.id !== product.id && !complementaryIds.includes(p.category_id) && p.category_id !== product.category_id);
    return [...pool, ...others].slice(0, 3);
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
        <div className="flex-1 flex flex-col items-center justify-center pt-20 pb-20 px-6 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-6" />
          <p className="text-muted-foreground">Chargement du produit...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center pt-20 pb-20 px-6 text-center">
          <AlertTriangle className="w-10 h-10 text-destructive mb-6" />
          <h1 className="text-3xl font-bold mb-2">Erreur</h1>
          <p className="text-muted-foreground mb-8 max-w-md">{error}</p>
          <Button onClick={onBack}>Retourner au catalogue</Button>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">


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
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-7 flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">

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
                  loading="eager"
                  fetchPriority="high"
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
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-5 flex flex-col">
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
                <div className="relative">
                  <div
                    ref={descRef}
                    className={`text-base text-muted-foreground leading-relaxed font-light overflow-hidden transition-all duration-300 [&_h2]:text-base [&_h2]:font-bold [&_h2]:uppercase [&_h2]:mt-5 [&_h2]:mb-1.5 [&_h2]:text-foreground [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1.5 [&_h3]:text-foreground [&_ul]:list-none [&_ul]:pl-0 [&_ul]:my-2 [&_li]:mb-1 [&_p]:mb-3 [&_strong]:text-foreground [&_strong]:font-medium ${!isDescExpanded && descNeedsTruncation ? 'max-h-[320px]' : ''}`}
                    dangerouslySetInnerHTML={{ __html: product.description || '' }}
                  />
                  {/* Gradient fade + Voir plus */}
                  {descNeedsTruncation && (
                    <div className={`${!isDescExpanded ? 'absolute bottom-0 left-0 right-0 pt-16 bg-gradient-to-t from-background to-transparent' : 'mt-2'}`}>
                      <button
                        onClick={() => setIsDescExpanded(!isDescExpanded)}
                        className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors mx-auto"
                      >
                        {isDescExpanded ? 'Voir moins' : 'Voir plus'}
                        <ChevronDown className={`w-4 h-4 transition-transform ${isDescExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  )}
                </div>
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
                        <span className="block font-bold text-lg text-foreground">≈ {offer.price} {offer.currency === 'EUR' ? '€' : offer.currency}</span>
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
                    <h4 className="font-bold text-foreground text-sm mb-1">Conseil d'expert Fluxlab</h4>
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
                  <div className="aspect-square w-16 mb-4 bg-secondary/20 rounded-xl p-2"><img src={related.image_url} className="w-full h-full object-contain" alt={related.name} loading="lazy" /></div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{related.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 font-light line-clamp-2">{stripHtml(related.description)}</p>
                  <div className="pt-4 border-t border-border/50 flex justify-between items-center"><span className="font-bold">≈ {related.price}€</span><Button variant="ghost" size="sm" onClick={() => onNavigate && onNavigate('product', related.slug)}>Découvrir</Button></div>
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
              <span className="font-bold text-lg text-foreground">≈ {product.price}€</span>
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


    </div>
  );
};