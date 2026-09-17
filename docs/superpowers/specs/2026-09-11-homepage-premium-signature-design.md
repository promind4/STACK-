# Homepage Fluxlab premium — design signature

## Intention

La page d’accueil doit aider un créateur à comprendre immédiatement la valeur de Fluxlab : comparer des offres réelles et composer un équipement cohérent. Le caractère premium vient de la précision éditoriale, de la composition et du mouvement, pas d’une accumulation d’effets.

## Direction visuelle

- Noir studio `#090806`, graphite `#171510`, ivoire `#F3EEE5`, blanc produit `#FFFFFF`, laiton `#C89B52`, encre `#17130E`.
- Une serif expressive porte les titres ; la sans-serif existante porte l’information et les actions.
- Le monospace et les capitales espacées sont réservés aux données techniques.
- Aucun mot isolé n’est coloré ou mis en italique par automatisme.

## Composition

```text
┌─────────────────────────────────────────────────────────────┐
│ Promesse + actions       scène studio / composition utile   │
│                         navigation par besoins intégrée     │
├─────────────────────────────────────────────────────────────┤
│ Sélection produit carrée       Composer un setup cohérent   │
│ [produit] [produit] [produit]  micro → interface → sortie  │
├─────────────────────────────────────────────────────────────┤
│ Une seule bande de preuves vérifiables                      │
├─────────────────────────────────────────────────────────────┤
│ Guide vedette asymétrique        trois lectures courtes     │
└─────────────────────────────────────────────────────────────┘
```

L’alignement reste à gauche. L’asymétrie vient des proportions et du rythme, pas d’éléments flottants arbitraires. Sur mobile, chaque section est recomposée dans l’ordre de décision.

## Élément mémorable

Le parcours de setup est la seule scène animée forte. Il illustre une chaîne compréhensible — source, traitement, restitution — avec des connexions ancrées. Il ne duplique pas les produits du showcase et ne prétend pas vérifier ce que les données ne garantissent pas.

## Mouvement

- Une entrée orchestrée du héros, courte et jouée une fois.
- Un halo ou motif Magic UI discret en soutien.
- Les cartes répondent au survol ou au focus par lumière et élévation.
- Le parcours anime uniquement les connexions explicatives.
- `prefers-reduced-motion` conserve toute l’information sans animation.

## Contenu, responsive et confiance

- Une seule zone de réassurance, avec des formulations prudentes liées aux données reçues.
- Les cartes produits gardent un fond blanc neutre continu autour des images.
- Le héros n’impose plus 900 px sur mobile.
- Les besoins deviennent une navigation compacte ; les cartes produits restent lisibles à 360–390 px.
- Le parcours devient séquentiel sur tablette et mobile ; les guides remplissent toujours leur cadre.

## Garde-fous

- Réutiliser Tailwind, Framer Motion, Lucide et le code existant avant toute dépendance.
- Magic UI fournit au maximum deux primitives locales.
- Ne pas réactiver l’optimisation Vercel des images Supabase.
- Préserver clavier, focus, contraste, sémantique et performance.
- Ne modifier que la homepage et les composants partagés nécessaires.

## Critique anti-slop

La version actuelle utilise plusieurs marqueurs génériques : mot en dégradé, labels en capitales, flèches répétées, traits décoratifs et panneaux sombres uniformes. La version retenue supprime ces automatismes. La richesse se concentre dans le héros et le parcours ; produits et guides restent calmes et précis.

## Validation

- Proposition de valeur lisible à 1440, 820 et 390 px.
- Aucune grande marge accidentelle sous les cartes.
- Aucun doublon de produits ou de réassurance.
- Les animations ont une fonction et respectent le mouvement réduit.
- Tests, TypeScript, build Next.js et politique d’images passent.
- Aucun push, merge ou déploiement avant validation utilisateur.
