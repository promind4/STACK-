import React, { useState } from 'react';
import { APP_NAME } from '../constants';
import { Button } from './ui/Button';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { 
  Menu, X, Monitor, ChevronRight, 
  Mic, Camera, Radio, Sparkles, LogOut, User as UserIcon, Settings,
  Music, Gamepad2, Video
} from 'lucide-react';
import { LoginModal } from './auth/LoginModal';

interface NavbarProps {
  onNavigate?: (page: string) => void;
}

// --- CONFIGURATION DU MEGA MENU DYNAMIQUE ---
const MENU_DATA = [
  {
    id: 'audio',
    label: 'Studio & Son',
    icon: <Mic className="w-4 h-4" />,
    targetPage: 'category',
    columns: [
      {
        title: "Microphones",
        items: [
          { label: "Micros Dynamiques", desc: "Pour la voix radio" },
          { label: "Micros Condensateurs", desc: "Pour le chant & détails" },
          { label: "Micros USB", desc: "Plug & Play" },
          { label: "Micros Shotgun", desc: "Pour la vidéo" }
        ]
      },
      {
        title: "Interfaces & Son",
        items: [
          { label: "Cartes Son USB", desc: "Scarlett, Audient..." },
          { label: "Préamplis & Cloudlifter", desc: "Boostez votre gain" },
          { label: "Casques Studio", desc: "Monitoring précis" },
          { label: "Enceintes", desc: "Écoute de référence" }
        ]
      },
      {
        title: "Accessoires",
        items: [
          { label: "Bras articulés", desc: "Rode, Elgato" },
          { label: "Câbles XLR", desc: "Haute qualité" },
          { label: "Traitement Acoustique", desc: "Mousses & Panneaux" }
        ]
      }
    ],
    // TYPE PROMO : Produit spécifique pour achat impulsif
    promo: {
      type: 'product',
      title: "Pack Démarrage",
      desc: "Tout pour lancer votre premier podcast ce week-end.",
      price: "Dès 299€",
      imageColor: "bg-amber-100",
      actionLabel: "Voir le pack",
      target: "category"
    }
  },
  {
    id: 'video',
    label: 'Image & Lumière',
    icon: <Camera className="w-4 h-4" />,
    targetPage: 'category',
    columns: [
      {
        title: "Caméras",
        items: [
          { label: "Hybrides (Mirrorless)", desc: "Sony Alpha, Canon R" },
          { label: "Webcams Pro", desc: "Elgato Facecam, Razer" },
          { label: "Action Cams", desc: "GoPro, DJI" }
        ]
      },
      {
        title: "Objectifs",
        items: [
          { label: "Grand Angle", desc: "Pour le Vlogging" },
          { label: "Focale Fixe", desc: "Le flou d'arrière-plan" },
          { label: "Zooms Polyvalents", desc: "Tout terrain" }
        ]
      },
      {
        title: "Éclairage",
        items: [
          { label: "Key Lights", desc: "Lumière principale" },
          { label: "Softbox", desc: "Diffusion douce" },
          { label: "RGB & Ambiance", desc: "Tubes LED, Rubans" }
        ]
      }
    ],
    // TYPE TOOL : Redirection vers le Configurateur
    promo: {
      type: 'tool',
      title: "Le Labo Stackera",
      desc: "Nos algorithmes configurent votre setup idéal gratuitement.",
      icon: <Sparkles className="w-8 h-8 text-primary" />,
      actionLabel: "Lancer le Configurateur",
      target: "configurator"
    }
  },
  {
    id: 'streaming',
    label: 'Streaming',
    icon: <Radio className="w-4 h-4" />,
    targetPage: 'category',
    columns: [
      {
        title: "Captation",
        items: [
          { label: "Cartes d'acquisition", desc: "Cam Link, HD60 X" },
          { label: "Stream Deck", desc: "Contrôle total" },
          { label: "Switchers Vidéo", desc: "ATEM Mini" }
        ]
      },
      {
        title: "Setup Live",
        items: [
          { label: "Fonds verts", desc: "Incrustation propre" },
          { label: "Téléprompteurs", desc: "Pour lire vos scripts" },
          { label: "Câble Management", desc: "Organisation" }
        ]
      },
      {
        title: "Logiciels",
        items: [
          { label: "OBS Studio", desc: "Configuration" },
          { label: "Overlays", desc: "Design de scène" },
          { label: "Alertes", desc: "Interaction chat" }
        ]
      }
    ],
    // TYPE TOOL : Redirection vers le Configurateur
    promo: {
      type: 'tool',
      title: "Le Labo Stackera",
      desc: "Besoin d'aide pour streamer ? L'IA construit votre régie.",
      icon: <Monitor className="w-8 h-8 text-primary" />,
      actionLabel: "Lancer le Configurateur",
      target: "configurator"
    }
  }
];

// Types pour l'utilisateur connecté
interface UserState {
  name: string;
  email: string;
  type: 'music' | 'video' | 'stream' | null;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  // --- AUTH STATE ---
  const [user, setUser] = useState<UserState | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLoginSuccess = (userData: UserState) => {
    setUser(userData);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsProfileMenuOpen(false);
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  const handleMouseEnter = (menuId: string) => {
    setActiveMenu(menuId);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  const handleNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
    setActiveMenu(null);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  // Helper pour l'icone du profil
  const getProfileIcon = () => {
    switch(user?.type) {
      case 'music': return <Music className="w-3 h-3 text-white" />;
      case 'video': return <Video className="w-3 h-3 text-white" />;
      case 'stream': return <Gamepad2 className="w-3 h-3 text-white" />;
      default: return null;
    }
  };

  // Helper pour le label du profil
  const getProfileLabel = () => {
     switch(user?.type) {
      case 'music': return 'Musicien';
      case 'video': return 'Vidéaste';
      case 'stream': return 'Streamer';
      default: return 'Créateur';
    }
  };

  return (
    <>
      <motion.nav
        onMouseLeave={handleMouseLeave}
        className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
          isScrolled || activeMenu
            ? 'bg-background/95 backdrop-blur-md border-border shadow-sm' 
            : 'bg-transparent border-transparent py-2'
        }`}
      >
        <div className="container mx-auto px-6 max-w-[1600px]">
          <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled || activeMenu ? 'py-3' : 'py-5'}`}>
            
            {/* LOGO */}
            <div 
              onClick={() => handleNavigation('home')}
              className="flex items-center gap-2 group z-50 relative cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:border-primary/60 transition-colors">
                 <Monitor className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground">
                {APP_NAME} <span className="text-primary text-sm font-mono align-top">PRO</span>
              </span>
            </div>

            {/* DESKTOP NAV (MEGA MENU TRIGGERS) */}
            <div className="hidden md:flex items-center gap-1">
              {MENU_DATA.map((menu) => (
                <div 
                  key={menu.id}
                  onMouseEnter={() => handleMouseEnter(menu.id)}
                  className="relative px-4 py-2 cursor-pointer group"
                >
                  <div 
                    onClick={() => handleNavigation(menu.targetPage)}
                    className={`text-sm font-medium flex items-center gap-2 transition-colors ${
                      activeMenu === menu.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {menu.icon}
                    {menu.label}
                  </div>
                  
                  {/* Active Indicator Line */}
                  {activeMenu === menu.id && (
                    <motion.div 
                      layoutId="underline"
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"
                    />
                  )}
                </div>
              ))}
               <div 
                  onClick={() => handleNavigation('guides')}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 cursor-pointer"
               >
                  Guides & Tutos
               </div>
            </div>

            {/* ACTIONS */}
            <div className="hidden md:flex items-center gap-4 z-50 relative">
              
              {/* AUTH BUTTON / PROFILE */}
              {user ? (
                 <div className="relative">
                    <button 
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-secondary transition-colors border border-transparent hover:border-border"
                    >
                       <div className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center shadow-sm relative">
                          <span className="text-xs">{user.name.charAt(0).toUpperCase()}</span>
                          {user.type && (
                            <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5 border border-white">
                              {getProfileIcon()}
                            </div>
                          )}
                       </div>
                       <span className="text-sm font-medium mr-1 hidden lg:block">{user.name}</span>
                    </button>

                    {/* Profile Dropdown */}
                    <AnimatePresence>
                      {isProfileMenuOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl border border-border shadow-xl p-2 z-50"
                        >
                           <div className="px-3 py-2 border-b border-border/50 mb-2">
                              <p className="text-xs font-bold text-foreground">{user.name}</p>
                              <p className="text-[10px] text-muted-foreground mb-1">{user.email}</p>
                              <span className="inline-block text-[10px] font-bold uppercase tracking-wide bg-secondary px-2 py-0.5 rounded text-primary">
                                {getProfileLabel()}
                              </span>
                           </div>
                           <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-lg flex items-center gap-2 transition-colors">
                              <UserIcon className="w-4 h-4" /> Mon Espace
                           </button>
                           <button className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-lg flex items-center gap-2 transition-colors">
                              <Settings className="w-4 h-4" /> Préférences
                           </button>
                           <div className="h-px bg-border/50 my-2" />
                           <button 
                             onClick={handleLogout}
                             className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors"
                            >
                              <LogOut className="w-4 h-4" /> Déconnexion
                           </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                 </div>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setIsLoginModalOpen(true)}>
                  Connexion
                </Button>
              )}
              
              <Button variant="primary" size="sm" className="group" onClick={() => handleNavigation('configurator')}>
                Le Labo
                <Sparkles className="w-4 h-4 ml-1 opacity-70" />
              </Button>
            </div>

            {/* MOBILE TOGGLE */}
            <button 
              className="md:hidden p-2 text-foreground z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* MEGA MENU DROPDOWN (DESKTOP) */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="hidden md:block absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-border shadow-lg overflow-hidden"
            >
              <div className="container mx-auto px-6 max-w-[1600px] py-12">
                {MENU_DATA.map((menu) => {
                  if (menu.id !== activeMenu) return null;
                  
                  return (
                    <div key={menu.id} className="grid grid-cols-12 gap-8">
                      
                      {/* Columns */}
                      {menu.columns.map((col, idx) => (
                        <div key={idx} className="col-span-3 space-y-6">
                          <h4 className="font-bold text-foreground flex items-center gap-2 text-sm uppercase tracking-wider">
                            <span className="w-1 h-4 bg-primary/50 rounded-full"></span>
                            {col.title}
                          </h4>
                          <ul className="space-y-4">
                            {col.items.map((item, itemIdx) => (
                              <li 
                                key={itemIdx} 
                                className="group cursor-pointer"
                                onClick={() => handleNavigation('category')}
                              >
                                <div className="font-medium text-sm text-foreground/80 group-hover:text-primary transition-colors">
                                  {item.label}
                                </div>
                                <div className="text-xs text-muted-foreground group-hover:text-muted-foreground/80">
                                  {item.desc}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}

                      {/* DYNAMIC PROMO COLUMN */}
                      <div className="col-span-3">
                        {menu.promo.type === 'product' ? (
                          // CASE 1: PRODUCT PROMO (Audio)
                          <div 
                            onClick={() => handleNavigation(menu.promo.target)}
                            className={`rounded-xl p-6 h-full flex flex-col justify-end relative overflow-hidden group border border-border cursor-pointer ${menu.promo.imageColor}`}
                          >
                            <div className="absolute top-4 right-4">
                               <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                  PROMO
                                </div>
                            </div>
                            
                            <div className="relative z-10 mt-20">
                              <h4 className="font-bold text-xl text-foreground mb-2">{menu.promo.title}</h4>
                              <p className="text-sm text-foreground/70 mb-4">{menu.promo.desc}</p>
                              <div className="flex items-center justify-between bg-white/60 p-3 rounded-lg backdrop-blur-sm group-hover:bg-white/80 transition-colors">
                                  <span className="font-bold text-foreground">{menu.promo.price}</span>
                                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                      <ChevronRight className="w-4 h-4 text-white" />
                                  </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // CASE 2: TOOL PROMO (Configurator - Video/Streaming)
                          <div 
                            onClick={() => handleNavigation(menu.promo.target)}
                            className="bg-[#E8DCC4]/30 rounded-xl p-6 h-full border border-primary/20 flex flex-col items-center justify-center text-center cursor-pointer group hover:bg-[#E8DCC4]/50 transition-colors relative overflow-hidden"
                          >
                             <div className="absolute top-0 right-0 p-20 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                             
                             <div className="relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
                                   {menu.promo.icon}
                                </div>
                                <h4 className="font-bold text-lg text-foreground mb-2">{menu.promo.title}</h4>
                                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                                  {menu.promo.desc}
                                </p>
                                <Button size="sm" className="w-full">
                                  {menu.promo.actionLabel}
                                </Button>
                             </div>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: '100vh' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden fixed top-[60px] left-0 w-full bg-background z-40 overflow-y-auto pb-20 border-t border-border"
            >
              <div className="flex flex-col p-6 space-y-6">
                {MENU_DATA.map((menu) => (
                  <div key={menu.id} className="space-y-4">
                    <div 
                      className="flex items-center gap-3 text-xl font-bold text-foreground"
                      onClick={() => handleNavigation(menu.targetPage)}
                    >
                      <div className="p-2 bg-secondary rounded-lg">
                        {menu.icon}
                      </div>
                      {menu.label}
                    </div>
                    <div className="pl-12 grid gap-3">
                       {menu.columns.map(col => (
                          <div key={col.title}>
                             <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2 block">{col.title}</span>
                             <ul className="space-y-2 mb-4">
                                {col.items.slice(0,3).map(item => (
                                   <li 
                                      key={item.label} 
                                      className="text-sm text-muted-foreground"
                                      onClick={() => handleNavigation('category')}
                                   >
                                      {item.label}
                                   </li>
                                ))}
                             </ul>
                          </div>
                       ))}
                    </div>
                    <div className="h-px w-full bg-border" />
                  </div>
                ))}
                 <div 
                    className="flex items-center gap-3 text-xl font-bold text-foreground"
                    onClick={() => handleNavigation('guides')}
                 >
                   Guides & Tutos
                 </div>
                 
                 {/* Mobile CTA for Configurator */}
                 <div className="bg-secondary/30 p-4 rounded-xl border border-border">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Le Labo Stackera
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3">Laissez l'IA configurer votre setup.</p>
                    <Button variant="primary" size="sm" className="w-full" onClick={() => handleNavigation('configurator')}>
                      Lancer l'outil
                    </Button>
                 </div>

                <div className="pt-4 flex flex-col gap-3">
                  {user ? (
                     <div className="bg-secondary/20 p-4 rounded-xl space-y-3">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                              {user.name.charAt(0).toUpperCase()}
                           </div>
                           <div>
                              <p className="font-bold text-foreground">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                           </div>
                        </div>
                        <Button variant="outline" className="w-full justify-start">
                           <UserIcon className="w-4 h-4 mr-2" /> Mon Espace
                        </Button>
                        <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50" onClick={handleLogout}>
                           <LogOut className="w-4 h-4 mr-2" /> Déconnexion
                        </Button>
                     </div>
                  ) : (
                    <Button variant="ghost" className="w-full justify-start text-lg" onClick={() => setIsLoginModalOpen(true)}>
                      Connexion
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* GLOBAL LOGIN MODAL (MOCKUP) */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};