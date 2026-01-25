
-- SQL UPDATE SCRIPT FOR BATCH 9 (PREMIUM DESCRIPTIONS)
-- Run this in your Supabase SQL Editor.

-- 1. MXL CR77
UPDATE products SET 
  description = 'Le MXL CR77 est un microphone de scène qui ne passe pas inaperçu. Avec son design noir chromé et sa grille en maille métallique, il évoque immédiatement les micros de rockabilly des années 50, mais avec une construction moderne et robuste. C''est un micro dynamique supercardioïde conçu pour les chanteurs qui veulent du style sans sacrifier le son. Sa sonorité est punchy et claire, capable de percer à travers un mix de groupe bruyant, tandis que sa suspension interne réduit les bruits de manipulation.',
  pros = to_jsonb(ARRAY['Look Vintage rockabilly incroyable', 'Construction "Heavy Duty" pour la scène', 'Bonne réjection du larsen']),
  cons = to_jsonb(ARRAY['Assez lourd (nécessite un bon pied)'])
WHERE id = '6925ca7a-3056-4c51-9d16-12262e7b15d5';

-- 2. Avantone CV-12
UPDATE products SET 
  description = 'Célèbre pour avoir été le micro principal de l''album "1989" de Taylor Swift, l''Avantone CV-12 est une preuve que les micros à lampe abordables peuvent rivaliser avec les légendes. Son design rouge cabernet est magnifique, mais c''est son son qui séduit : chaud, aéré et flatteur. Équipé d''une lampe 6072A de style vintage, il offre 9 directivités commutables via son alimentation externe, permettant une flexibilité totale en studio.',
  pros = to_jsonb(ARRAY['Le son "Taylor Swift" (Chaleur & Air)', 'Design rouge magnifique', '9 Directivités']),
  cons = to_jsonb(ARRAY['Suspension un peu fragile'])
WHERE id = 'a1ab79f3-42d0-4dff-bf2b-469ad217643b';

-- 3. Avantone CV-12 BLA (Black Lion Audio Mod)
UPDATE products SET 
  description = 'Le CV-12 BLA est le fruit d''une collaboration entre Avantone et les moddeurs de génie de Black Lion Audio. Ils ont pris le CV-12 standard et l''ont entièrement repensé de l''intérieur : nouvelle capsule style CK12 plus douce, transformateur de sortie Cinemag USA, et circuit optimisé. Le résultat est un micro qui conserve le caractère du CV-12 mais avec une réponse plus plate, des aigus plus soyeux et un médium plus défini. C''est une version "boutique" d''un classique moderne.',
  pros = to_jsonb(ARRAY['Modifications Black Lion Audio d''usine', 'Transformateur Cinemag USA', 'Son plus équilibré et pro']),
  cons = to_jsonb(ARRAY['Prix plus élevé que le standard'])
WHERE id = 'f6506977-8a55-47b8-9fb5-ebeaa0a7bcac';

-- 4. sE Electronics DM-1B
UPDATE products SET 
  description = 'Le sE Electronics DM-1B est un microphone dédié aux basses fréquences qui encaisse tout. Conçu spécialement pour la grosse caisse (kick) et les amplis basse, il peut supporter un niveau de pression acoustique hallucinant de 155dB ! Sa capsule cardioïde large membrane capture les sub-basses avec une précision chirurgicale, sans jamais "baver". Son corps en métal lourd et sa grille renforcée le rendent indestructible, parfait pour être jeté au fond d''une grosse caisse.',
  pros = to_jsonb(ARRAY['Encaisse 155dB SPL (!)', 'Son de basse massif et précis', 'Construction blindée']),
  cons = to_jsonb(ARRAY['Moins polyvalent (spécialisé basses)'])
WHERE id = '578f042b-d18e-4e4f-b99d-941847d430e4';

-- 5. sE Electronics DynaCaster DCM 3
UPDATE products SET 
  description = 'Le sE Electronics DynaCaster DCM3 est une solution élégante et robuste pour les podcasteurs. C''est un micro dynamique cardioïde passif qui offre ce son "broadcast" riche et présent dès la sortie de la boîte. Son atout majeur est son filtre anti-pop intégré ultra-efficace, qui élimine le besoin de bonnettes en mousse disgracieuses. Avec son bras articulé intégré, il s''installe proprement devant une caméra pour un look studio pro.',
  pros = to_jsonb(ARRAY['Design "Camera-Ready" propre', 'Filtre anti-pop interne excellent', 'Construction tout métal']),
  cons = to_jsonb(ARRAY['Niveau de sortie moyen (préampli correct requis)'])
WHERE id = 'c76acc8b-6187-42cf-af65-4cc2c4994279';

-- 6. sE Electronics DynaCaster DCM 8
UPDATE products SET 
  description = 'Le sE Electronics DynaCaster DCM8 est la version active et survitaminée du DCM3. Il intègre le célèbre préampli "Dynamite" de sE, offrant un gain massif de +30dB activable via l''alimentation fantôme. Fini les problèmes de niveau faible ! En plus, il propose des switchs d''égalisation à l''arrière pour sculpter votre voix (plus de basses, plus d''air) directement à la source. C''est le couteau suisse ultime du podcasteur exigeant.',
  pros = to_jsonb(ARRAY['Préampli Dynamite intégré (+30dB)', 'Switchs d''égalisation (Tone Shaping)', 'Isolation contre les chocs']),
  cons = to_jsonb(ARRAY['Nécessite une alimentation fantôme (pour le préampli)'])
WHERE id = '8490181b-a4c3-406c-8ba6-77a1619fc6ed';

-- 7. sE Electronics DynaCaster DCM6 (Version corrigée/consolidée)
UPDATE products SET 
  description = 'Le sE Electronics DCM6 (souvent une variante ou bundle du DCM3/8, ici traité comme modèle similaire) offre la même excellence de captation dynamique pour la voix parlée. Conçu pour rejeter les bruits de clavier et d''ordinateur grâce à sa directivité cardioïde serrée, il assure que votre voix reste le centre de l''attention. Sa réponse en fréquence est taillée pour l''intelligibilité, ce qui vous évite des heures de mixage.',
  pros = to_jsonb(ARRAY['Excellente réjection des bruits ambiants', 'Optimisé pour la voix parlée', 'Support pivotant intégré']),
  cons = to_jsonb(ARRAY['Moins de fonctionnalités que le DCM8'])
WHERE id = 'f627fde1-3f59-4ca0-aad8-0288208ccc66';

-- 8. Lauten Audio Eden LT-386
UPDATE products SET 
  description = 'Le Lauten Audio Eden LT-386 est un chef-d''œuvre d''ingénierie moderne. C''est un micro à lampe ultra-haut de gamme qui se définit par sa capacité à changer de personnalité. Grâce à son switch "Multi-Voicing", il offre trois circuits distincts : Forward (moderne et brillant), Neutral (plat et réaliste) et Gentle (chaud et vintage). C''est littéralement comme avoir trois micros de classe mondiale en un seul. Utilisé sur les plus grands albums, c''est un investissement pour la vie.',
  pros = to_jsonb(ARRAY['3 Micros en 1 (Multi-Voicing)', 'Son lampe haut de gamme', 'Filtres Kick/Vocal Shaper uniques']),
  cons = to_jsonb(ARRAY['Prix très élevé', 'Lourd'])
WHERE id = '4e77a8da-195d-4fca-9c67-87e70e44a49d';

-- 9. Antelope Audio Edge Solo
UPDATE products SET 
  description = 'L''Antelope Audio Edge Solo est la porte d''entrée dans l''écosystème de modélisation d''Antelope. C''est un micro à condensateur cardioïde de haute qualité, conçu avec une réponse ultra-plate pour servir de toile vierge. Couplé au logiciel inclus, il peut émuler 18 micros de légende (Neumann, AKG, etc.) en temps réel. Sa membrane dorée de 6 microns capture les transitoires avec précision. C''est l''outil idéal pour les producteurs modernes qui veulent une palette sonore infinie sans encombrer leur studio.',
  pros = to_jsonb(ARRAY['Émulation de 18 micros légendaires', 'Réponse ultra-linéaire', 'Excellent rapport qualité/prix']),
  cons = to_jsonb(ARRAY['Cardioïde uniquement (contrairement au Duo/Quadro)'])
WHERE id = '69ca4f5c-6ea4-4097-b8b0-4c84688ca3f4';

-- 10. Ehrlund EHR-M
UPDATE products SET 
  description = 'L''Ehrlund EHR-M est unique au monde. Il utilise la fameuse membrane triangulaire brevetée par Ehrlund, inspirée de la nanotechnologie. Cette forme géométrique élimine les résonances propres à la membrane, offrant un son d''une pureté et d''une transparence quasi effrayantes. Le niveau de bruit est si bas et la réponse si rapide qu''on a l''impression que le micro n''est pas là. C''est le choix des audiophiles et des ingénieurs classiques pour capturer la vérité absolue d''un instrument.',
  pros = to_jsonb(ARRAY['Membrane triangulaire sans résonance', 'Transparence absolue', 'Bruit de fond inaudible']),
  cons = to_jsonb(ARRAY['Révèle la moindre imperfection de la source'])
WHERE id = '8eb987de-aabe-4993-a510-fd9bdd9d4215';

-- 11. Telefunken ELA M 251E
UPDATE products SET 
  description = 'Le Telefunken ELA M 251E est sans doute le plus beau microphone jamais fabriqué, visuellement et scrupuleusement. C''est la réédition exacte, pièce par pièce, du modèle original des années 60. Il offre ce qu''on appelle "l''Air" : une brillance dans les aigus qui est douce, soyeuse et magique, impossible à obtenir avec un égaliseur. C''est le micro des voix principales sur les plus grands hits de l''histoire de la pop, de Whitney Houston à Adele. Un objet d''art sonore.',
  pros = to_jsonb(ARRAY['Le plus beau son vocal du monde', 'Fabrication historique exacte', 'Valeur de collection']),
  cons = to_jsonb(ARRAY['Prix d''une voiture neuve'])
WHERE id = 'da57a25a-d533-42d9-8cdf-a6fc4f480630';

-- 12. Apogee HypeMiC
UPDATE products SET 
  description = 'L''Apogee HypeMiC est le seul microphone USB qui intègre un véritable compresseur analogique de studio. Pas une simulation numérique, mais un vrai circuit de compression. Cela signifie que votre voix sonne "produite", "mixée" et "grosse" avant même d''entrer dans l''ordinateur. Idéal pour les chanteurs et podcasteurs qui ne veulent pas passer des heures à mixer. Avec la qualité de conversion légendaire d''Apogee, c''est un studio complet qui tient dans la poche.',
  pros = to_jsonb(ARRAY['Compresseur Analogique intégré (Unique !)', 'Conversion Apogee PureDIGITAL', 'Son "Hype" prêt à diffuser']),
  cons = to_jsonb(ARRAY['Micro USB (pas de XLR)'])
WHERE id = '2d4c74a9-e628-4f8a-b4c5-7b2629307fa9';

-- 13. RODE K2
UPDATE products SET 
  description = 'Le RØDE K2 est un autre tour de force de la marque australienne. C''est un micro à lampe premium qui offre une directivité variable en continu depuis son alimentation externe. Vous pouvez passer de l''Omni au Figure-8 en passant par le Cardioïde avec une fluidité totale. Son niveau de bruit de 10dBA est incroyablement bas pour un micro à lampe. Il offre un son riche, chaud et large, capable de rivaliser avec des micros coûtant trois fois son prix.',
  pros = to_jsonb(ARRAY['Directivité variable en continu', 'Son lampe riche et silencieux', 'Rapport qualité/prix exceptionnel']),
  cons = to_jsonb(ARRAY['Volumineux'])
WHERE id = '1db443fb-113a-4765-8dda-7d4533ba2446';

-- 14. Lewitt LCT 1040
UPDATE products SET 
  description = 'Le Lewitt LCT 1040 est un système de microphone révolutionnaire qui redéfinit le haut de gamme. Il combine un circuit à lampe ET un circuit FET dans le même corps, et vous permet de mélanger les deux à volonté ! De plus, son alimentation détachage propose 4 voicings de lampe différents (Clear, Warm, Dark, Saturated). C''est le micro ultime pour le sound designer ou le producteur qui veut avoir une palette de couleurs infinie sous la main sans changer de micro.',
  pros = to_jsonb(ARRAY['Mélange Tube/FET révolutionnaire', '4 Voicings de lampe', 'Télécommande détachable']),
  cons = to_jsonb(ARRAY['Système complexe et imposant'])
WHERE id = '3dfda4c9-4863-4c6d-8674-47027d0af03f';

-- 15. Lewitt LCT 240 PRO
UPDATE products SET 
  description = 'Le Lewitt LCT 240 PRO est le micro qui démocratise le "son Lewitt" : moderne, précis et cristallin. Conçu pour être un premier micro sérieux, il excelle par sa simplicité et sa capacité à encaisser de forts volumes. Contrairement aux micros d''entrée de gamme souvent boueux, le LCT 240 PRO offre des aigus très définis qui aident la voix à percer le mix instantanément. Son design compact et anguleux est immédiatement reconnaissable.',
  pros = to_jsonb(ARRAY['Son moderne et clair', 'Très facile à mixer', 'Compact et robuste']),
  cons = to_jsonb(ARRAY['Pas de pad ni de filtre sur le micro'])
WHERE id = 'fb05bc6a-5f29-4e60-9c56-be16f574b842';

-- 16. Lewitt LCT 240 PRO Vocal Set
UPDATE products SET 
  description = 'Ce set vocal Lewitt LCT 240 PRO inclut le microphone LCT 240 PRO blanc ou noir, accompagné de sa suspension dédiée LCT 40 SH. La suspension est essentielle pour isoler le micro des vibrations du sol et des bruits de pas, garantissant des prises de voix propres. C''est le pack de démarrage idéal pour le streamer ou le home-studiste qui veut un setup pro, esthétique et efficace dès le premier jour.',
  pros = to_jsonb(ARRAY['Pack complet avec suspension', 'Rapport qualité/prix excellent', 'Design moderne']),
  cons = to_jsonb(ARRAY['Mêmes limitations que le micro seul'])
WHERE id = '190a9fa6-299d-406f-927c-c5a9bf48127d';

-- 17. Lewitt LCT 440 PURE
UPDATE products SET 
  description = 'Le Lewitt LCT 440 PURE porte bien son nom. Il utilise la même capsule et le même circuit haut de gamme que les modèles prestige de la marque, mais dans un corps fixe cardioïde dépouillé de tout switch. Le résultat est une pureté de son exceptionnelle avec un bruit de fond quasi inexistant (7dB). C''est un micro qui capture exactement ce qu''il entend, avec une clarté et un détail dans les aigus qui ravissent les chanteurs modernes.',
  pros = to_jsonb(ARRAY['Son pur et détaillé', 'Capsule 1" haut de gamme', 'Bruit de fond minime']),
  cons = to_jsonb(ARRAY['Aucune option (Cardioïde pur)'])
WHERE id = '81422e7f-7da7-412e-9610-ff857104c7b8';

-- 18. Lewitt LCT 441 FLEX
UPDATE products SET 
  description = 'Le Lewitt LCT 441 FLEX est un tour de force technologique. Dans le même boîtier compact que le 440 PURE, Lewitt a réussi à intégrer 8 directivités différentes ! (Les 3 classiques + 5 intermédiaires). Cela en fait le micro large membrane le plus polyvalent de sa catégorie de taille. Vous pouvez expérimenter avec l''acoustique de votre pièce comme jamais auparavant. Livré avec suspension et filtre anti-pop magnétique, c''est un kit ultra-complet.',
  pros = to_jsonb(ARRAY['8 Directivités dans un format compact', 'Polyvalence extrême', 'Anti-pop magnétique inclus']),
  cons = to_jsonb(ARRAY['Boutons de sélection petits'])
WHERE id = '54f37e1f-7bfe-4076-8f01-bc9c7417f8d6';

-- 19. Lewitt LCT 441 FLEX B-Stock (Doublon traité comme normal)
UPDATE products SET 
  description = 'Profitez de la polyvalence incroyable du LCT 441 FLEX à prix réduit avec ce modèle B-Stock. Avec ses 8 directivités et son son cristallin, c''est une opportunité en or d''acquérir un outil de studio professionnel capable de tout enregistrer, de la voix intime à l''ambiance de salle complète, tout en bénéficiant de la qualité de fabrication autrichienne.',
  pros = to_jsonb(ARRAY['Prix réduit', '8 Directivités', 'Garantie Lewitt']),
  cons = to_jsonb(ARRAY['Emballage possiblement ouvert'])
WHERE id = '77ac3e3a-3091-4415-8840-b4cbab140c66';

-- 20. Lewitt LCT 540 S
UPDATE products SET 
  description = 'Le Lewitt LCT 540 S ("Subzero") est un exploit scientifique. C''est un microphone conçu pour avoir un bruit de fond inférieur au seuil de l''audition humaine. Oui, il est plus silencieux que le silence d''une pièce insonorisée. Cela permet de pousser les aigus et la compression au mixage de manière extrême sans jamais faire remonter de souffle. C''est le micro ultime pour les voix chuchotées, l''ASMR, et les textures sonores délicates.',
  pros = to_jsonb(ARRAY['Micro le plus silencieux du monde ("Subzero")', 'Détail extrême dans les aigus', 'Design et packaging premium']),
  cons = to_jsonb(ARRAY['Révèle les bruits de l''environnement (ordi, clim)'])
WHERE id = '46f331ae-1739-4a38-93dc-df095fdb7c4e';
