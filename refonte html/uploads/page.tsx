import { Metadata } from 'next';
import {
    ShieldCheck, Target, Cpu, HeartHandshake, CheckCircle
} from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'À Propos de Fluxlab',
    description: "Comparateur de matériel audio, vidéo et streaming. Notre mission : aider les créateurs de contenu à trouver le setup parfait au meilleur prix.",
    alternates: { canonical: 'https://fluxlab.fr/a-propos' },
};

const VALUES = [
    {
        icon: <ShieldCheck className="w-6 h-6 text-primary" />,
        title: "Indépendance Radicale",
        desc: "Nous ne sommes sponsorisés par aucune marque. Si un micro à 50€ sonne mieux qu'un micro à 500€, nous le disons haut et fort."
    },
    {
        icon: <Cpu className="w-6 h-6 text-primary" />,
        title: "Intelligence Hybride",
        desc: "Nos recommandations combinent l'expérience réelle de créateurs et l'analyse de milliers de datas techniques par IA."
    },
    {
        icon: <HeartHandshake className="w-6 h-6 text-primary" />,
        title: "Pédagogie d'abord",
        desc: "Nous ne voulons pas juste que vous achetiez. Nous voulons que vous compreniez pourquoi ce setup est fait pour vous."
    }
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">

            {/* HERO SECTION - MANIFESTE */}
            <section className="pt-32 pb-24 relative overflow-hidden bg-secondary/20">
                <div className="container mx-auto px-6 max-w-[1000px] text-center relative z-10">
                    <div>
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-8">
                            Notre Philosophie
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold mb-10 text-foreground tracking-tight leading-tight font-serif">
                            &quot;La créativité ne devrait jamais être bloquée par un câble manquant ou un driver incompatible.&quot;
                        </h1>
                        <div className="h-1 w-24 bg-primary mx-auto mb-10 rounded-full" />
                        <p className="text-xl text-muted-foreground leading-relaxed font-light">
                            Fluxlab est né d&apos;un constat simple : le marché du matériel créatif est une jungle.
                            Trop de références, trop de marketing, pas assez de cohérence.
                            Nous avons construit l&apos;outil que nous aurions rêvé d&apos;avoir à nos débuts.
                        </p>
                    </div>
                </div>
            </section>

            {/* STORY SECTION */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-6 max-w-[1200px]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">

                        {/* Image Artistique */}
                        <div className="relative aspect-square md:aspect-[4/5]">
                            <div className="absolute inset-0 bg-secondary rounded-2xl overflow-hidden">
                                <Image
                                    src="/images/atelier-fluxlab.png"
                                    alt="Atelier Fluxlab - Studio de Création"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                                    loading="lazy"
                                />
                            </div>
                            <div className="absolute -bottom-6 -right-6 bg-white p-8 rounded-xl border border-border shadow-2xl max-w-xs hidden md:block">
                                <div className="flex items-center gap-3 mb-2">
                                    <Target className="w-8 h-8 text-primary" />
                                    <span className="font-bold text-lg font-serif">Notre But</span>
                                </div>
                                <p className="text-sm text-muted-foreground italic">
                                    Simplifier la tech pour libérer l&apos;art.
                                </p>
                            </div>
                        </div>

                        {/* Texte Editorial */}
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold mb-6 font-serif">L&apos;Approche Fluxlab</h2>
                            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed font-light">
                                <p>
                                    Nous ne sommes pas un simple catalogue. Fluxlab est une <strong>intelligence de configuration</strong>.
                                </p>
                                <p>
                                    Chaque produit référencé sur notre plateforme a été analysé selon des critères stricts : rapport qualité/prix, durabilité, et surtout, <strong>compatibilité</strong>.
                                </p>
                                <p>
                                    Nous croyons en la durabilité. Un bon micro s&apos;achète pour 10 ans. Une bonne optique se garde toute une vie. Nous luttons contre l&apos;obsolescence programmée en recommandant du matériel fiable et réparable.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* VALUES GRID */}
            <section className="py-24 bg-[#F9F9F9] border-t border-border/50">
                <div className="container mx-auto px-6 max-w-[1200px]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {VALUES.map((val, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col items-start"
                            >
                                <div className="w-14 h-14 bg-white rounded-2xl border border-border flex items-center justify-center mb-6 shadow-sm">
                                    {val.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 font-serif">{val.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {val.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* WHY TRUST US SECTION */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-6 max-w-[1000px]">
                    <div className="bg-[#050505] rounded-3xl p-8 md:p-16 text-white relative overflow-hidden">
                        {/* Abstract Shapes */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-900/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

                        <div className="relative z-10 text-center mb-12">
                            <h2 className="text-3xl font-bold font-serif mb-4">Pourquoi nous faire confiance ?</h2>
                            <p className="text-zinc-400 max-w-lg mx-auto">
                                Nous ne sommes pas un magazine. Nous sommes un outil.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                            {[
                                "Pas de placement produit caché",
                                "Tests acoustiques réels",
                                "Mise à jour des prix en temps réel",
                                "Algorithme de compatibilité",
                                "Pas de 'Hype', que des faits",
                                "Support par des ingénieurs son"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                        <CheckCircle className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="font-medium text-lg">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
