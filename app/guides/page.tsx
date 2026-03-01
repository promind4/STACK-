import { Metadata } from 'next';
import Link from 'next/link';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';
import { ARTICLES, PATHWAYS } from '@/lib/data';
import GuidesClient from '@/components/client/GuidesClient';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Guides & Tutoriels pour Créateurs | Fluxlab',
    description: 'Des guides pratiques, des comparatifs honnêtes et des tutoriels techniques pour maîtriser votre matériel audio, vidéo et streaming.',
    alternates: { canonical: 'https://fluxlab.fr/guides' },
};

export default function GuidesPage() {
    const sortedArticles = [...ARTICLES].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const heroArticle = sortedArticles[0];
    const otherArticles = sortedArticles.slice(1);
    const categories = ["Tous", ...Array.from(new Set(ARTICLES.map(a => a.category)))];

    return (
        <div className="min-h-screen bg-background text-foreground">

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
                    <div className="relative rounded-3xl overflow-hidden aspect-[21/9] group cursor-pointer shadow-2xl shadow-black/5">
                        <Link href={`/guide/${heroArticle.slug}`} className="absolute inset-0 z-20" />
                        <Image
                            src={heroArticle.image}
                            alt={heroArticle.title}
                            fill
                            priority
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                        <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-3xl z-10">
                            <div className="flex items-center gap-3 mb-4 text-white/80 text-sm font-medium">
                                <span className="bg-primary text-white px-2 py-0.5 rounded uppercase text-xs font-bold">À LA UNE</span>
                                <span className="bg-white/20 backdrop-blur px-2 py-0.5 rounded uppercase text-xs font-bold">{heroArticle.category}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {heroArticle.readTime}</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight font-serif">
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

            {/* PARCOURS (Pathways) — SSR */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-6 max-w-[1200px]">
                    <h3 className="text-2xl font-bold mb-10 flex items-center gap-2 font-serif">
                        <Sparkles className="w-6 h-6 text-primary" />
                        Quel est votre objectif ?
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {PATHWAYS.map((path) => (
                            <div
                                key={path.id}
                                className="rounded-2xl border border-border bg-card overflow-hidden group cursor-pointer flex flex-col h-full shadow-sm hover:shadow-md transition-shadow"
                            >
                                <Link href={`/guide-path/${path.slug}`} className="flex flex-col h-full">
                                    {/* Image Header */}
                                    <div className="h-40 overflow-hidden relative">
                                        <Image
                                            src={path.image}
                                            alt={path.title}
                                            fill
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-4 left-6">
                                            <h4 className="text-xl font-bold text-white font-serif">{path.title}</h4>
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-1">
                                        <p className="text-sm text-muted-foreground mb-6 flex-1 font-light leading-relaxed">
                                            {path.subtitle}
                                        </p>
                                        <div className="flex items-center text-sm font-bold text-primary group-hover:translate-x-1 transition-transform mt-auto">
                                            Voir le parcours <ArrowRight className="w-4 h-4 ml-1" />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
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
