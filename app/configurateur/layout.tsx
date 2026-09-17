import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'L’Atelier Fluxlab',
    description: 'Composez un setup créatif cohérent selon votre usage, votre matériel actuel, votre environnement et votre budget.',
    alternates: {
        canonical: 'https://fluxlab.fr/configurateur',
    },
};

export default function ConfiguratorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
