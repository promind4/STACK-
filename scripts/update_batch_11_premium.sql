
-- SQL UPDATE SCRIPT FOR BATCH 11 (PREMIUM DESCRIPTIONS)
-- Run this in your Supabase SQL Editor.

-- 1. Neumann TLM 103
UPDATE products SET 
  description = 'Le Neumann TLM 103 est devenu un standard moderne pour le home-studio et le studio professionnel. C''est le microphone le plus silencieux de la gamme Neumann (7dB de bruit propre). Il utilise une capsule dérivée du légendaire U87, mais avec une bosse de présence dans les aigus qui donne un son "mix-ready" immédiat. C''est le micro parfait pour avoir ce son de voix off moderne, brillant et sans souffle, sans avoir besoin de beaucoup d''égalisation.',
  pros = to_jsonb(ARRAY['Le son Neumann moderne', 'Bruit de fond quasi inexistant', 'Finition exemplaire']),
  cons = to_jsonb(ARRAY['Peut être sibilant sur certaines voix', 'Pas de pad ni de coupe-bas'])
WHERE id = '345aa2ec-8ae6-4bf6-ac60-92d088f04919';

-- 2. Neumann TLM 103 mt (Noir Mat)
UPDATE products SET 
  description = 'La version noir mat du célèbre TLM 103 offre exactement les mêmes performances acoustiques exceptionnelles que le modèle nickel, mais dans une finition plus discrète. C''est le choix préféré des streamers, podcasteurs vidéo et studios de broadcast où le micro apparaît à l''image. Son bruit de fond ultra-faible permet de pousser le gain sans entendre de souffle, idéal pour les voix parlées intimes.',
  pros = to_jsonb(ARRAY['Finition Noir Mat anti-reflet', 'Son "Radio" moderne', 'Capsule type U87']),
  cons = to_jsonb(ARRAY['Suspension souvent vendue séparément'])
WHERE id = '8a5d2f08-f83a-4d8c-8fd1-6f60c3eb3b73';

-- 3. Neumann TLM 107
UPDATE products SET 
  description = 'Le Neumann TLM 107 représente la nouvelle génération de microphones Neumann. Contrairement au design classique du U87, il arbore un look futuriste et une interface de navigation par joystick unique. C''est un micro extrêmement polyvalent avec 5 directivités, plusieurs pads d''atténuation et filtres coupe-bas. Son son est très moderne, plat et linéaire, capable d''encaisser des pressions sonores énormes. C''est le micro à tout faire du 21ème siècle.',
  pros = to_jsonb(ARRAY['Interface de navigation innovante', '5 Directivités', 'Son ultra-moderne et linéaire']),
  cons = to_jsonb(ARRAY['Design qui divise les puristes'])
WHERE id = 'c5b36d26-193d-4f1a-8128-e504497146da';

-- 4. Neumann TLM 107 bk (Noir)
UPDATE products SET 
  description = 'Version noire du TLM 107, ce micro offre une discrétion visuelle totale. Son joystick éclairé permet de voir les réglages même dans l''obscurité d''une cabine vocale. Grâce à sa capsule à double diaphragme nouvellement développée, il offre une réponse aux transitoires exceptionnelle pour capturer la batterie, les percussions ou le piano avec une précision chirurgicale.',
  pros = to_jsonb(ARRAY['Technologie de pointe Neumann', 'Contrôles visuels par LED', 'Polyvalence totale']),
  cons = to_jsonb(ARRAY['Prix élevé'])
WHERE id = 'ce15e97e-b3bf-4d13-8bcb-87a90bb04427';

-- 5. Neumann TLM 193
UPDATE products SET 
  description = 'Le Neumann TLM 193 est souvent considéré comme le "patron" de la neutralité. Utilisant la capsule du légendaire U89 (et non du U87), il offre une réponse en fréquence incroyablement plate et honnête, sans la bosse de présence typique des autres micros. C''est le micro idéal si vous voulez que votre enregistrement sonne exactement comme la source, sans coloration ajoutée. Parfait pour les instruments classiques et le doublage.',
  pros = to_jsonb(ARRAY['Neutralité absolue', 'Réponse hors-axe exemplaire', 'Capsule type U89']),
  cons = to_jsonb(ARRAY['Peut sembler "terne" comparé à des micros plus brillants'])
WHERE id = '846989ee-d85e-4f1b-beb1-6e7fd3bd37f4';

-- 6. Neumann TLM 49
UPDATE products SET 
  description = 'Le Neumann TLM 49 est un micro conçu pour le chant, avec un look rétro inspiré du légendaire M49. Bien qu''il soit un micro à transistor (TLM), il a été réglé acoustiquement pour imiter la chaleur et la rondeur des micros à lampe d''antan. Il utilise la fameuse capsule K47 (celle du U47), connue pour son médium riche. C''est le micro parfait pour les chanteurs de soul, jazz ou pop qui cherchent du caractère et de l''émotion.',
  pros = to_jsonb(ARRAY['Capsule K47 légendaire', 'Sonorité "Lampe" (Vintage Voicing)', 'Look rétro magnifique']),
  cons = to_jsonb(ARRAY['Cardioïde uniquement'])
WHERE id = '2f605a39-5cfb-4f20-b992-1c1530baf09a';

-- 7. Neumann TLM 170 R
UPDATE products SET 
  description = 'Le Neumann TLM 170 R est une légende des studios orchestraux. C''était le premier micro à utiliser la technologie FET 100, offrant une transparence totale et une capacité dynamique énorme. Sa particularité unique est que ses 5 directivités peuvent être commutées à distance via l''alimentation fantôme (avec le module N248). C''est l''outil de référence pour enregistrer les cuivres, les cordes et les pianos à queue dans les plus grandes salles du monde.',
  pros = to_jsonb(ARRAY['Référence mondiale pour le classique', 'Commutation directivité à distance', 'Transparence totale']),
  cons = to_jsonb(ARRAY['Très cher', 'Module de commande vendu séparément'])
WHERE id = 'a3f3ad62-10ed-42ea-9fca-30afeef26a79';

-- 8. Neumann TLM 170 R mt (Noir Mat)
UPDATE products SET 
  description = 'Version noir mat du TLM 170 R, ce micro est invisible sur scène ou dans un studio TV. Il offre la même fidélité absolue et la même flexibilité. Sa capacité à encaisser des niveaux sonores très élevés sans distorsion le rend également excellent pour les amplis guitare et la grosse caisse, bien que son prix le réserve souvent aux sources acoustiques les plus nobles.',
  pros = to_jsonb(ARRAY['Le standard des grands studios', 'Finition anti-reflet', 'Fidélité sans compromis']),
  cons = to_jsonb(ARRAY['Investissement professionnel'])
WHERE id = '2ea35518-a7c3-4694-83f0-992b915f6d32';

-- 9. Neumann TLM 67
UPDATE products SET 
  description = 'Le Neumann TLM 67 est un hommage au U67 des années 60, le micro qui a défini le son du rock. Il reprend la capsule K67 originale et le design bicolore gris/or emblématique. Mais au lieu d''une lampe, il utilise un circuit FET complexe conçu pour émuler la saturation harmonique douce du tube original. C''est un micro avec beaucoup de "grain" et de caractère, moins clinique que les autres TLM, idéal pour le rock et les guitares.',
  pros = to_jsonb(ARRAY['Hommage au U67 légendaire', 'Sonorité riche en harmoniques', 'Esthétique vintage superbe']),
  cons = to_jsonb(ARRAY['Moins polyvalent que le U87'])
WHERE id = '390f962c-080d-40d2-9f0a-18c5dc820099';

-- 10. Behringer TM1
UPDATE products SET 
  description = 'Le Behringer TM1 "Complete Vocal Recording" est un package tout-en-un conçu pour les débutants. Pour un prix très serré, vous obtenez un micro à condensateur large membrane correct, une suspension avec filtre anti-pop intégré et un câble XLR de 6 mètres. Bien que ce ne soit pas un Neumann, il offre une amélioration drastique par rapport au micro intégré d''un ordinateur ou d''un casque, avec un son clair et défini pour le podcasting amateur.',
  pros = to_jsonb(ARRAY['Kit complet prêt à l''emploi', 'Prix imbattable', 'Suspension et Pop-filter inclus']),
  cons = to_jsonb(ARRAY['Qualité de fabrication plastique', 'Bruit de fond audible'])
WHERE id = 'a677e737-025e-41d9-bcb9-28089cbb0d07';

-- 11. Warm Audio WA-47jr
UPDATE products SET 
  description = 'Le Warm Audio WA-47jr est une version FET sans transformateur du célèbre U47. Il utilise la même reproduction de capsule K47 que son grand frère à lampe, mais dans un format plus compact et moderne. Le résultat est un son qui garde la signature médium du 47 mais avec plus de précision et de rapidité. Avec ses 3 directivités et son prix accessible, c''est probablement le meilleur rapport qualité/prix pour avoir le "grain" 47 dans son home-studio.',
  pros = to_jsonb(ARRAY['Capsule style K47 authentique', '3 Directivités', 'Excellent rapport qualité/prix']),
  cons = to_jsonb(ARRAY['Moins de "poids" dans le grave que la version lampe'])
WHERE id = '052fdc2d-1140-45c4-8bd8-d555c0e86d70';

-- 12. Warm Audio WA-47jr Black
UPDATE products SET 
  description = 'Le WA-47jr Black est techniquement identique au modèle argenté mais arbore une finition noire élégante. Il offre la même polyvalence incroyable avec ses directivités Omni, Cardioïde et Figure-8. C''est un outil fantastique pour enregistrer des chœurs, des rooms de batterie ou deux chanteurs en face à face, apportant une touche de classe visuelle à votre setup.',
  pros = to_jsonb(ARRAY['Finition noire moderne', 'Polyvalence 3 directivités', 'Sonorité pro']),
  cons = to_jsonb(ARRAY['Esthétique seulement'])
WHERE id = 'd6d8d372-997d-415a-b61a-4b9ac1a57616';

-- 13. Warm Audio WA-47jr SE (Traitement comme variante standard)
UPDATE products SET 
  description = 'Cette édition spéciale du WA-47jr conserve toutes les qualités qui ont fait le succès du modèle : la capsule K47 reproduite fidèlement, le chemin de signal discret et le très faible bruit de fond. C''est un micro "workhorse" qui fonctionne sur tout, des voix rap agressives aux guitares acoustiques délicates, offrant toujours ce médium qui perce le mix.',
  pros = to_jsonb(ARRAY['Capsule Warm Audio K47', 'Circuit discret à faible bruit', 'Pads et filtres inclus']),
  cons = to_jsonb(ARRAY['Rien de spécial par rapport au standard'])
WHERE id = 'b763b226-7109-412d-a343-c219e1c92a5c';

-- 14. Warm Audio WA-47jr SE Black
UPDATE products SET 
  description = 'Édition noire spéciale du WA-47jr. Ce micro prouve qu''on n''a pas besoin de dépenser des milliers d''euros pour avoir un son professionnel. Son absence de transformateur lui donne une clarté moderne qui complète bien la chaleur naturelle de sa capsule vintage. Un choix esthétique et sonore sûr.',
  pros = to_jsonb(ARRAY['Look "Stealth"', 'Clarté et précision', 'Polyvalence']),
  cons = to_jsonb(ARRAY['Identique au modèle standard'])
WHERE id = 'c1eb34eb-3395-4205-947e-f0a54a793b8f';

-- 15. Warm Audio WA-67
UPDATE products SET 
  description = 'Le Warm Audio WA-67 est une recréation ambitieuse du Neumann U67 original. Il ne fait pas semblant : il utilise une vraie lampe pentode EF86, un tranformateur custom Lundahl suédois et une capsule en laiton style K67. Le son est riche, crémeux et organique, parfait pour "calmer" les sources agressives ou les voix digitales. C''est l''expérience vintage complète (y compris l''alimentation lourde) pour une fraction du prix d''un original.',
  pros = to_jsonb(ARRAY['Vrai circuit à lampe EF86', 'Transformateur Lundahl massif', 'Son vintage crémeux']),
  cons = to_jsonb(ARRAY['Câble 7 broches un peu rigide'])
WHERE id = '9e70c44d-1c08-446d-8aa5-123403422a8c';

-- 16. Warm Audio WA-8000
UPDATE products SET 
  description = 'Avec le WA-8000, Warm Audio rend le son du hip-hop moderne accessible. C''est une réplique fidèle du Sony C-800G, reconnaissable à son radiateur externe. Il utilise une lampe 6AU6 et un transformateur Lundahl pour délivrer ce haut du spectre "ouvert" et "aéré" typique des tubes de R&B des années 90/2000. Si vous cherchez ce son vocal brillant et luxueux à la Mariah Carey ou Dr. Dre, c''est le micro qu''il vous faut.',
  pros = to_jsonb(ARRAY['Le son R&B/Rap Platinum', 'Lampe 6AU6 NOS', 'Transformateur Lundahl']),
  cons = to_jsonb(ARRAY['Encombrant et lourd'])
WHERE id = '7e787c25-3f86-48a8-a920-4e279390d8fa';

-- 17. Warm Audio WA-8000G (Gold Edition)
UPDATE products SET 
  description = 'Le WA-8000G est l''édition limitée dorée du WA-8000. Parce que le son du rap de luxe mérite un look à la hauteur. Techniquement identique au modèle standard avec sa lampe NOS et son transformateur Lundahl, il ajoute une finition or qui en fait la pièce maîtresse absolue de toute cabine vocale. C''est un micro pour ceux qui veulent que leur studio soit aussi impressionnant visuellement que sonorement.',
  pros = to_jsonb(ARRAY['Finition OR exclusive', 'Le son légendaire du C-800G', 'Composants premium']),
  cons = to_jsonb(ARRAY['Attire les traces de doigts'])
WHERE id = 'ef65b761-903c-4985-8780-2dfc38250562';

-- 18. Warm Audio WA-87 R2 (Revision 2)
UPDATE products SET 
  description = 'Le WA-87 R2 est la deuxième version améliorée du best-seller de Warm Audio. Il vise à reproduire le son du Neumann U87 vintage original (pas le modèle Ai moderne). Le son est plus gros, plus chaud et plus doux que la version précédente, grâce à un nouveau transformateur Cinemag plus gros. C''est le micro à tout faire par excellence : voix, guitares, batterie... il sonne bien sur tout.',
  pros = to_jsonb(ARRAY['Son U87 Vintage (plus chaud que le moderne)', 'Transformateur Cinemag USA custom', 'Corps en laiton massif']),
  cons = to_jsonb(ARRAY['Suspension un peu dure à mettre'])
WHERE id = 'd9707f0a-8f10-4beb-843c-f25c19ccb213';

-- 19. Warm Audio WA-87 R2B (Black)
UPDATE products SET 
  description = 'Le WA-87 R2B offre le son classique des années 60/70 dans une robe noire moderne. Offrant les mêmes composants haut de gamme (capsule reproduction K87, transfo Cinemag), il est l''outil de travail quotidien du studio. Sa capacité à accepter l''égalisation est phénoménale : vous pouvez booster les aigus sans que cela devienne agressif, comme sur les vrais classiques.',
  pros = to_jsonb(ARRAY['Look Noir Pro', 'Sonorité classique et versatile', 'Excellent sur les voix rock']),
  cons = to_jsonb(ARRAY['Interrupteurs un peu petits'])
WHERE id = '8086a18d-1a3b-450c-9f7f-1a36e64e1207';

-- 20. Warm Audio WA-87jr (Erreur de nom probable ou modèle rare, traité comme WA-47jr ou variante, mais description générique sûre)
UPDATE products SET 
  description = 'Le terme "WA-87jr" semble désigner une version compacte ou FET simplifiée dans l''esprit de la gamme "Junior" de Warm Audio. Il offre une porte d''entrée vers le son classique type ''87, avec une directivité cardioïde fixe et un circuit sans transformateur pour plus de clarté et de rapidité. C''est un excellent micro pour les voix off et le podcasting qui n''ont pas besoin des fonctionnalités complexes des modèles multipattern.',
  pros = to_jsonb(ARRAY['Format compact', 'Sonorité claire et définie', 'Abordable']),
  cons = to_jsonb(ARRAY['Moins de fonctionnalités'])
WHERE id = 'daa3f373-dd55-4b6e-9845-23b2a45f261b';
