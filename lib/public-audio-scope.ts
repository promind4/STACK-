export const AUDIO_CATEGORY_SLUGS = [
  'audio', 'micros-dynamiques', 'micros-condensateurs', 'micros-usb',
  'micros-shotgun', 'cartes-son', 'preamplis', 'casques-studio',
  'enceintes', 'bras-articules', 'cable-xlr', 'traitement-acoustique',
] as const

const PUBLIC_AUDIO_CATEGORY_SET = new Set<string>(AUDIO_CATEGORY_SLUGS)

export function isPublicAudioCategory(slug: string | null | undefined): boolean {
  return typeof slug === 'string' && PUBLIC_AUDIO_CATEGORY_SET.has(slug)
}

export function isPublicAudioGuide(article: { category: string }): boolean {
  return article.category === 'Audio' || article.category === 'Acoustique'
}
