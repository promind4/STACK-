/**
 * Returns true only for direct Supabase Storage object URLs.
 * These product assets bypass Vercel Image Optimization to avoid its Hobby-plan
 * transformation limit while local and editorial images retain optimization.
 */
export function isDirectSupabaseStorageUrl(source) {
  try {
    const url = new URL(source)
    return (
      url.protocol === 'https:' &&
      url.hostname.endsWith('.supabase.co') &&
      url.pathname.includes('/storage/v1/object/')
    )
  } catch {
    return false
  }
}
