# Refonte cinématographique de la homepage Fluxlab

## Objectif

Reconstruire la page d'accueil comme une véritable interface web inspirée de la troisième référence validée. Le résultat doit retrouver sa qualité perçue — noir profond, ivoire, lumière dorée, composition éditoriale et liens visuels entre les équipements — sans utiliser la maquette complète comme une image aplatie.

La page doit rester fonctionnelle, responsive, accessible et connectée aux produits réels de Fluxlab.

## Périmètre

Cette première refonte concerne uniquement la page d'accueil et l'état initial de sa navigation. Elle prépare des composants réutilisables, mais ne redessine pas encore les catégories, les fiches produit ou l'intégralité du configurateur.

## Direction artistique

- Fond noir brun très profond avec lumière ambre localisée, grain discret et bordures dorées fines.
- Barre de navigation ivoire flottante sur desktop, puis navigation compacte et lisible sur mobile.
- Grand titre sérif éditorial à gauche et contenu commercial concis.
- Décor cinématographique distinct de l'interface : il ne contient ni texte ni contrôle intégré dans l'image.
- Tracés dorés fins reliant visuellement les univers audio, vidéo et contrôle.
- Panneaux contextuels rectangulaires, alignés et peu arrondis ; aucune accumulation de pastilles.
- Produits présentés sur un blanc neutre afin que leurs images se fondent proprement dans les cartes.

## Première vue

La première vue reprend la structure de la référence :

1. navigation ivoire flottante ;
2. promesse principale à gauche ;
3. scène cinématographique à droite ;
4. action principale vers le configurateur ;
5. quatre points de départ contextuels alignés en bas du héros.

Le héros ne réutilise pas l'ancienne photographie `hero1.webp`. Une nouvelle scène décorative sombre sera produite ou composée spécifiquement pour cette mise en page. Sur mobile, elle passe derrière un voile renforcé ou devient un recadrage secondaire pour préserver le texte.

## Sélection de produits

La sélection suit immédiatement le héros dans une grande surface sombre encadrée. Elle associe deux zones :

- une sélection de trois ou quatre produits issus de Supabase ;
- une démonstration du parcours de compatibilité.

Les cartes conservent les images produit actuelles et leur fond blanc neutre. Elles affichent le nom, la marque, le prix à partir de, l'état de stock et le nombre d'offres lorsque ces données existent. La hiérarchie peut distinguer une carte principale, mais les décalages décoratifs arbitraires sont exclus.

## Parcours de compatibilité

Le panneau de compatibilité montre un exemple intelligible de chaîne de matériel. Il ne prétend pas fournir un score scientifique non documenté. Il présente plutôt :

- les éléments reliés ;
- le rôle de chacun ;
- une vérification ou un point d'attention concret ;
- un lien vers le configurateur complet.

Les produits réels sont utilisés lorsque les données disponibles permettent une association crédible. Sinon, la démonstration reste générique et explicitement présentée comme un exemple.

## Composants

- `Navbar` : variante premium de la homepage, sans modifier le comportement des autres pages.
- `HeroSection` : texte, actions, décor, tracés et panneaux contextuels.
- `ProductCard` : surface blanche stable et informations de décision.
- `HomeProductShowcase` : composition de la sélection et de la preuve de compatibilité.
- `CompatibilityPreview` : représentation accessible de la chaîne et lien vers le configurateur.

Chaque composant reçoit des données explicites et reste compréhensible indépendamment de sa mise en page parente.

## Données et états dégradés

- Les produits et les offres continuent de venir de Supabase.
- Une image absente affiche l'état de remplacement existant sans casser la carte.
- Un produit sans offre n'affiche pas de nombre de marchands inventé.
- Un prix nul ou indisponible reçoit un libellé explicite au lieu de `0 €`.
- La page conserve une structure lisible si Supabase retourne une liste vide.
- Aucune affirmation telle que « testé en studio », « temps réel » ou « compatibilité vérifiée » ne reste visible sans méthode ou donnée justificative.

## Mouvement

Les animations servent uniquement la profondeur : halo lent, apparition sobre des lignes, léger mouvement de lumière et élévation courte des cartes. Elles utilisent principalement `transform` et `opacity`. Avec `prefers-reduced-motion`, la composition reste statique et complète.

## Responsive et accessibilité

- Desktop : composition horizontale proche de la référence.
- Tablette : scène réduite, texte prioritaire, grille de contexte en deux colonnes.
- Mobile : une colonne, texte court, CTA immédiatement visible, panneaux en deux colonnes ou une colonne selon la largeur.
- Contrastes, focus clavier, ordre de lecture et tailles tactiles sont vérifiés.
- Les tracés décoratifs sont masqués des technologies d'assistance.

## Vérification

Le jalon est accepté si :

1. la vue desktop évoque clairement la troisième référence sans afficher une capture aplatie ;
2. toutes les actions et cartes sont de vrais éléments interactifs ;
3. aucune ancienne photographie de homepage ne reste visible par défaut ;
4. les images produits restent nettes sur fond blanc ;
5. le parcours reste lisible en mobile ;
6. TypeScript, le build et les tests d'images passent ;
7. la console ne présente pas de nouvelle erreur liée à la refonte.

## Hors périmètre du premier jalon

- Refonte complète des pages catégories et produits.
- Nouvelle logique de recommandation du configurateur.
- Création d'un compte client ou d'un panier.
- Promesses commerciales non soutenues par les données actuelles.
