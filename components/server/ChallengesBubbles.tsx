import React from 'react';
import Link from 'next/link';

const CHALLENGES = [
    {
        title: 'Mon espace bruyant',
        href: '/categorie/espace-bruyant',
    },
    {
        title: 'Je veux du plug & play',
        href: '/categorie/plug-and-play',
    },
    {
        title: 'Budget serré (< 200€)',
        href: '/categorie/petit-budget',
    },
    {
        title: 'Je crée en déplacement',
        href: '/categorie/createur-nomade',
    },
];

export const ChallengesBubbles = () => {
    return (
        <section className="py-12 bg-background border-b border-border/40">
            <div className="container mx-auto px-6 max-w-[1200px]">
                <p className="text-center text-sm font-medium text-muted-foreground mb-6">
                    Quel est votre principal défi aujourd&apos;hui ?
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {CHALLENGES.map((challenge) => (
                        <Link
                            key={challenge.href}
                            href={challenge.href}
                            className="px-5 py-2.5 rounded-full border border-border bg-white text-sm font-semibold text-foreground hover:border-primary hover:text-primary hover:shadow-md hover:shadow-primary/5 transition-all duration-200"
                        >
                            {challenge.title}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};
