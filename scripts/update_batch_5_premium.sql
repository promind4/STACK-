
-- SQL UPDATE SCRIPT FOR BATCH 5 (PREMIUM DESCRIPTIONS)
-- Run this in your Supabase SQL Editor.

-- 1. Bock 187
UPDATE products SET 
  description = 'Vision réinventée de l''héritage U87, le Bock Audio 187 est l''interprétation par David Bock du microphone FET classique des années 70. Ce n''est pas un simple clone, c''est une version améliorée, plus grosse et plus ouverte. Là où le U87 vintage peut parfois sonner un peu nasillard ou dur dans les hauts-médiums, le Bock 187 offre un bas du spectre plus massif et des aigus plus aérés, tout en conservant ce médium agressif qui fait percer la voix dans le mix. C''est le son de la pop moderne avec une touche vintage.',
  pros = to_jsonb(ARRAY['Basé sur le U87i classique', 'Plus de graves et d''air que l''original', 'Transformateur Cinemag massif']),
  cons = to_jsonb(ARRAY['Directivité cardioïde uniquement'])
WHERE id = 'f5665188-0997-4f56-ae3b-cbf15c9e8de3';

-- 2. Bock 251
UPDATE products SET 
  description = 'Considéré par beaucoup comme le Saint Graal du chant, le Bock Audio 251 est l''un des meilleurs microphones au monde pour la voix. C''est une récréation méticuleuse du Telefunken ELA M 251, souvent cité comme le plus beau micro jamais construit. Il délivre ce son plus grand que nature avec des aigus étincelants et soyeux, ce fameux air, des graves profonds et une douceur absolue. C''est le micro des divas, des crooners et des plus grandes productions mondiales.',
  pros = to_jsonb(ARRAY['Sonorité légendaire du 251', 'Aigus ''Airy'' magiques', 'Construction sans compromis']),
  cons = to_jsonb(ARRAY['Prix très élevé'])
WHERE id = 'e78688fd-0704-4449-83ce-c69c684bb8db';

-- 3. RODE Broadcaster
UPDATE products SET 
  description = 'Véritable voix de la FM, le RØDE Broadcaster est un standard des studios de radio du monde entier. C''est un condensateur large membrane optimisé spécifiquement pour la voix parlée, offrant cet effet de proximité riche et cette clarté nécessaire pour l''antenne. Côté fonctionnalités radio, il intègre un filtre anti-pop interne efficace et surtout un indicateur On-Air LED unique qui peut être piloté par votre console de mixage.',
  pros = to_jsonb(ARRAY['Son radio broadcast standard', 'Indicateur LED On-Air', 'Filtre anti-pop intégré']),
  cons = to_jsonb(ARRAY['Assez lourd'])
WHERE id = 'b6bebab0-0bd6-44c1-9d52-78faf3345fa4';

-- 4. Behringer C-1
UPDATE products SET 
  description = 'Idéal pour commencer simplement, le Behringer C-1 est probablement le micro à condensateur de studio le moins cher du marché. C''est la porte d''entrée absolue pour ceux qui veulent passer du micro casque à un vrai micro XLR sans budget. Il offre une capture cardioïde honnête, bien plus claire qu''un micro dynamique bas de gamme. Parfait pour les premières maquettes, le podcast débutant ou comme micro de dépannage.',
  pros = to_jsonb(ARRAY['Prix plancher', 'Construction métal', 'Fourni avec pince']),
  cons = to_jsonb(ARRAY['Souffle audible', 'Son un peu fin'])
WHERE id = 'fdb11a69-d6be-4f95-98af-293b68686afb';

-- 5. Sony C-100
UPDATE products SET 
  description = 'Incarnant la haute résolution japonaise, le Sony C-100 est un micro unique au monde, certifié Hi-Res Audio. Sa particularité réside dans son design à deux voies comme une enceinte, utilisant une large membrane pour les graves et médiums et une petite membrane dédiée aux ultra-aigus jusqu''à 50kHz. Cela permet de capturer une richesse harmonique et une spatialisation inouïes, bien au-delà de ce que l''oreille humaine perçoit consciemment mais qui participe au réalisme. Idéal pour le classique, le jazz acoustique et le sound design.',
  pros = to_jsonb(ARRAY['Réponse jusqu''à 50kHz (Hi-Res)', 'Design double capsule innovant', 'Réalisme époustouflant']),
  cons = to_jsonb(ARRAY['Détail impitoyable sur les imperfections'])
WHERE id = 'f93d7078-6a98-455b-a6a3-ecacaf6d72a0';

-- 6. AKG C-12 VR
UPDATE products SET 
  description = 'La légende autrichienne revit avec l''AKG C12 VR, réédition officielle du Saint Graal des micros à lampe, le C12 original de 1953. Il utilise la capsule CK12 originale, la plus complexe jamais fabriquée, et un tube 6072A sélectionné à la main. Le son C12 est brillant, aéré, presque éthéré. Contrairement au U47 qui est épais et sombre, le C12 est ouvert et étincelant. C''est le secret des voix pop qui flottent dans le mix et des prises de piano majestueuses.',
  pros = to_jsonb(ARRAY['Capsule CK12 légendaire', 'Lampe 6072A', 'Sonorité brillante et aérée']),
  cons = to_jsonb(ARRAY['Prix collector'])
WHERE id = '66bea019-a3c5-4cf9-8b86-c4a99418067d';

-- 7. Behringer C-3
UPDATE products SET 
  description = 'Offrant la polyvalence à petit prix, le Behringer C-3 reprend le design du C-1 mais ajoute un atout majeur avec sa double membrane. Cela lui permet d''offrir trois directivités commutables : Cardioïde, Omnidirectionnelle et Figure en 8. C''est un outil d''apprentissage fantastique et le micro le moins cher au monde offrant ces fonctions, idéal pour comprendre comment les directivités changent le son ou pour enregistrer des duos.',
  pros = to_jsonb(ARRAY['3 Directivités (Omni/Cardio/8)', 'Double membrane', 'Prix incroyable']),
  cons = to_jsonb(ARRAY['Bruit de fond élevé'])
WHERE id = '8d37a3b7-e856-46d6-bf4a-8a57df6aefea';

-- 8. Sony C-80
UPDATE products SET 
  description = 'Héritier du C-800G, le Sony C-80 est un petit miracle. Il hérite de la capsule du légendaire C-100 et de la structure acoustique du mythique C-800G utilisé par les plus grands rappeurs, mais dans un format compact et abordable pour le home-studio. La signature Sony offre ce son moderne, précis et forward avec des médiums très clairs qui percent le mix. C''est l''arme absolue pour le RnB, la pop et le rap vocal, apportant une qualité major label à la maison.',
  pros = to_jsonb(ARRAY['L''ADN du C-800G abordable', 'Effet de proximité réduit (son clair)', 'Idéal voix Rap/Pop']),
  cons = to_jsonb(ARRAY['Look sobre'])
WHERE id = 'a9107140-d2e2-4d75-826f-e9a497c9fe44';

-- 9. AKG C214
UPDATE products SET 
  description = 'Petit frère du C414, l''AKG C214 est une version simplifiée du légendaire modèle, optimisée pour ceux qui n''ont besoin que de la directivité cardioïde. Il utilise la même capsule de 1 pouce que son grand frère, offrant cette signature sonore AKG caractéristique avec des aigus détaillés et cristallins et des graves tendus. Il est aussi à l''aise sur une voix que devant un ampli guitare sursaturé car il encaisse jusqu''à 156 dB SPL. C''est un standard des studios professionnels comme micro à tout faire.',
  pros = to_jsonb(ARRAY['La capsule du C414', 'Encaisse des pressions énormes', 'Valise de transport métal']),
  cons = to_jsonb(ARRAY['Uniquement cardioïde'])
WHERE id = '48c75e0a-1d46-4b08-95e5-0f2700d4547d';

-- 10. AKG C3000
UPDATE products SET 
  description = 'Véritable bourreau de travail, l''AKG C3000 est un classique qui traverse les époques. Présent depuis près de 20 ans, c''est un micro à condensateur conçu pour être robuste et polyvalent. Avec son pad -10dB, il est souvent utilisé comme micro bélier en studio sur les amplis guitare, les cuivres ou les overheads de batterie. Il possède une réponse en fréquence très lisse qui le rend facile à égaliser.',
  pros = to_jsonb(ARRAY['Robustesse éprouvée', 'Suspension élastique incluse', 'Polyvalence instrumentale']),
  cons = to_jsonb(ARRAY['Moins flatteur pour le chant moderne'])
WHERE id = '1b5203bc-adf4-470c-a961-4c7e5dfeebce';

-- 11. AKG C314
UPDATE products SET 
  description = 'L''AKG C314 représente l''excellence accessible et comble le vide entre le C214 et le C414. Il offre la même capsule légendaire de 1 pouce, mais ajoute le choix entre quatre directivités : Cardioïde, Supercardioïde, Omni et Figure en 8. C''est un micro sérieux de niveau pro, fabriqué selon les standards stricts d''AKG, qui offre une linéarité exemplaire. L''écran LED de surcharge sur le corps du micro est une fonction géniale pour éviter de saturer vos prises.',
  pros = to_jsonb(ARRAY['4 Directivités', 'Indicateur de surcharge LED', 'Capsule C414 authentique']),
  cons = to_jsonb(ARRAY['Design un peu rectangulaire'])
WHERE id = '9f8da96d-c1d3-4b1a-a490-bfe420904855';

-- 12. AKG C414 XLII
UPDATE products SET 
  description = 'Standard mondial pour la voix, l''AKG C414 XLII avec sa grille dorée est l''un des micros les plus célèbres de l''histoire. Cette version XLII est spécifiquement voicée pour offrir une légère bosse de présence dans les aigus, imitant la capsule CK12 du légendaire C12. C''est le choix numéro un pour les voix pop modernes, les guitares acoustiques solistes et les pianos, où l''on veut que l''instrument brille et se détache du mix sans EQ. Avec ses 9 directivités, c''est le couteau suisse ultime du studio.',
  pros = to_jsonb(ARRAY['La présence du légendaire C12', '9 Directivités !', 'Incroyablement silencieux']),
  cons = to_jsonb(ARRAY['Trop brillant pour certaines sources'])
WHERE id = '90d76243-de78-473b-973b-945be467176e';

-- 13. AKG C414 XLS
UPDATE products SET 
  description = 'Référence neutre absolue, l''AKG C414 XLS avec sa grille argentée est le frère jumeau du XLII, mais avec une réponse en fréquence beaucoup plus linéaire et neutre. Il ne cherche pas à embellir, mais à reproduire avec une fidélité absolue. C''est l''outil universel par excellence : si vous ne deviez avoir qu''un seul micro pour tout faire, des cordes à la batterie en passant par l''orchestre, ce serait celui-ci. Il est respectueux des timbres et accepte n''importe quel placement grâce à ses 9 directivités.',
  pros = to_jsonb(ARRAY['Neutralité absolue', '9 Directivités', 'Standard mondial de l''industrie']),
  cons = to_jsonb(ARRAY['Moins ''excitant'' que le XLII'])
WHERE id = '5f6f5077-77a6-4bcd-bcf5-110a6d8634fc';

-- 14. Avantone CK-40
UPDATE products SET 
  description = 'L''Avantone CK-40 rend la stéréo facile. C''est une bête rare car c''est un microphone stéréo intégrant deux capsules superposées, dont celle du haut peut pivoter à 180 degrés. Cela permet de faire des prises stéréo XY, MS ou Blumlein parfaites avec un seul pied de micro. Idéal pour stimuler la créativité en enregistrant un piano, une chorale, ou l''ambiance d''une pièce avec une cohérence de phase parfaite sans se battre avec deux pieds de micro.',
  pros = to_jsonb(ARRAY['Vrai micro stéréo rotatif', 'Idéal prises Piano/Chorale', 'Look rouge Avantone superbe']),
  cons = to_jsonb(ARRAY['Lourd et imposant'])
WHERE id = '31a2bcf7-4f75-4aaf-af66-d3c050938b85';

-- 15. Avantone CK-6 Classic
UPDATE products SET 
  description = 'Alliant le look, le son et le prix, l''Avantone CK-6 prouve qu''un micro abordable peut être beau et sonner pro. Avec son corps rouge métallisé, il en jette, mais c''est à l''intérieur que la magie opère. Ses condensateurs en polystyrène et MKP de haute qualité, souvent réservés aux micros de boutique, assurent un son très musical. Sa signature sonore est moderne, avec un haut du spectre aéré. C''est un excellent choix pour les voix féminines ou pour ajouter du brillant à une guitare folk.',
  pros = to_jsonb(ARRAY['Composants audio de qualité (Wima/Polystyrène)', 'Esthétique magnifique', 'Suspension rétro incluse']),
  cons = to_jsonb(ARRAY['Un peu brillant'])
WHERE id = '2de4d065-c548-4850-a674-62dcfe3c8e6e';

-- 16. Avantone CK-7+
UPDATE products SET 
  description = 'Grand frère polyvalent de la gamme, l''Avantone CK-7+ reprend la qualité du CK-6 mais passe au niveau supérieur avec le multipattern. Grâce à ses trois directivités (Omni, Cardio, 8), il devient un outil de studio complet. La qualité de fabrication est exemplaire comme toujours chez Avantone, avec un corps en laiton massif et la suspension Retro Shock fournie qui inspirent confiance. Le son est chaud, plein, avec cette touche de brillance moderne.',
  pros = to_jsonb(ARRAY['3 Directivités pour tout faire', 'Composants haut de gamme', 'Rapport Qualité/Prix excellente']),
  cons = to_jsonb(ARRAY['Assez lourd, bon pied requis'])
WHERE id = 'e4eb0f37-3032-4f57-a0eb-85ee25daa4c3';

-- 17. Lauten Audio Clarion FC-357
UPDATE products SET 
  description = 'Incarnant le son FET moderne, le Lauten Audio Clarion est un micro au design unique conçu pour offrir le son classique des FET vintage, rapide et punchy, mais avec une touche de douceur dans les aigus qui manque souvent aux micros modernes. Il dispose d''une fonctionnalité rare avec un switch de gain +10dB. Cela permet de driver le signal fort dans votre préampli pour aller chercher de la saturation et du caractère, ou d''enregistrer des sources très faibles sans bouffle.',
  pros = to_jsonb(ARRAY['Fonction Gain +10dB unique', 'Son FET punchy mais doux', '3 Directivités']),
  cons = to_jsonb(ARRAY['Look clivant'])
WHERE id = '96104148-ab12-431f-a516-5bd39e95200f';

-- 18. Microtech Gefell CMV 563 - M 7 S
UPDATE products SET 
  description = 'L''histoire réincarnée, le Gefell CMV 563 est une légende. C''est la réédition officielle du micro à lampe de 1956 fabriqué par la branche est-allemande de Neumann. Compatible avec les capsules à baïonnette vintage, il est livré avec la légendaire capsule M7S cardioïde. C''est le son des années 50 et 60 : riche, crémeux, avec une saturation harmonique magique. Ce n''est pas un micro propre, c''est un micro qui a une âme gigantesque.',
  pros = to_jsonb(ARRAY['La vraie capsule M7 historique', 'Son lampe vintage authentique', 'Système de capsules interchangeables']),
  cons = to_jsonb(ARRAY['Prix de collection'])
WHERE id = '2d86c2e6-529d-4c9d-a3d2-3b8c13f46be2';

-- 19. Microtech Gefell M 930
UPDATE products SET 
  description = 'Le charme discret du Microtech Gefell M930 réside dans son prodige de miniaturisation. C''est un microphone large membrane très compact, mais qui délivre un son incroyablement grand. Il a un bruit de fond ridiculement bas de 7 dBA, ce qui le rend parfait pour la voix off ou les instruments délicats. Fabriqué dans les usines historiques fondées par Georg Neumann, il conserve cette excellence allemande. Sa taille permet de ne pas intimider le chanteur tout en offrant un son de première classe.',
  pros = to_jsonb(ARRAY['Extrêmement compact', 'Bruit de fond quasi nul', 'Son moderne et riche']),
  cons = to_jsonb(ARRAY['Look très sobre'])
WHERE id = 'f4996503-905c-4db6-8931-978319f6e1cb';

-- 20. Microtech Gefell UMT 70 S
UPDATE products SET 
  description = 'La légende FET continue avec le Gefell UMT 70 S qui utilise la fameuse capsule M7, la même que dans le U47 original, mais couplée à un circuit FET moderne et sans transformateur. Le résultat est le caractère harmonique unique de la M7 avec la propreté et la dynamique moderne. Ce médium mythique qui fait ressortir la voix est bien là. C''est un micro de connaisseur, souvent préféré aux Neumann modernes par les puristes.',
  pros = to_jsonb(ARRAY['Légendaire capsule M7 PVC', 'Technologie FET silencieuse', '3 Directivités']),
  cons = to_jsonb(ARRAY['Look rétro-communiste'])
WHERE id = '728d7fe9-b2e0-4f82-bca3-7c2f09ad13a7';
