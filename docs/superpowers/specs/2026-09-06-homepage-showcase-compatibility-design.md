# Refonte du showcase produits et de la compatibilité

## Objectif

Rapprocher le premier écran éditorial de la maquette cinématique validée sans transformer l’interface en image statique. La sélection doit paraître plus premium, moins étirée et plus facile à parcourir. Le parcours de compatibilité doit montrer une relation compréhensible entre de vrais produits plutôt que des traits décoratifs sans signification.

## Périmètre

Cette itération concerne uniquement :

- les quatre cartes de contexte sous le héros ;
- les trois cartes de la sélection « Les essentiels du moment » ;
- le panneau « Parcours de compatibilité » ;
- le bandeau de garanties placé sous la sélection.

Les autres sections de la homepage, le footer, les pages catégories et les données Supabase ne sont pas modifiés.

## Cartes de contexte

- Retirer les numéros 01 à 04.
- Remplacer les caractères typographiques actuels par quatre pictogrammes SVG cohérents et distinctifs.
- Conserver les intitulés, descriptions et destinations actuelles.
- Garder une géométrie rectangulaire sobre, sans pastilles rondes.

## Cartes produits

- Donner aux cartes une silhouette presque carrée sur ordinateur au lieu de colonnes longues et étroites.
- Maintenir un fond blanc neutre continu entre l’image et la fiche afin que les visuels produits se fondent proprement.
- Réserver environ 55 à 60 % de la hauteur à l’image produit.
- Compacter les informations secondaires tout en conservant la marque, le nom, la note, le stock, le nombre d’offres et le prix.
- Conserver un comportement responsive : deux colonnes sur petit écran, trois colonnes dès que l’espace le permet.
- Ne pas déformer, recadrer agressivement ou remplacer les images issues des données produits.

## Parcours de compatibilité hybride

Le panneau devient une composition visuelle alimentée par les trois produits réellement affichés dans la sélection.

- Présenter les trois images produits dans une composition triangulaire ou orbitale.
- Utiliser un décor sombre abstrait et discret : halo central, grain léger et profondeur lumineuse. Le décor ne doit contenir aucun produit pré-dessiné.
- Tracer les connexions dans la couche d’interface, entre des points d’ancrage appartenant aux cartes produits. Les lignes ne doivent jamais traverser arbitrairement les objets.
- Associer chaque liaison à une courte étiquette fonctionnelle uniquement lorsqu’elle est cohérente avec les produits affichés.
- Pour la sélection actuelle, employer des formulations prudentes comme « chaîne créative », « signal audio » ou « liaison à vérifier » si le type exact de connecteur ne peut pas être garanti depuis les données.
- Supprimer les numéros 01 à 03, la liste verticale et le long paragraphe explicatif.
- Conserver un titre bref et un accès clair au configurateur.
- Si moins de trois produits ou images sont disponibles, afficher une composition simplifiée sans ligne orpheline.

## Bandeau de garanties

- Supprimer les numéros 01 à 04.
- Ajouter quatre pictogrammes SVG : comparaison, livraison, disponibilité et décision guidée.
- Conserver uniquement des promesses vérifiables : offres comparées, conditions de livraison affichées par le marchand, stock visible et choix contextualisé.
- Ne pas afficher « livraison offerte », « retour 30 jours » ou « conseils d’experts » sans donnée ou politique qui les garantit.

## Mouvement et accessibilité

- Autoriser un halo lent et un léger mouvement des lignes au survol ou à l’apparition.
- Respecter `prefers-reduced-motion` et conserver une lecture complète sans animation.
- Garder les textes et contrôles dans le DOM ; le décor et les lignes sont décoratifs et masqués aux technologies d’assistance.
- Préserver les liens produits, les libellés accessibles et la navigation clavier.

## Validation

- Les trois cartes paraissent presque carrées à 1440 px et ne forment plus trois colonnes excessivement verticales.
- Les cartes restent lisibles à 390 px sans débordement horizontal.
- Aucun numéro décoratif ne subsiste dans les cartes de contexte, le parcours ou le bandeau.
- Chaque ligne du parcours relie deux points d’ancrage visibles et disparaît si son produit cible manque.
- Les images produits restent celles des données réelles et gardent un fond blanc neutre.
- Les tests de contrat homepage, la politique d’images, TypeScript et le build Next.js réussissent.
