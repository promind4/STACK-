import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
                Page introuvable
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
                Cette page n&apos;existe pas ou a été déplacée.
            </p>
            <Link
                href="/"
                className="bg-primary text-white px-6 py-3 rounded-xl hover:opacity-90 transition-opacity font-medium"
            >
                Retour à l&apos;accueil
            </Link>
        </div>
    );
}
