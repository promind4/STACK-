# Fluxlab — Marketing Priorité 1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implémenter les 4 actions immédiates du plan marketing Fluxlab — visibilité LLM, newsletter, et CTA hero.

**Architecture:** 4 tâches entièrement indépendantes (fichiers différents, aucune dépendance partagée) — candidat idéal pour dispatching-parallel-agents. Deux créations de fichiers statiques (`public/`), une réactivation de composant masqué, un changement de texte CTA.

**Tech Stack:** Next.js 14 App Router · TypeScript · Tailwind CSS · Supabase (non concerné ici)

---

## Fichiers concernés

| Tâche | Action | Fichier |
|-------|--------|---------|
| A | Créer | `public/llms.txt` |
| B | Créer | `public/robots.txt` |
| C | Modifier | `components/server/Footer.tsx` |
| D | Modifier | `components/client/HeroSection.tsx` |

---

## Task A : Créer `public/llms.txt`

**Files:**
- Create: `public/llms.txt`

- [ ] **Step 1 : Créer le fichier avec le contenu exact**

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

- [ ] **Step 2 : Vérifier que le fichier est accessible**

Le fichier dans `public/` est servi statiquement par Next.js à `https://fluxlab.fr/llms.txt`.
Vérification locale : confirmer que le fichier existe à `public/llms.txt` et que son contenu est correct.

---

## Task B : Créer `public/robots.txt`

**Files:**
- Create: `public/robots.txt`

Contexte : Pas de `robots.txt` existant dans `public/`. Next.js sert les fichiers de `public/` statiquement.
Objectif : autoriser explicitement les bots AI majeurs (GPTBot, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, Bingbot).

- [ ] **Step 1 : Créer le fichier**

```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: https://fluxlab.fr/sitemap.xml
```

- [ ] **Step 2 : Vérifier que le fichier existe**

Confirmer présence à `public/robots.txt`.

---

## Task C : Réactiver la newsletter dans Footer.tsx

**Files:**
- Modify: `components/server/Footer.tsx:132-134`

Contexte : Le composant `NewsletterForm` est entièrement codé aux lignes 52-117 mais la section qui l'affiche dans le footer est masquée. À la ligne 132, il y a un commentaire `{/* ── Newsletter — masquée temporairement ... ── */}` suivi directement du main grid à la ligne 134.

Il faut ajouter un bloc JSX newsletter entre la ligne 132 et la ligne 134 (le `{/* ── Main grid ── */}`).

- [ ] **Step 1 : Ajouter la section newsletter dans le JSX du Footer**

Remplacer le bloc commentaire vide ligne 132 :
```tsx
        {/* ── Newsletter — masquée temporairement (à réactiver avec Brevo/Mailchimp) ── */}
```

Par :
```tsx
        {/* ── Newsletter ─────────────────────────────────────── */}
        <div className="border-b border-white/10 py-14">
          <div className="grid grid-cols-12 gap-10 items-center">
            <div className="col-span-12 lg:col-span-4">
              <p className="frame-label text-primary mb-3">La Gazette du Labo</p>
              <p className="text-[22px] font-serif italic text-white/90 leading-snug mb-2">
                Le setup parfait, une fois par mois.
              </p>
              <p className="text-[13px] text-white/45 font-light">
                Guides exclusifs, bons plans matériel, nouvelles du labo.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-7 lg:col-start-6">
              <NewsletterForm />
            </div>
          </div>
        </div>
```

- [ ] **Step 2 : Vérifier que le composant `NewsletterForm` est bien appelé**

Confirmer que `NewsletterForm` est défini plus haut dans le fichier (lignes 52-117) — c'est déjà le cas, aucun import supplémentaire nécessaire.

- [ ] **Step 3 : Vérifier qu'il n'y a pas d'erreur TypeScript**

Aucun nouveau type ni prop ajouté — le composant s'utilise sans props.

---

## Task D : Changer le CTA principal dans HeroSection.tsx

**Files:**
- Modify: `components/client/HeroSection.tsx:126`

Contexte : Le CTA principal est un `<Link>` vers `/configurateur`. Le texte actuel est `"Trouver mon setup"`. Il faut le remplacer par `"Trouver mon setup idéal en 2 min"` pour exprimer résultat + temps + portée large.

- [ ] **Step 1 : Modifier le texte du CTA**

Ligne 126, remplacer :
```tsx
                <span>Trouver mon setup</span>
```
Par :
```tsx
                <span>Trouver mon setup idéal en 2 min</span>
```

- [ ] **Step 2 : Vérifier la cohérence visuelle**

Le bouton est `h-14 px-8 rounded-full` avec `text-[14px] uppercase tracking-wide`. Le nouveau texte est un peu plus long — vérifier qu'il ne déborde pas sur mobile (le composant est `flex flex-col sm:flex-row gap-4` donc les boutons sont empilés sur mobile, pas de risque).

---

## Vérification finale (verification-before-completion)

Après dispatch des 4 agents :

- [ ] Confirmer que `public/llms.txt` existe et a le bon contenu
- [ ] Confirmer que `public/robots.txt` existe et liste tous les bots AI
- [ ] Confirmer que le Footer affiche visuellement la section newsletter
- [ ] Confirmer que le CTA Hero affiche bien "Trouver mon setup idéal en 2 min"
- [ ] Lancer `npm run build` ou `npx tsc --noEmit` pour valider qu'il n'y a pas d'erreur TypeScript
