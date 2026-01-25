import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Button } from './ui/Button';
import {
  Sparkles, ChevronRight, ChevronLeft, Check,
  Music, Video, Gamepad2, ArrowRight, Camera, Lightbulb, Headphones,
  CheckCircle2, ExternalLink, ShoppingBag, X, Package, Layout,
  Cpu, HardDrive, Smartphone, Mic2, Monitor, Speaker
} from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { generateRecommendation, RecommendationResult, UserContext, Usage, RoomType, ExperienceLevel, Vibe } from '../lib/scoringEngine';

interface ConfiguratorPageProps {
  onNavigate: (page: string, slug?: string) => void;
}

export const ConfiguratorPage: React.FC<ConfiguratorPageProps> = ({ onNavigate }) => {
  const { products, loading: productsLoading } = useProducts();
  const [step, setStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);

  // STATE
  const [ctx, setCtx] = useState<UserContext>({
    usage: 'streaming',
    room: 'untreated_bedroom',
    experience: 'beginner',
    budget: 1000,
    vibe: 'minimalist',
    computer: 'pc',
    hasMic: false,
    hasInterface: false,
    hasCamera: false,
    hasLights: false,
  });

  const [result, setResult] = useState<RecommendationResult | null>(null);

  const totalSteps = 4; // Usage, Room, Vibe+Budget, Inventory

  const updateCtx = (key: keyof UserContext, value: any) => {
    setCtx(prev => ({ ...prev, [key]: value }));
  };

  const calculateResult = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const res = generateRecommendation(products, ctx);
      setResult(res);
      setIsCalculating(false);
      setStep(5);
    }, 1500); // Fake logic time for suspense
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      calculateResult();
    }
  };

  // --- UI COMPONENTS ---

  const StepCard = ({ isActive, icon, title, desc, onClick }: any) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full text-left p-6 rounded-2xl border transition-all duration-300 flex flex-col gap-4 overflow-hidden group
        ${isActive
          ? 'bg-primary/10 border-primary shadow-[0_0_30px_rgba(var(--primary),0.3)]'
          : 'bg-zinc-900/50 border-white/5 hover:bg-zinc-800/50 hover:border-white/10'}`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
        ${isActive ? 'bg-primary text-white' : 'bg-white/5 text-zinc-400 group-hover:text-white'}`}>
        {icon}
      </div>
      <div>
        <h3 className={`font-bold text-lg mb-1 ${isActive ? 'text-white' : 'text-zinc-300'}`}>{title}</h3>
        <p className="text-xs text-zinc-500 font-light leading-relaxed">{desc}</p>
      </div>
      {isActive && <motion.div layoutId="check" className="absolute top-4 right-4 bg-primary text-white rounded-full p-1"><Check size={12} /></motion.div>}
    </motion.button>
  );

  const QuestionTitle = ({ children, subtitle }: any) => (
    <div className="text-center mb-12 space-y-2">
      <motion.h1
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 font-serif"
      >
        {children}
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} delay={0.1} className="text-zinc-400 font-light">
        {subtitle}
      </motion.p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-primary/30 relative overflow-x-hidden">
      {/* BACKGROUND AMBIANCE */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-900/20 rounded-full blur-[120px] opacity-20" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
      </div>

      <Navbar onNavigate={onNavigate} isDark={true} />

      <div className="pt-32 pb-32 min-h-screen relative z-10 container mx-auto px-6 max-w-5xl">

        {/* PROGRESS */}
        <div className="mb-20 flex justify-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${step >= s ? 'bg-primary scale-110 shadow-glow' : 'bg-white/10'}`} />
            ))}
          </div>
        </div>

        {isCalculating ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-t-4 border-primary animate-spin" />
              <Sparkles className="absolute inset-0 m-auto text-primary animate-pulse w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold font-serif">Analyse des compatibilités...</h2>
            <p className="text-zinc-500">L'IA parcourt +200 produits pour créer votre setup unique.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">

            {/* ETAPE 1 : USAGE */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto">
                <QuestionTitle subtitle="Définissons le cœur de votre projet.">Votre Mission ?</QuestionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <StepCard
                    isActive={ctx.usage === 'streaming'}
                    onClick={() => updateCtx('usage', 'streaming')}
                    icon={<Gamepad2 />}
                    title="Live Streaming"
                    desc="Twitch, YouTube Live. Priorité à la gestion du direct, OBS, et l'interaction."
                  />
                  <StepCard
                    isActive={ctx.usage === 'podcast'}
                    onClick={() => updateCtx('usage', 'podcast')}
                    icon={<Mic2 />}
                    title="Podcast / Radio"
                    desc="La voix est reine. Besoin d'un son broadcast chaud et d'un silence absolu."
                  />
                  <StepCard
                    isActive={ctx.usage === 'music_vocals'}
                    onClick={() => updateCtx('usage', 'music_vocals')}
                    icon={<Music />}
                    title="Production Musique"
                    desc="Chant, Instruments. Besoin de fidélité, préamplis nobles et monitoring parfait."
                  />
                  <StepCard
                    isActive={ctx.usage === 'video_calls'}
                    onClick={() => updateCtx('usage', 'video_calls')}
                    icon={<Video />}
                    title="Vidéo Pro / YouTube"
                    desc="Facecam de haute qualité pour des vidéos montées ou des conférences."
                  />
                </div>
              </motion.div>
            )}

            {/* ETAPE 2 : ROOM & EXPERIENCE */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto space-y-12">
                <QuestionTitle subtitle="L'environnement dicte le matériel.">Votre Espace de Jeu</QuestionTitle>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <StepCard isActive={ctx.room === 'untreated_bedroom'} onClick={() => updateCtx('room', 'untreated_bedroom')} icon={<Layout />} title="Chambre Standard" desc="Non traitée, résonance possible, bruits de fond." />
                  <StepCard isActive={ctx.room === 'treated_studio'} onClick={() => updateCtx('room', 'treated_studio')} icon={<Speaker />} title="Studio Traité" desc="Panneaux acoustiques, son mat et contrôlé." />
                  <StepCard isActive={ctx.room === 'travel'} onClick={() => updateCtx('room', 'travel')} icon={<Smartphone />} title="Nomade / Voyage" desc="Besoin de compacité et robustesse." />
                </div>

                <div className="pt-8 border-t border-white/5">
                  <h3 className="text-center text-zinc-400 mb-8 uppercase tracking-widest text-xs font-bold">Votre Niveau Technique</h3>
                  <div className="flex justify-center gap-4">
                    {['beginner', 'intermediate', 'pro'].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => updateCtx('experience', lvl as any)} // Cast safely
                        className={`px-8 py-3 rounded-full border text-sm font-bold transition-all uppercase tracking-wide
                        ${ctx.experience === lvl ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600'}`}
                      >
                        {lvl === 'beginner' ? 'Débutant' : lvl === 'intermediate' ? 'Initié' : 'Expert'}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ETAPE 3 : VIBE & BUDGET */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-3xl mx-auto space-y-16">
                <QuestionTitle subtitle="L'identité visuelle de votre setup.">Style & Budget</QuestionTitle>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { id: 'minimalist', label: 'Minimalist', color: 'bg-zinc-200' },
                    { id: 'rgb_gamer', label: 'RGB Gamer', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
                    { id: 'pro_studio', label: 'Pro Noir', color: 'bg-zinc-900' },
                    { id: 'vintage', label: 'Vintage', color: 'bg-amber-700' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      onClick={() => updateCtx('vibe', v.id as any)}
                      className={`group p-4 rounded-xl border transition-all flex flex-col items-center gap-3
                      ${ctx.vibe === v.id ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
                    >
                      <div className={`w-full h-12 rounded-lg ${v.color} opacity-80 group-hover:opacity-100 shadow-lg`} />
                      <span className={`text-xs font-bold uppercase tracking-wider ${ctx.vibe === v.id ? 'text-white' : 'text-zinc-500'}`}>{v.label}</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/5">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-bold uppercase text-zinc-400">Budget Max</label>
                    <span className="text-4xl font-mono font-bold text-primary">{ctx.budget}€</span>
                  </div>
                  <input
                    type="range" min="200" max="6000" step="100"
                    value={ctx.budget} onChange={(e) => updateCtx('budget', parseInt(e.target.value))}
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-zinc-600 font-mono">
                    <span>200€</span>
                    <span>1500€ (Recommandé)</span>
                    <span>6000€</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ETAPE 4 : INVENTAIRE */}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl mx-auto space-y-12">
                <QuestionTitle subtitle="Cocher ce que vous possédez DÉJÀ.">Inventaire</QuestionTitle>

                <div className="space-y-4">
                  {[
                    { id: 'hasMic', label: 'Un Microphone XLR/USB', icon: <Mic2 className="w-5 h-5" /> },
                    { id: 'hasInterface', label: 'Une Carte Son (Interface Audio)', icon: <Layout className="w-5 h-5" /> },
                    { id: 'hasCamera', label: 'Une Caméra (DSLR ou Webcam)', icon: <Camera className="w-5 h-5" /> },
                    { id: 'hasLights', label: 'Un Éclairage (Softbox/LED)', icon: <Lightbulb className="w-5 h-5" /> },
                  ].map((item: any) => (
                    <button
                      key={item.id}
                      onClick={() => updateCtx(item.id, !ctx[item.id as keyof UserContext])}
                      className={`w-full p-6 rounded-2xl border flex items-center justify-between transition-all group
                      ${ctx[item.id as keyof UserContext] ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${ctx[item.id as keyof UserContext] ? 'bg-emerald-500 text-white' : 'bg-white/10 text-zinc-400'}`}>
                          {item.icon}
                        </div>
                        <span className={`text-lg font-medium ${ctx[item.id as keyof UserContext] ? 'text-white' : 'text-zinc-400'}`}>{item.label}</span>
                      </div>
                      {ctx[item.id as keyof UserContext] && <CheckCircle2 className="text-emerald-500 w-6 h-6" />}
                    </button>
                  ))}
                </div>

                <div className="flex justify-center gap-6 mt-8">
                  <button onClick={() => updateCtx('computer', 'mac')} className={`px-8 py-4 rounded-xl border flex gap-3 items-center transition-all ${ctx.computer === 'mac' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-zinc-500'}`}>
                    <Layout size={20} /> Mac (Apple)
                  </button>
                  <button onClick={() => updateCtx('computer', 'pc')} className={`px-8 py-4 rounded-xl border flex gap-3 items-center transition-all ${ctx.computer === 'pc' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-zinc-500'}`}>
                    <Monitor size={20} /> PC (Windows)
                  </button>
                </div>
              </motion.div>
            )}

            {/* ETAPE 5 : RESULTATS */}
            {step === 5 && result && (
              <motion.div key="s5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-5xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest">
                    <Sparkles size={12} /> Configuration Générée par IA
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black font-serif text-white">Votre Loadout <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Ultime</span></h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* LEFT : MAIN ITEMS (Mic, Cam, Interface) */}
                  <div className="lg:col-span-8 space-y-8">
                    {[
                      { title: 'Votre Voix (Micro)', prod: result.mic },
                      { title: 'Votre Cerveau (Interface)', prod: result.audioInterface },
                      { title: 'Votre Image (Caméra)', prod: result.camera },
                    ].map((slot, idx) => (
                      slot.prod ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                          key={slot.prod.id}
                          className="group relative bg-zinc-900/50 border border-white/5 rounded-3xl p-6 hover:border-primary/30 transition-all flex flex-col md:flex-row gap-8 overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 p-20 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors" />

                          <div className="w-full md:w-48 h-48 bg-black/40 rounded-2xl flex items-center justify-center p-4 border border-white/5 shrink-0">
                            <img src={slot.prod.image_url} className="w-full h-full object-contain filter drop-shadow-2xl" alt={slot.prod.name} />
                          </div>

                          <div className="flex-1 relative z-10 flex flex-col justify-center text-center md:text-left">
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">{slot.title}</span>
                            <h3 className="text-2xl font-bold font-serif text-white mb-2">{slot.prod.name}</h3>
                            <div className="inline-flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                              <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Recommandé</span>
                              <span className="bg-white/5 text-zinc-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">{slot.prod.brand}</span>
                            </div>
                            <p className="text-sm text-zinc-400 italic mb-6 border-l-2 border-primary/30 pl-4">
                              "{result.explanations[slot.prod.id] || 'Performance optimale pour votre usage.'}"
                            </p>
                            <div className="flex items-center gap-4 justify-center md:justify-start">
                              <span className="text-xl font-mono font-bold">{slot.prod.price}€</span>
                              <Button onClick={() => window.open(slot.prod.offers?.[0]?.link, '_blank')} className="bg-white text-black hover:bg-zinc-200">Voir l'offre</Button>
                            </div>
                          </div>
                        </motion.div>
                      ) : null
                    ))}
                  </div>

                  {/* RIGHT : SUMMARY & EXTRAS */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 sticky top-24">
                      <h3 className="text-xl font-bold font-serif mb-6 flex items-center gap-2"><ShoppingBag className="text-primary" /> Récapitulatif</h3>

                      <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-sm text-zinc-400"><span>Microphone</span> <span>{result.mic?.price || 0}€</span></div>
                        <div className="flex justify-between text-sm text-zinc-400"><span>Interface</span> <span>{result.audioInterface?.price || 0}€</span></div>
                        <div className="flex justify-between text-sm text-zinc-400"><span>Caméra</span> <span>{result.camera?.price || 0}€</span></div>
                        <div className="pt-4 border-t border-white/10 flex justify-between text-xl font-bold text-white">
                          <span>Total Estimé</span>
                          <span className="text-primary">{result.totalCost}€</span>
                        </div>
                      </div>

                      <Button className="w-full h-14 text-lg bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(var(--primary),0.4)]">
                        Tout Ajouter au Panier
                      </Button>
                      <p className="mt-4 text-xs text-center text-zinc-600">En partenariat avec Amazon & Thomann.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        )}

        {/* CONTROLS */}
        {step < 5 && !isCalculating && (
          <div className="fixed bottom-0 left-0 w-full p-6 bg-black/80 backdrop-blur-xl border-t border-white/10 z-50">
            <div className="max-w-5xl mx-auto flex justify-between items-center">
              <Button variant="ghost" className="text-zinc-500 hover:text-white" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Retour
              </Button>
              <div className="text-xs font-mono text-zinc-600 hidden md:block">ÉTAPE {step} / {totalSteps}</div>
              <Button className="bg-white text-black hover:bg-zinc-200 px-8 py-6 text-lg rounded-xl" onClick={handleNext}>
                {step === totalSteps ? 'Générer le Setup' : 'Suivant'} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
};