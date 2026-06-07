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
            <div className="prose prose-stone max-w-none prose-headings:text-foreground prose-p:text-muted-foreground text-sm space-y-4">
                <h2>1. Collecte des données personnelles</h2>
                <p>
                    La consultation du site <strong>Fluxlab</strong> (fluxlab.fr) est possible sans que vous ayez à révéler votre identité ni toute autre information 
                    à caractère personnel vous concernant. Fluxlab s'engage au respect de la vie privée de ses utilisateurs et se conforme aux principes du 
                    Règlement Général sur la Protection des Données (RGPD).
                </p>

                <h2>2. Mesure d'audience (Analytics)</h2>
                <p>
                    Afin d'améliorer l'expérience utilisateur, nous utilisons des outils de mesure d'audience respectueux de la vie privée (tels que <em>Vercel Analytics</em>).
                    Ces outils mesurent le trafic de manière globale et anonyme. <strong>Aucun cookie publicitaire ou traceur tiers invasif n'est déposé</strong> sur 
                    votre appareil lors de la navigation sur nos pages. Les adresses IP sont anonymisées ou non-stockées.
                </p>

                <h2>3. Partage d'informations avec des tiers (Affiliation)</h2>
                <p>
                    Fluxlab contient des liens d'affiliation redirigeant vers des sites marchands (Amazon, Thomann, Woodbrass). Lorsque vous cliquez sur l'un de ces 
                    liens, vous quittez le site Fluxlab. Dès lors, ce sont les politiques de confidentialité de ces sites partenaires qui s'appliquent. Fluxlab 
                    ne transmet et ne reçoit aucune donnée personnelle (comme vos noms ou informations de paiement) de ces sites marchands. La seule donnée 
                    échangée est un identifiant de tracking d'affiliation indiquant au marchand que l'internaute provient de notre site.
                </p>

                <h2>4. Sécurité des données</h2>
                <p>
                    Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger les données du site contre la manipulation, 
                    la perte, la destruction ou l'accès par des personnes non autorisées, notamment via le protocole HTTPS garantissant le chiffrement des échanges.
                </p>

                <h2>5. Vos droits</h2>
                <p>
                    Conformément à la réglementation européenne en vigueur (RGPD), dans la mesure limitée où nous viendrions à traiter des données personnelles 
                    (par exemple via un futur formulaire de contact), vous disposez d'un droit d'accès, de rectification, d'effacement, ainsi que d'un droit à 
                    la portabilité de vos données et à la limitation du traitement.
                </p>

                <h2>6. Contact</h2>
                <p>
                    Pour toute question relative à cette politique de confidentialité ou pour exercer vos droits, vous pouvez nous contacter à l'adresse suivante : 
                    <br/><strong>contact@fluxlab.fr</strong>.
                </p>
                <p><em>Dernière mise à jour : Mars 2026</em></p>
            </div>
        </article>
    );
}
