import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { transformProduct } from '@/lib/transformers';
import { generateDuelAnalysis } from '@/lib/duelEngine';
import { isDirectSupabaseStorageUrl } from '@/lib/imagePolicy.mjs';
import {
  Swords,
  ChevronLeft,
  Check,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Zap,
  SearchX
} from 'lucide-react';
import type { Product } from '@/types/database';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface VersusPageProps {
  params: {
    slug: string;
  };
}

async function getDuelProducts(slug: string): Promise<[Product | null, Product | null]> {
  const parts = slug.split('-vs-');
  if (parts.length !== 2) return [null, null];

  const slugA = parts[0];
  const slugB = parts[1];

  const { data, error } = await supabase
    .from('products')
    .select('*, product_offers(*), categories(id, name, slug)')
    .in('slug', [slugA, slugB]);

  if (error || !data || data.length < 2) return [null, null];

  const transformed = data.map((d: any) => transformProduct(d));
  const productA = transformed.find((p) => p.slug === slugA) || null;
  const productB = transformed.find((p) => p.slug === slugB) || null;

  return [productA, productB];
}

export async function generateMetadata({ params }: VersusPageProps): Promise<Metadata> {
  const [productA, productB] = await getDuelProducts(params.slug);

  if (!productA || !productB) {
    return {
      title: 'Duel de Matériel Audio | Fluxlab',
      description: 'Comparatif technique et duel de matériel studio.',
    };
  }

  return {
    title: `${productA.name} vs ${productB.name} : Quel est le meilleur choix ? | Fluxlab`,
    description: `Comparatif direct entre ${productA.brand} ${productA.name} et ${productB.brand} ${productB.name}. Analyse acoustique, préamplification, prix et verdict de l'Atelier Fluxlab.`,
    openGraph: {
      title: `${productA.name} vs ${productB.name} : Le Duel Expert | Fluxlab`,
      description: `Découvrez qui l'emporte entre le ${productA.name} et le ${productB.name}. Test technique et comparatif de prix en direct.`,
    },
  };
}

export default async function VersusPage({ params }: VersusPageProps) {
  const [productA, productB] = await getDuelProducts(params.slug);

  if (!productA || !productB) {
    notFound();
  }

  const analysis = generateDuelAnalysis(productA, productB);
  const bestOfferA = productA.offers?.[0];
  const bestOfferB = productB.offers?.[0];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 pb-24">
      {/* 1. TOP BREADCRUMB & HERO */}
      <section className="pt-28 pb-14 bg-gradient-to-b from-secondary/40 via-background to-background border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <Link
            href={productA.category_slug ? `/categorie/${productA.category_slug}` : '/categorie/micros-dynamiques'}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-foreground/60 hover:text-primary transition-colors mb-8"
          >
            <ChevronLeft size={14} />
            <span>Retour aux {productA.category_name ? productA.category_name.toLowerCase() : 'produits'}</span>
          </Link>

          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest font-sans">
              <Swords size={13} />
              Le Duel • Atelier Fluxlab
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-sans font-bold tracking-tight text-foreground">
              {productA.name} <span className="text-primary font-sans text-2xl sm:text-4xl font-normal">vs</span> {productB.name}
            </h1>
            <p className="text-sm sm:text-base text-foreground/75 font-light font-sans">
              {analysis.subtitle}
            </p>
          </div>

          {/* SIDE BY SIDE PRODUCT HERO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative pt-4">
            {/* Middle VS Badge */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-foreground text-background border-4 border-background flex items-center justify-center shadow-xl font-mono font-bold text-sm tracking-wider">
                VS
              </div>
            </div>

            {/* PRODUCT A */}
            <div className={`p-6 sm:p-8 rounded-3xl border transition-all relative flex flex-col bg-card ${
              analysis.bestValueSlug === productA.slug ? 'border-primary/60 shadow-lg ring-1 ring-primary/30' : 'border-border'
            }`}>
              {analysis.bestValueSlug === productA.slug && (
                <span className="absolute -top-3 left-6 bg-primary text-primary-foreground text-[10px] font-sans font-bold uppercase tracking-wider px-3 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Sparkles size={11} /> Meilleur Rapport Qualité/Prix
                </span>
              )}
              <div className="text-xs font-sans uppercase tracking-widest text-foreground/60 mb-1">
                {productA.brand}
              </div>
              <h2 className="font-sans text-2xl sm:text-3xl font-bold text-foreground mb-4">
                {productA.name}
              </h2>

              <div className="relative aspect-[4/3] w-full bg-white rounded-2xl overflow-hidden mb-6 p-6 border border-border/50 shadow-inner">
                {productA.image_url ? (
                  <Image
                    src={productA.image_url}
                    alt={`${productA.brand} ${productA.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 450px"
                    className="object-contain mix-blend-multiply"
                    unoptimized={isDirectSupabaseStorageUrl(productA.image_url)}
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-foreground/30 text-xs font-sans">
                    Image indisponible
                  </div>
                )}
              </div>

              <div className="mt-auto pt-4 border-t border-border/60 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-wider text-foreground/60 block">
                    Meilleur prix direct
                  </span>
                  <span className="font-sans text-3xl font-bold text-foreground">
                    {productA.price ? `${productA.price.toLocaleString('fr-FR')} €` : 'N.C.'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/produit/${productA.slug}`}
                    className="text-xs font-medium px-3.5 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground transition-colors flex items-center gap-1.5"
                  >
                    <span>Fiche</span>
                    <ArrowRight size={13} />
                  </Link>

                  {bestOfferA?.affiliate_link && (
                    <a
                      href={bestOfferA.affiliate_link}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-xs font-semibold px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Acheter ({bestOfferA.merchant_name})</span>
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* PRODUCT B */}
            <div className={`p-6 sm:p-8 rounded-3xl border transition-all relative flex flex-col bg-card ${
              analysis.bestValueSlug === productB.slug ? 'border-primary/60 shadow-lg ring-1 ring-primary/30' : 'border-border'
            }`}>
              {analysis.bestValueSlug === productB.slug && (
                <span className="absolute -top-3 left-6 bg-primary text-primary-foreground text-[10px] font-sans font-bold uppercase tracking-wider px-3 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Sparkles size={11} /> Meilleur Rapport Qualité/Prix
                </span>
              )}
              <div className="text-xs font-sans uppercase tracking-widest text-foreground/60 mb-1">
                {productB.brand}
              </div>
              <h2 className="font-sans text-2xl sm:text-3xl font-bold text-foreground mb-4">
                {productB.name}
              </h2>

              <div className="relative aspect-[4/3] w-full bg-white rounded-2xl overflow-hidden mb-6 p-6 border border-border/50 shadow-inner">
                {productB.image_url ? (
                  <Image
                    src={productB.image_url}
                    alt={`${productB.brand} ${productB.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 450px"
                    className="object-contain mix-blend-multiply"
                    unoptimized={isDirectSupabaseStorageUrl(productB.image_url)}
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-foreground/30 text-xs font-sans">
                    Image indisponible
                  </div>
                )}
              </div>

              <div className="mt-auto pt-4 border-t border-border/60 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-sans uppercase tracking-wider text-foreground/60 block">
                    Meilleur prix direct
                  </span>
                  <span className="font-sans text-3xl font-bold text-foreground">
                    {productB.price ? `${productB.price.toLocaleString('fr-FR')} €` : 'N.C.'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/produit/${productB.slug}`}
                    className="text-xs font-medium px-3.5 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground transition-colors flex items-center gap-1.5"
                  >
                    <span>Fiche</span>
                    <ArrowRight size={13} />
                  </Link>

                  {bestOfferB?.affiliate_link && (
                    <a
                      href={bestOfferB.affiliate_link}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-xs font-semibold px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Acheter ({bestOfferB.merchant_name})</span>
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TECHNICAL SPECS COMPARISON */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl sm:text-3xl font-sans font-bold text-foreground">
              Comparaison Technique & Acoustique
            </h3>
            <p className="text-xs sm:text-sm font-sans text-foreground/60">
              Mesures relevées par l'Atelier Fluxlab
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <table className="w-full text-left text-sm border-collapse font-sans">
              <thead>
                <tr className="bg-secondary/40 border-b border-border text-xs font-sans uppercase tracking-wider text-foreground/70">
                  <th className="p-4 sm:p-5 w-1/3">Critère Technique</th>
                  <th className="p-4 sm:p-5 w-1/3 font-bold text-foreground">{productA.name}</th>
                  <th className="p-4 sm:p-5 w-1/3 font-bold text-foreground">{productB.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {analysis.specs.map((spec, i) => (
                  <tr key={i} className="hover:bg-secondary/15 transition-colors">
                    <td className="p-4 sm:p-5 text-xs sm:text-sm font-medium text-foreground/80">
                      {spec.label}
                    </td>
                    <td className={`p-4 sm:p-5 ${spec.winner === 'A' ? 'font-semibold text-primary' : 'text-foreground/90'}`}>
                      <div className="flex items-start gap-2">
                        {spec.winner === 'A' && (
                          <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                        )}
                        <span>{spec.valA}</span>
                      </div>
                    </td>
                    <td className={`p-4 sm:p-5 ${spec.winner === 'B' ? 'font-semibold text-primary' : 'text-foreground/90'}`}>
                      <div className="flex items-start gap-2">
                        {spec.winner === 'B' && (
                          <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                        )}
                        <span>{spec.valB}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. VERDICT DE L'ATELIER */}
      <section className="py-12 bg-secondary/20 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="p-8 sm:p-12 rounded-3xl bg-card border border-primary/25 shadow-xl space-y-8 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                <ShieldCheck size={26} />
              </span>
              <div>
                <span className="text-xs font-sans uppercase tracking-[0.14em] text-primary font-bold block">
                  {analysis.isComparable === false ? 'Synergie Matérielle' : 'Expertise Studio Fluxlab'}
                </span>
                <h3 className="font-sans text-2xl sm:text-3xl font-bold text-foreground">
                  Le Verdict de l'Atelier
                </h3>
              </div>
            </div>

            {analysis.isComparable === false && (
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-sm text-foreground space-y-2">
                <strong className="text-amber-600 dark:text-amber-400 font-bold block">
                  Équipements de catégories distinctes
                </strong>
                <p className="text-foreground/80 mb-0 font-light leading-relaxed">
                  {analysis.incompatibleReason || 'Ces deux équipements remplissent des rôles différents dans votre studio.'}
                </p>
              </div>
            )}

            <div className="space-y-6 text-sm sm:text-base leading-relaxed text-foreground/85">
              <div className="space-y-1">
                <h4 className="font-sans text-xl sm:text-2xl font-bold text-foreground">
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
              <div className="p-5 rounded-2xl bg-background/80 border border-border/80 space-y-2">
                <h5 className="font-sans text-xs uppercase tracking-wider font-bold text-foreground flex items-center gap-2">
                  <Sparkles size={16} className="text-primary" />
                  {analysis.card1Title || 'Signature Sonore & Rendu Acoustique'}
                </h5>
                <p className="text-sm leading-relaxed text-foreground/85 font-light font-sans">
                  {analysis.acousticAnalysis}
                </p>
              </div>

              {/* Carte 2 : Chaîne Matérielle & Prérequis */}
              <div className="p-5 rounded-2xl bg-background/80 border border-border/80 space-y-2">
                <h5 className="font-sans text-xs uppercase tracking-wider font-bold text-foreground flex items-center gap-2">
                  <Zap size={16} className="text-primary" />
                  {analysis.card2Title || 'Chaîne Matérielle & Alimentation'}
                </h5>
                <p className="text-sm leading-relaxed text-foreground/85 font-light font-sans">
                  {analysis.hardwareRequirements}
                </p>
              </div>
            </div>

            {/* RECOMMENDATION BOXES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
              <div className="p-6 rounded-2xl bg-background border border-border space-y-3 shadow-sm">
                <h4 className="font-sans text-xs uppercase tracking-wider font-bold text-foreground flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  Optez pour le {productA.name} si :
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-foreground/80">
                  {analysis.chooseAIf.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check size={15} className="text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-background border border-border space-y-3 shadow-sm">
                <h4 className="font-sans text-xs uppercase tracking-wider font-bold text-foreground flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  Optez pour le {productB.name} si :
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-foreground/80">
                  {analysis.chooseBIf.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check size={15} className="text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CONCLUSION */}
            <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20 text-xs sm:text-sm font-medium text-foreground">
              <span className="font-bold text-primary mr-1.5">Synthèse finale :</span>
              {analysis.conclusion}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
