import React from 'react';
import { APP_NAME } from '../constants';
import { Monitor } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string, slug?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (e: React.MouseEvent, page: string, slug?: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page, slug);
    }
  };

  return (
    <footer className="bg-background border-t border-border pt-10 md:pt-14 pb-6">
      <div className="container mx-auto px-6 max-w-[1200px]">

        {/* LAYOUT PRINCIPAL : Grid Hybrid (Mobile: 2 cols / Desktop: 4 cols) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 lg:gap-12 mb-10">

          {/* COLONNE 1 : MARQUE & LOGO (Mobile: Full Width / Desktop: Col 1) */}
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={(e) => handleNav(e, 'home')}
            >
              <img
                src="/branding/logo.svg"
                alt="Logo"
                className="h-8 w-auto"
              />
              {/* Le texte FluxLab est dans le logo, pas de duplication */}
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed font-light">
              La plateforme de référence pour configurer votre studio créatif.
            </p>
          </div>

          {/* COLONNE 2 : UNIVERS (Mobile: Col 1 Row 2 / Desktop: Col 2) */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Univers</h4>
            <ul className="space-y-3 text-[13px] text-muted-foreground font-light">
              <li><a href="#" onClick={(e) => handleNav(e, 'category', 'audio')} className="hover:text-primary transition-colors">Studio & Son</a></li>
              <li><a href="#" onClick={(e) => handleNav(e, 'category', 'video')} className="hover:text-primary transition-colors">Image & Lumière</a></li>
              <li><a href="#" onClick={(e) => handleNav(e, 'category', 'streaming')} className="hover:text-primary transition-colors">Streaming Live</a></li>
              <li><a href="#" onClick={(e) => handleNav(e, 'configurator')} className="hover:text-primary transition-colors font-medium">Le Labo IA</a></li>
            </ul>
          </div>

          {/* COLONNE 3 : INFORMATIONS LÉGALES (Mobile: Col 2 Row 2+3 (Right Side) / Desktop: Col 3) */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Informations Légales</h4>
            <ul className="space-y-3 text-[13px] text-muted-foreground font-light">
              <li><a href="#" onClick={(e) => handleNav(e, 'legal-mentions')} className="hover:text-primary transition-colors">Mentions Légales</a></li>
              <li><a href="#" onClick={(e) => handleNav(e, 'privacy')} className="hover:text-primary transition-colors">Politique de confidentialité</a></li>
              <li><a href="#" onClick={(e) => handleNav(e, 'cgu')} className="hover:text-primary transition-colors">CGU</a></li>
              <li><a href="#" onClick={(e) => handleNav(e, 'admin')} className="hover:text-primary transition-colors">Administrateur</a></li>
            </ul>
          </div>

          {/* COLONNE 4 : RESSOURCES (Mobile: Col 1 Row 3 (Stacked below Univers) / Desktop: Col 4) */}
          <div className="col-start-1 lg:col-start-auto space-y-4">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Ressources</h4>
            <ul className="space-y-3 text-[13px] text-muted-foreground font-light">
              <li><a href="#" onClick={(e) => handleNav(e, 'guides')} className="hover:text-primary transition-colors">Guides et tutos</a></li>
              <li><a href="#" onClick={(e) => handleNav(e, 'about')} className="hover:text-primary transition-colors">L'Atelier Fluxlab</a></li>
            </ul>
          </div>

        </div>


        {/* BARRE FINALE */}
        <div className="border-t border-border pt-6 flex justify-center items-center text-[11px] md:text-xs text-muted-foreground">
          <p className="font-light">&copy; {new Date().getFullYear()}. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};
