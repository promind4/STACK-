import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

interface AiAnswer {
  question: string;
  answer: string;
}

/* ── Extract numeric budget from any answer text ─── */
function parseBudget(answers: AiAnswer[]): number {
  const budgetQ = answers.find(a => a.question.toLowerCase().includes('budget'));
  if (!budgetQ) return 800;

  const text = budgetQ.answer.toLowerCase();

  // Preset options
  if (text.includes('moins de 300') || text.includes('strict') || text.includes('essentiel')) return 300;
  if (text.includes('300') && (text.includes('800') || text.includes('entre'))) return 800;
  if (text.includes('plus de 800') || text.includes('qualité maximale')) return 5000;

  // Custom: extract all numbers followed by € and take the max
  const matches = [...text.matchAll(/(\d[\d\s]*)\s*€/g)];
  if (matches.length > 0) {
    const vals = matches.map(m => parseInt(m[1].replace(/\s/g, ''), 10)).filter(v => !isNaN(v) && v >= 50);
    if (vals.length > 0) return Math.max(...vals);
  }

  // Fallback: extract first standalone number ≥ 100
  const numMatch = text.match(/\b(\d{3,5})\b/);
  if (numMatch) return parseInt(numMatch[1], 10);

  return 800;
}

/* ── Map product to component type using category slug ── */
function getComponentType(categorySlug: string): string {
  const s = categorySlug.toLowerCase();
  if (s.includes('micro')) return 'microphone';
  if (s.includes('interface')) return 'interface';
  if (s.includes('casque') || s.includes('headphone') || s.includes('iem') || s.includes('ecouteur')) return 'casque';
  if (s.includes('camera') || s.includes('webcam') || s.includes('camescope') || s.includes('camé')) return 'camera';
  if (s.includes('eclairage') || s.includes('lumiere') || s.includes('light') || s.includes('panel') || s.includes('anneau')) return 'eclairage';
  if (s.includes('acoustique') || s.includes('traitement') || s.includes('mousse') || s.includes('panneau')) return 'traitement';
  if (s.includes('enceinte') || s.includes('moniteur') || (s.includes('monitor') && !s.includes('micro'))) return 'monitors';
  return 'autre';
}

/* ── Add USB/XLR hint for microphones ─────────────── */
function getMicType(categorySlug: string): string {
  const s = categorySlug.toLowerCase();
  if (s.includes('usb')) return 'USB';
  if (s.includes('xlr')) return 'XLR';
  return 'USB/XLR';
}

export async function POST(req: NextRequest) {
  const { answers }: { answers: AiAnswer[] } = await req.json();

  if (!answers || answers.length === 0) {
    return NextResponse.json({ error: 'Réponses manquantes' }, { status: 400 });
  }

  if (!OPENROUTER_API_KEY) {
    console.warn('[ai-setup] OPENROUTER_API_KEY not set');
    return NextResponse.json({ error: 'Clé API manquante' }, { status: 500 });
  }

  /* ── Detect budget early for pre-filtering ─────── */
  const budget = parseBudget(answers);

  /* ── Fetch catalog ─────────────────────────────── */
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: rawProducts, error: dbError } = await supabase
    .from('products')
    .select('id, name, brand, slug, categories(slug), product_offers(price)')
    .eq('is_active', true);

  if (dbError) {
    console.error('[ai-setup] Supabase error:', dbError);
    return NextResponse.json({ error: 'Erreur base de données' }, { status: 500 });
  }

  /* ── Build enriched, grouped catalog ──────────── */
  const grouped: Record<string, any[]> = {
    microphones: [],
    interfaces: [],
    casques: [],
    monitors: [],
    cameras: [],
    eclairages: [],
    traitement: [],
  };

  for (const p of rawProducts ?? []) {
    const categorySlug: string = (p as any).categories?.slug ?? '';
    const type = getComponentType(categorySlug);
    if (type === 'autre') continue;

    const offers: any[] = (p as any).product_offers ?? [];
    const prices = offers.map((o: any) => o.price).filter(Boolean) as number[];
    const minPrice = prices.length > 0 ? Math.min(...prices) : null;

    // Pre-filter: skip products way over budget (allow up to budget × 1.5 per item, min 2 per group)
    const perItemMax = budget < 5000 ? budget * 0.75 : Infinity;

    const entry: any = {
      slug: (p as any).slug,
      name: (p as any).name,
      brand: (p as any).brand,
      price: minPrice,
    };

    if (type === 'microphone') {
      entry.connexion = getMicType(categorySlug);
      if (minPrice === null || minPrice <= perItemMax || grouped.microphones.length < 3) {
        grouped.microphones.push(entry);
      }
    } else if (type === 'interface') {
      if (minPrice === null || minPrice <= perItemMax || grouped.interfaces.length < 2) {
        grouped.interfaces.push(entry);
      }
    } else if (type === 'casque') {
      if (minPrice === null || minPrice <= perItemMax || grouped.casques.length < 2) {
        grouped.casques.push(entry);
      }
    } else if (type === 'camera') {
      if (minPrice === null || minPrice <= perItemMax || grouped.cameras.length < 2) {
        grouped.cameras.push(entry);
      }
    } else if (type === 'monitors') {
      if (minPrice === null || minPrice <= perItemMax || grouped.monitors.length < 2) {
        grouped.monitors.push(entry);
      }
    } else if (type === 'eclairage') {
      if (minPrice === null || minPrice <= perItemMax || grouped.eclairages.length < 2) {
        grouped.eclairages.push(entry);
      }
    } else if (type === 'traitement') {
      grouped.traitement.push(entry);
    }
  }

  // Sort catalog: high budget → expensive products first so LLM selects quality items
  // Low budget → cheapest first for value-oriented recommendations
  for (const key of Object.keys(grouped)) {
    if (budget >= 800) {
      grouped[key].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    } else {
      grouped[key].sort((a, b) => (a.price ?? 9999) - (b.price ?? 9999));
    }
  }

  /* ── Build prompt ─────────────────────────────── */
  const userAnswers = answers.map(a => `• ${a.question} → ${a.answer}`).join('\n');

  const catalogSection = `
MICROPHONES disponibles (connexion USB = plug & play, XLR = nécessite interface) :
${JSON.stringify(grouped.microphones)}

INTERFACES AUDIO (obligatoire si micro XLR sélectionné) :
${JSON.stringify(grouped.interfaces)}

CASQUES STUDIO :
${JSON.stringify(grouped.casques)}

ENCEINTES DE MONITORING (pour musique/production — écoute critique et mixage) :
${JSON.stringify(grouped.monitors)}

CAMÉRAS / WEBCAMS (seulement si streaming ou vlog) :
${JSON.stringify(grouped.cameras)}

ÉCLAIRAGES (anneau LED, panneau, etc.) :
${JSON.stringify(grouped.eclairages)}

TRAITEMENT ACOUSTIQUE :
${JSON.stringify(grouped.traitement)}`.trim();

  /* ── Per-component price targets based on budget ── */
  const minMicPrice = budget >= 2000 ? Math.round(budget * 0.15)
                    : budget >= 1000 ? Math.round(budget * 0.12)
                    : budget >= 500  ? Math.round(budget * 0.10)
                    : 0;

  const componentTargets = budget >= 400 ? `
CIBLES DE PRIX PAR COMPOSANT (basées sur le budget de ${budget}€) :
- Microphone : environ ${Math.round(budget * 0.25)}€ (priorité principale)
- Interface audio (si XLR) : environ ${Math.round(budget * 0.18)}€
- Casque studio : environ ${Math.round(budget * 0.14)}€${budget >= 700 ? `\n- Enceintes monitoring (si musique) : environ ${Math.round(budget * 0.18)}€` : ''}
NE PAS choisir le produit le moins cher — choisir le produit dont le prix est LE PLUS PROCHE de la cible.` : '';

  const minPriceRule = minMicPrice > 50
    ? `\n16. PRIX MINIMUM ABSOLU DU MICRO : pour ce budget de ${budget}€, le microphone doit obligatoirement coûter ≥ ${minMicPrice}€. Si le catalogue contient un micro plus qualitatif dans cette gamme, le choisir en priorité. Ignorer tous les micros moins chers si de meilleures options existent.`
    : '';

  const budgetLabel = `${budget}€ maximum — à ne JAMAIS dépasser. Pour chaque composant nécessaire, sélectionne le meilleur produit dont le prix est proche des cibles indiquées ci-dessus. N'ajoute pas de composants inutiles au profil, mais pour ceux qui sont utiles, choisis la qualité adaptée au budget.`;

  const prompt = `Tu es l'assistant IA de Fluxlab, spécialiste français du matériel audio/vidéo pour créateurs de contenu. Tu raisonnes comme un ingénieur du son honnête : tu ne recommandes que l'utile, jamais pour faire du chiffre.

PROFIL UTILISATEUR :
${userAnswers}

CONTRAINTE BUDGET : ${budgetLabel}
${componentTargets}

${catalogSection}

Sélectionne le setup le plus pertinent pour ce profil précis.
Réponds UNIQUEMENT avec cet objet JSON valide, sans backticks ni markdown :
{"mic":"slug","audioInterface":"slug ou null","headphones":"slug ou null","monitors":"slug ou null","camera":"slug ou null","lights":["slug"],"acousticTreatment":"slug ou null","explanations":{"slug":"raison courte max 12 mots en français"},"tips":"conseil d'utilisation pratique en une phrase","budgetNote":"phrase courte qui justifie la sélection et l'usage du budget"}

RÈGLES STRICTES :
1. N'utilise QUE des slugs présents dans le catalogue ci-dessus — aucun slug inventé.
2. INTELLIGENCE AVANT TOUT : recommande UNIQUEMENT le matériel réellement utile à ce profil. La qualité prime sur la quantité.
3. NE GONFLE JAMAIS la sélection pour « remplir » le budget avec du matériel inutile. N'ajoute que les composants réellement nécessaires au profil. MAIS pour chaque composant nécessaire, sélectionne la qualité proportionnelle au budget (voir cibles ci-dessus) — ne choisis JAMAIS le produit le moins cher par défaut si de meilleures options existent.
4. ÉCLAIRAGE : seulement pour streaming ou vidéo/YouTube. JAMAIS pour podcast ou musique/chant — SAUF si l'utilisateur le demande explicitement dans ses précisions.
5. CAMÉRA : seulement pour streaming ou vidéo/YouTube. JAMAIS pour podcast ou musique/chant — SAUF demande explicite de l'utilisateur.
6. Musique/chant → micro XLR + interface + casque + enceintes de monitoring (si budget ≥ 700€) ; traitement acoustique si la pièce n'est pas traitée. Aucune caméra, aucun éclairage. Si budget < 500€, micro USB acceptable.
7. Podcast/interview → micro + interface + casque. Caméra uniquement si l'utilisateur mentionne la vidéo. "monitors" = null.
8. Streaming → micro (USB si budget serré, sinon XLR + interface) + casque ; caméra et éclairage selon le budget. "monitors" = null.
9. Nomade → micro USB compact uniquement, pas d'interface, pas d'enceintes. Si vidéo YouTube/vlogging en nomade : caméra hybride ou compacte (JAMAIS une webcam — webcam = usage bureau fixe uniquement). Pas d'éclairage fixe pour le nomade.
10. Connexion micro : micro XLR → audioInterface OBLIGATOIRE ; micro USB → audioInterface = null.
11. Ne recommande RIEN dans une catégorie déjà possédée par l'utilisateur.
12. "tips" = UN seul conseil pratique d'utilisation (placement micro, acoustique, gain) — JAMAIS de nom de produit ni de marque.
13. "budgetNote" = une phrase courte (max 25 mots), positive, en français, qui justifie la sélection et l'usage du budget. Si le total est nettement sous le budget, présente-le comme un avantage (ex : « Pas besoin de tout votre budget : ce setup couvre parfaitement vos besoins, vous gardez de la marge. »). Aucun nom de produit.
14. QUALITÉ PROPORTIONNELLE AU BUDGET : le niveau de l'utilisateur indique son expérience technique, pas la gamme à recommander. Budget ≤ 400€ → entrée de gamme. Budget 400-900€ → milieu de gamme. Budget 900-2000€ → semi-pro. Budget > 2000€ → pro. JAMAIS un micro USB à 100€ si le budget est > 700€ (sauf nomade).
15. ENCEINTES DE MONITORING : "monitors" = slug si musique/chant + budget ≥ 700€ + enceintes disponibles dans le catalogue. Sinon "monitors" = null.${minPriceRule}`;

  /* ── Call OpenRouter with manual fallback ────── */
  const MODELS = [
    'openai/gpt-oss-120b:free',
    'qwen/qwen3-next-80b-a3b-instruct:free',
    'nvidia/nemotron-3-ultra-550b-a55b:free',
    'openai/gpt-oss-20b:free',
    'meta-llama/llama-3.3-70b-instruct:free',
  ];

  let orRes: Response | null = null;
  for (const model of MODELS) {
    const attempt = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://fluxlab.fr',
        'X-Title': 'Fluxlab AI Configurateur',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 800,
      }),
    });

    if (attempt.ok) {
      console.log(`[ai-setup] Using model: ${model}`);
      orRes = attempt;
      break;
    }
    console.warn(`[ai-setup] ${model} failed (${attempt.status}), trying next`);
  }

  if (!orRes) {
    console.error('[ai-setup] All models failed');
    return NextResponse.json({ error: 'Erreur OpenRouter' }, { status: 502 });
  }

  const orData = await orRes.json();
  const content: string = orData.choices?.[0]?.message?.content ?? '';

  /* ── Parse JSON from LLM response ────────────── */
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('[ai-setup] No JSON in response:', content);
    return NextResponse.json({ error: 'Format invalide' }, { status: 500 });
  }

  let recommendation: any;
  try {
    recommendation = JSON.parse(jsonMatch[0]);
  } catch {
    console.error('[ai-setup] JSON parse error:', jsonMatch[0]);
    return NextResponse.json({ error: 'JSON invalide' }, { status: 500 });
  }

  return NextResponse.json({ recommendation, budget });
}
