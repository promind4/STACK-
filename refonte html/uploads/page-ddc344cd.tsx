import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Conditions Générales d'Utilisation",
    alternates: { canonical: "https://fluxlab.fr/cgu" },
};

export default function CGU() {
    return (
        <article className="container mx-auto px-6 max-w-[800px] py-20">
            <h1 className="text-3xl font-bold text-foreground mb-8">
                Conditions Générales d&apos;Utilisation
            </h1>
            <div className="prose prose-stone max-w-none prose-headings:text-foreground prose-p:text-muted-foreground text-sm">
                <h2>Objet</h2>
                <p>
                    Les présentes conditions régissent l&apos;utilisation du site
                    fluxlab.fr, service de comparaison de matériel créatif.
                </p>
                <h2>Utilisation du service</h2>
                <p>
                    Fluxlab est un comparateur de prix et un outil de configuration. Nous
                    ne vendons aucun produit directement.
                </p>
                <h2>Responsabilité</h2>
                <p>
                    Les prix et disponibilités affichés sont fournis par nos marchands
                    partenaires et peuvent évoluer. Fluxlab s&apos;efforce de maintenir
                    des informations exactes mais ne garantit pas l&apos;exhaustivité des
                    données.
                </p>
                <h2>Propriété intellectuelle</h2>
                <p>
                    Le contenu éditorial (guides, analyses, avis synthétisés) est la
                    propriété de Fluxlab et ne peut être reproduit sans autorisation.
                </p>
            </div>
        </article>
    );
}
