const CATEGORY_COVERS: Record<string, string> = {
  Streaming: '/images/articles/guides/streaming-editorial.png',
  'Vidéo': '/images/articles/guides/video-editorial.png',
}

const ARTICLE_COVERS: Record<string, string> = {
  'focusrite-scarlett-2i2-vs-audient-id4': '/images/articles/guides/rehearsal-hall-editorial.png',
  'choisir-casque-studio': '/images/articles/guides/listening-room-editorial.png',
  'xlr-vs-usb': '/images/articles/guides/curtain-workspace-editorial.png',
  'top-5-interfaces': '/images/articles/guides/night-workspace-editorial.png',
  'micro-pour-voix-grave-recommandations': '/images/articles/guides/voice-booth-editorial.png',
  'meilleur-casque-studio-home-studio-2026': '/images/articles/guides/dawn-listening-editorial.png',
  'comment-fonctionne-configurateur-fluxlab': '/images/articles/guides/courtyard-creative-editorial.png',
  'meilleur-micro-podcast-2026': '/images/articles/guides/audio-editorial.png',
  'shure-sm7b-vs-rode-podmic': '/images/articles/guides/rehearsal-recording-editorial.png',
  'setup-podcast-350-euros-2026': '/images/articles/guides/podcast-conversation-editorial.png',
  'enregistrer-podcast-deux-personnes-setup': '/images/articles/guides/podcast-conversation-editorial.png',
  'home-studio-500-euros-guide-complet': '/images/articles/guides/audio-workspace-editorial.png',
  'supprimer-bruit-de-fond-micro': '/images/articles/guides/acoustic-workspace-editorial.png',
  insonorisation: '/images/articles/guides/acoustic-workspace-editorial.png',
  'focusrite-scarlett-2i2-vs-audient-id4-mkii': '/images/articles/editorial-interface-comparison.png',
  'shure-mv7-vs-mv7x': '/images/articles/editorial-micro-comparison.png',
  'alternatives-focusrite-scarlett-2026': '/images/articles/editorial-interface-alternatives.png',
  'scarlett-2i2-4th-gen-shure-sm7b-cloudlifter': '/images/articles/editorial-sm7b-cloudlifter.png',
  'supprimer-bruit-clavier-stream': '/images/articles/editorial-keyboard-noise.png',
}

export function guideCoverImage(article: { slug?: string; category: string; image: string }): string {
  return (article.slug && ARTICLE_COVERS[article.slug]) ?? CATEGORY_COVERS[article.category] ?? article.image
}
