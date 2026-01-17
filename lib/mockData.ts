import { Product } from '../types/database';

const LOGOS = {
  amazon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  thomann: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Thomann_logo.png/640px-Thomann_logo.png",
  woodbrass: "https://upload.wikimedia.org/wikipedia/fr/b/bd/Logo-Woodbrass-Noir.png",
  ldlc: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Logo_LDLC.svg/1200px-Logo_LDLC.svg.png"
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Shure SM7B",
    slug: "shure-sm7b",
    brand: "Shure",
    price: 389,
    rating: 4.9,
    reviews: 1240,
    image_url: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=600",
    description: "Le micro légendaire pour la voix parlée et le podcast.",
    inStock: true,
    isPromo: false,
    category_id: "cat-audio-mics",
    badge: { text: "Best Seller", color: "bg-amber-100 text-amber-800 border-amber-200" },
    offers: [
      { merchant_name: "Thomann", merchant_logo_url: LOGOS.thomann, price: 389, currency: "EUR", link: "https://www.thomann.de/fr/shure_sm7b.htm", in_stock: true },
      { merchant_name: "Amazon", merchant_logo_url: LOGOS.amazon, price: 395, currency: "EUR", link: "https://www.amazon.fr/dp/B0002E4Z8M", in_stock: true },
      { merchant_name: "Woodbrass", merchant_logo_url: LOGOS.woodbrass, price: 399, currency: "EUR", link: "https://www.woodbrass.com/micros-dynamiques-shure-sm7b-p25327.html", in_stock: true }
    ],
    reviews_summary: {
      average_rating: 4.9,
      total_reviews: 1240,
      pros: ["Isolation phonique exceptionnelle", "Qualité de construction increvable", "Réponse en fréquence neutre et chaude"],
      cons: ["Nécessite énormément de gain (60dB+)", "Poids important pour certains bras"],
      sentiment_summary: "Le standard absolu de l'industrie, plébiscité pour sa signature vocale unique mais exigeant une interface audio performante."
    }
  },
  {
    id: "p5",
    name: "Rode NT1 Signature Series",
    slug: "rode-nt1-signature",
    brand: "Rode",
    price: 159,
    rating: 4.8,
    reviews: 2100,
    image_url: "https://images.unsplash.com/photo-1583127389472-106b12a6479e?auto=format&fit=crop&q=80&w=600",
    description: "Microphone à condensateur large membrane ultra-silencieux.",
    inStock: true,
    category_id: "cat-audio-mics",
    badge: { text: "Studio Pick", color: "bg-primary/20 text-primary border-primary/30" },
    offers: [
      { merchant_name: "Thomann", merchant_logo_url: LOGOS.thomann, price: 159, currency: "EUR", link: "https://www.thomann.de/fr/rode_nt1_signature_series_black.htm", in_stock: true },
      { merchant_name: "Amazon", merchant_logo_url: LOGOS.amazon, price: 165, currency: "EUR", link: "https://www.amazon.fr/dp/B0CKN8F6RY", in_stock: true },
      { merchant_name: "Woodbrass", merchant_logo_url: LOGOS.woodbrass, price: 169, currency: "EUR", link: "https://www.woodbrass.com/micros-statiques-rode-nt1-signature-black-p376646.html", in_stock: true }
    ],
    reviews_summary: {
      average_rating: 4.8,
      total_reviews: 2100,
      pros: ["Bruit propre quasi inexistant (4dBA)", "Rendu des hautes fréquences cristallin", "Pack complet avec suspension"],
      cons: ["Capture tous les bruits de fond (sensibilité)", "Nécessite une pièce traitée"],
      sentiment_summary: "La meilleure porte d'entrée pour un son studio professionnel sans se ruiner."
    }
  },
  {
    id: "p6",
    name: "Logitech Brio 4K",
    slug: "logitech-brio-4k",
    brand: "Logitech",
    price: 139,
    rating: 4.5,
    reviews: 15400,
    image_url: "https://images.unsplash.com/photo-1626307411242-706f9d784196?auto=format&fit=crop&q=80&w=600",
    description: "La webcam 4K référence pour le streaming et les appels pro.",
    inStock: true,
    category_id: "cat-video-webcams",
    badge: { text: "Reference", color: "bg-blue-100 text-blue-800 border-blue-200" },
    offers: [
      { merchant_name: "Amazon", merchant_logo_url: LOGOS.amazon, price: 139, currency: "EUR", link: "https://www.amazon.fr/dp/B01N5UOYC4", in_stock: true },
      { merchant_name: "LDLC", merchant_logo_url: LOGOS.ldlc, price: 154, currency: "EUR", link: "https://www.ldlc.com/fiche/PB00224168.html", in_stock: true },
      { merchant_name: "Thomann", merchant_logo_url: LOGOS.thomann, price: 159, currency: "EUR", link: "https://www.thomann.de/fr/logitech_brio_4k_stream_edition.htm", in_stock: true }
    ],
    reviews_summary: {
      average_rating: 4.5,
      total_reviews: 15400,
      pros: ["Résolution 4K native", "Excellente gestion HDR", "Support Windows Hello"],
      cons: ["Autofocus parfois nerveux", "Logiciel G-Hub capricieux"],
      sentiment_summary: "Elle reste la reine des webcams pour ceux qui ne veulent pas investir dans un boîtier hybride."
    }
  },
  {
    id: "p2",
    name: "Sony ZV-E10",
    slug: "sony-zve10",
    brand: "Sony",
    price: 649,
    rating: 4.7,
    reviews: 850,
    image_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600",
    description: "La caméra hybride parfaite pour le vlogging et le streaming.",
    inStock: true,
    isPromo: true,
    category_id: "cat-video-cams",
    badge: { text: "Populaire", color: "bg-blue-100 text-blue-800 border-blue-200" },
    offers: [
      { merchant_name: "Amazon", merchant_logo_url: LOGOS.amazon, price: 649, currency: "EUR", link: "https://www.amazon.fr/dp/B099X8D7X2", in_stock: true },
      { merchant_name: "Miss Numérique", merchant_logo_url: "", price: 699, currency: "EUR", link: "https://www.missnumerique.com/sony-zv-e10-nu-noir-p-52564.html", in_stock: true },
      { merchant_name: "LDLC", merchant_logo_url: LOGOS.ldlc, price: 749, currency: "EUR", link: "https://www.ldlc.com/fiche/PB00450531.html", in_stock: true }
    ],
    reviews_summary: {
      average_rating: 4.7,
      total_reviews: 850,
      pros: ["Autofocus ultra-rapide", "Écran orientable", "Excellente gestion de la peau"],
      cons: ["Pas de stabilisation mécanique du capteur", "Autonomie de batterie limitée"],
      sentiment_summary: "La caméra au meilleur rapport qualité/prix pour débuter sur YouTube, malgré une stabilisation logicielle perfectible."
    }
  },
  {
    id: "p3",
    name: "Elgato Stream Deck MK.2",
    slug: "stream-deck-mk2",
    brand: "Elgato",
    price: 149,
    rating: 4.8,
    reviews: 3200,
    image_url: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=600",
    description: "15 touches LCD personnalisables pour contrôler votre setup.",
    inStock: true,
    isPromo: false,
    category_id: "cat-stream-control",
    badge: { text: "Indispensable", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    offers: [
      { merchant_name: "Amazon", merchant_logo_url: LOGOS.amazon, price: 149, currency: "EUR", link: "https://www.amazon.fr/dp/B09738CV2G", in_stock: true },
      { merchant_name: "LDLC", merchant_logo_url: LOGOS.ldlc, price: 169, currency: "EUR", link: "https://www.ldlc.com/fiche/PB00446755.html", in_stock: true },
      { merchant_name: "Thomann", merchant_logo_url: LOGOS.thomann, price: 155, currency: "EUR", link: "https://www.thomann.de/fr/elgato_stream_deck_mk2_black.htm", in_stock: true }
    ],
    reviews_summary: {
      average_rating: 4.8,
      total_reviews: 3200,
      pros: ["Écosystème logiciel imbattable", "Touches entièrement personnalisables", "Design sobre et robuste"],
      cons: ["Prix élevé pour un contrôleur", "Câble USB fixe (sur MK.1)"],
      sentiment_summary: "L'outil qui change radicalement la façon de travailler ou de streamer par sa simplicité et sa polyvalence."
    }
  },
  {
    id: "p4",
    name: "Focusrite Scarlett 2i2",
    slug: "scarlett-2i2",
    brand: "Focusrite",
    price: 159,
    rating: 4.6,
    reviews: 5000,
    image_url: "https://images.unsplash.com/photo-1598555909375-77636de2397a?auto=format&fit=crop&q=80&w=600",
    description: "L'interface audio la plus vendue au monde pour sa fiabilité.",
    inStock: true,
    isPromo: false,
    category_id: "cat-audio-interfaces",
    offers: [
      { merchant_name: "Thomann", merchant_logo_url: LOGOS.thomann, price: 159, currency: "EUR", link: "https://www.thomann.de/fr/focusrite_scarlett_2i2_3rd_gen.htm", in_stock: true },
      { merchant_name: "Amazon", merchant_logo_url: LOGOS.amazon, price: 162, currency: "EUR", link: "https://www.amazon.fr/dp/B07QR6Z1JB", in_stock: true },
      { merchant_name: "Woodbrass", merchant_logo_url: LOGOS.woodbrass, price: 165, currency: "EUR", link: "https://www.woodbrass.com/interfaces-audio-usb-focusrite-scarlett-2i2-3rd-gen-p297435.html", in_stock: true }
    ],
    reviews_summary: {
      average_rating: 4.6,
      total_reviews: 5000,
      pros: ["Préamplis transparents", "Mode 'Air' pour plus de clarté", "Plug & Play total"],
      cons: ["Drivers parfois instables sur Windows", "Gain un peu juste pour les micros difficiles"],
      sentiment_summary: "La porte d'entrée idéale dans le monde de l'audio pro, reconnue pour sa robustesse et sa simplicité d'utilisation."
    }
  }
];

export const getFeaturedProducts = () => MOCK_PRODUCTS.slice(0, 4);