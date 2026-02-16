import React from 'react';
import { motion } from 'framer-motion';

import { FileText } from 'lucide-react';
import { APP_NAME } from '../../constants';
import { useSEO } from '../SEOHelper';

interface LegalPageProps {
  onNavigate: (page: string) => void;
}

export const TermsPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  useSEO({
    title: 'Conditions Générales d\'Utilisation',
    description: `Conditions générales d'utilisation de ${APP_NAME}. Règles d'accès, responsabilités et droits des utilisateurs.`,
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
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Conditions Générales d'Utilisation</h1>
          <p className="text-muted-foreground">Dernière mise à jour : 01 Janvier 2025</p>
        </motion.div>

        <div className="prose prose-stone prose-lg max-w-none 
          prose-headings:font-serif prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-4
          prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground
          prose-ul:text-muted-foreground
        ">
          <h3>1. Objet</h3>
          <p>
            Les présentes Conditions Générales d'Utilisation (ci-après "CGU") ont pour objet de définir les modalités de mise à disposition des services du site <strong>{APP_NAME}</strong> et les conditions d'utilisation par l'Utilisateur.
          </p>

          <h3>2. Accès au Service</h3>
          <p>
            Le Service est accessible gratuitement à tout Utilisateur disposant d'un accès à internet. Tous les coûts afférents à l'accès au Service, que ce soient les frais matériels, logiciels ou d'accès à internet sont exclusivement à la charge de l'utilisateur.
          </p>
          <p>
            L'Éditeur met en œuvre tous les moyens raisonnables à sa disposition pour assurer un accès de qualité au Service, mais n'est tenu à aucune obligation d'y parvenir.
          </p>

          <h3>3. Responsabilité et Configurateur</h3>
          <p>
            <strong>{APP_NAME}</strong> propose un outil de configuration ("Le Labo") basé sur des algorithmes de recommandation. Bien que nous nous efforcions de fournir des informations précises et des compatibilités vérifiées :
          </p>
          <ul>
            <li>Les recommandations sont fournies à titre indicatif.</li>
            <li>L'Éditeur ne saurait être tenu responsable en cas d'incompatibilité matérielle non détectée ou d'évolution des caractéristiques techniques des produits par les fabricants.</li>
            <li>L'Utilisateur est invité à vérifier les spécifications techniques avant tout achat.</li>
          </ul>

          <h3>4. Liens d'Affiliation</h3>
          <p>
            Le site contient des liens hypertextes vers des sites tiers (partenaires marchands comme Amazon, Thomann, etc.). Ces liens sont souvent des "liens d'affiliation". Cela signifie que si vous achetez un produit via ces liens, {APP_NAME} peut percevoir une commission, sans surcoût pour vous.
          </p>
          <p>
            L'Éditeur n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou aux transactions qui pourraient y être effectuées.
          </p>

          <h3>5. Propriété Intellectuelle</h3>
          <p>
            Les marques, logos, signes ainsi que tous les contenus du site (textes, images, son, algorithmes) font l'objet d'une protection par le Code de la propriété intellectuelle et plus particulièrement par le droit d'auteur.
          </p>

          <h3>6. Droit applicable</h3>
          <p>
            Les présentes CGU sont soumises au droit français. En cas de litige non résolu à l'amiable, les tribunaux français seront seuls compétents.
          </p>
        </div>
      </main>


    </div>
  );
};