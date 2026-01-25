import { Product } from '../types/database';

export type Vibe = 'minimalist' | 'rgb_gamer' | 'pro_studio' | 'vintage';
export type RoomType = 'untreated_bedroom' | 'treated_studio' | 'travel';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'pro';
export type Usage = 'streaming' | 'podcast' | 'music_vocals' | 'music_instruments' | 'video_calls';

export interface UserContext {
    usage: Usage;
    room: RoomType;
    experience: ExperienceLevel;
    budget: number;
    vibe: Vibe;
    computer: 'mac' | 'pc';
    hasMic: boolean;
    hasInterface: boolean;
    hasCamera: boolean;
    hasLights: boolean;
}

export interface RecommendationResult {
    mic: Product | null;
    audioInterface: Product | null;
    camera: Product | null;
    lights: Product[];
    accessories: Product[];
    totalCost: number;
    matchScore: number; // 0-100
    explanations: Record<string, string>; // ID -> Reason
}

// --- HELPER ---
const matches = (p: Product, keywords: string[]): boolean => {
    const text = (p.slug + ' ' + p.name + ' ' + (p.brand || '')).toLowerCase();
    return keywords.some(k => text.includes(k.toLowerCase()));
};

// --- TAGGING SYSTEM (Virtual Tags based on slugs/text) ---
const getTags = (p: Product): string[] => {
    const tags: string[] = [];
    const s = p.slug.toLowerCase();

    // INFER BROAD CATEGORY (Since we don't have category string on Product type)
    if (matches(p, ['mic', 'shure', 'rode', 'neumann', 'focusrite', 'cloudlifter', 'audio', 'son', 'sound'])) tags.push('cat_audio');
    if (matches(p, ['cam', 'sony', 'canon', 'lumix', 'gopro', 'facecam', 'insta360', 'brio', 'webcam'])) tags.push('cat_video');
    if (matches(p, ['light', 'keylight', 'aputure', 'godox', 'govee', 'nanoleaf', 'philips', 'elgato key'])) tags.push('cat_lighting');

    // MIC TYPES
    if (matches(p, ['sm7b', 'mv7', 'podmic', 'dynacaster', 're20', 'procaster'])) tags.push('dynamic', 'broadcast', 'low_sensitivity');
    if (matches(p, ['nt1', 'lct', 'at2020', 'u87', 'tlm', 'baby bottle'])) tags.push('condenser', 'sensitive', 'studio_quality');
    if (matches(p, ['usb', 'link'])) tags.push('usb_mic');

    // INTERFACE TYPES
    if (matches(p, ['scarlett', 'volt', 'audient', 'motu'])) tags.push('beginner_friendly', 'usb_c');
    if (matches(p, ['apollo', 'babyface', 'rme'])) tags.push('dsp', 'pro_converters');

    // VIBE
    if (matches(p, ['shure', 'universal', 'marshall', 'vintage', 'warm'])) tags.push('pro_studio', 'vintage');
    if (matches(p, ['rode', 'elgato', 'white', 'blanc'])) tags.push('minimalist', 'modern');
    if (matches(p, ['razer', 'beacon', 'rgb', 'nanoleaf', 'govee'])) tags.push('rgb_gamer');

    return tags;
};

// --- SCORING ALGORITHM ---
const scoreProduct = (p: Product, ctx: UserContext): number => {
    let score = 0;
    const tags = getTags(p);

    // 1. BUDGET FILTER (Hard/Soft)
    // We don't filter hard, but massive penalty if product > 70% of total budget alone
    if (p.price > ctx.budget * 0.7) return -500;

    // 2. ROOM ACCOUSTICS (Crucial for Mics)
    if (tags.includes('cat_audio')) {
        if (ctx.room === 'untreated_bedroom') {
            if (tags.includes('dynamic')) score += 100; // Dynamic rejects room noise
            if (tags.includes('condenser')) score -= 40; // Condenser hears bad room
        } else if (ctx.room === 'treated_studio') {
            if (tags.includes('condenser')) score += 80; // Studio loves condensers
        }
    }

    // 3. USAGE
    if (ctx.usage === 'streaming') {
        if (tags.includes('broadcast')) score += 50;
        if (tags.includes('rgb_gamer') && ctx.vibe === 'rgb_gamer') score += 40;
        if (matches(p, ['stream deck', 'elgato'])) score += 60;
    }

    if (ctx.usage === 'music_vocals') {
        if (tags.includes('studio_quality')) score += 80;
        if (tags.includes('usb_mic')) score -= 20; // Prefer XLR for music
    }

    if (ctx.usage === 'podcast') {
        if (tags.includes('broadcast')) score += 90;
    }

    // 4. VIBE MATCHING
    if (tags.includes(ctx.vibe)) score += 30;

    // 5. PRICE EFFICIENCY
    const budgetTier = ctx.budget > 1500 ? 'high' : 'low';
    if (budgetTier === 'high' && p.price > 300) score += 20; // Favor premium gear for high budget
    if (budgetTier === 'low' && p.price < 200) score += 30; // Favor budget gear

    return score;
};

// --- MAIN ENGINE ---
export const generateRecommendation = (products: Product[], ctx: UserContext): RecommendationResult => {
    const result: RecommendationResult = {
        mic: null,
        audioInterface: null,
        camera: null,
        lights: [],
        accessories: [],
        totalCost: 0,
        matchScore: 0,
        explanations: {}
    };

    // DEBUG: Ensure we have products
    if (!products || products.length === 0) return result;

    // Filter Categories using new intelligent tagging
    // We use a safe filter: is it broadly an audio device?
    // And specially, is it a Microphone?
    const mics = products.filter(p => {
        const tags = getTags(p);
        return tags.includes('cat_audio') && (matches(p, ['mic', 'micro']));
    });

    const interfaces = products.filter(p => {
        const tags = getTags(p);
        return tags.includes('cat_audio') && matches(p, ['interface', 'carte son', 'scarlett', 'volt', 'audient']);
    });

    const cameras = products.filter(p => {
        const tags = getTags(p);
        return tags.includes('cat_video') && matches(p, ['camera', 'webcam', 'sony', 'canon', 'lumix']);
    });

    // SELECT BEST MIC
    if (!ctx.hasMic) {
        const scoredMics = mics.map(p => ({ p, score: scoreProduct(p, ctx) })).sort((a, b) => b.score - a.score);
        if (scoredMics.length > 0 && scoredMics[0].score > -100) {
            result.mic = scoredMics[0].p;

            const tags = getTags(result.mic);
            if (ctx.room === 'untreated_bedroom' && tags.includes('dynamic')) {
                result.explanations[result.mic.id] = "Ce micro dynamique gommera l'écho de votre chambre.";
            } else if (ctx.usage === 'podcast') {
                result.explanations[result.mic.id] = "Le standard radio pour une voix chaude et présente.";
            } else {
                result.explanations[result.mic.id] = "Le meilleur rapport qualité/prix pour votre budget.";
            }
        }
    }

    // SELECT BEST INTERFACE (If Mic is XLR or High End)
    // Heuristic: If we picked a mic and it's NOT a USB mic (e.g. MV7 has USB but also XLR, usually we want interface for best quality)
    // Or simpler: If we picked a mic that needs XLR. 
    // Let's assume if we picked a mic, and we have budget left, we suggest an interface unless user has one.
    if (!ctx.hasInterface && result.mic) {
        const micTags = getTags(result.mic);
        // If it's pure USB (like rode-nt-usb), we might not need one. 
        // But for Configurator sake, let's upsell unless budget is tight.

        const scoredInferfaces = interfaces.map(p => ({ p, score: scoreProduct(p, ctx) })).sort((a, b) => b.score - a.score);
        if (scoredInferfaces.length > 0 && scoredInferfaces[0].score > -100) {
            result.audioInterface = scoredInferfaces[0].p;
            result.explanations[result.audioInterface.id] = "Indispensable pour brancher votre micro XLR et vos écouteurs.";
        }
    }

    // SELECT BEST CAMERA
    if (!ctx.hasCamera) {
        const scoredCams = cameras.map(p => ({ p, score: scoreProduct(p, ctx) })).sort((a, b) => b.score - a.score);
        if (scoredCams.length > 0 && scoredCams[0].score > -100) {
            result.camera = scoredCams[0].p;
            result.explanations[result.camera.id] = "Une qualité d'image cinématographique pour vos contenus.";
        }
    }

    // CALCULATE TOTAL
    result.totalCost = (result.mic?.price || 0) + (result.audioInterface?.price || 0) + (result.camera?.price || 0);

    // Calculate Global Match Score
    const micScore = result.mic ? scoreProduct(result.mic, ctx) : 0;
    // Normalize rough score strictly for display
    result.matchScore = Math.min(99, Math.max(75, 80 + (micScore / 10)));

    return result;
};
