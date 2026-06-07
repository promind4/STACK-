import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';
import { getPathwayBySlug, PATHWAYS } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return PATHWAYS.map((p) => ({
        slug: p.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const pathway = getPathwayBySlug(slug);
    if (!pathway) return { title: 'Parcours introuvable' };

    const title = `${pathway.title} — Parcours Guidé`;
    const rawDesc = pathway.subtitle || '';
    const desc = rawDesc.length > 160
        ? rawDesc.substring(0, rawDesc.lastIndexOf(' ', 157)) + '…'
        : rawDesc;

    return {
        title,
        description: desc,
        alternates: { canonical: `https://fluxlab.fr/guide-path/${slug}` },
        openGraph: { title, description: desc },
    };
}

export default async function GuidePathPage({ params }: Props) {
    const { slug } = await params;
    const pathway = getPathwayBySlug(slug);

    if (!pathway) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background text-foreground">

            {/* HERO PATH */}
            <section className="pt-32 pb-24 relative overflow-hidden bg-foreground">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={pathway.image}
                        alt={pathway.title}
                        fill
                        sizes="100vw"
                        className="object-cover opacity-30 blur-sm scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/60" />
                </div>

                <div className="container mx-auto px-6 max-w-[1000px] relative z-10">
                    <Link
                        href="/guides"
                        className="group flex items-center text-sm font-medium text-white/70 hover:text-white transition-colors mb-8"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                        Tous les parcours
                    </Link>

                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm text-white">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            Parcours Guidé
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 font-serif text-white">
                            {pathway.title}
                        </h1>
                        <p className="text-xl text-white/80 font-light max-w-2xl mx-auto">
                            {pathway.subtitle}
                        </p>
                    </div>
                </div>
            </section>

            {/* TIMELINE STEPS */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-6 max-w-[800px]">
                    <div className="relative border-l-2 border-border/50 ml-4 md:ml-0 space-y-16">

                        {pathway.steps.map((step, index) => (
                            <div
                                key={index}
                                className="relative pl-12"
                            >
                                {/* Number Bubble */}
                                <div className="absolute -left-[21px] top-0 w-10 h-10 rounded-full bg-background border-4 border-secondary flex items-center justify-center font-bold text-primary shadow-sm z-10">
                                    {step.order}
                                </div>

                                <div className="bg-white border border-border rounded-2xl p-8 hover:border-primary/30 transition-colors shadow-sm group">
                                    <h3 className="text-2xl font-bold mb-3 font-serif">{step.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed mb-6 font-light">
                                        {step.desc}
                                    </p>

                                    {step.articleSlug ? (
                                        <Link
                                            href={`/guide/${step.articleSlug}`}
                                            className="inline-flex items-center px-4 py-2 rounded-lg border border-border text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors group/btn"
                                        >
                                            <BookOpen className="w-4 h-4 mr-2 text-muted-foreground group-hover/btn:text-primary transition-colors" />
                                            Lire le guide dédié
                                            <ArrowRight className="w-4 h-4 ml-2 opacity-50 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    ) : (
                                        <div className="inline-flex items-center text-xs font-medium text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full border border-border/50">
                                            Bientôt disponible
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* FINAL CTA */}
                        <div className="relative pl-12 pt-8">
                            <div className="absolute -left-[9px] top-8 w-4 h-4 rounded-full bg-primary animate-pulse" />
                            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
                                <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
                                <h3 className="text-2xl font-bold mb-2">Prêt à vous lancer ?</h3>
                                <p className="text-muted-foreground mb-6">
                                    Vous avez toutes les connaissances. Il est temps de construire votre setup.
                                </p>
                                <Link
                                    href={`/categorie/${pathway.ctaCategory}`}
                                    className="inline-flex items-center px-8 py-3 bg-primary text-white hover:bg-primary/90 rounded-xl text-sm font-bold transition-colors"
                                >
                                    Voir les produits recommandés
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    );
}
