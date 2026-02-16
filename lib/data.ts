import React from 'react';

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  image: string;
  intro: string;
  content: string;
  relatedProducts: string[];
  relatedCategorySlug: string;
}

export interface Pathway {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  steps: {
    order: number;
    title: string;
    desc: string;
    articleSlug?: string;
  }[];
  ctaCategory: string;
}

// --- MOCK DATA ---

export const ARTICLES: Article[] = [
  {
    id: "7",
    slug: "choisir-casque-studio",
    title: "Comment choisir son Casque Studio ? (Ouvert vs Fermé)",
    category: "Audio",
    readTime: "12 min",
    date: "18 Jan 2025",
    author: "L'IA Fluxlab",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=1200",
    intro: "Mixer avec un casque grand public est la garantie d'un mixage raté. Découvrez pourquoi la courbe de réponse plate est votre amie, et quand utiliser un casque ouvert ou fermé.",
    relatedProducts: ["beyerdynamic-dt-770-pro-80-ohm", "beyerdynamic-dt-990-pro", "sennheiser-hd-600"],
    relatedCategorySlug: "casques-studio",
    content: `
      <h2>Fermé (Closed-Back) vs Ouvert (Open-Back)</h2>
      <p>C'est la première question à se poser. La construction change tout.</p>

      <h3>Le Casque Fermé (Tracking)</h3>
      <p>Les coques sont solides. Le son est piégé à l'intérieur.
      <br><strong>Avantages :</strong> Isolation maximale. Le son ne "fuit" pas vers le micro (Bleed). Idéal pour enregistrer des voix.
      <br><strong>Inconvénients :</strong> Les basses s'accumulent (effet de boîte), la scène sonore est étriquée. Vos oreilles chauffent.
      <br><strong>Le Standard :</strong> Beyerdynamic DT 770 Pro.</p>

      <h3>Le Casque Ouvert (Mixing)</h3>
      <p>Les coques sont grillagées. L'air circule librement.
      <br><strong>Avantages :</strong> Son ultra-naturel, scène sonore large (on entend "hors de la tête"). Pas de fatigue auditive.
      <br><strong>Inconvénients :</strong> Tout le monde entend ce que vous écoutez. Impossible d'enregistrer avec devant un micro.
      <br><strong>Le Standard :</strong> Beyerdynamic DT 990 Pro / Sennheiser HD 600.</p>

      <h2>L'Impédance (Ohm)</h2>
      <p>80 Ohm ? 250 Ohm ?
      <br>- <strong>32-80 Ohm :</strong> Facile à alimenter. Fonctionne sur un téléphone ou une carte son USB standard.
      <br>- <strong>250-600 Ohm :</strong> Demande un ampli casque dédié (puissant). Offre souvent une meilleure réponse transitoire (plus de détails).</p>
    `
  },
  {
    id: "1",
    slug: "xlr-vs-usb",
    title: "XLR vs USB : L'Analyse Technique Complète (2025)",
    category: "Audio",
    readTime: "25 min",
    date: "12 Oct 2024",
    author: "L'IA Fluxlab",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=1200",
    intro: "Au-delà du débat simpliste 'Débutant vs Pro', il s'agit de comprendre la chaîne du signal. Tension, Préamplification, Conversion A/N : plongeons dans la physique pour faire le bon choix.",
    relatedProducts: ["shure-mv7", "rode-podmic-usb", "shure-sm7b", "electro-voice-re20"],
    relatedCategorySlug: "microphones",
    content: `
      <h2>Chapitre 1 : La Physique du Transducteur</h2>
      <p>Pour bien arbitrer ce duel, il faut revenir à la source : la capsule. C'est l'élément qui transforme la pression acoustique (le son) en courant électrique.</p>
      <p>Contrairement aux idées reçues, <strong>un micro USB et un micro XLR partagent souvent la même capsule</strong>. Le Shure MV7 (USB) utilise une capsule dynamique très similaire à celle du légendaire SM7B. La qualité de la "capture" brute est donc quasiment identique. La différence ne se joue pas sur la capture, mais sur le traitement du signal électrique.</p>

      <h2>Chapitre 2 : Le Chemin du Signal (Signal Flow)</h2>
      <p>Le courant qui sort de la capsule est minuscule (quelques millivolts). Il est très fragile. C'est ici que les routes se séparent.</p>

      <h3>La Route USB : L'intégration forcée</h3>
      <p>Dans un micro USB, trois composants sont entassés dans le corps du micro : le préampli (qui augmente le volume), le convertisseur Analogique-Numérique (qui crée les 0 et 1), et l'interface USB. Cette miniaturisation impose des limites physiques. Les condensateurs sont plus petits, le filtrage électrique est moins bon. Cela se traduit souvent par un "bruit de fond" (Noise Floor) plus élevé, ce petit souffle constant qu'on entend dans les moments de silence.</p>
      <p>Cependant, des modèles récents comme le <strong>rode-podmic-usb</strong> intègrent des puces DSP (Digital Signal Processing) spécialisées qui appliquent une compression et un noise gate <em>avant</em> l'envoi à l'ordinateur. C'est une prouesse technologique qui comble l'écart avec le matériel pro.</p>

      <h3>La Route XLR : La séparation des pouvoirs</h3>
      <p>Le XLR est un standard analogique professionnel. Le micro ne fait qu'une chose : envoyer le signal brut. C'est l'interface audio externe (comme la Focusrite Scarlett) qui se charge du reste. L'avantage majeur est le câblage <strong>Symétrique (Balanced)</strong>.</p>
      <p>Le câble XLR transporte le signal en double exemplaire, dont un est inversé en phase (Phase Reverse). À l'arrivée dans la carte son, les interférences électromagnétiques (captées en route) s'annulent mathématiquement lorsque les deux signaux sont recombinés. Résultat : vous pouvez utiliser un câble de 50 mètres passant à côté de câbles d'alimentation sans aucun grésillement. C'est impossible en USB.</p>

      <h2>Chapitre 3 : Bit Depth et Sample Rate</h2>
      <p>C'est la "résolution" de votre son.</p>
      <ul>
        <li><strong>Sample Rate (Fréquence d'échantillonnage) :</strong> Combien de fois par seconde l'ordinateur mesure le son. 44.1kHz (CD) ou 48kHz (Vidéo) suffisent pour la voix. Le 192kHz (disponible sur les interfaces XLR) sert au Sound Design pour ralentir les sons sans perte.</li>
        <li><strong>Bit Depth (Profondeur) :</strong> C'est la plage dynamique. Le 16-bit (vieux micros USB) offre 96dB de dynamique. Le 24-bit (Standard Pro) offre 144dB. Le nouveau <strong>32-bit Float</strong> (disponible sur les enregistreurs Zoom) rend la saturation numérique mathématiquement impossible. Le XLR vous donne accès à ces technologies de pointe.</li>
      </ul>

      <h2>Chapitre 4 : Latence et Monitoring</h2>
      <p>Parler et s'entendre avec un délai de 20ms est impossible (effet "Speech Jammer"). Les micros USB contournent ça avec une prise casque "Direct Monitor". Mais si vous voulez ajouter de la réverbération dans votre casque pour mieux chanter, l'USB montre ses limites (latence du CPU).</p>
      <p>Les interfaces XLR utilisent des drivers ASIO (sur Windows) qui permettent des latences ultra-faibles (3ms), permettant un monitoring avec effets en temps réel, vital pour les musiciens.</p>

      <h2>Verdict : L'Arbre de Décision</h2>
      <p><strong>Choisissez l'USB (Rode PodMic USB) si :</strong></p>
      <ul>
        <li>Vous êtes seul.</li>
        <li>Vous voulez un bureau minimaliste sans interface externe.</li>
        <li>Vous streamez principalement (la compression de Twitch masquera les micro-détails).</li>
      </ul>

      <p><strong>Choisissez le XLR (Shure SM7B + Scarlett) si :</strong></p>
      <ul>
        <li>Vous enregistrez à plusieurs (Multi-pistes).</li>
        <li>Vous voulez intégrer des instruments (Guitare, Synthé).</li>
        <li>Vous visez une qualité "Broadcast / Radio" absolue avec un silence parfait.</li>
        <li>Vous voulez pérenniser votre achat (un micro XLR durera 50 ans).</li>
      </ul>
    `
  },
  {
    id: "2",
    slug: "eclairage-cinematique",
    title: "Théorie de la Lumière : Le Guide Technique Complet",
    category: "Vidéo",
    readTime: "22 min",
    date: "28 Sep 2024",
    author: "L'IA Fluxlab",
    image: "https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?auto=format&fit=crop&q=80&w=1200",
    intro: "La caméra n'est qu'un capteur. C'est la lumière qui crée l'image. Maîtrisez le CRI, la Température Kelvin et la Diffusion pour un rendu Netflix.",
    relatedProducts: ["elgato-key-light", "elgato-key-light-air", "aputure-120d-ii"],
    relatedCategorySlug: "lighting",
    content: `
      <h2>Partie 1 : La Qualité de la Lumière (Soft vs Hard)</h2>
      <p>En éclairage, la taille de la source est inversement proportionnelle à la dureté des ombres. C'est la loi fondamentale.</p>
      <p>Une petite source (flash de téléphone, ampoule nue) est une source ponctuelle. Elle crée des ombres dures, "coupées au couteau". Sur un visage, cela accentue la texture de la peau, les rides, et les imperfections. C'est l'ennemi du YouTuber.</p>
      <p>Pour obtenir le "look cinéma", il faut une source large. C'est le rôle de la <strong>Softbox</strong> (ou boîte à lumière). Elle diffuse les photons sur une grande surface (60cm, 90cm, 120cm). La lumière "enveloppe" le visage, les ombres deviennent progressives (dégradés doux). Les panneaux <strong>Elgato Key Light</strong> utilisent un verre dépoli spécial ("Opal Glass") pour créer cet effet de diffusion sans l'encombrement d'une softbox de 50cm de profondeur.</p>

      <h2>Partie 2 : La Colorimétrie (CRI et TLCI)</h2>
      <p>Toutes les lumières blanches ne se valent pas. L'œil humain s'adapte, mais pas le capteur de la caméra.</p>
      <p><strong>Le CRI (Color Rendering Index) :</strong> C'est la capacité d'une lampe à reproduire fidèlement le spectre solaire. Une lumière bas de gamme (CRI 70) a des "trous" dans le spectre. Résultat : votre peau apparaît verdâtre ou grisâtre, impossible à corriger au montage. Pour la vidéo, exigez toujours un CRI supérieur à 95 (Aputure, Godox, Elgato).</p>
      <p><strong>La Température (Kelvin) :</strong>
      <br>- 3200K (Tungstène) : Orange, chaud, intime.
      <br>- 5600K (Daylight) : Blanc, neutre, énergique.
      <br>L'erreur fatale est le "Mixed Lighting". Si vous avez une fenêtre (5600K) et une lampe de plafond (3000K), votre visage sera bleu d'un côté et orange de l'autre. La caméra ne saura pas faire sa balance des blancs. Utilisez des lumières Bi-Color pour matcher votre environnement.</p>

      <h2>Partie 3 : Le Schéma à 3 Points (Three-Point Lighting)</h2>
      <p>C'est la grammaire visuelle standard d'Hollywood.</p>
      
      <h3>1. KEY LIGHT (Lumière Clé)</h3>
      <p>C'est la source principale. Elle définit l'exposition de la caméra. Ne la placez jamais dans l'axe de la caméra (rendu plat, "permis de conduire"). Placez-la à 45° sur le côté et à 45° en hauteur. Cela crée le fameux "Triangle de Rembrandt" sur la joue opposée, donnant du volume et de la 3D au visage.</p>

      <h3>2. FILL LIGHT (Lumière de Débouchage)</h3>
      <p>Située à l'opposé de la Key Light, elle contrôle le contraste (Ratio). Si vous voulez un rendu dramatique (Film Noir), n'en mettez pas. Si vous voulez un rendu YouTube/TV moderne, utilisez-la à 50% de la puissance de la Key Light pour adoucir les ombres sans les effacer totalement.</p>

      <h3>3. RIM LIGHT / HAIR LIGHT (Le secret des pros)</h3>
      <p>C'est la lumière la plus importante pour le "Look Pro". Elle se place derrière le sujet, en hauteur, et pointe vers la nuque/épaules. Elle ne doit pas toucher le nez.</p>
      <p>Son rôle est de créer un liseré brillant sur les contours (cheveux, épaules). Cela "découpe" le sujet du fond. Sans elle, si vous portez un t-shirt noir sur un fond sombre, vous êtes un homme-tronc flottant. Avec elle, vous existez dans l'espace 3D. Les petits panneaux RGB ou tubes LED sont parfaits pour ça.</p>

      <h2>Conclusion</h2>
      <p>Investissez dans une bonne Key Light (comme l'Aputure 120D ou Elgato Key Light) avant d'acheter une nouvelle caméra. Une webcam à 100€ bien éclairée donne une meilleure image qu'une caméra à 2000€ dans le noir.</p>
    `
  },
  {
    id: "3",
    slug: "obs-studio-reglages",
    title: "OBS Studio : L'Encyclopédie Technique (Bitrate, Codecs, Audio)",
    category: "Streaming",
    readTime: "30 min",
    date: "15 Nov 2024",
    author: "David Chen",
    image: "https://images.unsplash.com/photo-1560252829-804f1aedf1be?auto=format&fit=crop&q=80&w=1200",
    intro: "OBS n'est pas juste un logiciel de capture, c'est une régie de diffusion TV complète. Comprendre les I-Frames, le VBR vs CBR et la chaîne de traitement audio est vital pour un stream de qualité.",
    relatedProducts: ["elgato-stream-deck-mk2", "elgato-stream-deck-plus", "logitech-brio-4k"],
    relatedCategorySlug: "streaming-gear",
    content: `
      <h2>Chapitre 1 : La Compression Vidéo (Le nerf de la guerre)</h2>
      <p>Le streaming consiste à envoyer 60 images HD par seconde à travers un tuyau (Internet) limité. Sans compression massive, c'est impossible. C'est là qu'interviennent les Codecs (H.264, AV1).</p>
      
      <h3>x264 vs NVENC : Le duel CPU / GPU</h3>
      <p><strong>x264 (Software) :</strong> L'encodage est fait par votre processeur. C'est très efficace mais extrêmement lourd. Pour streamer en "x264 Medium" (haute qualité) et jouer en même temps, il faut souvent un deuxième PC dédié (Dual PC Setup).</p>
      <p><strong>NVENC (Hardware) :</strong> NVIDIA a intégré une puce dédiée physique sur ses cartes graphiques (depuis les GTX 1000). Cette puce ne fait QUE de l'encodage vidéo. Elle ne vole aucune ressource aux jeux. Depuis l'architecture Turing (RTX 2000), la qualité du NVENC est visuellement identique au x264 Fast/Medium.
      <br><strong>Recommandation 2025 :</strong> Utilisez <strong>NVIDIA NVENC H.264 (New)</strong>. C'est le standard absolu pour un setup Mono-PC.</p>

      <h2>Chapitre 2 : Bitrate et Résolution</h2>
      <p>Le Bitrate est la quantité d'information par seconde. Twitch limite techniquement à 6000-8000 Kbps.</p>
      <p><strong>Le piège du 1080p :</strong> Une image 1080p contient 2 millions de pixels. À 60 fps, cela fait 120 millions de pixels par seconde. Essayer de faire rentrer ça dans 6000 Kbps crée de la "bouillie" (macroblocking) lors des mouvements rapides.</p>
      <p><strong>Le "Sweet Spot" : 900p</strong> (1600x900). C'est la résolution secrète des pros. Elle est plus nette que le 720p, mais demande beaucoup moins de débit que le 1080p. À 6000 Kbps, le 900p60 est cristallin, alors que le 1080p60 peut "pixeliser".</p>
      <p><strong>Réglages recommandés :</strong></p>
      <ul>
        <li>Rate Control : <strong>CBR</strong> (Constant Bitrate). Indispensable pour la stabilité du flux TCP.</li>
        <li>Keyframe Interval : <strong>2s</strong>. Obligatoire pour Twitch.</li>
        <li>Preset : <strong>Quality</strong> (ou P6).</li>
        <li>Look-ahead et Psycho Visual Tuning : <strong>On</strong> (pour les jeux rapides).</li>
      </ul>

      <h2>Chapitre 3 : Le Studio Audio Virtuel (VST)</h2>
      <p>OBS permet d'insérer des plugins VST2 pour traiter votre micro comme en studio radio. L'ordre des filtres (Signal Chain) est CRITIQUE.</p>

      <h3>1. Noise Suppression (Nettoyage)</h3>
      <p>Utilisez "RNNoise". C'est un algorithme basé sur l'IA (Réseaux de neurones) qui reconnaît la voix humaine et supprime tout le reste (clavier, ventilateurs, chiens). C'est magique et gratuit dans OBS.</p>

      <h3>2. L'Égaliseur (EQ)</h3>
      <p>Votre voix brute est souvent "plate". Un EQ permet de :
      <br>- Couper les basses (Low Cut à 80Hz) pour supprimer les ronflements et chocs de table.
      <br>- Booster les aigus (High Shelf à 8kHz) pour donner de l'"Air" et de la présence.</p>

      <h3>3. La Compression (La densité)</h3>
      <p>Le compresseur réduit l'écart dynamique. Il abaisse les sons forts pour qu'on puisse remonter le niveau global. C'est ce qui donne ce son "plein" et constant des animateurs radio.
      <br>Recommandation : Ratio 3:1 ou 4:1. Threshold (Seuil) réglé pour qu'il s'active quand vous parlez normalement.</p>

      <h3>4. Le Limiteur (La sécurité)</h3>
      <p>C'est le mur de briques. Réglez-le à -1dB. Il garantit que même si vous hurlez de terreur sur un jeu d'horreur, le son ne dépassera jamais 0dB (saturation numérique). Vos viewers vous remercieront.</p>

      <h2>Chapitre 4 : La Gestion des Scènes</h2>
      <p>Utilisez les "Collections de Scènes". Ne mettez pas tout dans une seule collection. Et surtout, utilisez les <strong>Sources Miroir</strong> ou les <strong>Scènes Imbriquées</strong>. Créez une scène "Caméra Master" avec votre webcam et ses filtres. Intégrez cette scène dans vos scènes de Jeu et de Discussion. Si votre webcam change ou plante, vous la modifiez à un seul endroit et tout votre stream est mis à jour.</p>
    `
  },
  {
    id: "4",
    slug: "top-5-interfaces",
    title: "Guide Expert : Choisir son Interface Audio en 2025",
    category: "Matériel",
    readTime: "15 min",
    date: "02 Jan 2025",
    author: "Alexandre Dupont",
    image: "https://images.unsplash.com/photo-1519508234439-4f23643125c1?auto=format&fit=crop&q=80&w=1200",
    intro: "Au-delà des fiches techniques marketing, analysons les préamplis, les convertisseurs et les drivers. Focusrite, Audient, SSL, Universal Audio : qui domine vraiment ?",
    relatedProducts: ["focusrite-scarlett-2i2-4th-gen", "focusrite-scarlett-solo-4th-gen", "audient-id4-mkii", "universal-audio-volt-176"],
    relatedCategorySlug: "audio-interfaces",
    content: `
      <h2>Critère N°1 : Le Gain du Préampli (Gain Staging)</h2>
      <p>C'est la donnée la plus critique. Un micro dynamique broadcast (Shure SM7B, Electro-Voice RE20) a un niveau de sortie très faible (-59dB). Pour amener ce signal à un niveau de ligne utilisable (0dB), il faut énormément d'amplification.</p>
      <p>Les interfaces d'il y a 5 ans plafonnaient à 50-55dB de gain. C'était insuffisant, obligeant l'achat d'un "Cloudlifter" ou "FetHead" (préampli en ligne à 150€).
      <br>La révolution est arrivée avec les nouvelles générations (Scarlett 4th Gen) qui offrent <strong>69dB de gain</strong>. C'est énorme. Plus besoin d'accessoires. Vérifiez toujours que votre interface offre au moins 60dB de gain si vous visez un micro dynamique.</p>

      <h2>Critère N°2 : Le Bruit de Fond (EIN)</h2>
      <p>L'<strong>Equivalent Input Noise (EIN)</strong> mesure le silence. Quand vous poussez le gain à fond, combien de souffle l'interface ajoute-t-elle ?
      <br>Un excellent préampli a un EIN de -128dBu ou moins. La Scarlett 4th Gen est à -127dBu, l'Audient iD4 à -129dBu. À ce niveau, le souffle est inaudible à l'oreille humaine dans des conditions normales.</p>

      <h2>Analyse Détaillée des Champions 2025</h2>

      <h3>1. Focusrite Scarlett 2i2 (4th Gen)</h3>
      <p>C'est la nouvelle référence. Focusrite a remplacé ses convertisseurs grand public par ceux de sa gamme RedNet (utilisée dans les studios Abbey Road). La clarté est chirurgicale.
      <br><strong>Fonctions Tueur (Killer Features) :</strong>
      <br>- <strong>Auto Gain :</strong> L'interface écoute votre voix pendant 10s et règle le gain parfait. Fini les tâtonnements pour les débutants.
      <br>- <strong>Clip Safe :</strong> Un DSP surveille le niveau 96 000 fois par seconde. Si un pic de volume arrive (cri), il baisse le gain analogique instantanément pour sauver la prise. C'est une assurance-vie pour le live.</p>

      <h3>2. Audient iD4 / iD14 MKII</h3>
      <p>La philosophie opposée. Audient met un point d'honneur à utiliser le MEME circuit de préamplification classe A que dans ses consoles de studio ASP8024 à 50 000€.
      <br>Le son n'est pas "neutre", il est "musical", avec une légère coloration harmonique. L'entrée DI (pour guitare) est à transistor JFET, simulant l'entrée d'un ampli à lampes. C'est le choix absolu des musiciens et chanteurs.</p>

      <h3>3. Universal Audio Volt 176 / 276</h3>
      <p>Universal Audio est le maître du matériel analogique vintage. La série Volt intègre un véritable circuit de compression analogique (basé sur le FET 1176).
      <br>Ce n'est pas un plugin. C'est un circuit électrique qui écrase la dynamique de votre voix à la prise. Cela donne instantanément ce son "Radio US" ou "Voix Off de film" très dense et percutant. C'est destructif (on ne peut pas l'enlever après), mais ça sonne incroyablement bien tout de suite.</p>

      <h3>4. SSL 2 / 2+</h3>
      <p>Solid State Logic. Le bouton "4K" ajoute une bosse dans les aigus et une légère distorsion harmonique, imitant le son des consoles SSL 4000 series des années 80 (Michael Jackson, Dr Dre). C'est subtil mais ça fait "percer" la voix dans le mix sans EQ.</p>

      <h2>Conclusion : Filaire vs DSP</h2>
      <p>Si vous êtes streamer et que vous ne voulez pas gérer de plugins, prenez la <strong>Volt (pour le compresseur)</strong> ou la <strong>Scarlett (pour le Clip Safe)</strong>. Si vous êtes musicien puriste et que vous mixerez plus tard, prenez l'<strong>Audient</strong> pour la pureté du signal.</p>
    `
  },
  {
    id: "5",
    slug: "insonorisation",
    title: "Acoustique : La Science du Traitement de Pièce",
    category: "Acoustique",
    readTime: "20 min",
    date: "10 Dec 2024",
    author: "L'IA Fluxlab",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1200",
    intro: "Acheter un micro à 1000€ dans une pièce vide, c'est comme conduire une Ferrari sur un chemin de terre. L'acoustique dicte 80% de la qualité finale de votre audio.",
    relatedProducts: ["elgato-wave-panels", "elgato-wave-panels-starter-set"],
    relatedCategorySlug: "audio",
    content: `
      <h2>Le Mythe de l'Isolation vs le Traitement</h2>
      <p>Il est crucial de distinguer ces deux concepts de physique :</p>
      <ul>
        <li><strong>L'Isolation (Sound Proofing) :</strong> C'est empêcher le son de traverser la matière (murs). Pour bloquer le son, il faut de la <strong>MASSE</strong>. La seule solution est la construction : double placo, laine minérale, désolidarisation (boîte dans la boîte). Coller de la mousse au mur n'isolera RIEN. Vos voisins entendront toujours vos cris.</li>
        <li><strong>Le Traitement (Acoustic Treatment) :</strong> C'est empêcher le son de REBONDIR à l'intérieur de la pièce. C'est ce qu'on appelle dompter la réverbération (RT60). C'est ça qui donne le son "studio" sec et professionnel.</li>
      </ul>

      <h2>La Physique des Réflexions</h2>
      <p>Le son se comporte comme la lumière dans un palais des glaces.
      <br>- <strong>Réflexions Primaires :</strong> Le son qui part de votre bouche, tape le mur et revient dans le micro. C'est l'écho court et désagréable (Flutter Echo).
      <br>- <strong>Modes de Pièce (Standing Waves) :</strong> Les basses fréquences ont des longueurs d'onde très grandes (plusieurs mètres). Elles se piègent dans les coins et entre les murs parallèles, créant des zones où les basses sont amplifiées (+12dB) ou annulées. C'est ce qui rend le son "boueux" (Muddy).</p>

      <h2>La Solution 1 : La Diffusion (Gratuite)</h2>
      <p>Avant d'absorber, il faut diffuser. Une pièce cubique vide est le pire environnement. Il faut briser les ondes.</p>
      <ul>
        <li><strong>Bibliothèques :</strong> Une étagère avec des livres de tailles différentes agit comme un diffuseur quadratique naturel. Elle éparpille le son dans toutes les directions.</li>
        <li><strong>Canapés et Lits :</strong> Ce sont des "Bass Traps" naturels géants. La densité du matelas absorbe énormément d'énergie.</li>
        <li><strong>Tapis :</strong> Indispensable pour tuer la réflexion du sol. Prenez-le épais (Shaggy).</li>
      </ul>

      <h2>La Solution 2 : L'Absorption (Le Matériel)</h2>
      <p>C'est là qu'on parle de panneaux. Mais attention à l'arnaque de la "Mousse Acoustique".</p>
      
      <h3>Pourquoi la mousse "boîte d'oeuf" est inefficace</h3>
      <p>La mousse polyuréthane légère (celle qu'on achète 20€ les 12) a une densité très faible. Elle n'absorbe physiquement QUE les très hautes fréquences (aigus).
      <br>Conséquence : Vous tuez les aigus, mais les médiums (votre voix) et les basses continuent de résonner. Votre pièce devient sombre, sourde, étouffée, mais reste brouillonne. C'est le pire des deux mondes.</p>

      <h3>La suprématie de la Laine Minérale / Fibre Haute Densité</h3>
      <p>Pour absorber la voix (300Hz - 3000Hz), il faut de la matière dense. Les panneaux professionnels (Gik Acoustics, Primacoustic) ou semi-pros (<strong>Elgato Wave Panels</strong>) utilisent des matériaux beaucoup plus denses.</p>
      <p>Les <strong>Wave Panels</strong> utilisent une structure sandwich avec de la fibre haute densité et une couche d'air emprisonnée (Air Gap). Cette couche d'air améliore l'absorption des fréquences basses sans alourdir le panneau. C'est un excellent compromis esthétique/efficacité pour un bureau.</p>

      <h2>Stratégie de placement : La technique du Miroir</h2>
      <p>Inutile de couvrir 100% des murs (chambre anéchoïque). Il faut traiter les "Points de Première Réflexion".</p>
      <ol>
        <li>Asseyez-vous à votre poste.</li>
        <li>Demandez à un ami de déplacer un miroir le long du mur à votre droite.</li>
        <li>Quand vous voyez votre micro (ou enceinte) dans le miroir, c'est un point de réflexion primaire. Le son rebondit ici pour aller directement dans vos oreilles.</li>
        <li>Placez un panneau à cet endroit exact.</li>
        <li>Répétez à gauche et au plafond (Cloud).</li>
      </ol>
      <p>Avec seulement 4 à 6 panneaux bien placés, vous nettoyez 80% des problèmes d'écho.</p>
    `
  },
  {
    id: "6",
    slug: "stream-deck-guide",
    title: "Productivité Ultime : Le Guide Avancé du Stream Deck",
    category: "Productivité",
    readTime: "18 min",
    date: "05 Nov 2024",
    author: "Sarah Connors",
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=1200",
    intro: "Limiter le Stream Deck au changement de scènes OBS, c'est comme utiliser un smartphone juste pour téléphoner. C'est un contrôleur macro universel qui peut automatiser toute votre vie numérique.",
    relatedProducts: ["elgato-stream-deck-mk2", "elgato-stream-deck-plus", "elgato-stream-deck-pedal"],
    relatedCategorySlug: "streaming-gear",
    content: `
      <h2>La Philosophie de l'Automatisation (Low Friction)</h2>
      <p>La friction est l'ennemi de la créativité. Devoir faire ALT-TAB, ouvrir un dossier, chercher un fichier, ouvrir les paramètres son... tout ça brise le "Flow".</p>
      <p>Le <strong>Stream Deck</strong> sert à réduire cette friction à zéro. Une touche tactile LCD programmable permet de transformer une séquence complexe de 12 actions en une seule pression physique. Le retour visuel (l'icône change) confirme l'action, ce qui soulage la charge mentale.</p>

      <h2>Les Multi-Actions : La Killer Feature</h2>
      <p>Ne mappez pas juste "Lancer Photoshop". Créez une Multi-Action "Mode Création" :</p>
      <ol>
        <li>Lance Photoshop.</li>
        <li>Lance Spotify et joue la playlist "Deep Focus".</li>
        <li>Ferme Discord (pour ne pas être dérangé).</li>
        <li>Règle les lumières Philips Hue sur "Blanc Froid" (Concentration).</li>
        <li>Met le téléphone en "Ne pas déranger".</li>
      </ol>
      <p>Tout ça en un clic. C'est la puissance de l'outil.</p>

      <h2>Cas d'Usage 1 : Le Streamer Live</h2>
      <p>Au-delà des scènes OBS, utilisez les "Smart Profiles". Le Stream Deck détecte si vous êtes sur le bureau, en jeu ou sur Chrome, et change les touches automatiquement.</p>
      <ul>
        <li><strong>Bouton "Clip It" :</strong> Crée un clip des 30 dernières secondes sur Twitch, le télécharge, et le poste en brouillon sur Twitter.</li>
        <li><strong>Bouton "Pub" :</strong> Lance une pub de 3 minutes et coupe le micro.</li>
        <li><strong>Bouton "S.O.S" :</strong> Si le stream plante, un bouton pour tweeter "Crash, je reviens !" et changer la scène vers un écran technique.</li>
      </ul>

      <h2>Cas d'Usage 2 : Le Montage Vidéo (Premiere / DaVinci)</h2>
      <p>C'est ici que le gain de temps est le plus chiffrable. Avec des packs d'icônes (comme SideshowFX), vous transformez le Stream Deck en clavier de montage dédié.</p>
      <p>- Outils : Ripple Delete, Slip Tool, Nest Sequence. Accessibles sans torsion des doigts (CTRL+SHIFT+K).
      <br>- Macros : "Export Youtube" -> Ouvre la fenêtre d'export, sélectionne le preset H.264, nomme le fichier avec la date, et lance le rendu.</p>

      <h2>Le Stream Deck + : L'Ère Analogique</h2>
      <p>Le nouveau <strong>Stream Deck +</strong> ajoute des molettes (encodeurs rotatifs). C'est fondamental pour tout ce qui est graduel.</p>
      <p><strong>Le Mixage Audio (Wave Link) :</strong>
      <br>Au lieu de cliquer sur des sliders à la souris, vous tournez la molette physique pour baisser le son du jeu ou monter la musique. Vous avez une vraie table de mixage sous la main.</p>
      <p><strong>L'Étalonnage Couleur :</strong>
      <br>Dans DaVinci Resolve, utilisez les molettes pour régler le Lift, Gamma et Gain des couleurs. C'est beaucoup plus précis et organique que la souris.</p>

      <h2>Les Plugins Indispensables (App Store)</h2>
      <ul>
        <li><strong>BarRaider SuperMacro :</strong> Permet de simuler des mouvements de souris, des pressions de touches maintenues ou des lectures de texte.</li>
        <li><strong>HWInfo :</strong> Affiche la température CPU/GPU et la charge système en temps réel sur les touches.</li>
        <li><strong>Clock :</strong> Une horloge mondiale pour savoir quelle heure il est chez vos viewers au Québec.</li>
        <li><strong>Spotify / Apple Music :</strong> Contrôle total avec affichage de la pochette d'album.</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Le Stream Deck est le "Couteau Suisse" de l'informatique moderne. Que vous soyez trader, développeur, graphiste ou streamer, il permet de créer une interface de contrôle physique sur-mesure pour vos besoins logiciels.</p>
    `
  },

];

export const PATHWAYS: Pathway[] = [
  {
    id: "p1",
    slug: "audio-debutant",
    title: "Je débute en Audio",
    subtitle: "De la compréhension du signal à votre premier enregistrement.",
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=600",
    ctaCategory: "audio",
    steps: [
      {
        order: 1,
        title: "Comprendre la chaîne du son",
        desc: "La différence entre Micro, Préampli et Convertisseur.",
        articleSlug: "xlr-vs-usb"
      },
      {
        order: 2,
        title: "Traiter son environnement",
        desc: "Pourquoi votre chambre sonne comme une salle de bain (et comment régler ça).",
        articleSlug: "insonorisation"
      },
      {
        order: 3,
        title: "Choisir son premier micro",
        desc: "Dynamique ou Statique ? On vous guide selon votre voix.",
      }
    ]
  },
  {
    id: "p2",
    slug: "youtube-creator",
    title: "Je lance ma chaîne YouTube",
    subtitle: "L'image avant tout : lumière, cadrage et storytelling.",
    image: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&q=80&w=600",
    ctaCategory: "video",
    steps: [
      {
        order: 1,
        title: "L'éclairage 3 points",
        desc: "La base absolue pour ne pas ressembler à une vidéo de surveillance.",
        articleSlug: "eclairage-cinematique"
      },
      {
        order: 2,
        title: "Le son à l'image",
        desc: "Comment cacher son micro ou utiliser un micro canon (Shotgun).",
      }
    ]
  },
  {
    id: "p3",
    slug: "twitch-streamer",
    title: "Je veux streamer sur Twitch",
    subtitle: "Interagir en direct avec un setup fiable.",
    image: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&q=80&w=600",
    ctaCategory: "streaming",
    steps: [
      {
        order: 1,
        title: "Configurer OBS Studio",
        desc: "Scènes, Sources et Bitrate. Le setup technique.",
        articleSlug: "obs-studio-reglages"
      },
      {
        order: 2,
        title: "Gérer le son du PC et du Micro",
        desc: "Séparer les pistes pour ne pas avoir la musique sur la VOD.",
      },
      {
        order: 3,
        title: "L'automatisation",
        desc: "Gérer le live sans toucher au clavier.",
        articleSlug: "stream-deck-guide"
      }
    ]
  }
];

// Helper functions - UPDATED to match new types
export const getArticleBySlug = (slug: string) => ARTICLES.find(a => a.slug === slug);
export const getPathwayBySlug = (slug: string) => PATHWAYS.find(p => p.slug === slug);
// Simple helper to get latest articles
export const getLatestArticles = () => ARTICLES.slice(0, 3);