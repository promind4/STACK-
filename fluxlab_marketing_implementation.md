# Fluxlab — Plan d'implémentation Marketing
> Créé le 07/06/2026 — À utiliser comme référence pour la prochaine session de travail

---

## 1. Contexte projet

- **Site** : [fluxlab.fr](https://fluxlab.fr) — comparateur matériel audio/vidéo/streaming pour créateurs FR
- **Stack** : Next.js 14 App Router + TypeScript + Supabase PostgreSQL + Tailwind CSS
- **Repo** : branche `design-refonte` poussée sur GitHub, à déployer sur Vercel (changer production branch `master` → `design-refonte`)
- **Stade** : 4 mois, ~2 500 impressions GSC, ~20-30 clics réels (50 totaux dont ~20 de l'auteur)
- **Modèle économique** : Affiliation Amazon / Thomann / Woodbrass (Amazon pas encore actif — nécessite trafic d'abord)
- **Fonctionnalité clé** : Configurateur IA (`/configurateur`) — différenciateur principal, sous-exploité

---

## 2. État technique actuel

- Schema.org JSON-LD implémenté sur toutes les pages
- 419 pages générées, ~20 indexées sur Google, ~380 soumises en attente
- Newsletter (La Gazette du Labo) **masquée** dans Footer.tsx (commentaire laissé)
- Responsive mobile entièrement revu
- Titles dédupliqués (plus de "| Fluxlab" en doublon)
- Guides : sidebar gauche avec sommaire + liste produits cités + articles connexes en bas

---

## 3. Décisions validées lors de l'audit

### A. Hero Section CTA
- **Changement** : Remplacer le CTA actuel par → **"Trouver mon setup idéal en 2 min"**
- Fichier : `components/client/HeroSection.tsx`
- Rationale : "Explorer" trop passif → résultat + temps + pas limité à un seul type de produit

### B. Badges produits sur pages catégorie
- **Changement** : Ajouter 2-3 badges visuels sur les pages catégorie avec beaucoup de produits
- Deux niveaux :
  - `"Notre choix"` — meilleur rapport qualité/prix global
  - `"Coup de cœur"` — meilleur dans une sous-catégorie (ex: entrée de gamme)
- Fichiers concernés :
  - `components/client/CategoryContent.tsx` — logique d'affichage
  - `components/ui/ProductCard.tsx` — ajout du badge visuel
  - `app/categorie/[slug]/page.tsx` — données produits passées
- Règle : 2 badges si ≥20 produits, 1 badge si moins

### C. Prix affilié mis en évidence sur pages produit
- **Changement** : Afficher le prix le plus bas avec logo boutique de façon subtile mais claire
- Ex : `"149€ chez Thomann"` avec logo Thomann en petit
- Fichier : `components/client/ProductPageContent.tsx`
- Contrainte : ne pas trop prendre de place, rester élégant

### D. Newsletter — à réactiver
- **Décision** : Remettre la section newsletter en place dans le footer
- Rationale : Signal de crédibilité pour les visiteurs même avec 0 abonnés
- Fichier : `components/server/Footer.tsx`
- Note : NewsletterForm est déjà codé dans le fichier (lignes 52-117), juste masqué
- À connecter avec Brevo ou Mailchimp dès que prêt

### E. Configurateur IA — mise en avant renforcée
- **Changement** : Ajouter des CTA contextuels vers le configurateur
- Emplacements à ajouter :
  1. Pages catégorie → bloc "Je ne sais pas quoi choisir → Configurateur IA" (en haut ou bas de liste)
  2. Articles/guides → lien contextuel en milieu d'article (ex: "Besoin d'aide pour choisir ? → Labo IA")
  3. Éventuellement dans la Hero section en CTA secondaire
- Fichiers : `components/client/CategoryContent.tsx`, `app/guide/[slug]/page.tsx`

### F. llms.txt — à créer
- Fichier : `public/llms.txt`
- Contenu :
```
# Fluxlab
Comparateur indépendant de matériel audio, vidéo et streaming pour créateurs FR.
Compare les prix en temps réel sur Amazon, Thomann, Woodbrass.
Propose un configurateur IA pour composer son setup sur mesure.
Site : https://fluxlab.fr

## Pages clés
- /configurateur — Configurateur IA (setup personnalisé)
- /categorie/audio — Matériel audio (micros, interfaces, casques)
- /categorie/video — Matériel vidéo (caméras, optiques, éclairage)
- /categorie/streaming — Matériel streaming (capture, stream deck)
- /guides — Guides d'achat indépendants
- /recherche — Recherche sur le site
```

### G. Blocs réponse directe dans les guides
- **Changement** : Ajouter en tête de chaque guide existant un bloc de 40-60 mots qui répond directement à la question principale
- Format : paragraphe intro avant le sommaire ou juste après le H1
- Objectif : extraction par les LLMs (ChatGPT, Perplexity, Claude) pour citations
- Fichier : `app/guide/[slug]/page.tsx` + contenu des articles en base Supabase

### H. Identité éditoriale (auteur)
- **Décision** : Pas de nom propre (contenu IA + solo founder)
- Solution : `"Par la rédaction Fluxlab · Mis à jour en [mois] [année]"`
- À ajouter dans le layout des articles
- Fichier : `app/guide/[slug]/page.tsx`

### I. robots.txt — vérification
- Vérifier que ces bots **ne sont PAS bloqués** :
  - `GPTBot` (ChatGPT)
  - `PerplexityBot`
  - `ClaudeBot` + `anthropic-ai`
  - `Google-Extended`
  - `Bingbot` (Copilot)
- Fichier : `public/robots.txt` (si existant) ou à créer

### J. Social proof — à NE PAS faire maintenant
- Pas de chiffres type "X produits comparés / Y boutiques" car les chiffres ne sont pas encore avantageux
- À réintroduire quand les chiffres seront significatifs

---

## 4. Stratégie contenu (à faire manuellement / progressivement)

### Cadence recommandée
- **2 articles par semaine** (pas plus pour ne pas épuiser)
- **Rythme régulier > volume ponctuel** (Google valorise la continuité)
- Publier espacé : jamais 10 articles le même jour

### 10 articles prioritaires
| # | Titre | Type | Priorité |
|---|---|---|---|
| 1 | Setup podcast complet à 300€ en 2026 | Guide budget | ⭐⭐⭐⭐⭐ |
| 2 | Meilleure interface audio pour débutant | Comparatif | ⭐⭐⭐⭐⭐ |
| 3 | Focusrite Scarlett 2i2 vs Audient iD4 | VS page | ⭐⭐⭐⭐ |
| 4 | Débuter sur YouTube avec le bon matériel | Tutoriel | ⭐⭐⭐⭐ |
| 5 | Micro dynamique vs condensateur | Guide technique | ⭐⭐⭐⭐ |
| 6 | Setup streaming Twitch à petit budget | Guide budget | ⭐⭐⭐⭐ |
| 7 | Shure SM7B vs SM58 vs SM7dB | VS page | ⭐⭐⭐⭐ |
| 8 | Tout savoir sur le câble XLR | Guide technique | ⭐⭐⭐ |
| 9 | Meilleure caméra YouTube en 2026 | Comparatif | ⭐⭐⭐⭐ |
| 10 | Home studio à 500€ : guide complet | Guide budget | ⭐⭐⭐⭐⭐ |

### Stratégie longue traîne / cocon sémantique
- Créer des articles très niches autour des guides principaux (piliers)
- Ex hub "Meilleur micro podcast" → spokes :
  - "Micro USB vs XLR pour débutant"
  - "Micro podcast à moins de 100€"
  - "Quel micro pour enregistrer chez soi avec bruit de fond ?"
  - "Micro podcast pour smartphone"
- Tous les spokes renvoient vers le hub → autorité thématique

### Ton rédactionnel
- **Simple, accessible, ludique** — public = débutants et semi-pros
- Pas d'expertise technique excessive (pas pour des ingénieurs du son)
- Articles lisibles en 2-3 min, efficaces, avec des recommandations claires
- Données chiffrées oui, mais sourcées et intégrées naturellement

---

## 5. Plan d'implémentation technique — Ordre d'exécution

### 🔴 Priorité 1 — Immédiat (faire en premier)
1. **Créer `public/llms.txt`** (10 min)
2. **Vérifier/créer `public/robots.txt`** avec AI bots autorisés
3. **Réactiver newsletter dans Footer.tsx** (décommenter la section)
4. **Changer CTA Hero** : "Trouver mon setup idéal en 2 min" dans HeroSection.tsx

### 🟡 Priorité 2 — Session principale
5. **Badges produits** sur CategoryContent.tsx / ProductCard.tsx
   - Ajouter prop `badge?: 'choix' | 'coup-de-coeur'` à ProductCard
   - Définir quels slugs produits reçoivent quel badge (hardcodé dans CategoryContent ou via Supabase)
6. **Prix affilié mis en évidence** dans ProductPageContent.tsx
   - Afficher meilleur prix + logo boutique en haut de page produit
7. **CTA Configurateur** dans CategoryContent.tsx et guide/[slug]/page.tsx

### 🟢 Priorité 3 — Contenu (progressif)
8. **Identité éditoriale** dans guide/[slug]/page.tsx (byline "rédaction Fluxlab + date")
9. **Blocs réponse directe** dans les guides existants (édition Supabase ou fichier)
10. **Articles longue traîne** — 2/semaine selon plan ci-dessus

---

## 6. Déploiement

- Branche de travail : `design-refonte`
- Pour mettre en prod : changer dans Vercel UI → Settings → Git → Production Branch → `design-refonte`
- `master` = sauvegarde de l'ancienne version

---

## 7. À faire côté externe (non-code)

- [ ] Google Search Console : soumettre sitemap après déploiement
- [ ] Vérifier robots.txt sur la version live
- [ ] Tester manuellement : ChatGPT + Perplexity + Google sur "comparateur matériel podcast français"
- [ ] Communautés FR : intervenir sur r/podcasting, Audiofanzine, Discord créateurs
- [ ] Amazon Affiliate : s'inscrire quand trafic suffisant (objectif : 100 visites/jour)
- [ ] Awin : activer feeds Thomann + Woodbrass dès accès obtenu (variables : `AWIN_FEED_URL_THOMANN`, `AWIN_FEED_URL_WOODBRASS`)

---

## 8. Notes techniques importantes

- `components/server/Footer.tsx` : NewsletterForm déjà codé lignes 52-117, section masquée ligne 132
- `components/client/HeroSection.tsx` : Hero responsive, overlay allégé, texte h1 en `text-[38px] sm:text-[56px]`
- `app/guide/[slug]/page.tsx` : sidebar gauche = sommaire + produits cités ; bas de page = articles connexes
- `components/client/CategoryContent.tsx` : contient GUIDE_MAP avec slugs corrigés (audio + enceintes)
- Système prix : `product_offers` table Supabase, `Math.min` pour prix le plus bas
- Toutes les pages ont Schema.org JSON-LD (Article, Product, WebPage, FAQPage, etc.)
