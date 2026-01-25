UPDATE products SET 
  description = 'Véritable condensateur de scène ultime, l''Audio-Technica AE 5100 est un microphone à condensateur cardioïde large membrane logé dans un corps de type crayon. C''est une prouesse d''ingénierie qui combine la transparence et la réponse rapide d''un petit diaphragme avec la richesse et le faible bruit d''un grand. Il est exceptionnel pour les overheads de batterie, les percussions, les guitares acoustiques et les chœurs. Sa capacité à encaisser de forts niveaux tout en gardant une pureté cristalline en fait un favori des ingénieurs du son live.',
  pros = to_jsonb(ARRAY['Qualité large membrane dans un corps fin', 'Transparence exceptionnelle', 'Idéal pour cymbales et acoustique']),
  cons = to_jsonb(ARRAY['Clip de micro spécifique (inclus)'])
WHERE id = '940e6109-d7dc-45c7-a5f2-6dd5d7cf61b3';

UPDATE products SET 
  description = 'Incarnant la lampe moderne, le Sontronics Aria est un microphone à lampe conçu spécifiquement pour la voix. Développé et testé avec l''aide de producteurs renommés comme Paul Epworth ou PJ Harvey, il vise à offrir ce son "déjà produit", soyeux et présent, riche en harmoniques. Il offre des graves solides et une légère bosse de présence très musicale qui aide la voix à flotter au-dessus du mix. C''est un micro qui donne de la confiance au chanteur.',
  pros = to_jsonb(ARRAY['Sonorité à lampe soyeuse', 'Conçu spécifiquement pour le chant', 'Alimentation externe incluse']),
  cons = to_jsonb(ARRAY['Uniquement cardioïde'])
WHERE id = '3c7a8c8e-7d3a-4e65-8e2f-8c47b9ef8025';

UPDATE products SET 
  description = 'Grand frère sérieux de la gamme, l''Audio-Technica AT2035 est l''évolution naturelle du célèbre AT2020. Il reprend la signature sonore équilibrée de son petit frère mais améliore tout le reste, offrant un bruit de fond réduit, une meilleure sensibilité et des fonctionnalités pro. Il intègre un filtre coupe-bas à 80Hz pour nettoyer les graves et un pad -10dB pour les sources bruyantes. Livré avec une suspension élastique, c''est le choix idéal pour un premier home-studio sérieux.',
  pros = to_jsonb(ARRAY['Rapport qualité/prix excellent', 'Filtre coupe-bas et Pad inclus', 'Suspension fournie']),
  cons = to_jsonb(ARRAY['Design un peu austère'])
WHERE id = '95443c5c-9111-4b0d-86ea-b935a6773641';

UPDATE products SET 
  description = 'Référence incontournable du home-studio, l''Audio-Technica AT2020 a défini ce que doit être un micro de studio abordable. Sa capsule légère offre une réponse en fréquence étendue et une excellente réponse aux transitoires, capturant les détails avec une clarté surprenante pour le prix. Que ce soit pour le chant, le podcast, ou la guitare folk, il délivre un son propre et moderne qui sert de base saine pour le mixage. Robuste comme un tank, c''est souvent le premier et le dernier micro que l''on achète.',
  pros = to_jsonb(ARRAY['Le standard de l''industrie à petit prix', 'Sonorité claire et détaillée', 'Robustesse légendaire']),
  cons = to_jsonb(ARRAY['Vendu sans suspension'])
WHERE id = '4ef7cf10-e340-41c6-9e21-7dc81d36ad78';

UPDATE products SET 
  description = 'Taillé pour le streaming next-gen, l''AT2020USB-X est la version modernisée et survitaminée du célèbre micro USB d''Audio-Technica. Conçu pour les créateurs de contenu, streamers et podcasters d''aujourd''hui, il intègre une conversion A/N haute résolution 24-bit/96kHz pour un son studio sans carte son. Il dispose d''un bouton mute tactile avec LED d''état rouge et bleu, d''une sortie casque directe sans latence et d''un mixage monitoring/PC intégré. C''est la solution tout-en-un élégante et performante.',
  pros = to_jsonb(ARRAY['Qualité 24-bit/96kHz', 'Bouton Mute tactile très pratique', 'Sortie casque directe']),
  cons = to_jsonb(ARRAY['Pied de bureau un peu léger'])
WHERE id = '7a0a8f7c-36dd-4bd8-8f44-6995e2cb9d8c';

UPDATE products SET 
  description = 'Véritable arme du podcaster, l''Audio-Technica AT2040 est un microphone dynamique hypercardioïde conçu spécifiquement pour la voix parlée en environnement non traité. Inspiré du légendaire BP40 de broadcast, il apporte ce son radio chaud et focus à un prix accessible. Sa directivité hypercardioïde rejette massivement les bruits ambiants comme le clavier ou l''écho de la pièce, tandis que sa suspension intégrée isole encore plus des vibrations. Branchez-le et parlez, vous avez instantanément une voix de radio.',
  pros = to_jsonb(ARRAY['Excellent rejet des bruits (Hypercardioïde)', 'Son ''Broadcast'' chaud', 'Look professionnel']),
  cons = to_jsonb(ARRAY['Niveau de sortie faible (préampli requis)'])
WHERE id = '77b03251-74f3-47df-941b-c37ebdb48f86';

UPDATE products SET 
  description = 'Solution de podcast plug & play ultime, l''AT2040USB combine la capsule dynamique broadcast de l''AT2040 avec une interface USB de haute qualité. C''est l''outil parfait pour les podcasters solo qui veulent un son pro sans acheter de matériel complexe. Grâce à sa directivité serrée, il ignore l''acoustique de votre chambre et se concentre uniquement sur votre voix, ce qui le rend idéal pour les environnements bruyants.',
  pros = to_jsonb(ARRAY['Rejet du bruit ambiant', 'Connexion USB-C directe', 'Sortie casque zéro latence']),
  cons = to_jsonb(ARRAY['Directivité exigeante (il faut rester dans l''axe)'])
WHERE id = '956bb790-d90c-4524-9f84-003781be9dd5';

UPDATE products SET 
  description = 'L''Audio-Technica AT4040 incarne la transparence absolue. C''est un microphone à condensateur large membrane sans transformateur, célèbre pour sa neutralité et son absence de coloration. Il ne flatte pas le son, il le capture tel qu''il est, avec une précision technique irréprochable. Techniquement supérieur, son circuit à faible bruit et sa capacité à encaisser de forts volumes le rendent aussi à l''aise sur une voix murmure que devant un ampli hurlant. C''est le micro couteau suisse haut de gamme par excellence.',
  pros = to_jsonb(ARRAY['Neutralité et réalisme', 'Bruit de fond inaudible', 'Encaisse tout']),
  cons = to_jsonb(ARRAY['Peut paraître clinique pour certains'])
WHERE id = 'b2fb187d-061b-4878-ac3b-f9cc386b64a3';

UPDATE products SET 
  description = 'Le vintage moderne par excellence, l''AT4047 MP Multi-Pattern est la réponse d''Audio-Technica aux micros FET vintage des années 70. Avec sa sortie couplée par transformateur, il offre une sonorité chaude, riche et charnue qui rappelle les classiques U47 FET. Sa grande versatilité grâce à ses trois directivités commutables en fait un outil de studio complet. Il excelle sur les voix rock, les grosses caisses et les amplis basse, apportant du poids et de l''autorité.',
  pros = to_jsonb(ARRAY['Son chaud et vintage (Transformateur)', '3 Directivités commutables', 'Construction haut de gamme']),
  cons = to_jsonb(ARRAY['Prix élevé'])
WHERE id = '24717ab2-2cf7-45e5-9a38-3bf753425bb6';

UPDATE products SET 
  description = 'L''Audio-Technica AT5045 est une innovation rectangulaire qui révolutionne la prise de son. C''est un microphone à condensateur à membrane rectangulaire, une géométrie unique offrant la plus grande surface de captation possible dans un corps compact, alliant la réponse transitoire d''un petit diaphragme à la profondeur d''un grand. Le résultat est un son d''une pureté et d''un réalisme époustouflants avec un bruit de fond quasi inexistant. C''est l''outil ultime pour les instruments acoustiques complexes comme le piano ou la guitare.',
  pros = to_jsonb(ARRAY['Technologie de capsule révolutionnaire', 'Réalisme absolu', 'Format compact unique']),
  cons = to_jsonb(ARRAY['Très onéreux'])
WHERE id = '6d644f23-2f7a-4efa-ae66-8e5f01f21b76';

UPDATE products SET 
  description = 'Le Lauten Audio Atlantis FC-387 est un véritable caméléon sonore conçu pour être trois micros en un. Grâce à son sélecteur de voicing unique, il peut changer radicalement de personnalité, offrant un mode Forward ouvert et moderne, un mode Neutral plat et réaliste, et un mode Gentle sombre et rond pour calmer les sources agressives. C''est l''investissement intelligent qui vous évite d''acheter trois micros différents car l''Atlantis s''adapte à la source, que ce soit pour adoucir une voix trop sibilante ou éclaircir une guitare terne.',
  pros = to_jsonb(ARRAY['3 Voicings distincts (Forward, Neutral, Gentle)', 'Qualité de fabrication Lauten', 'Extrêmement polyvalent']),
  cons = to_jsonb(ARRAY['Corps massif et lourd'])
WHERE id = '7ab597cc-5b30-437f-a1bd-9cd06c776a2d';

UPDATE products SET 
  description = 'Offrant le meilleur des deux mondes, le Lewitt LCT 940 est un tour de force technologique qui intègre deux circuits complets, l''un à lampe pour la chaleur et les harmoniques, l''autre FET pour la précision et la clarté. Un potentiomètre permet de mixer continuement entre les deux pour sculpter votre son. Vous pouvez ainsi mélanger 30% de lampe pour réchauffer une voix tout en gardant l''attaque du FET. Ajoutez à cela 9 directivités et un écran de contrôle éclairé, et vous avez le micro le plus flexible du marché moderne.',
  pros = to_jsonb(ARRAY['Mixage continu Lampe / FET', '9 Directivités', 'Technologie de pointe']),
  cons = to_jsonb(ARRAY['Complexe à maîtriser'])
WHERE id = 'c0e8271f-7459-478c-a875-22bd8e2d8732';

UPDATE products SET 
  description = 'Il s''agit d''un modèle B-Stock du Lewitt LCT 940, une occasion en or. Cela signifie qu''il peut avoir de légères traces d''utilisation ou un emballage ouvert, mais il est techniquement 100% fonctionnel et bénéficie de la même garantie. Une opportunité rare d''accéder à ce monstre de technologie mélangeant lampe et FET à un prix réduit.',
  pros = to_jsonb(ARRAY['Prix réduit', 'Mêmes performances que le neuf', 'Garantie incluse']),
  cons = to_jsonb(ARRAY['Peut avoir des traces cosmétiques'])
WHERE id = 'a994ebb1-2ec4-42c5-96ac-fa7080c9ae5b';

UPDATE products SET 
  description = 'Véritable studio dans un USB, l''Antelope Axino Synergy Core n''est pas juste un micro. C''est un système d''enregistrement complet intégrant le moteur à modélisation d''Antelope qui peut émuler en temps réel le son de micros de légende et appliquer des effets de studio comme l''EQ ou le compresseur sans utiliser le processeur de votre ordinateur. Idéal pour les streamers pro, il offre à votre stream une qualité audio de studio avec des traitements vocaux en temps réel, s''imposant comme le micro USB le plus avancé technologiquement.',
  pros = to_jsonb(ARRAY['Modélisation de micros légendaires', 'Effets FPGA en temps réel', 'Qualité de conversion Antelope']),
  cons = to_jsonb(ARRAY['Uniquement USB'])
WHERE id = '0ee3113f-9213-4949-8f2a-b8f3627e9684';

UPDATE products SET 
  description = 'Le Behringer B-1 représente l''entrée de gamme sérieuse, souvent le premier amour des home-studistes au budget serré. Pour un prix modique, vous avez un véritable micro à condensateur large membrane, livré avec sa valise, sa suspension et sa bonnette. Malgré son prix, il offre un son très correct, un peu brillant ce qui aide les voix ternes, et dispose même d''un coupe-bas et d''un pad. C''est imbattable pour débuter sans se ruiner.',
  pros = to_jsonb(ARRAY['Prix défiant toute concurrence', 'Accessoires inclus (valise, suspension)', 'Son utilisable pour maquettes']),
  cons = to_jsonb(ARRAY['Aigus un peu agressifs', 'Bruit de fond moyen'])
WHERE id = '1a632c64-210d-41e9-a24c-c5f31b509438';

UPDATE products SET 
  description = 'Le classique en robe noire, cette édition spéciale Dark du célèbre Behringer B-1 est techniquement identique à l''original mais arbore une finition noire mate plus discrète. C''est un condensateur large membrane ultra-abordable, complet avec accessoires, idéal pour la vidéo où le micro ne doit pas attirer l''attention, ainsi que pour les podcasts débutants et les premières maquettes.',
  pros = to_jsonb(ARRAY['Finition noire discrète', 'Prix mini', 'Tout inclus']),
  cons = to_jsonb(ARRAY['Aigus parfois durs'])
WHERE id = '6f189e78-f6c0-4071-8e05-00356b54173c';

UPDATE products SET 
  description = 'Le Behringer BC 500 rend le broadcast accessible grâce à sa conception dynamique de studio pour la voix. Avec sa forme inspirée du mythique SM7B, il vise le marché du podcasting et de la radio. Sa capsule dynamique capture la voix avec chaleur et présence, tandis que sa directivité cardioïde minimise les bruits de la pièce. Une excellente alternative très économique pour lancer son émission avec une voix chaude.',
  pros = to_jsonb(ARRAY['Look pro', 'Sonorité chaude', 'Petit prix']),
  cons = to_jsonb(ARRAY['Support propriétaire'])
WHERE id = '8893363a-0059-4bae-81c0-bd3deb3da385';

UPDATE products SET 
  description = 'Le Neumann BCM 104 est la voix de la radio moderne, celui que vous voyez dans les studios les plus prestigieux. Contrairement au BCM 705 dynamique, le 104 est un condensateur à large membrane, offrant une clarté et un détail bien supérieurs. Conçu pour parler, il a une réponse optimisée pour la voix parlée avec une bosse de présence qui garantit une intelligibilité parfaite. Sa suspension interne et son filtre anti-pop intégré sont calibrés pour l''usage intensif en broadcast.',
  pros = to_jsonb(ARRAY['Le son Neumann optimisé broadcast', 'Anti-pop intégré ultra efficace', 'Design suspendu iconique']),
  cons = to_jsonb(ARRAY['Nécessite une alimentation fantôme'])
WHERE id = 'a6cf8dee-75a8-43f6-b869-0c2b3346dae0';

UPDATE products SET 
  description = 'Version Noir Mat du Neumann BCM 104, cette édition offre une discrétion absolue. Cette finition antireflet est particulièrement prisée pour les studios de radio filmés et les livestreams car elle évite les reflets des projecteurs. Côté performances, on retrouve toujours la même excellence avec la capsule à condensateur large membrane Neumann K04, optimisée pour une voix présente, riche et sans sifflantes agressives.',
  pros = to_jsonb(ARRAY['Finition noire anti-reflet', 'Son Neumann Broadcast', 'Technologie K04']),
  cons = to_jsonb(ARRAY['Prix premium'])
WHERE id = 'ca21467c-ecfe-42c7-9309-591b2617e493';

UPDATE products SET 
  description = 'Le Bock Audio 167 incarne le rêve américain d''une récréation moderne et sans compromis du légendaire U67 à lampe. David Bock a repoussé les limites en utilisant une lampe NOS EF732 et un transformateur Lundahl massif pour obtenir un son plus grand que nature. C''est l''opulence sonore absolue avec des graves onctueux, un médium crémeux et des aigus qui percent sans jamais agresser. Grâce à son sélecteur de mode Fat, il peut gonfler artificiellement les basses pour un son vocal énorme.',
  pros = to_jsonb(ARRAY['Récréation U67 améliorée', 'Switch ''Fat'' pour voix énormes', 'Fabrication USA haut de gamme']),
  cons = to_jsonb(ARRAY['Investissement majeur'])
WHERE id = 'c69c2c67-55ab-47cb-b7f0-993c1ce65a9a';
