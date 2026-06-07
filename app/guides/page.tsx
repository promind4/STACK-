import { Metadata } from 'next';
import Link from 'next/link';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';
import { ARTICLES } from '@/lib/articles-meta';
import { PATHWAYS } from '@/lib/data';
import GuidesClient from '@/components/client/GuidesClient';
import Image from 'next/image';
import { JsonLd } from '@/components/server/JsonLd';

export const metadata: Metadata = {
    title: 'Guides & Tutoriels pour Créateurs',
    description: 'Des guides pratiques, des comparatifs honnêtes et des tutoriels techniques pour maîtriser votre matériel audio, vidéo et streaming.',
    alternates: { canonical: 'https://fluxlab.fr/guides' },
};

export default function GuidesPage() {
    const sortedArticles = [...ARTICLES].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const heroArticle = sortedArticles[0];
    const otherArticles = sortedArticles.slice(1);
    const categories = ["Tous", ...Array.from(new Set(ARTICLES.map(a => a.category)))];

    /* ── Schema.org ───────────────────────────────────────────── */
    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": "https://fluxlab.fr/guides/#webpage",
        url: "https://fluxlab.fr/guides",
        name: "Guides & Tutoriels pour Créateurs | Fluxlab",
        description: "Des guides pratiques, comparatifs et tutoriels techniques pour maîtriser votre matériel audio, vidéo et streaming.",
        isPartOf: { "@id": "https://fluxlab.fr/#website" },
        breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Accueil", item: "https://fluxlab.fr" },
                { "@type": "ListItem", position: 2, name: "Guides & Tutoriels", item: "https://fluxlab.fr/guides" },
            ],
        },
    };

    const articlesListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Guides Fluxlab — Matériel audio vidéo streaming",
        numberOfItems: sortedArticles.length,
        itemListElement: sortedArticles.map((a, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `https://fluxlab.fr/guide/${a.slug}`,
            name: a.title,
        })),
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <JsonLd data={collectionSchema} />
            <JsonLd data={articlesListSchema} />

            {/* HERO GUIDES */}
            <section className="pt-32 pb-20 bg-secondary/30 border-b border-border">
                <div className="container mx-auto px-6 max-w-[1200px]">
                    <div className="text-center mb-16">
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                            Fluxlab Academy
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 font-serif">Guides &amp; Tutoriels pour Créateurs.</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
                            Des guides pratiques, des comparatifs honnêtes et des tutoriels techniques pour maîtriser votre matériel.
                        </p>
                    </div>

                    {/* FEATURED ARTICLE (SSR) */}
                    <div className="relative rounded-3xl overflow-hidden aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9] group cursor-pointer shadow-2xl shadow-black/5">
                        <Link href={`/guide/${heroArticle.slug}`} className="absolute inset-0 z-20" />
                        <Image
                            src={heroArticle.image}
                            alt={`${heroArticle.title} – Guide ${heroArticle.category} | Fluxlab`}
                            fill
                            priority
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                        <div className="absolute bottom-0 left-0 p-6 sm:p-8 md:p-12 max-w-3xl z-10">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 text-white/80 text-sm font-medium">
                                <span className="bg-primary text-white px-2 py-0.5 rounded uppercase text-xs font-bold">À LA UNE</span>
                                <span className="bg-white/20 backdrop-blur px-2 py-0.5 rounded uppercase text-xs font-bold">{heroArticle.category}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {heroArticle.readTime}</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 leading-tight font-serif">
                                {heroArticle.title}
                            </h2>
                            <p className="text-lg text-white/80 mb-8 line-clamp-2 md:line-clamp-none font-light">
                                {heroArticle.intro}
                            </p>
                            <span className="inline-flex items-center px-6 py-3 bg-white text-black hover:bg-white/90 border border-white/50 shadow-lg font-bold rounded-lg text-sm">
                                Lire l&apos;article <ArrowRight className="w-4 h-4 ml-2" />
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ARTICLES GRID + CLIENT FILTERS */}
            <section className="py-20 bg-[#F9F9F9] border-t border-border/50">
                <div className="container mx-auto px-6 max-w-[1200px]">
                    <GuidesClient articles={otherArticles} categories={categories} />
                </div>
            </section>

        </div>
    );
}
