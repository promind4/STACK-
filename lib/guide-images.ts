const CATEGORY_COVERS: Record<string, string> = {
  Audio: '/images/articles/guides/audio-editorial.png',
  Streaming: '/images/articles/guides/streaming-editorial.png',
  'Vidéo': '/images/articles/guides/video-editorial.png',
}

export function guideCoverImage(article: { category: string; image: string }): string {
  return CATEGORY_COVERS[article.category] ?? article.image
}
