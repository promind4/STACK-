import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Footer } from "@/components/server/Footer";
import { Navbar } from "@/components/client/Navbar";
import { JsonLd } from "@/components/server/JsonLd";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";

const switzer = localFont({
  src: [
    { path: "../public/fonts/Switzer-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/Switzer-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/Switzer-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/Switzer-Bold.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/Switzer-Extrabold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-switzer",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fluxlab.fr"),
  title: {
    default: "Fluxlab | Comparateur Intelligent de Matériel Studio",
    template: "%s | Fluxlab",
  },
  description:
    "Comparateur multi-boutiques et configurateur IA pour Audio, Vidéo et Streaming. Trouvez le meilleur prix parmi Amazon, Thomann, Woodbrass et plus.",
  openGraph: {
    type: "website",
    siteName: "Fluxlab",
    locale: "fr_FR",
  },
  icons: {
    icon: "/branding/favicon.svg?v=2",
    apple: "/branding/favicon.svg?v=2",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-0BSNJVZ7DY";
  return (
    <html lang="fr" className={`${switzer.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col">
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Fluxlab",
          url: "https://fluxlab.fr",
          logo: "https://fluxlab.fr/branding/logo.svg",
          description: "Comparateur intelligent de matériel audio, vidéo et streaming. Trouvez le meilleur prix parmi Amazon, Thomann, Woodbrass et plus.",
          sameAs: [],
        }} />
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Fluxlab",
          url: "https://fluxlab.fr",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: "https://fluxlab.fr/recherche?q={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
        }} />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${gaId}');
          `}
        </Script>
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            src={`${process.env.NEXT_PUBLIC_UMAMI_HOST_URL || "https://cloud.umami.is"}/script.js`}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
