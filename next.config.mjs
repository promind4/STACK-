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
    // Les requêtes /_next/image retournent 402 sur le déploiement Vercel.
    // Les navigateurs chargent donc les fichiers directement depuis leur source.
    unoptimized: true,
    // Conservé pour un éventuel retour à l'optimisation par Next.js.
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
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "**.shopify.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
      { protocol: "https", hostname: "edge.rode.com" },
      { protocol: "https", hostname: "**.rode.com" },
      { protocol: "https", hostname: "www.audio-technica.com" },
      { protocol: "https", hostname: "**.audio-technica.com" },
      { protocol: "https", hostname: "resource.logitechg.com" },
      { protocol: "https", hostname: "**.logitechg.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },

  // ─── HEADERS DE CACHE ─────────────────────────────────────
  async headers() {
    const isProd = process.env.NODE_ENV === 'production';
    return [
      // En prod, les chunks ont un hash de contenu → cache 1 an immuable.
      // En dev, les chunks n'ont PAS de hash (ex: page.js) : un cache immuable
      // empêcherait le navigateur de récupérer les modifications (HMR cassé).
      ...(isProd
        ? [{
            source: '/_next/static/:path*',
            headers: [
              { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
            ],
          }]
        : []),
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
      // Cannibalisation "casque studio" — contenu fusionné dans le guide 2026
      // plus récent et mieux positionné (cf. audit SEO juillet 2026).
      {
        source: '/guide/choisir-casque-studio',
        destination: '/guide/meilleur-casque-studio-home-studio-2026',
        permanent: true,
      },
      // Slug/title mismatch — l'article était sluggé "audient-id4-mkii" mais son
      // contenu réel compare Scarlett 2i2 vs Universal Audio Volt 2, pas Audient
      // (détecté par scripts/slug-coherence.mjs, cf. cycle SEO du 2026-09-21).
      {
        source: '/guide/focusrite-scarlett-2i2-vs-audient-id4-mkii',
        destination: '/guide/focusrite-scarlett-2i2-vs-universal-audio-volt-2',
        permanent: true,
      },
      // Slug aligné sur la catégorie "traitement-acoustique" après la réécriture
      // SEO du 2026-09-21 (cf. PR #6) — l'ancien slug "insonorisation" restait
      // trop vague par rapport à la requête ciblée.
      {
        source: '/guide/insonorisation',
        destination: '/guide/traitement-acoustique',
        permanent: true,
      },
    ];
  },

  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/System Volume Information/**',
          '**/$RECYCLE.BIN/**',
        ],
      };
    }
    return config;
  },
};

export default nextConfig;
