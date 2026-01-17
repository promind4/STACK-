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
  content: React.ReactNode; // HTML/JSX simulé pour le contenu riche
  relatedProducts: string[]; // IDs des produits cités
}

export interface Pathway {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  image: string; // Image d'illustration de la carte
  steps: {
    order: number;
    title: string;
    desc: string;
    articleSlug?: string; // Lien vers un article si existant
  }[];
  ctaCategory: string; // Lien vers la catégorie boutique finale
}

// --- MOCK DATA ---

export const ARTICLES: Article[] = [
  {
    id: "1",
    slug: "xlr-vs-usb",
    title: "XLR vs USB : Le duel définitif pour 2025",
    category: "Audio",
    readTime: "6 min",
    date: "12 Oct 2024",
    author: "L'IA Stackera",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=1200",
    intro: "C'est la question que tout le monde se pose au moment de lancer son podcast ou sa chaîne. Faut-il la simplicité du USB ou la robustesse du XLR ?",
    relatedProducts: ["Shure SM7B", "Elgato Wave:3", "Focusrite Scarlett 2i2"],
    content: `
      <h2>Le mythe de la complexité XLR</h2>
      <p>Pendant longtemps, le XLR était réservé aux ingénieurs du son. Il fallait une table de mixage, des câbles partout... Aujourd'hui, avec des interfaces comme la <strong>Scarlett 2i2</strong> ou le <strong>Elgato Wave XLR</strong>, c'est devenu presque aussi simple que du Plug & Play.</p>
      
      <h3>Pourquoi choisir l'USB ?</h3>
      <p>Si vous débutez et que vous voulez juste "brancher et parler", un micro comme le <strong>Elgato Wave:3</strong> est imbattable. Il intègre son propre préampli et convertisseur. C'est la solution tout-en-un idéale pour le streaming.</p>

      <h3>Pourquoi passer au XLR ?</h3>
      <p>Le XLR est un standard analogique. Cela signifie que votre micro (comme le légendaire <strong>Shure SM7B</strong>) peut durer 30 ans. Si vous voulez changer la "couleur" de votre son, vous changez juste l'interface, pas le micro.</p>

      <h2>Verdict</h2>
      <p>Prenez de l'USB pour le streaming pur et la simplicité. Prenez du XLR si vous visez une qualité studio broadcast et une évolutivité sur le long terme.</p>
    `
  },
  {
    id: "2",
    slug: "eclairage-cinematique",
    title: "Quel éclairage pour un visage cinématique ?",
    category: "Vidéo",
    readTime: "8 min",
    date: "28 Sep 2024",
    author: "L'IA Stackera",
    image: "https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?auto=format&fit=crop&q=80&w=1200",
    intro: "Avoir une caméra à 2000€ ne sert à rien si votre lumière est plate. Voici comment sculpter votre visage avec la technique Rembrandt.",
    relatedProducts: ["Elgato Key Light", "Aputure MC"],
    content: `
      <h2>La règle des 3 points</h2>
      <p>Tout éclairage pro repose sur trois sources :</p>
      <ul>
        <li><strong>Key Light :</strong> La source principale, à 45° de votre visage.</li>
        <li><strong>Fill Light :</strong> Pour déboucher les ombres de l'autre côté.</li>
        <li><strong>Back Light :</strong> Pour vous détacher du fond (aussi appelée Hair Light).</li>
      </ul>

      <h2>Softbox vs Panneaux LED</h2>
      <p>Pour un rendu cinématique, la lumière doit être DOUCE. C'est la taille de la source qui compte. Une petite LED fera des ombres dures. Une grande Softbox enroulera la lumière autour de vos traits.</p>
    `
  },
  {
    id: "3",
    slug: "obs-studio-reglages",
    title: "OBS Studio : Les réglages secrets",
    category: "Streaming",
    readTime: "12 min",
    date: "15 Nov 2024",
    author: "David Chen",
    image: "https://images.unsplash.com/photo-1560252829-804f1aedf1be?auto=format&fit=crop&q=80&w=1200",
    intro: "Votre stream pixelise dès que ça bouge ? Vous perdez des frames ? C'est sûrement une histoire de Bitrate et d'encodage.",
    relatedProducts: ["Elgato Stream Deck"],
    content: `
      <h2>CBR ou VBR ?</h2>
      <p>Pour le streaming (Twitch/YouTube Live), utilisez TOUJOURS le <strong>CBR (Constant Bitrate)</strong>. Cela garantit une stabilité du flux.</p>
      
      <h2>Quel Bitrate pour 1080p ?</h2>
      <p>Twitch recommande 6000 Kbps. Si vous avez une connexion fibre, n'hésitez pas à pousser à 7500-8000 pour YouTube qui gère mieux les hauts débits.</p>
    `
  },
  {
    id: "4",
    slug: "top-5-interfaces",
    title: "Top 5 des interfaces audio 2025",
    category: "Matériel",
    readTime: "5 min",
    date: "02 Jan 2025",
    author: "Alexandre Dupont",
    image: "https://images.unsplash.com/photo-1519508234439-4f23643125c1?auto=format&fit=crop&q=80&w=1200",
    intro: "Comparatif des préamplis les plus silencieux du marché sous la barre des 200€.",
    relatedProducts: ["Focusrite Scarlett 2i2", "Rodcaster Pro II"],
    content: "<p>Contenu en cours de rédaction...</p>"
  },
  {
    id: "5",
    slug: "insonorisation",
    title: "Insonoriser sa chambre pour moins de 100€",
    category: "Acoustique",
    readTime: "10 min",
    date: "10 Dec 2024",
    author: "L'IA Stackera",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1200",
    intro: "L'écho est le pire ennemi de votre micro. Voici comment traiter votre pièce sans coller de la mousse moche partout.",
    relatedProducts: [],
    content: "<p>Contenu en cours de rédaction...</p>"
  },
  {
    id: "6",
    slug: "stream-deck-guide",
    title: "Le guide ultime du Stream Deck",
    category: "Productivité",
    readTime: "7 min",
    date: "05 Nov 2024",
    author: "Sarah Connors",
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=1200",
    intro: "Bien plus qu'un gadget pour changer de scène. Apprenez à contrôler vos lumières, votre micro et vos tweets.",
    relatedProducts: ["Elgato Stream Deck"],
    content: "<p>Contenu en cours de rédaction...</p>"
  }
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

// Helper functions
export const getArticleBySlug = (slug: string) => ARTICLES.find(a => a.slug === slug);
export const getPathwayBySlug = (slug: string) => PATHWAYS.find(p => p.slug === slug);
export const getLatestArticles = () => ARTICLES.slice(0, 3);