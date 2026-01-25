import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const updates = [
    {
        slug: 'electro-voice-re20',
        short_description: `✅ ON AIME : Le son "radio américaine" immédiat • L'absence totale d'effet de proximité • La construction indestructible.\n💡 À SAVOIR : Son niveau de sortie est très faible. Il nécessite un excellent préampli ou un activateur de gain (type FetHead).`
    },
    {
        slug: 'electro-voice-re20-black',
        short_description: `✅ ON AIME : Le look "Stealth" noir mat qui ne reflète pas les lumières en vidéo • La qualité sonore légendaire de l'original.\n💡 À SAVOIR : C'est un micro lourd (737g), assure-toi d'avoir un bras articulé robuste.`
    },
    {
        slug: 'rode-podmic',
        short_description: `✅ ON AIME : Le rapport qualité/prix imbattable • Le filtre anti-pop interne efficace • Le design "Broadcast" valorisant.\n💡 À SAVOIR : Gourmand en gain. Ne le branchez pas sur une petite carte son sans activateur.`
    },
    {
        slug: 'rode-podmic-usb',
        short_description: `✅ ON AIME : La polyvalence ultime (XLR + USB) • Le DSP APHEX intégré (son traité sans réglages) • La sortie casque zéro latence.\n💡 À SAVOIR : Plus cher que la version classique, mais il remplace aussi la carte son.`
    },
    {
        slug: 'heil-sound-pr40',
        short_description: `✅ ON AIME : Le son "large bande" ultra-détaillé (proche d'un condensateur) • L'isolation exceptionnelle des bruits de fond.\n💡 À SAVOIR : Effet de proximité très marqué : il faut parler collé au micro pour avoir le gros son.`
    },
    {
        slug: 'sennheiser-mke-600',
        short_description: `✅ ON AIME : L'alimentation par pile AA (sauve la vie sur le terrain) • Le son naturel • Le filtre coupe-bas efficace.\n💡 À SAVOIR : Il est assez long (25cm), attention au cadrage sur les petites caméras.`
    },
    {
        slug: 'rode-ntg3',
        short_description: `✅ ON AIME : La résistance totale à l'humidité (top pour l'extérieur) • Le son plus chaud que le 416 • Garantie 10 ans.\n💡 À SAVOIR : Nécessite impérativement du 48V (Phantom). Ne fonctionne pas sur pile.`
    },
    {
        slug: 'sennheiser-mkh-416',
        short_description: `✅ ON AIME : La référence absolue "Cinéma" • La portée incroyable • La robustesse légendaire.\n💡 À SAVOIR : Extrêmement directif. Si l'acteur sort de l'axe, le son coupe net.`
    },
    {
        slug: 'rode-ntg5',
        short_description: `✅ ON AIME : Le poids plume (76g !) • Le son moderne et transparent • Le kit complet inclus.\n💡 À SAVOIR : Très court pour un canon, ce qui change la prise en main.`
    },
    {
        slug: 'rode-videomic-go-ii',
        short_description: `✅ ON AIME : La double connectique USB-C (Ordi/Mobile) et Jack (Caméra) • La légèreté • Pas de batterie (Plug & Play).\n💡 À SAVOIR : Le câble USB-C pour iPhone/Android est souvent vendu séparément.`
    }
];

async function runUpdates() {
    console.log('Using key type: SERVICE_ROLE (Bypassing RLS)');
    console.log('Starting content updates...');

    for (const update of updates) {
        const { error } = await supabase
            .from('products')
            .update({
                short_description: update.short_description
            })
            .eq('slug', update.slug);

        if (error) {
            console.error(`❌ Failed to update ${update.slug}:`, error.message);
        } else {
            console.log(`✅ Updated short_description for ${update.slug}`);
        }
    }

    console.log(`Update complete.`);
}

runUpdates();
