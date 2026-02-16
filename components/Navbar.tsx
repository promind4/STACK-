import React, { useState } from 'react';
import { APP_NAME } from '../constants';
import { Button } from './ui/Button';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import {
  Menu, X, Monitor, ChevronRight,
  Mic, Camera, Radio, Sparkles, LogOut, User as UserIcon, Settings,
  Music, Gamepad2, Video, Search
} from 'lucide-react';
import { LoginModal } from './auth/LoginModal';
import { useSearchSuggestions } from '../hooks/useSearchSuggestions';

interface NavbarProps {
  onNavigate?: (page: string, slug?: string, query?: string) => void;
  isDark?: boolean; // Use white text when transparent
}

interface MenuColumnItem {
  label: string;
  desc: string;
  slug: string;
}

interface MenuColumn {
  title: string;
  items: MenuColumnItem[];
}

interface PromoUniqueProps {
  price?: string;
  imageColor?: string;
}

interface MenuPromo extends PromoUniqueProps {
  type: 'product' | 'tool';
  title: string;
  desc: string;
  icon?: React.ReactNode;
  actionLabel: string;
  target: string;
  targetSlug?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  targetPage: string;
  columns: MenuColumn[];
  promo: MenuPromo;
}

// --- CONFIGURATION DU MEGA MENU DYNAMIQUE ---
const MENU_DATA: MenuItem[] = [
  {
    id: 'audio',
    label: 'Studio & Son',
    icon: <Mic className="w-4 h-4" />,
    targetPage: 'category',
    columns: [
      {
        title: "Microphones",
        items: [
          { label: "Micros Dynamiques", desc: "Pour la voix radio", slug: "micros-dynamiques" },
          { label: "Micros Condensateurs", desc: "Pour le chant & détails", slug: "micros-condensateurs" },
          { label: "Micros USB", desc: "Plug & Play", slug: "micros-usb" },
          { label: "Micros Shotgun", desc: "Pour la vidéo", slug: "micros-shotgun" }
        ]
      },
      {
        title: "Interfaces & Son",
        items: [
          { label: "Cartes Son USB", desc: "Scarlett, Audient...", slug: "cartes-son" },
          { label: "Préamplis & Cloudlifter", desc: "Boostez votre gain", slug: "preamplis" },
          { label: "Casques Studio", desc: "Monitoring précis", slug: "casques-studio" },
          { label: "Enceintes", desc: "Écoute de référence", slug: "enceintes" }
        ]
      },
      {
        title: "Accessoires",
        items: [
          { label: "Bras articulés", desc: "Rode, Elgato", slug: "bras-articules" },
          { label: "Câbles XLR", desc: "Haute qualité", slug: "cable-xlr" },
          { label: "Traitement Acoustique", desc: "Mousses & Panneaux", slug: "traitement-acoustique" }
        ]
      }
    ],
    // PROMO Audio
    promo: {
      type: 'tool',
      title: "Le Labo Fluxlab",
      desc: "Micro, Interface, Casque ? L'IA compose votre studio sur-mesure.",
      icon: <Sparkles className="w-8 h-8 text-primary" />,
      actionLabel: "Lancer le Configurateur",
      target: "configurator"
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
          { label: "Hybrides (Mirrorless)", desc: "Sony Alpha, Canon R", slug: "hybrides-mirrorless" },
          { label: "Webcams Pro", desc: "Elgato Facecam, Razer", slug: "webcams-pro" },
          { label: "Action Cams", desc: "GoPro, DJI", slug: "action-cams" }
        ]
      },
      {
        title: "Objectifs",
        items: [
          { label: "Grand Angle", desc: "Pour le Vlogging", slug: "grand-angle" },
          // { label: "Focale Fixe", desc: "Le flou d'arrière-plan", slug: "focale-fixe" },
          { label: "Zooms Polyvalents", desc: "Tout terrain", slug: "zoom-polyvalent" }
        ]
      },
      {
        title: "Éclairage",
        items: [
          { label: "Key Lights", desc: "Lumière principale", slug: "keylight" },
          { label: "Softbox", desc: "Diffusion douce", slug: "softbox" },
          { label: "RGB & Ambiance", desc: "Tubes LED, Rubans", slug: "rgb-ambiance" }
        ]
      }
    ],
    // PROMO Video (Configurator)
    promo: {
      type: 'tool',
      title: "Le Labo Fluxlab",
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
          // { label: "Cartes d'acquisition", desc: "Cam Link, HD60 X", slug: "cartes-acquisition" },
          { label: "Stream Deck", desc: "Contrôle total", slug: "stream-deck" },
          // { label: "Switchers Vidéo", desc: "ATEM Mini", slug: "switchers-video" }
        ]
      },
      {
        title: "Setup Live",
        items: [
          { label: "Fonds verts", desc: "Incrustation propre", slug: "fonds-verts" },
          { label: "Téléprompteurs", desc: "Pour lire vos scripts", slug: "teleprompteurs" },
          { label: "Câble Management", desc: "Organisation", slug: "cable-management" }
        ]
      },
      {
        title: "Logiciels",
        items: [
          { label: "Logiciels & Apps", desc: "OBS, vMix, VoiceMod...", slug: "logiciels-apps" },
          { label: "Design & Overlays", desc: "Alertes, Transition, Logos", slug: "design-overlays" }
        ]
      }
    ],
    // PROMO Streaming (Configurator)
    promo: {
      type: 'tool',
      title: "Le Labo Fluxlab",
      desc: "Besoin d'aide pour streamer ? L'IA construit votre régie.",
      icon: <Sparkles className="w-8 h-8 text-primary" />,
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

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, isDark = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  // --- AUTH STATE ---
  const [user, setUser] = useState<UserState | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // --- SEARCH STATE ---
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { suggestions, loading: suggestionsLoading } = useSearchSuggestions(searchQuery);

  const handleSearchSubmit = () => {
    if (searchQuery.trim() && onNavigate) {
      onNavigate('category', undefined, searchQuery);
      setIsSearchOpen(false);
    }
  };

  const handleSelectSuggestion = (slug: string) => {
    if (onNavigate) {
      onNavigate('product', slug);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

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

  const handleNavigation = (page: string, slug?: string) => {
    if (onNavigate) {
      onNavigate(page, slug);
    }
    setActiveMenu(null);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  // Helper pour l'icone du profil
  const getProfileIcon = () => {
    switch (user?.type) {
      case 'music': return <Music className="w-3 h-3 text-white" />;
      case 'video': return <Video className="w-3 h-3 text-white" />;
      case 'stream': return <Gamepad2 className="w-3 h-3 text-white" />;
      default: return null;
    }
  };

  // Helper pour le label du profil
  const getProfileLabel = () => {
    switch (user?.type) {
      case 'music': return 'Musicien';
      case 'video': return 'Vidéaste';
      case 'stream': return 'Streamer';
      default: return 'Créateur';
    }
  };

  // --- DARK MODE LOGIC ---
  const isTransparent = !isScrolled && !activeMenu;
  const textColor = isTransparent && isDark ? 'text-white' : 'text-foreground';
  const mutedColor = isTransparent && isDark ? 'text-white/70' : 'text-muted-foreground';
  const iconColor = isTransparent && isDark ? 'text-white' : 'text-primary';

  return (
    <>
      <motion.nav
        onMouseLeave={handleMouseLeave}
        className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${isScrolled || activeMenu
          ? 'bg-background/95 backdrop-blur-md border-border shadow-sm'
          : 'bg-transparent border-transparent py-2'
          }`}
      >
        <div className="container mx-auto px-6 max-w-[1600px]">
          <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled || activeMenu ? 'py-3' : 'py-5'}`}>

            {/* LOGO */}
            <div
              onClick={() => handleNavigation('home')}
              className="flex items-center group z-50 relative cursor-pointer"
            >
              <img
                src={(isTransparent && isDark) ? '/branding/logo-light.svg' : '/branding/logo.svg'}
                alt={APP_NAME}
                className="h-10 w-auto transition-all duration-300"
              />
            </div>

            {/* DESKTOP NAV */}
            <div className="hidden lg:flex items-center gap-1">
              {MENU_DATA.map((menu) => (
                <div
                  key={menu.id}
                  onMouseEnter={() => handleMouseEnter(menu.id)}
                  className="relative px-4 py-2 cursor-pointer group"
                >
                  <div
                    onClick={() => handleNavigation(menu.targetPage, menu.id)}
                    className={`text-sm font-medium flex items-center gap-2 transition-colors ${activeMenu === menu.id ? 'text-primary' : `${mutedColor} hover:${textColor}`
                      }`}
                  >
                    {React.cloneElement(menu.icon as React.ReactElement, { className: `w-4 h-4 ${activeMenu === menu.id ? 'text-primary' : ''}` })}
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
                className={`text-sm font-medium hover:${textColor} px-4 py-2 cursor-pointer ${mutedColor}`}
              >
                Guides & Tutos
              </div>
            </div>

            {/* ACTIONS */}
            <div className="hidden lg:flex items-center gap-4 z-50 relative">

              {/* SEARCH BAR (Desktop) */}
              <div className="relative flex items-center">
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.form
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 300, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      onSubmit={(e) => { e.preventDefault(); handleSearchSubmit(); }}
                      className="overflow-hidden mr-2"
                    >
                      <input
                        autoFocus
                        type="text"
                        placeholder="Rechercher..."
                        className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary/50 text-foreground" // Force text-foreground in input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onBlur={() => {
                          setTimeout(() => { if (!searchQuery) setIsSearchOpen(false) }, 200);
                        }}
                      />
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* SUGGESTIONS DROPDOWN */}
                <AnimatePresence>
                  {isSearchOpen && searchQuery.length >= 2 && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 w-80 bg-white shadow-2xl rounded-xl border border-border mt-4 overflow-hidden z-[60]"
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {suggestions.map(s => (
                        <div key={s.id} onClick={() => handleSelectSuggestion(s.slug)} className="flex items-center gap-3 p-3 hover:bg-secondary cursor-pointer border-b border-border/50 last:border-0 transition-colors">
                          <div className="w-10 h-10 bg-white border border-border rounded-lg p-1 flex items-center justify-center shrink-0">
                            <img src={s.image_url} className="w-full h-full object-contain" alt={s.name} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-foreground line-clamp-1">{s.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.brand}</p>
                          </div>
                        </div>
                      ))}
                      <div onClick={handleSearchSubmit} className="p-3 text-center text-xs font-bold text-primary cursor-pointer hover:bg-primary/5 transition-colors bg-secondary/20">
                        Voir tous les résultats pour "{searchQuery}"
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={() => {
                    if (isSearchOpen && searchQuery) handleSearchSubmit();
                    else setIsSearchOpen(!isSearchOpen);
                  }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Search className={`w-5 h-5 ${isTransparent && isDark ? 'text-white' : 'text-foreground'}`} />
                </button>
              </div>

              {/* BUTTONS */}
              {user ? (
                <div className="relative">
                  <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-white/10 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center">
                      {user.name.charAt(0)}
                    </div>
                    <span className={`text-sm font-medium ${textColor} hidden lg:block`}>{user.name}</span>
                  </button>
                  {/* Profile Dropdown (Same as before) omitted for brevity? NO, need full file */}
                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl border border-border shadow-xl p-2 z-50 text-foreground"
                      >
                        {/* DROPDOWN CONTENT ALWAYS LIGHT THEME inside */}
                        <div className="px-3 py-2 border-b border-border/50 mb-2">
                          <p className="text-xs font-bold">{user.name}</p>
                          <p className="text-xs text-muted-foreground mb-1">{user.email}</p>
                          <span className="inline-block text-[10px] font-bold uppercase tracking-wide bg-secondary px-2 py-0.5 rounded text-primary">{getProfileLabel()}</span>
                        </div>
                        <button className="w-full text-left px-3 py-2 text-sm hover:bg-secondary rounded-lg flex items-center gap-2 transition-colors"><UserIcon className="w-4 h-4" /> Mon Espace</button>
                        <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors"><LogOut className="w-4 h-4" /> Déconnexion</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Connexion disabled for now */
                <></>
              )}

              <Button variant="primary" size="sm" className="group" onClick={() => handleNavigation('configurator')}>
                Le LaboPro
                <Sparkles className="w-4 h-4 ml-1 opacity-70" />
              </Button>
            </div>

            {/* MOBILE TOGGLE */}
            <button
              className={`lg:hidden p-2 z-50 ${isTransparent && isDark ? 'text-white' : 'text-foreground'}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* MEGA MENU DROPDOWN (DESKTOP) - Keep same logic */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="hidden md:block absolute top-full left-0 w-full bg-white backdrop-blur-xl border-b border-border shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden"
            >
              {/* Content is purely black text on white bg usually */}
              <div className="container mx-auto px-6 max-w-[1600px] py-12 text-foreground">
                {MENU_DATA.map((menu) => {
                  if (menu.id !== activeMenu) return null;
                  return (
                    <div key={menu.id} className="grid grid-cols-12 gap-8">
                      {/* Same columns logic ... */}
                      {menu.columns.map((col, idx) => (
                        <div key={idx} className="col-span-3 space-y-6">
                          <h4 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider"><span className="w-1 h-4 bg-primary/50 rounded-full"></span>{col.title}</h4>
                          <ul className="space-y-4">
                            {col.items.map((item, itemIdx) => (
                              <li key={itemIdx} className="group cursor-pointer" onClick={() => handleNavigation('category', (item as any).slug)}>
                                <div className="font-medium text-sm text-foreground/80 group-hover:text-primary transition-colors">{item.label}</div>
                                <div className="text-xs text-muted-foreground group-hover:text-muted-foreground/80">{item.desc}</div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      {/* Promo logic same as before... */}
                      <div className="col-span-3">
                        {menu.promo.type === 'product' ? (
                          <div onClick={() => handleNavigation(menu.promo.target)} className={`rounded-xl p-6 h-full flex flex-col justify-end relative overflow-hidden group border border-border cursor-pointer ${menu.promo.imageColor}`}>
                            <div className="absolute top-4 right-4"><div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">PROMO</div></div>
                            <div className="relative z-10 mt-20">
                              <h4 className="font-bold text-xl mb-2">{menu.promo.title}</h4>
                              <p className="text-sm opacity-70 mb-4">{menu.promo.desc}</p>
                              <div className="flex items-center justify-between bg-white/60 p-3 rounded-lg backdrop-blur-sm group-hover:bg-white/80 transition-colors">
                                <span className="font-bold">{menu.promo.price}</span>
                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center"><ChevronRight className="w-4 h-4 text-white" /></div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div onClick={() => handleNavigation(menu.promo.target)} className="bg-[#E8DCC4]/30 rounded-xl p-6 h-full border border-primary/20 flex flex-col items-center justify-center text-center cursor-pointer group hover:bg-[#E8DCC4]/50 transition-colors relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-20 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10">
                              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">{menu.promo.icon}</div>
                              <h4 className="font-bold text-lg mb-2">{menu.promo.title}</h4>
                              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{menu.promo.desc}</p>
                              <Button size="sm" className="w-full">{menu.promo.actionLabel}</Button>
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

        {/* MOBILE MENU (SAME) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: '100vh' }} exit={{ opacity: 0, height: 0 }} className="md:hidden fixed top-[60px] left-0 w-full bg-background z-40 overflow-y-auto pb-20 border-t border-border">
              <div className="flex flex-col p-6 space-y-6">
                {/* ... Mobile content is standard theme ... */}
                {MENU_DATA.map((menu) => (
                  <div key={menu.id} className="space-y-4">
                    <div className="flex items-center gap-3 text-xl font-bold text-foreground" onClick={() => handleNavigation(menu.targetPage)}>
                      <div className="p-2 bg-secondary rounded-lg">{menu.icon}</div>{menu.label}
                    </div>
                    <div className="pl-12 grid gap-3">
                      {menu.columns.map(col => (
                        <div key={col.title}>
                          <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2 block">{col.title}</span>
                          <ul className="space-y-2 mb-4">
                            {col.items.slice(0, 3).map(item => (
                              <li key={item.label} className="text-sm text-muted-foreground" onClick={() => handleNavigation('category', (item as any).slug)}>{item.label}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="h-px w-full bg-border" />
                  </div>
                ))}
                <div className="flex items-center gap-3 text-xl font-bold text-foreground" onClick={() => handleNavigation('guides')}>Guides & Tutos</div>
                <div className="bg-secondary/30 p-4 rounded-xl border border-border">
                  <h4 className="font-bold mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> Le Labo Fluxlab</h4>
                  <p className="text-xs text-muted-foreground mb-3">Laissez l'IA configurer votre setup.</p>
                  <Button variant="primary" size="sm" className="w-full" onClick={() => handleNavigation('configurator')}>Lancer l'outil</Button>
                </div>
                <div className="pt-4 flex flex-col gap-3">
                  {user ? (
                    <div className="bg-secondary/20 p-4 rounded-xl space-y-3">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">{user.name.charAt(0)}</div>
                        <div><p className="font-bold text-foreground">{user.name}</p><p className="text-xs text-muted-foreground">{user.email}</p></div>
                      </div>
                      <Button variant="outline" className="w-full justify-start"><UserIcon className="w-4 h-4 mr-2" /> Mon Espace</Button>
                      <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50" onClick={handleLogout}><LogOut className="w-4 h-4 mr-2" /> Déconnexion</Button>
                    </div>
                  ) : (
                    /* Connexion disabled for now */
                    <></>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.nav>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLoginSuccess={handleLoginSuccess} />
    </>
  );
};