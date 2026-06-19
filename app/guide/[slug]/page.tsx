import { Metadata } from 'next';
import Link from 'next/link';
import { getArticleBySlug } from '@/lib/data';
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

export const revalidate = 86400; // Revalidate daily — guide content is static, product offers update overnight

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const article = getArticleBySlug(slug);
    if (!article) return { title: 'Guide introuvable' };

    const rawDesc = article.intro || '';
    const desc = rawDesc.length > 160
        ? rawDesc.substring(0, rawDesc.lastIndexOf(' ', 157)) + '…'
        : rawDesc;

    return {
        title: `${article.title} — Guide`,
        description: desc,
        alternates: {
            canonical: `https://fluxlab.fr/guide/${slug}`,
        },
        openGraph: {
            title: `${article.title} — Guide`,
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
        "@id": `https://fluxlab.fr/guide/${slug}#article`,
        url: `https://fluxlab.fr/guide/${slug}`,
        inLanguage: "fr-FR",
        headline: article.title,
        description: article.intro,
        image: {
            "@type": "ImageObject",
            url: article.image,
            width: 1200,
            height: 630,
        },
        datePublished: article.date,
        dateModified: article.updatedAt || article.date,
        author: {
            "@type": "Person",
            name: article.author,
            url: "https://fluxlab.fr/a-propos",
        },
        publisher: {
            "@type": "Organization",
            "@id": "https://fluxlab.fr/#organization",
            name: "Fluxlab",
            logo: {
                "@type": "ImageObject",
                url: "https://fluxlab.fr/branding/logo.svg",
                width: 188,
                height: 36,
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://fluxlab.fr/guide/${slug}`,
        },
        isPartOf: { "@id": "https://fluxlab.fr/#website" },
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
    // Using a more robust regex to handle spacing variations in the source HTML
    dynamicContent = dynamicContent.replace(
        /<div\s+class\s*=\s*"[^"]*flex[^"]*wrap[^"]*gap[^"]*mt[^"]*"\s*>([\s\S]*?)<\/div\s*>/gi,
        (match, innerHtml) => {
            const hrefMatch = innerHtml.match(/href\s*=\s*"([^"]*produit[^"]*)"/i);
            if (!hrefMatch || !hrefMatch[1]) return match;

            const cleanHref = hrefMatch[1].replace(/\s/g, '');
            const slugMatch = cleanHref.match(/\/produit\/(.+)$/);
            if (!slugMatch || !slugMatch[1]) return match;

            const productSlug = slugMatch[1];
            const product = relatedItems.find((p: any) => p.slug === productSlug);

            if (!product) {
                return `<div class="flex flex-wrap items-center gap-3 mt-8">
                     <a href="/produit/${productSlug}" class="inline-flex items-center justify-center bg-primary font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-transform hover:scale-105 active:scale-95 shadow-sm" style="color:#0F0F0F;text-decoration:none;">Voir la fiche produit</a>
                 </div>`;
            }

            let newHtml = `<a href="/produit/${product.slug}" class="inline-flex items-center justify-center bg-primary font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-transform hover:scale-105 active:scale-95 shadow-sm" style="color:#0F0F0F;text-decoration:none;">Voir la fiche produit</a>`;

            if (product.offers && product.offers.length > 0) {
                let offersHtml = '<div class="flex flex-wrap items-center justify-start gap-8 sm:gap-12 w-full">';
                product.offers.forEach((offer: any) => {
                    const merchantName = offer.merchant_name || 'Marchand';
                    let logoUrl = offer.merchant_logo_url;

                    if (!logoUrl) {
                        const m = merchantName.toLowerCase();
                        if (m === 'amazon') logoUrl = 'https://oxzapjwfttrgsometnwq.supabase.co/storage/v1/object/public/logo/amazon-logo.png';
                        else if (m === 'thomann') logoUrl = 'https://oxzapjwfttrgsometnwq.supabase.co/storage/v1/object/public/logo/THOMANN.png';
                        else if (m === 'woodbrass') logoUrl = 'https://oxzapjwfttrgsometnwq.supabase.co/storage/v1/object/public/logo/woodbrass.jpeg';
                    }

                    offersHtml += `
                        <a href="${offer.affiliate_link}" target="_blank" rel="nofollow sponsored" class="group flex flex-col items-center gap-2 hover:-translate-y-1 transition-transform">
                            <div style="height:26px;display:flex;align-items:center;justify-content:center;">
                                ${logoUrl
                            ? `<img src="${logoUrl}" alt="${merchantName}" style="height:26px;width:auto;max-height:26px;display:block" class="object-contain" loading="lazy" />`
                            : `<span class="font-bold text-sm text-foreground">${merchantName}</span>`
                        }
                            </div>
                            <span class="text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-widest group-hover:text-primary transition-colors">
                                ${merchantName}
                            </span>
                        </a>
                    `;
                });
                offersHtml += '</div>';

                newHtml = `
                    <div class="flex flex-col gap-6 mt-10 w-full mb-4">
                        <div class="flex">${newHtml}</div>
                        <div class="w-full h-px bg-border/40 my-2"></div>
                        <div class="flex flex-col gap-5">
                            <span class="text-xs uppercase tracking-widest text-muted-foreground/80 font-bold block">Vérifier le prix sur :</span>
                            ${offersHtml}
                        </div>
                    </div>
                `;
            } else {
                newHtml = `<div class="flex mt-8 w-full">${newHtml}</div>`;
            }

            return `<div class="w-full clear-both">${newHtml}</div>`;
        }
    );


    // Remove placeholder merchant buttons (href="#") left by static HTML when replacement didn't run
    dynamicContent = dynamicContent.replace(
        /<a\s+href="#"\s+target="_blank"\s+rel="nofollow sponsored"[^>]*>[\s\S]*?<\/a>/gi,
        ''
    );

    // Rendre les tableaux scrollables horizontalement sur mobile, sans scrollbar visible
    dynamicContent = dynamicContent
        .replace(/class="overflow-x-auto/g, 'class="overflow-x-auto no-scrollbar')
        .replace(/<table/g, '<div class="overflow-x-auto no-scrollbar"><table')
        .replace(/<\/table>/g, '</table></div>');

    // Remove circular emoji icon divs from editorial encarts (keep only text)
    dynamicContent = dynamicContent.replace(
        /<div\s+class="w-24\s+h-24[^"]*"[^>]*>[\s\S]*?<\/div>/g,
        ''
    );
    // Simplify flex container when icon removed (remove flex direction/gap/items-center from encart wrapper)
    dynamicContent = dynamicContent.replace(
        /(\bbg-primary\/5\b[^"]*)(flex flex-col sm:flex-row items-center gap-8)/g,
        '$1'
    );

    // Extract ALL h2 headings for TOC (avec ou sans id)
    // Si pas d'id, on en génère un depuis le texte (slugify)
    const slugify = (s: string) => s.toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const tocSource = dynamicContent || '';
    const toc: { id: string; label: string }[] = [];
    const h2Regex = /<h2([^>]*)>([\s\S]*?)<\/h2>/gi;
    let tocMatch;
    let modifiedContent = tocSource;
    const replacements: { from: string; to: string }[] = [];

    while ((tocMatch = h2Regex.exec(tocSource)) !== null) {
        const attrs   = tocMatch[1];
        const inner   = tocMatch[2].replace(/<[^>]*>/g, '').trim();
        const idMatch = attrs.match(/id="([^"]*)"/);
        const id      = idMatch ? idMatch[1] : slugify(inner);
        const label   = inner.replace(/&[a-z]+;/g, ' ').trim().substring(0, 55);

        toc.push({ id, label });

        // Add id to h2 if missing
        if (!idMatch) {
            replacements.push({
                from: `<h2${attrs}>`,
                to:   `<h2${attrs} id="${id}">`,
            });
        }
    }
    // Apply id injections (first match only to avoid duplicate replacements)
    for (const r of replacements) {
        modifiedContent = modifiedContent.replace(r.from, r.to);
    }
    dynamicContent = modifiedContent;

    // Injecter un CTA configurateur au milieu de l'article (après le 2ème h2)
    const CTAmidArticle = `
      <div class="not-prose my-10 p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center gap-5" style="background:rgba(211,178,123,0.06);border-color:rgba(211,178,123,0.2);">
        <div class="flex-1">
          <p class="text-[10px] font-mono uppercase tracking-widest mb-1" style="color:#D3B27B;">Labo IA · Fluxlab</p>
          <p class="font-serif text-[20px] leading-snug mb-1">Besoin d&apos;aide pour choisir votre matériel&nbsp;?</p>
          <p class="text-[13px] leading-relaxed" style="color:rgba(15,15,15,0.6);">Budget, usage, contraintes — l&apos;IA compose votre setup complet en 2 minutes.</p>
        </div>
        <a href="/configurateur" class="shrink-0 inline-flex items-center gap-2 h-10 px-6 rounded-full text-[12px] font-medium uppercase tracking-wider transition-colors" style="background:#D3B27B;color:#0F0F0F;text-decoration:none;">
          Lancer le Labo IA →
        </a>
      </div>
    `;

    let h2Count = 0;
    const h2CloseTag = '</h2>';
    let insertPos = -1;
    let searchFrom = 0;
    while (h2Count < 2) {
      const idx = dynamicContent.indexOf(h2CloseTag, searchFrom);
      if (idx === -1) break;
      h2Count++;
      if (h2Count === 2) insertPos = idx + h2CloseTag.length;
      else searchFrom = idx + h2CloseTag.length;
    }
    if (insertPos !== -1) {
      dynamicContent = dynamicContent.slice(0, insertPos) + CTAmidArticle + dynamicContent.slice(insertPos);
    }

    return (
        <>
            <JsonLd data={articleSchema} />
            <JsonLd data={breadcrumbSchema} />
            {faqSchema && <JsonLd data={faqSchema} />}
            <div className="min-h-screen bg-background text-foreground">

                {/* ── HERO ARTICLE ─────────────────────────────────── */}
                <header className="relative grain overflow-hidden bg-[#0A0A0A]">
                    {/* Image de fond */}
                    {article.image && (
                        <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            priority
                            className="object-cover opacity-30"
                        />
                    )}
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent pointer-events-none" aria-hidden />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 to-transparent pointer-events-none" aria-hidden />

                    {/* Watermark */}
                    <div className="absolute inset-y-0 right-[-3vw] flex items-center pointer-events-none select-none" aria-hidden>
                        <span className="font-serif italic leading-none text-white/[0.025] tracking-tighter" style={{ fontSize: '28vw' }}>
                            {article.category.charAt(0).toUpperCase()}
                        </span>
                    </div>

                    <div className="relative z-10 max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-16 pt-28 pb-20">

                        {/* Breadcrumb */}
                        <nav className="flex items-center gap-2 text-[12px] font-mono text-white/45 uppercase tracking-wider mb-12" aria-label="Fil d'ariane">
                            <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="m9 18 6-6-6-6"/></svg>
                            <Link href="/guides" className="hover:text-primary transition-colors">Guides</Link>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="m9 18 6-6-6-6"/></svg>
                            <span className="text-white/70">{article.category}</span>
                        </nav>

                        <div className="max-w-[900px]">
                            <div className="flex items-center gap-4 mb-8 flex-wrap">
                                <span className="frame-label text-primary bg-primary/15 backdrop-blur px-3 py-1.5 rounded-full">Guide complet</span>
                                <span className="frame-label text-white/45">{article.updatedAt || article.date}</span>
                            </div>

                            <h1 className="font-serif text-white text-[34px] sm:text-[48px] md:text-[64px] lg:text-[80px] leading-[1.05] sm:leading-[1] tracking-tight mb-8">
                                {article.title.split(' ').slice(0, Math.ceil(article.title.split(' ').length / 2)).join(' ')}<br />
                                <span className="italic text-primary">{article.title.split(' ').slice(Math.ceil(article.title.split(' ').length / 2)).join(' ')}</span>
                            </h1>

                            <p className="text-[18px] text-white/60 leading-[1.65] font-light max-w-[680px] mb-12">
                                {article.intro}
                            </p>

                            {/* Méta — byline éditorial */}
                            <div className="flex items-center gap-3 text-[12px] font-mono text-white/40">
                                <span>Par {article.author}</span>
                                <span className="text-white/20">·</span>
                                <span>Mis à jour le {article.updatedAt || article.date}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* ── ARTICLE BODY ─────────────────────────────────── */}
                <main className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-16 py-20">
                    <div className="grid grid-cols-12 gap-16">

                        {/* TOC SIDEBAR */}
                        <aside className="hidden lg:block col-span-3">
                            <div className="lg:sticky lg:top-24">
                                <p className="frame-label text-primary mb-6">Sommaire</p>
                                <nav className="space-y-1" aria-label="Table des matières">
                                    {toc.length > 0 ? toc.map((item, i) => (
                                        <a key={item.id} href={`#${item.id}`} className={`toc-link ${i === 0 ? 'active' : ''}`}>
                                            {item.label}
                                        </a>
                                    )) : (
                                        <a href="#content" className="toc-link active">Introduction</a>
                                    )}
                                </nav>

                                {/* Produits cités */}
                                {relatedItems.length > 0 && (
                                    <div className="mt-10 pt-8 border-t border-border/60">
                                        <p className="frame-label text-primary mb-4">Produits cités</p>
                                        <div className="space-y-3">
                                            {relatedItems.map((product: any) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/produit/${product.slug}`}
                                                    className="group flex items-center gap-3.5 p-3.5 bg-white rounded-xl border border-border/70 hover:border-primary/60 transition-all"
                                                >
                                                    <div className="w-14 h-14 rounded-lg bg-secondary shrink-0 flex items-center justify-center relative overflow-hidden">
                                                        {product.image_url && (
                                                            <Image src={product.image_url} alt={product.name} fill sizes="56px" className="object-contain p-1.5 mix-blend-multiply" loading="lazy" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[14px] font-serif text-foreground leading-[1.25] group-hover:text-primary transition-colors line-clamp-2 mb-1">{product.name}</p>
                                                        <p className="text-[13px] font-serif text-primary font-medium">{product.price > 0 ? `${product.price}€` : 'Voir prix'}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </aside>

                        {/* ARTICLE CONTENT */}
                        <article id="content" className="col-span-12 lg:col-span-9 prose-fluxlab max-w-[780px]">
                            <div dangerouslySetInnerHTML={{ __html: dynamicContent }} />

                            {/* CTA final */}
                            <div className="not-prose mt-12 p-8 rounded-2xl relative overflow-hidden grain" style={{ background: '#0A0A0A' }}>
                                <div className="absolute -top-16 -right-16 w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(211,178,123,.3) 0%, transparent 65%)', filter: 'blur(30px)' }} aria-hidden />
                                <div className="relative z-10">
                                    <p className="frame-label text-primary mb-4">Pas le temps de lire ?</p>
                                    <h3 className="font-serif text-[28px] leading-[1.15] tracking-tight mb-3 text-white">
                                        L&apos;IA compose votre stack <span className="italic text-primary">en 3 minutes.</span>
                                    </h3>
                                    <p className="text-[14px] font-light leading-relaxed mb-6 max-w-lg text-white/60">
                                        Indiquez votre budget, votre pièce et votre usage — le Labo retourne un setup complet, testé et compatible.
                                    </p>
                                    <Link
                                        href="/configurateur"
                                        className="group inline-flex items-center gap-3 h-12 px-8 rounded-full bg-primary text-[13px] font-medium uppercase tracking-wider hover:bg-primary-hover transition-colors"
                                        style={{ color: '#0F0F0F', textDecoration: 'none' }}
                                    >
                                        Lancer le configurateur
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform" aria-hidden><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                    </Link>
                                </div>
                            </div>

                        </article>
                    </div>

                    {/* ── ARTICLES LIÉS ─────────────────────────────── */}
                    <section className="mt-24 pt-16 border-t border-border/60">
                        <div className="flex items-end justify-between mb-10">
                            <div>
                                <p className="frame-label text-primary mb-4 flex items-center gap-3">
                                    <span className="block w-8 h-px bg-primary" aria-hidden />
                                    À lire aussi
                                </p>
                                <h2 className="font-serif text-foreground text-[36px] tracking-tight">
                                    Guides <span className="italic text-primary">connexes.</span>
                                </h2>
                            </div>
                            <Link href="/guides" className="hidden md:inline-flex items-center gap-2 text-[12px] font-mono uppercase tracking-wider text-foreground/70 hover:text-primary group transition-colors">
                                Tous les guides
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform" aria-hidden><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                            </Link>
                        </div>

                        <RelatedGuides currentSlug={slug} category={article.category} />
                    </section>
                </main>
            </div>
        </>
    );
}

/* ─── RELATED GUIDES ─────────────────────────────────────── */
import { ARTICLES } from '@/lib/data';
function RelatedGuides({ currentSlug, category }: { currentSlug: string; category: string }) {
    const related = ARTICLES
        .filter(a => a.slug !== currentSlug && a.category === category)
        .slice(0, 3);
    const fill = ARTICLES.filter(a => a.slug !== currentSlug && !related.includes(a)).slice(0, 3 - related.length);
    const guides = [...related, ...fill].slice(0, 3);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guides.map(guide => (
                <Link
                    key={guide.id}
                    href={`/guide/${guide.slug}`}
                    className="group flex flex-col rounded-2xl border border-border/70 bg-card overflow-hidden hover:border-primary/60 hover:shadow-lg transition-all"
                >
                    <div className="aspect-[16/10] bg-secondary relative overflow-hidden">
                        <span className="absolute top-4 left-4 frame-label text-foreground/50 bg-white/90 px-2.5 py-1 rounded-md border border-border/70 z-10">
                            {guide.category}
                        </span>
                        {guide.image && (
                            <Image src={guide.image} alt={`${guide.title} – Guide ${guide.category} | Fluxlab`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-3 text-[11px] font-mono text-foreground/45 mb-3">
                            <span>{guide.readTime}</span>
                            <span>·</span>
                            <span>{guide.date}</span>
                        </div>
                        <h3 className="font-serif text-[18px] text-foreground leading-[1.25] group-hover:text-primary transition-colors">
                            {guide.title}
                        </h3>
                    </div>
                </Link>
            ))}
        </div>
    );
}
