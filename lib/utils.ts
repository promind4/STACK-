/**
 * Utility functions shared across server and client.
 */

export function stripHtml(html: string | undefined | null): string {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(" ");
}

/**
 * Clean image URLs from potential JSON escaping residue (backslashes)
 */
export function cleanImageUrl(url: string | undefined | null): string {
    if (!url) return "";
    return url.replace(/\\\//g, '/');
}
