
-- SQL UPDATE SCRIPT FOR BATCH 6 (PREMIUM DESCRIPTIONS)
-- Run this in your Supabase SQL Editor.

-- 1. Slate Digital ML-1A
UPDATE products SET 
  description = 'Le Slate Digital ML-1A est bien plus qu''un microphone, c''est un portail vers l''histoire de l''audio. Partie intégrante du Virtual Microphone System (VMS), ce microphone à condensateur large membrane ultra-linéaire est conçu pour être une toile vierge parfaite. Couplé au logiciel de modélisation inclus, il peut émuler avec une précision effrayante les microphones les plus légendaires du monde, des U47 allemands aux C800G japonais. Dans son édition ML-1A modernisée, il arbore un corps plus compact et intègre un pad atténuateur pour encaisser des niveaux sonores extrêmes sans broncher. C''est le choix ultime pour avoir un placard de micros à 50 000 euros pour le prix d''un seul.',
  pros = to_jsonb(ARRAY['Accès à une collection de micros légendaires', 'Neutralité parfaite pour la modélisation', 'Pad atténuateur intégré']),
  cons = to_jsonb(ARRAY['Nécessite le logiciel VMS (iLok)'])
WHERE id = 'ea845c9a-b94b-42ab-8d2c-2c18e97ce3b6';

-- 2. Microtech Gefell MT 71 S Satin Nickel
UPDATE products SET 
  description = 'Le Microtech Gefell MT 71 S est un chef-d''œuvre de l''ingénierie allemande, fabriqué dans l''usine historique fondée par Georg Neumann. Il utilise la célèbre capsule M7 (en version mylar) qui a fait la gloire des U47, mais montée dans un circuit FET moderne sans transformateur. Le résultat est un son d''une pureté absolue, avec des aigus cristallins qui ne sont jamais agressifs et une présence vocale naturelle. Sa directivité cardioïde est extrêmement bien contrôlée, ce qui le rend insensibles aux sons hors-axe. C''est un choix de prédilection pour les voix off, les instruments acoustiques et le broadcast haut de gamme.',
  pros = to_jsonb(ARRAY['La clarté Gefell légendaire', 'Capsule M7 modernisée', 'Bruit de fond très faible']),
  cons = to_jsonb(ARRAY['Look très sobre'])
WHERE id = '4da7786d-8ecb-4acd-8fcd-e7df2f3ff618';

-- 3. Ehrlund EHR-Nano
UPDATE products SET 
  description = 'L''Ehrlund EHR-NANO est un ovni dans le monde de l''audio. Conçu et fabriqué en Suède, il utilise une membrane triangulaire brevetée, inspirée de l''industrie aérospatiale. Contrairement aux membranes rondes qui ont des modes de résonance complexes, la forme triangulaire amortit naturellement les résonances parasites. Le résultat est un son d''une rapidité et d''un réalisme époustouflants, souvent comparé à celui de l''oreille humaine elle-même. Malgré sa taille minuscule, il délivre un son géant et peut encaisser des pressions acoustiques énormes. C''est un outil secret pour capturer des transitoires percussion ou des guitares acoustiques avec une fidélité absolue.',
  pros = to_jsonb(ARRAY['Membrane triangulaire brevetée révolutionnaire', 'Réalisme proche de l''oreille humaine', 'Format ultra-compact']),
  cons = to_jsonb(ARRAY['Très sensible au placement'])
WHERE id = '1a00189f-36a3-427e-9326-5f20daac3441';

-- 4. RODE NT1 5th Generation Black
UPDATE products SET 
  description = 'Le RØDE NT1 5ème Génération marque une révolution dans le studio moderne. C''est le premier microphone au monde à offrir une double connectivité XLR et USB-C (Dual Connect). En mode XLR, c''est le NT1 classique que l''on adore, avec son bruit de fond quasi inaudible (4dBA, le plus bas du monde). En mode USB, il débloque une interface audio 32-bit à virgule flottante, ce qui rend théoriquement impossible la saturation numérique (clipping). Vous pouvez crier autant que vous voulez, le son restera propre. C''est l''outil de création ultime, fusionnant la qualité analogique RØDE avec la technologie numérique de demain.',
  pros = to_jsonb(ARRAY['Double connectique XLR et USB-C', 'Enregistrement 32-bit float (impossbile à saturer)', 'Bruit de fond le plus bas du monde (4dBA)']),
  cons = to_jsonb(ARRAY['Nécessite un ordinateur récent pour le 32-bit float'])
WHERE id = '766e65ff-f4fd-45c4-9db2-526e774c297d';

-- 5. RODE NT1 5th Generation Silver (B-Stock)
UPDATE products SET 
  description = 'Il s''agit d''un modèle B-Stock de l''innovant RØDE NT1 5ème Génération (Finition Argent). Profitez de la révolution Dual Connect (XLR + USB) et de l''enregistrement 32-bit float incroppable à un prix réduit. L''unité peut présenter de légères traces d''utilisation ou un emballage ouvert, mais conserve toutes ses performances sonores exceptionnelles et sa garantie.',
  pros = to_jsonb(ARRAY['Prix réduit', 'Technologie 32-bit float', 'Garantie conservée']),
  cons = to_jsonb(ARRAY['Traces cosmétiques possibles'])
WHERE id = '935ee3d5-a0b3-49a8-bca5-c462e895af39';

-- 6. RODE NT1 5th Generation Silver
UPDATE products SET 
  description = 'Le RØDE NT1 5ème Génération en finition argent classique offre la même révolution technologique que le modèle noir. Avec sa double sortie XLR et USB-C, il s''adapte à toutes les configurations. Sa capsule HF6 de 1 pouce délivre ce son chaud et soyeux typique des microphones vintage, mais avec un niveau de bruit technique inexistant. L''enregistrement en 32-bit float via USB change la donne pour les home-studistes, éliminant le besoin de régler le gain parfaitement. C''est le micro à tout faire le plus avancé de sa catégorie.',
  pros = to_jsonb(ARRAY['Dual Connect XLR/USB', 'Technologie ''Unclippable'' 32-bit float', 'Sonorité vintage moderne']),
  cons = to_jsonb(ARRAY['Pas de sortie casque directe sur le micro'])
WHERE id = '58beec41-f3e9-4a8c-9192-162a2be9a452';

-- 7. RODE NT1 Signature Black
UPDATE products SET 
  description = 'Le RØDE NT1 Signature Series est l''héritier direct du légendaire NT1. C''est un pur microphone analogique (XLR uniquement) qui se concentre sur l''essentiel : le son. Il reprend la capsule HF6 du NT1 5ème Gen pour offrir cette signature sonore riche en graves et douce dans les aigus, idéale pour la voix et les instruments. Avec seulement 4 dBA de bruit de fond, c''est le micro à condensateur le plus silencieux au monde. Livré avec la suspension SM6 et un filtre anti-pop, c''est le standard de l''industrie pour le home-studio professionnel.',
  pros = to_jsonb(ARRAY['Le son NT1 pur analogique', 'Bruit de fond record (4dBA)', 'Kit complet avec suspension de luxe']),
  cons = to_jsonb(ARRAY['XLR uniquement (pas d''USB)'])
WHERE id = 'cb76dd20-b0ec-4f37-a5b6-1810b6f67472';

-- 8. RODE NT1 Signature Blue
UPDATE products SET 
  description = 'Le RØDE NT1 Signature Series (Édition Bleue) apporte une touche de couleur à votre studio tout en conservant les performances audio irréprochables du NT1. C''est une bête de studio analogique avec un bruit de fond inexistant, parfait pour capter les nuances les plus subtiles d''une voix ou d''une guitare acoustique. Sa finition bleue unique permet de distinguer vos micros ou simplement d''affirmer votre style.',
  pros = to_jsonb(ARRAY['Finition Bleue unique', 'Sonorité soyeuse et riche', 'Silence absolu']),
  cons = to_jsonb(ARRAY['Pas de coupe-bas ni de pad'])
WHERE id = '4d5e62d9-433e-4fca-8d4f-519fd3ff8cd5';

-- 9. RODE NT1 Signature Green
UPDATE products SET 
  description = 'L''édition Verte du RØDE NT1 Signature Series est conçue pour les créateurs qui veulent se démarquer. Sous cette couleur vibrante se cache le même moteur audio de précision : une capsule de 1 pouce fabriquée en Australie qui délivre un son de classe mondiale. Idéal pour les streamers utilisant un fond vert ou pour coder couleur vos sources en studio.',
  pros = to_jsonb(ARRAY['Couleur Verte distinctive', 'Fabriqué en Australie', 'Kit suspension inclus']),
  cons = to_jsonb(ARRAY['Le vert peut interférer avec le chroma key (fond vert)'])
WHERE id = '001b2308-e067-49af-9b8f-05cb2e865e73';

-- 10. RODE NT1 Signature Pink
UPDATE products SET 
  description = 'Le RØDE NT1 Signature Series en Rose est une déclaration de style audacieuse. C''est le même micro de studio de classe mondiale, utilisé pour d''innombrables hits, mais dans une finition rose superbe. Parfait pour les setup streaming thématiques ou pour ajouter de la vie à un studio austère. Le son reste celui du NT1 : chaud, défini et incroyablement silencieux.',
  pros = to_jsonb(ARRAY['Esthétique Rose superbe', 'Performance audio pro', 'Garantie 10 ans RØDE']),
  cons = to_jsonb(ARRAY['Look très typé'])
WHERE id = '417c5d65-ca29-4333-b326-95e96a409afb';

-- 11. RODE NT1 Signature Purple
UPDATE products SET 
  description = 'Le RØDE NT1 Signature Series Violet offre une esthétique royale à votre configuration d''enregistrement. C''est le microphone cardioïde large membrane de référence, célébré pour sa capacité à flatter n''importe quelle voix. Robuste et fiable, il est conçu pour durer toute une vie de création musicale. Son niveau de bruit ultra-faible en fait également un excellent choix pour l''ASMR ou la voix off.',
  pros = to_jsonb(ARRAY['Finition Violet profond', 'Idéal ASMR (très silencieux)', 'Robustesse RØDE']),
  cons = to_jsonb(ARRAY['Fonctionnalités basiques (pas de switchs)'])
WHERE id = 'a3aca668-9bcc-4e82-a4d5-5e2414e8cf22';

-- 12. RODE NT1-A
UPDATE products SET 
  description = 'Le RØDE NT1-A est une véritable légende vivante. C''est le microphone qui a lancé des millions de home-studios. Reconnaissable à sa grille nickelée, il est célèbre pour sa présence dans les aigus qui donne un son "radio" immédiat et moderne. Bien qu''un peu plus brillant que le nouveau NT1 Signature, il reste un best-seller absolu grâce à son rapport qualité/prix imbattable et son package complet incluant suspension, câble et DVD (à l''époque !). C''est le premier micro sérieux de toute une génération.',
  pros = to_jsonb(ARRAY['Brillance moderne ("Air")', 'Le grand classique du home-studio', 'Niveau de sortie élevé']),
  cons = to_jsonb(ARRAY['Aigus parfois sibilants', 'Moins neutre que le NT1 noir'])
WHERE id = '34fcf6b8-a461-4d8f-9959-f23a70699652';

-- 13. RODE NT1000
UPDATE products SET 
  description = 'Le RØDE NT1000 est le grand frère musclé de la gamme. C''est un micro à condensateur ultra-silencieux (6dBA) logé dans un corps en métal lourd et indestructible. Sa particularité est son circuit sans transformateur qui offre une clarté et une transparence exceptionnelles. Il est souvent préféré pour les enregistrements de piano à queue et d''overheads de batterie grâce à sa capacité à capturer les transitoires avec précision. Sur la voix, il est moins coloré que le NT1-A, offrant un son plus fidèle et direct.',
  pros = to_jsonb(ARRAY['Construction tank lourd', 'Très neutre et précis', 'Idéal instruments acoustiques']),
  cons = to_jsonb(ARRAY['Très lourd (bon pied requis)'])
WHERE id = 'ddb6953b-48d0-4281-a68f-112e9e81d52f';

-- 14. RODE NT2-A
UPDATE products SET 
  description = 'Le RØDE NT2-A est la suite logique du NT1-A pour ceux qui veulent plus de contrôle. Il reprend la signature sonore moderne du NT1-A mais y ajoute une flexibilité totale : trois directivités (Omni, Cardio, 8), un filtre coupe-bas à trois positions et un pad atténuateur à trois positions. Les contrôles sont directement accessibles sur le corps du micro. C''est l''outil de travail polyvalent par excellence, capable de s''adapter à n''importe quelle source, de la voix chuchotée à la section de cuivres hurlante.',
  pros = to_jsonb(ARRAY['3 Directivités, 3 Filtres, 3 Pads', 'Polyvalence extrême', 'Son moderne et brillant']),
  cons = to_jsonb(ARRAY['Peut être agressif dans les aigus'])
WHERE id = 'a6bbdcff-d16d-4dc9-9926-ced7c03c46f5';

-- 15. RODE NT2000
UPDATE products SET 
  description = 'Le RØDE NT2000 est une merveille d''ingénierie unique au monde. Contrairement aux micros classiques qui ont des switchs à positions fixes, le NT2000 offre des réglages variables en continu pour la directivité, le filtre et le pad. Vous pouvez littéralement sculpter votre directivité entre cardioïde et omni pour trouver le point parfait. C''est le micro ultime pour les ingénieurs du son qui veulent un contrôle chirurgical sur leur prise de son. Doté de la capsule HF1 à doubleaphragme, il offre un son riche et plein.',
  pros = to_jsonb(ARRAY['Réglages variables en continu (Unique)', 'Contrôle total du son', 'Capsule double diaphragme HF1']),
  cons = to_jsonb(ARRAY['Complexe pour les débutants'])
WHERE id = '8a25a63f-9cbe-498c-a7d3-517843ece4d1';

-- 16. RODE NTK
UPDATE products SET 
  description = 'Le RØDE NTK est un monstre de chaleur. C''est un microphone à lampe (Valve) de classe A, conçu pour offrir ce son vintage, riche et épais que les micros à transistor ne peuvent pas tout à fait imiter. Il utilise une double triode 6922 sélectionnée à la main qui ajoute une compression naturelle et des harmoniques musicales à la voix. C''est le micro idéal pour les voix rock, pop et R&B qui ont besoin de caractère et de dimension. Il possède sa propre alimentation externe robuste.',
  pros = to_jsonb(ARRAY['Chaleur de la lampe (Valve)', 'Son énorme et épais', 'Alimentation externe incluse']),
  cons = to_jsonb(ARRAY['Pas de directivités multiples (Cardioïde seulement)'])
WHERE id = '66d7ebe9-6d2e-4e85-8e19-d8a3ffcef314';

-- 17. Aston Microphones Origin
UPDATE products SET 
  description = 'L''Aston Origin a bousculé l''industrie lors de sa sortie. Conçu et fabriqué au Royaume-Uni, ce micro au look industriel unique (avec sa tête en maille souple "wave-form") offre une qualité sonore qui rivalise avec des micros trois fois plus chers. Son son est direct, pure et organique, sans cette brillance artificielle souvent trouvée dans cette gamme de prix. C''est un favori des auteurs-compositeurs pour sa capacité à bien marier la voix et la guitare acoustique. Il intègre un filtre anti-pop en laine d''acier inoxydable directement dans la tête.',
  pros = to_jsonb(ARRAY['Fabriqué au Royaume-Uni', 'Look et design indestructibles', 'Sonorité organique et naturelle']),
  cons = to_jsonb(ARRAY['Pas de suspension (montage direct sur pied)'])
WHERE id = '76ea9811-6c9b-4c68-b3e0-fa9d394c8a22';

-- 18. Sontronics Orpheus
UPDATE products SET 
  description = 'Le Sontronics Orpheus ne passe pas inaperçu avec son design sphérique inspiré des années 50. Mais c''est avant tout un outil de studio redoutable. Sa capsule large membrane est montée de manière à flotter dans la grille, offrant une résonance naturelle très musicale. Avec ses trois directivités et son pad -10dB, il est très polyvalent. Il est particulièrement apprécié pour les voix d''hommes et le doublage (voix off) grâce à son effet de proximité qui donne une voix de radio instantanée, tout en gardant des aigus très doux.',
  pros = to_jsonb(ARRAY['Design sphérique inspirant', 'Effet de proximité flatteur', '3 Directivités']),
  cons = to_jsonb(ARRAY['Support lourd requis'])
WHERE id = '50676e6e-815a-48f8-84a2-1ce96f851fb7';

-- 19. AKG P220
UPDATE products SET 
  description = 'L''AKG P220 est le grand frère robuste de la série Perception. Contrairement au P120, il offre une véritable large membrane de 1 pouce qui capture un son chaud et clair. C''est un micro construit pour durer, avec un corps tout métal qui inspire confiance. Il est polyvalent, aussi à l''aise sur les voix que sur les amplis guitare bruyants grâce à son pad atténuateur. Avec sa suspension fournie et sa valise de transport en aluminium, c''est probablement le meilleur rapport qualité/prix pour un micro "sérieux" d''entrée de gamme.',
  pros = to_jsonb(ARRAY['Vraie large membrane', 'Valise aluminium et suspension incluses', 'Son AKG équilibré']),
  cons = to_jsonb(ARRAY['Un peu brillant'])
WHERE id = 'e6320af5-3307-46b1-9a8a-1dbd42b25d03';

-- 20. RODE Podcaster
UPDATE products SET 
  description = 'Le RØDE Podcaster a été l''un des pionniers du podcasting USB. C''est un microphone dynamique (comme les micros radio) mais avec une conversion A/N interne, se branchant directement en USB. Il offre ce son "broadcast" typique, avec une grosse présence dans les graves et une excellente réjection des bruits de fond. Contrairement aux micros à condensateur USB, il capture moins la réverbération de la pièce, ce qui le rend parfait pour enregistrer dans une chambre ou un bureau non traité. Il dispose d''une sortie casque directe pour s''entendre sans latence.',
  pros = to_jsonb(ARRAY['Son Broadcast dynamique (type radio)', 'Rejet des bruits ambiants', 'Plug & Play USB']),
  cons = to_jsonb(ARRAY['Limité au 18-bit/48kHz (un peu daté)'])
WHERE id = '89742cd7-0337-403b-91b1-0f4544d0cde9';
