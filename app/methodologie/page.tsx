import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, Shield, BarChart3, Eye, Scale, Users } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Notre Méthodologie | Fluxlab',
    description: 'Découvrez comment l\'équipe Fluxlab évalue et recommande le matériel audio, vidéo et streaming. Nos critères, notre système de notation et notre engagement de transparence.',
    alternates: { canonical: 'https://fluxlab.fr/methodologie' },
};

const CRITERIA = [
    {
        icon: BarChart3,
        title: "Qualité Sonore / Image",
        weight: "35%",
        desc: "Analyse du rapport signal/bruit, de la courbe de fréquence (audio) ou de la résolution et du rendu colorimétrique (vidéo). Nous comparons les données constructeur aux retours terrain.",
    },
    {
        icon: Scale,
        title: "Rapport Qualité/Prix",
        weight: "25%",
        desc: "Le prix seul ne suffit pas. Nous évaluons le coût total du setup (câbles, accessoires, interface requise) pour déterminer le vrai rapport qualité/prix.",
    },
    {
        icon: Users,
        title: "Polyvalence & Profil Utilisateur",
        weight: "20%",
        desc: "Un micro peut être excellent pour le podcast et médiocre pour la musique. Nous notons chaque produit selon les profils : débutant, intermédiaire, professionnel.",
    },
    {
        icon: CheckCircle,
        title: "Qualité de Construction & Fiabilité",
        weight: "10%",
        desc: "Matériaux, garantie constructeur, retours utilisateurs sur la durabilité. Un produit qui tombe en panne en 6 mois ne mérite pas une recommandation.",
    },
    {
        icon: Eye,
        title: "Écosystème & Compatibilité",
        weight: "10%",
        desc: "Le produit fonctionne-t-il avec votre setup existant ? USB-C, XLR, compatibilité Mac/PC/Mobile, logiciels compagnons.",
    },
];

export default function MethodologiePage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* HERO */}
            <section className="pt-32 pb-16 bg-secondary/20 border-b border-border">
                <div className="container mx-auto px-6 max-w-[900px] text-center">
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                        Transparence
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
                        Notre Méthodologie
                    </h1>
                    <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
                        Comment nous évaluons, testons et recommandons le matériel. Notre engagement : des avis honnêtes, des données vérifiables.
                    </p>
                </div>
            </section>

            {/* PRINCIPE */}
            <section className="py-20">
                <div className="container mx-auto px-6 max-w-[900px]">
                    <h2 className="text-2xl font-bold mb-8 font-serif">Comment nous évaluons les produits</h2>
                    <div className="prose prose-lg max-w-none text-muted-foreground font-light leading-relaxed space-y-4">
                        <p>
                            Chez Fluxlab, chaque recommandation repose sur une <strong className="text-foreground">analyse multi-critères</strong>.
                            Nous ne nous contentons pas de relayer les fiches techniques constructeur. Nous croisons trois sources :
                        </p>
                        <ul className="space-y-2 list-none pl-0">
                            <li className="flex items-start gap-3">
                                <span className="text-primary mt-1">①</span>
                                <span><strong className="text-foreground">Spécifications techniques</strong> — données constructeur vérifiées (réponse en fréquence, sensibilité, résolution, CRI, etc.)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary mt-1">②</span>
                                <span><strong className="text-foreground">Retours utilisateurs agrégés</strong> — analyse de centaines d&apos;avis sur Amazon, Thomann, Reddit et forums spécialisés</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-primary mt-1">③</span>
                                <span><strong className="text-foreground">Tests terrain</strong> — mise en situation réelle dans des conditions de home studio, streaming et vidéo</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* CRITÈRES */}
            <section className="py-20 bg-secondary/20 border-y border-border/50">
                <div className="container mx-auto px-6 max-w-[900px]">
                    <h2 className="text-2xl font-bold mb-12 font-serif">Nos 5 critères d&apos;évaluation</h2>
                    <div className="space-y-8">
                        {CRITERIA.map((c, i) => (
                            <div key={i} className="flex gap-6 items-start bg-white p-6 rounded-2xl border border-border/50 shadow-sm">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <c.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-baseline gap-3 mb-2">
                                        <h3 className="text-lg font-bold">{c.title}</h3>
                                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                            Poids : {c.weight}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground font-light leading-relaxed">{c.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* NOTATION */}
            <section className="py-20">
                <div className="container mx-auto px-6 max-w-[900px]">
                    <h2 className="text-2xl font-bold mb-8 font-serif">Système de notation</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-2xl border border-border bg-card">
                            <div className="text-3xl font-bold text-primary mb-2">★ 4.5+</div>
                            <p className="font-bold mb-1">Excellent</p>
                            <p className="text-sm text-muted-foreground font-light">Produit exceptionnel dans sa catégorie. Recommandation forte.</p>
                        </div>
                        <div className="p-6 rounded-2xl border border-border bg-card">
                            <div className="text-3xl font-bold text-blue-500 mb-2">★ 4.0</div>
                            <p className="font-bold mb-1">Très bon</p>
                            <p className="text-sm text-muted-foreground font-light">Quelques compromis mineurs, mais excellent rapport qualité/prix.</p>
                        </div>
                        <div className="p-6 rounded-2xl border border-border bg-card">
                            <div className="text-3xl font-bold text-amber-500 mb-2">★ 3.5</div>
                            <p className="font-bold mb-1">Correct</p>
                            <p className="text-sm text-muted-foreground font-light">Fait le travail, mais des alternatives existent au même prix.</p>
                        </div>
                        <div className="p-6 rounded-2xl border border-border bg-card">
                            <div className="text-3xl font-bold text-red-400 mb-2">★ &lt;3</div>
                            <p className="font-bold mb-1">Non recommandé</p>
                            <p className="text-sm text-muted-foreground font-light">Rapport qualité/prix insuffisant ou défauts rédhibitoires.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TRANSPARENCE AFFILIATION */}
            <section className="py-20 bg-secondary/20 border-y border-border/50">
                <div className="container mx-auto px-6 max-w-[900px]">
                    <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center">
                            <Shield className="w-7 h-7 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4 font-serif">Transparence Affiliation</h2>
                            <div className="space-y-4 text-muted-foreground font-light leading-relaxed">
                                <p>
                                    Fluxlab participe à des programmes d&apos;affiliation avec <strong className="text-foreground">Amazon, Thomann, Woodbrass</strong> et d&apos;autres distributeurs.
                                    Concrètement, cela signifie que lorsque vous cliquez sur un lien marchand et effectuez un achat, nous percevons une commission.
                                </p>
                                <p>
                                    <strong className="text-foreground">Ce modèle n&apos;influence jamais nos recommandations.</strong> Un produit ne sera jamais favorisé parce qu&apos;il offre une meilleure commission.
                                    Notre crédibilité est notre seul actif. Si nous recommandons un mauvais produit, vous ne reviendrez pas.
                                </p>
                                <p>
                                    Tous les liens affiliés sont clairement identifiés par une mention de transparence en haut de chaque page produit.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20">
                <div className="container mx-auto px-6 max-w-[900px] text-center">
                    <h2 className="text-2xl font-bold mb-4 font-serif">Des questions sur notre approche ?</h2>
                    <p className="text-muted-foreground mb-8 font-light">
                        Nous sommes transparents sur nos processus. N&apos;hésitez pas à consulter nos guides ou à nous contacter.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link
                            href="/guides"
                            className="inline-flex items-center px-6 py-3 bg-primary text-white hover:bg-primary/90 rounded-lg font-bold text-sm transition-colors"
                        >
                            Voir nos Guides
                        </Link>
                        <Link
                            href="/a-propos"
                            className="inline-flex items-center px-6 py-3 bg-secondary text-foreground hover:bg-border rounded-lg font-bold text-sm transition-colors"
                        >
                            L&apos;Atelier Fluxlab
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
