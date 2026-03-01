/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "thumbs.static-thomann.de" },
      { protocol: "https", hostname: "**.thomann.de" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "**.ldlc.com" },
      { protocol: "https", hostname: "**.bhphoto.com" },
      { protocol: "https", hostname: "**.woodbrass.com" },
    ],
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
