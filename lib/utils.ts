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
