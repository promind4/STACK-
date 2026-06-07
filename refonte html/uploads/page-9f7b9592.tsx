'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Sparkles, ChevronRight, ChevronLeft, Check,
    Music, Video, Gamepad2, ArrowRight, Camera, Lightbulb, Headphones,
    CheckCircle2, ShoppingBag, Cpu, Mic2, Monitor, Speaker, RefreshCw, Cable, Layers, Layout, Smartphone
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { generateRecommendation, RecommendationResult, UserContext, ProductResult } from '@/lib/scoringEngine';
import Image from 'next/image';

// --- SUB-COMPONENTS ---

const StepCard = ({ isActive, icon, title, desc, onClick }: any) => (
    <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`relative w-full text-left p-6 rounded-2xl border transition-all duration-200 flex flex-col gap-4 overflow-hidden group h-full
      ${isActive
                ? 'bg-zinc-800 border-primary shadow-lg ring-1 ring-primary/50'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}`}
    >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
      ${isActive ? 'bg-primary text-white' : 'bg-white/5 text-zinc-400 group-hover:text-white'}`}>
            {icon}
        </div>
        <div>
            <h3 className={`font-bold text-lg mb-1 ${isActive ? 'text-white' : 'text-zinc-200'}`}>{title}</h3>
            <p className={`text-xs font-light leading-relaxed ${isActive ? 'text-zinc-300' : 'text-zinc-500'}`}>{desc}</p>
        </div>
        {isActive && <div className="absolute top-4 right-4 bg-primary text-white rounded-full p-1"><Check size={12} /></div>}
    </motion.button>
);

const QuestionTitle = ({ children, subtitle }: any) => (
    <div className="text-center mb-12 space-y-2">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2">{children}</h1>
        <p className="text-zinc-400 font-light text-lg">{subtitle}</p>
    </div>
);

// Product Card with Alternatives Modal
const ResultProductCard = ({
    title,
    item,
    explanation,
}: {
    title: string;
    item: ProductResult;
    explanation?: string;
}) => {
    const [showAlternatives, setShowAlternatives] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-white border border-zinc-200 rounded-3xl p-6 hover:border-primary/40 transition-all overflow-hidden shadow-sm"
        >
            <div className="absolute top-0 right-0 p-20 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors" />

            <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Image - Clickable */}
                <Link
                    href={`/produit/${item.selected.slug}`}
                    className="w-full md:w-36 h-36 bg-white rounded-2xl flex items-center justify-center p-4 border border-zinc-100 shrink-0 relative cursor-pointer group/img transition-colors hover:border-primary/50"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <Image
                        src={item.selected.image_url}
                        alt={item.selected.name}
                        fill
                        sizes="144px"
                        className="object-contain mix-blend-multiply group-hover/img:scale-105 transition-transform p-4"
                        loading="lazy"
                    />
                    {item.alternatives.length > 0 && (
                        <div className="absolute -top-2 -right-2 bg-primary text-white text-[10px] px-2 py-1 rounded-full font-bold">
                            {item.alternatives.length} alt
                        </div>
                    )}
                </Link>

                {/* Info */}
                <div className="flex-1 relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">{title}</span>
                    <Link
                        href={`/produit/${item.selected.slug}`}
                        className="text-xl font-bold text-zinc-900 mb-1 hover:text-primary cursor-pointer transition-colors"
                    >
                        {item.selected.name}
                    </Link>
                    {explanation && (
                        <p className="text-xs text-zinc-500 italic mb-4 border-l-2 border-primary/30 pl-3 max-w-md">
                            &quot;{explanation}&quot;
                        </p>
                    )}

                    <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
                        <span className="text-lg font-mono font-bold text-zinc-900">≈ {item.selected.price}€</span>

                        {(() => {
                            const bestLink = item.selected.offers && item.selected.offers.length > 0
                                ? [...item.selected.offers].sort((a, b) => a.price - b.price)[0].affiliate_link
                                : '#';
                            return bestLink && bestLink !== '#' ? (
                                <a
                                    href={bestLink}
                                    target="_blank"
                                    rel="nofollow sponsored noopener"
                                    className="px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg text-sm font-bold transition-colors inline-block"
                                >
                                    Voir l&apos;offre
                                </a>
                            ) : null;
                        })()}

                        {/* Alternatives Button */}
                        {item.alternatives.length > 0 && (
                            <button
                                onClick={() => setShowAlternatives(!showAlternatives)}
                                className="px-3 py-2 bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                            >
                                <RefreshCw size={12} /> Alternatives
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Alternatives Dropdown */}
            <AnimatePresence>
                {showAlternatives && item.alternatives.length > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 pt-4 border-t border-zinc-200 overflow-hidden"
                    >
                        <p className="text-xs text-zinc-500 mb-3 uppercase tracking-wide">Options alternatives :</p>
                        <div className="grid gap-3">
                            {item.alternatives.map((alt) => (
                                <div key={alt.id} className="flex items-center gap-4 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                                    <div className="w-12 h-12 relative shrink-0">
                                        <Image
                                            src={alt.image_url}
                                            alt={alt.name}
                                            fill
                                            sizes="48px"
                                            className="object-contain mix-blend-multiply"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-zinc-900">{alt.name}</p>
                                        <p className="text-xs text-zinc-500">≈ {alt.price}€</p>
                                    </div>
                                    {(() => {
                                        const bestLink = alt.offers && alt.offers.length > 0
                                            ? [...alt.offers].sort((a: any, b: any) => a.price - b.price)[0].affiliate_link
                                            : '#';
                                        return bestLink && bestLink !== '#' ? (
                                            <a
                                                href={bestLink}
                                                target="_blank"
                                                rel="nofollow sponsored noopener"
                                                className="px-3 py-1 bg-primary text-white hover:bg-primary/90 rounded text-xs inline-block"
                                            >
                                                Voir
                                            </a>
                                        ) : null;
                                    })()}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default function ConfiguratorPage() {
    const { products, error } = useProducts();
    const [step, setStep] = useState(1);
    const [isCalculating, setIsCalculating] = useState(false);

    const [ctx, setCtx] = useState<UserContext>({
        usage: 'streaming',
        room: 'untreated_bedroom',
        experience: 'beginner',
        budget: 1500,
        vibe: 'minimalist',
        computer: 'pc',
        hasMic: false,
        hasInterface: false,
        hasCamera: false,
        hasLights: false,
    });

    const [result, setResult] = useState<RecommendationResult | null>(null);
    const totalSteps = 4;

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
        }, 1500);
    };

    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1);
        else calculateResult();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 relative overflow-x-hidden"
        >
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/20 rounded-full blur-[120px] opacity-20" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-900/20 rounded-full blur-[120px] opacity-20" />
            </div>

            <div className="pt-32 pb-40 min-h-screen relative z-10 container mx-auto px-6 max-w-5xl">

                {/* Progress */}
                <div className="mb-16 flex justify-center">
                    <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-zinc-900/80 border border-white/5 backdrop-blur-md">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className={`w-3 h-3 rounded-full transition-all duration-500 ${step >= s ? 'bg-primary scale-125' : 'bg-white/10'}`} />
                        ))}
                    </div>
                </div>

                {isCalculating ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-8">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full border-t-4 border-primary animate-spin" />
                            <Sparkles className="absolute inset-0 m-auto text-primary animate-pulse w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold">Analyse en cours...</h2>
                        <p className="text-zinc-500">Optimisation budget & compatibilité.</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">

                        {/* Step 1: Usage */}
                        {step === 1 && (
                            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-5xl mx-auto">
                                <QuestionTitle subtitle="Définissons le cœur de votre projet.">Votre Mission ?</QuestionTitle>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                                    <StepCard isActive={ctx.usage === 'streaming'} onClick={() => updateCtx('usage', 'streaming')} icon={<Gamepad2 />} title="Streaming" desc="Twitch, YouTube Gaming." />
                                    <StepCard isActive={ctx.usage === 'podcast'} onClick={() => updateCtx('usage', 'podcast')} icon={<Mic2 />} title="Podcast" desc="Voix broadcast pro." />
                                    <StepCard isActive={ctx.usage === 'music_vocals'} onClick={() => updateCtx('usage', 'music_vocals')} icon={<Music />} title="Musique" desc="Chant & Production." />
                                    <StepCard isActive={ctx.usage === 'video_calls'} onClick={() => updateCtx('usage', 'video_calls')} icon={<Video />} title="Vidéo/Visio" desc="Conférences pro." />
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Room & Experience */}
                        {step === 2 && (
                            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto space-y-10">
                                <QuestionTitle subtitle="L'environnement dicte le matériel.">Votre Espace</QuestionTitle>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                    <StepCard
                                        isActive={ctx.room === 'untreated_bedroom'}
                                        onClick={() => updateCtx('room', 'untreated_bedroom')}
                                        icon={<Layout />}
                                        title={ctx.usage === 'video_calls' ? "Bureau Standard" : "Chambre / Salon"}
                                        desc={ctx.usage === 'video_calls' ? "Pièce de vie, un peu d'écho." : "Non traité, réverbération naturelle."}
                                    />
                                    <StepCard
                                        isActive={ctx.room === 'treated_studio'}
                                        onClick={() => updateCtx('room', 'treated_studio')}
                                        icon={<Speaker />}
                                        title={ctx.usage === 'video_calls' ? "Bureau Calme / Pro" : "Studio Traité"}
                                        desc="Acoustique maîtrisée, silencieux."
                                    />
                                    <StepCard
                                        isActive={ctx.room === 'travel'}
                                        onClick={() => updateCtx('room', 'travel')}
                                        icon={<Smartphone />}
                                        title="Nomade"
                                        desc="En déplacement, hôtels, cafés."
                                    />
                                </div>

                                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 text-center space-y-4">
                                    <h3 className="text-zinc-400 uppercase tracking-widest text-xs font-bold">Votre Niveau</h3>
                                    <div className="flex flex-wrap justify-center gap-3">
                                        {['beginner', 'intermediate', 'pro'].map((lvl) => (
                                            <button key={lvl} onClick={() => updateCtx('experience', lvl as any)} className={`px-6 py-2 rounded-lg border text-sm font-bold transition-all ${ctx.experience === lvl ? 'bg-primary text-white border-primary' : 'bg-transparent text-zinc-500 border-zinc-700 hover:text-white'}`}>
                                                {lvl === 'beginner' ? 'Initié' : lvl === 'intermediate' ? 'Intermédiaire' : 'Pro'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Budget & Inventory */}
                        {step === 3 && (
                            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-3xl mx-auto space-y-10">
                                <QuestionTitle subtitle="Optimisons l'investissement.">Budget & Équipement</QuestionTitle>
                                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 text-center space-y-4">
                                    <label className="text-sm font-bold uppercase text-zinc-400">Budget Maximum</label>
                                    <div className="text-4xl font-mono font-bold text-white">{ctx.budget}€</div>
                                    <input type="range" min="300" max="5000" step="100" value={ctx.budget} onChange={(e) => updateCtx('budget', parseInt(e.target.value))} className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary" />
                                    <div className="flex justify-between text-xs text-zinc-600 font-mono"><span>300€</span><span>2000€</span><span>5000€</span></div>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-center text-zinc-400 uppercase tracking-widest text-xs font-bold">Je possède déjà...</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[{ id: 'hasMic', label: 'Microphone' }, { id: 'hasInterface', label: 'Interface' }, { id: 'hasCamera', label: 'Caméra' }, { id: 'hasLights', label: 'Éclairage' }].map((item) => (
                                            <div key={item.id} className="flex flex-col gap-2">
                                                <button onClick={() => updateCtx(item.id as any, !ctx[item.id as keyof UserContext])} className={`p-3 rounded-xl border flex items-center justify-between transition-all ${ctx[item.id as keyof UserContext] ? 'bg-zinc-800 border-emerald-500/50' : 'bg-transparent border-zinc-800 hover:border-zinc-600'}`}>
                                                    <span className={`text-sm font-medium ${ctx[item.id as keyof UserContext] ? 'text-white' : 'text-zinc-500'}`}>{item.label}</span>
                                                    {ctx[item.id as keyof UserContext] ? <CheckCircle2 className="text-emerald-500 w-5 h-5" /> : <div className="w-5 h-5 rounded-full border border-zinc-700" />}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: Preferences & Vibe */}
                        {step === 4 && (
                            <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-3xl mx-auto space-y-10">
                                <QuestionTitle subtitle="Personnalisez l'expérience.">Votre Style & Matériel</QuestionTitle>

                                <div className="space-y-4">
                                    <h3 className="text-center text-zinc-400 uppercase tracking-widest text-xs font-bold">Votre Ordinateur Principal</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => updateCtx('computer', 'mac')}
                                            className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${ctx.computer === 'mac' ? 'bg-zinc-800 border-primary shadow-lg ring-1 ring-primary/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                        >
                                            <Monitor className={ctx.computer === 'mac' ? 'text-white' : 'text-zinc-500'} size={32} />
                                            <span className={`font-bold ${ctx.computer === 'mac' ? 'text-white' : 'text-zinc-400'}`}>Mac (Apple)</span>
                                        </button>
                                        <button
                                            onClick={() => updateCtx('computer', 'pc')}
                                            className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${ctx.computer === 'pc' ? 'bg-zinc-800 border-primary shadow-lg ring-1 ring-primary/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                        >
                                            <Cpu className={ctx.computer === 'pc' ? 'text-white' : 'text-zinc-500'} size={32} />
                                            <span className={`font-bold ${ctx.computer === 'pc' ? 'text-white' : 'text-zinc-400'}`}>PC (Windows)</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-center text-zinc-400 uppercase tracking-widest text-xs font-bold">L'Ambiance de votre Setup</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {[
                                            { id: 'minimalist', label: 'Minimaliste', icon: <Layers size={24} /> },
                                            { id: 'rgb_gamer', label: 'Gamer / RGB', icon: <Gamepad2 size={24} /> },
                                            { id: 'pro_studio', label: 'Pro Studio', icon: <Mic2 size={24} /> },
                                            { id: 'vintage', label: 'Vintage / Warm', icon: <Lightbulb size={24} /> }
                                        ].map((v) => (
                                            <button
                                                key={v.id}
                                                onClick={() => updateCtx('vibe', v.id)}
                                                className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 text-center h-full ${ctx.vibe === v.id ? 'bg-zinc-800 border-primary text-white ring-1 ring-primary/50' : 'bg-white/5 border-white/10 text-zinc-500 hover:bg-white/10 hover:text-zinc-300'}`}
                                            >
                                                <div className={ctx.vibe === v.id ? 'text-primary' : 'text-zinc-600'}>{v.icon}</div>
                                                <span className="text-xs font-bold">{v.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 5: Results */}
                        {step === 5 && result && (
                            <motion.div key="s5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-6xl mx-auto space-y-10">
                                <div className="text-center space-y-3">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase">
                                        <Sparkles size={12} /> Configuration Terminée
                                    </div>
                                    <h1 className="text-3xl md:text-5xl font-bold text-white">
                                        Votre Setup <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Complet</span>
                                    </h1>
                                    <p className="text-zinc-500 text-sm">
                                        Budget utilisé: <span className="text-white font-mono">{result.budgetUtilization}%</span> ({result.totalCost}€ / {ctx.budget}€)
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    {/* Main Items */}
                                    <div className="lg:col-span-8 space-y-4">
                                        {result.mic && (
                                            <ResultProductCard
                                                title="Microphone"
                                                item={result.mic}
                                                explanation={result.explanations[result.mic.selected.id]}
                                            />
                                        )}
                                        {result.audioInterface && (
                                            <ResultProductCard
                                                title="Interface Audio"
                                                item={result.audioInterface}
                                                explanation={result.explanations[result.audioInterface.selected.id]}
                                            />
                                        )}
                                        {result.headphones && (
                                            <ResultProductCard
                                                title="Casque Studio"
                                                item={result.headphones}
                                                explanation={result.explanations[result.headphones.selected.id]}
                                            />
                                        )}
                                        {result.camera && (
                                            <ResultProductCard
                                                title="Caméra"
                                                item={result.camera}
                                                explanation={result.explanations[result.camera.selected.id]}
                                            />
                                        )}
                                        {result.lights.map((light) => (
                                            <ResultProductCard
                                                key={light.selected.id}
                                                title="Éclairage"
                                                item={light}
                                                explanation={result.explanations[light.selected.id]}
                                            />
                                        ))}
                                        {result.acousticTreatment && (
                                            <ResultProductCard
                                                title="Traitement Acoustique"
                                                item={result.acousticTreatment}
                                                explanation={result.explanations[result.acousticTreatment.selected.id]}
                                            />
                                        )}
                                    </div>

                                    {/* Summary Sidebar */}
                                    <div className="lg:col-span-4">
                                        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 sticky top-24 space-y-5">
                                            <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                                                <ShoppingBag className="text-primary" size={20} /> Récapitulatif
                                            </h3>

                                            <div className="space-y-3">
                                                {result.mic && <div className="flex justify-between text-sm text-zinc-300"><span>Microphone</span><span>≈ {result.mic.selected.price}€</span></div>}
                                                {result.audioInterface && <div className="flex justify-between text-sm text-zinc-300"><span>Interface</span><span>≈ {result.audioInterface.selected.price}€</span></div>}
                                                {result.headphones && <div className="flex justify-between text-sm text-zinc-300"><span>Casque</span><span>≈ {result.headphones.selected.price}€</span></div>}
                                                {result.camera && <div className="flex justify-between text-sm text-zinc-300"><span>Caméra</span><span>≈ {result.camera.selected.price}€</span></div>}
                                                {result.lights.map(light => (
                                                    <div key={light.selected.id} className="flex justify-between text-sm text-zinc-300"><span>Éclairage</span><span>≈ {light.selected.price}€</span></div>
                                                ))}
                                                {result.acousticTreatment && <div className="flex justify-between text-sm text-zinc-300"><span>Acoustique</span><span>≈ {result.acousticTreatment.selected.price}€</span></div>}

                                                <div className="pt-3 border-t border-white/10 flex justify-between text-lg font-bold text-white">
                                                    <span>Total</span>
                                                    <span className="text-primary">≈ {result.totalCost}€</span>
                                                </div>
                                            </div>

                                            <div className="text-center pt-4">
                                                <div className="text-[10px] text-zinc-600">Score de correspondance: {result.matchScore}%</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                )}

                {/* Navigation Bar */}
                {step < 5 && !isCalculating && (
                    <div className="fixed bottom-0 left-0 w-full p-5 bg-black/90 backdrop-blur-xl border-t border-white/10 z-50">
                        <div className="max-w-4xl mx-auto flex justify-between items-center">
                            <button
                                className={`flex items-center text-sm font-medium transition-colors ${step === 1 ? 'text-zinc-600 cursor-not-allowed' : 'text-zinc-400 hover:text-white'}`}
                                onClick={() => setStep(Math.max(1, step - 1))}
                                disabled={step === 1}
                            >
                                <ChevronLeft className="mr-2 h-4 w-4" /> Retour
                            </button>
                            <button
                                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold flex items-center transition-all"
                                onClick={handleNext}
                            >
                                {step === 4 ? 'Générer le Setup' : 'Suivant'} <ArrowRight className="ml-2 h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </motion.div>
    );
}
