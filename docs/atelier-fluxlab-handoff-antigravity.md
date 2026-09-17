# Passation — Atelier Fluxlab : moteur, données catalogue et connexions éditoriales

> Document de reprise pour AntiGravity. Dernière mise à jour : 17 septembre 2026.
>
> Objectif : reprendre le **back-end et la fiabilité des recommandations** de l'Atelier Fluxlab sans casser le parcours ni remplir le budget artificiellement. La priorité produit est : **le bon matériel pour le besoin, puis le budget**.

## 1. État de départ et périmètre

Le site est un Next.js 14 / React / TypeScript, dont le projet se trouve ici :

```text
D:\Stackera\fluxlab-next
```

La page publique du configurateur est accessible par :

```text
/configurateur -> app/configurateur/page.tsx -> app/atelier-apercu/page.tsx
```

Son nom public est **L'Atelier Fluxlab**. Éviter de l'appeler « Labo IA » : il n'utilise pas de LLM pour produire ses recommandations et la cible créative peut être méfiante envers cette promesse.

Le travail déjà effectué visait d'abord à rendre l'interface exploitable et à reconstruire un moteur de recommandations fondé sur le catalogue réel. La prochaine étape n'est **pas** une refonte graphique générale : c'est de fiabiliser et d'enrichir les données qui alimentent le moteur, avec des validations de scénarios réels.

### Principes non négociables

1. Une recommandation doit résoudre le besoin avant de chercher à utiliser le budget.
2. Le moteur ne doit recommander que des produits actifs, avec une offre EUR, en stock, à prix positif et avec lien affilié valide.
3. Une chaîne matérielle doit être cohérente : un micro XLR implique une interface compatible ; un produit USB autonome ne doit pas recevoir une interface inutile.
4. Les données incertaines ne doivent pas être « devinées » à partir d'un mot-clé fragile. Un produit incomplet reste `partial` ou `to_enrich`.
5. Une donnée éditoriale ou constructeur explicitement vérifiée prévaut sur une inférence par catégorie.
6. Ne jamais exposer une clé `SUPABASE_SERVICE_ROLE_KEY` côté navigateur.

## 2. Flux technique actuel

```text
Utilisateur
  -> app/atelier-apercu/page.tsx (questions et affichage des packs)
  -> POST /api/atelier/recommendation
  -> loadAtelierCatalog()
  -> Supabase : products + categories + product_offers + recommendation_profile
  -> deriveRecommendationProfile()
  -> recommendAtelierPacks()
  -> packs Essentiel / Équilibre / Budget complet + alternatives + preuves + conflits
```

### Fichiers principaux

| Fichier | Responsabilité |
| --- | --- |
| `app/atelier-apercu/page.tsx` | Parcours visible : budget, projet, départ, sources, matériel possédé, lieu, choix d'un pack. |
| `app/api/atelier/recommendation/route.ts` | Frontière serveur : valide le JSON entrant, charge le catalogue, renvoie les packs. |
| `lib/atelier/types.ts` | Contrat TypeScript du profil utilisateur, des produits, offres, conflits et packs. |
| `lib/atelier/requirements.ts` | Transforme le profil en besoins matériels requis. |
| `lib/atelier/engine.ts` | Recherche, dépendances, compatibilité, alternatives et génération de packs. |
| `lib/atelier/repository.ts` | Lit le catalogue Supabase et élimine les offres / produits non achetables. |
| `lib/atelier/profile.ts` | Construit le profil de recommandation depuis catégories, specs, texte et override vérifié. |
| `lib/atelier/categoryDefaults.ts` | Invariants prudents par catégorie. |
| `lib/atelier/offers.ts` | Filtre et trie les offres réellement achetables. |
| `scripts/backfill-atelier-profiles.mjs` | Génère des profils initiaux ; lecture seule par défaut. |
| `app/admin/page.tsx` | Création / édition de produits et articles. Génère un profil de base lors de l'enregistrement produit. |

## 3. Profil utilisateur et parcours actuel

Le moteur reçoit un `AtelierProfile` validé côté API :

```ts
{
  project: 'podcast' | 'streaming' | 'music_vocals' | 'video',
  sourceCount: 1 | 2 | 'many',
  room: 'untreated' | 'treated' | 'travel',
  mobility: 'fixed' | 'mobile',
  ownedEquipment: Array<{
    role: 'microphone' | 'interface' | 'headphones' | 'monitors' |
      'camera' | 'lighting' | 'treatment' | 'cable' | 'stand',
    productId?: string,
    connection?: 'usb' | 'xlr' | 'other'
  }>,
  budget: number,
  // Interne : l'interface ne demande plus ce choix directement.
  priority: 'simplicity' | 'value' | 'upgradeability'
}
```

Le parcours UI doit rester court. Les questions existantes servent de données de décision :

- budget ;
- projet (podcast, streaming, musique/chant, vidéo) ;
- point de départ ;
- nombre de sources ;
- matériel déjà possédé lorsque pertinent ;
- environnement (pièce ordinaire, pièce traitée, mobilité).

Une amélioration future raisonnable est une question ciblée pour le cas musique/chant : **« cherche-t-on le maximum de détail avec un traitement acoustique, ou une prise plus tolérante dans une pièce ordinaire ? »**. Ne pas ajouter de questions sans un effet mesurable sur la recommandation : le questionnaire doit rester rapide.

## 4. Contrat de données produit pour l'Atelier

La migration ci-dessous a déjà été appliquée dans Supabase (projet `oxzapjwfttrgsometnwq`) :

```sql
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS recommendation_profile jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_products_recommendation_profile
  ON products USING gin (recommendation_profile);
```

Migration versionnée : `supabase/migrations/20260914_atelier_profiles.sql`.

`products.recommendation_profile` est une donnée interne de recommandation ; elle n'a pas besoin d'être affichée sur une fiche produit publique.

### Forme attendue

```ts
type RecommendationProfile = {
  role?: 'microphone' | 'interface' | 'headphones' | 'monitors' |
    'camera' | 'lighting' | 'treatment' | 'cable' | 'stand'
  subtype?: string
  uses: string[]
  connections: string[]
  requires: AtelierRole[]
  sourceCapacity?: number
  roomFit: Array<'untreated' | 'treated' | 'travel'>
  mobility?: 'fixed' | 'mobile'
  complexity?: 'simple' | 'moderate' | 'advanced'
  qualities: string[]
  status: 'ready' | 'partial' | 'to_enrich'
  uncertainty: string[]
  sources?: {
    subtype?: 'override' | 'editorial' | 'specs' | 'categoryDefaults'
    connections?: 'override' | 'editorial' | 'specs' | 'categoryDefaults'
    sourceCapacity?: 'override' | 'editorial' | 'specs' | 'categoryDefaults'
  }
}
```

### Exemple recommandé : micro XLR et USB vérifié

```json
{
  "role": "microphone",
  "subtype": "condenser",
  "uses": ["music_vocals", "podcast"],
  "connections": ["XLR", "USB"],
  "requires": ["interface"],
  "roomFit": [],
  "complexity": "moderate",
  "qualities": ["studio_detail", "low_self_noise"],
  "status": "ready",
  "uncertainty": [],
  "sources": {
    "subtype": "override",
    "connections": "override"
  }
}
```

La présence de XLR entraîne automatiquement l'ajout de la dépendance `interface` si elle est absente. Un micro USB simple ne doit pas déclencher cette dépendance.

### Hiérarchie des sources de données

`deriveRecommendationProfile()` compose les informations dans cet ordre, du plus général au plus précis :

1. invariants de catégorie ;
2. éléments explicitement présents dans description / points forts ;
3. `products.specs` structuré ;
4. éventuelle donnée éditoriale fournie à la fonction ;
5. `products.recommendation_profile` vérifié (override).

Un tableau vide dans un ancien override, par exemple `"connections": []`, **ne masque plus** la donnée pertinente d'une catégorie. Cette correction est importante : les anciens backfills contenaient parfois des tableaux vides.

## 5. Critères de disponibilité et de fiabilité

Le repository charge uniquement les produits `is_active = true`, puis `selectAvailableOffers()` ne conserve qu'une offre :

- `in_stock === true` ;
- prix numérique positif ;
- devise `EUR` ;
- lien affilié non vide.

Tout produit `to_enrich` est retiré du catalogue de recommandation. Les produits `partial` peuvent servir d'alternatives ou signaler une donnée insuffisante, mais ne doivent pas devenir la base d'un setup silencieusement incomplet.

Ce filtrage évite qu'une URL expirée, une offre sans prix ou un produit désactivé soit présenté comme une recommandation fiable. Il ne remplace toutefois pas une synchronisation de prix et de stock : cette automatisation reste à consolider.

## 6. Logique de recommandation actuelle

### Besoins générés (`buildRequirements`)

- toujours : microphone et casque (selon le nombre de sources et le matériel possédé) ;
- streaming / vidéo : caméra et éclairage ;
- streaming en pièce non traitée : traitement acoustique ;
- musique/chant en pièce traitée : paire de moniteurs ;
- musique/chant en pièce non traitée avec voie « évolution » : traitement acoustique, ce qui permet un chemin studio documenté plutôt qu'un condensateur isolé dans une pièce problématique ;
- deux sources ou micro XLR déjà possédé : interface avec capacité adéquate.

Le comportement « deux sources = interface partagée » est volontairement simplifié. Le code le documente avec un commentaire `ponytail` : le cas de synchronisation de plusieurs micros USB n'est pas modélisé pour l'instant.

### Sélection et upgrades

1. Le moteur commence par une chaîne compatible et la moins chère.
2. Il étend cette chaîne avec ses dépendances (par exemple interface pour un XLR).
3. Tant que le budget le permet, il remplace un rôle par une option mieux adaptée, sans dépasser le budget ni casser les connexions.
4. Lorsqu'un upgrade ajoute une dépendance, cette dépendance est aussi éligible à une amélioration. Ce correctif évite le défaut historique : passer d'un micro USB à un micro XLR sans que l'interface nouvellement requise puisse évoluer.
5. Les alternatives « économiser » ou « monter en gamme » sont calculées après les produits verrouillés, afin que « Garder et recalculer » conserve les autres pistes.

Le moteur vérifie et renvoie : budget respecté, chaîne complète, connexions vérifiées, offres disponibles, conflits détaillés et guide contextuel.

### Packs finaux

`recommendAtelierPacks()` calcule les trois priorités internes (`simplicity`, `value`, `upgradeability`), dédoublonne les setups identiques, puis les trie par total réel :

- **Essentiel** : minimum cohérent ;
- **Équilibre** : meilleur compromis, uniquement s'il existe un setup distinct ;
- **Budget complet** : montée en qualité seulement si elle produit un gain documenté.

Si le catalogue ne permet que deux setups réellement différents, l'API renvoie deux packs : Essentiel et Budget complet. C'est voulu : il vaut mieux deux propositions justifiées que trois variantes artificielles.

`Budget complet` ne signifie pas « atteindre exactement 800 € ». Un pack à 200 € peut être le meilleur résultat pour un besoin simple avec 800 € disponibles. À l'inverse, si les gains sont réels et les rôles nécessaires, le moteur peut utiliser une part importante du budget.

## 7. Données Supabase déjà enrichies et à préserver

Un backfill contrôlé a enrichi 275 produits sans remplacer les overrides non vides. Des profils explicitement vérifiés ont ensuite été posés sur les produits suivants :

| Produit / slug | Faits vérifiés enregistrés |
| --- | --- |
| `nt1-5th-generation-sil-b-stock`, `nt1-5th-generation-black`, `nt1-5th-generation-silver` | Micro condensateur, XLR + USB, usages musique/voix, qualité studio ; dépendance interface pour la chaîne XLR. |
| `focusrite-scarlett-2i2-4th-gen` | Interface USB/XLR, deux entrées, usages musique/podcast/streaming/vidéo. |
| `hofa-absorber-eco` | Traitement, absorbeur large bande, adapté pièce ordinaire ou traitée, usage musique/streaming. |

Sources constructeur utilisées lors de l'enrichissement :

- RØDE NT1 5th Generation : <https://rode.com/en-us/microphones/studio-condenser/nt1-5th-generation>
- RØDE, sorties XLR et USB : <https://help.rode.com/hc/en-us/articles/6939235482767-Does-the-XLR-and-USB-outputs-sound-the-same-on-the-NT1-5th-Generation>
- Focusrite Scarlett 2i2 : <https://us.focusrite.com/products/scarlett-2i2>

Invariants de catégories ajoutés avec prudence : casques studio filaires, webcams USB, hybrides HDMI, action-cams USB, traitement acoustique, certains connecteurs de moniteurs explicitement décrits. **Ne pas réintroduire une règle globale “tout micro à condensateur = XLR”** : le catalogue comporte des exceptions et cette déduction est trop large.

L'invariant `casques-studio -> jack` est adapté au catalogue actuel. Si des casques USB ou sans-fil sont ajoutés à cette catégorie, distinguer les sous-catégories ou vérifier le produit au niveau de sa fiche avant d'en faire une règle générale.

## 8. État quantitatif : ne pas surinterpréter

À la dernière mesure brute du catalogue actif : 348 produits étaient actifs. Une dérivation depuis les seules descriptions/specs a trouvé :

| État brut | Nombre |
| --- | ---: |
| `ready` | 19 |
| `partial` | 291 |
| `to_enrich` | 38 |

Cette mesure brute n'utilise pas les overrides persistants de Supabase ni tous les defaults de catégorie : elle sert à identifier le travail d'enrichissement, pas à déclarer que seuls 19 produits sont utilisables aujourd'hui.

Le point important : les profils rendus fiables un par un doivent être considérés comme plus solides que l'inférence automatique. Ne pas modifier massivement les 348 fiches à partir de descriptions imprécises.

## 9. Connexions produits, offres et articles

### Produits et offres

```text
categories.id
  <- products.category_id

products.id
  <- product_offers.product_id

products.recommendation_profile
  -> moteur Atelier (donnée interne)
```

Les pages catalogue, catégorie et produit chargent généralement `products` avec `product_offers(*)`. Le configurateur utilise son propre chargement minimal dans `lib/atelier/repository.ts`, précisément pour ne récupérer que les champs utiles au calcul.

Lors d'un ajout / d'une édition via `app/admin/page.tsx`, l'admin enregistre déjà le produit, ses offres et un profil de recommandation de base dérivé de la catégorie, description et points forts. Mais le formulaire ne propose pas encore de champs techniques structurés pour remplir sûrement : connecteurs, type, nombre d'entrées, compatibilités, mobilité, acoustique et source de vérification.

### Articles et produits

Les articles (`Article` dans `types/database.ts`) peuvent référencer des produits par plusieurs mécanismes JSONB :

| Champ article | Rôle |
| --- | --- |
| `product_blocks[].product_slug` | Produit éditorial présenté dans le contenu, par slug. |
| `sidebar_product_ids` | Sélection de produits liée à la barre latérale. |
| `related_products` | Produits liés. |
| `related_category_slug` | Catégorie liée. |
| `product_blocks[].affiliate_links` | Liens affiliés spécifiques à un bloc éditorial. |

Les pages guide récupèrent aussi des produits via leurs slugs. Aujourd'hui, le moteur Atelier **ne se sert pas des articles comme source de vérité technique** : c'est une bonne séparation. Une recommandation doit venir des profils techniques et offres réellement disponibles, puis éventuellement pointer vers un guide éditorial approprié.

`contextualGuide` est déjà renvoyé par le moteur, mais il ne doit devenir un lien visible que lorsqu'il correspond à un guide réellement publié et utile. Ne pas transformer le contenu d'article en donnée technique non vérifiée.

## 10. Scénarios réels déjà observés localement

Les tests initiaux ont révélé un défaut réel : avec 800 €, musique en pièce ordinaire renvoyait surtout Shure MV7X + Behringer UMC202HD, sans casque ni traitement, et les profils variaient peu entre les projets. Ce défaut ne doit pas être masqué par de simples tests synthétiques.

Après les corrections de dépendances, d'offres et de profils vérifiés, une requête locale avec 800 €, une source, aucun matériel, pièce non traitée a donné :

| Projet | Packs observés | Conflits |
| --- | --- | --- |
| Musique / chant | Essentiel 310 € ; Équilibre 429 € ; Budget complet 468 € avec NT1, casque, absorbeur et Scarlett 2i2 | 0 |
| Podcast | Essentiel 310 € ; Budget complet 429 € | 0 |
| Streaming | Essentiel 417,89 € ; Budget complet 561,99 € avec micro, casque, webcam, lumière, traitement et interface | 0 |
| Vidéo | Essentiel 403,99 € ; Budget complet 522,99 € avec micro, casque, webcam, lumière et interface | 0 |

Ces résultats sont des **contrôles locaux de l'API**, non une garantie de qualité exhaustive du catalogue. AntiGravity doit refaire au minimum ces parcours par l'interface après toute modification du moteur ou des profils.

## 11. À faire ensuite, dans l'ordre recommandé

### A. Mettre l'admin en capacité de produire de bonnes données

Ajouter dans l'admin produit une zone « Atelier / interne » non visible sur la fiche publique. Le format doit alimenter `recommendation_profile` et/ou `specs`, avec validation légère :

- rôle ;
- sous-type ;
- connecteurs ;
- rôles requis ;
- nombre de sources / entrées ;
- environnements compatibles ;
- mobilité ;
- niveau de complexité ;
- qualités réellement vérifiées ;
- URL ou note de source ;
- statut (`ready`, `partial`, `to_enrich`).

Commencer simple : quelques champs contrôlés et une zone de notes / provenance. Ne pas créer une usine à gaz de taxonomies avant d'avoir besoin de plus de rôles.

### B. Enrichir les produits existants avec un protocole fiable

1. Cibler d'abord les rôles qui empêchent aujourd'hui une recommandation complète : micros, casques, interfaces, caméras, éclairage, traitement.
2. Pour chaque produit destiné à être `ready`, vérifier au moins les champs indispensables au rôle.
3. Conserver l'URL ou une note de source dans les données internes lorsque c'est possible.
4. Écrire seulement les champs confirmés ; laisser les autres incertains.
5. Vérifier un scénario réel avant et après une série de mises à jour.

Le script `scripts/backfill-atelier-profiles.mjs` est utile pour initialiser, mais son écriture doit rester volontaire :

```powershell
# Diagnostic sans écriture
node scripts/backfill-atelier-profiles.mjs

# Écriture contrôlée : remplit seulement les profils actuellement vides.
node scripts/backfill-atelier-profiles.mjs --write
```

Ne pas lancer `--write` comme un réflexe de maintenance et ne pas écraser un override éditorial non vide.

### C. Ajuster les règles uniquement après avoir des données

Le moteur est volontairement explicite. Ajouter une règle seulement si elle correspond à un fait exploitable du catalogue. Exemples :

- casque possédé => aucun casque ajouté ;
- micro XLR possédé => interface ajoutée si nécessaire ;
- micro USB seul => pas d'interface ajoutée sans autre besoin ;
- deux sources => capacité d'interface suffisante ;
- pièce ordinaire => ne pas promouvoir un condensateur comme solution « plug and play » sans chemin acoustique clair.

Ne pas codifier des préférences acoustiques vagues comme des vérités universelles. Elles doivent être liées à un profil, une source, ou une question explicite dans le parcours.

### D. Synchronisation commerciale (phase séparée)

La base possède déjà des éléments dans `lib/pricing/` pour lire et mettre à jour `product_offers`, `products.price` et `price_history`. La synchronisation automatique des prix, stocks et URLs affiliées doit être traitée séparément de l'Atelier :

- une offre cassée doit être désactivée / marquée hors stock ;
- une mise à jour de prix doit recalculer la façade produit ;
- l'Atelier n'utilisera alors que les offres valides grâce à `selectAvailableOffers()`.

Ne pas faire dépendre le moteur d'un LLM ou d'OpenRouter pour cette phase. Le moteur actuel est déterministe et fonctionne sans cette clé.

## 12. Validation obligatoire avant toute mise en production

À exécuter depuis `D:\Stackera\fluxlab-next` :

```powershell
npm run test:atelier
node --test tests/atelier-preview.test.mjs
npx tsc --noEmit --incremental false
```

Les derniers contrôles connus passaient : 77 tests Atelier, 3 tests preview et TypeScript. `npm run lint` n'est pas un signal fiable actuellement car la configuration lint Next n'est pas finalisée ; ne pas le présenter comme vert sans l'avoir configuré.

Tester aussi manuellement, dans le navigateur local, au moins :

1. Musique/chant, 800 €, aucun matériel, pièce ordinaire : vérifier casque, interface et options de traitement cohérentes ; pas de micro USB + interface inutile.
2. Podcast, 800 €, aucun matériel, pièce ordinaire : vérifier une chaîne voix robuste et des alternatives persistantes après recalcul.
3. Streaming et vidéo : vérifier caméra, éclairage, son et liens produits.
4. Profil avec casque ou micro déjà possédé : vérifier que le moteur ne le rachète pas.
5. Budget insuffisant : vérifier un conflit lisible, jamais une fausse chaîne complète.
6. Produit désactivé, hors stock ou sans lien affilié : vérifier son exclusion.

Pour la session locale, le serveur Fluxlab doit rester sur le port 3001 :

```powershell
npm run dev -- -p 3001
```

Ne jamais arrêter ni réutiliser le port 3000 : il appartient à un autre projet (Inbetune).

## 13. Variables d'environnement et sécurité

Les variables nécessaires au catalogue sont celles déjà utilisées par le projet :

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY   # scripts d'administration/backfill uniquement
```

La clé `SUPABASE_SERVICE_ROLE_KEY` ne doit jamais passer dans le client, dans une route publique sans contrôle, ni dans Git. Le LLM / OpenRouter est facultatif et n'est pas requis pour l'Atelier actuel ; il est d'ailleurs absent de certains déploiements car les fichiers `.env` sont ignorés par Git.

## 14. Limites connues à transmettre honnêtement

- Le catalogue n'est pas encore entièrement enrichi techniquement ; les résultats sont solides seulement dans la mesure des profils et offres disponibles.
- Les prix et URLs affiliées ne sont pas encore garantis par une synchronisation automatique continue.
- Le questionnaire a été réduit volontairement ; certaines distinctions fines (type de voix, acoustique détaillée, workflow DAW, connectique propriétaire) ne sont pas encore demandées.
- Le moteur ne doit pas être transformé en chatbot généraliste. Sa valeur est une sélection vérifiable du catalogue propre à Fluxlab, avec budget et compatibilités.
- Trois packs ne doivent apparaître que s'ils sont réellement distincts et cohérents.
- Toute correction sur les données réelles doit être confirmée par des parcours API **et** navigateur, pas seulement par une suite de tests isolée.

## 15. Première action conseillée pour AntiGravity

1. Lire `lib/atelier/profile.ts`, `lib/atelier/repository.ts`, `lib/atelier/engine.ts`, `lib/atelier/requirements.ts`, `app/api/atelier/recommendation/route.ts` et `app/admin/page.tsx`.
2. Lancer les trois commandes de validation de la section 12 pour établir un point de départ.
3. Inspecter un échantillon réel de produits par rôle dans Supabase avant toute règle globale.
4. Ajouter le minimum de champs internes à l'admin pour les faits techniques fiables.
5. Enrichir quelques produits stratégiques, tester les quatre personas ci-dessus, puis itérer.

Ne pas commencer par une réécriture du moteur ou par un backfill massif. Le chemin court et robuste est : **données fiables -> scénarios observables -> règle minimale si nécessaire**.
