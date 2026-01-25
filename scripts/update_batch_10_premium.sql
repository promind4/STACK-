
-- SQL UPDATE SCRIPT FOR BATCH 10 (PREMIUM DESCRIPTIONS)
-- Run this in your Supabase SQL Editor.

-- 1. Mojave Audio MA-200 SN
UPDATE products SET 
  description = 'Le Mojave Audio MA-200 est le grand classique de la marque fondée par David Royer (père des micros à ruban Royer Labs). C''est un microphone à lampe cardioïde à large membrane qui sonne "gros". Il offre cette chaleur typique des lampes sans le côté "boueux" ou imprécis de certains modèles vintage. Sa capsule de 3 microns capture les détails avec une rapidité surprenante. C''est le choix idéal pour donner du corps et de l''âme à une voix ou une guitare acoustique.',
  pros = to_jsonb(ARRAY['Design de David Royer', 'Chaleur des lampes légendaire', 'Transformateur Jensen']),
  cons = to_jsonb(ARRAY['Directivité fixe (Cardioïde uniquement)'])
WHERE id = '000fc142-7502-4d82-a05b-d42f9fe3f658';

-- 2. Mojave Audio MA-201fet VG
UPDATE products SET 
  description = 'Le Mojave MA-201fet est la version à transistor (FET) du MA-200. Il en reprend la même capsule et le même transformateur Jensen, mais remplace la lampe par un circuit à faible bruit ultra-rapide. Le résultat est un son plus percutant, avec une meilleure réponse aux transitoires (les attaques de notes). Il excelle sur les sources percussives comme la batterie (overheads, kick) ou les amplis guitare, tout en restant un excellent micro vocal pour le rock.',
  pros = to_jsonb(ARRAY['La qualité Mojave en version FET', 'Excellente réponse aux transitoires', 'Transformateur Jensen']),
  cons = to_jsonb(ARRAY['Moins "magique" que le modèle à lampe'])
WHERE id = '35923d2a-2282-4655-b716-ae49dfc7c68f';

-- 3. Mojave Audio MA-300 SN
UPDATE products SET 
  description = 'Le Mojave MA-300 est l''évolution multi-directivité du MA-200. Il offre le même son chaud et épais grâce à sa lampe JAN 5840 et son transformateur Jensen, mais ajoute un bouton de directivité variable en continu. Vous pouvez passer de l''Omni au Figure-8 pour capter l''ambiance de la pièce ou faire des duos face-à-face. C''est le micro à tout faire haut de gamme pour le studio qui veut la polyvalence sans sacrifier le son.',
  pros = to_jsonb(ARRAY['Polyvalence Multi-Directivité continue', 'Son lampe riche et détaillé', 'Atténuateur -15dB et Coupe-bas']),
  cons = to_jsonb(ARRAY['Prix plus élevé que le MA-200'])
WHERE id = '89f2d459-24b9-48e0-a830-32ccbd852942';

-- 4. Mojave Audio MA-301fet VG
UPDATE products SET 
  description = 'Le MA-301fet combine la précision du circuit FET avec la polyvalence de trois directivités (Omni, Cardio, 8). C''est un véritable couteau suisse de studio. Contrairement à beaucoup de micros FET qui peuvent sonner froids, le MA-301fet garde une signature sonore musicale grâce à son transformateur Jensen de haute qualité. Il est assez robuste pour enregistrer une grosse caisse et assez fin pour capturer un chuchotement.',
  pros = to_jsonb(ARRAY['Circuit FET ultra-silencieux', '3 Directivités', 'Transformateur Jensen USA']),
  cons = to_jsonb(ARRAY['Design assez utilitaire'])
WHERE id = '9d4d55e7-37bf-48ea-a07c-d5e3ad3936b4';

-- 5. Mojave Audio MA-37
UPDATE products SET 
  description = 'Le Mojave MA-37 est une réinterprétation moderne du légendaire Sony C-37A, un micro à lampe culte des années 50 utilisé par Frank Sinatra. Mojave a réussi à capturer cette sonorité unique "haute fidélité vintage" : c''est onctueux, jamais agressif, avec une sorte de compression naturelle qui place la voix parfaitement dans le mix. Son design mécanique unique avec la "grelotte" ventilée est fidèle à l''original.',
  pros = to_jsonb(ARRAY['Le son mythique du Sony C-37A', 'Douceur extrême des aigus', 'Look rétro unique']),
  cons = to_jsonb(ARRAY['Niveau de bruit un peu plus élevé que les standards modernes'])
WHERE id = '2b95dd78-e126-4894-a76d-7213f214b35c';

-- 6. t.bone MB 7 Beta
UPDATE products SET 
  description = 'Le t.bone MB 7 Beta est la réponse abordable aux microphones de broadcast légendaires. C''est un micro dynamique conçu pour la voix parlée, offrant ce son "radio" chaud et proche sans avoir besoin d''un studio traité acoustiquement. Sa directivité cardioïde rejette efficacement les bruits de clavier et de ventilateur. C''est une excellente entrée en matière pour le podcast ou le streaming sans se ruiner.',
  pros = to_jsonb(ARRAY['Prix imbattable pour ce type de micro', 'Bonne isolation des bruits ambiants', 'Construction robuste']),
  cons = to_jsonb(ARRAY['Nécessite beaucoup de gain (préamp costaud recommandé)'])
WHERE id = 'e3f35593-2b76-4812-8ed5-fa0255b2ebca';

-- 7. Sontronics Mercury
UPDATE products SET 
  description = 'Le Sontronics Mercury est un microphone à lampe visuellement et techniquement époustouflant qui a remporté de nombreux prix. Avec son design arrondi rétro-futuriste, il ne ressemble à rien d''autre. À l''intérieur, une lampe ECC81 sélectionnée produit un son d''une douceur infinie, avec un bruit de fond quasi inaudible (ce qui est rare pour du tube). Sa directivité est variable en continu, offrant une palette de couleurs infinie.',
  pros = to_jsonb(ARRAY['Sonorité douce et soyeuse', 'Bruit de fond ultra-faible pour une lampe', 'Design iconique']),
  cons = to_jsonb(ARRAY['Très lourd et volumineux'])
WHERE id = '51f5bfad-262f-4a91-8eb4-6b5036d947b1';

-- 8. Apogee MiC Plus
UPDATE products SET 
  description = 'L''Apogee MiC Plus n''est pas un gadget, c''est un véritable micro de studio condensé au format USB. Utilisant la technologie de conversion PureDIGITAL d''Apogee (les mêmes convertisseurs que dans les studios pros), il offre une qualité sonore bluffante pour sa taille. Branchez-le sur votre iPhone, iPad ou Mac et vous avez instantanément une chaîne d''enregistrement professionnelle. Idéal pour les musiciens nomades.',
  pros = to_jsonb(ARRAY['Qualité de conversion Apogee légendaire', 'Ultra-portable', 'Compatible iOS/Mac/PC sans pilote']),
  cons = to_jsonb(ARRAY['Pas de sortie XLR (usage numérique uniquement)'])
WHERE id = '76dc74b0-028d-4567-b8db-a24efa4c6b9a';

-- 9. Sennheiser MK4
UPDATE products SET 
  description = 'Le Sennheiser MK4 est le premier micro large membrane conçu et fabriqué en Allemagne par Sennheiser. C''est un modèle de fiabilité et de précision. Son son est direct, présent et très équilibré, sans l''agressivité qu''on trouve parfois dans cette gamme de prix. Sa capsule est montée sur suspension interne pour réduire les bruits. C''est un investissement sûr pour un premier "vrai" micro de studio.',
  pros = to_jsonb(ARRAY['Fabrication allemande (Made in Germany)', 'Son neutre et polyvalent', 'Excellent rapport qualité/prix']),
  cons = to_jsonb(ARRAY['Pas d''accessoires inclus (vendus séparément)'])
WHERE id = '6118ef71-08fa-4881-8ded-a27ac8b02323';

-- 10. Sennheiser MK8
UPDATE products SET 
  description = 'Grand frère du MK4, le Sennheiser MK8 reprend la même qualité de fabrication allemande mais ajoute une flexibilité totale : 5 directivités commutables, un filtre coupe-bas à 3 positions et un atténuateur à 3 niveaux. C''est un outil de travail sérieux pour l''ingénieur du son qui a besoin d''adapter son micro à n''importe quelle situation, de l''enregistrement d''orchestre à la prise de son de guitare électrique forte.',
  pros = to_jsonb(ARRAY['5 Directivités', 'Filtres et Pads très complets', 'Qualité Sennheiser durable']),
  cons = to_jsonb(ARRAY['Look identique au MK4 (sobre)'])
WHERE id = '3d96d6d7-bb24-41eb-aeae-70969f1a512f';

-- 11. Golden Age Premier ELA M 251E
UPDATE products SET 
  description = 'Le Golden Age Premier ELA M 251E est une reproduction sans compromis de l''un des micros les plus chers au monde. Faisant partie de la ligne "Premier" haut de gamme, il utilise une véritable capsule K251D et une lampe 6072A pour recréer la magie sonore de l''original Telefunken. Le son est immense, avec des aigus cristallins qui "flottent" dans l''air. C''est le plus proche que vous puissiez être de la légende sans vendre votre maison.',
  pros = to_jsonb(ARRAY['Réplique fidèle du Telefunken 251', 'Son aérien et magique', 'Composants haut de gamme']),
  cons = to_jsonb(ARRAY['Prix élevé (mais loin de l''original)'])
WHERE id = 'f9ce353e-90c8-4784-be65-fa3324fd3be3';

-- 12. Golden Age Premier GA-251 MKII
UPDATE products SET 
  description = 'Le Golden Age Premier GA-251 MKII offre l''expérience 251 avec un rapport qualité/prix optimisé. Il utilise des composants modernes de haute précision comme des condensateurs Solen et une lampe NOS Philips pour délivrer ce son classique. La différence avec le modèle ELA M ci-dessus réside dans des détails de fabrication internes, mais il offre 95% de la performance sonore pour un budget plus maîtrisé.',
  pros = to_jsonb(ARRAY['Le "Son 251" accessible', 'Composants audiophiles (Solen, Philips)', 'Construction soignée']),
  cons = to_jsonb(ARRAY['Concurrent interne du modèle ELA M'])
WHERE id = 'bf6081cb-f18e-40a6-98ed-4ae6f358bf74';

-- 13. Golden Age Premier GA-47 MKII
UPDATE products SET 
  description = 'Le Golden Age Premier GA-47 MKII s''attaque au monument Neumann U47. C''est un micro imposant qui délivre un son autoritaire. Le bas du spectre est énorme, donnant aux voix une assise et une présence incroyables. Il utilise une capsule de style K47 et des composants discrets sur un circuit imprimé Rogers de haute qualité. C''est le choix parfait pour le rock, le blues et les voix masculines graves.',
  pros = to_jsonb(ARRAY['Son U47 massif', 'Idéal pour le caractère vocal', 'Construction robuste']),
  cons = to_jsonb(ARRAY['Très coloré (pas neutre)'])
WHERE id = 'b7e6c63d-7d57-4363-adb1-9ee46d7486bf';

-- 14. Golden Age Premier GA-8000
UPDATE products SET 
  description = 'Le Golden Age Premier GA-8000 est une bête rare : une réplique du légendaire Sony C-800G, le micro favori du rap et du R&B moderne. Reconnaissable à son énorme dissipateur thermique externe (le "radiateur") qui maintient la lampe à température optimale, il offre un son ultra-moderne, brillant et poli. C''est ce son "déjà mixé" qu''on entend sur les hits actuels, avec des voix qui scintillent.',
  pros = to_jsonb(ARRAY['Le son du Rap/R&B moderne', 'Système de refroidissement actif unique', 'Aigus brillants et précis']),
  cons = to_jsonb(ARRAY['Encombrant avec son radiateur'])
WHERE id = 'f4de7a83-8adc-490f-9b11-7096963e49ba';

-- 15. RØDE Procaster
UPDATE products SET 
  description = 'Le RØDE Procaster est conçu spécifiquement pour la voix parlée et le broadcast. C''est un micro dynamique robuste qui ignore superbement l''acoustique de votre pièce. Si vous enregistrez dans un bureau ou une chambre non traitée, c''est votre sauveur. Il offre une réponse en fréquence taillée pour l''intelligibilité et une réjection des bruits ambiants exceptionnelle. Un standard de l''industrie pour la radio.',
  pros = to_jsonb(ARRAY['Réjection acoustique incroyable', 'Son broadcast pro', 'Garantie RØDE 10 ans']),
  cons = to_jsonb(ARRAY['Niveau de sortie faible (bon préampli requis)'])
WHERE id = 'ffa87e74-8d02-40c9-a764-f4bc9ce16500';

-- 16. RØDE Procaster B-Stock
UPDATE products SET 
  description = 'Le RØDE Procaster B-Stock est une occasion parfaite de s''équiper en qualité broadcast pour moins cher. Il s''agit souvent de modèles d''exposition ou de retours clients, vérifiés et fonctionnels à 100%. Il offre exactement les mêmes performances de réjection de bruit et de qualité sonore que le modèle neuf, idéal pour lancer son podcast avec un budget serré.',
  pros = to_jsonb(ARRAY['Prix réduit', 'Qualité RØDE intacte', 'Robuste']),
  cons = to_jsonb(ARRAY['Emballage possiblement abîmé'])
WHERE id = '8cf200ff-8460-4461-a13a-9429e983a06d';

-- 17. Lewitt PURE TUBE Essential Set
UPDATE products SET 
  description = 'Le Lewitt PURE TUBE se concentre sur une seule chose : un son de lampe pur et parfait, sans bruit de fond. Grâce à un circuit révolutionnaire sans semi-conducteur sur le trajet du signal, il offre la chaleur des lampes avec un silence absolu (7dBA de bruit propre). L''Essential Set inclut le micro et sa pince standard, pour ceux qui ont déjà leurs accessoires. C''est un son vocal intime et chaud, immédiatement flatteur.',
  pros = to_jsonb(ARRAY['Son lampe pur sans bruit', 'Garantie à vie Lewitt', 'Simplicité d''utilisation']),
  cons = to_jsonb(ARRAY['Pas de directivité variable'])
WHERE id = '401d72e0-021c-4c1a-9350-221823c8438f';

-- 18. Lewitt PURE TUBE Studio Set
UPDATE products SET 
  description = 'Le PURE TUBE Studio Set complète ce micro d''exception avec une suspension antichoc de luxe et un filtre anti-pop magnétique qui se clique directement sur la suspension. C''est la configuration ultime pour l''enregistrement vocal. Le filtre pop est tellement transparent acoustiquement que vous ne perdez aucun détail des aigus, tout en stoppant net les plosives. Le luxe autrichien à l''état pur.',
  pros = to_jsonb(ARRAY['Pack Luxe avec suspension et Pop filter', 'Son lampe moderne et silencieux', 'Design magnifique']),
  cons = to_jsonb(ARRAY['Investissement conséquent'])
WHERE id = '1ff3a635-44f6-4785-b50b-c9827a5a0cb9';

-- 19. Lewitt PURE TUBE Studio Set B-Stock
UPDATE products SET 
  description = 'Accédez à l''élite du son Lewitt avec ce PURE TUBE Studio Set B-Stock. Il contient tous les accessoires premium (suspension, pop filter, mallette) et le micro révolutionnaire, à un tarif préférentiel. C''est le moyen le plus intelligent d''obtenir ce son vocal "larger than life" typique des tubes modernes sans payer le prix fort.',
  pros = to_jsonb(ARRAY['Prix B-Stock attractif', 'Set complet inchangé', 'Son haut de gamme']),
  cons = to_jsonb(ARRAY['Traces mineures possibles'])
WHERE id = 'b754bade-ffad-4392-863b-129356e833c3';

-- 20. Lewitt RAY Autofocus Microphone
UPDATE products SET 
  description = 'Le Lewitt RAY est le premier microphone au monde avec "Autofocus" pour votre voix. Utilisant une technologie de capteur de distance laser, il ajuste automatiquement le niveau et l''égalisation en fonction de votre distance au micro. Si vous reculez, il compense. Si vous vous approchez, il atténue l''effet de proximité. De plus, il coupe le son automatiquement si vous vous éloignez trop (Mute by Distance). C''est de la magie technologique pure pour les streamers et créateurs de contenu.',
  pros = to_jsonb(ARRAY['Technologie AURA (Autofocus vocal)', 'Fonction Mute distance automatique', 'Idéal pour streaming bougeant']),
  cons = to_jsonb(ARRAY['Technologie numérique nécessitant adaptation'])
WHERE id = 'b33004ad-6ddf-421a-b0d9-82f77079f9f6';
