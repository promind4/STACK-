import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { transformProduct } from "@/lib/transformers";
import { Product } from "@/types/database";
import Link from "next/link";
import Image from "next/image";
import { JsonLd } from "@/components/server/JsonLd";
import CategoryContent from "@/components/client/CategoryContent";
import { isPublicAudioCategory, AUDIO_CATEGORY_SLUGS } from "@/lib/public-audio-scope";

/* ─── IMAGE DE FOND PAR CATÉGORIE ───────────────────────────
   Grandes catégories → banner dédié
   Sous-catégories → banner du parent
────────────────────────────────────────────────────────────*/
const BANNER_MAP: Record<string, string> = {
  // Studio & Son
  audio:                  '/images/editorial/banner-studio-son.webp',
  'micros-dynamiques':    '/images/editorial/banner-studio-son.webp',
  'micros-condensateurs': '/images/editorial/banner-studio-son.webp',
  'micros-usb':           '/images/editorial/banner-studio-son.webp',
  'micros-shotgun':       '/images/editorial/banner-studio-son.webp',
  'cartes-son':           '/images/editorial/banner-studio-son.webp',
  'preamplis':            '/images/editorial/banner-studio-son.webp',
  'casques-studio':       '/images/editorial/banner-studio-son.webp',
  'enceintes':            '/images/editorial/banner-studio-son.webp',
  'bras-articules':       '/images/editorial/banner-studio-son.webp',
  'cable-xlr':            '/images/editorial/banner-studio-son.webp',
  'traitement-acoustique':'/images/editorial/banner-studio-son.webp',
};

export const revalidate = 3600; // 1h ISR
export const dynamicParams = false;

/* ─── QUESTIONS PAR CATÉGORIE ────────────────────────────── */
type Question = { num: string; title: string; desc: string };

const CATEGORY_QUESTIONS: Record<string, Question[]> = {
  // ── AUDIO GÉNÉRAL
  audio: [
    { num: "01", title: "L'environnement",   desc: "Pièce traitée ou bruyante ? Votre acoustique détermine le type de micro — dynamique pour les espaces bruyants, condensateur pour les studios silencieux." },
    { num: "02", title: "La connectique",     desc: "USB pour la simplicité plug-and-play, XLR pour la qualité et l'évolutivité. L'interface audio fait le pont entre votre voix et l'ordinateur." },
    { num: "03", title: "L'usage",            desc: "Podcast, stream, chant ou voice-over ? Chaque cas impose un micro, une interface et un monitoring adaptés." },
    { num: "04", title: "La compatibilité",   desc: "Chaque élément est un maillon. Vérifiez que votre micro, interface et logiciel fonctionnent ensemble avant d'acheter." },
  ],
  // ── MICROS DYNAMIQUES
  "micros-dynamiques": [
    { num: "01", title: "L'environnement",   desc: "Les dynamiques excellent dans les espaces bruyants ou non traités. Leur directivité cardioïde rejette naturellement les sons ambiants." },
    { num: "02", title: "Le gain requis",     desc: "Un SM7B ou PodMic nécessite un préampli avec +60 dB de gain propre. Vérifiez votre interface — ou prévoyez un Cloudlifter." },
    { num: "03", title: "L'usage",            desc: "Podcast, stream gaming et voix radio : le dynamique est taillé pour ça. Sa robustesse en fait un allié de longue durée." },
    { num: "04", title: "La connectique",     desc: "Tous les dynamiques pro sont en XLR. Il vous faudra une interface audio ou un préampli en ligne pour les alimenter." },
  ],
  // ── MICROS CONDENSATEURS
  "micros-condensateurs": [
    { num: "01", title: "L'acoustique",       desc: "Les condensateurs captent avec précision — y compris les défauts de la pièce. Un traitement acoustique minimal est quasi-obligatoire." },
    { num: "02", title: "L'alimentation",     desc: "Les condensateurs requièrent une alimentation fantôme 48V fournie par votre interface. Vérifiez la compatibilité avant d'acheter." },
    { num: "03", title: "L'usage",            desc: "Chant, instruments, voice-over en studio : le condensateur est la référence pour sa réponse en fréquence étendue et ses détails." },
    { num: "04", title: "La fragilité",       desc: "Plus sensibles que les dynamiques aux chocs et à l'humidité. Prévoyez une bonnette et un bras articulé de qualité." },
  ],
  // ── MICROS USB
  "micros-usb": [
    { num: "01", title: "L'usage",            desc: "USB = plug-and-play. Idéal pour débuter sans interface audio, les podcasters occasionnels et le travail nomade." },
    { num: "02", title: "La qualité",         desc: "Les meilleurs micros USB approchent la qualité XLR. Cherchez une capsule large membrane et un convertisseur interne de qualité." },
    { num: "03", title: "Le monitoring",      desc: "Vérifiez que le micro propose un monitoring direct sans latence — indispensable pour enregistrer confortablement." },
    { num: "04", title: "L'évolution",        desc: "Si vous prévoyez de passer au XLR, le micro USB reste une belle entrée en matière avant d'investir dans une interface complète." },
  ],
  // ── MICROS SHOTGUN
  "micros-shotgun": [
    { num: "01", title: "L'utilisation",      desc: "Sur perche ou sur caméra ? Un shotgun sur caméra capte tout. Sur perche, il suit précisément la source et rejette les côtés." },
    { num: "02", title: "L'alimentation",     desc: "La plupart des shotguns exigent une alimentation : pile AA ou alimentation fantôme via la griffe de la caméra. Vérifiez avant d'acheter." },
    { num: "03", title: "L'environnement",    desc: "En extérieur, une bonnette anti-vent est indispensable. En intérieur, évitez les pièces trop réverbérantes — le shotgun capte tout." },
    { num: "04", title: "La portée",          desc: "Le shotgun n'est pas un micro longue portée. Distance idéale : 30 à 80 cm de la source. Au-delà, le son perd en clarté." },
  ],
  // ── INTERFACES AUDIO
  "cartes-son": [
    { num: "01", title: "Le nombre de voies", desc: "Solo ou duo ? 1 entrée pour le podcast seul, 2 entrées pour les interviews ou voix + instrument. Prévoyez large pour évoluer." },
    { num: "02", title: "Le gain",            desc: "Avec un micro dynamique, vérifiez que l'interface fournit au moins 60 dB de gain propre. En dessous, vous aurez du bruit de fond." },
    { num: "03", title: "Les convertisseurs", desc: "C'est ici que se joue la qualité sonore. Focusrite, Audient et UA offrent des convertisseurs 24 bits/96 kHz transparents et fiables." },
    { num: "04", title: "La connectivité",    desc: "USB-C, Thunderbolt ou USB-A : vérifiez la compatibilité avec votre ordinateur. Sur Mac M-series, privilégiez les interfaces avec drivers certifiés." },
  ],
  // ── PRÉAMPLIS
  "preamplis": [
    { num: "01", title: "Quel micro ?",       desc: "Les préamplis inline comme le Cloudlifter sont conçus pour les micros dynamiques XLR à faible sensibilité : SM7B, EV RE20, PodMic." },
    { num: "02", title: "Le gain manquant",   desc: "Si votre interface fournit moins de 60 dB propres, un préampli inline ajoute +20 à +25 dB sans bruit de fond supplémentaire." },
    { num: "03", title: "La transparence",    desc: "Un bon préampli est transparent : il amplifie sans colorer. Évitez les modèles bas de gamme qui ajoutent du souffle en amplification." },
    { num: "04", title: "Les alternatives",   desc: "Une interface avec bons préamplis (Audient Evo, UA Volt) peut suffire. Le Cloudlifter n'est utile que si le gain manque vraiment." },
  ],
  // ── CASQUES STUDIO
  "casques-studio": [
    { num: "01", title: "Ouvert ou fermé ?",  desc: "Fermé = isolation, idéal pour enregistrer. Ouvert = image sonore large et naturelle, recommandé pour le mixage en studio." },
    { num: "02", title: "L'impédance",        desc: "32 Ω : compatibles smartphones. 80–250 Ω : nécessitent une interface ou un ampli casque pour fonctionner à leur plein potentiel." },
    { num: "03", title: "La platitude",       desc: "Pour mixer, cherchez une réponse en fréquence plate. Les casques grand public boostent les basses — trompeurs pour le monitoring." },
    { num: "04", title: "Le confort",         desc: "Vous portez votre casque des heures. Vérifiez le rembourrage, la pression sur les oreilles et le poids avant toute autre chose." },
  ],
  // ── ENCEINTES
  "enceintes": [
    { num: "01", title: "La taille du woofer", desc: "5 pouces pour les petits espaces, 8 pouces pour les grandes pièces. Plus le woofer est grand, plus les basses sont restitués précisément." },
    { num: "02", title: "Le placement",        desc: "À hauteur d'oreilles, à 1–1,5m de vous, en triangle équilatéral. Un mauvais placement fausse complètement la perception du mixage." },
    { num: "03", title: "L'acoustique",        desc: "Des monitors de référence dans une pièce non traitée sonnent moins bien qu'un modèle modeste dans une pièce traitée. Traitez d'abord." },
    { num: "04", title: "Le budget",           desc: "Investissez dans le traitement acoustique avant d'acheter des enceintes très chères. La pièce compte autant que le matériel." },
  ],
  // ── BRAS ARTICULÉS
  "bras-articules": [
    { num: "01", title: "La charge max",      desc: "Vérifiez le poids de votre micro + filtre anti-pop. Un SM7B avec bonnette dépasse 800g — vérifiez la charge maximale du bras." },
    { num: "02", title: "La course",          desc: "Un bras avec grande course permet de positionner le micro partout sur le bureau. Mesurez votre espace avant d'acheter." },
    { num: "03", title: "Le montage",         desc: "Pince de bureau ou fixation grommet ? Le grommet est plus stable mais permanent. La pince convient pour la majorité des setups." },
    { num: "04", title: "Le bruit mécanique", desc: "Certains bras grincent lors des ajustements. Rode PSA1+ et Elgato Wave sont réputés pour leur silence en conditions de direct." },
  ],
  // ── CÂBLES XLR
  "cable-xlr": [
    { num: "01", title: "La longueur",        desc: "3m pour un setup bureau compact, 5m pour plus de liberté. Évitez les câbles trop longs — ils captent plus d'interférences." },
    { num: "02", title: "Le blindage",        desc: "Un câble XLR de qualité est symétrique et blindé. Cela élimine les interférences électromagnétiques des appareils voisins." },
    { num: "03", title: "Les connecteurs",    desc: "Neutrik est la référence pour les connecteurs XLR. Cherchez le logo Neutrik ou Rean pour la durabilité sur le long terme." },
    { num: "04", title: "Le rapport qualité/prix", desc: "À partir de 15–20€ pour un câble correct. Inutile de dépenser 100€ — la différence sonore est imperceptible au-dessus de 20€." },
  ],
  // ── TRAITEMENT ACOUSTIQUE
  "traitement-acoustique": [
    { num: "01", title: "Le problème à résoudre", desc: "Réverbération ou isolation ? Les mousses absorbantes traitent l'écho dans la pièce — elles n'empêchent pas le bruit extérieur d'entrer." },
    { num: "02", title: "La surface",         desc: "Traitez en priorité les premières réflexions (côtés et plafond autour du point d'écoute) avant de couvrir toutes les surfaces." },
    { num: "03", title: "Les bass traps",     desc: "Les basses s'accumulent dans les coins de la pièce. Des bass traps en laine minérale dans les angles améliorent significativement le son." },
    { num: "04", title: "Le DIY",             desc: "Des panneaux maison en laine de roche 10cm + tissu acoustique offrent souvent de meilleurs résultats qu'une mousse bas de gamme." },
  ],
};

// Fallback générique
const DEFAULT_QUESTIONS: Question[] = [
  { num: "01", title: "L'environnement",    desc: "Votre espace sonore conditionne votre choix de micro. Évaluez d'abord votre pièce, les bruits ambiants et vos contraintes d'insonorisation." },
  { num: "02", title: "La connectique",     desc: "Chaque composant doit s'intégrer dans votre chaîne audio. Vérifiez les entrées/sorties XLR ou USB et la compatibilité de vos convertisseurs." },
  { num: "03", title: "L'usage principal",  desc: "Définissez votre usage prioritaire : voix off, podcast, chant ou instruments ? Chaque utilisation oriente le choix des capsules et préamplis." },
  { num: "04", title: "La durabilité",      desc: "Investissez dans des références éprouvées du studio. Les marques reconnues (Shure, Beyerdynamic, Focusrite, Audient) offrent une longévité supérieure." },
];

// Category metadata dictionary
const CATEGORY_METADATA: Record<string, { title: string; subtitle: string }> = {
    audio: { title: "Studio & Son", subtitle: "Tout le matériel audio pour votre studio créatif." },
    "micros-dynamiques": { title: "Micros Dynamiques", subtitle: "Robustesse et fiabilité pour la scène et le studio." },
    "micros-condensateurs": { title: "Micros Condensateurs", subtitle: "Précision et détails pour le studio (XLR)." },
    "micros-usb": { title: "Micros USB", subtitle: "La simplicité plug-and-play sans compromis." },
    "micros-shotgun": { title: "Micros Shotgun", subtitle: "Captation directionnelle pour la voix et les instruments." },
    "cartes-son": { title: "Interfaces Audio", subtitle: "Le pont essentiel entre votre voix et l'ordinateur." },
    "preamplis": { title: "Préamplis & Cloudlifter", subtitle: "Boostez le gain de vos microphones dynamiques." },
    "casques-studio": { title: "Casques Studio", subtitle: "Entendez chaque détail de votre mixage." },
    "enceintes": { title: "Enceintes Monitoring", subtitle: "Écoute de référence pour votre mixage." },
    "bras-articules": { title: "Bras Articulés", subtitle: "Supports fiables et silencieux pour votre micro." },
    "cable-xlr": { title: "Câbles XLR", subtitle: "Connexions blindées haute qualité pour votre studio." },
    "traitement-acoustique": { title: "Traitement Acoustique", subtitle: "Mousses et panneaux pour un son propre." },
};

// Vertical → sub-category mapping for fetching
const VERTICALS: Record<string, string[]> = {
    audio: [
        "micros-dynamiques", "micros-condensateurs", "micros-usb", "micros-shotgun",
        "cartes-son", "preamplis", "casques-studio", "enceintes",
        "bras-articules", "cable-xlr", "traitement-acoustique",
    ],
};

async function getProducts(slug: string): Promise<Product[]> {
    const supabase = createClient();

    // Check if it's a vertical or a direct category
    const subCategories = VERTICALS[slug];

    if (subCategories) {
        // Vertical: fetch all sub-categories
        const { data: categories } = await supabase
            .from("categories")
            .select("id")
            .in("slug", subCategories);

        if (!categories || categories.length === 0) return [];

        const categoryIds = categories.map((c) => c.id);
        const { data } = await supabase
            .from("products")
            .select("*, product_offers(*)")
            .in("category_id", categoryIds)
            .eq("is_active", true)
            .order("name");

        return (data || []).map((p: any) => transformProduct(p));
    }

    // Single category slug
    const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", slug)
        .single();

    if (!cat) return [];

    const { data } = await supabase
        .from("products")
        .select("*, product_offers(*)")
        .eq("category_id", cat.id)
        .eq("is_active", true)
        .order("name");

    return (data || []).map((p: any) => transformProduct(p));
}

export async function generateStaticParams() {
    return AUDIO_CATEGORY_SLUGS.map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    if (!isPublicAudioCategory(slug)) notFound();

    const meta = CATEGORY_METADATA[slug];
    const title = meta ? `${meta.title} — Comparateur de Prix` : "Catalogue Studio & Son";
    const rawDesc = meta
        ? `${meta.subtitle} Comparez les prix et trouvez les meilleures offres sur Fluxlab.`
        : "Explorez notre catalogue de matériel audio pour studio et home studio.";
    const desc = rawDesc.length > 160
        ? rawDesc.substring(0, rawDesc.lastIndexOf(" ", 157)) + "…"
        : rawDesc;

    return {
        title,
        description: desc,
        alternates: { canonical: `https://fluxlab.fr/categorie/${slug}` },
        openGraph: { title, description: desc },
    };
}

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;
    if (!isPublicAudioCategory(slug)) notFound();

    const meta = CATEGORY_METADATA[slug];
    if (!meta) notFound();

    const products = await getProducts(slug);

    const title = meta.title;
    const subtitle = meta.subtitle;

    // JSON-LD ItemList for category
    const itemListSchema = products.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: title,
        numberOfItems: products.length,
        itemListElement: products.slice(0, 20).map((p: Product, idx: number) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: p.name,
            url: `https://fluxlab.fr/produit/${p.slug}`,
        })),
    } : null;

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: "https://fluxlab.fr" },
            { "@type": "ListItem", position: 2, name: title, item: `https://fluxlab.fr/categorie/${slug}` },
        ],
    };

    // Vertical parent slug for breadcrumb
    const parentVertical = slug === "audio" ? null
        : Object.entries(VERTICALS).find(([, subs]) => (subs as string[]).includes(slug))?.[0] ?? null;
    const parentMeta = parentVertical ? CATEGORY_METADATA[parentVertical] : null;

    return (
        <>
            {itemListSchema && <JsonLd data={itemListSchema} />}
            <JsonLd data={breadcrumbSchema} />
            <div className="min-h-screen bg-background text-foreground">

                {/* ── HEADER BANDEROLE ─────────────────────── */}
                <header className="relative border-b border-border/40 overflow-hidden" style={{ minHeight: '185px', background: '#0A0A0A' }}>
                    {/* Image de fond */}
                    {BANNER_MAP[slug] && (
                        <Image
                            src={BANNER_MAP[slug]}
                            alt=""
                            fill
                            priority
                            className="object-cover object-center opacity-55"
                            sizes="100vw"
                        />
                    )}
                    {/* Gradient overlay — lisibilité du texte */}
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.25) 55%, rgba(10,10,10,0.05) 100%)' }} aria-hidden />
                    {/* Halo doré */}
                    <div className="absolute -top-10 right-[8%] w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(211,178,123,.18) 0%, transparent 65%)', filter: 'blur(35px)' }} aria-hidden />

                    <div className="relative z-10 max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-16 h-full flex flex-col justify-center pt-24 sm:pt-28 pb-8">

                        {/* Breadcrumb */}
                        <nav className="flex items-center gap-2 text-[12px] font-mono text-white/70 uppercase tracking-wider mb-4 font-medium" aria-label="Fil d'ariane">
                            <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="m9 18 6-6-6-6"/></svg>
                            {parentMeta ? (
                                <>
                                    <Link href={`/categorie/${parentVertical}`} className="hover:text-primary transition-colors">{parentMeta.title}</Link>
                                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="m9 18 6-6-6-6"/></svg>
                                </>
                            ) : null}
                            <span className="text-white/90">{title}</span>
                        </nav>

                        {/* Titre + compteur sur une ligne */}
                        <div className="flex items-end justify-between gap-6 flex-wrap">
                            <div>
                                <h1 className="font-serif text-white text-[28px] sm:text-[36px] md:text-[48px] leading-[1.08] tracking-tight text-balance">
                                    {title} <span className="italic text-primary">·</span>
                                </h1>
                                <p className="text-[15px] text-white/80 font-normal mt-2 max-w-[560px] leading-snug">
                                    {subtitle}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* ── CONTENU : SIDEBAR + GRILLE ───────────── */}
                <main className="bg-background border-b border-border/40">
                    <CategoryContent
                        products={products}
                        slug={slug}
                        title={title}
                        subtitle={subtitle}
                    />
                </main>

                {/* ── BLOC ÉDITORIAL SEO ───────────────────── */}
                <section className="bg-secondary border-b border-border/40">
                    <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-16 py-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                        <div className="col-span-12 lg:col-span-5">
                            <p className="frame-label text-primary mb-5 flex items-center gap-3 font-bold">
                                <span className="block w-8 h-px bg-primary" aria-hidden />
                                Mode d&apos;emploi
                            </p>
                            <h2 className="font-serif text-foreground text-[30px] sm:text-[40px] md:text-[50px] leading-[1.12] tracking-tight mb-6 text-balance">
                                Bien choisir<br />
                                votre matériel<br />
                                <span className="italic text-primary">en 4 questions.</span>
                            </h2>
                            <p className="text-[15px] text-foreground/80 leading-[1.7] font-normal max-w-[420px]">
                                Ce qu&apos;il faut savoir avant d&apos;acheter — la chaîne audio est un système complet, chaque composant en est un maillon.
                            </p>
                        </div>
                        <div className="col-span-12 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {(CATEGORY_QUESTIONS[slug] ?? DEFAULT_QUESTIONS).map(q => (
                                <div key={q.num}>
                                    <p className="frame-label text-primary mb-3 font-bold">{q.num} · {q.title}</p>
                                    <p className="text-[14px] text-foreground/85 leading-[1.7] font-normal">{q.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </div>
        </>
    );
}

