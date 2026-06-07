'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Sparkles, LayoutGrid } from 'lucide-react';

const CHALLENGES = [
    { title: 'Mon espace bruyant', href: '/categorie/espace-bruyant' },
    { title: 'Je veux du plug & play', href: '/categorie/plug-and-play' },
    { title: 'Budget serré (< 200€)', href: '/categorie/petit-budget' },
    { title: 'Je crée en déplacement', href: '/categorie/createur-nomade' },
];

export const HeroSection = () => {
    return (
        <section className="relative min-h-[75vh] flex items-center justify-center pt-16 pb-10 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">

            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] left-[20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-50" />
                <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-accent/20 rounded-full blur-3xl opacity-30" />
            </div>

            <div className="container mx-auto px-6 max-w-[1600px] text-center relative z-10">

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-5"
                >
                    Trouvez enfin le setup parfait <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-500 to-primary animate-gradient bg-[length:200%_auto]">
                        pour votre création.
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
                >
                    Comparez les prix des meilleures boutiques, vérifiez la compatibilité de votre matériel et laissez notre configurateur IA vous guider vers le setup idéal.
                </motion.p>

                {/* ACTION BUTTONS */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 z-20"
                >
                    <Link href="/configurateur" className="w-full sm:w-auto">
                        <Button
                            variant="primary"
                            size="lg"
                            className="rounded-full px-8 h-14 text-base shadow-xl shadow-primary/20 hover:shadow-primary/30 w-full transition-all hover:scale-105"
                        >
                            <Sparkles className="w-5 h-5 mr-2" />
                            Trouver mon Setup
                        </Button>
                    </Link>

                    <Link href="/categorie/audio" className="w-full sm:w-auto">
                        <Button
                            variant="outline"
                            size="lg"
                            className="rounded-full px-8 h-14 text-base bg-white/50 backdrop-blur border-border hover:bg-white w-full group"
                        >
                            <LayoutGrid className="w-5 h-5 mr-2 text-muted-foreground group-hover:text-foreground transition-colors" />
                            Voir les meilleurs produits
                        </Button>
                    </Link>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 mb-8 text-sm text-muted-foreground"
                >
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span>Comparateur Multi-Boutiques</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span>Compatibilité Vérifiée</span>
                    </div>
                </motion.div>

                {/* Challenge Bubbles — directly below trust indicators */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex flex-wrap items-center justify-center gap-3"
                >
                    {CHALLENGES.map((c) => (
                        <Link
                            key={c.href}
                            href={c.href}
                            className="px-5 py-2.5 rounded-full border border-border bg-white/80 backdrop-blur text-sm font-semibold text-foreground hover:border-primary hover:text-primary hover:shadow-md hover:shadow-primary/5 transition-all duration-200"
                        >
                            {c.title}
                        </Link>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
