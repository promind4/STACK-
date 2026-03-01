import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, Clock, Calendar, ShoppingBag, ArrowRight } from 'lucide-react';
import { getArticleBySlug, ARTICLES } from '@/lib/data';
import { createClient } from '@/lib/supabase';
import { transformProduct } from '@/lib/transformers';
import { JsonLd } from '@/components/server/JsonLd';
import { notFound } from 'next/navigation';
import Image from 'next/image';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return ARTICLES.map((article) => ({
        slug: article.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const article = getArticleBySlug(slug);
    if (!article) return { title: 'Guide introuvable' };

    const rawDesc = article.intro || '';
    const desc = rawDesc.length > 160
        ? rawDesc.substring(0, rawDesc.lastIndexOf(' ', 157)) + '…'
        : rawDesc;

    return {
        title: `${article.title} — Guide | Fluxlab`,
        description: desc,
        alternates: {
            canonical: `https://fluxlab.fr/guide/${slug}`,
        },
        openGraph: {
            title: `${article.title} — Guide | Fluxlab`,
            description: desc,
            images: article.image ? [article.image] : [],
        },
    };
}

async function getRelatedProducts(slugs: string[]) {
    if (!slugs || slugs.length === 0) return [];

    const supabase = createClient();
    const { data } = await supabase
        .from('products')
        .select('*, product_offers(*)')
        .in('slug', slugs);

    if (!data) return [];
    return (data as any[]).map(p => transformProduct(p));
}

export default async function GuideArticlePage({ params }: Props) {
    const { slug } = await params;
    const article = getArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    const relatedItems = await getRelatedProducts(article.relatedProducts);

    // Article JSON-LD
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.intro,
        image: article.image,
        datePublished: article.date,
        author: {
            "@type": "Organization",
            name: "Équipe Fluxlab",
            url: "https://fluxlab.fr/a-propos",
        },
        publisher: {
            "@type": "Organization",
            name: "Fluxlab",
            logo: {
                "@type": "ImageObject",
                url: "https://fluxlab.fr/branding/logo.svg",
            },
        },
        mainEntityOfPage: `https://fluxlab.fr/guide/${slug}`,
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: "https://fluxlab.fr" },
            { "@type": "ListItem", position: 2, name: "Guides", item: "https://fluxlab.fr/guides" },
            { "@type": "ListItem", position: 3, name: article.title, item: `https://fluxlab.fr/guide/${slug}` },
        ],
    };

    // Extract FAQ pairs from content (h3 = question, next p = answer)
    // More robust regex to handle potential extra spaces/attributes
    const faqRegex = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
    const faqContent = article.content || "";
    const faqSection = faqContent.includes("<h2>FAQ</h2>") ? faqContent.split("<h2>FAQ</h2>")[1] || "" : "";
    const faqPairs: { question: string; answer: string }[] = [];
    let match;
    while ((match = faqRegex.exec(faqSection)) !== null) {
        faqPairs.push({
            question: match[1].replace(/<[^>]*>/g, "").trim(),
            answer: match[2].replace(/<[^>]*>/g, "").trim(),
        });
    }

    const faqSchema = faqPairs.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqPairs.map(faq => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    } : null;

    // Parse main content to make images contain properly and merchant buttons strictly dynamic
    let dynamicContent = article.content || "";

    // Fix image framing visually for large product blocks
    dynamicContent = dynamicContent.replace(
        /class="rounded-2xl w-full aspect-square object-cover shadow-sm bg-muted"/g,
        'class="rounded-2xl w-full aspect-square object-contain p-4 bg-white shadow-sm border border-border/20"'
    );

    // Fix image framing visually for tiny table avatars to prevent logo cropping
    dynamicContent = dynamicContent.replace(
        /class="w-8 h-8 rounded-full object-cover"/g,
        'class="w-10 h-10 rounded-xl object-contain bg-white border border-border/20 p-1"'
    );

    // Swap hardcoded merchant links for dynamic db offers
    dynamicContent = dynamicContent.replace(
        /<div class="flex flex-wrap items-center gap-3 mt-8">([\s\S]*?)<\/div>/gi,
        (match, innerHtml) => {
            const slugMatch = innerHtml.match(/href="\/produit\/([^"]+)"/i);
            if (!slugMatch || !slugMatch[1]) return match;

            const productSlug = slugMatch[1];
            const product = relatedItems.find((p: any) => p.slug === productSlug);

            if (!product) {
                return `<div class="flex flex-wrap items-center gap-3 mt-8">
                     <a href="/produit/${productSlug}" class="inline-flex items-center justify-center bg-primary text-primary-foreground font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-transform hover:scale-105 active:scale-95 shadow-sm">Voir la fiche produit</a>
                 </div>`;
            }

            let newHtml = `<a href="/produit/${product.slug}" class="inline-flex items-center justify-center bg-primary text-primary-foreground font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-transform hover:scale-105 active:scale-95 shadow-sm">Voir la fiche produit</a>`;

            if (product.offers && product.offers.length > 0) {
                product.offers.forEach((offer: any) => {
                    const merchant = offer.merchant_name.toLowerCase();
                    if (merchant === 'amazon') {
                        newHtml += ` <a href="${offer.affiliate_link}" target="_blank" rel="nofollow sponsored" class="inline-flex items-center justify-center bg-[#FF9900]/10 text-[#FF9900] font-bold px-5 py-3 rounded-xl hover:bg-[#FF9900]/20 transition-colors border border-[#FF9900]/20">Amazon</a>`;
                    } else if (merchant === 'thomann') {
                        newHtml += ` <a href="${offer.affiliate_link}" target="_blank" rel="nofollow sponsored" class="inline-flex items-center justify-center bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold px-5 py-3 rounded-xl hover:bg-cyan-500/20 transition-colors border border-cyan-500/20">Thomann</a>`;
                    } else if (merchant === 'woodbrass') {
                        newHtml += ` <a href="${offer.affiliate_link}" target="_blank" rel="nofollow sponsored" class="inline-flex items-center justify-center bg-muted text-foreground font-bold px-5 py-3 rounded-xl hover:bg-muted/80 transition-colors border border-border">Woodbrass</a>`;
                    }
                });
            }

            return `<div class="flex flex-wrap items-center gap-3 mt-8">${newHtml}</div>`;
        }
    );


    return (
        <>
            <JsonLd data={articleSchema} />
            <JsonLd data={breadcrumbSchema} />
            {faqSchema && <JsonLd data={faqSchema} />}
            <div className="min-h-screen bg-background text-foreground">

                {/* HEADER ARTICLE */}
                <header className="pt-32 pb-16 relative">
                    <div className="container mx-auto px-6 max-w-[1000px]">
                        <div className="mb-8">
                            <Link
                                href="/guides"
                                className="group flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                                Retour aux guides
                            </Link>

                            <div className="flex items-center gap-3 text-sm font-medium text-primary mb-4">
                                <span className="uppercase tracking-widest">{article.category}</span>
                                <span className="w-1 h-1 bg-primary rounded-full" />
                                <span className="text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-8 font-serif leading-tight">
                                {article.title}
                            </h1>

                            <div className="flex items-center gap-6 border-y border-border py-4">
                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Calendar className="w-4 h-4" /> {article.date}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COVER IMAGE */}
                    <div className="container mx-auto px-6 max-w-[1200px]">
                        <div className="aspect-[21/9] rounded-3xl overflow-hidden bg-secondary relative">
                            <Image
                                src={article.image}
                                alt={article.title}
                                fill
                                sizes="(max-width: 1200px) 100vw, 1200px"
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                </header>

                {/* CONTENT LAYOUT */}
                <div className="container mx-auto px-6 max-w-[1200px] pb-24">
                    <div className="flex flex-col lg:flex-row gap-16">

                        {/* MAIN TEXT */}
                        <main className="lg:w-2/3">
                            <div className="prose prose-stone prose-lg max-w-none 
              prose-headings:font-serif prose-headings:font-bold prose-headings:text-foreground
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:font-light
              prose-strong:text-foreground prose-strong:font-bold
              prose-li:text-muted-foreground
            ">
                                <p className="lead text-xl text-foreground font-medium mb-8 border-l-4 border-primary pl-4 italic">
                                    {article.intro}
                                </p>

                                <div dangerouslySetInnerHTML={{ __html: dynamicContent }} />
                            </div>
                        </main>

                        {/* SIDEBAR (Sticky) */}
                        <aside className="lg:w-1/3 space-y-8">
                            <div className="sticky top-28">
                                <div className="bg-[#F9F9F9] border border-border rounded-2xl p-6">
                                    <div className="flex items-center gap-2 mb-6">
                                        <ShoppingBag className="w-5 h-5 text-primary" />
                                        <h3 className="font-bold text-lg font-serif">Dans cet article</h3>
                                    </div>

                                    {relatedItems.length > 0 ? (
                                        <ul className="space-y-4">
                                            {relatedItems.map((product: any) => (
                                                <li key={product.id}>
                                                    <Link
                                                        href={`/produit/${product.slug}`}
                                                        className="bg-white p-3 rounded-xl border border-border flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-colors shadow-sm"
                                                    >
                                                        <div className="flex items-center gap-3 overflow-hidden">
                                                            <div className="w-12 h-12 bg-white border border-border/50 rounded-lg flex-shrink-0 p-1 flex items-center justify-center relative">
                                                                <Image
                                                                    src={product.image_url}
                                                                    alt={product.name}
                                                                    fill
                                                                    sizes="48px"
                                                                    className="object-contain mix-blend-multiply p-1"
                                                                    loading="lazy"
                                                                />
                                                            </div>
                                                            <div className="flex flex-col min-w-0">
                                                                <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">{product.brand}</span>
                                                                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">{product.name}</span>
                                                                <span className="text-xs font-bold text-foreground">
                                                                    {product.price > 0 ? `≈ ${product.price}€` : 'Voir prix'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform flex-shrink-0" />
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">Aucun produit spécifique mentionné.</p>
                                    )}

                                    {article.relatedCategorySlug && (
                                        <div className="mt-6 pt-6 border-t border-border/50 text-center">
                                            <Link
                                                href={`/categorie/${article.relatedCategorySlug}`}
                                                className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary text-white hover:bg-primary/90 rounded-lg text-sm font-bold transition-colors"
                                            >
                                                Voir la sélection complète
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </aside>

                    </div>
                </div>

                {/* AUTHOR BIO — E-E-A-T */}
                <div className="container mx-auto px-6 max-w-[1000px] py-16">
                    <div className="flex flex-col sm:flex-row gap-6 items-start p-8 bg-secondary/30 border border-border/50 rounded-2xl">
                        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                            FL
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-lg mb-1">Équipe Fluxlab</p>
                            <p className="text-sm text-muted-foreground font-light leading-relaxed mb-4">
                                L&apos;équipe éditoriale Fluxlab analyse le matériel audio, vidéo et streaming avec une méthodologie rigoureuse.
                                Nos recommandations sont basées sur des données techniques vérifiées et des retours utilisateurs agrégés.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link href="/a-propos" className="text-xs font-bold text-primary hover:underline">
                                    À propos de Fluxlab →
                                </Link>
                                <Link href="/methodologie" className="text-xs font-bold text-muted-foreground hover:text-primary hover:underline">
                                    Notre méthodologie →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}
