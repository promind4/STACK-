'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useComparison, ComparisonProduct } from '@/context/ComparisonContext';
import { generateDuelAnalysis, DuelAnalysis } from '@/lib/duelEngine';
import { isDirectSupabaseStorageUrl } from '@/lib/imagePolicy.mjs';
import {
  X,
  Swords,
  Check,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react';
import type { Product } from '@/types/database';
import { createClient } from '@supabase/supabase-js';
import { transformProduct } from '@/lib/transformers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const ProductDuelModal: React.FC = () => {
  const { isModalOpen, closeModal, selectedProducts } = useComparison();
  const [fullProducts, setFullProducts] = useState<[Product | null, Product | null]>([null, null]);
  const [loading, setLoading] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, closeModal]);

  // Hydrate full products from Supabase when modal opens
  useEffect(() => {
    if (!isModalOpen || selectedProducts.length < 2) return;

    const [itemA, itemB] = selectedProducts;
    let isCancelled = false;

    const fetchFullData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, product_offers(*), categories(id, name, slug)')
          .in('slug', [itemA.slug, itemB.slug]);

        if (error) throw error;

        if (data && !isCancelled) {
          const transformed = data.map((d: any) => transformProduct(d));
          const prodA = transformed.find((p) => p.slug === itemA.slug) || (itemA as any);
          const prodB = transformed.find((p) => p.slug === itemB.slug) || (itemB as any);
          setFullProducts([prodA, prodB]);
        }
      } catch (err) {
        console.error('Error hydrating duel products:', err);
        // Fallback to minimal data
        if (!isCancelled) {
          setFullProducts([itemA as any, itemB as any]);
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchFullData();

    return () => {
      isCancelled = true;
    };
  }, [isModalOpen, selectedProducts]);

  const productA = fullProducts[0] || (selectedProducts[0] as any);
  const productB = fullProducts[1] || (selectedProducts[1] as any);

  const analysis: DuelAnalysis | null = useMemo(() => {
    if (!productA || !productB) return null;
    return generateDuelAnalysis(productA, productB);
  }, [productA, productB]);

  if (!isModalOpen || selectedProducts.length < 2) return null;

  const bestOfferA = productA?.offers?.[0];
  const bestOfferB = productB?.offers?.[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Fenetre de Duel et Comparatif Technique"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl bg-background rounded-3xl border border-border shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-background/95 backdrop-blur border-b border-border">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center">
              <Swords size={16} />
            </span>
            <div>
              <span className="text-[11px] font-sans uppercase tracking-[0.14em] text-primary font-bold block">
                Le Duel • Atelier Fluxlab
              </span>
              <h2 className="text-base sm:text-lg font-sans font-bold text-foreground leading-tight">
                {productA?.name} <span className="text-primary font-sans text-sm font-normal">vs</span> {productB?.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/versus/${productA.slug}-vs-${productB.slug}`}
              onClick={closeModal}
              title="Ouvrir la page complète / Partager"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-sans font-medium text-foreground/70 hover:text-primary px-3 py-1.5 rounded-full bg-secondary/70 hover:bg-secondary transition-colors"
            >
              <span>Page dédiée</span>
              <ExternalLink size={12} />
            </Link>

            <button
              type="button"
              onClick={closeModal}
              aria-label="Fermer le comparateur"
              className="w-9 h-9 rounded-full bg-secondary/80 hover:bg-secondary text-foreground/70 hover:text-foreground flex items-center justify-center transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* BODY SCROLL */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8 divide-y divide-border/60">
          {/* 1. HERO CARDS SIDE BY SIDE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative pt-2">
            {/* VS Badge in Middle (Desktop) */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-foreground text-background border-4 border-background flex items-center justify-center shadow-lg font-sans font-bold text-xs tracking-wider">
                VS
              </div>
            </div>

            {/* PRODUCT CARD A */}
            <div className={`p-5 sm:p-6 rounded-2xl border transition-all relative flex flex-col bg-card ${
              analysis?.bestValueSlug === productA.slug ? 'border-primary/60 shadow-md ring-1 ring-primary/30' : 'border-border'
            }`}>
              {analysis?.bestValueSlug === productA.slug && (
                <span className="absolute -top-3 left-4 bg-primary text-primary-foreground text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Sparkles size={11} /> Meilleur Rapport Qualité/Prix
                </span>
              )}
              <div className="text-[11px] font-sans uppercase tracking-[0.14em] text-foreground/60 mb-1">
                {productA.brand}
              </div>
              <h3 className="font-sans text-xl sm:text-2xl font-bold text-foreground mb-3">
                {productA.name}
              </h3>

              <div className="relative aspect-[4/3] w-full bg-white rounded-xl overflow-hidden mb-4 p-4 border border-border/50">
                {productA.image_url ? (
                  <Image
                    src={productA.image_url}
                    alt={productA.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-contain mix-blend-multiply"
                    unoptimized={isDirectSupabaseStorageUrl(productA.image_url)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-foreground/30 text-xs">
                    Image indisponible
                  </div>
                )}
              </div>

              <div className="mt-auto pt-3 border-t border-border/60 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-wider text-foreground/60 block">
                    Meilleur prix
                  </span>
                  <span className="font-sans text-2xl font-bold text-foreground">
                    {productA.price ? `${productA.price.toLocaleString('fr-FR')} €` : 'N.C.'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/produit/${productA.slug}`}
                    target="_blank"
                    className="text-xs font-medium px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground transition-colors flex items-center gap-1"
                  >
                    <span>Fiche</span>
                    <ArrowRight size={12} />
                  </Link>

                  {bestOfferA?.affiliate_link && (
                    <a
                      href={bestOfferA.affiliate_link}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-1 shadow-sm"
                    >
                      <span>Acheter ({bestOfferA.merchant_name})</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* PRODUCT CARD B */}
            <div className={`p-5 sm:p-6 rounded-2xl border transition-all relative flex flex-col bg-card ${
              analysis?.bestValueSlug === productB.slug ? 'border-primary/60 shadow-md ring-1 ring-primary/30' : 'border-border'
            }`}>
              {analysis?.bestValueSlug === productB.slug && (
                <span className="absolute -top-3 left-4 bg-primary text-primary-foreground text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Sparkles size={11} /> Meilleur Rapport Qualité/Prix
                </span>
              )}
              <div className="text-[11px] font-sans uppercase tracking-[0.14em] text-foreground/60 mb-1">
                {productB.brand}
              </div>
              <h3 className="font-sans text-xl sm:text-2xl font-bold text-foreground mb-3">
                {productB.name}
              </h3>

              <div className="relative aspect-[4/3] w-full bg-white rounded-xl overflow-hidden mb-4 p-4 border border-border/50">
                {productB.image_url ? (
                  <Image
                    src={productB.image_url}
                    alt={productB.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-contain mix-blend-multiply"
                    unoptimized={isDirectSupabaseStorageUrl(productB.image_url)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-foreground/30 text-xs">
                    Image indisponible
                  </div>
                )}
              </div>

              <div className="mt-auto pt-3 border-t border-border/60 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-wider text-foreground/60 block">
                    Meilleur prix
                  </span>
                  <span className="font-sans text-2xl font-bold text-foreground">
                    {productB.price ? `${productB.price.toLocaleString('fr-FR')} €` : 'N.C.'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/produit/${productB.slug}`}
                    target="_blank"
                    className="text-xs font-medium px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground transition-colors flex items-center gap-1"
                  >
                    <span>Fiche</span>
                    <ArrowRight size={12} />
                  </Link>

                  {bestOfferB?.affiliate_link && (
                    <a
                      href={bestOfferB.affiliate_link}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-1 shadow-sm"
                    >
                      <span>Acheter ({bestOfferB.merchant_name})</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 2. TECHNICAL SPECS MATRIX */}
          <section className="pt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-sans text-lg font-bold text-foreground flex items-center gap-2">
                <span>Comparaison Technique & Acoustique</span>
              </h4>
              <span className="text-[11px] font-sans text-foreground/50 hidden sm:inline">
                Données certifiées Atelier Fluxlab
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-secondary/40 border-b border-border text-[11px] font-sans uppercase tracking-wider text-foreground/70">
                    <th className="p-3 sm:p-4 w-1/3">Caractéristique</th>
                    <th className="p-3 sm:p-4 w-1/3 text-foreground font-bold">{productA.name}</th>
                    <th className="p-3 sm:p-4 w-1/3 text-foreground font-bold">{productB.name}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-sans">
                  {analysis?.specs.map((spec, i) => (
                    <tr key={i} className="hover:bg-secondary/20 transition-colors">
                      <td className="p-3 sm:p-4 font-medium text-foreground/80 text-xs">
                        {spec.label}
                      </td>
                      <td className={`p-3 sm:p-4 ${spec.winner === 'A' ? 'font-semibold text-primary' : 'text-foreground/90'}`}>
                        <div className="flex items-start gap-1.5">
                          {spec.winner === 'A' && (
                            <CheckCircle2 size={15} className="text-primary shrink-0 mt-0.5" />
                          )}
                          <span>{spec.valA}</span>
                        </div>
                      </td>
                      <td className={`p-3 sm:p-4 ${spec.winner === 'B' ? 'font-semibold text-primary' : 'text-foreground/90'}`}>
                        <div className="flex items-start gap-1.5">
                          {spec.winner === 'B' && (
                            <CheckCircle2 size={15} className="text-primary shrink-0 mt-0.5" />
                          )}
                          <span>{spec.valB}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. EXPERT VERDICT DE L'ATELIER FLUXLAB */}
          {analysis && (
            <section className="pt-8 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-[linear-gradient(145deg,hsl(var(--secondary)/0.5)_0%,hsl(var(--card))_100%)] border border-primary/25 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <ShieldCheck size={22} />
                  </span>
                  <div>
                    <span className="text-[11px] font-sans uppercase tracking-[0.14em] text-primary font-bold block">
                      {analysis.isComparable === false ? 'Analyse de Synergie' : 'Analyse Comparative Sur-Mesure'}
                    </span>
                    <h3 className="font-sans text-xl sm:text-2xl font-bold text-foreground">
                      Le Verdict de l'Atelier Fluxlab
                    </h3>
                  </div>
                </div>

                {analysis.isComparable === false && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-xs sm:text-sm text-foreground space-y-1">
                    <strong className="text-amber-600 dark:text-amber-400 font-bold block">
                      Produits de catégories différentes
                    </strong>
                    <p className="text-foreground/80 mb-0 font-light leading-relaxed">
                      {analysis.incompatibleReason || 'Ces deux équipements appartiennent à des catégories différentes et sont complémentaires plutôt que concurrents.'}
                    </p>
                  </div>
                )}

                <div className="space-y-5 text-sm sm:text-[15px] leading-relaxed text-foreground/85">
                  <div className="space-y-1">
                    <h4 className="font-sans text-lg sm:text-xl font-bold text-foreground">
                      {analysis.title}
                    </h4>
                    <p className="text-xs sm:text-sm font-sans text-primary font-medium">
                      {analysis.subtitle}
                    </p>
                  </div>

                  <div 
                    className="leading-relaxed text-foreground/85 font-sans" 
                    dangerouslySetInnerHTML={{ __html: analysis.verdictLead }} 
                  />

                  {/* Carte 1 : Signature Acoustique ou Performance */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-background/80 border border-border/80 space-y-2">
                    <h5 className="font-sans text-xs uppercase tracking-wider font-bold text-foreground flex items-center gap-2">
                      <Sparkles size={14} className="text-primary" />
                      {analysis.card1Title || 'Signature Sonore & Rendu Acoustique'}
                    </h5>
                    <p className="text-sm leading-relaxed text-foreground/85 font-light font-sans">
                      {analysis.acousticAnalysis}
                    </p>
                  </div>

                  {/* Carte 2 : Chaîne Matérielle & Prérequis */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-background/80 border border-border/80 space-y-2">
                    <h5 className="font-sans text-xs uppercase tracking-wider font-bold text-foreground flex items-center gap-2">
                      <Zap size={14} className="text-primary" />
                      {analysis.card2Title || 'Chaîne Matérielle & Alimentation'}
                    </h5>
                    <p className="text-sm leading-relaxed text-foreground/85 font-light font-sans">
                      {analysis.hardwareRequirements}
                    </p>
                  </div>
                </div>

                {/* DECISION GUIDANCE: CHOOSE A IF / CHOOSE B IF */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 items-stretch">
                  {/* Choose A */}
                  <div className="p-5 rounded-2xl bg-background border border-border/80 space-y-3 flex flex-col">
                    <h5 className="font-sans text-xs uppercase tracking-wider font-bold text-foreground flex items-center gap-2 min-h-[1.5rem]">
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="truncate" title={`Choisir le ${productA.name}`}>
                        Choisir le {productA.name}&nbsp;:
                      </span>
                    </h5>
                    <ul className="space-y-2 text-xs sm:text-sm text-foreground/80 font-sans flex-1">
                      {analysis.chooseAIf.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check size={14} className="text-primary shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Choose B */}
                  <div className="p-5 rounded-2xl bg-background border border-border/80 space-y-3 flex flex-col">
                    <h5 className="font-sans text-xs uppercase tracking-wider font-bold text-foreground flex items-center gap-2 min-h-[1.5rem]">
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="truncate" title={`Choisir le ${productB.name}`}>
                        Choisir le {productB.name}&nbsp;:
                      </span>
                    </h5>
                    <ul className="space-y-2 text-xs sm:text-sm text-foreground/80 font-sans flex-1">
                      {analysis.chooseBIf.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check size={14} className="text-primary shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CONCLUSION */}
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-xs sm:text-sm font-sans font-medium text-foreground">
                  <span className="font-bold text-primary mr-1">Notre synthèse :</span>
                  {analysis.conclusion}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* BOTTOM STICKY ACTIONS */}
        <footer className="sticky bottom-0 z-30 flex items-center justify-between px-6 py-4 bg-background/95 backdrop-blur border-t border-border">
          <button
            type="button"
            onClick={closeModal}
            className="text-xs sm:text-sm text-foreground/70 hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-secondary"
          >
            Fermer le duel
          </button>

          <div className="flex items-center gap-3">
            <Link
              href={`/produit/${productA.slug}`}
              target="_blank"
              className="text-xs font-sans font-medium text-foreground/70 hover:text-primary transition-colors hidden sm:inline"
            >
              Fiche {productA.name}
            </Link>
            <span className="text-foreground/30 hidden sm:inline">·</span>
            <Link
              href={`/produit/${productB.slug}`}
              target="_blank"
              className="text-xs font-sans font-medium text-foreground/70 hover:text-primary transition-colors hidden sm:inline"
            >
              Fiche {productB.name}
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
};
