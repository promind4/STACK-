import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client.
 * Uses NEXT_PUBLIC_ env vars (safe for SSR/SSG — they are embedded at build time).
 */
export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    if (!url || !key) {
        throw new Error("Missing Supabase environment variables.");
    }

    return createSupabaseClient(url, key);
}
