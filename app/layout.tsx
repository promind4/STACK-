import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Footer } from "@/components/server/Footer";
import { Navbar } from "@/components/client/Navbar";
import { JsonLd } from "@/components/server/JsonLd";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    icon: "/branding/favicon.svg",
    apple: "/branding/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-0BSNJVZ7DY";
  return (
    <html lang="fr" className={`${inter.variable} ${jetbrains.variable}`}>
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
      </body>
    </html>
  );
}
