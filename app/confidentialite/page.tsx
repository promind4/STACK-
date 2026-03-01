import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Politique de Confidentialité",
    alternates: { canonical: "https://fluxlab.fr/confidentialite" },
};

export default function Confidentialite() {
    return (
        <article className="container mx-auto px-6 max-w-[800px] py-20">
            <h1 className="text-3xl font-bold text-foreground mb-8">
                Politique de Confidentialité
            </h1>
            <div className="prose prose-stone max-w-none prose-headings:text-foreground prose-p:text-muted-foreground text-sm">
                <h2>Données collectées</h2>
                <p>
                    Fluxlab ne collecte aucune donnée personnelle identifiable lors de
                    votre navigation. Aucun cookie tiers n&apos;est déposé.
                </p>
                <h2>Analytics</h2>
                <p>
                    Nous utilisons des mesures agrégées via Vercel Analytics, qui ne
                    permettent pas l&apos;identification individuelle.
                </p>
                <h2>Liens externes</h2>
                <p>
                    Les liens vers les marchands partenaires sont soumis à leurs propres
                    politiques de confidentialité.
                </p>
                <h2>Contact</h2>
                <p>
                    Pour toute question relative à vos données : contact@fluxlab.fr.
                </p>
            </div>
        </article>
    );
}
