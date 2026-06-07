import { createClient } from '@/lib/supabase';
import { transformProduct } from '@/lib/transformers';
import { ProductCard } from '@/components/ui/ProductCard';
import Link from 'next/link';
import { Metadata } from 'next';

export const revalidate = 0;

interface Props { searchParams: Promise<{ q?: string }> }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `"${q}" — Recherche` : 'Recherche' };
}

export default async function RechercherPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (q ?? '').trim();

  let products: any[] = [];

  if (query.length >= 2) {
    const supabase = createClient();
    const { data } = await supabase
      .from('products')
      .select('*, product_offers(*)')
      .ilike('name', `%${query}%`)
      .eq('is_active', true)
      .order('name')
      .limit(40);

    products = (data ?? []).map((p: any) => transformProduct(p));
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header compact */}
      <div className="border-b border-border/50 bg-secondary">
        <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-16 py-8 pt-24">
          <nav className="flex items-center gap-2 text-[11px] font-mono text-foreground/45 uppercase tracking-wider mb-4">
            <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="m9 18 6-6-6-6"/></svg>
            <span className="text-foreground/70">Recherche</span>
          </nav>
          {query ? (
            <h1 className="font-serif text-foreground text-[32px] md:text-[42px] leading-tight tracking-tight">
              Résultats pour <span className="italic text-primary">« {query} »</span>
              <span className="text-[16px] text-foreground/40 font-sans font-light ml-4 not-italic">
                {products.length} produit{products.length !== 1 ? 's' : ''}
              </span>
            </h1>
          ) : (
            <h1 className="font-serif text-foreground text-[32px] tracking-tight">Recherche</h1>
          )}
        </div>
      </div>

      {/* Grille résultats */}
      <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-16 py-12">
        {!query ? (
          <p className="text-[15px] text-foreground/55 font-light">Tapez un mot-clé dans la barre de recherche.</p>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-serif text-[24px] text-foreground mb-3">Aucun résultat pour « {query} »</p>
            <p className="text-[14px] text-foreground/50 font-light mb-8">Essayez un terme différent ou parcourez nos catégories.</p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {[
                { label: 'Studio & Son', href: '/categorie/audio' },
                { label: 'Image & Lumière', href: '/categorie/video' },
                { label: 'Streaming', href: '/categorie/streaming' },
              ].map(cat => (
                <Link key={cat.href} href={cat.href}
                  className="h-10 px-6 rounded-full border border-border text-[12px] font-mono uppercase tracking-wider hover:border-primary hover:text-primary transition-colors flex items-center">
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
