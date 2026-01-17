import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Button } from './ui/Button';
import { 
  Sparkles, ChevronRight, ChevronLeft, Check, 
  Music, Video, Gamepad2, Laptop, Monitor,
  Mic, Sliders, Box, ArrowRight, Camera, Lightbulb, Headphones, 
  CheckCircle2, ExternalLink, ShoppingBag, X, Package, Layout,
  Cpu, HardDrive, Smartphone, Mic2
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../lib/mockData';
import { Product } from '../types/database';

interface ConfiguratorPageProps {
  onNavigate: (page: string, slug?: string) => void;
}

// --- TYPES ---

type ProfileType = 'music' | 'video' | 'stream' | null;
type ComputerType = 'mac' | 'pc' | null;
type RoomContext = 'studio' | 'office' | 'bedroom' | 'outdoor' | null;

interface StackState {
  profile: ProfileType;
  budget: number;
  computer: ComputerType;
  roomContext: RoomContext;
  hasExistingMic: boolean; 
  hasExistingInterface: boolean;
  hasExistingCamera: boolean;
  hasExistingLights: boolean;
}

interface StackResultItem {
  product: Product;
  reason: string;
}

interface SoftwareSuggestion {
  name: string;
  desc: string;
  icon: React.ReactNode;
  cost: string;
  link: string;
}

interface StackResult {
  items: StackResultItem[];
  software: SoftwareSuggestion[];
  score: number;
  totalPrice: number;
}

export const ConfiguratorPage: React.FC<ConfiguratorPageProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<StackState>({
    profile: null,
    budget: 1500,
    computer: null,
    roomContext: null,
    hasExistingMic: false,
    hasExistingInterface: false,
    hasExistingCamera: false,
    hasExistingLights: false,
  });
  
  const [result, setResult] = useState<StackResult | null>(null);

  // Le tunnel a 4 étapes de questions, la 5ème est le résultat.
  const totalSteps = 5;

  // --- LOGIQUE DE GÉNÉRATION OPTIMISÉE ---
  const generateStack = () => {
    let selectedProducts: StackResultItem[] = [];
    let suggestedSoftware: SoftwareSuggestion[] = [];
    const pool = MOCK_PRODUCTS;

    // 1. Logique Matérielle (Hardware)
    if (state.profile === 'music') {
      if (!state.hasExistingMic) {
        // Studio traité -> Condensateur (NT1), Chambre/Bureau -> Dynamique (SM7B)
        const mic = state.roomContext === 'studio' ? pool.find(p => p.id === 'p5') : pool.find(p => p.id === 'p1');
        if (mic) selectedProducts.push({ product: mic, reason: state.roomContext === 'studio' ? "Précision studio (Condensateur) pour environnement traité." : "Isolation dynamique parfaite pour éviter l'écho de votre pièce." });
      }
      if (!state.hasExistingInterface) {
        const audioInterface = pool.find(p => p.id === 'p4');
        if (audioInterface) selectedProducts.push({ product: audioInterface, reason: "Conversion pro nécessaire pour votre micro XLR." });
      }
      
      suggestedSoftware = [
        { name: "Ableton Live", desc: "Le standard pour la production et le live.", icon: <Music className="w-5 h-5"/>, cost: "Version Lite incluse", link: "#" },
        ...(state.computer === 'mac' ? [{ name: "Logic Pro", desc: "L'excellence Apple pour la musique.", icon: <Cpu className="w-5 h-5"/>, cost: "199€", link: "#" }] : [])
      ];
    } else if (state.profile === 'video') {
      if (!state.hasExistingCamera) {
        const cam = pool.find(p => p.id === 'p2');
        if (cam) selectedProducts.push({ product: cam, reason: "Capteur APS-C pour un rendu cinématique pro." });
      }
      
      suggestedSoftware = [
        { name: "DaVinci Resolve", desc: "Le meilleur pour l'étalonnage et le montage.", icon: <Video className="w-5 h-5"/>, cost: "Gratuit / Pro", link: "#" },
        { name: "Adobe Premiere Pro", desc: "Le standard industriel du montage.", icon: <Layout className="w-5 h-5"/>, cost: "Abonnement", link: "#" },
        ...(state.computer === 'mac' ? [{ name: "Final Cut Pro", desc: "Rapidité absolue sur macOS.", icon: <Cpu className="w-5 h-5"/>, cost: "299€", link: "#" }] : [])
      ];
    } else if (state.profile === 'stream') {
      if (!state.hasExistingMic) {
        const mic = pool.find(p => p.id === 'p1');
        if (mic) selectedProducts.push({ product: mic, reason: "La voix radio iconique, sans bruits ambiants." });
      }
      if (!state.hasExistingCamera) {
        const cam = pool.find(p => p.id === 'p6');
        if (cam) selectedProducts.push({ product: cam, reason: "Webcam 4K ultra-fiable pour le direct." });
      }
      const control = pool.find(p => p.id === 'p3');
      if (control) selectedProducts.push({ product: control, reason: "Contrôleur indispensable pour vos scènes OBS." });
      
      suggestedSoftware = [
        { name: "OBS Studio", desc: "Indispensable pour streamer gratuitement.", icon: <Monitor className="w-5 h-5"/>, cost: "Gratuit", link: "#" },
        { name: "VDO.ninja", desc: "Envoyez votre caméra à distance sans latence.", icon: <Smartphone className="w-5 h-5"/>, cost: "Gratuit", link: "#" }
      ];
    }

    const totalPrice = selectedProducts.reduce((acc, item) => acc + item.product.price, 0);

    setResult({
      items: selectedProducts,
      software: suggestedSoftware,
      score: 100,
      totalPrice: totalPrice
    });
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      // Transition vers les résultats (Étape 5)
      setLoading(true);
      generateStack();
      setTimeout(() => {
        setLoading(false);
        setStep(totalSteps); // On passe à 5
      }, 1500);
    }
  };

  const handleBuyAll = () => {
    if (!result) return;
    result.items.forEach((item, index) => {
      const link = item.product.offers?.[0]?.link;
      if (link) {
        setTimeout(() => window.open(link, '_blank'), index * 300);
      }
    });
  };

  const updateState = (key: keyof StackState, value: any) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const profileLabels: Record<string, string> = {
    'music': 'Musicien',
    'video': 'Vidéaste',
    'stream': 'Streamer'
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground font-sans selection:bg-primary/30 relative">
      <Navbar onNavigate={onNavigate} />

      <div className="pt-28 pb-32 min-h-screen flex flex-col">
        <div className="container mx-auto px-6 max-w-[900px] flex-1 flex flex-col">
          
          {/* PROGRESS BAR */}
          {step < totalSteps && !loading && (
            <div className="mb-12">
              <div className="flex items-center justify-between text-xs font-bold text-muted-foreground mb-4 uppercase tracking-widest">
                <span className="flex items-center gap-2">
                   <Sparkles className="w-4 h-4 text-primary" />
                   Configuration IA
                </span>
                <span>{step} / {totalSteps - 1}</span>
              </div>
              <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}

          {/* MAIN CONTENT */}
          <div className="flex-1 flex flex-col justify-center">
            {loading ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-8 py-20">
                <div className="relative w-24 h-24 mx-auto">
                   <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                   <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                   <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-primary animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold font-serif">Analyse de synergie logicielle...</h2>
                  <p className="text-muted-foreground text-sm font-light">Nous vérifions la compatibilité OS et matériel.</p>
                </div>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                
                {/* ETAPE 1 : PROFIL */}
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold font-serif mb-4">Quel est votre objectif ?</h1>
                      <p className="text-muted-foreground">Sélectionnez votre profil créatif pour démarrer.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { id: 'music', label: 'Musique', icon: <Music className="w-8 h-8"/> },
                        { id: 'video', label: 'Vidéo', icon: <Video className="w-8 h-8"/> },
                        { id: 'stream', label: 'Streaming', icon: <Gamepad2 className="w-8 h-8"/> },
                      ].map(item => (
                        <div key={item.id} onClick={() => updateState('profile', item.id)} className={`cursor-pointer p-8 rounded-3xl border-2 transition-all flex flex-col items-center gap-6 ${state.profile === item.id ? 'border-primary bg-primary/5 shadow-xl scale-105' : 'bg-white border-border hover:border-primary/20'}`}>
                           <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${state.profile === item.id ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'}`}>{item.icon}</div>
                           <h3 className="font-bold text-xl">{item.label}</h3>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ETAPE 2 : CONTEXTE GRANULAIRE */}
                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold font-serif mb-4">Où allez-vous créer ?</h1>
                      <p className="text-muted-foreground">L'acoustique change tout le choix du matériel.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                       {[
                         { id: 'studio', label: 'Studio Traité', desc: 'Acoustique pro (panneaux/mousse)' },
                         { id: 'office', label: 'Bureau Dédié', desc: 'Pièce standard peu meublée' },
                         { id: 'bedroom', label: 'Chambre', desc: 'Espace réduit / écho possible' },
                         { id: 'outdoor', label: 'Extérieur / Nomade', desc: 'Vlog et captation terrain' },
                       ].map(room => (
                        <button key={room.id} onClick={() => updateState('roomContext', room.id)} className={`p-6 rounded-2xl border transition-all text-left group flex flex-col gap-1 ${state.roomContext === room.id ? 'border-primary bg-primary/5 shadow-md' : 'bg-white border-border hover:border-primary/20'}`}>
                           <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{room.label}</h4>
                           <p className="text-xs text-muted-foreground font-light">{room.desc}</p>
                        </button>
                       ))}
                    </div>
                  </motion.div>
                )}

                {/* ETAPE 3 : INVENTAIRE & ORDINATEUR */}
                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold font-serif mb-4">Inventaire Actuel</h1>
                      <p className="text-muted-foreground">Évitons les doublons inutiles.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-3xl mx-auto w-full">
                       <div className="space-y-4">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">J'ai déjà...</h4>
                          {[
                            { id: 'hasExistingMic', label: 'Un Microphone', icon: <Mic2 className="w-4 h-4"/> },
                            { id: 'hasExistingInterface', label: 'Une Interface Audio', icon: <Sliders className="w-4 h-4"/> },
                            { id: 'hasExistingCamera', label: 'Une Caméra Pro', icon: <Camera className="w-4 h-4"/> },
                          ].map(item => (
                            <button key={item.id} onClick={() => updateState(item.id as any, !state[item.id as keyof StackState])} className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${state[item.id as keyof StackState] ? 'bg-primary/10 border-primary shadow-sm' : 'bg-white border-border text-muted-foreground hover:border-primary/20'}`}>
                               <div className="flex items-center gap-3"><span className="p-1.5 bg-secondary rounded-lg">{item.icon}</span> <span className="text-sm font-medium">{item.label}</span></div>
                               {state[item.id as keyof StackState] && <Check className="w-4 h-4 text-primary" />}
                            </button>
                          ))}
                       </div>

                       <div className="space-y-4">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Ma machine</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => updateState('computer', 'mac')} className={`p-6 rounded-2xl border flex flex-col items-center gap-2 transition-all ${state.computer === 'mac' ? 'border-primary bg-primary/5 shadow-md font-bold' : 'bg-white border-border hover:border-primary/20'}`}>
                               <Laptop className="w-8 h-8" /> Mac
                            </button>
                            <button onClick={() => updateState('computer', 'pc')} className={`p-6 rounded-2xl border flex flex-col items-center gap-2 transition-all ${state.computer === 'pc' ? 'border-primary bg-primary/5 shadow-md font-bold' : 'bg-white border-border hover:border-primary/20'}`}>
                               <Monitor className="w-8 h-8" /> PC
                            </button>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}

                {/* ETAPE 4 : BUDGET */}
                {step === 4 && (
                  <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12 max-w-xl mx-auto w-full">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold font-serif mb-4">Investissement Cible</h1>
                      <p className="text-muted-foreground">Quel est votre budget global maximum ?</p>
                    </div>
                    <div className="bg-white border border-border rounded-3xl p-10 shadow-sm text-center">
                       <div className="flex flex-col items-center gap-8">
                           <div className="relative">
                             <input type="number" value={state.budget} onChange={(e) => updateState('budget', parseInt(e.target.value) || 0)} className="text-6xl font-bold text-primary tracking-tight bg-transparent text-center focus:outline-none border-b-2 border-primary/20 focus:border-primary w-64"/>
                             <span className="absolute top-2 -right-10 text-3xl text-muted-foreground">€</span>
                           </div>
                           <input type="range" min="200" max="5000" step="100" value={state.budget} onChange={(e) => updateState('budget', parseInt(e.target.value))} className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"/>
                       </div>
                    </div>
                  </motion.div>
                )}

                {/* === ÉTAPE 5 : RÉSULTATS (CORRECTION ÉCRAN BLANC) === */}
                {step === 5 && result && (
                  <motion.div key="s5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 w-full pb-20">
                    <div className="text-center space-y-4">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                         <CheckCircle2 className="w-4 h-4" /> Configuration Optimisée
                      </div>
                      <h1 className="text-4xl md:text-5xl font-bold font-serif tracking-tight">Votre Setup <span className="text-primary">{profileLabels[state.profile || '']}</span></h1>
                      <div className="flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
                         Score de Cohérence : <span className="text-primary font-mono text-xl">{result.score}%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* COLONNE MATÉRIEL */}
                      <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground border-b border-border pb-4">Hardware Recommandé</h3>
                        <div className="grid gap-4">
                          {result.items.length > 0 ? (
                            result.items.map((item, idx) => (
                             <div key={item.product.id} className="bg-white border border-border rounded-2xl p-5 flex flex-col md:flex-row items-center gap-6 hover:border-primary/40 transition-all hover:shadow-lg">
                               <div className="w-24 h-24 bg-secondary/20 rounded-xl p-3 flex items-center justify-center shrink-0">
                                 <img src={item.product.image_url} alt="" className="w-full h-full object-contain" />
                               </div>
                               <div className="flex-1 text-center md:text-left">
                                  <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">{item.product.brand}</span>
                                  <h4 className="text-lg font-bold font-serif">{item.product.name}</h4>
                                  <div className="inline-flex items-center gap-2 text-[11px] font-medium text-primary bg-primary/5 px-2 py-0.5 rounded-md mt-2">
                                     <Sparkles className="w-3 h-3" /> {item.reason}
                                  </div>
                                  <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                                     <span className="font-bold font-mono text-lg">{item.product.price}€</span>
                                     <a href={item.product.offers?.[0]?.link} target="_blank" className="px-4 py-1.5 bg-secondary text-foreground text-xs font-bold rounded-lg hover:bg-primary hover:text-white transition-colors">Voir l'offre</a>
                                  </div>
                               </div>
                             </div>
                            ))
                          ) : (
                            <div className="p-10 text-center bg-secondary/20 rounded-3xl border border-dashed border-border italic text-muted-foreground">
                              Votre matériel actuel est déjà optimal pour ce profil.
                            </div>
                          )}
                        </div>
                      </div>

                      {/* COLONNE LOGICIEL */}
                      <div className="space-y-6">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground border-b border-border pb-4">Logiciels & Écosystème</h3>
                        <div className="grid gap-4">
                          {result.software.map(sw => (
                            <div key={sw.name} className="p-5 bg-white border border-border rounded-2xl flex items-start gap-4 shadow-sm hover:border-primary/30 transition-all group">
                               <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                                 {sw.icon}
                               </div>
                               <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-center mb-1">
                                    <h5 className="font-bold text-sm text-foreground truncate">{sw.name}</h5>
                                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded shrink-0">{sw.cost}</span>
                                  </div>
                                  <p className="text-[11px] text-muted-foreground font-light leading-relaxed">{sw.desc}</p>
                               </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* BARRE DE TOTAL */}
                    <div className="bg-foreground text-white rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                       <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
                          <h4 className="text-xl font-bold mb-1 font-serif">Budget Total Requis</h4>
                          <p className="text-white/60 text-xs font-light">Estimation pour compléter votre écosystème.</p>
                       </div>
                       <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
                          <div className="text-5xl font-bold font-mono text-primary">{result.totalPrice}€</div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white hover:text-black" onClick={() => {setStep(1); setResult(null);}}>Recommencer</Button>
                            <Button className="flex-1 bg-primary text-white hover:bg-primary/90" onClick={handleBuyAll}>Tout Acheter <ShoppingBag className="w-4 h-4 ml-2" /></Button>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            )}
          </div>

          {/* NAVIGATION FOOTER */}
          {step < totalSteps && !loading && (
            <div className="mt-12 pt-8 border-t border-border flex justify-between">
              <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 1} className={step === 1 ? 'opacity-0' : ''}><ChevronLeft className="w-4 h-4 mr-2" /> Retour</Button>
              <Button variant="primary" onClick={handleNext} disabled={(step === 1 && !state.profile) || (step === 3 && !state.computer) || (step === 2 && !state.roomContext)}>Continuer <ChevronRight className="w-4 h-4 ml-2" /></Button>
            </div>
          )}

        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
};