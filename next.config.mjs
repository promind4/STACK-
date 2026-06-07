/** @type {import('next').NextConfig} */
const nextConfig = {
  // ─── PERFORMANCE ──────────────────────────────────────────
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,

  // Optimisation des imports lourds (tree-shaking ciblé)
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // ─── IMAGES ───────────────────────────────────────────────
  images: {
    // Optimisation activée — sert AVIF/WebP automatiquement selon le navigateur
    formats: ['image/avif', 'image/webp'],
    // Tailles standard pour <Image fill> et sizes prop
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache 30 jours sur le CDN
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "images-na.ssl-images-amazon.com" },
      { protocol: "https", hostname: "thumbs.static-thomann.de" },
      { protocol: "https", hostname: "static.thomann.de" },
      { protocol: "https", hostname: "**.thomann.de" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "**.ldlc.com" },
      { protocol: "https", hostname: "media.ldlc.com" },
      { protocol: "https", hostname: "**.bhphoto.com" },
      { protocol: "https", hostname: "**.woodbrass.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },

  // ─── HEADERS DE CACHE ─────────────────────────────────────
  async headers() {
    return [
      {
        // Assets statiques compilés par Next — cache 1 an immuable
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Images publiques — cache 30 jours
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' },
        ],
      },
      {
        source: '/branding/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/guide/stream-deck-guide',
        destination: '/guide/elgato-stream-deck-guide-complet',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
