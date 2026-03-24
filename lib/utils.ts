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
