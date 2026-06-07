import { Metadata } from "next";
import { createClient } from "@/lib/supabase";
import { transformProduct } from "@/lib/transformers";
import { Product } from "@/types/database";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Scale, Microscope, Sparkles, Users, BookOpen, ShoppingBag } from "lucide-react";
import { HeroSection } from "@/components/client/HeroSection";
import dynamic from "next/dynamic";
const ProductCard = dynamic(() => import("@/components/ui/ProductCard").then(mod => mod.ProductCard));
import { ARTICLES } from "@/lib/data";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Fluxlab | L'Expert Matériel Audio, Vidéo et Streaming",
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
  return items.sort(
    (a, b) => slugs.indexOf(a.slug) - slugs.indexOf(b.slug)
  );
}

function getPopularGuides() {
  const strategicSlugs = [
    "meilleur-micro-podcast-2026",
    "interface-audio-moins-de-100-euros",
    "shure-sm7b-vs-rode-podmic",
    "setup-streaming-debutant-2026",
    "meilleur-casque-studio-home-studio-2026",
    "setup-youtube-debutant-2026",
    "xlr-vs-usb"
  ];
  return ARTICLES.filter(a => strategicSlugs.includes(a.slug)).sort(
    (a, b) => strategicSlugs.indexOf(a.slug) - strategicSlugs.indexOf(b.slug)
  );
}

// Badge overrides for featured products
const BADGE_OVERRIDES: Record<string, { text: string; color: string }> = {
  "shure-sm7b": { text: "Choix n°1", color: "bg-amber-100 text-amber-800 border-amber-200" },
  "focusrite-scarlett-2i2-4th-gen": { text: "Idéal Débutant", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
};

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
  const popularGuides = getPopularGuides();

  // Apply badge overrides
  const productsWithBadges = featuredProducts.map((p) => {
    const override = BADGE_OVERRIDES[p.slug];
    if (override) {
      return { ...p, badge: override };
    }
    return p;
  });

  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* ═══ SECTION 1 : HERO HEADER ═══ */}
      <HeroSection />

      {/* ═══ SECTION 1.5 : PREUVE SOCIALE ═══ */}
      <section className="py-8 border-b border-border/40 bg-secondary/20">
        <div className="container mx-auto px-6 max-w-[1600px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-border/40">
            <div className="flex flex-col items-center text-center py-2 md:py-0">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-2xl font-bold text-foreground">+3 500</span>
              </div>
              <span className="text-xs text-muted-foreground font-light">créateurs accompagnés</span>
            </div>
            <div className="flex flex-col items-center text-center py-2 md:py-0">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-2xl font-bold text-foreground">+1 200</span>
              </div>
              <span className="text-xs text-muted-foreground font-light">configurateurs lancés</span>
            </div>
            <div className="flex flex-col items-center text-center py-2 md:py-0">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-2xl font-bold text-foreground">+40</span>
              </div>
              <span className="text-xs text-muted-foreground font-light">guides spécialisés</span>
            </div>
            <div className="flex flex-col items-center text-center py-2 md:py-0">
              <div className="flex items-center gap-2 mb-1">
                <ShoppingBag className="w-4 h-4 text-primary" />
                <span className="text-2xl font-bold text-foreground">+200</span>
              </div>
              <span className="text-xs text-muted-foreground font-light">produits comparés</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2 : PRODUITS STARS ═══ */}
      <section className="py-20 bg-background border-b border-border/40">
        <div className="container mx-auto px-6 max-w-[1600px]">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground">Les valeurs sûres validées par le Labo</h2>
              <p className="text-muted-foreground mt-2 max-w-xl">
                Le matériel le plus plébiscité par la communauté, avec nos conseils d&apos;experts pour garantir la compatibilité de votre stack.
              </p>
            </div>
            <Link href="/categorie/audio" className="hidden md:flex gap-2 items-center hover:text-primary px-4 py-2 text-sm font-bold transition-colors uppercase tracking-widest">
              Voir le catalogue complet <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productsWithBadges.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-10 text-center md:hidden">
            <Link href="/categorie/audio" className="inline-flex items-center justify-center gap-2 bg-secondary text-foreground px-8 py-4 rounded-xl text-sm font-bold transition-colors w-full">
              Voir le catalogue complet <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 4 : HUB DE CONTENU ═══ */}
      <section className="py-20 bg-secondary/30 border-b border-border/40">
        <div className="container mx-auto px-6 max-w-[1600px]">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground">Ne choisissez pas à l&apos;aveugle</h2>
              <p className="text-muted-foreground mt-2 max-w-xl">
                Lisez nos analyses détaillées avant de faire votre choix. Nous décortiquons chaque fonctionnalité et testons le matériel en conditions réelles.
              </p>
            </div>
            <Link href="/guides" className="hidden md:flex gap-2 items-center hover:text-primary px-4 py-2 text-sm font-bold transition-colors uppercase tracking-widest">
              Voir tous les guides <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {popularGuides.map((guide) => (
              <Link key={guide.id} href={`/guide/${guide.slug}`} className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col h-full">
                <div className="aspect-[16/9] relative overflow-hidden">
                  <Image src={guide.image} alt={`${guide.title} – Guide ${guide.category} | Fluxlab`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">{guide.category}</span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">{guide.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{guide.intro}</p>
                  <div className="mt-auto flex items-center text-sm font-bold text-primary">
                    Lire l&apos;analyse complète <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center md:hidden">
            <Link href="/guides" className="inline-flex items-center justify-center gap-2 bg-white text-foreground border border-border px-8 py-4 rounded-xl text-sm font-bold transition-colors w-full">
              Voir tous les guides <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 5 : E-E-A-T / MÉTHODOLOGIE ═══ */}
      <section className="py-24 bg-card border-b border-border/40">
        <div className="container mx-auto px-6 max-w-[1200px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">Notre Méthodologie</span>
              <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6 leading-tight">Un comparateur radicalement indépendant.</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Fluxlab n&apos;est sponsorisé par aucune marque. Nos recommandations sont basées sur des tests objectifs, des analyses de fiches techniques et les retours de la communauté des créateurs.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-foreground mb-1">Algorithme Neutre</strong>
                    <span className="text-muted-foreground text-sm">Le configurateur IA propose le matériel le plus adapté à vos besoins, pas celui qui nous rapporte le plus.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <Microscope className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-foreground mb-1">Tests Rigoureux</strong>
                    <span className="text-muted-foreground text-sm">Nous analysons chaque produit selon des critères stricts : qualité de fabrication, rapport qualité-prix, fonctionnalités clés.</span>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-foreground mb-1">Transparence Totale</strong>
                    <span className="text-muted-foreground text-sm">Nous affichons clairement nos liens d&apos;affiliation qui financent l&apos;hébergement du site, sans impacter le prix final pour vous.</span>
                  </div>
                </li>
              </ul>
              <Link href="/methodologie" className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-8 py-4 rounded-xl text-sm font-bold transition-all hover:scale-105 shadow-xl">
                Découvrir notre méthode <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-primary/5 rounded-3xl transform rotate-3 scale-105" />
              <div className="relative bg-white border border-border rounded-3xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="p-6 bg-secondary/50 rounded-2xl">
                    <h4 className="font-bold flex items-center gap-2 mb-2"><span className="w-2 h-2 rounded-full bg-green-500" /> E-E-A-T Guarantee</h4>
                    <p className="text-sm text-muted-foreground">Expertise, Authoritativeness, and Trustworthiness. Notre contenu est rédigé par des professionnels de l&apos;audiovisuel pour garantir sa pertinence.</p>
                  </div>
                  <div className="p-6 bg-secondary/50 rounded-2xl">
                    <h4 className="font-bold flex items-center gap-2 mb-2"><span className="w-2 h-2 rounded-full bg-blue-500" /> Mises à jour Régulières</h4>
                    <p className="text-sm text-muted-foreground">Les prix, les stocks et les recommandations sont vérifiés en continu pour garantir des informations fiables et fraîches.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 6 : ENCORE INDÉCIS ? (CTA CONFIGURATEUR) ═══ */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-[800px] text-center">
          <div className="border border-border rounded-3xl p-10 md:p-14">
            <h2 className="text-2xl md:text-3xl font-bold font-serif mb-4">
              Encore indécis ?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
              Notre configurateur IA analyse vos besoins, votre budget et votre environnement pour construire le stack parfait. Gratuit, sans inscription.
            </p>
            <Link
              href="/configurateur"
              className="inline-flex items-center justify-center rounded-full font-bold bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20 h-14 px-10 text-base transition-all hover:scale-105"
            >
              Lancer le Configurateur
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
