import React from 'react';
import { motion } from 'framer-motion';

import { Lock } from 'lucide-react';
import { APP_NAME } from '../../constants';
import { useSEO } from '../SEOHelper';

interface LegalPageProps {
  onNavigate: (page: string) => void;
}

export const PrivacyPage: React.FC<LegalPageProps> = ({ onNavigate }) => {
  useSEO({
    title: 'Politique de Confidentialité',
    description: `Politique de confidentialité de ${APP_NAME}. Protection de vos données personnelles, cookies et droits RGPD.`,
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
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Politique de Confidentialité</h1>
          <p className="text-muted-foreground">La protection de vos données est notre priorité.</p>
        </motion.div>

        <div className="prose prose-stone prose-lg max-w-none 
          prose-headings:font-serif prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-4
          prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground
        ">
          <h3>1. Collecte des Données</h3>
          <p>
            Dans le cadre de l'utilisation de <strong>{APP_NAME}</strong>, nous sommes amenés à collecter et traiter certaines de vos données personnelles. En utilisant notre site, vous reconnaissez avoir pris connaissance de la présente politique de confidentialité.
          </p>
          <p>
            <strong>Données collectées automatiquement :</strong> Lors de vos visites, nous recueillons des informations relatives à votre connexion et navigation (adresse IP, date et heure, type de navigateur).
          </p>
          <p>
            <strong>Données transmises volontairement :</strong> Via le formulaire de connexion (Google Auth), nous collectons votre adresse email, votre nom et votre photo de profil afin de créer votre espace utilisateur ("Le Labo").
          </p>

          <h3>2. Utilisation des Données</h3>
          <p>Vos données sont utilisées pour :</p>
          <ul>
            <li>Gérer votre accès à votre compte utilisateur.</li>
            <li>Sauvegarder vos configurations de matériel.</li>
            <li>Améliorer nos services et algorithmes de recommandation.</li>
            <li>Vous envoyer des informations techniques (si vous y avez consenti).</li>
          </ul>

          <h3>3. Cookies</h3>
          <p>
            Un "cookie" est un petit fichier stocké par votre navigateur. Nous utilisons des cookies pour :
          </p>
          <ul>
            <li>Le fonctionnement technique du site (session utilisateur).</li>
            <li>La mesure d'audience (statistiques anonymes).</li>
          </ul>
          <p>
            Vous pouvez à tout moment configurer votre logiciel de navigation pour refuser les cookies, ce qui pourrait toutefois altérer le fonctionnement de certaines fonctionnalités (connexion, sauvegarde).
          </p>

          <h3>4. Partage des Données</h3>
          <p>
            Nous ne vendons ni ne louons vos données personnelles à des tiers. Vos données peuvent être transmises à nos sous-traitants techniques (hébergement, authentification) uniquement pour la bonne exécution des services.
          </p>

          <h3>5. Vos Droits (RGPD)</h3>
          <p>
            Conformément à la réglementation européenne (RGPD), vous disposez des droits suivants : accès, rectification, effacement, limitation, opposition et portabilité de vos données.
          </p>
          <p>
            Pour exercer ces droits, vous pouvez nous contacter à : <strong>privacy@fluxlab.com</strong>. Nous nous engageons à répondre dans un délai d'un mois.
          </p>
        </div>
      </main>


    </div>
  );
};