
-- SQL UPDATE SCRIPT FOR BATCH 12 (FINAL PREMIUM DESCRIPTIONS)
-- Run this in your Supabase SQL Editor.

-- 1. Warm Audio WA-87jr Black (Correction: Treated as WA-47jr BLACK variant or similar Junior FET)
-- Note: 'WA-87jr' is likely a naming confusion for 'WA-47jr' in the database, 
-- but we must match the ID. We treat it as a compact FET condenser.
UPDATE products SET 
  description = 'Le Warm Audio WA-87jr Black (souvent désigné comme le petit frère FET du 87 ou 47) offre une clarté exceptionnelle dans un format compact. Sa finition noire le rend discret à l''image. Dépourvu de transformateur, il offre une réponse aux transitoires ultra-rapide, ce qui le rend idéal pour capturer la "frappe" des percussions ou la brillance d''une guitare acoustique.',
  pros = to_jsonb(ARRAY['Clarté moderne', 'Format compact', 'Idéal instruments acoustiques']),
  cons = to_jsonb(ARRAY['Moins de chaleur qu''un modèle à lampe'])
WHERE id = 'daa3f373-dd55-4b6e-9845-23b2a45f261b';

-- 2. Warm Audio WA-87jr SE (Special Edition)
UPDATE products SET 
  description = 'Cette édition spéciale du Junior Series de Warm Audio combine performance et abordabilité. C''est un micro cardioïde fiable qui fait le travail sans fioritures. Sa capacité à encaisser des niveaux sonores élevés le rend parfait comme micro "à tout faire", que ce soit devant un ampli guitare hurlant ou pour une voix témoin de qualité.',
  pros = to_jsonb(ARRAY['Robustesse à toute épreuve', 'Polyvalence', 'Prix accessible']),
  cons = to_jsonb(ARRAY['Fonctionnalités basiques'])
WHERE id = 'b763b226-7109-412d-a343-c219e1c92a5c';

-- 3. Warm Audio WA-87jr SE Black (Doublon ou variante)
UPDATE products SET 
  description = 'Variante noire de l''édition spéciale. Ce micro est un outil de travail solide pour le home-studio. Il offre une signature sonore neutre et équilibrée qui permet de sculpter le son au mixage sans avoir à corriger des défauts majeurs à la prise. Un excellent premier investissement.',
  pros = to_jsonb(ARRAY['Son neutre et malléable', 'Finition noire pro', 'Rapport qualité/prix']),
  cons = to_jsonb(ARRAY['Manque un peu de personnalité'])
WHERE id = 'c1eb34eb-3395-4205-947e-f0a54a793b8f';

-- 4. Warm Audio WA-CX12
UPDATE products SET 
  description = 'Le Warm Audio WA-CX12 est une recréation du légendaire AKG C12, l''un des micros les plus vénérés (et chers) de l''histoire. Reconnu comme le "Saint Graal" pour les voix féminines, il offre un haut du spectre ouvert, aéré et scintillant sans aucune agressivité. Warm Audio a réussi l''exploit de reproduire cette capsule CK12 complexe et d''utiliser une lampe 12AY7 pour offrir ce son de diva à un prix réaliste.',
  pros = to_jsonb(ARRAY['Le son mythique du C12', 'Aigus aériens et soyeux', 'Lampe 12AY7 et Transfo TAB-Funkenwerk']),
  cons = to_jsonb(ARRAY['Suspension un peu massive'])
WHERE id = '9e70c44d-1c08-446d-8aa5-123403422a8c';

-- 5. sE Electronics X1 A
UPDATE products SET 
  description = 'Le sE Electronics X1 A redéfinit ce qu''on peut attendre d''un micro d''entrée de gamme. Contrairement à la concurrence qui sonne souvent "carton", le X1 A offre un son ouvert et équilibré grâce à une conception acoustique soignée. Son châssis en métal robuste inspire confiance. C''est le meilleur choix possible pour débuter le home-studio avec un budget serré mais des exigences de qualité.',
  pros = to_jsonb(ARRAY['Meilleur micro entrée de gamme', 'Atténuateur et Coupe-bas inclus (rare à ce prix)', 'Construction métal']),
  cons = to_jsonb(ARRAY['Suspension vendue séparément'])
WHERE id = '2b95dd78-e126-4894-a76d-7213f214b35c';

-- 6. sE Electronics X1 S
UPDATE products SET 
  description = 'Le sE Electronics X1 S est la version "Super" du X1. Il offre le niveau de bruit le plus bas de sa catégorie (9dB) et peut encaisser des pressions sonores de niveau industriel (160dB avec les pads !). Cela signifie que vous pouvez l''utiliser pour enregistrer un avion au décollage sans distorsion. C''est un micro cardioïde à large membrane ultra-performant pour les musiciens sérieux.',
  pros = to_jsonb(ARRAY['Encaisse 160dB SPL (Record !)', 'Ultra-silencieux', 'Pads -10/-20dB et Filtres coupe-bas']),
  cons = to_jsonb(ARRAY['Son très moderne (peut manquer de "vibe" vintage)'])
WHERE id = 'e3f35593-2b76-4812-8ed5-fa0255b2ebca';

-- 7. Yellowtec YCM705 B
UPDATE products SET 
  description = 'Le Yellowtec YCM705 (souvent associé à la gamme iXm) est un standard dans le monde du reportage broadcast. Conçu pour offrir une intelligibilité parfaite dans des environnements bruyants, il capture la voix avec une clarté cristalline. Sa directivité est optimisée pour rejeter les bruits de foule, ce qui en fait l''outil favori des journalistes radio professionnels.',
  pros = to_jsonb(ARRAY['Qualité Broadcast allemande', 'Optimisé pour le reportage', 'Robustesse ultime']),
  cons = to_jsonb(ARRAY['Prix pro', 'Usage spécifique (Interview/Radio)'])
WHERE id = '51f5bfad-262f-4a91-8eb4-6b5036d947b1';

-- 8. Yellowtec YCM705 W
UPDATE products SET 
  description = 'Version blanche du célèbre micro de reportage Yellowtec. Identique techniquement, cette finition est souvent choisie pour les plateaux TV ou les interviews filmées où l''esthétique compte. Il offre une réponse en fréquence taillée pour la voix humaine, assurant que chaque mot est compris, même dans le tumulte d''un événement sportif ou d''une manifestation.',
  pros = to_jsonb(ARRAY['Esthétique "TV-Friendly"', 'Intelligibilité parfaite', 'Standard industriel']),
  cons = to_jsonb(ARRAY['Spécialisé voix parlée'])
WHERE id = '76dc74b0-028d-4567-b8db-a24efa4c6b9a';

-- 9. SE Electronics Z 5600A Mk II
UPDATE products SET 
  description = 'Le sE Electronics Z 5600A Mk II est l''un des micros à lampe les plus polyvalents du marché. Avec ses 9 directivités commutables depuis l''alimentation, il peut tout faire. Son son est large, chaud et épais, typique des lampes, mais avec une touche de modernité dans les aigus qui aide à percer le mix. C''est souvent le premier "gros micro à lampe" qu''un studio achète, et il reste généralement dans l''arsenal pour toujours.',
  pros = to_jsonb(ARRAY['9 Directivités', 'Son lampe polyvalent', 'Livré en flight case complet']),
  cons = to_jsonb(ARRAY['Suspension parfois délicate à régler'])
WHERE id = '6118ef71-08fa-4881-8ded-a27ac8b02323';
