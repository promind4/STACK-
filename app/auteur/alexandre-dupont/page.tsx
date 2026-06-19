import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Mic, Headphones, Radio, SlidersHorizontal } from 'lucide-react';
import { ARTICLES } from '@/lib/articles-meta';
import { JsonLd } from '@/components/server/JsonLd';

export const metadata: Metadata = {
    title: 'Alexandre Dupont — Expert Audio & Home Studio | Fluxlab',
    description: "Alexandre Dupont est spécialiste en matériel audio et home studio. Il rédige les guides techniques de Fluxlab sur les interfaces audio, micros dynamiques, acoustique et setups podcast.",
    alternates: { canonical: 'https://fluxlab.fr/auteur/alexandre-dupont' },
    openGraph: {
        title: 'Alexandre Dupont — Expert Audio & Home Studio',
        description: "Spécialiste interfaces audio, micros dynamiques et setups podcast. Rédacteur technique chez Fluxlab.",
        url: 'https://fluxlab.fr/auteur/alexandre-dupont',
    },
};

const EXPERTISES = [
    { icon: <Mic className="w-5 h-5" />, label: "Micros dynamiques & à condensateur" },
    { icon: <SlidersHorizontal className="w-5 h-5" />, label: "Interfaces audio & préamplis" },
    { icon: <Radio className="w-5 h-5" />, label: "Setups podcast & streaming" },
    { icon: <Headphones className="w-5 h-5" />, label: "Acoustique & traitement de pièce" },
];

const authorArticles = ARTICLES.filter(a => a.author === 'Alexandre Dupont');

export default function AlexandreDupontPage() {
    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Alexandre Dupont",
        url: "https://fluxlab.fr/auteur/alexandre-dupont",
        jobTitle: "Spécialiste Audio & Home Studio",
        worksFor: {
            "@type": "Organization",
            name: "Fluxlab",
            url: "https://fluxlab.fr",
        },
        knowsAbout: [
            "Interfaces audio",
            "Microphones dynamiques",
            "Home studio",
            "Podcast",
            "Acoustique",
            "Streaming audio",
        ],
        description: "Spécialiste en matériel audio et home studio, Alexandre Dupont analyse les interfaces audio, micros et équipements podcast pour les créateurs de contenu francophones.",
    };

    return (
        <>
            <JsonLd data={personSchema} />

            <div className="min-h-screen bg-background text-foreground">

                {/* HERO */}
                <section className="pt-32 pb-20 bg-secondary/20 border-b border-border/50">
                    <div className="container mx-auto px-6 max-w-[900px]">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-10">

                            {/* Avatar */}
                            <div className="shrink-0">
                                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm">
                                    <span className="text-4xl sm:text-5xl font-bold text-primary font-serif select-none">AD</span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="text-center sm:text-left">
                                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                                    Rédacteur Expert
                                </span>
                                <h1 className="text-3xl sm:text-4xl font-bold font-serif text-foreground mb-2">
                                    Alexandre Dupont
                                </h1>
                                <p className="text-lg text-muted-foreground font-light mb-5">
                                    Spécialiste Audio & Home Studio — Fluxlab
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                    {EXPERTISES.map((e, i) => (
                                        <span
                                            key={i}
                                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-border text-xs font-medium text-muted-foreground"
                                        >
                                            {e.icon}
                                            {e.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* BIO */}
                <section className="py-16 bg-background">
                    <div className="container mx-auto px-6 max-w-[900px]">
                        <div className="grid md:grid-cols-[2fr_1fr] gap-12 items-start">
                            <div>
                                <h2 className="text-2xl font-bold font-serif mb-6">À propos</h2>
                                <div className="space-y-4 text-muted-foreground leading-relaxed">
                                    <p>
                                        Alexandre Dupont s&apos;intéresse au matériel audio depuis plus de dix ans, époque à laquelle il a monté son premier home studio dans une chambre de 12 m² avec des panneaux acoustiques DIY et une interface à 99€. Depuis, il a testé et documenté des dizaines de setups — du micro USB à 50€ au préampli Class-A de studio.
                                    </p>
                                    <p>
                                        Chez Fluxlab, il est responsable des <strong>guides techniques audio</strong> : comparatifs d&apos;interfaces, analyses de micros dynamiques, setups podcast optimisés par budget. Son approche est systématiquement centrée sur le <strong>rapport qualité/prix réel</strong> et la compatibilité des composants entre eux — pas sur les fiches marketing.
                                    </p>
                                    <p>
                                        Sa conviction : la plupart des débutants surestiment l&apos;importance du micro et sous-estiment celle du préampli et de l&apos;acoustique. Ses guides cherchent à corriger ça avec des arguments techniques accessibles, sans jargon inutile.
                                    </p>
                                </div>
                            </div>

                            {/* Méthodologie */}
                            <div className="bg-secondary/40 rounded-2xl p-6 border border-border/60">
                                <h3 className="font-bold text-foreground mb-4 font-serif">Méthodologie</h3>
                                <ul className="space-y-3 text-sm text-muted-foreground">
                                    {[
                                        "Specs techniques vérifiées sur les datasheets fabricants",
                                        "Prix comparés sur Thomann, Amazon et Woodbrass",
                                        "Retours d'expérience communauté FR (forums, Reddit)",
                                        "Mise à jour lors de chaque nouvelle génération de produit",
                                        "Aucun placement de marque ni contenu sponsorisé",
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ARTICLES */}
                <section className="py-16 bg-[#F9F9F9] border-t border-border/50">
                    <div className="container mx-auto px-6 max-w-[900px]">
                        <h2 className="text-2xl font-bold font-serif mb-8">
                            Articles publiés ({authorArticles.length})
                        </h2>

                        <div className="grid gap-4">
                            {authorArticles.map(article => (
                                <Link
                                    key={article.id}
                                    href={`/guide/${article.slug}`}
                                    className="group flex items-center gap-5 bg-card rounded-2xl border border-border p-5 hover:border-primary/30 hover:shadow-sm transition-all"
                                >
                                    <div className="relative w-20 h-14 shrink-0 rounded-xl overflow-hidden bg-secondary">
                                        <Image
                                            src={article.image}
                                            alt={article.title}
                                            fill
                                            sizes="80px"
                                            className="object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            {article.category}
                                        </span>
                                        <h3 className="font-bold text-foreground text-sm sm:text-base leading-snug mt-0.5 line-clamp-2 group-hover:text-primary transition-colors">
                                            {article.title}
                                        </h3>
                                        <span className="text-xs text-muted-foreground">{article.updatedAt || article.date}</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </Link>
                            ))}
                        </div>

                        <div className="mt-10 pt-8 border-t border-border/50 text-center">
                            <Link
                                href="/guides"
                                className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
                            >
                                Voir tous les guides Fluxlab
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </section>

            </div>
        </>
    );
}
