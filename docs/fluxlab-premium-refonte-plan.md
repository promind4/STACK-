# Plan de refonte premium — Fluxlab

## Objectif

Atteindre une expérience Fluxlab premium, cinématographique et fiable, inspirée par la troisième direction visuelle validée : noir profond, ivoire, or brossé, profondeur maîtrisée et parcours de décision clair. L'objectif n'est pas de reproduire une maquette trait pour trait, mais d'atteindre le même niveau de qualité perçue sans perdre la lisibilité, la rapidité ou la crédibilité commerciale.

## Principes non négociables

- Le site doit d'abord mériter la confiance : images chargées, prix cohérents, offre disponible et origine des données compréhensible.
- L'immersion sert les produits ; elle ne doit jamais masquer le prix, le stock ou l'action suivante.
- Le configurateur est un assistant de décision fondé sur le contexte, la compatibilité et le budget ; il ne sera pas présenté comme une IA générique.
- Les cartes conservent un fond blanc neutre derrière le produit.
- Les animations restent légères, désactivables et utilisables sur mobile.
- Chaque jalon est vérifié en local avant un commit et un déploiement.

## Direction retenue

Une composition hybride :

1. Héros cinématographique de la direction 3 : fond sombre, lumière ambre, équipement créatif et mouvement très subtil.
2. Asymétrie éditoriale et panneaux de contexte de la direction 2 : quatre entrées alignées, rectangulaires et non des pastilles.
3. Clarté des cartes de la direction 1 : produit sur blanc, informations d'offre, disponibilité, prix et action immédiate.

## Plan d'implémentation

### Phase 0 — Socle fiable

- Confirmer le chargement direct des images et l'absence de réponse 402 en production.
- Auditer les données visibles : prix, stock, offres, note et libellés de confiance.
- Ne conserver que les affirmations qui peuvent être justifiées par les données ou la méthode Fluxlab.
- Définir une présentation homogène des états : en stock, indisponible, nombre d'offres et prix à partir de.

**Critère de sortie :** les pages clés affichent leurs produits, sans image cassée, avec des informations cohérentes et une solution de repli lisible.

### Phase 1 — Système visuel

- Stabiliser les tokens : noir profond, ivoire, blanc neutre, sable, or brossé, bordures et ombres.
- Définir les trois niveaux de profondeur : surface claire, panneau sombre, élément interactif élevé.
- Unifier la typographie : sérif éditorial pour les titres, mono discret pour les repères et données.
- Remplacer les usages répétitifs de pastilles par des panneaux, lignes, séparateurs et états de bordure.

**Critère de sortie :** composants de base cohérents sur desktop et mobile, sans effets décoratifs concurrents.

### Phase 2 — Page d'accueil : héros et navigation

- Conserver l'image de héros actuelle et améliorer sa mise en scène avec des overlays légers.
- Installer la promesse : « un setup qui fonctionne ensemble ».
- Remplacer les entrées de contexte en pastilles par quatre panneaux strictement alignés : pièce bruyante, simplicité, budget, mobilité.
- Repositionner les CTA : composer un setup et explorer les univers.

**Critère de sortie :** la première vue explique le bénéfice, les deux actions principales et les chemins d'entrée sans surcharge.

### Phase 3 — Accueil : sélection et preuve

- Composer une sélection produit moins répétitive : hiérarchie éditoriale, respiration et accent visuel contrôlé.
- Faire des cartes des outils de décision : note, stock, nombre d'offres, prix, marchand(s) quand la donnée est présente.
- Ajouter des repères de fraîcheur des prix uniquement lorsqu'ils sont alimentés par une donnée fiable.
- Concevoir une section de compatibilité comme une démonstration concrète, et non comme un score décoratif.

**Critère de sortie :** les cartes répondent à « est-ce adapté, disponible et au bon prix ? » sans ouvrir la fiche.

### Phase 4 — Configurateur et parcours de décision

- Renommer progressivement l'expérience autour du setup, du besoin et de la compatibilité.
- Clarifier les questions, les critères pris en compte, les résultats et les alternatives.
- Montrer le raisonnement d'un résultat : contexte, compromis, compatibilités, budget, prix et liens marchands.
- Prévoir des résultats visibles avant toute action commerciale.

**Critère de sortie :** le configurateur apporte une valeur que ne fournit pas une simple conversation avec une IA généraliste.

### Phase 5 — Pages catégories et fiches produit

- Transposer le système visuel aux catégories, filtres et fiches sans compromettre leur efficacité.
- Mettre en évidence les comparaisons d'offres et la disponibilité.
- Créer des états vides, erreurs d'image et indisponibilités propres.
- Vérifier que le passage accueil → catégorie → fiche → marchand est cohérent.

**Critère de sortie :** aucune rupture de qualité perçue ou de confiance dans le parcours d'achat.

### Phase 6 — Animation, performance et accessibilité

- Employer CSS et Framer Motion déjà présents pour les transitions d'entrée, halos ambre et lignes de connexion.
- Préférer les transformations et opacités aux vidéos de fond ou filtres lourds.
- Respecter `prefers-reduced-motion` avec une version statique.
- Tester contraste, navigation clavier, tailles tactiles et mobile.

**Critère de sortie :** le site paraît vivant, sans animation envahissante ni dégradation mesurable de l'expérience.

### Phase 7 — Contrôle final et déploiement

- Vérifier chaque jalon sur `localhost:3001`, en desktop puis mobile.
- Lancer TypeScript et le build de production avant chaque livraison significative.
- Comparer visuellement les pages avec la direction choisie.
- Committer par jalon, pousser sur la branche de travail, puis ne promouvoir en production qu'après validation.

## Outils et méthode

- **Interface :** Next.js, React, TypeScript et Tailwind existants.
- **Mouvement :** CSS pour l'ambiance, Framer Motion seulement lorsqu'une interaction en tire un bénéfice clair.
- **Données :** Supabase pour produits et offres ; aucune promesse de fraîcheur ou de stock sans donnée correspondante.
- **Contrôle visuel :** serveur local, captures desktop/mobile, tests ciblés des états de carte.
- **Qualité :** TypeScript, build de production, contrôle des URLs d'images et revue de la console.

## Ordre de travail immédiat

1. Remplacer les pastilles de contexte de l'accueil par les panneaux alignés de la direction 2.
2. Finaliser le composant de carte blanche avec ses signaux de confiance et son état de survol.
3. Recomposer la sélection de la page d'accueil avec davantage de rythme éditorial.
4. Créer le fond cinématographique léger du héros, sans vidéo.
