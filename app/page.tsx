import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase'
import { transformProduct } from '@/lib/transformers'
import type { Product } from '@/types/database'
import { HeroSection } from '@/components/client/HeroSection'
import { HomeProductShowcase } from '@/components/home/HomeProductShowcase'
import { HomeGuides } from '@/components/home/HomeGuides'
import { JsonLd } from '@/components/server/JsonLd'

export const metadata: Metadata = {
  title: { absolute: 'Fluxlab | Comparateur Matériel Audio, Vidéo, Streaming' },
  description: "Comparateur indépendant multi-boutiques et guides d'achat spécialisés pour créateurs. Trouvez le meilleur prix parmi Amazon, Thomann, Woodbrass et plus.",
  alternates: { canonical: 'https://fluxlab.fr' },
}

export const revalidate = 0

async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createClient()
  const slugs = [
    'focusrite-scarlett-2i2-4th-gen',
    'shure-sm7b',
    'sony-zv-e10',
    'elgato-stream-deck-mk2',
  ]
  const { data } = await supabase
    .from('products')
    .select('*, product_offers(*)')
    .in('slug', slugs)

  if (!data) return []

  return (data as unknown[])
    .map(product => transformProduct(product as never))
    .sort((a, b) => slugs.indexOf(a.slug) - slugs.indexOf(b.slug))
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

  const homePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': 'https://fluxlab.fr/#webpage',
    url: 'https://fluxlab.fr',
    name: 'Fluxlab — Comparateur matériel Audio, Vidéo & Streaming',
    description: "Comparateur indépendant multi-boutiques et guides d'achat pour créateurs.",
    isPartOf: { '@id': 'https://fluxlab.fr/#website' },
    about: { '@type': 'Thing', name: 'Matériel audio vidéo streaming pour créateurs de contenu' },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://fluxlab.fr' }],
    },
  }

  const featuredProductsSchema = featuredProducts.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Sélections expertes Fluxlab',
    description: 'Les essentiels sélectionnés par Fluxlab',
    numberOfItems: featuredProducts.length,
    itemListElement: featuredProducts.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://fluxlab.fr/produit/${product.slug}`,
      name: product.name,
    })),
  } : null

  return (
    <>
      <JsonLd data={homePageSchema} />
      {featuredProductsSchema && <JsonLd data={featuredProductsSchema} />}
      <HeroSection />
      <HomeProductShowcase products={featuredProducts} />
      <HomeGuides />
    </>
  )
}
