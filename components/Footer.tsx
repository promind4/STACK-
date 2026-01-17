import React from 'react';
import { APP_NAME } from '../constants';
import { Monitor, Youtube, Instagram, Twitter } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    if (onNavigate) onNavigate(page);
  };

  return (
    <footer className="bg-background border-t border-border pt-12 md:pt-20 pb-8">
      <div className="container mx-auto px-6 max-w-[1600px]">
        {/* GRILLE PRINCIPALE : 2 COL SUR MOBILE, 4 SUR DESKTOP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 mb-16">
          
          {/* Brand - Prend 2 colonnes sur mobile pour rester lisible */}
          <div className="col-span-2 md:col-span-1 space-y-6">
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={(e) => handleNav(e, 'home')}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-colors">
                 <Monitor className="w-6 h-6 text-primary" />
              </div>
              <span className="font-bold text-xl tracking-tighter text-foreground">{APP_NAME}</span>
            </div>
            <p className="text-[13px] md:text-sm text-muted-foreground leading-relaxed font-light max-w-xs">
              La plateforme de référence pour configurer votre studio créatif. Hardware, Software, et Assets pour Audio, Vidéo et Streaming.
            </p>
          </div>

          {/* Links 1: Verticales */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Univers</h4>
            <ul className="space-y-3 text-[13px] md:text-sm text-muted-foreground font-light">
              <li><a href="#" onClick={(e) => handleNav(e, 'category')} className="hover:text-primary transition-colors">Studio & Son</a></li>
              <li><a href="#" onClick={(e) => handleNav(e, 'category')} className="hover:text-primary transition-colors">Image & Lumière</a></li>
              <li><a href="#" onClick={(e) => handleNav(e, 'category')} className="hover:text-primary transition-colors">Streaming Live</a></li>
              <li><a href="#" onClick={(e) => handleNav(e, 'configurator')} className="hover:text-primary transition-colors font-medium">Le Labo IA</a></li>
            </ul>
          </div>

          {/* Links 2: Ressources */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Ressources</h4>
            <ul className="space-y-3 text-[13px] md:text-sm text-muted-foreground font-light">
              <li><a href="#" onClick={(e) => handleNav(e, 'guides')} className="hover:text-primary transition-colors">Guides d'achat</a></li>
              <li><a href="#" onClick={(e) => handleNav(e, 'about')} className="hover:text-primary transition-colors">L'Atelier Stackera</a></li>
              <li><a href="#" onClick={(e) => handleNav(e, 'guides')} className="hover:text-primary transition-colors">Parcours Créateurs</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Links 3: Social & Suivi (Visible uniquement en col simple sur desktop ou 4e col) */}
          <div className="col-span-2 md:col-span-1 space-y-6 pt-4 md:pt-0">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Communauté</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-sm">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-sm">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-sm">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            <p className="text-[11px] text-muted-foreground font-light italic leading-tight">
              Rejoignez plus de 12,000 créateurs qui optimisent leur stack chaque mois.
            </p>
          </div>
        </div>

        {/* BARRE FINALE */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] md:text-xs text-muted-foreground text-center md:text-left">
          <p className="font-light">&copy; {new Date().getFullYear()} {APP_NAME}. Tous droits réservés.</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#" onClick={(e) => handleNav(e, 'legal-mentions')} className="hover:text-foreground transition-colors">Mentions Légales</a>
            <a href="#" onClick={(e) => handleNav(e, 'privacy')} className="hover:text-foreground transition-colors">Confidentialité</a>
            <a href="#" onClick={(e) => handleNav(e, 'cgu')} className="hover:text-foreground transition-colors">CGU</a>
          </div>
        </div>
      </div>
    </footer>
  );
};