
-- SQL UPDATE SCRIPT FOR BATCH 8 (PREMIUM DESCRIPTIONS)
-- Run this in your Supabase SQL Editor.

-- 1. Telefunken U-47
UPDATE products SET 
  description = 'Le Telefunken U47 est le Saint Graal des microphones, probablement le plus célèbre et le plus vénéré de l''histoire de la musique. Utilisé par Frank Sinatra, les Beatles et d''innombrables légendes, il définit le son de la voix pop moderne. Cette réédition fidèle utilise la lampe VF14K (remplaçant la VF14 introuvable) pour recréer cette magie : un bas-médium, gros, authoritaire, et des aigus soyeux qui n''ont jamais besoin d''égalisation. C''est le son de l''argent, un investissement patrimonial qui donne une crédibilité instantanée à n''importe quel studio.',
  pros = to_jsonb(ARRAY['Le son de la légende absolue', 'Fabrication main aux USA', 'Investissement studio ultime']),
  cons = to_jsonb(ARRAY['Prix astronomique', 'Très fragile'])
WHERE id = 'c0d35261-46b9-474f-8848-152af50f8032';

-- 2. Neumann U47 FET
UPDATE products SET 
  description = 'Le Neumann U47 FET est le successeur à transistor du légendaire U47 à lampe, sorti dans les années 70. Il a acquis sa propre légende, devenant le standard absolu pour l''enregistrement de la grosse caisse (kick drum) et des amplis basse grâce à sa capacité à encaisser des pressions sonores énormes sans saturer. Mais c''est aussi un micro vocal extraordinaire pour le rock et le rap, offrant un son plus rapide, plus punchy et plus "dans ta face" que la version à lampe. Un incontournable pour un son de batterie pro.',
  pros = to_jsonb(ARRAY['Standard mondial pour le Kick Drum', 'Son FET punchy et rapide', 'Encaisse des niveaux SPL énormes']),
  cons = to_jsonb(ARRAY['Moins "magique" que le U47 lampe sur les voix douces'])
WHERE id = '05589c29-b721-41c6-b55f-7c4372878d7e';

-- 3. Neumann U87 Ai
UPDATE products SET 
  description = 'Le Neumann U87 Ai est tout simplement le microphone de studio le plus répandu au monde. Si vous fermez les yeux et imaginez "le son d''un studio", c''est lui. Sa signature sonore est caractérisée par un médium présent et articulé qui fait ressortir n''importe quelle source dans un mix dense. C''est la référence absolue pour la voix off, le doublage et la pop. La version "Ai" moderne offre un niveau de sortie plus élevé et un bruit de fond plus faible que les modèles vintage.',
  pros = to_jsonb(ARRAY['Le standard incontesté de l''industrie', 'Valer sûre à la revente', 'Son "Radio" immédiat']),
  cons = to_jsonb(ARRAY['Prix élevé', 'Peut être un peu dur sur certaines voix'])
WHERE id = '0dec4ad3-6e68-4086-962e-bbdf8339f2e3';

-- 4. Neumann U87 Ai B-Stock
UPDATE products SET 
  description = 'Profitez de la légende Neumann à un prix réduit avec ce modèle U87 Ai B-Stock. Il s''agit d''un exemplaire retourné par un client ou ayant servi de démonstration, rigoureusement testé par Neumann pour garantir qu''il respecte les spécifications strictes de la marque. Il offre exactement le même son mythique que le modèle neuf, avec la garantie constructeur, mais avec une petite remise bienvenue pour votre budget studio.',
  pros = to_jsonb(ARRAY['Le son U87 moins cher', 'Garantie Neumann conservée', 'Excellente opportunité']),
  cons = to_jsonb(ARRAY['Traces d''utilisation possibles'])
WHERE id = '54723dd4-b4a5-4e35-b465-56fc0aaa11bf';

-- 5. Neumann U87 AI MT (Noir Mat)
UPDATE products SET 
  description = 'Le Neumann U87 Ai MT est la version noir mat du célèbre U87. Cette finition est particulièrement appréciée dans le monde du broadcast, de la télévision et du cinéma car elle ne reflète pas la lumière des projecteurs. Techniquement identique au modèle nickel, il offre ce médium caractéristique qui a fait la renommée de Neumann. C''est le choix de l''élégance discrète pour les studios qui filment leurs sessions.',
  pros = to_jsonb(ARRAY['Finition Noir Mat discrète (anti-reflet)', 'Standard Broadcast/TV', 'Son U87 légendaire']),
  cons = to_jsonb(ARRAY['Aucun (c''est un U87)'])
WHERE id = '79ff2402-7c7e-4e0d-80a3-c99b1c3eb7db';

-- 6. Neumann U89 I
UPDATE products SET 
  description = 'Le Neumann U89 I est souvent le secret le mieux gardé des ingénieurs du son. Bien qu''il ressemble au U87, il est techniquement supérieur et plus polyvalent grâce à sa capsule plus petite mais plus linéaire et ses 5 directivités. C''est un micro beaucoup plus neutre et transparent que le U87. Si le U87 "fabrique" un son, le U89 capture la réalité avec une précision chirurgicale. Il est exceptionnel pour la musique classique, les cordes et les pianos.',
  pros = to_jsonb(ARRAY['5 Directivités', 'Plus neutre et linéaire que le U87', 'Polyvalence extrême']),
  cons = to_jsonb(ARRAY['Moins "flatteur" que le U87'])
WHERE id = '1e262212-8a3e-4e38-96e4-625e9a6ce53d';

-- 7. Neumann U89 I mt (Noir Mat)
UPDATE products SET 
  description = 'Version noir mat du U89 I, ce microphone est l''outil de précision par excellence pour les captures d''orchestres ou de scènes acoustiques complexes où la discrétion visuelle est requise. Sa réponse hors-axe est exemplaire, ce qui signifie que même les sons venant des côtés sont capturés sans coloration étrange. C''est le micro des puristes qui recherchent la fidélité absolue avant tout.',
  pros = to_jsonb(ARRAY['Finition Noir Mat', '5 Directivités', 'Précision et neutralité allemandes']),
  cons = to_jsonb(ARRAY['Prix élevé'])
WHERE id = 'd63630bb-fcbd-4397-9fdd-ca76fade3ce5';

-- 8. Microtech Gefell UM 92.1 S
UPDATE products SET 
  description = 'Le Microtech Gefell UM 92.1 S est un voyage dans le temps. Fabriqué dans l''ancienne usine Neumann de l''Est, il utilise la légendaire capsule M7 originale en PVC (la même que dans les U47 vintage), combinée à un circuit à lampe EF86. Le résultat est un son d''une richesse harmonique inouïe, crémeux et plein, avec une présence qui ne nécessite aucun artifice. C''est pour beaucoup le véritable héritier spirituel du son Neumann vintage.',
  pros = to_jsonb(ARRAY['Capsule M7 PVC authentique', 'Son lampe riche et organique', '3 Directivités']),
  cons = to_jsonb(ARRAY['Suspension à élastiques un peu datée'])
WHERE id = '3133272e-1a97-4070-88d8-e0a8eb6aeb30';

-- 9. Microtech Gefell UMT 70 S Satin Nickel (Doublon traité, mais mis à jour)
UPDATE products SET 
  description = 'Le Microtech Gefell UMT 70 S est un classique moderne. Il marie la capsule M7 légendaire à un circuit FET sans transformateur ultra-propre. Cela donne un micro qui a le "grain" de la capsule vintage mais avec le silence et la dynamique d''un micro moderne. C''est un outil fantastique pour ceux qui veulent la couleur M7 sans les contraintes de maintenance des micros à lampe. Sa directivité est commutable pour plus de flexibilité.',
  pros = to_jsonb(ARRAY['Capsule M7 mythique', 'Circuit moderne silencieux', 'Polyvalence 3 directivités']),
  cons = to_jsonb(ARRAY['Design très classique'])
WHERE id = 'cb4469d0-bd39-4554-bbdc-0367b884e5d7';

-- 10. Neumann USM 69 i
UPDATE products SET 
  description = 'Le Neumann USM 69 i est un monstre de stéréophonie. C''est un microphone stéréo intégrant deux capsules de type U87 superposées et rotatives. Il permet de réaliser toutes les techniques de prise de son stéréo (XY, MS, Blumlein) avec un seul pied et une cohérence de phase absolue. C''est l''arme ultime pour enregistrer un piano à queue, une chorale, ou une ambiance de salle de concert avec la signature sonore Neumann.',
  pros = to_jsonb(ARRAY['Stéréo One-Point parfaite', 'Deux capsules type U87 indépendantes', 'Rotation de la tête supérieure']),
  cons = to_jsonb(ARRAY['Prix très élevé', 'Nécessite un pied lourd'])
WHERE id = '5b620486-672a-4b90-8cb5-511bbacbbc60';

-- 11. Neumann USM 69 i mt (Noir Mat)
UPDATE products SET 
  description = 'Version noir mat du célèbre microphone stéréo USM 69 i. Sa finition non réfléchissante le rend parfait pour les captations en direct, les opéras et les plateaux TV. Il offre la même flexibilité incroyable avec ses 5 directivités sélectionnables indépendamment pour chaque capsule. Vous pouvez par exemple mettre la capsule du bas en omni et celle du haut en cardioïde pour des expérimentations spatiales uniques.',
  pros = to_jsonb(ARRAY['Finition Noir Mat discrète', 'Flexibilité stéréo totale', 'Son Neumann double canal']),
  cons = to_jsonb(ARRAY['Lourd'])
WHERE id = '2efa0b2c-0069-4e0e-91e9-f9f9118a53cf';

-- 12. MXL V67G
UPDATE products SET 
  description = 'Le MXL V67G, avec son corps vert et sa grille dorée, est un hommage visuel et sonore aux micros vintage. Conçu pour apporter la chaleur des micros à lampe à un prix défiant toute concurrence, il utilise un circuit FET de classe A et une sortie par transformateur. Ce transformateur ajoute une couleur riche et moelleuse aux médiums, ce qui le rend excellent pour grossir les voix un peu fines. C''est un des meilleurs rapports qualité/prix pour un premier micro "de caractère".',
  pros = to_jsonb(ARRAY['Son "Old School" chaud', 'Sortie à transformateur', 'Look vintage superbe']),
  cons = to_jsonb(ARRAY['Aigus un peu moins définis que les micros modernes'])
WHERE id = '96ec26d1-a159-4584-844c-256e98aa19da';

-- 13. MXL V67i
UPDATE products SET 
  description = 'Le MXL V67i est unique grâce à son concept de "Two Mics in One" (Deux micros en un). Il possède deux capsules différentes au dos l''une de l''autre, sélectionnables par un switch : une face offre un son chaud et vintage (Warm), l''autre un son brillant et aéré (Bright). C''est comme avoir deux micros distincts sur le pied, ce qui permet de tester instantanément ce qui convient le mieux au chanteur sans rien débrancher. Génial pour les home-studios polyvalents.',
  pros = to_jsonb(ARRAY['2 signatures sonores (Warm/Bright)', 'Double capsule innovante', 'Polyvalence maximale pour le prix']),
  cons = to_jsonb(ARRAY['Commutateur un peu difficile d''accès'])
WHERE id = 'ef7e0631-ddd5-40d1-8a74-7ef3b3745d12';

-- 14. MXL V69M
UPDATE products SET 
  description = 'Le MXL V69M est la preuve qu''on peut avoir un vrai son de lampe sans se ruiner. Utilisant une lampe 12AT7 et un câblage interne Mogami (le top du câble), il délivre un son riche, avec des médiums crémeux et des aigus doux. Il est livré avec tout le nécessaire : alimentation externe, suspension, câble Mogami et valise. C''est un excellent choix pour les voix hip-hop et R&B qui cherchent cette épaisseur caractéristique des tubes.',
  pros = to_jsonb(ARRAY['Vrai micro à lampe', 'Câblage interne Mogami', 'Kit complet premium']),
  cons = to_jsonb(ARRAY['Bruit de fond plus élevé qu''un FET'])
WHERE id = '871e9720-8927-4030-a86e-797646f421dd';

-- 15. MXL V87
UPDATE products SET 
  description = 'Le MXL V87 est conçu comme un micro FET à faible bruit et haute fidélité. Avec son corps massif chromé, il en impose. Son but est d''offrir un son large et neutre, capable de capturer les détails d''une guitare acoustique ou les nuances d''une voix sans coloration excessive. C''est un micro "solide" dans tous les sens du terme, offrant une alternative plus rock et directe aux modèles vintage colorés de la marque.',
  pros = to_jsonb(ARRAY['Son large et percutant', 'Faible distorsion', 'Corps chromé robuste']),
  cons = to_jsonb(ARRAY['Assez lourd'])
WHERE id = '3a095d25-a823-432e-8a6c-42ab59b90b4f';

-- 16. Warm Audio WA-14
UPDATE products SET 
  description = 'Le Warm Audio WA-14 est une récréation fidèle du légendaire AKG C414 EB avec sa capsule en laiton CK12 originale. Ce micro des années 70 est vénéré pour son son doux et soyeux, très différent des C414 modernes plus brillants. Warm Audio a recréé cette fameuse capsule "Lens Kondensator" et utilise un transformateur Cinemag US pour capturer cette magie. C''est le micro parfait si vous trouvez les micros modernes trop agressifs.',
  pros = to_jsonb(ARRAY['Le son C414 EB "Brass Capsule"', 'Douceur dans les aigus', 'Transformateur Cinemag USA']),
  cons = to_jsonb(ARRAY['Les switchs sont un peu plastiques'])
WHERE id = 'daf41d58-e0a3-4342-8adb-cc7fa0b53d34';

-- 17. Warm Audio WA-14SP (Stereo Pair)
UPDATE products SET 
  description = 'Cette paire stéréo de Warm Audio WA-14 offre deux micros appairés en usine pour une image stéréo parfaite. Ils permettent d''accéder au son mythique de la capsule CK12 Brass en stéréo. C''est le setup de rêve pour enregistrer des overheads de batterie soyeux (fini les cymbales agressives !) ou un piano à queue avec cette chaleur vintage des années 70.',
  pros = to_jsonb(ARRAY['Paire appairée séquentielle', 'Sonorité soyeuse ''Brass Capsule''', 'Kit stéréo complet avec barre']),
  cons = to_jsonb(ARRAY['Prix de la paire'])
WHERE id = '6458f1d1-2119-4034-ad55-82c4782df645';

-- 18. Warm Audio WA-251
UPDATE products SET 
  description = 'Le Warm Audio WA-251 vise le sommet : recréer le Telefunken ELA M 251E, l''un des micros les plus chers du monde. C''est un micro à lampe grand diaphragme qui offre des aigus d''une beauté et d''une ouverture incroyables, souvent décrits comme "aériens". Warm Audio utilise une capsule type CK12, un transformateur Cinemag et une lampe JJ 12AY7 pour approcher ce son de diva à un prix accessible au commun des mortels.',
  pros = to_jsonb(ARRAY['Le son 251 légendaire (Air)', 'Composants haut de gamme (Cinemag, polysyrène)', 'Idéal voix féminines']),
  cons = to_jsonb(ARRAY['Tube d''origine peut être amélioré'])
WHERE id = '945a3bdf-7577-4a46-885d-e5967d0b976f';

-- 19. Warm Audio WA-47
UPDATE products SET 
  description = 'Avec le WA-47, Warm Audio s''attaque au roi des micros : le Neumann U47. C''est un gros micro à lampe lourd et imposant qui délivre un son tout aussi massif. Il excelle dans les bas-médiums, donnant aux voix masculines cette autorité et cette "poitrine" caractéristiques des crooners. Utilisant une reproduction de la capsule K47 et un transformateur de sortie TAB-Funkenwerk, il offre 90% du son de l''original pour 10% du prix.',
  pros = to_jsonb(ARRAY['Son U47 massif et sombre', 'Transformateur TAB-Funkenwerk', '9 Directivités']),
  cons = to_jsonb(ARRAY['Très lourd et encombrant'])
WHERE id = 'e2a8b09a-cd95-4993-8b76-b79494a8a09b';

-- 20. Warm Audio WA-47F
UPDATE products SET 
  description = 'Le Warm Audio WA-47F est la réincarnation du U47 FET. C''est le micro "grosse caisse" par excellence. Il capture l''impact et le sub de la batterie comme aucun autre micro. Mais ne le cantonnez pas à ça : sur une voix rock ou métal criée, il est incroyable car il encaisse tout sans broncher et délivre un son prêt à être mixé. C''est le complément indispensable du WA-47 à lampe.',
  pros = to_jsonb(ARRAY['Réplique fidèle du U47 FET', 'Le roi du Kick Drum', 'Encaisse 147dB SPL']),
  cons = to_jsonb(ARRAY['Spécialisé (moins polyvalent que le WA-87)'])
WHERE id = 'cf6aebad-dfd7-4614-813f-7c1714744bfe';
