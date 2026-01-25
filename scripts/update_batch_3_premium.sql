
-- SQL UPDATE SCRIPT FOR BATCH 3 (PREMIUM DESCRIPTIONS)
-- Run this in your Supabase SQL Editor to bypass RLS restrictions.

-- 1. Soyuz 017 FET
UPDATE products
SET 
  description = 'Incarnant le son boutique russe moderne, le Soyuz 017 FET représente l''apogée de la facture instrumentale contemporaine. Entièrement fabriqué à la main à Tula, ce microphone à condensateur à large membrane n''est pas un simple clone de classiques allemands, mais une véritable création originale qui a su s''imposer dans les plus grands studios mondiaux comme ceux de Radiohead ou Coldplay. Contrairement à la tendance moderne vers une brillance excessive, le 017 FET offre un son "déjà mixé" avec des graves profonds et autoritaires, un médium riche et texturé, et des aigus d''une douceur veloutée qui ne deviennent jamais sibilants. Sa capsule unique, accordée à la main avec une précision d''orfèvre, capture les transitoires avec une rapidité typique des circuits FET tout en conservant une épaisseur harmonique souvent associée aux lampes. C''est le micro de choix pour les voix lead qui manquent de corps, excellant également sur les guitares acoustiques, les amplis basse et comme micro de grosse caisse extérieur pour un son vintage massif.',
  pros = to_jsonb(ARRAY['Sonorité ''Big Sound'' immédiate', 'Aigus soyeux sans dureté', 'Fabrication artisanale d''exception']),
  cons = to_jsonb(ARRAY['Directivité fixe (Cardioïde)'])
WHERE id = 'de7540e6-741b-40d2-89da-2bb269b8954c';

-- 2. Soyuz 017 TUBE
UPDATE products
SET 
  description = 'Véritable héritage des légendes, le Soyuz 017 TUBE est bien plus qu''un microphone, c''est un instrument de musique à part entière. Conçu pour rivaliser avec les légendaires U47 et U67 vintage, il offre cette magie indéfinissable des grands micros à lampe, apportant une tridimensionnalité et une profondeur de champ qui placent l''auditeur dans la pièce avec l''artiste. Au cœur du 017 TUBE se trouve une capsule propriétaire à double membrane, tendue et accordée manuellement par les maîtres artisans de Soyuz. Le circuit à lampe, couplé à un transformateur toroïdal bobiné maison, ajoute une saturation harmonique riche et musicale qui s''épaissit à mesure que l''on pousse le niveau. Ce n''est pas un micro neutre, c''est un micro qui embellit la réalité. Incontournable pour les voix principales pop, rock et jazz, il apporte ce fini professionnel instantané qui ne nécessite souvent aucune égalisation.',
  pros = to_jsonb(ARRAY['Richesse harmonique et effet 3D', 'Transformateur toroïdal propriétaire', 'Esthétique ''Sputnik'' iconique']),
  cons = to_jsonb(ARRAY['Alimentation externe nécessaire (fournie)'])
WHERE id = 'b4afc0ce-1216-451a-891d-fd4dd0f8f69e';

-- 3. Soyuz 023 Bomblet
UPDATE products
SET 
  description = 'Surnommé le charmeur de sources, le Soyuz 023 Bomblet tire son nom et sa forme des munitions soviétiques, mais son caractère est tout sauf destructeur. C''est un microphone à condensateur unique, conçu pour être l''antidote au son numérique stérile et agressif en apportant la magie LOMO. Sa capsule est inspirée des légendaires micros LOMO 19A19 du début des années 70, utilisant une conception rare à triple plaque arrière. Cette architecture complexe confère au Bomblet une réponse en fréquence très particulière, douce et ronde, avec des aigus atténués mais détaillés. C''est le micro idéal pour calmer des sources agressives. Il fait des merveilles sur les amplis guitare électriques criards, les trompettes perçantes ou les batteurs qui frappent fort les cymbales. Sur une voix, il apporte une intimité et une rondeur crooner immédiate.',
  pros = to_jsonb(ARRAY['Sonorité ronde et crémeuse', 'Technologie rare ''Triple Backplate''', 'Dompte les aigus agressifs']),
  cons = to_jsonb(ARRAY['Peut manquer d''air sur des sources déjà sombres'])
WHERE id = '241bad74-ce7d-4cfb-acab-0a041a476754';

-- 4. Soyuz 023 MALFA Deluxe
UPDATE products
SET 
  description = 'Cette Edition Limitée MALFA incarne l''élégance noire et or et sublime le célèbre Soyuz 023 Bomblet. Fruit d''une collaboration exclusive, elle reprend l''intégralité des composants internes qui ont fait le succès du modèle original, mais les enveloppe dans une finition noire mate et laiton brossé d''une élégance rare. Doté d''un cœur analogique, vous retrouverez le son épais et coloré du transformateur toroïdal Soyuz. C''est un micro de caractère, conçu pour les artistes qui cherchent une signature sonore forte. Que ce soit sur une grosse caisse, un ampli basse ou une voix rock, le Bomblet MALFA délivre un son "mix-ready" avec cette compression naturelle des transitoires qui fait sonner les prises imposantes tout de suite. Produit en quantités très limitées, c''est autant un outil de travail redoutable qu''une pièce de collection pour les passionnés de beau matériel.',
  pros = to_jsonb(ARRAY['Finition collector exclusive', 'Sonorité ''Fat'' et colorée', 'Polyvalence sur les sources fortes']),
  cons = to_jsonb(ARRAY['Disponibilité très limitée'])
WHERE id = '28c8d642-2232-461a-b93c-cf7fd40b5f12';

-- 5. Soyuz 1973 (Black)
UPDATE products
SET 
  description = 'Le Soyuz 1973 finition noire s''impose comme le nouveau standard FET et la réponse de Soyuz aux besoins des home-studios modernes, offrant un microphone de qualité boutique à un tarif accessible, sans compromis sur la fabrication. Contrairement à ses grands frères de la série 0, le 1973 adopte un corps plus moderne et compact, mais conserve une capsule et un transformateur 100% fabriqués à la main. Son profil sonore propose une sonorité légèrement plus moderne et en avant que le 017. Une légère bosse de présence dans le haut-médium lui permet de traverser des mixages denses sans avoir besoin d''EQ excessive. Les graves restent solides mais plus contrôlés, ce qui le rend plus facile à utiliser dans des pièces à l''acoustique imparfaite. Il intègre une innovation majeure avec un résonateur acoustique interne qui minimise les résonances de boîtier, garantissant un son pur. Notez qu''il est vendu sans suspension élastique.',
  pros = to_jsonb(ARRAY['Le son Soyuz authentique', 'Présence moderne idéale pour le mix', 'Fabrication artisanale']),
  cons = to_jsonb(ARRAY['Suspension non incluse'])
WHERE id = '5df53462-a94d-4d4c-98e5-df50076176b0';

-- 6. Soyuz 1973 (Silver)
UPDATE products
SET 
  description = 'Le Soyuz 1973 finition argentée représente l''excellence artisanale accessible. Il est techniquement identique à la version noire, offrant la même excellence sonore dans une esthétique nickelée classique qui rappelle les micros vintage. Offrant une polyvalence tout-terrain, ce microphone est un véritable couteau suisse. Grâce à son pad atténuateur intégré (-10dB ou -20dB), il peut encaisser des niveaux de pression acoustique énormes, ce qui le rend parfait pour reprendre des amplis guitare poussés à fond ou des fûts de batterie. Sur les voix, il offre une clarté et un détail qui flattent les chanteurs pop et folk. Si vous cherchez votre premier vrai micro de studio et que vous ne voulez pas d''une copie sans âme, le 1973 est la porte d''entrée vers le son haut de gamme.',
  pros = to_jsonb(ARRAY['Pad atténuateur -10/-20dB', 'Polyvalence extrême', 'Look classique intemporel']),
  cons = to_jsonb(ARRAY['Nécessite une bonne acoustique'])
WHERE id = '55a574fd-9520-4d83-8d1f-31c76757fe53';

-- 7. MXL 2003a
UPDATE products
SET 
  description = 'Considéré comme le secret le mieux gardé de l''audio pro, le MXL 2003a est un phénomène souvent cité sur les forums spécialisés comme le meilleur rapport qualité/prix de tous les temps, rivalisant à l''oreille avec des micros coûtant 5 à 10 fois son prix. Il se distingue par une transparence rare grâce à sa capsule de 27mm conçue pour une réponse en fréquence remarquablement plate. Contrairement à beaucoup de micros bon marché qui boostent les aigus pour paraître détaillés au risque de devenir agressifs, le 2003a reste doux et naturel. Les graves sont profonds mais tendus, et les aigus filent haut sans dureté. C''est l''outil de travail parfait pour commencer car il ne colore pas excessivement le son, vous apprenant à bien placer votre micro et votre source. Livré avec sa suspension, c''est une affaire en or.',
  pros = to_jsonb(ARRAY['Neutralité impressionnante', 'Rapport Q/P imbattable', 'Suspension incluse']),
  cons = to_jsonb(ARRAY['Construction légère', 'Switchs fragiles'])
WHERE id = '47fe38c6-1b33-4654-97e5-61396b6e00c0';

-- 8. MXL 770
UPDATE products
SET 
  description = 'Devenu la voix du rap et du podcast, le MXL 770 s''est imposé comme une référence incontournable pour les voix urbaines et le broadcast amateur. Derrière son look noir et or agressif se cache un microphone à condensateur petit diaphragme habillé en grand, une conception qui lui confère une réactivité aux transitoires excellente. Le son du 770 est célèbre pour sa signature en V, offrant des basses gonflées et chaleureuses pour cet effet radio recherché, et des aigus brillants qui assurent l''intelligibilité. C''est exactement ce que recherchent les rappeurs et les podcasters pour avoir une voix "larger than life" sans traitement complexe. Équipé d''un filtre coupe-bas pour nettoyer les grondements et d''un pad -10dB, il est étonnamment bien équipé pour son prix.',
  pros = to_jsonb(ARRAY['Graves profonds et flatteurs', 'Clarté immédiate', 'Prix très agressif']),
  cons = to_jsonb(ARRAY['Peut être sibilant (sifflant)'])
WHERE id = '10e5e673-4eb6-4662-8ed6-3f187f3cb0b3';

-- 9. MXL 990
UPDATE products
SET 
  description = 'Le MXL 990 est une véritable légende champagne qui a démocratisé l''enregistrement à domicile au début des années 2000. Des millions de musiciens ont fait leurs premières prises avec ce micro à la finition caractéristique. Il offre une douceur soyeuse, contrairement au 770 qui est plus creusé. Le 990 présente un médium plus présent et des aigus plus soyeux, ce qui le fait souvent préférer pour les voix féminines, les voix off douces, et surtout les guitares acoustiques où sa brillance contrôlée fait merveille. C''est un micro qui pardonne facilement les erreurs de placement. Livré dans une valise de transport robuste avec sa suspension, c''est le kit de démarrage idéal et un classique qui n''a pas pris une ride.',
  pros = to_jsonb(ARRAY['Sonorité équilibrée et musicale', 'Kit complet avec valise', 'Robustesse éprouvée']),
  cons = to_jsonb(ARRAY['Souffle (bruit de fond) moyen'])
WHERE id = '1fc28376-6016-4cd1-8247-a1337f9d3122';

-- 10. Audio-Technica AE 3000
UPDATE products
SET 
  description = 'L''Audio-Technica AE 3000 est un outil de précision conçu pour le renforcement sonore live et le studio. C''est un condensateur large membrane à adresse latérale optimisé pour les sources à fort niveau de pression. Compact et résistant, sa tête grillagée plate permet de le positionner au plus près des peaux de toms ou des grilles d''amplis guitare sans gêner le musicien. Il peut encaisser jusqu''à 158 dB SPL avec le pad activé, ce qui en fait le micro idéal pour capturer l''impact physique du son. Il offre une sonorité très détaillée et rapide. Sur les toms, il donne ce son tonnerre avec beaucoup d''attaque. Sur les amplis guitare, il capture le grain de la distorsion avec une fidélité chirurgicale que les dynamiques ne peuvent égaler.',
  pros = to_jsonb(ARRAY['Tenue en pression (SPL) exceptionnelle', 'Format plat ergonomique', 'Précision des transitoires']),
  cons = to_jsonb(ARRAY['Moins chaleureux pour le chant'])
WHERE id = '2b76e41d-cf2c-434c-a3a4-3463abd5cc53';
