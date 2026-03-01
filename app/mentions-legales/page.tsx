import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mentions Légales",
    alternates: { canonical: "https://fluxlab.fr/mentions-legales" },
};

export default function MentionsLegales() {
    return (
        <article className="container mx-auto px-6 max-w-[800px] py-20">
            <h1 className="text-3xl font-bold text-foreground mb-8">
                Mentions Légales
            </h1>
            <div className="prose prose-stone max-w-none prose-headings:text-foreground prose-p:text-muted-foreground text-sm">
                <h2>Éditeur du site</h2>
                <p>Fluxlab — fluxlab.fr</p>
                <p>Contact : contact@fluxlab.fr</p>
                <h2>Hébergement</h2>
                <p>Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.</p>
                <h2>Propriété intellectuelle</h2>
                <p>
                    L&apos;ensemble des contenus, textes, images, et logos présents sur ce
                    site sont la propriété exclusive de Fluxlab, sauf mention contraire.
                </p>
                <h2>Liens affiliés</h2>
                <p>
                    Ce site contient des liens d&apos;affiliation vers des marchands
                    partenaires (Amazon, Thomann, etc.). Ces liens nous permettent de
                    percevoir une commission sans surcoût pour l&apos;utilisateur.
                </p>
            </div>
        </article>
    );
}
