import { useEffect } from 'react';
import { APP_NAME } from '../constants';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  jsonLd?: Record<string, any>;
  canonical?: string;
}

/**
 * Hook pour gérer le SEO dynamique sur une SPA.
 * Met à jour le titre du document, les balises meta, les liens canoniques et le JSON-LD.
 */
export const useSEO = ({ title, description, image, jsonLd, canonical }: SEOProps) => {
  useEffect(() => {
    // 1. Mise à jour du Titre
    document.title = `${title} | ${APP_NAME}`;

    // 2. Helper pour mettre à jour ou créer une meta tag
    const updateMeta = (name: string, content: string, isProperty: boolean = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    };

    // 3. Mise à jour des Metas Standards & OpenGraph
    if (description) {
      updateMeta('description', description);
      updateMeta('og:description', description, true);
    }

    updateMeta('og:title', title, true);
    updateMeta('og:site_name', APP_NAME, true);

    if (image) {
      updateMeta('og:image', image, true);
      updateMeta('twitter:card', 'summary_large_image', false);
    }

    // 4. Canonical URL
    if (canonical) {
      let link = document.querySelector("link[rel='canonical']");
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonical);
      updateMeta('og:url', canonical, true);
    }

    // 5. JSON-LD Structured Data
    if (jsonLd) {
      let script = document.querySelector("script[type='application/ld+json']");
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }

  }, [title, description, image, jsonLd, canonical]);
};