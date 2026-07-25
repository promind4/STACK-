'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/database';
import { ProductCard } from '@/components/ui/ProductCard';
import { cn } from '@/lib/utils';

/* ─── GUIDE MAPPING : slug catégorie → slug article ─────── */
const GUIDE_MAP: Record<string, string> = {
  // Audio général
  'audio':                    'meilleur-micro-podcast-2026',
  // Micros
  'micros-dynamiques':        'shure-sm7b-vs-rode-podmic',
  'micros-condensateurs':     'meilleur-micro-podcast-2026',
  'micros-usb':               'meilleur-micro-usb-pas-cher-2026',
  'micros-shotgun':           'setup-youtube-debutant-2026',
  // Interfaces & préamplis
  'cartes-son':               'top-5-interfaces',
  'preamplis':                'scarlett-2i2-4th-gen-shure-sm7b-cloudlifter',
  // Casques & enceintes
  'casques-studio':           'meilleur-casque-studio-home-studio-2026',
  'enceintes':                'meilleur-casque-studio-home-studio-2026',
  // Accessoires audio
  'bras-articules':           'enregistrer-podcast-deux-personnes-setup',
  'cable-xlr':                'xlr-vs-usb',
  'traitement-acoustique':    'insonorisation',
  // Vidéo général
  'video':                    'setup-youtube-debutant-2026',
  // Caméras
  'hybrides-mirrorless':      'setup-youtube-debutant-2026',
  'webcams-pro':              'setup-streaming-debutant-2026',
  'action-cams':              'sony-zve10-surchauffe-stream-solutions',
  // Éclairage
  'keylight':                 'eclairage-cinematique',
  'softbox':                  'eclairage-cinematique',
  'rgb-ambiance':             'eclairage-cinematique',
  // Optiques
  'grand-angle':              'setup-youtube-debutant-2026',
  'zoom-polyvalent':          'setup-youtube-debutant-2026',
  // Streaming général
  'streaming':                'setup-streaming-debutant-2026',
  // Accessoires streaming
  'fonds-verts':              'fond-flou-stream-petite-chambre',
  'teleprompteurs':           'setup-streaming-debutant-2026',
  'cable-management':         'setup-streaming-debutant-2026',
  'stream-deck':              'elgato-stream-deck-guide-complet',
};
const DEFAULT_GUIDE = 'meilleur-micro-podcast-2026';

/* ─── IMAGE DE FOND PAR CATÉGORIE ───────────────────────────
   Images dans /public/images/editorial/
   bg-general.webp     → universel (HERO1)
   bg-studio-son.webp  → tout ce qui est audio
   bg-image-lumiere.webp → vidéo / photo
   bg-streaming.webp   → streaming
   bg-micro.webp / bg-shure.webp / bg-carte-son.webp / bg-casque.webp
   bg-eclairage.webp / bg-photo.webp
─────────────────────────────────────────────────────────── */
const CATEGORY_BG: Record<string, string> = {
  // ── Audio
  'audio':                 '/images/editorial/bg-studio-son.webp',
  'micros-dynamiques':     '/images/editorial/bg-shure.webp',
  'micros-condensateurs':  '/images/editorial/bg-micro.webp',
  'micros-usb':            '/images/editorial/bg-micro.webp',
  'micros-shotgun':        '/images/editorial/bg-micro.webp',
  'cartes-son':            '/images/editorial/bg-carte-son.webp',
  'preamplis':             '/images/editorial/bg-carte-son.webp',
  'casques-studio':        '/images/editorial/bg-casque.webp',
  'enceintes':             '/images/editorial/bg-studio-son.webp',
  'bras-articules':        '/images/editorial/bg-studio-son.webp',
  'cable-xlr':             '/images/editorial/bg-studio-son.webp',
  'traitement-acoustique': '/images/editorial/bg-studio-son.webp',
  // ── Vidéo / Photo
  'video':                 '/images/editorial/bg-image-lumiere.webp',
  'hybrides-mirrorless':   '/images/editorial/bg-photo.webp',
  'webcams-pro':           '/images/editorial/bg-image-lumiere.webp',
  'action-cams':           '/images/editorial/bg-photo.webp',
  'keylight':              '/images/editorial/bg-eclairage.webp',
  'softbox':               '/images/editorial/bg-eclairage.webp',
  'rgb-ambiance':          '/images/editorial/bg-eclairage.webp',
  'grand-angle':           '/images/editorial/bg-photo.webp',
  'zoom-polyvalent':       '/images/editorial/bg-photo.webp',
  // ── Streaming
  'streaming':             '/images/editorial/bg-streaming.webp',
  'fonds-verts':           '/images/editorial/bg-streaming.webp',
  'teleprompteurs':        '/images/editorial/bg-streaming.webp',
  'cable-management':      '/images/editorial/bg-streaming.webp',
  'stream-deck':           '/images/editorial/bg-streaming.webp',
};
const DEFAULT_BG = '/images/editorial/bg-general.webp';

/* ─── EDITORIAL BADGES ───────────────────────────────────── */
function computeEditorialBadges(products: Product[], total: number) {
  if (total === 0) return { choixId: null, coupDeCoeurId: null };

  const sorted = [...products].sort((a, b) => {
    const scoreA = (a.rating || 0) * Math.log10((a.review_count || 0) + 1);
    const scoreB = (b.rating || 0) * Math.log10((b.review_count || 0) + 1);
    return scoreB - scoreA;
  });
  const choixId = sorted[0]?.id ?? null;

  let coupDeCoeurId: string | null = null;
  if (total >= 20) {
    const prices = products.map(p => p.price || 0).sort((a, b) => a - b);
    const median = prices[Math.floor(prices.length / 2)];
    const candidates = sorted.filter(p => (p.price || 0) <= median && p.id !== choixId && (p.rating || 0) >= 4.0);
    coupDeCoeurId = candidates[0]?.id ?? null;
  }

  return { choixId, coupDeCoeurId };
}

/* ─── INTERSTITIAL EDITORIAL CARD ───────────────────────── */
function EditorialCard({ slug }: { slug: string }) {
  const guideSlug = GUIDE_MAP[slug] ?? DEFAULT_GUIDE;
  const bgImage   = CATEGORY_BG[slug] ?? DEFAULT_BG;

  return (
    <Link
      href={`/guide/${guideSlug}`}
      className="group sm:col-span-2 relative rounded-2xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300 min-h-[280px] flex"
      style={{ background: '#0A0A0A' }}
    >
      {/* Image de fond */}
      {bgImage && (
        <div className="absolute inset-0">
          <Image
            src={bgImage}
            alt=""
            fill
            className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500 scale-105 group-hover:scale-100"
            sizes="(max-width: 768px) 100vw, 66vw"
          />
        </div>
      )}

      {/* Gradient overlay — léger, juste pour la lisibilité du texte à gauche */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(105deg, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.45) 50%, rgba(10,10,10,0.10) 100%)' }}
        aria-hidden
      />

      {/* Halo doré */}
      <div
        className="absolute -top-10 -right-10 w-[280px] h-[280px] rounded-full pointer-events-none opacity-60"
        style={{ background: 'radial-gradient(circle, rgba(211,178,123,.30) 0%, transparent 65%)', filter: 'blur(40px)' }}
        aria-hidden
      />

      {/* Contenu */}
      <div className="relative z-10 p-8 flex-1 flex flex-col justify-between text-white grain">
        <div>
          <p className="frame-label text-primary mb-3 flex items-center gap-3">
            <span className="block w-6 h-px bg-primary" aria-hidden />
            Guide complet
          </p>
          <h3 className="font-serif text-[28px] md:text-[36px] leading-[1.1] tracking-tight mb-3 max-w-md">
            Vous hésitez encore&nbsp;?<br />
            <span className="italic text-primary">Lisez notre guide expert.</span>
          </h3>
          <p className="text-[13px] text-white/55 max-w-md leading-relaxed font-light">
            Tout ce qu&apos;il faut savoir pour faire le bon choix — comparatifs, conseils d&apos;experts, avis terrain.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 text-[11px] font-mono text-primary uppercase tracking-wider">
          <span className="group-hover:translate-x-1 transition-transform">Lire le guide · 5 min</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </div>
      </div>
    </Link>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────── */
interface Props {
  products: Product[];
  slug: string;
  title: string;
  subtitle: string;
}

export default function CategoryContent({ products, slug, title, subtitle }: Props) {
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc' | 'rating' | 'name'>('default');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const brands = useMemo(() => {
    const s = new Set(products.map(p => p.brand).filter(Boolean));
    return Array.from(s).sort().slice(0, 6);
  }, [products]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedBrands.length > 0) result = result.filter(p => selectedBrands.includes(p.brand || ''));
    switch (sortBy) {
      case 'price_asc': result.sort((a, b) => a.price - b.price); break;
      case 'price_desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return result;
  }, [products, sortBy, selectedBrands]);

  const hasFilters = selectedBrands.length > 0 || sortBy !== 'default';

  const { choixId, coupDeCoeurId } = useMemo(
    () => computeEditorialBadges(products, products.length),
    [products]
  );

  const reset = () => {
    setSortBy('default');
    setSelectedBrands([]);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-16 py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

      {/* ── BOUTON FILTRE MOBILE ─────────────────────────── */}
      <div className="col-span-12 lg:hidden">
        <button
          onClick={() => setFilterOpen(v => !v)}
          className="flex items-center gap-2 h-10 px-5 rounded-full border border-border bg-white text-[12px] font-mono uppercase tracking-wider hover:border-primary hover:text-primary transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M3 6h18M7 12h10M11 18h2"/></svg>
          Filtres
          {hasFilters && <span className="ml-1 w-2 h-2 rounded-full bg-primary inline-block" />}
        </button>
      </div>

      {/* ── SIDEBAR ─────────────────────────────────────── */}
      <aside className={cn(
        "col-span-12 lg:col-span-3",
        !filterOpen && "hidden lg:block"
      )}>
        <div className="lg:sticky lg:top-24 space-y-10">

          <div className="flex items-baseline justify-between">
            <p className="frame-label text-foreground">Filtres</p>
            {hasFilters && (
              <button
                onClick={reset}
                className="text-[11px] font-mono text-foreground/55 hover:text-primary underline underline-offset-4 decoration-foreground/20 hover:decoration-primary transition-colors"
              >
                Réinitialiser
              </button>
            )}
          </div>

          {/* TRI */}
          <div>
            <p className="frame-label text-foreground/60 mb-3">Tri</p>
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="w-full appearance-none bg-white border border-border rounded-xl px-4 py-3 pr-10 text-[13px] text-foreground font-medium cursor-pointer hover:border-primary/60 focus:outline-none focus:border-primary transition-all"
              >
                <option value="default">Pertinence</option>
                <option value="price_asc">Prix : croissant</option>
                <option value="price_desc">Prix : décroissant</option>
                <option value="rating">Meilleures notes</option>
                <option value="name">Nom A → Z</option>
              </select>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 pointer-events-none" aria-hidden><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>

          {/* MARQUE */}
          {brands.length > 1 && (
            <div>
              <div className="flex items-baseline justify-between mb-4">
                <p className="frame-label text-foreground/60 flex items-center gap-2">
                  <span className="font-mono text-primary">01</span>
                  <span>Marque</span>
                </p>
                <span className="frame-label text-foreground/35">{brands.length.toString().padStart(2, '0')}</span>
              </div>
              <ul className="space-y-3">
                {brands.map(brand => (
                  <li key={brand}>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="w-4 h-4 rounded border border-border accent-primary cursor-pointer"
                      />
                      <span className="text-[13px] text-foreground/85 group-hover:text-foreground transition-colors flex-1">{brand}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA LABO */}
          <Link
            href="/configurateur"
            className="group block relative overflow-hidden rounded-2xl border border-border bg-foreground text-white p-5 hover:border-primary/40 transition-colors"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(211,178,123,.35) 0%, transparent 60%)', filter: 'blur(20px)' }} aria-hidden />
            <p className="frame-label text-primary mb-3 relative z-10">Hésitant&nbsp;?</p>
            <p className="font-serif text-[18px] leading-tight mb-2 relative z-10">L&apos;IA peut choisir <span className="italic text-primary">pour vous.</span></p>
            <p className="text-[11px] text-white/55 font-light leading-relaxed mb-4 relative z-10">3 minutes, 5 questions, un setup complet.</p>
            <span className="inline-flex items-center gap-2 text-[11px] font-mono text-primary uppercase tracking-wider group-hover:translate-x-1 transition-transform relative z-10">
              Lancer le Labo IA
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </span>
          </Link>

        </div>
      </aside>

      {/* ── GRILLE PRODUITS ──────────────────────────────── */}
      <section className="col-span-12 lg:col-span-9">

        {/* Toolbar */}
        <div className="flex items-baseline justify-between mb-8 pb-5 border-b border-border/60">
          <div className="flex items-baseline gap-4">
            {hasFilters && (
              <span className="frame-label text-foreground/45">Filtres actifs</span>
            )}
          </div>
          {selectedBrands.length > 0 && (
            <div className="hidden md:flex items-center gap-2 flex-wrap">
              {selectedBrands.map(brand => (
                <span key={brand} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-foreground text-[11px] font-mono">
                  {brand}
                  <button onClick={() => toggleBrand(brand)} className="hover:text-primary" aria-label={`Retirer ${brand}`}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {filtered.length > 0 ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {filtered.map((product, idx) => (
                <React.Fragment key={product.id}>
                  <ProductCard
                    product={product}
                    editorialBadge={
                      product.id === choixId ? 'choix' :
                      product.id === coupDeCoeurId ? 'coup-de-coeur' :
                      undefined
                    }
                  />
                  {/* Interstitiel éditorial après la 4ème carte */}
                  {idx === 3 && (
                    <EditorialCard slug={slug} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-secondary/20 rounded-3xl border border-dashed border-border px-6">
            <h3 className="font-serif text-xl mb-2">Aucun produit trouvé</h3>
            <p className="text-muted-foreground mb-8 max-w-sm font-light">Essayez de modifier vos filtres.</p>
            <button onClick={reset} className="inline-flex items-center gap-2 h-10 px-6 rounded-full border border-foreground/15 text-[12px] font-mono uppercase tracking-wider hover:border-primary hover:text-primary transition-colors">
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
