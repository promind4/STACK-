/**
 * Utility functions shared across server and client.
 */

export function stripHtml(html: string | undefined | null): string {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

/**
 * Shortens a long editorial title for use in <title> / og:title only.
 * Never mutates the source title used for H1s or listing cards. Prefers the
 * primary phrase before an em dash or colon (keeps the main keyword, drops
 * the redundant descriptive subtitle); falls back to a word-boundary trim.
 */
const TRAILING_STOPWORDS = new Set([
    "de", "du", "des", "le", "la", "les", "un", "une", "et", "ou", "sur", "avec",
    "en", "à", "a", "son", "sa", "ses", "au", "aux", "pour", "dans", "par", "ce",
    "cet", "cette", "qui", "que", "nos", "vos", "ton", "ta",
]);

export function shortenTitle(title: string, maxLen = 60): string {
    if (!title || title.length <= maxLen) return title || "";

    const sepMatch = title.match(/^(.{10,}?)\s*[—:]\s*/);
    if (sepMatch && sepMatch[1].length <= maxLen) return sepMatch[1];

    const truncated = title.slice(0, maxLen);
    const lastSpace = truncated.lastIndexOf(" ");
    let cut = lastSpace > 20 ? truncated.slice(0, lastSpace) : truncated;

    // Drop an unclosed "(" and everything after it (e.g. "... (4th" -> "...").
    const openParen = cut.lastIndexOf("(");
    if (openParen !== -1 && !cut.slice(openParen).includes(")")) {
        cut = cut.slice(0, openParen);
    }

    // Drop a trailing dangling word: preposition/article/conjunction, or a bare number fragment.
    const words = cut.trim().split(/\s+/);
    while (words.length > 3) {
        const last = words[words.length - 1].toLowerCase().replace(/[^\wàâäéèêëïîôöùûüç]/gi, "");
        if (TRAILING_STOPWORDS.has(last) || /^\d+$/.test(last)) {
            words.pop();
        } else {
            break;
        }
    }
    cut = words.join(" ");

    // Strip any leftover dangling bracket/punctuation from the trim.
    return cut.replace(/[\s([{—:–-]+$/, "").trim();
}

export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(" ");
}

/**
 * Clean image URLs from potential JSON escaping residue (backslashes)
 * and ensure they are absolute and properly encoded for Vercel.
 */
export function cleanImageUrl(url: string | undefined | null): string {
    if (!url) return "";
    
    let cleanUrl = url.replace(/\\\//g, '/');

    // Ensure absolute URL
    if (cleanUrl.startsWith('/')) {
        const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        // If baseUrl ends with '/' and cleanUrl starts with '/', avoid double slash
        if (baseUrl.endsWith('/') && cleanUrl.startsWith('/')) {
            cleanUrl = `${baseUrl}${cleanUrl.slice(1)}`;
        } else {
            cleanUrl = `${baseUrl}${cleanUrl}`;
        }
    }

    // Double encode protection: first decode then encode to avoid double encoding.
    // Or just simple encodeURI as requested by the user.
    return encodeURI(decodeURI(cleanUrl));
}

/** Known scaffolding placeholders that must never reach a real outbound link. */
const INVALID_TAG_VALUES = new Set(["TON_TAG_AMAZON", "stackera-21"]);

/**
 * Injects the merchant's affiliate/partner tag into an outbound offer URL.
 * Strips known placeholder tag values unconditionally (some legacy offers in
 * Supabase and static guide content still carry them). Only sets a real tag
 * once the matching *_PARTNER_TAG env var is configured — safe to call
 * unconditionally on every offer link.
 */
export function buildAffiliateLink(url: string, merchantName: string | undefined | null): string {
    if (!url) return url;
    const merchant = (merchantName || "").toLowerCase().trim();

    const config: Record<string, { param: string; tag: string | undefined }> = {
        amazon: { param: "tag", tag: process.env.AMAZON_PARTNER_TAG },
        thomann: { param: "partner_id", tag: process.env.THOMANN_PARTNER_TAG },
        woodbrass: { param: "partner_id", tag: process.env.WOODBRASS_PARTNER_TAG },
    };

    const merchantConfig = config[merchant];
    if (!merchantConfig) return url;

    try {
        const parsed = new URL(url);
        const current = parsed.searchParams.get(merchantConfig.param);

        if (current && INVALID_TAG_VALUES.has(current)) {
            parsed.searchParams.delete(merchantConfig.param);
        }

        if (merchantConfig.tag) {
            parsed.searchParams.set(merchantConfig.param, merchantConfig.tag);
        }

        return parsed.toString();
    } catch {
        return url;
    }
}
