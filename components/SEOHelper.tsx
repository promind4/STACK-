import { useEffect } from 'react';
import { APP_NAME } from '../constants';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
}

/**
 * Hook pour gérer le SEO dynamique sur une SPA.
 * Met à jour le titre du document et les balises meta.
 */
export const useSEO = ({ title, description, image }: SEOProps) => {
  useEffect(() => {
    // 1. Mise à jour du Titre
    // Ex: "Shure SM7B - Avis & Prix | Stackera"
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

  }, [title, description, image]);
};