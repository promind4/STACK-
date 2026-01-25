
-- SQL UPDATE SCRIPT FOR ALL 19 WARM AUDIO MICROPHONES (CONSOLIDATED)
-- Description: Plain text descriptions, corrected encoding, added Pros/Cons.
-- Run this in Supabase SQL Editor to standardize the entire Warm Audio range.

-- 1. Warm Audio WA-14
UPDATE products SET 
  description = 'Le Warm Audio WA-14 est une récréation fidèle du légendaire AKG C414 EB avec sa capsule en laiton CK12 originale. Ce micro des années 70 est vénéré pour son son doux et soyeux, très différent des C414 modernes plus brillants. Warm Audio a recréé cette fameuse capsule "Lens Kondensator" et utilise un transformateur Cinemag US pour capturer cette magie. C''est le micro parfait si vous trouvez les micros modernes trop agressifs.',
  pros = to_jsonb(ARRAY['Le son C414 EB "Brass Capsule"', 'Douceur dans les aigus', 'Transformateur Cinemag USA']),
  cons = to_jsonb(ARRAY['Les switchs sont un peu plastiques'])
WHERE id = 'daf41d58-e0a3-4342-8adb-cc7fa0b53d34';

-- 2. Warm Audio WA-14SP
UPDATE products SET 
  description = 'Cette paire stéréo de Warm Audio WA-14 offre deux micros appairés en usine pour une image stéréo parfaite. Ils permettent d''accéder au son mythique de la capsule CK12 Brass en stéréo. C''est le setup de rêve pour enregistrer des overheads de batterie soyeux (fini les cymbales agressives !) ou un piano à queue avec cette chaleur vintage des années 70.',
  pros = to_jsonb(ARRAY['Paire appairée séquentielle', 'Sonorité soyeuse "Brass Capsule"', 'Kit stéréo complet avec barre']),
  cons = to_jsonb(ARRAY['Prix de la paire'])
WHERE id = '6458f1d1-2119-4034-ad55-82c4782df645';

-- 3. Warm Audio WA-251
UPDATE products SET 
  description = 'Le Warm Audio WA-251 vise le sommet : recréer le Telefunken ELA M 251E, l''un des micros les plus chers du monde. C''est un micro à lampe grand diaphragme qui offre des aigus d''une beauté et d''une ouverture incroyables, souvent décrits comme "aériens". Warm Audio utilise une capsule type CK12, un transformateur Cinemag et une lampe JJ 12AY7 pour approcher ce son de diva à un prix accessible au commun des mortels.',
  pros = to_jsonb(ARRAY['Le son 251 légendaire (Air)', 'Composants haut de gamme (Cinemag)', 'Idéal voix féminines']),
  cons = to_jsonb(ARRAY['Tube d''origine peut être amélioré'])
WHERE id = '945a3bdf-7577-4a46-885d-e5967d0b976f';

-- 4. Warm Audio WA-47
UPDATE products SET 
  description = 'Avec le WA-47, Warm Audio s''attaque au roi des micros : le Neumann U47. C''est un gros micro à lampe lourd et imposant qui délivre un son tout aussi massif. Il excelle dans les bas-médiums, donnant aux voix masculines cette autorité et cette "poitrine" caractéristiques des crooners. Utilisant une reproduction de la capsule K47 et un transformateur de sortie TAB-Funkenwerk, il offre 90% du son de l''original pour 10% du prix.',
  pros = to_jsonb(ARRAY['Son U47 massif et sombre', 'Transformateur TAB-Funkenwerk', '9 Directivités']),
  cons = to_jsonb(ARRAY['Très lourd et encombrant'])
WHERE id = 'e2a8b09a-cd95-4993-8b76-b79494a8a09b';

-- 5. Warm Audio WA-47F
UPDATE products SET 
  description = 'Le Warm Audio WA-47F est la réincarnation du U47 FET. C''est le micro "grosse caisse" par excellence. Il capture l''impact et le sub de la batterie comme aucun autre micro. Mais ne le cantonnez pas à ça : sur une voix rock ou métal criée, il est incroyable car il encaisse tout sans broncher et délivre un son prêt à être mixé. C''est le complément indispensable du WA-47 à lampe.',
  pros = to_jsonb(ARRAY['Réplique fidèle du U47 FET', 'Le roi du Kick Drum', 'Encaisse 147dB SPL']),
  cons = to_jsonb(ARRAY['Spécialisé (moins polyvalent que le WA-87)'])
WHERE id = 'cf6aebad-dfd7-4614-813f-7c1714744bfe';

-- 6. Warm Audio WA-47jr
UPDATE products SET 
  description = 'Le Warm Audio WA-47jr est une version FET sans transformateur du célèbre U47. Il utilise la même reproduction de capsule K47 que son grand frère à lampe, mais dans un format plus compact et moderne. Le résultat est un son qui garde la signature médium du 47 mais avec plus de précision et de rapidité. Avec ses 3 directivités et son prix accessible, c''est probablement le meilleur rapport qualité/prix pour avoir le "grain" 47 dans son home-studio.',
  pros = to_jsonb(ARRAY['Capsule style K47 authentique', '3 Directivités', 'Excellent rapport qualité/prix']),
  cons = to_jsonb(ARRAY['Moins de "poids" dans le grave que la version lampe'])
WHERE id = '052fdc2d-1140-45c4-8bd8-d555c0e86d70';

-- 7. Warm Audio WA-47jr Black
UPDATE products SET 
  description = 'Le WA-47jr Black est techniquement identique au modèle argenté mais arbore une finition noire élégante. Il offre la même polyvalence incroyable avec ses directivités Omni, Cardioïde et Figure-8. C''est un outil fantastique pour enregistrer des chœurs, des rooms de batterie ou deux chanteurs en face à face, apportant une touche de classe visuelle à votre setup.',
  pros = to_jsonb(ARRAY['Finition noire moderne', 'Polyvalence 3 directivités', 'Sonorité pro']),
  cons = to_jsonb(ARRAY['Esthétique seulement'])
WHERE id = 'd6d8d372-997d-415a-b61a-4b9ac1a57616';

-- 8. Warm Audio WA-47jr SE
UPDATE products SET 
  description = 'Cette édition spéciale du WA-47jr conserve toutes les qualités qui ont fait le succès du modèle : la capsule K47 reproduite fidèlement, le chemin de signal discret et le très faible bruit de fond. C''est un micro "workhorse" qui fonctionne sur tout, des voix rap agressives aux guitares acoustiques délicates, offrant toujours ce médium qui perce le mix.',
  pros = to_jsonb(ARRAY['Capsule Warm Audio K47', 'Circuit discret à faible bruit', 'Pads et filtres inclus']),
  cons = to_jsonb(ARRAY['Rien de spécial par rapport au standard'])
WHERE id = 'b763b226-7109-412d-a343-c219e1c92a5c';

-- 9. Warm Audio WA-47jr SE Black
UPDATE products SET 
  description = 'Édition noire spéciale du WA-47jr. Ce micro prouve qu''on n''a pas besoin de dépenser des milliers d''euros pour avoir un son professionnel. Son absence de transformateur lui donne une clarté moderne qui complète bien la chaleur naturelle de sa capsule vintage. Un choix esthétique et sonore sûr.',
  pros = to_jsonb(ARRAY['Look "Stealth"', 'Clarté et précision', 'Polyvalence']),
  cons = to_jsonb(ARRAY['Identique au modèle standard'])
WHERE id = 'c1eb34eb-3395-4205-947e-f0a54a793b8f';

-- 10. Warm Audio WA-67
UPDATE products SET 
  description = 'Le Warm Audio WA-67 est une recréation ambitieuse du Neumann U67 original. Il ne fait pas semblant : il utilise une vraie lampe pentode EF86, un tranformateur custom Lundahl suédois et une capsule en laiton style K67. Le son est riche, crémeux et organique, parfait pour "calmer" les sources agressives ou les voix digitales. C''est l''expérience vintage complète (y compris l''alimentation lourde) pour une fraction du prix d''un original.',
  pros = to_jsonb(ARRAY['Vrai circuit à lampe EF86', 'Transformateur Lundahl massif', 'Son vintage crémeux']),
  cons = to_jsonb(ARRAY['Câble 7 broches un peu rigide'])
WHERE id = '9e70c44d-1c08-446d-8aa5-123403422a8c';

-- 11. Warm Audio WA-8000
UPDATE products SET 
  description = 'Avec le WA-8000, Warm Audio rend le son du hip-hop moderne accessible. C''est une réplique fidèle du Sony C-800G, reconnaissable à son radiateur externe. Il utilise une lampe 6AU6 et un transformateur Lundahl pour délivrer ce haut du spectre "ouvert" et "aéré" typique des tubes de R&B des années 90/2000. Si vous cherchez ce son vocal brillant et luxueux à la Mariah Carey ou Dr. Dre, c''est le micro qu''il vous faut.',
  pros = to_jsonb(ARRAY['Le son R&B/Rap Platinum', 'Lampe 6AU6 NOS', 'Transformateur Lundahl']),
  cons = to_jsonb(ARRAY['Encombrant et lourd'])
WHERE id = '7e787c25-3f86-48a8-a920-4e279390d8fa';

-- 12. Warm Audio WA-8000G
UPDATE products SET 
  description = 'Le WA-8000G est l''édition limitée dorée du WA-8000. Parce que le son du rap de luxe mérite un look à la hauteur. Techniquement identique au modèle standard avec sa lampe NOS et son transformateur Lundahl, il ajoute une finition or qui en fait la pièce maîtresse absolue de toute cabine vocale. C''est un micro pour ceux qui veulent que leur studio soit aussi impressionnant visuellement que sonorement.',
  pros = to_jsonb(ARRAY['Finition OR exclusive', 'Le son légendaire du C-800G', 'Composants premium']),
  cons = to_jsonb(ARRAY['Attire les traces de doigts'])
WHERE id = 'ef65b761-903c-4985-8780-2dfc38250562';

-- 13. Warm Audio WA-87 R2 (Revision 2)
UPDATE products SET 
  description = 'Le WA-87 R2 est la deuxième version améliorée du best-seller de Warm Audio. Il vise à reproduire le son du Neumann U87 vintage original (pas le modèle Ai moderne). Le son est plus gros, plus chaud et plus doux que la version précédente, grâce à un nouveau transformateur Cinemag plus gros. C''est le micro à tout faire par excellence : voix, guitares, batterie... il sonne bien sur tout.',
  pros = to_jsonb(ARRAY['Son U87 Vintage (plus chaud que le moderne)', 'Transformateur Cinemag USA custom', 'Corps en laiton massif']),
  cons = to_jsonb(ARRAY['Suspension un peu dure à mettre'])
WHERE id = 'd9707f0a-8f10-4beb-843c-f25c19ccb213';

-- 14. Warm Audio WA-87 R2B
UPDATE products SET 
  description = 'Le WA-87 R2B offre le son classique des années 60/70 dans une robe noire moderne. Offrant les mêmes composants haut de gamme (capsule reproduction K87, transfo Cinemag), il est l''outil de travail quotidien du studio. Sa capacité à accepter l''égalisation est phénoménale : vous pouvez booster les aigus sans que cela devienne agressif, comme sur les vrais classiques.',
  pros = to_jsonb(ARRAY['Look Noir Pro', 'Sonorité classique et versatile', 'Excellent sur les voix rock']),
  cons = to_jsonb(ARRAY['Interrupteurs un peu petits'])
WHERE id = '8086a18d-1a3b-450c-9f7f-1a36e64e1207';

-- 15. Warm Audio WA-87jr (Le retour du JR)
UPDATE products SET 
  description = 'Le modèle WA-87jr propose une approche FET sans transformateur du son ''87 dans un format simplifié et économique. Sa directivité cardioïde fixe et son circuit rapide en font un excellent micro de travail pour les sources qui demandent plus de clarté que de chaleur, comme les voix off, les guitares folk ou les percussions.',
  pros = to_jsonb(ARRAY['Format compact', 'Clarté moderne', 'Budget maîtrisé']),
  cons = to_jsonb(ARRAY['Cardioïde uniquement'])
WHERE id = 'daa3f373-dd55-4b6e-9845-23b2a45f261b';

-- 16. Warm Audio WA-87jr Black
UPDATE products SET 
  description = 'Version noire du compact WA-87jr. C''est le micro idéal pour les podcasteurs filmés qui veulent un son de qualité studio sans qu''un énorme micro argenté ne vole la vedette à l''image. Sa réponse en fréquence plate et honnête facilite grandement le travail de post-production.',
  pros = to_jsonb(ARRAY['Discrétion visuelle', 'Son neutre et propre', 'Robuste']),
  cons = to_jsonb(ARRAY['Moins de caractère qu''un micro à lampe'])
WHERE id = 'ddefe140-1373-4746-a0d5-278b396f612d';

-- 17. Warm Audio WA-87jr SE
UPDATE products SET 
  description = 'La série SE du WA-87jr offre une alternative robuste pour les environnements exigeants. Que ce soit pour un home-studio débutant ou comme micro d''appoint dans une grosse configuration, il délivre des performances fiables. Son absence de transformateur lui confère un bruit de fond très bas, ce qui est un atout pour les prises de son de sources faibles.',
  pros = to_jsonb(ARRAY['Bruit de fond très bas', 'Fiabilité', 'Polyvalence']),
  cons = to_jsonb(ARRAY['Pas de "mojo" vintage'])
WHERE id = 'a7f884bb-92c3-4e1c-a8e3-bf16c6982cf7';

-- 18. Warm Audio WA-87jr SE Black
UPDATE products SET 
  description = 'Le WA-87jr SE Black est l''outil utilitaire par excellence. Discret, efficace et abordable, il permet d''équiper un studio avec plusieurs micros de qualité homogène sans se ruiner. Parfait pour enregistrer des Toms de batterie ou une section de cuivres où la cohérence entre les micros est primordiale.',
  pros = to_jsonb(ARRAY['Idéal pour l''achat en nombre', 'Cohérence sonore', 'Look pro']),
  cons = to_jsonb(ARRAY['Fonctionnalités basiques'])
WHERE id = 'f4e33861-8f6c-4a6c-825b-22f7f0b73684';

-- 19. Warm Audio WA-CX12
UPDATE products SET 
  description = 'Le Warm Audio WA-CX12 est le fleuron de la marque pour les voix. Recréant l''AKG C12, il offre ce qu''aucun autre micro à ce prix ne peut offrir : un haut du spectre qui brille littéralement. Les aigus sont soyeux, ouverts et jamais durs. C''est le secret pour obtenir des voix pop modernes et aérées qui flottent au-dessus du mix sans effort. Une réussite technique majeure.',
  pros = to_jsonb(ARRAY['Magie des aigus (le "Air")', 'Lampe 12AY7 authentique', 'Capsule style CK12 complexe']),
  cons = to_jsonb(ARRAY['Lourd et nécessite un pied solide'])
WHERE id = 'd428f5be-5a93-4e3c-b394-c9a62be6f10b';
