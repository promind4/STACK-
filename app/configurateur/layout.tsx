import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Configurateur IA | Fluxlab',
    description: 'Créez votre setup studio sur mesure avec notre configurateur intelligent. Audio, Vidéo et Streaming.',
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
