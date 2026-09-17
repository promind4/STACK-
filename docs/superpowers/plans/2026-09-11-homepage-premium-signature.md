# Homepage Fluxlab Premium Signature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Transformer la homepage en expérience premium distinctive, compréhensible et performante, sans esthétique générique d’IA.

**Architecture:** Conserver la route serveur et les données produits. Recomposer les composants de homepage. Réutiliser les dépendances existantes ; intégrer au maximum une primitive Magic UI locale si elle apporte un mouvement impossible à exprimer plus simplement en CSS.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion, Supabase, tests Node existants.

---

### Task 1: Recomposer le système visuel, le héros et les besoins

**Files:**
- Modify: `tests/homepage-design.test.mjs`
- Modify: `app/globals.css`
- Modify: `components/client/HeroSection.tsx`
- Modify: `components/home/HeroContextGrid.tsx`

- [ ] Écrire les assertions rouges portant sur le rendu attendu du héros et les exécuter.
- [ ] Remplacer les tokens et animations homepage par le système noir studio / ivoire / laiton.
- [ ] Retirer le dégradé de mot, les coordonnées, légendes flottantes et lignes sans fonction.
- [ ] Construire une composition asymétrique avec promesse claire et deux actions hiérarchisées.
- [ ] Intégrer les quatre besoins comme navigation compacte, sans chiffres ni pastilles répétitives.
- [ ] Ajouter une seule entrée orchestrée compatible mouvement réduit.
- [ ] Exécuter `npm run test:homepage`, `npx tsc --noEmit` et vérifier le héros à 390, 820 et 1440 px.

### Task 2: Unifier produits et parcours sans marge accidentelle

**Files:**
- Modify: `components/home/HomeProductShowcase.tsx`
- Modify: `components/ui/ProductCard.tsx`
- Modify: `components/home/CompatibilityPreview.tsx`

- [ ] Faire échouer le contrat sur la géométrie et le doublon avant modification.
- [ ] Garder trois cartes carrées, fond blanc continu, prix et disponibilité prioritaires.
- [ ] Supprimer la hauteur forcée responsable du vide sous les cartes.
- [ ] Refaire le parcours avec une chaîne explicite source → traitement → restitution, sans produits dupliqués.
- [ ] Animer seulement les connecteurs explicatifs et fournir une version statique en mouvement réduit.
- [ ] Exécuter les tests homepage/images et TypeScript.

### Task 3: Simplifier la confiance et polir les guides

**Files:**
- Modify: `components/home/HomeTrustStrip.tsx`
- Modify: `components/home/HomeGuides.tsx`
- Modify: `app/page.tsx`

- [ ] Supprimer toute réassurance dupliquée et garder quatre preuves prudentes.
- [ ] Recomposer les guides avec image vedette plein cadre et hiérarchie éditoriale.
- [ ] Retirer le `priority` sous le pli et corriger le `<main>` imbriqué.
- [ ] Vérifier les états sans produits et sans image.

### Task 4: Contrôle visuel, performance et revue

**Files:**
- Modify only when a verified defect requires it.

- [ ] Capturer la page à 1440×1100, 820×1180 et 390×844.
- [ ] Corriger débordements, marges, contraste, crop, focus et densité.
- [ ] Exécuter `npm run test:homepage`, `npm run test:images`, `npx tsc --noEmit`, `npm run build` et `git diff --check`.
- [ ] Faire relire l’ensemble du diff par un sous-agent distinct.
- [ ] Ouvrir le résultat local dans Codex, sans push ni déploiement.
