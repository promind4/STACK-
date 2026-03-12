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
            <div className="prose prose-stone max-w-none prose-headings:text-foreground prose-p:text-muted-foreground text-sm space-y-4">
                <h2>1. Éditeur et Propriétaire du Site</h2>
                <p>Le site Internet <strong>Fluxlab</strong> accessible à l'adresse <em>fluxlab.fr</em> est édité par l'Équipe Fluxlab.</p>
                <p><strong>Contact :</strong> contact@fluxlab.fr</p>

                <h2>2. Hébergement</h2>
                <p>
                    Le site est hébergé par la société <strong>Vercel Inc.</strong><br/>
                    Adresse : 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.<br/>
                    Site internet : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>
                </p>

                <h2>3. Propriété intellectuelle</h2>
                <p>
                    La structure générale du site Fluxlab, ainsi que les textes, graphiques, images, sons et vidéos la composant, sont la propriété 
                    de l'éditeur ou de ses partenaires. Toute représentation, reproduction, ou exploitation partielle ou totale des contenus et services 
                    proposés par le site Fluxlab, par quelque procédé que ce soit, sans l'autorisation préalable et par écrit de l'éditeur est strictement 
                    interdite et serait susceptible de constituer une contrefaçon au sens des articles L 335-2 et suivants du Code de la propriété intellectuelle.
                </p>

                <h2>4. Liens hypertextes et Affiliation</h2>
                <p>
                    Le site Fluxlab contient des liens hypertextes vers d'autres sites présents sur le réseau Internet. Fluxlab participe à des programmes 
                    d'affiliation (notamment ceux d'Amazon EU, Thomann, et Woodbrass). Un achat effectué via un des ces liens partenaires peut nous faire 
                    percevoir une commission, <strong>sans aucun surcoût pour l'acheteur</strong>. Fluxlab décline toute responsabilité quant aux contenus 
                    des sites tiers vers lesquels ces liens dirigent.
                </p>

                <h2>5. Limitation de responsabilité</h2>
                <p>
                    L'éditeur s'efforce de fournir sur le site des informations aussi précises que possible. Toutefois, il ne pourra être tenu responsable des
                    omissions, des inexactitudes et des carences dans la mise à jour, qu'elles soient de son fait ou du fait des tiers partenaires qui lui
                    fournissent ces informations. Toutes les informations indiquées sur le site sont données à titre indicatif et sont susceptibles d'évoluer.
                </p>
                
                <h2>6. Droit applicable et juridiction compétente</h2>
                <p>
                    Tout litige en relation avec l'utilisation du site fluxlab.fr est soumis au droit français. 
                    En dehors des cas où la loi ne le permet pas, il est fait attribution exclusive de juridiction aux tribunaux compétents.
                </p>
            </div>
        </article>
    );
}
