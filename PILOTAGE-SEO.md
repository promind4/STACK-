# Fluxlab — Pilotage SEO & Croissance Organique
> Branche : `seo-performance-2026` — Créée le 17/06/2026
> Mise à jour : 17/06/2026

---

## Outils disponibles

| Outil | Chemin | Usage |
|---|---|---|
| **Superpowers** | `D:\CLAUDE\plugins\superpowers` | Exécution, automatisation, agents parallèles |
| **Marketing Skills** | `D:\CLAUDE\plugins\marketingskills` | Audit SEO, contenu, concurrents, CRO |
| **UI/UX Pro Max** | Skill `/ui-ux-pro-max` | Micro-interactions, animations, UX ciblées |
| **Site live** | https://www.fluxlab.fr | Production (branche `design-refonte`) |
| **Repo** | https://github.com/promind4/STACK-.git | Branche de travail : `seo-performance-2026` |

### Fichiers d'audit (référence)
- `D:\Stackera\AUDIT-MARKETING-JUIN-2026.md` — Audit interne code source
- `D:\Stackera\AUDIT-COMPLEMENT-JUIN-2026.md` — Audit live + benchmark concurrentiel

### Skills Marketing utiles pour audits
- `marketingskills/skills/ai-seo/` — Optimisation contenu pour LLMs
- `marketingskills/skills/competitors/` — Pages comparatives VS
- `marketingskills/skills/seo-audit/` — Audit SEO technique
- `marketingskills/skills/content-strategy/` — Stratégie contenu
- `marketingskills/skills/cro/` — Conversion rate optimization

---

## Chiffres de référence (Juin 2026)

| Indicateur | Valeur |
|---|---|
| Impressions GSC (4 mois) | ~2 500 |
| Clics organiques | ~20–30 |
| Pages dans le sitemap | 448 |
| Pages indexées | ~20 (4,5%) |
| Articles publiés | 23 |
| Produits en base | 383 |
| Position estimée "meilleur micro podcast" | 1ère page |
| CTR moyen estimé | ~1% |

---

## Plan d'action global

### Phase 0 — Fondations (ce chantier, branche seo-performance-2026)
Corriger ce qui bloque l'indexation et dégrade les performances. **Sans ça, aucun nouveau contenu ne sert à rien.**

### Phase 1 — Trafic longtail (mois 1–3)
Articles ciblés sur des requêtes longue traîne peu compétitives en FR.

### Phase 2 — Autorité thématique (mois 3–6)
Hubs de contenu + présence externe (Reddit, Discord, YouTube).

### Phase 3 — Acquisition hors SEO (mois 6–12)
Affiliation Amazon active, campagnes, partenariats créateurs FR.

---

## Phase 0 — Corrections prioritaires

### 🔴 CRITIQUE — À faire immédiatement

| # | Tâche | Fichier | Statut |
|---|---|---|---|
| P0-1 | Supprimer `app/robots.ts` (conflit avec `public/robots.txt`) | `app/robots.ts` | ✅ Fait (session 1) |
| P0-2 | Consolider `public/robots.txt` (AI bots + disallows corrects) | `public/robots.txt` | ✅ Fait (session 1) |
| P0-3 | Corriger date article xlr-vs-usb (Oct 2026 → Oct 2025) | `lib/articles-meta.ts` | ✅ Fait (session 2) |
| P0-4 | Fixer `lastModified: new Date()` → vraies dates dans sitemap | `app/sitemap.ts` | ✅ Fait (session 2) |
| P0-5 | Corriger 6 `relatedCategorySlug` incorrects | `lib/articles-meta.ts` | ✅ Fait (session 2) |
| P0-6 | Passer `revalidate = 86400` sur guides (était 0) | `app/guide/[slug]/page.tsx` | ✅ Fait (session 2) |
| P0-7 | Passer `revalidate = 3600` sur produits (était 0) | `app/produit/[slug]/page.tsx` | ✅ Fait (session 2) |
| P0-8 | Corriger prix Rode PodMic (100€ vs 179€ réel) + recalculer setup 300€ | `lib/data.ts` (articles 23 + 24) | ⚠️ En suspens — nécessite recalcul du setup budget |

> ⚠️ **P0-8 — Détail** : L'article `setup-podcast-300-euros-2026` cite le PodMic USB à ~100€ alors que le prix réel FR est ~179€ (Thomann/Amazon). Si on corrige le prix, le total dépasse 300€ et le titre de l'article devient faux. Options : (a) remplacer le PodMic par un micro moins cher (ex. Rode NT-USB Mini ~100€) dans ce setup, (b) réécrire l'article en "Setup podcast à 350-400€", (c) créer un article "Setup podcast 200€" avec micro USB seul. **Décision requise avant implémentation.**

### 🟡 IMPORTANT — Ce mois

| # | Tâche | Fichier | Statut |
|---|---|---|---|
| P1-1 | Réactiver newsletter Footer | `components/server/Footer.tsx` | ⬜ À faire |
| P1-2 | Ajouter `updatedAt` distinct de `date` dans les articles | `lib/articles-meta.ts` | ✅ Fait (session 2) — champ ajouté à l'interface |
| P1-3 | Schema Article → passer author en `Person` (pas Organization) + dateModified réel | `app/guide/[slug]/page.tsx` | ✅ Fait (session 2) |
| P1-4 | Ajouter `sameAs` dans l'Organization JSON-LD (Instagram) | `app/layout.tsx` | ✅ Fait (session 2) |
| P1-5 | Remplacer boutons carousel sans onClick par lien "Voir tout l'audio" | `app/page.tsx` | ✅ Fait (session 2) |
| P1-6 | Fixer CTA "Explorer tous les produits" → "Explorer la sélection audio" | `app/page.tsx` | ✅ Fait (session 2) |
| P1-7 | Article author byline → `article.author` + `updatedAt` | `app/guide/[slug]/page.tsx` | ✅ Fait (session 2) |
| P1-8 | Retirer claims non étayés ("tests acoustiques réels", "ingénieurs son") | `app/a-propos/page.tsx`, `app/page.tsx` | ✅ Fait (session 2) |

### 🟢 PROCHAIN TRIMESTRE

| # | Tâche | Priorité |
|---|---|---|
| Q2-1 | Guide "Focusrite Scarlett 2i2 vs Audient iD4" | ⭐⭐⭐⭐⭐ |
| Q2-2 | Guide "Shure MV7 vs MV7X" | ⭐⭐⭐⭐⭐ |
| Q2-3 | Enrichir 5 articles "1 min" → 1 500+ mots | ⭐⭐⭐⭐ |
| Q2-4 | TOC scrollspy dynamique (IntersectionObserver) | ⭐⭐⭐ |
| Q2-5 | Article "Comment fonctionne le configurateur Fluxlab" | ⭐⭐⭐⭐ |
| Q2-6 | Page auteur dédiée avec bio | ⭐⭐⭐⭐ |
| Q2-7 | Présence Reddit/Discord (partager configurateur) | ⭐⭐⭐⭐ |
| Q2-8 | Wishlist → localStorage persisté | ⭐⭐ |

---

## Benchmark concurrents (référence)

| Concurrent | Trafic estimé | Forces | Faiblesses |
|---|---|---|---|
| **ProjetHomeStudio.fr** | 560 000/an | Auteur nommé (ingénieur), 10 ans DA, YouTube | Pas de configurateur, pas de comparateur prix |
| **Audiofanzine.com** | Très élevé | Tests empiriques, audio samples, communauté | Pas d'outil, vieux design |
| **MediaKit.fr** | Moyen-élevé | 5000+ mots, expert nommé, maillage dense | Pas de tableau comparatif, pas de configurateur |
| **FormaSound.fr** | Moyen | Auteur pro, 3500 mots | Biaisé vers ses formations |
| **Deskup.io** | Moyen | Auteur visible, design propre | Généraliste, peu audio-spécifique |
| **MademoiselleAudio.com** | Faible-moyen | Amazon affiliate simple | Pas de valeur ajoutée, pas d'outil |

**Avantage Fluxlab unique** : Configurateur IA + comparateur multi-marchands. Personne d'autre ne fait ça en FR.

---

## Requêtes prioritaires à cibler

### En position / à consolider
- "meilleur micro podcast 2026" → /guide/meilleur-micro-podcast-2026 ← **déjà 1ère position**
- "XLR vs USB" → /guide/xlr-vs-usb ← bonne position

### Quick wins (faible compétition FR)
- "focusrite scarlett 2i2 vs audient id4" → article VS à créer
- "shure mv7 vs mv7x" → article VS à créer
- "cloudlifter shure sm7b scarlett" → article existant à enrichir
- "micro podcast voix grave" → article existant à enrichir

### Cibles moyen terme (plus compétitif)
- "interface audio débutant" → article à créer (concurrents : FormaSound, ProjetHomeStudio)
- "meilleure webcam youtube 2026" → article à créer
- "home studio 500 euros" → article existant à enrichir

---

## Sessions passées

### Session 1 — 17/06/2026
**Audit réalisé** : Audit interne (code source) + audit complémentaire (crawl live + benchmark)
**Branche créée** : `seo-performance-2026`
**Corrections implémentées** : P0-1 (suppression app/robots.ts), P0-2 (consolidation public/robots.txt)
**Fichiers** :
- `D:\Stackera\AUDIT-MARKETING-JUIN-2026.md`
- `D:\Stackera\AUDIT-COMPLEMENT-JUIN-2026.md`

### Session 2 — 19/06/2026
**Corrections implémentées** :
- P0-3 : Date xlr-vs-usb corrigée "12 Oct 2026" → "12 Oct 2025"
- P0-4 : `lastModified: new Date()` retiré du sitemap → dates réelles par page + priorité configurateur montée à 0.9
- P0-5 : 6 `relatedCategorySlug` incorrects corrigés (microphones→micros-usb, lighting→keylight, interfaces-audio×2→cartes-son, casques→casques-studio, microphones→micros-dynamiques)
- P0-6 : `revalidate = 0` → `86400` sur `app/guide/[slug]/page.tsx`
- P0-7 : `revalidate = 0` → `3600` sur `app/produit/[slug]/page.tsx`
- P1-2 : Champ `updatedAt?: string` ajouté à l'interface `ArticleMeta`
**En suspens** : P0-8 (prix PodMic USB — décision prise : réécriture en "Setup 350€" — implémentée session 2)
- P0-8 : Article `setup-podcast-300-euros-2026` → renommé `setup-podcast-350-euros-2026`, prix PodMic corrigé ~100€→~179€, total ~285€→~365€, titre et intro mis à jour

**Phase 1 — Corrections importantes :**
- P1-3 : Schema Article author → `Person` (article.author), dateModified → `updatedAt || date`
- P1-4 : `sameAs: ["https://www.instagram.com/the_fluxlab"]` dans Organization JSON-LD
- P1-5 : Boutons carousel sans onClick remplacés par lien "Voir tout l'audio"
- P1-6 : CTA "Explorer tous les produits" → "Explorer la sélection audio" (honnête)
- P1-7 : Byline guide → `article.author` + `updatedAt || date`
- P1-8 : Claims non étayés retirés ("Tests acoustiques réels"→"Critères stricts et documentés", "Support ingénieurs son"→"Transparence sur nos sources")

---

## Comment relancer un audit avec Marketing Skills

```bash
# Depuis D:\Stackera\fluxlab-next
# Utiliser le skill /seo-audit de marketingskills
# Référencer ce fichier pour le contexte
# Comparer avec les métriques GSC de la session précédente
```

**Checklist avant chaque audit** :
- [ ] Exporter les données GSC (Performance > Télécharger CSV)
- [ ] Exporter GA4 (Rapports > Acquisition > Organique)
- [ ] Vérifier le nombre de pages indexées dans GSC (Indexation > Pages)
- [ ] Comparer avec les chiffres de la session précédente

---

*Fichier à mettre à jour à chaque session. Ne pas supprimer les sessions passées.*
