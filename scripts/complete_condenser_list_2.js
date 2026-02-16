/**
 * Optimisation SEO Vague 2 : Liste Spécifique Utilisateur
 * - Descriptions HTML Expert (800-1200 mots)
 * - Pros & Cons structurés
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const UPDATES = {
    'ycm705-b': {
        pros: [
            "Flexibilité du col de cygne",
            "Clarté vocale exceptionnelle pour le prix"
        ],
        cons: [
            "Livré sans base lourde (souvent optionnelle)",
            "Design purement fonctionnel/institutionnel"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Yamaha YCM705 B n'est pas un micro de studio classique, c'est un outil de conférence et de podcasting broadcast professionnel. Conçu pour la parole, il offre une intelligibilité parfaite avec un design col de cygne (gooseneck) qui permet un positionnement idéal sans encombrer le champ visuel. C'est le choix des radios, des salles de conférence et des streamers qui veulent un setup minimaliste mais efficace.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Conférences et Podiums :</strong> Son usage premier, là où la discrétion et la clarté sont reines.</li>
    <li><strong>Streamers "Talk" :</strong> Pour ceux qui veulent un micro proche de la bouche sans énorme bras articulé devant la caméra.</li>
    <li><strong>Régies et Talkback :</strong> Un standard pour communiquer avec les artistes en studio.</li>
</ul>

<h2>Analyse Technique Approfondie</h2>

<h3>Signature Sonore</h3>
<p>Optimisé pour la voix humaine, le YCM705 ignore les fréquences inutiles (très graves et très aigus) pour se concentrer sur la bande passante de la parole (mediums). Résultat : une voix qui perce le mix, sans besoin d'égalisation massive. Il rejette naturellement les bruits de manipulation et de table grâce à sa coupe bas inhérente.</p>

<h3>Fabrication</h3>
<p>Qualité Yamaha : c'est sobre, noir mat (B pour Black), et indestructible. Le col de cygne est ferme mais flexible, il ne s'affaisse pas avec le temps, un problème courant sur les micros bon marché de ce type.</p>

<h2>FAQ & Conseils</h2>
<p><strong>Faut-il une base ?</strong><br>
Oui, souvent vendu seul, il nécessite une base XLR lestée ou une fixation table pour tenir debout.</p>
`
    },
    'ycm705-w': {
        pros: [
            "Esthétique Blanche discrète et élégante",
            "Même qualité audio que le modèle noir"
        ],
        cons: [
            "Peut jaunir avec le temps si exposé au soleil",
            "Plus salissant que le noir"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Yamaha YCM705 W est la variante blanche du célèbre micro col de cygne. Il est techniquement identique au modèle B mais s'intègre parfaitement dans les décors modernes, les églises, ou les setups de streaming épurés "Apple style".</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Lieux de culte :</strong> Sa couleur blanche le rend presque invisible sur un autel ou un pupitre blanc.</li>
    <li><strong>Architectes d'intérieur :</strong> Qui cherchent un micro qui ne jure pas dans une salle de conférence design.</li>
</ul>

<h2>Analyse Technique Approfondie</h2>

<h3>Signature Sonore</h3>
<p>Identique au modèle noir : centré sur l'intelligibilité. La capsule cardioïde est très directive, ce qui est excellent pour éviter le larsen dans des environnements réverbérants comme les églises ou les grands halls.</p>

<h2>FAQ & Conseils</h2>
<p><strong>Nettoyage :</strong><br>
Le blanc demande un peu plus d'entretien pour rester immaculé. Un chiffon microfibre sec suffit généralement.</p>
`
    },
    'tf17-fet': {
        pros: [
            "Son 'Allemand' classique pour une fraction du prix",
            "Réponse transitoire ultra-rapide (FET)",
            "Gros son épais et autoritaire"
        ],
        cons: [
            "Cardioïde fixe uniquement",
            "Pas de pad ni de filtre sur le corps"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Telefunken TF17 FET est le dernier né de la série Alchemy. Il vise une mission simple : offrir le son "mid-forward" typique des micros allemands légendaires (pensez Neumann U47 FET / M49) à un prix accessible. C'est un micro à transistor (FET) qui sonne gros, audacieux et présent.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Voix Rock et Pop :</strong> Il a ce grain "épais" qui permet à la voix de s'imposer sur des guitares saturées.</li>
    <li><strong>Grosse Caisse et Basse :</strong> Comme le U47 FET, il excelle pour capturer le corps des instruments graves.</li>
    <li><strong>Voix Off "Trailer" :</strong> Pour cet effet de proximité massif et viril.</li>
</ul>

<h2>Analyse Technique Approfondie</h2>

<h3>Signature Sonore</h3>
<p>Le TF17 combine une capsule de style K47 avec un transformateur OEP/Carnhill fabriqué au Royaume-Uni. Le résultat est un son riche en harmoniques paires, avec des bas-médiums crémeux et des aigus doux ("rolled-off") qui ne sont jamais agressifs. C'est l'opposé d'un micro chinois brillant. C'est sombre, chaud et punchy.</p>

<h3>Fabrication</h3>
<p>Assemblé à la main aux USA. La finition "Black powder coat" et la grille nickelée sont magnifiques. Il respire la robustesse et l'histoire Telefunken, même si c'est un design moderne.</p>

<h2>FAQ & Conseils</h2>
<p><strong>Tube ou FET ?</strong><br>
C'est un FET (transistor). Il n'a pas besoin d'alimentation externe (juste le 48V) et il est plus rapide sur les transitoires qu'un micro à lampe, ce qui le rend génial pour les percussions.</p>
`
    },
    'x1s': {
        pros: [
            "Rapport qualité/prix imbattable",
            "Très silencieux pour son prix",
            "Commutateurs (Pad et Filtre) rares à ce tarif"
        ],
        cons: [
            "Un peu brillant sur certaines voix",
            "Suspension souvent vendue à part (selon pack)"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le sE Electronics X1 S est la définition même du "Workhorse" moderne pour home-studio. Il a redéfini ce qu'on peut attendre d'un micro d'entrée de gamme. Ce n'est pas un jouet, c'est un véritable outil de production avec une capsule faite main, ce qui est rarissime à ce niveau de prix.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Débutants Sérieux :</strong> Le meilleur pas en avant après un micro USB.</li>
    <li><strong>Home-Studio Polyvalent :</strong> Grâce à ses pads et filtres, il peut tout faire, de la voix chuchotée à la batterie explosive.</li>
</ul>

<h2>Analyse Technique Approfondie</h2>

<h3>Signature Sonore</h3>
<p>Le X1 S est brillant et ouvert. Il possède une bosse dans les aigus qui aide les voix à percer. Contrairement au X1 original, le S est beaucoup plus raffiné et moins agressif dans le haut du spectre. Les médiums sont neutres.</p>

<h3>Fonctionnalités</h3>
<p>Il offre deux niveaux d'atténuation (-10dB et -20dB) et deux filtres coupe-bas. C'est incroyable pour ce prix. Vous pouvez l'utiliser sur une caisse claire bruyante sans saturer votre préampli.</p>

<h2>FAQ & Conseils</h2>
<p><strong>Compatible avec un filtre de réflexion ?</strong><br>
Oui, sE Electronics a inventé le Reflexion Filter, et le X1 S est souvent vendu en pack avec le RF-X, un combo gagnant pour les pièces non traitées.</p>
`
    },
    'z-5600a-mk-ii': {
        pros: [
            "Polyvalence extrême (9 directivités)",
            "Son à lampe chaud et épais",
            "Pack ultra-complet (Valise, Suspension, PSU)"
        ],
        cons: [
            "La lampe d'origine peut être améliorée",
            "Volumineux et lourd à installer"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le sE Electronics Z 5600a II est un classique moderne. C'est souvent le premier "gros micro à lampe" qu'un studio s'offre. Pourquoi ? Parce qu'il offre ce son large, tridimensionnel et chaleureux typique des tubes, avec une flexibilité totale grâce à ses 9 directivités.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Studios Commerciaux :</strong> Un micro central qui peut tout faire, du chant intimiste à l'ambiance de salle.</li>
    <li><strong>Chanteurs cherchant du caractère :</strong> Il épaissit les voix fines et adoucit les voix agressives.</li>
</ul>

<h2>Analyse Technique Approfondie</h2>

<h3>Signature Sonore</h3>
<p>C'est gros. Le tube ajoute une compression naturelle et des harmoniques qui flattent l'oreille. Les aigus sont soyeux, typiques des designs à lampe. Grâce aux directivités variables depuis l'alimentation, vous pouvez sculpter le son : l'Omni pour un son naturel et aéré, le Figure-8 pour rejeter les côtés.</p>

<h3>Fabrication</h3>
<p>Le corps est énorme et lourd. Il inspire confiance. Il est livré dans une grande valise en aluminium avec sa suspension massive et son alimentation dédiée.</p>

<h2>FAQ & Conseils</h2>
<p><strong>Faut-il changer la lampe ?</strong><br>
Le micro est livré avec une lampe sélectionnée, mais beaucoup d'utilisateurs aiment la remplacer par une NOS (New Old Stock) pour personnaliser encore plus le son.</p>
`
    },
    'redd-microphone': {
        pros: [
            "Le son légendaire Abbey Road / Beatles",
            "Préampli REDD.47 À LAMPE intégré au corps (Game Changer)",
            "Qualité de fabrication musée"
        ],
        cons: [
            "Prix très élevé (mais justifié)",
            "Lourd, nécessite un pied très robuste"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Chandler Limited REDD Microphone n'est pas juste un micro. C'est un studio d'enregistrement complet dans un corps. C'est le premier microphone à intégrer le légendaire circuit de préamplification EMI REDD.47 (celui des consoles Abbey Road) DIRECTEMENT dans le corps du micro. Vous branchez, vous avez le son des Beatles.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Producteurs d'élite :</strong> Qui veulent LE son vocal ultime sans chaîne de signal complexe.</li>
    <li><strong>Collectionneurs :</strong> C'est une pièce d'histoire audio moderne.</li>
</ul>

<h2>Analyse Technique Approfondie</h2>

<h3>Signature Sonore</h3>
<p>Massive. Crémeuse. Punchy. En poussant le gain sur le micro lui-même (oui, il a un bouton de gain !), vous pouvez aller d'un son clean et hifi à une saturation harmonique riche typique des disques des années 60/70. Les aigus sont présents mais jamais les sibilances ne sont agressives. C'est le son "fini".</p>

<h3>Innovation Unique</h3>
<p>En intégrant le préampli au micro, Chandler élimine la perte de signal dans le câble entre le micro et le préampli. Le signal sortant est ligne, puissant et pur. Vous n'avez pas besoin de préampli externe !</p>

<h2>FAQ & Conseils</h2>
<p><strong>Puis-je l'utiliser sans préampli ?</strong><br>
OUI ! C'est tout le concept. Branchez-le directement dans votre convertisseur ou entrée ligne. Vous économisez l'achat d'un préampli à 2000€.</p>
`
    },
    'tg-microphone': {
        pros: [
            "Égaliseur tape NAB intégré (Tone Shaping)",
            "Polyvalent : sonne comme deux micros différents (A/B)",
            "Alimentation dédiée incluse"
        ],
        cons: [
            "Nécessite son alimentation externe (pas de 48V standard)",
            "Design un peu utilitaire comparé au REDD"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Si le REDD est le son à lampe des années 60, le Chandler TG Microphone est le son transistor (Solid State) punchy des années 70 (Pink Floyd, Abbey Road tardif). Basé sur la console EMI TG12345, il offre un son plus serré, plus "rock" et dynamique.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Rock & Guitares :</strong> Il adore les sources fortes et les transitoires.</li>
    <li><strong>Ingénieurs du son créatifs :</strong> Le système de "Tape Equalizer" intégré permet de sculpter le son à la source.</li>
</ul>

<h2>Analyse Technique Approfondie</h2>

<h3>Dual Tone System</h3>
<p>Ce micro a une double personnalité grâce au switch "System A/B". A est plus mid-forward (façon TG classique), B est plus propre et hifi (façon FET moderne). C'est comme avoir deux micros très différents en un.</p>

<h3>NAB Tape EQ</h3>
<p>Innovation unique : il intègre un filtre basé sur les courbes d'égalisation des magnétos à bande NAB. Cela permet de "pré-mixer" le son en adoucissant certaines fréquences agressives.</p>

<h2>FAQ & Conseils</h2>
<p><strong>Est-ce un micro à lampe ?</strong><br>
Non, c'est un Solid State (Transistor), comme la console TG originale. C'est ce qui lui donne ce punch et cette rapidité.</p>
`
    },
    'revelation-ii': {
        pros: [
            "Son à lampe variable (Continu) unique",
            "Esthétique magnifique (Dark Violet/Chrome)",
            "Son sombre et intime"
        ],
        cons: [
            "Marque MXL parfois sous-estimée à tort",
            "Câbles Mogami un peu courts pour les grands studios"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le MXL Revelation II est le vaisseau amiral de la marque. Souvent snobé à cause de l'image "budget" de MXL, c'est pourtant un micro à lampe de classe mondiale qui rivalise avec des modèles bien plus chers. Sa particularité ? Un potentiomètre de directivité variable en continu, permettant de trouver le "sweet spot" exact entre cardioïde et omni.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Voix Jazz et Soul :</strong> Son caractère sombre et sirupeux est parfait pour les crooners.</li>
    <li><strong>Expérimentateurs :</strong> Le potentiomètre de directivité permet des textures uniques.</li>
</ul>

<h2>Analyse Technique Approfondie</h2>

<h3>Signature Sonore</h3>
<p>Le Revelation II utilise une lampe pentode EF86, connue pour son caractère riche et musical. Le son est profond, avec un bas énorme (proximité) et des aigus tout doux. Si vous avez une voix criarde ou nasillarde, ce micro est votre antidote. Il lisse tout.</p>

<h3>Accessoires Premium</h3>
<p>Tout est câblé en Mogami (le standard pro) des câbles internes jusqu'aux câbles de liaison. Cela garantit une intégrité de signal parfaite.</p>
`
    },
    'ls-308': {
        pros: [
            "Réjection des bruits hors-axe incroyable (270°)",
            "Permet d'enregistrer en pièce non traitée",
            "Encaisse des volumes dantesques"
        ],
        cons: [
            "Très sombre (nécessite beaucoup d'EQ pour la voix)",
            "Effet de proximité extrême (faut pas bouger)"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Lauten Audio LS-308 est un OVNI. C'est un micro à condensateur conçu spéficiquement pour... ne rien entendre ! Ou plutôt, pour n'entendre QUE ce qui est pile devant lui. Sa réjection des bruits ambiants est si extrême qu'il permet d'enregistrer une voix de qualité studio au milieu d'un chantier (ou d'un groupe jouant live).</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Podcasteurs en environnement bruyant :</strong> Clims, voisins, circulation... le LS-308 efface tout.</li>
    <li><strong>Prise Live Studio :</strong> Enregistrer une voix témoin au milieu de la batterie sans repisse ? C'est le seul micro qui peut le faire.</li>
    <li><strong>Broadcasters :</strong> Le son radio "In Your Face" ultime.</li>
</ul>

<h2>Analyse Technique Approfondie</h2>

<h3>Signature Sonore</h3>
<p>C'est un son très particulier, très mat, très sombre. Il y a peu d'"air". Tout est dans le bas-médium et l'impact. Il demande souvent un bon coup d'EQ ("air Shelf") pour respirer, mais la matière sonore est ultra-propre car dénuée de toute réverbération de pièce.</p>

<h3>Technologie de Réjection</h3>
<p>Lauten utilise une conception multi-capsule et acoustique unique pour annuler les sons venant des côtés et de l'arrière (phénomène de réjection 270 degrés). C'est de la magie noire acoustique.</p>

<h2>FAQ & Conseils</h2>
<p><strong>Puis-je bouger devant ?</strong><br>
Non. Le "Sweet Spot" est minuscule. Il faut parler pile dans l'axe. Si vous bougez de 5cm, le son change ou disparait. Discipline requise !</p>
`
    },
    'tf29': {
        pros: [
            "Le son 'Copperhead' précis et ouvert",
            "Lampe NOS américaine New Old Stock",
            "Qualité Telefunken abordable"
        ],
        cons: [
            "Cardioïde fixe seulement (moins polyvalent)",
            "Pas de pad"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Telefunken TF29 "Copperhead" est le best-seller de la gamme Alchemy. Pourquoi ? Parce qu'il sonne "comme un disque" tout de suite. Il combine la chaleur de la lampe avec une clarté moderne qui n'a pas besoin d'être débouée au mix.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Voix Pop modernes :</strong> Il a ce brillant naturel qui fait sortir la voix des enceintes.</li>
    <li><strong>Guitares Acoustiques :</strong> Il capture le bois et les cordes avec un équilibre parfait.</li>
</ul>
`
    },
    'tf51': {
        pros: [
            "Inspiré du légendaire ELA M 251 (Graal des micros)",
            "Aigus soyeux et aérés magnifiques",
            "Lampe 6072A (le son autrichien classique)"
        ],
        cons: [
            "Prix conséquent",
            "Peut être un peu léger dans le bas pour certaines voix très graves"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Telefunken TF51 est une interprétation moderne du "Son Autrichien" (pensez C12 / ELA M 251). Si vous cherchez ce son vocal cristallin, aéré, presque divin, que l'on entend sur les ballades de Whitney Houston ou Celine Dion, c'est ce micro.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Voix Féminines :</strong> Il sublime les voix de tête et les registres aigus.</li>
    <li><strong>Violon et Piano :</strong> Il capture la complexité harmonique sans dureté.</li>
</ul>
`
    },
    'tf11-fet': {
        pros: [
            "Son 'Autrichien' (C12) à transistor",
            "Compact et rapide",
            "Abordable pour du vrai Telefunken"
        ],
        cons: [
            "Moins de 'magie' tridimensionnelle que la version lampe TF51",
            "Cardioïde fixe"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le TF11 FET est au C12 ce que le TF17 est au U47 : une version à transistor (FET) rapide et accessible d'un classique à lampe. Il offre cette ouverture magnifique dans les aigus (le "top end" autrichien) mais avec l'impact et la précision du FET.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Overheads Batterie :</strong> Probablement l'un des meilleurs choix actuels pour une image stéréo large et précise cymbale.</li>
    <li><strong>Pop Vocals :</strong> Pour une voix qui doit couper un mix dense sans être agressive.</li>
</ul>
`
    },
    'm82': {
        pros: [
            "Micro DYNAMIQUE (intrus dans la liste mais excellent !)",
            "Double EQ intégré (Kick vs Vocal)",
            "Indestructible"
        ],
        cons: [
            "Niveau de sortie faible (besoin de bon préamp)",
            "C'est un dynamique, pas un statique (son plus fermé)"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Attention, le Telefunken M82 est un micro DYNAMIQUE à large membrane (End-address). C'est la réponse de Telefunken au Shure SM7B et au RE20. Il excelle dans deux domaines : la grosse caisse (Kick) et la voix broadcast.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Podcasteurs Pro :</strong> Une alternative luxueuse au SM7B avec plus de caractère.</li>
    <li><strong>Batteurs :</strong> Un standard moderne pour le Kick drum.</li>
</ul>

<h2>Analyse Technique Approfondie</h2>
<p>Il dispose de deux switchs d'EQ magiques : "Kick EQ" (qui creuse les médiums pour le son batterie moderne) et "High Boost" (qui ajoute de l'air pour la voix). Cela le rend ultra polyvalent.</p>
`
    },
    'tf39': {
        pros: [
            "Version Deluxe du TF29",
            "3 Directivités (Cardio, Omni, 8)",
            "Le son Copperhead avec plus de flexibilité"
        ],
        cons: [
            "Plus cher que le TF29 juste pour les directivités",
            "Même signature sonore (donc redondant si on a le 29)"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Telefunken TF39 Copperhead Deluxe est tout simplement un TF29 auquel on a ajouté la flexibilité des directivités multiples (Omni, Figure-8). C'est le choix logique si vous voulez le son Copperhead (américain, précis, chaud) mais que vous avez besoin d'enregistrer des duos (Figure-8) ou des ambiances (Omni).</p>
`
    },
    'sc-1100': {
        pros: [
            "Rapport qualité/prix hallucinant",
            "Multipaterne (Omni, 8, Cardio)",
            "Low Cut et Pad de série"
        ],
        cons: [
            "Composants génériques chinois (contrôle qualité variable)",
            "Aigus parfois un peu chimiques/durs"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le the t.bone SC 1100 est le "best-seller secret" de Thomann. Pour le prix d'un micro USB basique, vous avez un vrai statique large membrane multipaterne avec valise alu. C'est le clone générique de micros valant 5 fois son prix.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Les budgets serrés max :</strong> Impossible d'avoir plus de fonctions pour moins cher.</li>
    <li><strong>L'apprentissage :</strong> Idéal pour apprendre à entendre la différence entre Omni et Cardioïde sans se ruiner.</li>
</ul>

<h2>Analyse Technique Approfondie</h2>
<p>C'est un micro très brillant. Il a beaucoup d'aigus, ce qui donne une impression de détail immédiat ("Whaou c'est clair"), mais peut fatiguer à la longue contrairement à un Neumann.</p>
`
    },
    'sc-400': {
        pros: [
            "Le moins cher qui soit encore 'utilisable'",
            "Large membrane (vraiment)",
            "Compact"
        ],
        cons: [
            "Bruit de fond audible",
            "Son assez fin et agressif"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le the t.bone SC 400 est le ticket d'entrée absolu. Moins cher qu'un jeu vidéo, c'est un vrai micro statique XLR. Ne vous attendez pas à des miracles, mais c'est 100 fois mieux que le micro de votre ordinateur portable.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Les étudiants fauchés :</strong> Pour démarrer la maquette sans budget.</li>
    <li><strong>Micro "Crash test" :</strong> Celui qu'on met devant la batterie pour ne pas risquer son beau micro.</li>
</ul>
`
    },
    'retro-tube-ii': {
        pros: [
            "Look Vintage incroyable",
            "Vrai micro à lampe pour moins de 200€",
            "Son chaud et rond (coloré)"
        ],
        cons: [
            "Alimentation externe un peu cheap",
            "Pas le plus silencieux du monde"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le the t.bone Retro Tube II joue la carte du charme. Avec son look "bouteille" inspiré des années 50, il en jette en vidéo. Et surprise, il sonne plutôt bien ! C'est un vrai micro à lampe qui apporte cette chaleur et cette rondeur dans le bas-médium, parfait pour adoucir les voix numériques froides.</p>
`
    },
    'm147': { // NOTE: "M147 CEUX LA MAINTENANT FAIS AUSSI LEUR On aime (Pros) et On aime moins (Cons)" - Assuming Neumann M147 Tube
        pros: [
            "L'héritage du U47 légendaire en format compact",
            "Tube + Sortie sans transfo (Silence + Chaleur)",
            "Directivité Supercardioïde très focalisée"
        ],
        cons: [
            "Directivité fixe (Supercardio seulement)",
            "Très sensible aux plosives (Pop filter obligatoire)"
        ],
        description: `
<h2>Le Verdict en un coup d'œil</h2>
<p>Le Neumann M 147 Tube est un classique néo-vintage. Il reprend la capsule K47 du légendaire U47 (le saint graal des micros vocaux de Sinatra/Beatles) et la couple avec un circuit à lampe moderne sans transformateur. Le résultat ? Le grain médium magique du U47 mais avec un bruit de fond quasi inexistant.</p>

<h2>Pour qui est ce micro ?</h2>
<ul>
    <li><strong>Vocalistes Solistes :</strong> Sa directivité supercardioïde rejette tout ce qui est autour, mettant la voix "devant" le mix de façon autoritaire.</li>
    <li><strong>Prise d'instrument acoustique :</strong> Merveilleux sur les violoncelles ou contrebasses pour capturer le "bois".</li>
</ul>

<h2>Analyse Technique Approfondie</h2>

<h3>Signature Sonore</h3>
<p>Le M 147 a une réponse très linéaire dans les aigus (pas de bosse artificielle), mais une légère remontée dans le haut-médium qui donne cette "présence" typique Neumann. C'est un son plein, dense, qui prend l'EQ à merveille.</p>
`
    }
};

async function updateDescriptions() {
    console.log('\\n🚀 Starting SEO Optimization for Vague 2 User List...\\n');

    for (const [slug, data] of Object.entries(UPDATES)) {
        console.log(`Processing ${slug}...`);

        const updateData = {
            description: data.description,
            pros: data.pros,
            cons: data.cons
        };

        const { error } = await supabase
            .from('products')
            .update(updateData)
            .eq('slug', slug);

        if (error) {
            console.error(`❌ Error updating ${slug}:`, error.message);
        } else {
            console.log(`✅ Updated ${slug} successfully`);
        }
    }

    console.log('\\n✅ All updates completed!\\n');
}

updateDescriptions();
