import { Metadata } from "next";
import { createClient } from "@/lib/supabase";
import { transformProduct } from "@/lib/transformers";
import { Product } from "@/types/database";
import Link from "next/link";
import Image from "next/image";
import { HeroSection } from "@/components/client/HeroSection";
import dynamic from "next/dynamic";
const ProductCard = dynamic(() => import("@/components/ui/ProductCard").then(mod => mod.ProductCard));
import { ARTICLES } from "@/lib/articles-meta";
import { JsonLd } from "@/components/server/JsonLd";

export const metadata: Metadata = {
  title: { absolute: "Fluxlab | Comparateur Matériel Audio, Vidéo, Streaming" },
  description:
    "Comparateur indépendant multi-boutiques et guides d'achat spécialisés pour créateurs. Trouvez le meilleur prix parmi Amazon, Thomann, Woodbrass et plus.",
  alternates: { canonical: "https://fluxlab.fr" },
};

export const revalidate = 0;

async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createClient();
  const slugs = [
    "focusrite-scarlett-2i2-4th-gen",
    "shure-sm7b",
    "sony-zv-e10",
    "elgato-stream-deck-mk2",
  ];
  const { data } = await supabase
    .from("products")
    .select("*, product_offers(*)")
    .in("slug", slugs);
  if (!data) return [];
  const items = (data as any[]).map((p) => transformProduct(p));
  return items.sort((a, b) => slugs.indexOf(a.slug) - slugs.indexOf(b.slug));
}

// Images des catégories archivées dans /public/images/categories/ (cat-micro.webp, cat-camera.webp, etc.)

/* ─── GUIDES ─────────────────────────────────────────────── */
function getGuides() {
  const slugs = [
    "meilleur-micro-podcast-2026",
    "xlr-vs-usb",
    "top-5-interfaces",
    "setup-youtube-debutant-2026",
  ];
  return ARTICLES.filter(a => slugs.includes(a.slug)).sort(
    (a, b) => slugs.indexOf(a.slug) - slugs.indexOf(b.slug)
  );
}

export default async function HomePage() {
  const [featuredProducts] = await Promise.all([getFeaturedProducts()]);
  const guides = getGuides();
  const [featuredGuide, ...secondaryGuides] = guides;

  /* ── Schema.org ───────────────────────────────────────────── */
  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://fluxlab.fr/#webpage",
    url: "https://fluxlab.fr",
    name: "Fluxlab — Comparateur matériel Audio, Vidéo & Streaming",
    description: "Comparateur indépendant multi-boutiques et guides d'achat pour créateurs. Trouvez le meilleur prix parmi Amazon, Thomann, Woodbrass et plus.",
    isPartOf: { "@id": "https://fluxlab.fr/#website" },
    about: {
      "@type": "Thing",
      name: "Matériel audio vidéo streaming pour créateurs de contenu",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: "https://fluxlab.fr" },
      ],
    },
  };

  // Produits mis en avant → ItemList pour Google Shopping / Rich results
  const featuredProductsSchema = featuredProducts.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Sélections expertes Fluxlab",
    description: "Les indispensables sélectionnés par la rédaction Fluxlab",
    numberOfItems: featuredProducts.length,
    itemListElement: featuredProducts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://fluxlab.fr/produit/${p.slug}`,
      name: p.name,
    })),
  } : null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <JsonLd data={homePageSchema} />
      {featuredProductsSchema && <JsonLd data={featuredProductsSchema} />}

      {/* ═══ HERO ═══ */}
      <HeroSection />

      {/* ═══ SÉLECTIONS EXPERTES ═══ */}
      <section className="bg-background py-24 border-b border-border/40">
        <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-16">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="frame-label text-primary mb-4 flex items-center gap-3">
                <span className="block w-8 h-px bg-primary" aria-hidden />
                Sélections expertes — N° 01
              </p>
              <h2 className="font-serif text-foreground text-[30px] sm:text-[44px] md:text-[56px] leading-[1.1] sm:leading-[1.05] tracking-tight max-w-2xl">
                Les indispensables<br />
                <span className="italic text-primary">sélectionnés par la rédaction.</span>
              </h2>
            </div>
            <Link href="/categorie/audio" className="hidden md:inline-flex items-center gap-2 text-[12px] font-mono text-foreground/50 hover:text-primary transition-colors uppercase tracking-wider">
              <span>Voir tout l&apos;audio</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-12 flex items-center justify-center">
            <Link href="/categorie/audio" className="group inline-flex items-center gap-3 h-12 px-6 rounded-full border border-foreground/15 text-foreground text-[12px] font-mono uppercase tracking-wider hover:border-primary hover:text-primary transition-colors">
              <span>Explorer la sélection audio</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform" aria-hidden><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ CTA LE LABO IA ═══ */}
      <section className="relative overflow-hidden py-32 grain" style={{
        background: `
          radial-gradient(ellipse 70% 60% at 75% 30%, rgba(211,178,123,.3) 0%, transparent 65%),
          radial-gradient(ellipse 50% 80% at 0% 100%, rgba(211,178,123,.1) 0%, transparent 50%),
          #0A0A0A
        `
      }}>
        <div className="absolute -top-32 left-1/3 w-[700px] h-[700px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(211,178,123,.3) 0%, transparent 65%)', filter: 'blur(30px)' }} aria-hidden />
        <div className="absolute inset-y-0 left-[-3vw] flex items-center pointer-events-none select-none" aria-hidden>
          <span className="font-serif italic leading-none text-white/[0.025] tracking-tighter" style={{ fontSize: '28vw' }}>F</span>
        </div>

        <div className="relative z-10 max-w-[1100px] mx-auto px-5 sm:px-8 lg:px-16 text-center">
          <p className="frame-label text-primary mb-6 inline-flex items-center gap-3">
            <span className="block w-8 h-px bg-primary" aria-hidden />
            Le Labo IA — N° 02
            <span className="block w-8 h-px bg-primary" aria-hidden />
          </p>
          <h2 className="font-serif text-white text-[44px] md:text-[68px] leading-[1.05] tracking-tight mb-8">
            Pas le temps de comparer&nbsp;?<br />
            <span className="animate-gradient-text italic">L&apos;IA compose pour vous.</span>
          </h2>
          <p className="text-[18px] text-white/65 leading-[1.65] font-light max-w-[640px] mx-auto mb-12">
            Indiquez votre métier, votre budget, votre acoustique — le Labo retourne un stack complet, testé, et déjà compatible.
          </p>
          <Link
            href="/configurateur"
            className="group inline-flex items-center justify-center gap-3 h-14 px-10 rounded-full bg-primary text-foreground font-medium text-[14px] tracking-wide uppercase transition-all hover:shadow-btn hover:bg-primary-hover"
          >
            <span>Lancer le configurateur</span>
            <svg className="group-hover:translate-x-1 transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </Link>
          <p className="text-[11px] font-mono text-white/35 mt-6 tracking-wider uppercase">3 minutes · gratuit · sans inscription</p>
        </div>
      </section>

      {/* ═══ L'AVANTAGE FLUXLAB — STACK ENGINE ═══ */}
      <section className="relative bg-secondary py-28 overflow-hidden border-b border-border/40">
        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(211,178,123,.2) 0%, transparent 65%)', filter: 'blur(60px)' }} aria-hidden />

        <div className="relative max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">

          {/* Left — copy */}
          <div className="col-span-12 lg:col-span-6">
            <p className="frame-label text-primary mb-5 flex items-center gap-3">
              <span className="block w-8 h-px bg-primary" aria-hidden />
              L'Avantage Fluxlab — N° 03
            </p>
            <h2 className="font-serif text-foreground text-[30px] sm:text-[44px] md:text-[56px] leading-[1.1] sm:leading-[1.05] tracking-tight mb-8">
              Nous ne vendons pas<br />
              un produit.<br />
              <span className="italic text-primary">Un résultat.</span>
            </h2>
            <p className="text-[18px] text-foreground/70 leading-[1.65] font-light max-w-[520px] mb-12">
              Notre moteur analyse la compatibilité électrique, audio et logicielle entre des milliers de références — pour que vous n'ayez plus à le faire.
            </p>
            <ul className="space-y-7 max-w-[520px]">
              {[
                { num: "I.", title: "Indépendance totale", desc: "Nous mixons Shure, Sony, Elgato pour le meilleur résultat. Aucune marque ne nous dicte rien." },
                { num: "II.", title: "La logique de stack", desc: "Pas juste un produit — votre stack : le bon micro, la bonne interface, le bon logiciel." },
                { num: "III.", title: "Gain de temps", desc: "Fini les soirées à comparer 40 reviews. Nos configurations sont vérifiées composant par composant." },
              ].map((item) => (
                <li key={item.num} className="flex gap-5">
                  <span className="frame-label text-primary mt-1.5 shrink-0">{item.num}</span>
                  <div>
                    <h4 className="font-serif text-[20px] text-foreground mb-1.5">{item.title}</h4>
                    <p className="text-[15px] text-foreground/65 leading-relaxed font-light">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — Stack Engine Card */}
          <div className="col-span-12 lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[460px]">
              <div className="absolute -top-8 -right-8 w-[140%] h-[140%] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(211,178,123,.25) 0%, transparent 60%)', filter: 'blur(50px)' }} aria-hidden />

              <div className="relative bg-card border border-border/70 rounded-2xl overflow-hidden shadow-[0_30px_60px_-25px_rgba(15,15,15,.3)]">
                {/* Header */}
                <div className="bg-deep text-white px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="block w-1.5 h-1.5 rounded-full bg-green-400" style={{ boxShadow: '0 0 8px rgba(74,222,128,.6)' }} />
                    <span className="frame-label text-white/85">Analyse en cours</span>
                  </div>
                  <span className="frame-label text-primary">Synergie · 98 / 100</span>
                </div>

                <div className="p-5 space-y-2">
                  {/* Source */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/40 border border-border/70">
                    <div className="w-12 h-12 rounded-lg bg-white border border-border flex items-center justify-center shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F0F0F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-[16px] text-foreground">Shure SM7B</span>
                        <span className="frame-label text-foreground/60 bg-accent px-1.5 py-0.5 rounded">Source</span>
                      </div>
                      <span className="text-[11px] font-mono text-foreground/55">Dynamique · Cardioïde · XLR</span>
                    </div>
                  </div>

                  {/* Connector */}
                  <div className="flex items-center gap-3 pl-6">
                    <div className="h-6 w-px bg-border" />
                    <span className="frame-label text-foreground/45 bg-card border border-border px-2 py-1 rounded-full">Câble XLR · 5 m</span>
                  </div>

                  {/* Interface */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/[0.08] border border-primary/30">
                    <div className="w-12 h-12 rounded-lg bg-white border border-primary/30 flex items-center justify-center shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D3B27B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-serif text-[16px] text-foreground">Focusrite Scarlett 2i2</span>
                        <span className="frame-label text-primary bg-white px-1.5 py-0.5 rounded border border-primary/30">Compatible</span>
                      </div>
                      <span className="text-[11px] font-mono text-foreground/65 flex items-center gap-1.5">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M20 6 9 17l-5-5"/></svg>
                        Préampli suffisant · +60 dB
                      </span>
                    </div>
                  </div>

                  {/* Connector */}
                  <div className="flex items-center gap-3 pl-6">
                    <div className="h-6 w-px bg-border" />
                    <span className="frame-label text-foreground/45 bg-card border border-border px-2 py-1 rounded-full">USB-C · 2.0</span>
                  </div>

                  {/* Output */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-accent/40 border border-accent">
                    <div className="w-12 h-12 rounded-lg bg-white border border-accent flex items-center justify-center shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F0F0F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-serif text-[16px] text-foreground">Ableton Live Lite</span>
                        <span className="frame-label text-foreground/60 bg-white px-1.5 py-0.5 rounded border border-foreground/15">Bundle</span>
                      </div>
                      <span className="text-[11px] font-mono text-foreground/55">Licence offerte avec l&apos;interface</span>
                    </div>
                  </div>
                </div>

                {/* Footer score */}
                <div className="bg-deep text-white px-6 py-5 flex items-center justify-between">
                  <div>
                    <p className="frame-label text-white/55 mb-1">Score de synergie</p>
                    <p className="font-serif text-[17px]">Excellente compatibilité</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-primary text-[38px] leading-none">98<span className="text-white/40 text-[16px]">/100</span></p>
                  </div>
                </div>
              </div>

              {/* Floating annotation */}
              <div className="absolute -bottom-6 -left-6 bg-white border border-border rounded-xl px-4 py-3 shadow-lg max-w-[200px]">
                <p className="frame-label text-primary mb-1">Verdict</p>
                <p className="text-[12px] text-foreground/75 leading-snug">Aucun préampli supplémentaire nécessaire — économie de 110€.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ GUIDES ÉDITORIAUX ═══ */}
      <section className="bg-background py-24 border-b border-border/40">
        <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-16">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="frame-label text-primary mb-4 flex items-center gap-3">
                <span className="block w-8 h-px bg-primary" aria-hidden />
                Le journal du Labo — N° 04
              </p>
              <h2 className="font-serif text-foreground text-[30px] sm:text-[44px] md:text-[56px] leading-[1.1] sm:leading-[1.05] tracking-tight max-w-2xl">
                Guides &amp; tests<br />
                <span className="italic text-primary">rédigés par des pros.</span>
              </h2>
            </div>
            <Link href="/guides" className="hidden md:inline-flex items-center gap-2 text-[12px] font-mono uppercase tracking-wider text-foreground/70 hover:text-primary group transition-colors">
              <span>Tous les guides</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform" aria-hidden><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Featured guide */}
            {featuredGuide && (
              <Link href={`/guide/${featuredGuide.slug}`} className="group col-span-12 lg:col-span-7 relative rounded-2xl overflow-hidden border border-border/70 hover:border-primary/60 transition-colors">
                <div className="aspect-[16/10] relative grain bg-[#0A0A0A]">
                  {featuredGuide.image && (
                    <Image src={featuredGuide.image} alt={featuredGuide.title} fill className="object-cover opacity-50 group-hover:opacity-60 transition-opacity" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute top-6 left-6 flex items-center gap-3 z-10">
                    <span className="frame-label text-primary bg-primary/15 backdrop-blur px-3 py-1.5 rounded-full">Guide complet</span>
                    <span className="frame-label text-white/55">{featuredGuide.readTime} de lecture</span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/90 to-transparent z-10">
                    <p className="frame-label text-white/45 mb-3">{featuredGuide.category}</p>
                    <h3 className="font-serif text-white text-[32px] md:text-[40px] leading-[1.05] tracking-tight mb-3 max-w-2xl">
                      {featuredGuide.title}
                    </h3>
                    <div className="flex items-center gap-4 text-[12px] text-white/55 font-mono">
                      <span>Par l&apos;équipe Fluxlab</span>
                      <span>·</span>
                      <span>{featuredGuide.date}</span>
                      <span className="ml-auto text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Lire
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Secondary guides */}
            <div className="col-span-12 lg:col-span-5 grid grid-cols-1 gap-6">
              {secondaryGuides.slice(0, 3).map((guide) => (
                <Link key={guide.id} href={`/guide/${guide.slug}`} className="group flex gap-5 p-5 rounded-2xl border border-border/70 bg-card hover:border-primary/60 hover:shadow-lg transition-all">
                  <div className="w-28 h-28 rounded-xl bg-secondary shrink-0 relative overflow-hidden">
                    {guide.image
                      ? <Image src={guide.image} alt={guide.title} fill className="object-cover" sizes="112px" />
                      : <svg viewBox="0 0 200 200" className="absolute inset-0 m-auto w-[80%] h-[80%]" fill="#1f1f1f" aria-hidden>
                          <rect x="85" y="20" width="30" height="95" rx="14"/><rect x="74" y="48" width="52" height="42" rx="10" fill="#3a3a3a"/>
                          <rect x="97" y="115" width="6" height="35"/><rect x="70" y="150" width="60" height="6" rx="2"/>
                        </svg>
                    }
                  </div>
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <p className="frame-label text-foreground/50 mb-2">{guide.category}</p>
                      <h4 className="font-serif text-[18px] text-foreground leading-[1.25] group-hover:text-primary transition-colors">{guide.title}</h4>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-foreground/45">
                      <span>{guide.readTime}</span>
                      <span>·</span>
                      <span>{guide.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>


    </main>
  );
}
