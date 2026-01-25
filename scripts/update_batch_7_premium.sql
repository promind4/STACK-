
-- SQL UPDATE SCRIPT FOR BATCH 7 (PREMIUM DESCRIPTIONS)
-- Run this in your Supabase SQL Editor.

-- 1. t.bone SC 450
UPDATE products SET 
  description = 'Reconnu comme le premier vrai micro de nombreux ingénieurs du son, le t.bone SC 450 offre un rapport qualité/prix stupéfiant. C''est un microphone à condensateur large membrane efficace et robuste, offrant une directivité cardioïde large qui pardonne les erreurs de placement. Son corps en métal lourd inspire confiance et sa réponse en fréquence, bien que brillante, flatte les voix ternes. C''est la solution idéale pour maquetter rapidement sans se ruiner.',
  pros = to_jsonb(ARRAY['Prix imbattable', 'Corps robuste en métal', 'Valise et suspension incluses']),
  cons = to_jsonb(ARRAY['Aigus parfois artificiels'])
WHERE id = '7b42cc1f-88dc-4565-9126-c5c80649b77f';

-- 2. t.bone SC 450 Stereoset
UPDATE products SET 
  description = 'Le set stéréo t.bone SC 450 offre deux microphones SC 450 appairés pour une cohérence de phase optimale. C''est le moyen le plus économique d''accéder aux techniques d''enregistrement stéréo comme le couple AB ou XY pour les overheads de batterie, le piano ou les chorales. Livrés dans une mallette double, ils permettent de capturer une image stéréo large et convaincante pour un prix dérisoire.',
  pros = to_jsonb(ARRAY['Paire appairée économique', 'Idéal pour l''initiation à la stéréo', 'Mallette complète']),
  cons = to_jsonb(ARRAY['Nécessite deux câbles et deux pieds (ou une barre)'])
WHERE id = '31507474-f8b3-42b1-9afa-9a583a66fc80';

-- 3. t.bone SC 450 USB
UPDATE products SET 
  description = 'Version plug-and-play du best-seller, le t.bone SC 450 USB intègre sa propre carte son. Branchez-le directement sur votre ordinateur et vous êtes prêt à enregistrer un podcast ou une voix off. Il conserve la large membrane du modèle XLR original, offrant un son bien plus riche et profond que les petits micros de casque ou de webcam. C''est l''outil de démarrage parfait pour le podcasteur sédentaire.',
  pros = to_jsonb(ARRAY['Connexion directe USB', 'Son large membrane', 'Compatible PC et Mac sans pilote']),
  cons = to_jsonb(ARRAY['Qualité de conversion limitée (16 bits)'])
WHERE id = '11842360-512c-411c-9962-68093b1ec1c8';

-- 4. t.bone SC 600
UPDATE products SET 
  description = 'Le t.bone SC 600 monte en gamme en offrant une vraie capsule double membrane de 1 pouce. Cela lui permet de proposer deux directivités commutables : Cardioïde pour le chant et Omnidirectionnelle pour capturer l''ambiance d''une pièce. C''est une fonctionnalité extrêmement rare dans cette gamme de prix, faisant du SC 600 un outil pédagogique et créatif fantastique pour expérimenter avec l''acoustique.',
  pros = to_jsonb(ARRAY['Directivités commutables (Cardio/Omni)', 'Capsule 1 pouce dorée', 'Filtre coupe-bas intégré']),
  cons = to_jsonb(ARRAY['Son un peu creusé (Loudness)'])
WHERE id = '21e844fd-d311-4d90-97e2-fe5014f6cad0';

-- 5. Universal Audio SC-1
UPDATE products SET 
  description = 'L''Universal Audio SC-1 est bien plus qu''un microphone, c''est un système de modélisation complet. De base, c''est un condensateur extrêmement linéaire et neutre. Mais couplé au plugin Hemisphere inclus, il peut se transformer numériquement pour imiter le son des micros les plus célèbres de l''histoire (Neumann, Sony, AKG). Vous pouvez même changer le modèle de micro et l''effet de proximité APRÈS l''enregistrement. C''est la porte d''entrée la plus abordable vers la technologie de modélisation UA.',
  pros = to_jsonb(ARRAY['Technologie de modélisation Hemisphere incluse', 'Peut sonner comme n''importe quel micro', 'Qualité de fabrication UA']),
  cons = to_jsonb(ARRAY['Nécessite un ordinateur pour le traitement'])
WHERE id = '212a0074-898d-4aef-8d1e-5fdaf04ff867';

-- 6. t.bone SCT 2000
UPDATE products SET 
  description = 'Le t.bone SCT 2000 est une véritable curiosité : un micro à lampe très abordable qui sonne étonnamment pro. Équipé d''une lampe 12AX7 remplaçable, il offre cette chaleur et cette compression naturelle typiques des micros vintage. Sa large membrane de 1,07 pouce capture un son énorme. Beaucoup d''utilisateurs remplacent la lampe d''origine par une lampe NOS (New Old Stock) de haute qualité, transformant ce micro bon marché en une arme de studio redoutable.',
  pros = to_jsonb(ARRAY['Son à lampe authentique', 'Très modifiable (changement de lampe)', 'Livré avec alimentation externe']),
  cons = to_jsonb(ARRAY['Lampe d''origine de qualité moyenne'])
WHERE id = 'ce30a445-2d41-442c-9c0f-b9bdaf5527b4';

-- 7. t.bone SCT 800
UPDATE products SET 
  description = 'Reconnaissable à son corps bleu et or, le t.bone SCT 800 est un classique des home-studios européens. C''est un micro à lampe au son chaud et coloré, qui excelle à adoucir les voix agressives ou sibilantes. Moins neutre que le SCT 2000, il a un caractère vintage marqué qui plaît ou ne plaît pas, mais ne laisse pas indifférent. C''est un excellent complément à un micro FET propre pour avoir une palette sonore variée.',
  pros = to_jsonb(ARRAY['Esthétique unique', 'Son chaud et coloré', 'Bonne base pour le modding']),
  cons = to_jsonb(ARRAY['Bruit de fond audible'])
WHERE id = 'e288c1a8-a9f8-40cb-943e-f79179c0ef1d';

-- 8. sE Electronics sE 2200
UPDATE products SET 
  description = 'Le sE Electronics sE 2200 est une légende moderne utilisée par des stars comme Amy Winehouse. C''est l''un des rares micros de cette gamme à utiliser une véritable capsule fabriquée à la main et accordée individuellement. Son son est classique, avec juste ce qu''il faut d''air pour que la voix perce le mix sans eq. C''est un micro "workhorse" professionnel qui ne décevra jamais, offrant une finition et une durabilité bien supérieures à la moyenne.',
  pros = to_jsonb(ARRAY['Capsule fabriquée à la main', 'Son "Amy Winehouse" classique', 'Finition caoutchouc anti-résonance']),
  cons = to_jsonb(ARRAY['Directivité fixe'])
WHERE id = '4b7efa5b-3174-430b-bc58-185ac328d2f4';

-- 9. sE Electronics sE4100
UPDATE products SET 
  description = 'Le sE Electronics sE4100 est la version cardioïde seule du célèbre sE4400. C''est un microphone utilitaire compact, véritable couteau suisse du studio. Sa capsule à double diaphragme en laiton offre un son précis et rapide. Son format plat et sa suspension unique permettent de le placer littéralement n''importe où : contre une grille d''ampli guitare, sous une cymbale, ou collé à une peau de tom. C''est le micro à tout faire des ingénieurs du son pragmatiques.',
  pros = to_jsonb(ARRAY['Format plat ultra-logeable', 'Son précis et percutant', 'Encaisse de forts volumes']),
  cons = to_jsonb(ARRAY['Cardioïde uniquement'])
WHERE id = 'c10c6a76-9aa0-48a8-a490-9169b4bcfdb7';

-- 10. sE Electronics sE4400
UPDATE products SET 
  description = 'Souvent comparé au légendaire AKG C414 pour son format et sa polyvalence, le sE Electronics sE4400 est un monstre de flexibilité. Avec ses quatre directivités, ses deux coupes-bas et ses deux pads, il peut tout enregistrer, d''un orchestre symphonique à un ampli Marshall poussé à 11. Sa capsule jumelle fabriquée à la main délivre un son vintage mais détaillé. C''est un investissement sûr pour tout studio sérieux qui a besoin d''un micro capable de tout faire bien.',
  pros = to_jsonb(ARRAY['4 Directivités', 'Extrêmement polyvalent', 'Construction main soignée']),
  cons = to_jsonb(ARRAY['Suspension un peu rigide'])
WHERE id = '66b9cdcc-b993-422e-a679-54cac060e67d';

-- 11. Lauten Audio Series Black LA-220 V2
UPDATE products SET 
  description = 'Le Lauten Audio LA-220 V2 est une porte d''entrée abordable vers le son américain haut de gamme. C''est un micro FET à deux tonalités : il possède des filtres passe-haut et passe-bas indépendants qui permettent de changer radicalement son caractère, passant d''un son moderne et brillant à un son vintage et sombre. C''est comme avoir deux micros en un. Sa construction soignée et sa sonorité musicale en font un excellent choix pour les voix et les instruments acoustiques.',
  pros = to_jsonb(ARRAY['Filtres High et Low Cut créatifs', 'Sonorité musicale', 'Excellente qualité de fabrication (USA design)']),
  cons = to_jsonb(ARRAY['Cardioïde uniquement'])
WHERE id = 'ab290423-00f0-439f-a0f1-4063263b6d49';

-- 12. Lauten Audio Series Black LA-320 V2
UPDATE products SET 
  description = 'Le grand frère à lampe, le Lauten Audio LA-320 V2, apporte la magie du vide à la série Black. Utilisant une lampe 12AX7, il offre une profondeur et une dimension tridimensionnelle que seul un circuit à tube peut produire. Comme le 220, il dispose de filtres de mise en forme sonore uniques. C''est un micro fantastique pour donner de l''ampleur et de l''autorité à une voix lead ou pour capturer l''entièreté d''un kit de batterie en "Front of Kit".',
  pros = to_jsonb(ARRAY['Son à lampe tridimensionnel', 'Filtres de coloration sonore', 'Alimentation externe incluse']),
  cons = to_jsonb(ARRAY['Nécessite un temps de chauffe'])
WHERE id = '4e21d0bd-7dd4-470b-b5cf-f051eb91a4a6';

-- 13. Shure MV7X (Texte existant conservé et nettoyé)
UPDATE products SET 
  description = 'Inspiré du mythique SM7B, le Shure MV7X est un microphone dynamique XLR conçu pour les créateurs de contenu qui exigent la qualité sans le superflu. Il reprend la signature sonore chaude et précise de son grand frère. Grâce à sa connexion XLR standard, il s''intègre dans tout studio pro. Sa directivité cardioïde et sa technologie d''isolement de la voix le rendent redoutable dans les pièces non traitées, rejetant efficacement les bruits ambiants. C''est le choix pragmatique pour une voix de radio instantanée.',
  pros = to_jsonb(ARRAY['L''ADN du SM7B accessible', 'Isolation vocale exceptionnelle', 'Robustesse Shure']),
  cons = to_jsonb(ARRAY['XLR uniquement (pas d''USB)'])
WHERE id = '49249f2b-d6a5-4f83-8869-01304f179fcf';

-- 14. Universal Audio Sphere DLX
UPDATE products SET 
  description = 'L''Universal Audio Sphere DLX est le sommet de la technologie de modélisation. C''est un microphone stéréo à double capsule qui capture le champ sonore complet, permettant de changer non seulement le type de micro, mais aussi la directivité et l''axe APRÈS l''enregistrement. Il peut émuler 38 des micros les plus rares au monde (Neumann, Telefunken, AKG) avec une précision indiscernable de l''original. Il permet même d''utiliser deux modèles de micros différents en même temps (un sur chaque canal) pour des combinaisons sonores infinies.',
  pros = to_jsonb(ARRAY['Émulation de 38 micros légendaires', 'Contrôle de la directivité post-prise', 'Mode Stéréo et Dual Mode']),
  cons = to_jsonb(ARRAY['Prix élevé', 'Dépendance logicielle'])
WHERE id = 'fb9d05e3-91dd-445b-bb17-536644098768';

-- 15. Universal Audio Sphere LX
UPDATE products SET 
  description = 'L''Universal Audio Sphere LX offre la puissance de la technologie Sphere dans un format plus compact. Comme le DLX, il permet de changer de micro et de directivité après l''enregistrement. Il propose 20 modèles de micros légendaires sélectionnes parmi les plus essentiels. C''est l''outil idéal pour les petits studios qui veulent la polyvalence d''un grand parc de micros sans l''encombrement ni le coût astronomique des originaux vintage.',
  pros = to_jsonb(ARRAY['Accès à 20 micros de légende', 'Technologie Sphere révolutionnaire', 'Format compact']),
  cons = to_jsonb(ARRAY['Moins de modèles que le DLX'])
WHERE id = 'ab8bbff0-056f-4c08-89d3-49c3401a69a6';

-- 16. Aston Microphones Spirit
UPDATE products SET 
  description = 'L''Aston Spirit est le grand frère multi-directivité de l''Origin. Il utilise un transformateur haute performance qui lui confère un son plus "lourd" et plus "soyeux", rappelant les classiques britanniques. Avec ses directives Omni, Cardio et 8, c''est un cheval de bataille en studio. Sa grille en ressort ondulé est une œuvre d''art industrielle qui protège la capsule contre les chocs les plus violents. C''est un micro qui a du caractère et qui le montre.',
  pros = to_jsonb(ARRAY['Son riche avec transformateur', '3 Directivités', 'Design et fabrication UK uniques']),
  cons = to_jsonb(ARRAY['Un peu lourd'])
WHERE id = '03e41e2b-c0ce-459a-8958-58c596e29b31';

-- 17. Aston Microphones Stealth
UPDATE products SET 
  description = 'L''Aston Stealth est un microphone révolutionnaire à plus d''un titre. C''est un dynamique de qualité broadcast qui intègre un préampli actif de classe A. Lorsqu''il détecte une alimentation fantôme 48V, le préampli s''active automatiquement, boostant le signal pour un son propre et fort (fini le besoin de Cloudlifter !). Il propose quatre voicings distincts totalement analogiques (Vocal 1, Vocal 2, Guitar, Dark) qui changent physiquement le circuit de captation. C''est le micro le plus polyvalent de sa catégorie.',
  pros = to_jsonb(ARRAY['Préampli actif intégré (Plug & Play)', '4 Voicings analogiques distincts', 'Qualité broadcast']),
  cons = to_jsonb(ARRAY['Taille imposante', 'Design futuriste clivant'])
WHERE id = '06d87105-970e-410f-82d6-79a0343070fc';

-- 18. Aston Microphones Stealth Broadcast
UPDATE products SET 
  description = 'L''Aston Stealth Broadcast est techniquement identique au Stealth original mais optimisé dans son packaging et son marketing pour le marché de la radio et du podcast. Il offre les mêmes quatre voicings magiques et le préampli actif intégré qui le rend si facile à utiliser avec n''importe quelle interface audio. Le mode "Vocal 1" est particulièrement réputé pour offrir ce son "voix off de cinéma" riche et profond sans aucun effort.',
  pros = to_jsonb(ARRAY['Préampli boost intégré', 'Le son "Voix Off" immédiat', 'Polyvalence totale']),
  cons = to_jsonb(ARRAY['Identique au Stealth standard'])
WHERE id = '147927c3-bd88-45d7-bccd-33a9e1299a45';

-- 19. sE Electronics T1
UPDATE products SET 
  description = 'Le sE Electronics T1 est un microphone à condensateur cardioïde doté d''une capsule en titane unique en son genre. Le titane est plus rigide et plus léger que l''or traditionnellement utilisé, ce qui permet une réponse aux transitoires ultra-rapide. Le résultat est un son percutant, avec une attaque franche et des aigus très détaillés mais jamais durs. Il est exceptionnel pour capturer les percussions, la batterie et les guitares acoustiques percussives.',
  pros = to_jsonb(ARRAY['Capsule Titane exclusive', 'Attaque ultra-rapide', 'Idéal percussions et batterie']),
  cons = to_jsonb(ARRAY['Peut être sec sur certaines voix'])
WHERE id = '2770f627-953a-45bb-94c2-d6c0f44081f7';

-- 20. sE Electronics T2
UPDATE products SET 
  description = 'Le sE Electronics T2 reprend la fameuse capsule en titane du T1 mais l''intègre dans le corps multi-directivité du 4400. C''est le mariage parfait entre la polyvalence (4 directivités) et la précision chirurgicale du titane. Il offre une clarté dans les graves et une définition dans les aigus qui le rendent parfait pour les sources complexes comme le piano ou la basse slap. C''est un outil de précision pour le sound design et le mixage moderne.',
  pros = to_jsonb(ARRAY['Capsule Titane + Multi-Directivité', 'Définition exceptionnelle', 'Format plat pratique']),
  cons = to_jsonb(ARRAY['Sonorité très moderne (pas vintage)'])
WHERE id = 'ced84067-41ce-4dc7-9f5b-7dd6e2b4ef52';
