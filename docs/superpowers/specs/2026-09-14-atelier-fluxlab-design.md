# L’Atelier Fluxlab — conception du configurateur

## Intention

L’Atelier Fluxlab transforme une situation réelle en une chaîne de matériel cohérente, disponible et compatible avec un budget plafond. Sa valeur vient de décisions contrôlables prises sur le catalogue Fluxlab : rôles, dépendances, prix, stock, compromis et liens d’achat.

Le nom public est **L’Atelier Fluxlab**. Les mentions « Labo IA », « score IA » et « générer avec l’IA » disparaissent. Un LLM peut interpréter une note libre ou reformuler une justification, mais l’Atelier doit fonctionner intégralement sans OpenRouter.

## Résultat attendu

En moins de deux minutes, le visiteur doit pouvoir décrire son projet, voir ses besoins évoluer, examiner des candidats, conserver un produit, puis obtenir une liste d’achat complète et compréhensible.

## Principes de décision

- Le budget est un plafond strict, pas un objectif de dépense mécanique.
- Une utilisation de 75 à 100 % est recherchée seulement si une montée en gamme apporte un bénéfice pertinent.
- Une marge importante reste acceptable si sa raison est explicite.
- Un produit conservé est une contrainte forte tant qu’un setup complet reste possible. Sinon, l’Atelier expose le conflit et propose de changer le produit, le budget ou le périmètre.
- Les dépendances obligatoires sont ajoutées avant les améliorations et recalculées après chaque substitution.
- Une donnée absente produit « À vérifier », jamais « Compatible » automatiquement.
- L’affiliation n’influence pas le classement.

## Parcours hybride arborescent

Le parcours est un arbre guidé, pas une carte mentale libre. Une question principale est visible à la fois. La réponse fait apparaître deux à quatre branches utiles ; les choix précédents restent accessibles.

```text
Projet
├── Podcast
│   ├── Solo
│   ├── Duo
│   └── Plusieurs voix
├── Streaming
├── Musique / chant
└── Vidéo
```

Les questions suivantes sont conditionnelles : nombre de personnes ou sources, environnement acoustique, mobilité, matériel conservé avec modèle ou connexion, budget plafond et priorité entre simplicité, rapport qualité/prix et évolutivité. Mac ou PC n’est demandé que lorsque cela change une compatibilité réelle. La note libre apparaît une seule fois à la fin.

Sur ordinateur, l’arbre occupe la zone principale et l’aperçu du setup reste à côté. Sur mobile, le chemin devient vertical ; aucun canevas à déplacer ou zoomer.

## Aperçu progressif et verrouillage

Un « établi » montre les rôles qui se précisent : capture, interface ou traitement, écoute, image, lumière et accessoires. Avant d’avoir assez de données, il affiche des besoins, pas de faux résultats définitifs.

Un candidat peut être marqué **Garder dans mon setup**. Il reste verrouillé pendant les recalculs. L’interface explique la conséquence : « Interface XLR requise » ou « 210 € restent pour l’écoute ». Le produit peut être libéré à tout moment.

Les recalculs intermédiaires sont locaux et déterministes. Aucun appel au LLM n’est effectué à chaque clic.

### Budget visible et niveaux de résultat

Le plafond est demandé tôt et reste visible pendant le parcours. L’indicateur affiche le total réel des produits actuellement envisagés ou conservés sous la forme « 104 € / 800 € » ; avant toute proposition, il affiche 0 €. Une proposition intermédiaire reste explicitement provisoire et ne pousse jamais à dépenser le solde.

Une fois toutes les réponses connues, le moteur peut produire jusqu’à trois configurations distinctes : **Essentiel** (chaîne complète la moins coûteuse qui répond au besoin), **Équilibre** (améliorations utiles au profil) et **Premium** (gains supplémentaires démontrables dans le plafond). Chaque configuration ferme ses dépendances, utilise des offres valides et affiche son total, ses raisons et ses réserves. Un prix supérieur sans gain identifié ne crée pas un niveau supplémentaire.

Si le catalogue ne permet aucune chaîne complète, le résultat montre la proposition partielle et les rôles manquants ; il ne fabrique pas trois packs. Les niveaux définitifs ne sont calculés qu’après la dernière réponse. La vue progressive peut montrer des pistes, jamais leur attribuer le statut de résultat final.

## Intelligence produit extensible

L’ajout d’un produit actif le rend visible dans le catalogue. Son entrée dans les recommandations dépend d’un profil structuré ; le moteur ne doit plus déduire sa nature uniquement depuis le nom, le slug ou la marque.

Le profil canonique comprend au minimum :

- rôle, sous-type et usages ;
- connexions, alimentation, dépendances et quantités ;
- mobilité, complexité et contraintes acoustiques ;
- qualités éditoriales contrôlées lorsqu’elles sont connues ;
- gamme ;
- source et confiance des données importantes.

Les catégories fournissent des valeurs par défaut. Les spécifications importées complètent les faits. Les descriptions, avantages, limites et guides peuvent alimenter des attributs éditoriaux enregistrés. Un enrichissement automatisé facultatif peut proposer ces attributs à l’import ; les données ambiguës restent à valider dans l’administration.

### États catalogue

- **Prêt** : données obligatoires présentes ; recommandation principale autorisée.
- **Partiel** : visible dans le catalogue ; alternative possible avec réserve.
- **À enrichir** : visible sur sa fiche ; exclu des recommandations.

À grande échelle, la présélection se fait côté serveur. Le navigateur ne télécharge pas tout le catalogue.

## Pipeline de recommandation

1. Convertir les réponses en besoins et contraintes.
2. Charger les produits éligibles avec offres exploitables.
3. Filtrer les incompatibilités et appliquer les quantités.
4. Construire un setup minimal complet.
5. Fermer toutes les dépendances.
6. Calculer le total réel.
7. Améliorer les rôles prioritaires dans la marge.
8. Recalculer dépendances et total après chaque substitution.
9. Produire une alternative économique et une montée en gamme.
10. Produire les preuves, réserves et raisons affichées.

Toute sortie facultative du LLM repasse par ce validateur. Une panne ou une absence de clé ne change ni la sélection ni ses garanties.

## Prix et disponibilité

Le total utilise la meilleure offre en stock et valide, jamais le minimum brut. Chaque ligne indique prix, marchand, disponibilité, date de vérification lorsqu’elle existe, quantité et coût différentiel des alternatives. Les frais inconnus ne sont pas intégrés silencieusement. L’interface parle de **liste d’achat**, pas de panier unique.

## Résultat final

```text
Capture → Interface / traitement → Écoute
              ↘ Image → Lumière
```

Chaque rôle est nécessaire, optionnel, déjà possédé ou conservé. Les scores fixes et la mention générique « Compatible » sont remplacés par : plafond respecté, chaîne complète, connexions vérifiées, offres disponibles et éléments à vérifier. Un seul guide contextuel explique la contrainte principale.

## Direction visuelle

L’Atelier conserve noir profond, ivoire, laiton et surfaces produit blanches. La distinction vient de l’arbre, de l’établi et de la chaîne finale.

- Les branches représentent des conséquences réelles.
- Les vraies images produits sont privilégiées.
- Aucun visuel ne doit évoquer une génération par IA.
- Une seule séquence forte anime la composition ; les autres mouvements répondent à une action.
- L’information reste complète avec `prefers-reduced-motion`, clavier et focus.

## Erreurs et incertitudes

- Catalogue indisponible : expliquer l’impossibilité de vérifier et proposer de réessayer.
- Aucun setup complet : montrer l’élément manquant et le budget minimal connu.
- Produit conservé incompatible : garder le choix visible et proposer les résolutions.
- Offre indisponible : remplacer par une offre valide ou signaler l’élément.
- Donnée manquante : afficher « À vérifier ».

## Découpage

1. Contrat de données, profils de référence et tests de classification.
2. Pipeline déterministe unique, budget, dépendances et validation d’offres.
3. États catalogue et import extensible.
4. Parcours arborescent et aperçu progressif.
5. Verrouillage produit et recalcul explicable.
6. Résultat en chaîne, alternatives, liste d’achat et guide.
7. Direction visuelle, mouvement, responsive et accessibilité.
8. Mesure produit et audit final.

La refonte visuelle ne précède pas la fiabilité du moteur.

## Scénarios d’acceptation

Les tests couvrent au minimum : podcast solo à 350 €, podcast duo, streaming en pièce bruyante à 800 €, musique en pièce traitée à 800 €, créateur nomade, équipement XLR déjà possédé, caméra déjà possédée et budget insuffisant.

Pour chaque scénario : aucun dépassement masqué, aucune dépendance absente, aucune offre hors stock choisie, aucun produit « À enrichir » recommandé, recalcul après substitution USB/XLR, respect du produit conservé ou conflit expliqué, même validation avec LLM disponible ou absent, lisibilité à 1440, 820 et 390 px.

## Hors périmètre initial

- panier marchand unique et paiement sur Fluxlab ;
- génération de visuels par IA ;
- conversation permanente avec un assistant ;
- apprentissage autonome à partir des clics ;
- recommandation de produits insuffisamment renseignés.

## Contraintes

- Réutiliser Next.js, TypeScript, Tailwind, Framer Motion et Supabase.
- Ne pas réactiver l’optimisation Vercel des images Supabase.
- Préserver la branche de production.
- Aucun push, merge ou déploiement avant validation utilisateur.
