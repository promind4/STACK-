# Fluxlab — Marketing Priorité 3 — Implementation Plan

**Goal:** Identité éditoriale (byline), blocs réponse directe dans les 7 guides prioritaires.

**Architecture:**
- Task 8 : 1 ligne de texte dans le JSX du guide
- Task 9 : injection d'un bloc HTML au début de chaque `content` dans lib/data.ts pour 7 articles

**Hors scope (contenu progressif) :** Task 10 — 10 articles longue traîne, 2/semaine manuellement.

---

## Task 8 — Byline dans `app/guide/[slug]/page.tsx`

Remplacer le bloc meta (lignes ~343-350) :
```tsx
{/* Méta — date + temps de lecture, sans auteur */}
<div className="flex items-center gap-3 text-[12px] font-mono text-white/40">
    <span>Fluxlab</span>
    <span className="text-white/20">·</span>
    <span>{article.date}</span>
    <span className="text-white/20">·</span>
    <span>{article.readTime} de lecture</span>
</div>
```
Par :
```tsx
{/* Méta — byline éditorial */}
<div className="flex items-center gap-3 text-[12px] font-mono text-white/40">
    <span>Par la rédaction Fluxlab</span>
    <span className="text-white/20">·</span>
    <span>Mis à jour en {article.date}</span>
</div>
```

---

## Task 9 — Blocs réponse directe dans lib/data.ts

Format HTML à insérer au DÉBUT de chaque `content` (après le backtick ouvrant) :

```html
<div class="not-prose mb-8 p-5 rounded-xl bg-secondary border-l-4 border-primary">
  <p class="text-[10px] font-mono uppercase tracking-widest text-primary mb-2">Réponse directe</p>
  <p class="text-[15px] leading-relaxed text-foreground/85">[ANSWER SPECIFIC TO ARTICLE]</p>
</div>
```

### Articles à modifier (7 prioritaires)

| Slug | Réponse directe (40-60 mots) |
|------|-------------------------------|
| `meilleur-micro-podcast-2026` | Pour un podcast en 2026, le meilleur micro dépend de votre connexion : USB pour la simplicité (Rode NT-USB Mini, Blue Yeti), XLR pour la qualité broadcast (Rode PodMic, Shure SM7B). Budget 80-150€ : Rode PodMic USB. Budget 300-400€ : Shure SM7B + Focusrite Scarlett 2i2. La différence audible entre XLR et USB est faible en dessous de 200€. |
| `setup-youtube-debutant-2026` | Pour débuter sur YouTube avec 500-700€, l'essentiel est : une Sony ZV-E10 (~400€) pour la caméra, un micro USB type Rode NT-USB Mini (~100€) et un éclairage diffusé (~100€). Priorisez l'audio avant tout — un mauvais son fait fuir les abonnés, une image imparfaite est pardonnée. Évitez les kits complets de mauvaise qualité. |
| `top-5-interfaces` | En 2026, la meilleure interface audio pour la majorité des créateurs est la Focusrite Scarlett 2i2 4e génération : préamplis propres, latence ultra-basse, suite logicielle incluse. Budget plus serré (<100€) : Focusrite Scarlett Solo. Besoin de préamplis plus musicaux : Audient iD4 MKII ou SSL 2+ pour +50€. Évitez les interfaces sans marque vendues moins de 40€. |
| `setup-streaming-debutant-2026` | Pour streamer sur Twitch ou YouTube en 2026 avec 200€ : micro USB HyperX SoloCast (50€) + webcam Logitech C920 (80€) + OBS Studio (gratuit). Si vous jouez sur console, ajoutez une carte de capture Elgato HD60 X. L'audio est votre priorité absolue — une image 720p avec un son propre bat toujours une 4K avec un son médiocre. |
| `xlr-vs-usb` | En 2026, choisissez USB si vous débutez et voulez du plug-and-play sans interface audio. Choisissez XLR si votre budget dépasse 200€, que vous voulez évoluer ou enregistrer plusieurs sources. La qualité audio de l'XLR reste supérieure en théorie, mais la différence est imperceptible sous 150€. L'USB est aujourd'hui suffisant pour 90% des podcasters et streamers. |
| `eclairage-cinematique` | Pour un éclairage cinématique à domicile, privilégiez une source douce et diffusée (panneau LED bicolore, softbox) avec un IRC supérieur à 95. Positionnnez votre lumière principale à 45° du visage. Budget minimum pour un résultat professionnel : 150€. Évitez les néons de bureau qui mélangent lumière chaude et froide — votre balance des blancs sera incontrôlable. |
| `choisir-casque-studio` | Pour choisir un casque studio : casque fermé pour l'enregistrement (isolation phonique), casque ouvert pour le mixage (image stéréo naturelle). Les meilleurs rapports qualité/prix en 2026 : Beyerdynamic DT 770 Pro (fermé, 150€) et DT 990 Pro (ouvert, 130€). Évitez les casques gaming — leur courbe en V colorée fausse votre perception du mix. |
