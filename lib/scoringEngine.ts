import { Product } from '../types/database';

// ========================================
// FLUXLAB SCORING ENGINE V6 - COMPLETE
// ========================================

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
    existingMicType?: 'xlr' | 'usb';
    hasInterface: boolean;
    hasCamera: boolean;
    hasLights: boolean;
    hasMonitors?: boolean;
}

export interface ProductResult {
    selected: Product;
    alternatives: Product[];
    reason?: string;
    confidence: number;
}

export interface RecommendationResult {
    mic: ProductResult | null;
    audioInterface: ProductResult | null;
    monitors: ProductResult | null;
    camera: ProductResult | null;
    headphones: ProductResult | null;
    acousticTreatment: ProductResult | null;
    accessories: ProductResult[];
    lights: ProductResult[];
    totalCost: number;
    matchScore: number;
    explanations: Record<string, string>;
    budgetUtilization: number;
}

// ========================================
// TAGGING SYSTEM V6
// ========================================

const matches = (p: Product, keywords: string[]): boolean => {
    // Normalize both text and keywords for robust matching (remove non-alphanumeric)
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const text = normalize(`${p.slug || ''} ${p.name || ''} ${p.brand || ''}`);
    return keywords.some(k => {
        const normK = normalize(k);
        return normK.length > 0 && text.includes(normK);
    });
};

type ProductCategory = 'microphone' | 'interface' | 'camera' | 'headphones' | 'monitors' | 'treatment' | 'lighting' | 'cable' | 'stand' | 'greenscreen' | 'other';
type QualityTier = 'entry' | 'mid' | 'pro' | 'flagship';

interface ProductTags {
    category: ProductCategory;
    subcategory: string[];
    quality: QualityTier;
    connectivity: string[];
    features: string[];
    complexity: 'simple' | 'moderate' | 'advanced';
    usageRelevance: Usage[];
}

const categorizeProduct = (p: Product): ProductTags => {
    const tags: ProductTags = {
        category: 'other',
        subcategory: [],
        quality: 'mid',
        connectivity: [],
        features: [],
        complexity: 'moderate',
        usageRelevance: ['streaming', 'podcast', 'music_vocals', 'music_instruments', 'video_calls']
    };

    const name = `${p.slug} ${p.name} ${p.brand || ''}`.toLowerCase();

    // === CATEGORY DETECTION (Priority order matters) ===

    // GREEN SCREEN (Must be detected BEFORE camera/lighting to exclude from wrong categories)
    if (matches(p, ['green screen', 'fond vert', 'chroma', 'backdrop'])) {
        tags.category = 'greenscreen';
        tags.usageRelevance = ['streaming', 'video_calls']; // NOT music!
        return tags;
    }



    // MICROPHONES
    if (matches(p, ['mic', 'micro', 'shure', 'rode mic', 'neumann', 'audio-technica at', 'sennheiser', 'akg', 'podmic', 'sm7', 'mv7', 'nt1', 'nt2', 'lct', 'at2020', 'at4040', 'u87', 'tlm', 're20', 'procaster'])) {
        tags.category = 'microphone';

        // Dynamic vs Condenser
        if (matches(p, ['sm7b', 'mv7', 'podmic', 'dynacaster', 're20', 'procaster', 're320', 'sm58', 'dynamique', 'dynamic'])) {
            tags.subcategory.push('dynamic');
            tags.features.push('broadcast', 'noise_rejection');
        }
        // 'akgc' catches all AKG C-series condensers (C 114, C 314, C 3000, etc.) not individually listed
        if (matches(p, ['nt1', 'nt2', 'lct', 'at2020', 'at4040', 'u87', 'tlm', 'c114', 'c214', 'c314', 'c414', 'akgc', 'condenser', 'condensateur', 'baby bottle', 'origin', 'spirit', 'spark', 'ember', 'bluebird', 'wa-87', 'wa-47', 'wa-14', 'tf11', 'tf29', 'tf39', 'tf47', 'tf51'])) {
            tags.subcategory.push('condenser');
            tags.features.push('studio', 'detail');
        }

        // USB vs XLR
        if (matches(p, ['usb', 'link', 'duocast', 'wave', 'nt-usb', 'yeti', 'meteor'])) {
            tags.subcategory.push('usb');
            tags.connectivity.push('usb');
            tags.complexity = 'simple';
        } else {
            tags.subcategory.push('xlr');
            tags.connectivity.push('xlr');
            tags.complexity = 'moderate';
        }

        return tags;
    }

    // INTERFACES
    if (matches(p, ['interface', 'carte son', 'scarlett', 'volt', 'audient', 'motu', 'rme', 'apollo', 'ssl', 'presonus', 'arturia', 'babyface', 'zen go', 'id4', 'id14'])) {
        tags.category = 'interface';
        if (matches(p, ['thunderbolt', 'apollo', 'uad'])) {
            tags.connectivity.push('thunderbolt');
            tags.features.push('dsp');
        }
        if (matches(p, ['usb-c', 'usb c', 'usb'])) tags.connectivity.push('usb');
        tags.complexity = 'moderate';
        return tags;
    }

    // HEADPHONES
    if (matches(p, ['casque', 'headphone', 'dt 770', 'dt 880', 'dt 990', 'ath-m50', 'hd 560', 'hd 600', 'hd 650', 'beyerdynamic', 'akg k', 'audio-technica ath', 'sennheiser hd', 'sony mdr'])) {
        tags.category = 'headphones';
        if (matches(p, ['fermé', 'closed', 'dt 770', 'ath-m50'])) tags.subcategory.push('closed');
        if (matches(p, ['ouvert', 'open', 'dt 990', 'hd 560', 'hd 600'])) tags.subcategory.push('open');
        if (matches(p, ['semi', 'dt 880'])) tags.subcategory.push('semi-open');
        return tags;
    }

    // STUDIO MONITORS (enceintes de monitoring)
    if (matches(p, [
        'yamaha hs5', 'yamaha hs7', 'yamaha hs8',
        'krk rokit', 'rokit 5', 'rokit 7', 'rokit 8',
        'adam t5v', 'adam t7v', 'adam t8v', 'adam a3x', 'adam a5x', 'adam a7x',
        'focal alpha 50', 'focal alpha 65', 'focal alpha 80',
        'genelec 8020', 'genelec 8030', 'genelec 8040',
        'presonus eris', 'eris e3', 'eris e4', 'eris e5', 'eris e8',
        'm-audio bx5', 'm-audio bx8',
        'iloud mtm', 'iloud micro monitor',
        'dynaudio lyd',
        'mackie mr5', 'mackie mr8',
        'studio monitor', 'moniteur de studio', 'enceinte monitoring', 'enceinte de monitoring',
    ])) {
        tags.category = 'monitors';
        tags.usageRelevance = ['music_vocals', 'music_instruments', 'podcast'];
        return tags;
    }

    // CAMERAS
    if (matches(p, ['cam', 'webcam', 'facecam', 'brio', 'c920', 'c922', 'streamcam', 'sony zv', 'sony a6', 'sony a7', 'canon', 'lumix', 'mirrorless', 'insta360'])) {
        tags.category = 'camera';
        if (matches(p, ['webcam', 'brio', 'c920', 'facecam', 'streamcam', 'elgato'])) tags.subcategory.push('webcam');
        if (matches(p, ['mirrorless', 'sony a', 'canon eos', 'lumix'])) tags.subcategory.push('mirrorless');
        tags.usageRelevance = ['streaming', 'video_calls', 'podcast'];
        return tags;
    }

    // ACOUSTIC TREATMENT (STRICT - exclude green screens!)
    if (matches(p, ['mousse', 'acoustique', 'panel', 'absorber', 't.akustik', 'wave panel', 'isovox', 'reflection filter', 'vocal booth', 'foam', 'bass trap'])) {
        // Double-check it's NOT a green screen
        if (!matches(p, ['green', 'vert', 'chroma', 'backdrop'])) {
            tags.category = 'treatment';
            tags.usageRelevance = ['streaming', 'music_vocals', 'music_instruments', 'podcast'];
            return tags;
        }
    }

    // LIGHTING
    if (matches(p, ['light', 'keylight', 'aputure', 'godox', 'ring light', 'elgato key', 'led panel', 'softbox'])) {
        // Exclude green screens
        if (!matches(p, ['green', 'vert'])) {
            tags.category = 'lighting';
            tags.usageRelevance = ['streaming', 'video_calls'];
            return tags;
        }
    }

    // 8. ACCESSORIES (Lowest Priority)

    // CABLES (Audio-specific: require XLR/Jack/TRS in name, or known cable brands)
    const cableKeywords = ['xlr', 'jack', 'trs', 'cordial', 'sommer', 'sssnake', 'mogami', 'neutrik', 'vovox'];
    if (matches(p, cableKeywords) && matches(p, ['cable', 'câble', 'cordon'])) {
        tags.category = 'cable';
        if (matches(p, ['xlr'])) tags.subcategory.push('xlr');
        if (matches(p, ['jack', 'trs', '6.35'])) tags.subcategory.push('jack');
        if (matches(p, ['usb'])) tags.subcategory.push('usb');
        tags.complexity = 'simple';
        return tags;
    }

    // STANDS & ARMS
    if (matches(p, ['stand', 'bras', 'boom', 'pied', 'trépied', 'arm', 'psa', 'compass', 'wave mic arm'])) {
        tags.category = 'stand';
        if (matches(p, ['bras', 'arm', 'boom', 'compass', 'psa'])) tags.subcategory.push('boom_arm');
        if (matches(p, ['pied', 'stand', 'trépied', 'floor'])) tags.subcategory.push('floor_stand');
        tags.complexity = 'simple';
        return tags;
    }

    // === QUALITY TIER ===
    const price = p.price || 0;
    if (price < 100) tags.quality = 'entry';
    else if (price < 300) tags.quality = 'mid';
    else if (price < 800) tags.quality = 'pro';
    else tags.quality = 'flagship';

    // Brand override
    if (matches(p, ['neumann', 'rme', 'universal audio', 'apogee'])) tags.quality = 'flagship';
    if (matches(p, ['shure sm7b', 're20', 'lewitt lct 540', 'audient', 'ssl'])) tags.quality = 'pro';

    if (tags.category === 'other' && Math.random() < 0.01) {
        console.log(`[Scoring] Sample uncategorized product: ${p.slug} | Text: ${p.name}`);
    }

    return tags;
};

// ========================================
// SCORING FUNCTION
// ========================================

const gaussianScore = (price: number, target: number, sigma: number = 0.35): number => {
    if (target === 0) return 50;
    const x = (price - target) / target;
    return 100 * Math.exp(-(x * x) / (2 * sigma * sigma));
};

interface ScoringContext {
    targetPrice: number;
    usage: Usage;
    room: RoomType;
    experience: ExperienceLevel;
    minPrice: number;
    maxPrice: number;
    requiredSubcategories: string[];
    excludedSubcategories: string[];
    priorityFeatures: string[];
    vibe?: Vibe;
    computer?: 'mac' | 'pc';
}

const scoreProduct = (p: Product, tags: ProductTags, ctx: ScoringContext): number => {
    let score = 0;

    // 1. PRICE (40%)
    score += gaussianScore(p.price, ctx.targetPrice, 0.35) * 0.4;

    // 2. USAGE RELEVANCE (20%)
    if (tags.usageRelevance.includes(ctx.usage)) {
        score += 20;
    } else {
        score -= 30; // Heavy penalty for irrelevant usage
    }

    // 3. REQUIRED SUBCATEGORIES (15%)
    const hasRequired = ctx.requiredSubcategories.length === 0 ||
        ctx.requiredSubcategories.some(s => tags.subcategory.includes(s));
    if (hasRequired) score += 15;
    else score -= 50;

    // 4. EXCLUDED SUBCATEGORIES (-50)
    if (ctx.excludedSubcategories.some(s => tags.subcategory.includes(s))) {
        score -= 50;
    }

    // 5. PRIORITY FEATURES (10%)
    const featureMatches = ctx.priorityFeatures.filter(f =>
        tags.features.includes(f) || tags.subcategory.includes(f)
    ).length;
    score += Math.min(10, featureMatches * 3);

    // 6. EXPERIENCE MATCH (reduced weight — budget drives quality, not experience level)
    const complexityMap: Record<string, number> = { simple: 1, moderate: 2, advanced: 3 };
    const expMap: Record<ExperienceLevel, number> = { beginner: 1, intermediate: 2, pro: 3 };
    const diff = Math.abs(complexityMap[tags.complexity] - expMap[ctx.experience]);
    score += (3 - diff) * 1.8;

    // 7. VIBE BONUS (up to +5)
    if (ctx.vibe) {
        const vibeKeywords: Record<Vibe, string[]> = {
            rgb_gamer: ['hyperx', 'razer', 'elgato', 'corsair', 'steelseries', 'nzxt'],
            pro_studio: ['neumann', 'rme', 'audient', 'ssl', 'universal audio', 'apogee', 'akg', 'sennheiser'],
            vintage: ['warm audio', 'golden age', 'telefunken', 'tube', 'ribbon', 'neve'],
            minimalist: ['rode', 'focusrite', 'scarlett', 'lewitt', 'audio-technica']
        };
        const vibeMatch = vibeKeywords[ctx.vibe]?.some(k => matches(p, [k]));
        if (vibeMatch) score += 5;
    }

    // 8. COMPUTER COMPATIBILITY BONUS (up to +10)
    if (ctx.computer === 'mac' && tags.connectivity.includes('thunderbolt')) {
        score += 10; // Boosted
    }
    if (ctx.computer === 'pc' && tags.connectivity.includes('usb')) {
        score += 5;
    }

    return Math.max(0, Math.min(100, score));
};

const findBest = (
    products: Product[],
    category: ProductCategory,
    ctx: ScoringContext
): ProductResult | null => {
    // Helper to filter candidates
    const getCandidates = (maxPriceMult: number, minPriceMult: number) => {
        return products.filter(p => {
            const tags = categorizeProduct(p);
            if (tags.category !== 'other' && products.indexOf(p) < 20) {
                console.log(`[Scoring] Product: ${p.slug} | Category: ${tags.category} | Price: ${p.price}`);
            }
            if (tags.category !== category) return false;

            // Relaxed bounds
            if (p.price < ctx.minPrice * minPriceMult || p.price > ctx.maxPrice * maxPriceMult) {
                if (products.indexOf(p) < 10) console.log(`[Scoring] Rejected ${p.slug}: price ${p.price} outside [${ctx.minPrice * minPriceMult}, ${ctx.maxPrice * maxPriceMult}]`);
                return false;
            }

            // Check usage relevance (Strict)
            if (!tags.usageRelevance.includes(ctx.usage)) {
                if (products.indexOf(p) < 10) console.log(`[Scoring] Rejected ${p.slug}: usage ${ctx.usage} not in ${tags.usageRelevance}`);
                return false;
            }

            // Check exclusions (Strict)
            if (ctx.excludedSubcategories.some(s => tags.subcategory.includes(s))) return false;

            return true;
        });
    };

    // 1. Strict Search
    let candidates = getCandidates(1.0, 1.0);

    // 2. Soft Budget Search (Retry if empty)
    if (candidates.length === 0) {
        // Try +20% budget, -10% min
        candidates = getCandidates(1.2, 0.9);
    }

    // 3. Desperate Search (Retry if still empty)
    if (candidates.length === 0) {
        // Try +50% budget, -30% min
        candidates = getCandidates(1.5, 0.7);
    }

    if (candidates.length === 0) {
        console.warn(`[Scoring] No candidates found for category: ${category} with target price: ${ctx.targetPrice}`);
        return null;
    }

    // Score all
    const scored = candidates.map(p => {
        const tags = categorizeProduct(p);
        const score = scoreProduct(p, tags, ctx);
        return { p, tags, score };
    });

    scored.sort((a, b) => b.score - a.score);

    const selected = scored[0];

    // Alternatives: 1 cheaper, 1 upgrade (use strict max price for upgrade cap to avoid exploding budget)
    const cheaper = scored.filter(s => s.p.price < selected.p.price * 0.75).slice(0, 1);
    const upgrade = scored.filter(s => s.p.price > selected.p.price * 1.25 && s.p.price <= ctx.maxPrice * 2).slice(0, 1);

    return {
        selected: selected.p,
        alternatives: [...cheaper.map(s => s.p), ...upgrade.map(s => s.p)],
        confidence: selected.score
    };
};

export const generateRecommendation = (products: Product[], ctx: UserContext): RecommendationResult => {
    const result: RecommendationResult = {
        mic: null,
        audioInterface: null,
        monitors: null,
        camera: null,
        headphones: null,
        acousticTreatment: null,
        accessories: [],
        lights: [],
        totalCost: 0,
        matchScore: 0,
        explanations: {},
        budgetUtilization: 0
    };

    if (!products || products.length === 0) {
        console.error("[Scoring] Empty products array passed to generateRecommendation");
        return result;
    }

    console.log(`[Scoring] Generating recommendation for ${products.length} products`, ctx);

    // === BUDGET ALLOCATION ===
    const needsTreatment = ctx.room === 'untreated_bedroom' && ctx.usage !== 'video_calls';
    // Podcast camera is handled by the AI prompt only (rule 7: only if user mentions video)
    const needsCamera = ctx.usage === 'streaming' || ctx.usage === 'video_calls';
    // No fixed lighting for nomads — portable setup, incompatible with fixed panels
    const needsLighting = (ctx.usage === 'streaming' || ctx.usage === 'video_calls') && ctx.room !== 'travel';
    const isMusic = ctx.usage === 'music_vocals' || ctx.usage === 'music_instruments';
    // Monitors for music profiles with sufficient budget (studio quality requires speakers)
    const needsMonitors = isMusic && ctx.budget >= 700 && !ctx.hasMonitors;

    // Allocations based on usage
    let alloc = {
        mic: isMusic ? 0.24 : (ctx.usage === 'video_calls' ? 0.15 : 0.20),
        interface: isMusic ? 0.20 : 0.12,
        monitors: needsMonitors ? 0.20 : 0,
        camera: ctx.usage === 'video_calls' ? 0.35 : (needsCamera ? 0.25 : 0),
        headphones: isMusic ? 0.16 : 0.08,
        lighting: needsLighting ? 0.15 : 0,
        treatment: needsTreatment ? 0.10 : 0,
        accessories: 0.08
    };

    // === SMART REALLOCATION ===
    if (ctx.hasMic)       alloc.mic       = 0;
    if (ctx.hasInterface) alloc.interface = 0;
    if (ctx.hasCamera)    alloc.camera    = 0;
    if (ctx.hasLights)    alloc.lighting  = 0;
    if (ctx.hasMonitors)  alloc.monitors  = 0;

    // Normalise so remaining allocations sum to 1 → full budget used
    const allocTotal = Object.values(alloc).reduce((a, b) => a + b, 0);
    if (allocTotal > 0 && allocTotal < 0.98) {
        const factor = 1 / allocTotal;
        alloc.mic         *= factor;
        alloc.interface   *= factor;
        alloc.monitors    *= factor;
        alloc.camera      *= factor;
        alloc.headphones  *= factor;
        alloc.lighting    *= factor;
        alloc.treatment   *= factor;
        alloc.accessories *= factor;
    }

    // Effective budget = full budget (we redistribute, not just boost)
    const effectiveBudget = ctx.budget;

    // === MICROPHONE ===
    if (!ctx.hasMic) {
        // Untreated room → dynamic (reject condenser); travel → only USB (compact)
        // Music + budget ≥ 600€ → force XLR (reject USB — quality matters)
        const micExclusions: string[] =
            ctx.room === 'travel'                          ? ['condenser', 'xlr'] :
            needsTreatment                                 ? ['condenser'] :
            (isMusic && ctx.budget >= 600)                 ? ['usb'] :
            [];

        // Podcast always prefers broadcast/dynamic (even in treated studio)
        // Treated studio condenser priority is only for music profiles
        const micPriorities =
            needsTreatment           ? ['dynamic', 'broadcast'] :
            ctx.usage === 'podcast'  ? ['broadcast', 'dynamic'] :
            ctx.room === 'treated_studio' ? ['condenser', 'studio'] :
            [];

        // For music/high-budget profiles, don't allow very cheap mics (< 150€ if budget ≥ 800€)
        const micMinPrice = (isMusic && ctx.budget >= 800) ? 150 : 50;

        const micCtx: ScoringContext = {
            targetPrice: effectiveBudget * alloc.mic,
            usage: ctx.usage,
            room: ctx.room,
            experience: ctx.experience,
            minPrice: micMinPrice,
            maxPrice: ctx.budget * 0.55,
            requiredSubcategories: [],
            excludedSubcategories: micExclusions,
            priorityFeatures: micPriorities,
            vibe: ctx.vibe,
            computer: ctx.computer
        };

        result.mic = findBest(products, 'microphone', micCtx);

        if (result.mic) {
            const tags = categorizeProduct(result.mic.selected);
            let reason = '';
            if (tags.subcategory.includes('dynamic') && (needsTreatment || ctx.room === 'travel')) {
                reason = "Micro dynamique — rejette efficacement le bruit ambiant.";
            } else if (tags.subcategory.includes('condenser')) {
                reason = "Micro à condensateur — capture chaque détail en studio.";
            } else if (tags.subcategory.includes('usb')) {
                reason = "Micro USB — plug & play, idéal pour débuter.";
            } else {
                reason = "Sélectionné pour son excellent rapport qualité/prix.";
            }
            result.explanations[result.mic.selected.id] = reason;
        }
    }

    // === INTERFACE (Logic Updated for Smart Inventory) ===
    // We need an interface IF:
    // 1. We just bought an XLR mic (result.mic is XLR)
    // 2. OR User HAS a mic AND it is XLR (ctx.existingMicType === 'xlr') AND doesn't have an interface

    const micTags = result.mic ? categorizeProduct(result.mic.selected) : null;
    let needsInterface = false;

    // Case 1: New Mic is XLR
    if (result.mic && micTags) {
        if (micTags.subcategory.includes('xlr') && !ctx.hasInterface) {
            needsInterface = true;
        }
    }

    // Case 2: Existing Mic is XLR
    if (ctx.hasMic && ctx.existingMicType === 'xlr' && !ctx.hasInterface) {
        needsInterface = true;
    }

    if (needsInterface) {
        // Tiering: better mic = better interface
        let minInterfacePrice = 0;
        // If we selected a mic, base interface on that
        if (result.mic && result.mic.selected.price > 300) {
            minInterfacePrice = 200;
        }
        // If user HAS a mic (and we assume it's decent if they are here), defaulting to decent interface
        else if (ctx.hasMic) {
            minInterfacePrice = 100;
        }

        const intCtx: ScoringContext = {
            targetPrice: Math.max(effectiveBudget * alloc.interface, minInterfacePrice),
            usage: ctx.usage,
            room: ctx.room,
            experience: ctx.experience,
            minPrice: minInterfacePrice,
            maxPrice: ctx.budget * 0.35,
            requiredSubcategories: [],
            excludedSubcategories: [],
            priorityFeatures: ctx.computer === 'mac' ? ['thunderbolt', 'dsp'] : (isMusic ? ['dsp'] : []),
            vibe: ctx.vibe,
            computer: ctx.computer
        };

        result.audioInterface = findBest(products, 'interface', intCtx);

        if (result.audioInterface) {
            result.explanations[result.audioInterface.selected.id] =
                ctx.hasMic
                    ? "Indispensable pour votre micro XLR existant."
                    : "Indispensable pour connecter le micro XLR sélectionné.";
        }
    }

    // === HEADPHONES (Essential for music) ===
    if (isMusic || ctx.usage === 'podcast' || ctx.usage === 'streaming') {
        const hpCtx: ScoringContext = {
            targetPrice: ctx.budget * alloc.headphones,
            usage: ctx.usage,
            room: ctx.room,
            experience: ctx.experience,
            minPrice: 50,
            maxPrice: ctx.budget * 0.25,
            requiredSubcategories: isMusic ? ['closed'] : [], // Closed for recording
            excludedSubcategories: [],
            priorityFeatures: []
        };

        result.headphones = findBest(products, 'headphones', hpCtx);

        if (result.headphones) {
            result.explanations[result.headphones.selected.id] =
                "Casque studio pour monitoring précis.";
        }
    }

    // === STUDIO MONITORS (music profiles with sufficient budget) ===
    if (needsMonitors) {
        const monitorCtx: ScoringContext = {
            targetPrice: ctx.budget * alloc.monitors,
            usage: ctx.usage,
            room: ctx.room,
            experience: ctx.experience,
            minPrice: 80,
            maxPrice: ctx.budget * 0.40,
            requiredSubcategories: [],
            excludedSubcategories: [],
            priorityFeatures: [],
            vibe: ctx.vibe,
            computer: ctx.computer,
        };

        result.monitors = findBest(products, 'monitors', monitorCtx);

        if (result.monitors) {
            result.explanations[result.monitors.selected.id] =
                "Enceintes de monitoring pour écoute critique et mixage.";
        }
    }

    // === CAMERA (Streaming/Video/Podcast) ===
    if (!ctx.hasCamera && needsCamera) {
        // Travel/nomad: never recommend a webcam — vloggers need mirrorless, compact, or action cam
        const isTravel = ctx.room === 'travel';
        const camCtx: ScoringContext = {
            targetPrice: ctx.budget * alloc.camera,
            usage: ctx.usage,
            room: ctx.room,
            experience: ctx.experience,
            minPrice: 50,
            maxPrice: ctx.budget * 0.35,
            requiredSubcategories: [],
            excludedSubcategories: isTravel ? ['webcam'] : [],
            priorityFeatures: (isTravel || ctx.budget > 1500) ? ['mirrorless'] : ['webcam'],
            vibe: ctx.vibe,
            computer: ctx.computer
        };

        result.camera = findBest(products, 'camera', camCtx);

        if (result.camera) {
            const usageLabel = ctx.usage === 'video_calls' ? 'visioconférence' : ctx.usage === 'podcast' ? 'vidéo-podcast' : ctx.usage === 'streaming' ? 'streaming' : 'vidéo';
            result.explanations[result.camera.selected.id] =
                `Caméra recommandée pour la ${usageLabel}.`;
        }
    }

    // === ACOUSTIC TREATMENT (Untreated room only) ===
    if (needsTreatment) {
        const treatCtx: ScoringContext = {
            targetPrice: ctx.budget * alloc.treatment,
            usage: ctx.usage,
            room: ctx.room,
            experience: ctx.experience,
            minPrice: 30,
            maxPrice: ctx.budget * 0.15,
            requiredSubcategories: [],
            excludedSubcategories: [],
            priorityFeatures: []
        };

        result.acousticTreatment = findBest(products, 'treatment', treatCtx);

        if (result.acousticTreatment) {
            result.explanations[result.acousticTreatment.selected.id] =
                "Traitement acoustique essentiel pour pièce non traitée.";
        }
    }

    // === LIGHTING (Streaming/Video with Camera) ===
    if (needsLighting && !ctx.hasLights) {
        const lightCtx: ScoringContext = {
            targetPrice: ctx.budget * 0.12,
            usage: ctx.usage,
            room: ctx.room,
            experience: ctx.experience,
            minPrice: 50,
            maxPrice: ctx.budget * 0.20,
            requiredSubcategories: [],
            excludedSubcategories: [],
            priorityFeatures: []
        };

        const keylight = findBest(products, 'lighting', lightCtx);
        if (keylight) {
            keylight.reason = "Éclairage essentiel pour la qualité vidéo.";
            result.explanations[keylight.selected.id] = keylight.reason;
            result.lights.push(keylight);
        }
    }

    // === ACCESSORIES ===

    // XLR Cable (ALWAYS if XLR mic + Interface)
    if (result.mic && micTags?.subcategory.includes('xlr') && result.audioInterface) {
        // Find ANY cable (remove strict xlr filter - cables in DB may not be tagged)
        const cableCtx: ScoringContext = {
            targetPrice: 25,
            usage: ctx.usage,
            room: ctx.room,
            experience: ctx.experience,
            minPrice: 5,
            maxPrice: 100,
            requiredSubcategories: [], // Removed ['xlr'] - too strict
            excludedSubcategories: [],
            priorityFeatures: []
        };

        const cable = findBest(products, 'cable', cableCtx);
        if (cable) {
            cable.reason = "Câble XLR indispensable pour connecter le micro à l'interface.";
            result.explanations[cable.selected.id] = cable.reason;
            result.accessories.push(cable);
        }
    }

    // Mic Stand (Boom arm for podcast, any for others)
    if (result.mic) {
        const standCtx: ScoringContext = {
            targetPrice: ctx.budget * 0.04,
            usage: ctx.usage,
            room: ctx.room,
            experience: ctx.experience,
            minPrice: 20,
            maxPrice: 200,
            requiredSubcategories: ctx.usage === 'podcast' ? ['boom_arm'] : [],
            excludedSubcategories: [],
            priorityFeatures: []
        };

        const stand = findBest(products, 'stand', standCtx);
        if (stand) {
            stand.reason = "Support pour positionner le micro.";
            result.explanations[stand.selected.id] = stand.reason;
            result.accessories.push(stand);
        }
    }

    // === TOTALS ===
    result.totalCost =
        (result.mic?.selected.price || 0) +
        (result.audioInterface?.selected.price || 0) +
        (result.monitors?.selected.price || 0) +
        (result.camera?.selected.price || 0) +
        (result.headphones?.selected.price || 0) +
        (result.acousticTreatment?.selected.price || 0) +
        result.lights.reduce((sum, l) => sum + l.selected.price, 0) +
        result.accessories.reduce((sum, a) => sum + a.selected.price, 0);

    result.budgetUtilization = Math.round((result.totalCost / ctx.budget) * 100);

    // === BUDGET OPTIMIZATION — upgrade pass ===
    // If budget utilization < 75%, try to upgrade the most impactful piece
    const recalcTotal = () =>
        (result.mic?.selected.price || 0) +
        (result.audioInterface?.selected.price || 0) +
        (result.monitors?.selected.price || 0) +
        (result.camera?.selected.price || 0) +
        (result.headphones?.selected.price || 0) +
        (result.acousticTreatment?.selected.price || 0) +
        result.lights.reduce((s, l) => s + l.selected.price, 0) +
        result.accessories.reduce((s, a) => s + a.selected.price, 0);

    result.totalCost = recalcTotal();
    result.budgetUtilization = Math.round((result.totalCost / ctx.budget) * 100);

    // === BUDGET CAP — trim extras if over budget ===
    // Remove items from least-essential to most-essential until within budget
    if (result.totalCost > ctx.budget * 1.02) {
        const trimSteps: Array<() => void> = [
            () => { if (result.lights.length > 0)      result.lights = []; },
            () => { if (result.accessories.length > 0) result.accessories = []; },
            () => { if (result.acousticTreatment)      result.acousticTreatment = null; },
            () => { if (result.camera)                 result.camera = null; },
            () => { if (result.monitors)               result.monitors = null; },
            () => { if (result.headphones)             result.headphones = null; },
        ];
        for (const trim of trimSteps) {
            if (result.totalCost <= ctx.budget * 1.02) break;
            trim();
            result.totalCost = recalcTotal();
        }
        result.budgetUtilization = Math.round((result.totalCost / ctx.budget) * 100);
    }

    // Upgrade priority order: mic → interface → monitors → camera → headphones
    const upgradeCandidates: Array<{ key: keyof RecommendationResult; cat: ProductCategory }> = [
        { key: 'mic', cat: 'microphone' },
        { key: 'audioInterface', cat: 'interface' },
        { key: 'monitors', cat: 'monitors' },
        { key: 'camera', cat: 'camera' },
        { key: 'headphones', cat: 'headphones' },
    ];

    for (const { key, cat } of upgradeCandidates) {
        if (result.budgetUtilization >= 82) break;

        const current = result[key] as ProductResult | null;
        if (!current) continue;

        const remaining = ctx.budget - result.totalCost;
        if (remaining < 30) break;

        const originalPrice = current.selected.price;
        const maxUpgrade = originalPrice + remaining * 0.85; // use up to 85% of remaining on upgrade

        // Target = 40% of the way from originalPrice to maxUpgrade
        // e.g. mic at 88€, maxUpgrade 3413€ → target ≈ 1418€ (proper quality jump)
        const upgradeTarget = originalPrice + (maxUpgrade - originalPrice) * 0.4;

        const upgradeCtx: ScoringContext = {
            targetPrice: upgradeTarget,
            usage: ctx.usage,
            room: ctx.room,
            experience: ctx.experience,
            minPrice: originalPrice + 25,
            maxPrice: maxUpgrade,
            requiredSubcategories: [],
            excludedSubcategories: [
                ...((cat === 'microphone' && (needsTreatment || ctx.room === 'travel')) ? ['condenser'] : []),
                ...((cat === 'microphone' && isMusic && ctx.budget >= 600) ? ['usb'] : []),
            ],
            priorityFeatures: cat === 'microphone' && ctx.usage === 'podcast' ? ['broadcast', 'dynamic'] :
                              cat === 'microphone' && ctx.room === 'treated_studio' ? ['condenser', 'studio'] : [],
            vibe: ctx.vibe,
            computer: ctx.computer,
        };

        const upgraded = findBest(products, cat, upgradeCtx);
        if (upgraded && upgraded.selected.id !== current.selected.id) {
            const delta = upgraded.selected.price - originalPrice;
            if (result.totalCost + delta <= ctx.budget * 1.02) { // allow 2% over for rounding
                (result as any)[key] = upgraded;
                result.explanations[upgraded.selected.id] = 'Montée en gamme — votre budget le permet.';
                result.totalCost = recalcTotal();
                result.budgetUtilization = Math.round((result.totalCost / ctx.budget) * 100);
            }
        }
    }

    // Match score
    const confidences = [
        result.mic?.confidence,
        result.audioInterface?.confidence,
        result.monitors?.confidence,
        result.camera?.confidence,
        result.headphones?.confidence,
        result.acousticTreatment?.confidence,
        ...result.lights.map(l => l.confidence),
        ...result.accessories.map(a => a.confidence)
    ].filter(c => c !== undefined) as number[];

    result.matchScore = confidences.length > 0
        ? Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length)
        : 0;


    return result;
};
