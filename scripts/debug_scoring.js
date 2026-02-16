
// Manually defining types and logic to debug without full TS setup
// This script simulates 'scoringEngine.ts' behavior

const products = [
    { id: 'p1', name: 'Shure SM7B', slug: 'shure-sm7b', price: 389, brand: 'Shure' },
    { id: 'p2', name: 'Rode PodMic', slug: 'rode-podmic', price: 109, brand: 'Rode' },
    { id: 'p3', name: 'Neumann TLM 102', slug: 'neumann-tlm-102', price: 659, brand: 'Neumann' },
    { id: 'p4', name: 'Focusrite Scarlett 2i2', slug: 'focusrite-scarlett-2i2', price: 189, brand: 'Focusrite' },
    { id: 'p5', name: 'Universal Audio Apollo Twin', slug: 'universal-audio-apollo-twin', price: 999, brand: 'Universal Audio' },
    { id: 'p6', name: 'Logitech Brio', slug: 'logitech-brio', price: 159, brand: 'Logitech' },
    { id: 'p7', name: 'Sony ZV-E10', slug: 'sony-zv-e10', price: 750, brand: 'Sony' },
    { id: 'p8', name: 'Elgato Key Light', slug: 'elgato-key-light', price: 199, brand: 'Elgato' }
];

const matches = (p, keywords) => {
    const text = `${p.slug} ${p.name} ${p.brand || ''}`.toLowerCase();
    return keywords.some(k => text.includes(k.toLowerCase()));
};

const categorizeProduct = (p) => {
    const tags = {
        category: 'other',
        subcategory: [],
        quality: 'mid',
        connectivity: [],
        features: [],
        complexity: 'moderate',
        usageRelevance: ['streaming', 'podcast', 'music_vocals', 'music_instruments', 'video_calls']
    };

    // COPY-PASTE FROM scoringEngine.ts logic (simplified for debugging)
    if (matches(p, ['mic', 'micro', 'shure', 'rode mic', 'neumann', 'sm7', 'podmic', 'tlm'])) {
        tags.category = 'microphone';
        if (matches(p, ['sm7b', 'podmic'])) { tags.subcategory.push('dynamic'); tags.features.push('broadcast'); }
        if (matches(p, ['tlm'])) { tags.subcategory.push('condenser'); tags.features.push('studio'); }
        if (matches(p, ['usb'])) tags.subcategory.push('usb');
        else tags.connectivity.push('xlr');
        return tags;
    }

    if (matches(p, ['interface', 'scarlett', 'apollo'])) {
        tags.category = 'interface';
        if (matches(p, ['apollo'])) { tags.connectivity.push('thunderbolt'); tags.features.push('dsp'); }
        if (matches(p, ['scarlett'])) tags.connectivity.push('usb');
        return tags;
    }

    if (matches(p, ['cam', 'webcam', 'brio', 'sony zv'])) {
        tags.category = 'camera';
        if (matches(p, ['webcam', 'brio'])) tags.subcategory.push('webcam');
        if (matches(p, ['sony zv'])) tags.subcategory.push('mirrorless');
        tags.usageRelevance = ['streaming', 'video_calls', 'podcast'];
        return tags;
    }

    // Default fallback
    return tags;
};

// MOCK CONTEXT (The problematic one)
const ctx = {
    usage: 'podcast',
    room: 'treated_studio',
    experience: 'intermediate',
    budget: 2000,
    vibe: 'pro_studio',
    computer: 'mac',
    hasMic: false,
    hasInterface: false,
    hasCamera: false,
    hasLights: false
};

console.log("--- DEBUGGING SCORING ---");
console.log("Context:", ctx);

// DEBUG findBest logic
const category = 'microphone';
const minPrice = 50;
const maxPrice = ctx.budget * 0.45; // 900
const micExclusions = [];
const micPriorities = ['broadcast']; // Podcast default

console.log(`Searching for ${category}... Price: ${minPrice}-${maxPrice}`);

const candidates = products.filter(p => {
    const tags = categorizeProduct(p);
    console.log(`Checking ${p.name}: Cat=${tags.category}, Price=${p.price}`);

    if (tags.category !== category) return false;
    if (p.price < minPrice || p.price > maxPrice) {
        console.log(`  -> Rejected Price`);
        return false;
    }
    if (!tags.usageRelevance.includes(ctx.usage)) {
        console.log(`  -> Rejected Usage`);
        return false;
    }
    return true;
});

console.log(`Candidates found: ${candidates.length}`);
candidates.forEach(c => console.log(` - ${c.name}`));

// DEBUG Vibe/Computer logic
const scoreProduct = (p, tags, ctx) => {
    let score = 0;
    // Price score (dummy)
    score += 50;

    // Vibe
    if (ctx.vibe) {
        const vibeKeywords = {
            rgb_gamer: ['hyperx', 'razer'],
            pro_studio: ['neumann', 'rme', 'universal audio'],
            vintage: ['warm audio'],
            minimalist: ['rode', 'focusrite']
        };
        const vibeMatch = vibeKeywords[ctx.vibe]?.some(k => matches(p, [k]));
        if (vibeMatch) {
            console.log(`  -> Vibe Match! (+5)`);
            score += 5;
        }
    }

    // Computer
    if (ctx.computer === 'mac' && tags.connectivity.includes('thunderbolt')) {
        console.log(`  -> Mac Thunderbolt Match! (+5)`);
        score += 5;
    }

    return score;
};

const scored = candidates.map(p => {
    const tags = categorizeProduct(p);
    const score = scoreProduct(p, tags, ctx); // Mocked scoreProduct
    console.log(`${p.name} Score: ${score}`);
    return { p, score };
});

scored.sort((a, b) => b.score - a.score);
console.log("Winner:", scored[0]?.p.name);
