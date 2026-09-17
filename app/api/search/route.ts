import { createClient } from '@/lib/supabase';
import { NextRequest } from 'next/server';
import { isPublicAudioCategory } from '@/lib/public-audio-scope';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? '';
  if (q.trim().length < 2) return Response.json([]);

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('slug, name, brand, image_url, rating, categories(slug), product_offers(price)')
      .ilike('name', `%${q}%`)
      .eq('is_active', true)
      .order('name')
      .limit(20);

    if (error) {
      console.error('[search] Supabase error:', error.message);
      return Response.json([]);
    }

    const publicRows = (data ?? []).filter((product: any) => {
      const category = Array.isArray(product.categories) ? product.categories[0] : product.categories;
      return isPublicAudioCategory(category?.slug);
    }).slice(0, 8);

    // Calcul du prix minimum depuis les offres
    const results = publicRows.map((p: any) => ({
      slug:      p.slug,
      name:      p.name,
      brand:     p.brand,
      image_url: p.image_url,
      rating:    p.rating,
      price:     p.product_offers?.length
        ? Math.min(...p.product_offers.map((o: any) => o.price).filter((v: number) => v > 0))
        : 0,
    }));

    return Response.json(results);
  } catch (err) {
    console.error('[search] Exception:', err);
    return Response.json([]);
  }
}
