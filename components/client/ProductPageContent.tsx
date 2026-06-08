'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { cleanImageUrl } from '@/lib/utils';
import { stripHtml } from '@/lib/utils';
import { Product, ProductOffer } from '@/types/database';

/* ─── STAR ROW ───────────────────────────────────────────── */
function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5 text-primary">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" opacity={i <= Math.round(rating) ? 1 : 0.35} aria-hidden>
          <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"/>
        </svg>
      ))}
    </div>
  );
}

/* ─── GALLERY ────────────────────────────────────────────── */
const FALLBACK_IMG = 'https://placehold.co/600x600/F4EFEA/D3B27B?text=Image+non+disponible';

function Gallery({ name, brand, mainImage, galleryImages }: {
  name: string; brand: string | null; mainImage: string; galleryImages: string[];
}) {
  const all = [mainImage, ...galleryImages.filter(img => img !== mainImage)].filter(Boolean);
  const [active, setActive] = useState(all[0] || '');
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="aspect-[4/3] rounded-2xl border border-border/70 bg-white relative overflow-hidden group">
        {brand && (
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center px-3 py-1.5 bg-white/95 backdrop-blur text-[10px] font-mono font-semibold uppercase tracking-[0.12em] text-foreground rounded-md border border-border/70">
              {brand}
            </span>
          </div>
        )}
        {active ? (
          <Image
            src={imgError ? FALLBACK_IMG : active}
            alt={`${name}${brand ? ` ${brand}` : ''} — vue principale`}
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
            priority
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-foreground/15 font-mono text-sm">Image non disponible</div>
        )}
      </div>

      {/* Thumbnails */}
      {all.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {all.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActive(img)}
              type="button"
              aria-label={`Vue ${idx + 1}`}
              className={cn(
                'w-20 h-20 shrink-0 rounded-xl bg-white border p-2 overflow-hidden relative transition-all focus:outline-none focus:ring-2 focus:ring-primary',
                active === img
                  ? 'border-primary shadow-sm ring-[3px] ring-primary/20'
                  : 'border-border/60 opacity-60 hover:opacity-100 hover:border-primary/50'
              )}
            >
              <Image src={img} alt={`Miniature ${idx + 1}`} fill sizes="80px" className="object-contain p-1.5" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── MERCHANT LOGO MAP ──────────────────────────────────── */
const MERCHANT_LOGOS: Record<string, string> = {
  amazon:    'https://oxzapjwfttrgsometnwq.supabase.co/storage/v1/object/public/logo/amazon-logo.png',
  thomann:   'https://oxzapjwfttrgsometnwq.supabase.co/storage/v1/object/public/logo/THOMANN.png',
  woodbrass: 'https://oxzapjwfttrgsometnwq.supabase.co/storage/v1/object/public/logo/woodbrass.jpeg',
};

function getMerchantLogo(offer: ProductOffer): string | null {
  if (offer.merchant_logo_url) return offer.merchant_logo_url;
  return MERCHANT_LOGOS[offer.merchant_name.toLowerCase()] || null;
}

/* ─── OFFER ROW ──────────────────────────────────────────── */
function OfferRow({ offer, isPrimary }: { offer: ProductOffer; isPrimary: boolean }) {
  const logoUrl = getMerchantLogo(offer);
  return (
    <a
      href={offer.affiliate_link}
      target="_blank"
      rel="nofollow sponsored noopener"
      className={cn(
        'group flex items-center justify-between p-3 rounded-xl border transition-colors',
        isPrimary
          ? 'bg-white border-primary/30 ring-1 ring-primary/10'
          : 'bg-white border-border/70 hover:border-primary/60'
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-white border border-border/50 flex items-center justify-center shrink-0 overflow-hidden p-1.5">
          {logoUrl
            ? <Image src={logoUrl} alt={`Logo ${offer.merchant_name}`} width={36} height={36} className="object-contain w-full h-full" />
            : <span className="text-[10px] font-mono text-foreground/70 font-semibold">{offer.merchant_name.substring(0, 2).toUpperCase()}</span>
          }
        </div>
        <span className="text-[14px] text-foreground/85">{offer.merchant_name}</span>
        {!offer.in_stock && (
          <span className="text-[10px] font-mono text-foreground/40 uppercase">Rupture</span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="font-serif text-[17px] text-foreground">{offer.price}€</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground/40 group-hover:text-primary transition-colors" aria-hidden>
          <path d="M7 7h10v10"/><path d="M7 17 17 7"/>
        </svg>
      </div>
    </a>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────── */
type TabId = 'desc' | 'specs' | 'compat' | 'avis';

interface Props {
  product: Product;
  category: { name: string; slug: string } | null;
  relatedProducts: Product[];
}

export default function ProductPageContent({ product, category, relatedProducts }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('desc');
  const router = useRouter();

  const sortedOffers = [...(product.offers || [])].sort((a, b) => a.price - b.price);
  const bestOffer = sortedOffers[0];
  const anyInStock = sortedOffers.some(o => o.in_stock);
  const categoryName = category?.name || 'Catalogue';
  const categorySlug = category?.slug || 'audio';

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: 'desc', label: 'Description' },
    { id: 'specs', label: 'Caractéristiques' },
    { id: 'compat', label: 'Compatibilité' },
    { id: 'avis', label: 'Avis', count: product.review_count || undefined },
  ];

  const specs = product.specs && typeof product.specs === 'object'
    ? Object.entries(product.specs as Record<string, unknown>).filter(([, v]) => v)
    : [];

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Breadcrumb + bouton retour */}
      <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-16 pt-8">
        <div className="flex items-center justify-between mb-0">
          <nav className="flex items-center gap-2 text-[12px] font-mono text-foreground/55 uppercase tracking-wider" aria-label="Fil d'ariane">
            <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="m9 18 6-6-6-6"/></svg>
            <Link href={`/categorie/${categorySlug}`} className="hover:text-primary transition-colors">{categoryName}</Link>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="m9 18 6-6-6-6"/></svg>
            <span className="text-foreground">{product.name}</span>
          </nav>
          {/* Bouton retour */}
          <button
            type="button"
            onClick={() => router.back()}
            className="hidden md:inline-flex items-center gap-2 text-[12px] font-mono text-foreground/55 uppercase tracking-wider hover:text-primary transition-colors group"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:-translate-x-0.5 transition-transform" aria-hidden>
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Retour à {categoryName}
          </button>
        </div>
      </div>

      {/* Hero : galerie + infos */}
      <main className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-16 pt-10 pb-24">
        <div className="grid grid-cols-12 gap-12 items-start">

          {/* Galerie — 7 cols sticky */}
          <div className="col-span-12 lg:col-span-7 lg:sticky lg:top-24">
            <Gallery
              name={product.name}
              brand={product.brand ?? null}
              mainImage={cleanImageUrl(product.image_url)}
              galleryImages={(product.gallery_images || []).map(img => cleanImageUrl(img))}
            />
          </div>

          {/* Infos — 5 cols sticky */}
          <div className="col-span-12 lg:col-span-5 lg:sticky lg:top-24">

            {/* Eyebrow */}
            <p className="frame-label text-primary mb-4 flex items-center gap-3">
              <span className="block w-8 h-px bg-primary" aria-hidden />
              {product.brand}{product.brand ? ' · ' : ''}{categoryName}
            </p>

            {/* H1 */}
            <h1 className="font-serif text-foreground text-[40px] md:text-[52px] leading-[1.05] tracking-tight mb-5">
              {product.name}
            </h1>

            {/* Rating + stock */}
            {(product.rating || 0) > 0 && (
              <div className="flex items-center gap-3 mb-8">
                <Stars rating={product.rating || 0} />
                <span className="text-[13px] font-mono text-foreground/55">{product.rating} · {(product.review_count || 0).toLocaleString('fr-FR')} avis</span>
                <span className="text-foreground/30">·</span>
                <span className={cn('flex items-center gap-1.5 text-[12px] font-mono', anyInStock ? 'text-green-600' : 'text-foreground/50')}>
                  <span className={cn('block w-1.5 h-1.5 rounded-full', anyInStock ? 'bg-green-500' : 'bg-foreground/30')} style={anyInStock ? { boxShadow: '0 0 6px rgba(34,197,94,.5)' } : undefined} />
                  {anyInStock ? 'En stock' : 'Indisponible'}
                </span>
              </div>
            )}

            {/* Prix compact */}
            {bestOffer && (
              <div className="flex items-center gap-3 mb-6 py-3 px-4 rounded-xl bg-secondary border border-border/70">
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-primary mb-0.5">Prix le plus bas</span>
                  <span className="font-serif text-[26px] leading-none text-foreground">
                    {bestOffer.price}<span className="text-[14px] align-top ml-0.5">€</span>
                  </span>
                </div>
                <span className="text-[13px] text-foreground/50">chez</span>
                {getMerchantLogo(bestOffer) ? (
                  <Image
                    src={getMerchantLogo(bestOffer)!}
                    alt={`Logo ${bestOffer.merchant_name}`}
                    width={70}
                    height={22}
                    className="object-contain h-5 w-auto"
                  />
                ) : (
                  <span className="text-[14px] font-medium text-foreground/80">{bestOffer.merchant_name}</span>
                )}
                <a
                  href={bestOffer.affiliate_link}
                  target="_blank"
                  rel="nofollow sponsored noopener"
                  className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-mono text-primary uppercase tracking-wider hover:underline"
                >
                  Voir l&apos;offre
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                </a>
              </div>
            )}

            {/* Verdict */}
            {product.description && (
              <div className="bg-secondary rounded-xl p-5 mb-6 border border-border/70">
                <p className="frame-label text-primary mb-2">Le verdict Fluxlab</p>
                <p className="text-[14px] text-foreground/80 leading-[1.65] font-light line-clamp-4">
                  {stripHtml(product.description)}
                </p>
              </div>
            )}

            {/* Points forts & Points d'attention */}
            {((product.pros?.length ?? 0) > 0 || (product.cons?.length ?? 0) > 0) && (
              <div className="bg-secondary rounded-2xl border border-border/70 p-5 space-y-4 mb-6">
                {(product.pros?.length ?? 0) > 0 && (
                  <>
                    <p className="frame-label text-primary">Points forts</p>
                    <ul className="space-y-2.5">
                      {product.pros!.map((pro, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#D3B27B" strokeWidth="2" className="mt-0.5 shrink-0" aria-hidden><path d="M20 6 9 17l-5-5"/></svg>
                          <span className="text-[13px] text-foreground/80 leading-snug">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {(product.cons?.length ?? 0) > 0 && (
                  <div className="pt-4 border-t border-border/60">
                    <p className="frame-label text-foreground/45 mb-3">Points d&apos;attention</p>
                    <ul className="space-y-2.5">
                      {product.cons!.map((con, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6F6F6F" strokeWidth="2" className="mt-0.5 shrink-0" aria-hidden><path d="M12 9v4"/><circle cx="12" cy="17" r="1"/></svg>
                          <span className="text-[13px] text-foreground/65 leading-snug">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Prix box */}
            {sortedOffers.length > 0 && (
              <div className="bg-secondary rounded-2xl p-6 mb-6 border border-border/70">
                <div className="flex items-end justify-between mb-5">
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-[0.16em] text-foreground/55 mb-1">Meilleur prix constaté</span>
                    <span className="font-serif text-[44px] leading-none text-foreground">
                      {bestOffer.price}<span className="text-[22px] align-top ml-1">€</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block frame-label text-foreground/45 mb-1">mis à jour</span>
                    <span className="text-[12px] font-mono text-foreground/55 flex items-center gap-1.5 justify-end">
                      <span className="block w-1.5 h-1.5 rounded-full bg-green-500" />
                      récemment
                    </span>
                  </div>
                </div>
                {/* Toutes les offres en rows uniformes */}
                <div className="space-y-2">
                  {sortedOffers.map((offer, idx) => (
                    <OfferRow key={idx} offer={offer} isPrimary={idx === 0} />
                  ))}
                </div>
              </div>
            )}

            {/* Trust — masqué temporairement */}
            <div className="hidden grid-cols-3 gap-3">
              {[
                { label: 'Indépendant', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D3B27B" strokeWidth="1.4" aria-hidden><path d="M12 2 4 6v6c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V6l-8-4Z"/></svg> },
                { label: 'Testé studio', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D3B27B" strokeWidth="1.4" aria-hidden><path d="M20 7 9 18l-5-5"/></svg> },
                { label: 'Prix live', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D3B27B" strokeWidth="1.4" aria-hidden><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg> },
              ].map(item => (
                <div key={item.label} className="text-center p-3">
                  <div className="flex justify-center mb-2">{item.icon}</div>
                  <p className="text-[10px] font-mono text-foreground/55 uppercase tracking-wider">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TABS — masqué temporairement ─────────────────── */}
        <div className="hidden mt-20 border-t border-border/60 pt-2">

          {/* Tab bar */}
          <div className="flex items-center gap-8 border-b border-border/60 mb-12">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'relative pb-3 text-[13px] font-medium transition-colors',
                  activeTab === tab.id
                    ? 'text-foreground font-semibold'
                    : 'text-foreground/55 hover:text-foreground'
                )}
              >
                {tab.label}
                {tab.count && <span className="ml-1 text-[11px] font-mono text-foreground/40">({tab.count.toLocaleString()})</span>}
                {activeTab === tab.id && (
                  <span className="absolute left-0 bottom-0 w-full h-[2px] bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab: Description */}
          {activeTab === 'desc' && (
            <div className="grid grid-cols-12 gap-12">
              <div className="col-span-12 lg:col-span-7">
                {product.description ? (
                  <div
                    className="prose-fluxlab"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                ) : (
                  <p className="text-[15px] text-foreground/65 font-light">Aucune description disponible.</p>
                )}
              </div>
              <div className="col-span-12 lg:col-span-5">
                {((product.pros?.length ?? 0) > 0 || (product.cons?.length ?? 0) > 0) && (
                  <div className="bg-secondary rounded-2xl border border-border/70 p-6 space-y-5">
                    {(product.pros?.length ?? 0) > 0 && (
                      <>
                        <p className="frame-label text-primary">Points forts</p>
                        <ul className="space-y-3">
                          {product.pros!.map((pro, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D3B27B" strokeWidth="2" className="mt-0.5 shrink-0" aria-hidden><path d="M20 6 9 17l-5-5"/></svg>
                              <span className="text-[13px] text-foreground/80">{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {(product.cons?.length ?? 0) > 0 && (
                      <div className="pt-4 border-t border-border/60">
                        <p className="frame-label text-foreground/45 mb-3">Points d&apos;attention</p>
                        <ul className="space-y-3">
                          {product.cons!.map((con, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6F6F6F" strokeWidth="2" className="mt-0.5 shrink-0" aria-hidden><path d="M12 9v4"/><circle cx="12" cy="17" r="1"/></svg>
                              <span className="text-[13px] text-foreground/65">{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab: Specs */}
          {activeTab === 'specs' && (
            <div className="max-w-3xl">
              <h2 className="font-serif text-foreground text-[28px] tracking-tight mb-8">
                Caractéristiques <span className="italic text-primary">techniques</span>
              </h2>
              {specs.length > 0 ? (
                <div className="space-y-0">
                  {specs.map(([key, val]) => (
                    <div key={key} className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-1 sm:gap-4 py-4 border-b border-border/60 last:border-b-0">
                      <span className="frame-label text-foreground/55">{key}</span>
                      <span className="text-[14px] text-foreground font-mono break-words">{String(val)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-foreground/55 text-[14px] font-light">Aucune fiche technique disponible.</p>
              )}
            </div>
          )}

          {/* Tab: Compatibilité */}
          {activeTab === 'compat' && (
            <div className="max-w-4xl">
              <h2 className="font-serif text-foreground text-[28px] tracking-tight mb-3">
                Compatibilité <span className="italic text-primary">vérifiée</span>
              </h2>
              <p className="text-[14px] text-foreground/65 mb-10 font-light">
                Interfaces et accessoires testés avec ce produit par notre équipe.
              </p>
              <div className="space-y-4">
                {sortedOffers.map((offer, idx) => (
                  <div key={idx} className="flex items-center gap-5 p-5 bg-white rounded-2xl border border-border/70">
                    <div className="w-14 h-14 rounded-xl bg-secondary border border-border flex items-center justify-center shrink-0">
                      <span className="text-[16px] font-mono text-foreground/50 font-semibold">
                        {offer.merchant_name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-serif text-[17px] text-foreground">{offer.merchant_name}</span>
                        <span className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider',
                          offer.in_stock
                            ? 'bg-green-50 border border-green-200 text-green-700'
                            : 'bg-amber-50 border border-amber-200 text-amber-700'
                        )}>
                          {offer.in_stock ? 'En stock' : 'Rupture'}
                        </span>
                      </div>
                      <span className="text-[12px] font-mono text-foreground/55">{offer.price}€</span>
                    </div>
                  </div>
                ))}
                {sortedOffers.length === 0 && (
                  <p className="text-foreground/55 text-[14px] font-light">Aucune information de compatibilité disponible.</p>
                )}
              </div>
            </div>
          )}

          {/* Tab: Avis */}
          {activeTab === 'avis' && (
            <div className="max-w-3xl">
              <h2 className="font-serif text-foreground text-[28px] tracking-tight mb-8">
                Ce qu&apos;en disent <span className="italic text-primary">les créateurs</span>
              </h2>

              {(product.rating || 0) > 0 && (
                <div className="flex items-center gap-8 p-6 bg-secondary rounded-2xl border border-border/70 mb-10">
                  <div className="text-center shrink-0">
                    <p className="font-serif text-[52px] leading-none text-foreground mb-1">{product.rating}</p>
                    <Stars rating={product.rating || 0} size={12} />
                    <p className="text-[11px] font-mono text-foreground/55 mt-1">{(product.review_count || 0).toLocaleString()} avis</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map(star => {
                      const pct = star === Math.round(product.rating || 0) ? 65 : star === Math.round(product.rating || 0) - 1 ? 25 : 5;
                      return (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-[11px] font-mono text-foreground/55 w-4">{star}</span>
                          <div className="flex-1 h-1.5 bg-border/60 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[11px] font-mono text-foreground/45 w-8">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Summary from DB */}
              {product.reviews_summary?.sentiment_summary && (
                <div className="p-5 bg-white rounded-xl border border-border/70">
                  <p className="frame-label text-primary mb-3">Synthèse</p>
                  <p className="text-[14px] text-foreground/75 leading-[1.7] font-light">
                    {product.reviews_summary.sentiment_summary}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── PRODUITS LIÉS ────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <section className="mt-10 pt-10 border-t border-border/60">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="frame-label text-primary mb-4 flex items-center gap-3">
                  <span className="block w-8 h-px bg-primary" aria-hidden />
                  Complétez votre stack
                </p>
                <h2 className="font-serif text-foreground text-[36px] tracking-tight">
                  Souvent associés <span className="italic text-primary">à ce produit.</span>
                </h2>
              </div>
              <Link href={`/categorie/${categorySlug}`} className="hidden md:inline-flex items-center gap-2 text-[12px] font-mono uppercase tracking-wider text-foreground/70 hover:text-primary group transition-colors">
                <span>Voir la catégorie</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform" aria-hidden><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map(related => (
                <Link
                  key={related.id}
                  href={`/produit/${related.slug}`}
                  className="group flex gap-5 p-5 rounded-2xl border border-border/70 bg-card hover:border-primary/60 hover:shadow-lg transition-all"
                >
                  <div className="w-24 h-24 rounded-xl bg-white shrink-0 relative overflow-hidden border border-border/50">
                    {related.image_url && (
                      <Image src={cleanImageUrl(related.image_url)} alt={related.name} fill sizes="96px" className="object-contain p-2" loading="lazy" />
                    )}
                  </div>
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <p className="frame-label text-foreground/50 mb-1">{related.brand}</p>
                      <h4 className="font-serif text-[17px] text-foreground leading-[1.25] group-hover:text-primary transition-colors truncate">{related.name}</h4>
                    </div>
                    <span className="font-serif text-[20px] text-foreground">≈ {related.price}€</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
