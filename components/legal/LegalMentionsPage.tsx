import React from 'react';
import { motion } from 'framer-motion';

import { ShieldCheck } from 'lucide-react';
import { APP_NAME } from '../../constants';
import { useSEO } from '../SEOHelper';

interface LegalPageProps {
  onNavigate: (page: string) => void;
}

export const LegalMentionsPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  useSEO({
    title: 'Mentions Légales',
    description: `Mentions légales et informations juridiques de ${APP_NAME}. Éditeur, hébergement et conditions d'utilisation.`,
  });

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">


      <main className="pt-32 pb-24 container mx-auto px-6 max-w-[900px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Mentions Légales</h1>
          <p className="text-muted-foreground">En vigueur au 01/01/2025</p>
        </motion.div>

        <div className="prose prose-stone prose-lg max-w-none 
          prose-headings:font-serif prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-4
          prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        ">
          <p>
            Conformément aux dispositions des Articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la Confiance dans l'économie numérique, dite L.C.E.N., il est porté à la connaissance des utilisateurs et visiteurs du site <strong>{APP_NAME}</strong> les présentes mentions légales.
          </p>

          <h3>1. Éditeur du Site</h3>
          <p>
            Le site {APP_NAME} est édité par la société <strong>FLUXLAB SAS</strong> (Société par Actions Simplifiée) au capital de 10 000 euros.<br />
            <strong>Siège social :</strong> 123 Avenue de la Création, 75011 Paris, France.<br />
            <strong>RCS :</strong> Paris B 123 456 789.<br />
            <strong>Numéro de TVA intracommunautaire :</strong> FR 12 123456789.<br />
            <strong>Directeur de la publication :</strong> John Doe.
          </p>

          <h3>2. Hébergement</h3>
          <p>
            Le site est hébergé par <strong>Vercel Inc.</strong><br />
            Adresse : 340 S Lemon Ave #4133 Walnut, CA 91789, USA.<br />
            Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">https://vercel.com</a>
          </p>

          <h3>3. Propriété Intellectuelle</h3>
          <p>
            L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
          </p>
          <p>
            La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
          </p>

          <h3>4. Contact</h3>
          <p>
            Pour tout signalement de contenus ou d'activités illicites, l'utilisateur peut contacter l'éditeur à l'adresse suivante : <strong>legal@fluxlab.com</strong> ou par courrier recommandé avec accusé de réception adressé à l'Éditeur aux coordonnées précisées dans les présentes mentions légales.
          </p>
        </div>
      </main>


    </div>
  );
};