/**
 * FLUXLAB — Endpoint de mise à jour des prix.
 *
 * Deux modes d'accès :
 *  • CRON Vercel  : en-tête `Authorization: Bearer ${CRON_SECRET}`
 *  • Admin manuel : en-tête `Authorization: Bearer ${jwt_supabase}` (session admin)
 *
 * Paramètres :
 *  • ?productId=<uuid>  → ne met à jour qu'un produit (test)
 *  • ?dry=1             → simulation, n'écrit rien en base
 *
 * Runtime Node (accès réseau sortant + service role).
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { updatePrices } from '@/lib/pricing';

export const runtime = 'nodejs';
export const maxDuration = 60; // Vercel Pro : jusqu'à 60s. Hobby : 10s (préférer ?productId par lots).
export const dynamic = 'force-dynamic';

async function isAuthorized(req: NextRequest): Promise<boolean> {
  const auth = req.headers.get('authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  if (!token) return false;

  // 1. Secret du cron
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && token === cronSecret) return true;

  // 2. JWT d'un admin connecté (vérifié côté serveur)
  try {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );
    const { data, error } = await supabase.auth.getUser(token);
    if (!error && data?.user) return true;
  } catch { /* ignore */ }

  return false;
}

async function handle(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const productId = req.nextUrl.searchParams.get('productId') || undefined;
  const dryRun = req.nextUrl.searchParams.get('dry') === '1';
  // Le test d'un seul produit force la mise à jour (ignore le cache de fraîcheur).
  const force = req.nextUrl.searchParams.get('force') === '1' || Boolean(productId);

  try {
    const summary = await updatePrices({ productId, dryRun, force });
    return NextResponse.json({ ok: true, dryRun, ...summary });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Erreur serveur' }, { status: 500 });
  }
}

// Vercel Cron appelle en GET ; l'admin déclenche en POST.
export const GET = handle;
export const POST = handle;
