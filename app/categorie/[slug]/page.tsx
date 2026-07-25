import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { transformProduct } from "@/lib/transformers";
import { Product } from "@/types/database";
import Link from "next/link";
import Image from "next/image";
import { JsonLd } from "@/components/server/JsonLd";
import CategoryContent from "@/components/client/CategoryContent";

/* ─── IMAGE DE FOND PAR CATÉGORIE ───────────────────────────
   Grandes catégories → banner dédié
   Sous-catégories → banner du parent
────────────────────────────────────────────────────────────*/
const BANNER_MAP: Record<string, string> = {
  // Studio & Son
  audio:                  '/images/editorial/banner-studio-son.webp',
  'micros-dynamiques':    '/images/editorial/banner-studio-son.webp',
  'micros-condensateurs': '/images/editorial/banner-studio-son.webp',
  'micros-usb':           '/images/editorial/banner-studio-son.webp',
  'micros-shotgun':       '/images/editorial/banner-studio-son.webp',
  'cartes-son':           '/images/editorial/banner-studio-son.webp',
  'preamplis':            '/images/editorial/banner-studio-son.webp',
  'casques-studio':       '/images/editorial/banner-studio-son.webp',
  'enceintes':            '/images/editorial/banner-studio-son.webp',
  'bras-articules':       '/images/editorial/banner-studio-son.webp',
  'cable-xlr':            '/images/editorial/banner-studio-son.webp',
  'traitement-acoustique':'/images/editorial/banner-studio-son.webp',
  // Image & Lumière
  video:                  '/images/editorial/banner-image-lumiere.webp',
  'hybrides-mirrorless':  '/images/editorial/banner-image-lumiere.webp',
  'webcams-pro':          '/images/editorial/banner-image-lumiere.webp',
  'action-cams':          '/images/editorial/banner-image-lumiere.webp',
  'keylight':             '/images/editorial/banner-image-lumiere.webp',
  'softbox':              '/images/editorial/banner-image-lumiere.webp',
  'rgb-ambiance':         '/images/editorial/banner-image-lumiere.webp',
  'grand-angle':          '/images/editorial/banner-image-lumiere.webp',
  'zoom-polyvalent':      '/images/editorial/banner-image-lumiere.webp',
  // Streaming
  streaming:              '/images/editorial/banner-streaming.webp',
  'fonds-verts':          '/images/editorial/banner-streaming.webp',
  'teleprompteurs':       '/images/editorial/banner-streaming.webp',
  'cable-management':     '/images/editorial/banner-streaming.webp',
  'stream-deck':          '/images/editorial/banner-streaming.webp',
};

export const revalidate = 3600; // 1h ISR

/* ─── QUESTIONS PAR CATÉGORIE ────────────────────────────── */
type Question = { num: string; title: string; desc: string };

const CATEGORY_QUESTIONS: Record<string, Question[]> = {
  // ── AUDIO GÉNÉRAL
  audio: [
    { num: "01", title: "L'environnement",   desc: "Pièce traitée ou bruyante ? Votre acoustique détermine le type de micro — dynamique pour les espaces bruyants, condensateur pour les studios silencieux." },
    { num: "02", title: "La connectique",     desc: "USB pour la simplicité plug-and-play, XLR pour la qualité et l'évolutivité. L'interface audio fait le pont entre votre voix et l'ordinateur." },
    { num: "03", title: "L'usage",            desc: "Podcast, stream, chant ou voice-over ? Chaque cas impose un micro, une interface et un monitoring adaptés." },
    { num: "04", title: "La compatibilité",   desc: "Chaque élément est un maillon. Vérifiez que votre micro, interface et logiciel fonctionnent ensemble avant d'acheter." },
  ],
  // ── MICROS DYNAMIQUES
  "micros-dynamiques": [
    { num: "01", title: "L'environnement",   desc: "Les dynamiques excellent dans les espaces bruyants ou non traités. Leur directivité cardioïde rejette naturellement les sons ambiants." },
    { num: "02", title: "Le gain requis",     desc: "Un SM7B ou PodMic nécessite un préampli avec +60 dB de gain propre. Vérifiez votre interface — ou prévoyez un Cloudlifter." },
    { num: "03", title: "L'usage",            desc: "Podcast, stream gaming et voix radio : le dynamique est taillé pour ça. Sa robustesse en fait un allié de longue durée." },
    { num: "04", title: "La connectique",     desc: "Tous les dynamiques pro sont en XLR. Il vous faudra une interface audio ou un préampli en ligne pour les alimenter." },
  ],
  // ── MICROS CONDENSATEURS
  "micros-condensateurs": [
    { num: "01", title: "L'acoustique",       desc: "Les condensateurs captent avec précision — y compris les défauts de la pièce. Un traitement acoustique minimal est quasi-obligatoire." },
    { num: "02", title: "L'alimentation",     desc: "Les condensateurs requièrent une alimentation fantôme 48V fournie par votre interface. Vérifiez la compatibilité avant d'acheter." },
    { num: "03", title: "L'usage",            desc: "Chant, instruments, voice-over en studio : le condensateur est la référence pour sa réponse en fréquence étendue et ses détails." },
    { num: "04", title: "La fragilité",       desc: "Plus sensibles que les dynamiques aux chocs et à l'humidité. Prévoyez une bonnette et un bras articulé de qualité." },
  ],
  // ── MICROS USB
  "micros-usb": [
    { num: "01", title: "L'usage",            desc: "USB = plug-and-play. Idéal pour débuter sans interface audio, les podcasters occasionnels et le travail nomade." },
    { num: "02", title: "La qualité",         desc: "Les meilleurs micros USB approchent la qualité XLR. Cherchez une capsule large membrane et un convertisseur interne de qualité." },
    { num: "03", title: "Le monitoring",      desc: "Vérifiez que le micro propose un monitoring direct sans latence — indispensable pour enregistrer confortablement." },
    { num: "04", title: "L'évolution",        desc: "Si vous prévoyez de passer au XLR, le micro USB reste une belle entrée en matière avant d'investir dans une interface complète." },
  ],
  // ── MICROS SHOTGUN
  "micros-shotgun": [
    { num: "01", title: "L'utilisation",      desc: "Sur perche ou sur caméra ? Un shotgun sur caméra capte tout. Sur perche, il suit précisément la source et rejette les côtés." },
    { num: "02", title: "L'alimentation",     desc: "La plupart des shotguns exigent une alimentation : pile AA ou alimentation fantôme via la griffe de la caméra. Vérifiez avant d'acheter." },
    { num: "03", title: "L'environnement",    desc: "En extérieur, une bonnette anti-vent est indispensable. En intérieur, évitez les pièces trop réverbérantes — le shotgun capte tout." },
    { num: "04", title: "La portée",          desc: "Le shotgun n'est pas un micro longue portée. Distance idéale : 30 à 80 cm de la source. Au-delà, le son perd en clarté." },
  ],
  // ── INTERFACES AUDIO
  "cartes-son": [
    { num: "01", title: "Le nombre de voies", desc: "Solo ou duo ? 1 entrée pour le podcast seul, 2 entrées pour les interviews ou voix + instrument. Prévoyez large pour évoluer." },
    { num: "02", title: "Le gain",            desc: "Avec un micro dynamique, vérifiez que l'interface fournit au moins 60 dB de gain propre. En dessous, vous aurez du bruit de fond." },
    { num: "03", title: "Les convertisseurs", desc: "C'est ici que se joue la qualité sonore. Focusrite, Audient et UA offrent des convertisseurs 24 bits/96 kHz transparents et fiables." },
    { num: "04", title: "La connectivité",    desc: "USB-C, Thunderbolt ou USB-A : vérifiez la compatibilité avec votre ordinateur. Sur Mac M-series, privilégiez les interfaces avec drivers certifiés." },
  ],
  // ── PRÉAMPLIS
  "preamplis": [
    { num: "01", title: "Quel micro ?",       desc: "Les préamplis inline comme le Cloudlifter sont conçus pour les micros dynamiques XLR à faible sensibilité : SM7B, EV RE20, PodMic." },
    { num: "02", title: "Le gain manquant",   desc: "Si votre interface fournit moins de 60 dB propres, un préampli inline ajoute +20 à +25 dB sans bruit de fond supplémentaire." },
    { num: "03", title: "La transparence",    desc: "Un bon préampli est transparent : il amplifie sans colorer. Évitez les modèles bas de gamme qui ajoutent du souffle en amplification." },
    { num: "04", title: "Les alternatives",   desc: "Une interface avec bons préamplis (Audient Evo, UA Volt) peut suffire. Le Cloudlifter n'est utile que si le gain manque vraiment." },
  ],
  // ── CASQUES STUDIO
  "casques-studio": [
    { num: "01", title: "Ouvert ou fermé ?",  desc: "Fermé = isolation, idéal pour enregistrer. Ouvert = image sonore large et naturelle, recommandé pour le mixage en studio." },
    { num: "02", title: "L'impédance",        desc: "32 Ω : compatibles smartphones. 80–250 Ω : nécessitent une interface ou un ampli casque pour fonctionner à leur plein potentiel." },
    { num: "03", title: "La platitude",       desc: "Pour mixer, cherchez une réponse en fréquence plate. Les casques grand public boostent les basses — trompeurs pour le monitoring." },
    { num: "04", title: "Le confort",         desc: "Vous portez votre casque des heures. Vérifiez le rembourrage, la pression sur les oreilles et le poids avant toute autre chose." },
  ],
  // ── ENCEINTES
  "enceintes": [
    { num: "01", title: "La taille du woofer", desc: "5 pouces pour les petits espaces, 8 pouces pour les grandes pièces. Plus le woofer est grand, plus les basses sont restitués précisément." },
    { num: "02", title: "Le placement",        desc: "À hauteur d'oreilles, à 1–1,5m de vous, en triangle équilatéral. Un mauvais placement fausse complètement la perception du mixage." },
    { num: "03", title: "L'acoustique",        desc: "Des monitors de référence dans une pièce non traitée sonnent moins bien qu'un modèle modeste dans une pièce traitée. Traitez d'abord." },
    { num: "04", title: "Le budget",           desc: "Investissez dans le traitement acoustique avant d'acheter des enceintes très chères. La pièce compte autant que le matériel." },
  ],
  // ── BRAS ARTICULÉS
  "bras-articules": [
    { num: "01", title: "La charge max",      desc: "Vérifiez le poids de votre micro + filtre anti-pop. Un SM7B avec bonnette dépasse 800g — vérifiez la charge maximale du bras." },
    { num: "02", title: "La course",          desc: "Un bras avec grande course permet de positionner le micro partout sur le bureau. Mesurez votre espace avant d'acheter." },
    { num: "03", title: "Le montage",         desc: "Pince de bureau ou fixation grommet ? Le grommet est plus stable mais permanent. La pince convient pour la majorité des setups." },
    { num: "04", title: "Le bruit mécanique", desc: "Certains bras grincent lors des ajustements. Rode PSA1+ et Elgato Wave sont réputés pour leur silence en conditions de direct." },
  ],
  // ── CÂBLES XLR
  "cable-xlr": [
    { num: "01", title: "La longueur",        desc: "3m pour un setup bureau compact, 5m pour plus de liberté. Évitez les câbles trop longs — ils captent plus d'interférences." },
    { num: "02", title: "Le blindage",        desc: "Un câble XLR de qualité est symétrique et blindé. Cela élimine les interférences électromagnétiques des appareils voisins." },
    { num: "03", title: "Les connecteurs",    desc: "Neutrik est la référence pour les connecteurs XLR. Cherchez le logo Neutrik ou Rean pour la durabilité sur le long terme." },
    { num: "04", title: "Le rapport qualité/prix", desc: "À partir de 15–20€ pour un câble correct. Inutile de dépenser 100€ — la différence sonore est imperceptible au-dessus de 20€." },
  ],
  // ── TRAITEMENT ACOUSTIQUE
  "traitement-acoustique": [
    { num: "01", title: "Le problème à résoudre", desc: "Réverbération ou isolation ? Les mousses absorbantes traitent l'écho dans la pièce — elles n'empêchent pas le bruit extérieur d'entrer." },
    { num: "02", title: "La surface",         desc: "Traitez en priorité les premières réflexions (côtés et plafond autour du point d'écoute) avant de couvrir toutes les surfaces." },
    { num: "03", title: "Les bass traps",     desc: "Les basses s'accumulent dans les coins de la pièce. Des bass traps en laine minérale dans les angles améliorent significativement le son." },
    { num: "04", title: "Le DIY",             desc: "Des panneaux maison en laine de roche 10cm + tissu acoustique offrent souvent de meilleurs résultats qu'une mousse bas de gamme." },
  ],
  // ── VIDÉO GÉNÉRAL
  video: [
    { num: "01", title: "Le format",          desc: "Vlogging nomade, studio fixe ou live ? Le format détermine la liste du matériel — régie légère ou setup complet avec éclairage." },
    { num: "02", title: "Le capteur",         desc: "APS-C pour la mobilité et le budget, Plein Format pour la qualité en basse lumière. Vérifiez la compatibilité avec vos objectifs." },
    { num: "03", title: "L'éclairage",        desc: "Une bonne lumière avec une webcam modeste > une caméra pro mal éclairée. L'éclairage est le premier facteur de qualité visuelle." },
    { num: "04", title: "L'autofocus",        desc: "Pour les créateurs solos, l'AF suivi de sujet est indispensable. Sony, Canon et Panasonic excellent dans ce domaine." },
  ],
  // ── HYBRIDES MIRRORLESS
  "hybrides-mirrorless": [
    { num: "01", title: "Le format du capteur", desc: "APS-C : léger, économique, large choix d'objectifs. Plein Format : supérieur en basse lumière et bokeh, budget plus élevé." },
    { num: "02", title: "La stabilisation",   desc: "IBIS (capteur) ou OIS (objectif) ? Pour le vlogging sans gimbal, une stabilisation capteur 5 axes est un atout majeur." },
    { num: "03", title: "L'autofocus",        desc: "Sony A6xxx, Canon R50 et Fujifilm X-T50 proposent les meilleurs AF sujet/œil pour les créateurs solos. Décisif pour la vidéo." },
    { num: "04", title: "La surchauffe",      desc: "En streaming long ou tournage continu, certains hybrides surchauffent. Vérifiez les limites d'enregistrement avant de décider." },
  ],
  // ── WEBCAMS PRO
  "webcams-pro": [
    { num: "01", title: "La résolution",      desc: "1080p suffit pour la plupart des streams et appels vidéo. La 4K est utile uniquement si vous recadrez en post ou diffusez en 4K natif." },
    { num: "02", title: "Le champ de vision", desc: "Large angle pour les déplacements à l'écran, angle normal (65–78°) pour les plans serrés. Vérifiez si le FOV est ajustable." },
    { num: "03", title: "L'autofocus",        desc: "Les webcams bas de gamme ont souvent un AF lent et imprécis. L'Elgato Facecam Pro et Razer Kiyo Pro ont des AF de niveau caméra." },
    { num: "04", title: "L'éclairage",        desc: "Une bonne webcam avec bonne lumière > une webcam pro dans l'obscurité. Investissez dans l'éclairage avant la webcam la plus chère." },
  ],
  // ── ACTION CAMS
  "action-cams": [
    { num: "01", title: "La stabilisation",   desc: "HyperSmooth (GoPro), RockSteady (DJI), Horizon Lock : en conditions extrêmes, la stabilisation logicielle fait toute la différence." },
    { num: "02", title: "L'étanchéité",       desc: "Vérifiez le niveau IP. La GoPro Hero 13 est étanche à 10m sans boîtier. Pour la plongée, un boîtier spécifique reste recommandé." },
    { num: "03", title: "L'autonomie",        desc: "Les petits capteurs consomment beaucoup. Prévoyez des batteries supplémentaires — comptez 60 à 90 min par batterie en conditions normales." },
    { num: "04", title: "L'écosystème",       desc: "GoPro et DJI ont des accessoires de fixation propriétaires. Vérifiez la compatibilité avec vos accessoires avant de changer de marque." },
  ],
  // ── KEY LIGHTS
  "keylight": [
    { num: "01", title: "La puissance",       desc: "Pour 1m de distance : minimum 40W. Pour 2m : 80W+. La puissance compense la distance et permet de garder une lumière douce." },
    { num: "02", title: "La température",     desc: "2700K (chaud) pour l'ambiance studio, 5600K (lumière du jour) pour un rendu naturel. Les meilleures key lights couvrent 2500K–6500K." },
    { num: "03", title: "L'IRC",              desc: "L'Indice de Rendu des Couleurs doit dépasser 95 pour un rendu fidèle. En dessous de 90, les couleurs paraissent fausses à l'image." },
    { num: "04", title: "La diffusion",       desc: "Une source dure crée des ombres marquées. Ajoutez un diffuseur ou placez la lumière plus loin pour adoucir et flatter le sujet." },
  ],
  // ── SOFTBOX
  "softbox": [
    { num: "01", title: "La taille",          desc: "Plus la softbox est grande par rapport au sujet, plus la lumière est douce. 60x60cm pour les plans serrés, 80x120cm+ pour les plans larges." },
    { num: "02", title: "Le montage",         desc: "Vérifiez la compatibilité de la baïonnette avec vos montures flash ou LED. Le système Bowens est le plus universel du marché." },
    { num: "03", title: "Octabox vs rectangle", desc: "L'octabox donne un catch-light rond dans les yeux, plus naturel. La softbox rectangulaire simule une fenêtre — idéal pour les portraits." },
    { num: "04", title: "La distance",        desc: "Plus la softbox est proche, plus la lumière est douce. En YouTube/stream, 60–80cm est la distance idéale pour un éclairage flatteur." },
  ],
  // ── RGB & AMBIANCE
  "rgb-ambiance": [
    { num: "01", title: "L'usage",            desc: "Décoration, rétroéclairage écran, arrière-plan coloré ou lumière de contour ? Chaque cas correspond à un produit et un format différents." },
    { num: "02", title: "Le contrôle",        desc: "App dédiée, télécommande ou contrôleur physique ? Pour le streaming, un contrôle rapide via Stream Deck est un réel avantage." },
    { num: "03", title: "La synchronisation", desc: "Vérifiez la compatibilité écosystème : Philips Hue, Govee et Nanoleaf ne sont pas toujours interopérables entre eux." },
    { num: "04", title: "La qualité couleur", desc: "Les LED RGB + blanc restituent mieux les couleurs pures que les modèles RGB seuls. Un IRC élevé est un indicateur de qualité fiable." },
  ],
  // ── GRAND ANGLE
  "grand-angle": [
    { num: "01", title: "La focale",          desc: "Pour le vlogging : 10–18mm sur APS-C (équiv. 15–27mm FF). Une focale trop courte déforme les visages et les perspectives." },
    { num: "02", title: "La distorsion",      desc: "Les grands angles distordent. Vérifiez si l'objectif propose une correction en boîtier — important pour les vlogs face caméra." },
    { num: "03", title: "L'ouverture",        desc: "f/2.8 minimum pour de bonnes performances en basse lumière. f/1.8 ou f/2 pour obtenir du flou de fond même en grand angle." },
    { num: "04", title: "La compatibilité",   desc: "Vérifiez la monture : Sony E, Canon RF, Fujifilm X… Un adaptateur peut fonctionner mais peut dégrader les performances de l'autofocus." },
  ],
  // ── ZOOMS POLYVALENTS
  "zoom-polyvalent": [
    { num: "01", title: "La plage focale",    desc: "24–70mm couvre la majorité des situations. Le 18–135mm est le zoom de voyage universel sur APS-C — un seul objectif pour tout." },
    { num: "02", title: "L'ouverture",        desc: "f/2.8 constant = qualité, poids et prix élevés. Variable (f/3.5–5.6) = léger et économique mais limité en basse lumière au télé." },
    { num: "03", title: "La stabilisation",   desc: "Sans stabilisation optique, le IBIS du boîtier devient indispensable. Vérifiez si les deux systèmes se combinent (Dual IS)." },
    { num: "04", title: "L'usage vidéo",      desc: "Pour la vidéo, vérifiez le focus breathing (variation de champ lors de la mise au point). Les zooms haut de gamme excellent à ce niveau." },
  ],
  // ── STREAMING GÉNÉRAL
  streaming: [
    { num: "01", title: "Le format",          desc: "Gaming, talk show, just chatting, IRL ? Le format détermine la liste du matériel — régie légère ou setup complet avec multi-sources." },
    { num: "02", title: "La connexion",       desc: "L'upload est clé : minimum 10 Mbps pour le 1080p60. Préférez l'Ethernet au Wi-Fi pour la stabilité en direct." },
    { num: "03", title: "L'encodeur",         desc: "OBS avec encodage GPU (NVENC ou AMF) préserve les performances en jeu. Vérifiez que votre GPU supporte l'encodage matériel." },
    { num: "04", title: "L'audio",            desc: "Le son compte plus que l'image en streaming. Un bon micro et une bonne acoustique fidélisent davantage que la 4K." },
  ],
  // ── FONDS VERTS
  "fonds-verts": [
    { num: "01", title: "La taille",          desc: "La toile doit être 50–80cm plus large que vous de chaque côté et couvrir le sol pour éviter les débordements de chroma key." },
    { num: "02", title: "L'éclairage",        desc: "Le fond vert doit être éclairé uniformément, séparément du sujet. Les ombres sur le fond créent des artefacts difficiles à masquer." },
    { num: "03", title: "La distance",        desc: "Restez à minimum 1–1,5m du fond pour éviter la contamination de couleur verte sur vos vêtements et cheveux clairs." },
    { num: "04", title: "Le matériau",        desc: "Le tissu se froisse, le vinyle réfléchit. Le Muslin coton tendu ou le papier fond de studio sont les références pour un résultat propre." },
  ],
  // ── TÉLÉPROMPTEURS
  "teleprompteurs": [
    { num: "01", title: "La compatibilité",   desc: "Vérifiez la taille d'écran acceptée (iPad, smartphone, tablette) et la connexion (Bluetooth, USB ou Wi-Fi) avec votre app de prompter." },
    { num: "02", title: "La distance",        desc: "Un prompteur à 60–80cm de la caméra donne un regard naturel vers l'objectif. Au-delà, le regard se détache légèrement." },
    { num: "03", title: "Le logiciel",        desc: "PromptSmart, Teleprompter Premium ou CuePrompter sont les références. Vérifiez que le défilement automatique s'adapte à votre rythme." },
    { num: "04", title: "La transparence",    desc: "Un bon miroir de prompteur transmet 70% de la lumière à la caméra. En dessous, l'image scriptée devient trop sombre pour être lisible." },
  ],
  // ── CABLE MANAGEMENT
  "cable-management": [
    { num: "01", title: "L'inventaire",       desc: "Listez vos câbles : alimentation, HDMI, USB, XLR, Ethernet. Chaque type nécessite une gaine ou un chemin de câble adapté." },
    { num: "02", title: "Les longueurs",      desc: "Ne commandez pas au plus court — prévoyez 20–30cm de mou pour faciliter les branchements et éviter la tension sur les connecteurs." },
    { num: "03", title: "La fixation",        desc: "Velcro réutilisable > colliers plastique qui cisaillent les câbles. Les goulottes sous bureau maintiennent tout sans abîmer les câbles." },
    { num: "04", title: "L'évolution",        desc: "Votre setup évoluera. Privilégiez les solutions démontables plutôt que les passe-câbles définitifs — les fonds perforés sont idéaux." },
  ],
  // ── STREAM DECK
  "stream-deck": [
    { num: "01", title: "La taille",          desc: "Mini (6 touches) pour débuter, MK.2 (15 touches) pour les streamers actifs, XL (32 touches) pour les régies complexes multi-scenes." },
    { num: "02", title: "Les intégrations",   desc: "OBS, Streamlabs, Twitch, YouTube, Spotify, Hue — vérifiez les plugins disponibles pour votre logiciel et écosystème principal." },
    { num: "03", title: "Les profils",        desc: "Les profils multiples permettent de changer de page selon l'activité (gaming, podcast, réunion). Planifiez votre arborescence avant." },
    { num: "04", title: "Les alternatives",   desc: "Loupedeck Live, Tourbox et même l'app Stream Deck Mobile font un travail similaire. Le Stream Deck reste la référence pour les plugins." },
  ],
};

// Fallback générique
const DEFAULT_QUESTIONS: Question[] = [
  { num: "01", title: "L'environnement",    desc: "Votre espace de création conditionne tout votre choix de matériel. Évaluez d'abord votre pièce, votre mobilité et vos contraintes." },
  { num: "02", title: "La connectique",     desc: "Chaque composant doit s'intégrer dans votre chaîne existante. Vérifiez les entrées/sorties et la compatibilité avant d'acheter." },
  { num: "03", title: "L'usage principal",  desc: "Définissez votre usage prioritaire : live, enregistrement, vidéo ? Un matériel polyvalent mais moins spécialisé peut suffire." },
  { num: "04", title: "La durabilité",      desc: "Investissez dans des références éprouvées. Les marques reconnues (Shure, Sony, Elgato) offrent un SAV et une longévité supérieurs." },
];

// Category metadata dictionary (matches old SPA exactly)
const CATEGORY_METADATA: Record<string, { title: string; subtitle: string }> = {
    audio: { title: "Studio & Son", subtitle: "Tout l'équipement audio pour une qualité professionnelle." },
    video: { title: "Image & Lumière", subtitle: "Caméras, objectifs et éclairage pour sublimer vos contenus." },
    streaming: { title: "Streaming", subtitle: "Captation et régie pour le direct." },
    "micros-dynamiques": { title: "Micros Dynamiques", subtitle: "Robustesse et fiabilité pour la scène et le studio." },
    "micros-condensateurs": { title: "Micros Condensateurs", subtitle: "Précision et détails pour le studio (XLR)." },
    "micros-usb": { title: "Micros USB", subtitle: "La simplicité plug-and-play sans compromis." },
    "micros-shotgun": { title: "Micros Shotgun", subtitle: "Captation directionnelle pour la vidéo." },
    "cartes-son": { title: "Interfaces Audio", subtitle: "Le pont essentiel entre votre voix et l'ordinateur." },
    "preamplis": { title: "Préamplis & Cloudlifter", subtitle: "Boostez le gain de vos microphones dynamiques." },
    "casques-studio": { title: "Casques Studio", subtitle: "Entendez chaque détail de votre mixage." },
    "enceintes": { title: "Enceintes Monitoring", subtitle: "Écoute de référence pour votre mixage." },
    "bras-articules": { title: "Bras Articulés", subtitle: "Rode, Elgato et alternatives pour votre micro." },
    "cable-xlr": { title: "Câbles XLR", subtitle: "Connexions haute qualité pour votre studio." },
    "traitement-acoustique": { title: "Traitement Acoustique", subtitle: "Mousses et panneaux pour un son propre." },
    "hybrides-mirrorless": { title: "Hybrides Mirrorless", subtitle: "Sony Alpha, Canon R et plus." },
    "webcams-pro": { title: "Webcams Pro", subtitle: "Elgato Facecam, Razer et alternatives." },
    "action-cams": { title: "Action Cams", subtitle: "GoPro, DJI et caméras d'action." },
    "keylight": { title: "Key Lights", subtitle: "Lumière principale pour vos contenus." },
    "softbox": { title: "Softbox", subtitle: "Diffusion douce pour un éclairage flatteur." },
    "rgb-ambiance": { title: "RGB & Ambiance", subtitle: "Tubes LED, rubans et ambiance colorée." },
    "grand-angle": { title: "Objectifs Grand Angle", subtitle: "Pour le vlogging et les plans larges." },
    "zoom-polyvalent": { title: "Zooms Polyvalents", subtitle: "Objectifs tout terrain." },
    "fonds-verts": { title: "Fonds Verts", subtitle: "Incrustation propre pour vos streams." },
    "teleprompteurs": { title: "Téléprompteurs", subtitle: "Lisez vos scripts professionnellement." },
    "cable-management": { title: "Cable Management", subtitle: "Organisation de votre setup." },
    // "logiciels-apps": { title: "Logiciels & Apps", subtitle: "OBS, vMix, VoiceMod et plus." },
    // "design-overlays": { title: "Design & Overlays", subtitle: "Alertes, transitions, logos pour vos streams." },
    "stream-deck": { title: "Stream Deck", subtitle: "Contrôle total de votre régie." },
    // Problématiques (problem-based routes)
    "espace-bruyant": { title: "Espace Bruyant / Écho", subtitle: "Micros dynamiques, traitement acoustique et casques isolants pour dompter le bruit." },
    "plug-and-play": { title: "Setup Plug & Play", subtitle: "Micros USB, webcams et matériel prêt à l'emploi, sans interface ni câble XLR." },
    "petit-budget": { title: "Petit Budget — Moins de 150€", subtitle: "Les meilleurs rapports qualité-prix pour débuter sans se ruiner." },
    "createur-nomade": { title: "Créateur Nomade / IRL", subtitle: "Solutions sans fil, compactes et portables pour créer partout." },
};

// Vertical → sub-category mapping for fetching
const VERTICALS: Record<string, string[]> = {
    audio: [
        "micros-dynamiques", "micros-condensateurs", "micros-usb", "micros-shotgun",
        "cartes-son", "preamplis", "casques-studio", "enceintes",
        "bras-articules", "cable-xlr", "traitement-acoustique",
    ],
    video: [
        "hybrides-mirrorless", "webcams-pro", "action-cams",
        "keylight", "softbox", "rgb-ambiance",
        "grand-angle", "zoom-polyvalent",
    ],
    streaming: [
        "fonds-verts", "teleprompteurs", "cable-management",
        // "logiciels-apps", "design-overlays", 
        "stream-deck",
    ],
    // Problématiques (problem-based verticals)
    "espace-bruyant": [
        "micros-dynamiques", "traitement-acoustique", "casques-studio", "bras-articules",
    ],
    "plug-and-play": [
        "micros-usb", "webcams-pro", "stream-deck",
    ],
    "petit-budget": [
        "micros-usb", "micros-dynamiques", "cartes-son",
    ],
    "createur-nomade": [
        "micros-usb", "action-cams",
    ],
};

// Maximum price filter for problem-based routes (in euros)
const PRICE_CAPS: Record<string, number> = {
    "petit-budget": 250,
};

// Blacklisted categories for MVP (Hardware focus)
const CATEGORY_BLACKLIST = ["logiciels-apps", "design-overlays"];

async function getProducts(slug: string): Promise<Product[]> {
    if (CATEGORY_BLACKLIST.includes(slug)) return [];

    const supabase = createClient();

    // Check if it's a vertical or a direct category
    const subCategories = VERTICALS[slug];

    if (subCategories) {
        // Vertical: fetch all sub-categories
        const { data: categories } = await supabase
            .from("categories")
            .select("id")
            .in("slug", subCategories);

        if (!categories || categories.length === 0) return [];

        const categoryIds = categories.map((c) => c.id);
        const { data } = await supabase
            .from("products")
            .select("*, product_offers(*)")
            .in("category_id", categoryIds)
            .eq("is_active", true)
            .order("name");

        let products = (data || []).map((p: any) => transformProduct(p));

        // Apply price cap if defined for this route
        const priceCap = PRICE_CAPS[slug];
        if (priceCap) {
            products = products.filter((p) => p.price > 0 && p.price <= priceCap);
        }

        return products;
    }

    // Single category slug
    const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", slug)
        .single();

    if (!cat) return [];

    const { data } = await supabase
        .from("products")
        .select("*, product_offers(*)")
        .eq("category_id", cat.id)
        .eq("is_active", true)
        .order("name");

    return (data || []).map((p: any) => transformProduct(p));
}

export async function generateStaticParams() {
    return Object.keys(CATEGORY_METADATA).map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const meta = CATEGORY_METADATA[slug];
    const title = meta ? `${meta.title} — Comparateur de Prix` : "Catalogue";
    const rawDesc = meta
        ? `${meta.subtitle} Comparez les prix et trouvez les meilleures offres sur Fluxlab.`
        : "Explorez notre catalogue complet de matériel audio, vidéo et streaming.";
    const desc = rawDesc.length > 160
        ? rawDesc.substring(0, rawDesc.lastIndexOf(" ", 157)) + "…"
        : rawDesc;

    return {
        title,
        description: desc,
        alternates: { canonical: `https://fluxlab.fr/categorie/${slug}` },
        openGraph: { title, description: desc },
    };
}

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;

    const meta = CATEGORY_METADATA[slug];
    if (!meta) notFound();

    const products = await getProducts(slug);

    const title = meta.title;
    const subtitle = meta.subtitle;

    // JSON-LD ItemList for category
    const itemListSchema = products.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: title,
        numberOfItems: products.length,
        itemListElement: products.slice(0, 20).map((p: Product, idx: number) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: p.name,
            url: `https://fluxlab.fr/produit/${p.slug}`,
        })),
    } : null;

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: "https://fluxlab.fr" },
            { "@type": "ListItem", position: 2, name: title, item: `https://fluxlab.fr/categorie/${slug}` },
        ],
    };

    // Vertical parent slug for breadcrumb
    const parentVertical = ["audio", "video", "streaming"].includes(slug) ? null
        : Object.entries(VERTICALS).find(([, subs]) => (subs as string[]).includes(slug))?.[0] ?? null;
    const parentMeta = parentVertical ? CATEGORY_METADATA[parentVertical] : null;

    return (
        <>
            {itemListSchema && <JsonLd data={itemListSchema} />}
            <JsonLd data={breadcrumbSchema} />
            <div className="min-h-screen bg-background text-foreground">

                {/* ── HEADER BANDEROLE ─────────────────────── */}
                <header className="relative border-b border-border/40 overflow-hidden" style={{ minHeight: '185px', background: '#0A0A0A' }}>
                    {/* Image de fond */}
                    {BANNER_MAP[slug] && (
                        <Image
                            src={BANNER_MAP[slug]}
                            alt=""
                            fill
                            priority
                            className="object-cover object-center opacity-55"
                            sizes="100vw"
                        />
                    )}
                    {/* Gradient overlay — lisibilité du texte */}
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.25) 55%, rgba(10,10,10,0.05) 100%)' }} aria-hidden />
                    {/* Halo doré */}
                    <div className="absolute -top-10 right-[8%] w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(211,178,123,.18) 0%, transparent 65%)', filter: 'blur(35px)' }} aria-hidden />

                    <div className="relative z-10 max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-16 h-full flex flex-col justify-center pt-16 pb-8">

                        {/* Breadcrumb */}
                        <nav className="flex items-center gap-2 text-[11px] font-mono text-white/45 uppercase tracking-wider mb-4" aria-label="Fil d'ariane">
                            <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="m9 18 6-6-6-6"/></svg>
                            {parentMeta ? (
                                <>
                                    <Link href={`/categorie/${parentVertical}`} className="hover:text-primary transition-colors">{parentMeta.title}</Link>
                                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="m9 18 6-6-6-6"/></svg>
                                </>
                            ) : null}
                            <span className="text-white/70">{title}</span>
                        </nav>

                        {/* Titre + compteur sur une ligne */}
                        <div className="flex items-end justify-between gap-6 flex-wrap">
                            <div>
                                <h1 className="font-serif text-white text-[28px] sm:text-[36px] md:text-[48px] leading-[1.05] sm:leading-[1] tracking-tight">
                                    {title} <span className="italic text-primary">·</span>
                                </h1>
                                <p className="text-[14px] text-white/55 font-light mt-2 max-w-[560px] leading-snug">
                                    {subtitle}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* ── CONTENU : SIDEBAR + GRILLE ───────────── */}
                <main className="bg-background border-b border-border/40">
                    <CategoryContent
                        products={products}
                        slug={slug}
                        title={title}
                        subtitle={subtitle}
                    />
                </main>

                {/* ── BLOC ÉDITORIAL SEO ───────────────────── */}
                <section className="bg-secondary border-b border-border/40">
                    <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-16 py-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                        <div className="col-span-12 lg:col-span-5">
                            <p className="frame-label text-primary mb-5 flex items-center gap-3">
                                <span className="block w-8 h-px bg-primary" aria-hidden />
                                Mode d&apos;emploi
                            </p>
                            <h2 className="font-serif text-foreground text-[30px] sm:text-[40px] md:text-[52px] leading-[1.1] sm:leading-[1.05] tracking-tight mb-6">
                                Bien choisir<br />
                                votre matériel<br />
                                <span className="italic text-primary">en 4 questions.</span>
                            </h2>
                            <p className="text-[14px] text-foreground/65 leading-[1.7] font-light max-w-[420px]">
                                Ce qu&apos;il faut savoir avant d&apos;acheter — la chaîne audio et vidéo est un système complet, chaque composant en est un maillon.
                            </p>
                        </div>
                        <div className="col-span-12 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {(CATEGORY_QUESTIONS[slug] ?? DEFAULT_QUESTIONS).map(q => (
                                <div key={q.num}>
                                    <p className="frame-label text-primary mb-3">{q.num} · {q.title}</p>
                                    <p className="text-[14px] text-foreground/75 leading-[1.7] font-light">{q.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </div>
        </>
    );
}

