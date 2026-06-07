'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useProducts } from '@/hooks/useProducts';
import { generateRecommendation, RecommendationResult, UserContext, ProductResult } from '@/lib/scoringEngine';
import { cn } from '@/lib/utils';

/* ─── HELPERS ────────────────────────────────────────────── */
function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="3" aria-hidden>
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  );
}

/* ─── STEP CARD ──────────────────────────────────────────── */
function StepCard({
  isActive, onClick, icon, title, desc, horizontal = false
}: {
  isActive: boolean; onClick: () => void;
  icon: React.ReactNode; title: string; desc: string;
  horizontal?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative w-full text-left rounded-2xl border transition-all duration-200 cursor-pointer',
        horizontal ? 'flex items-center gap-4 p-5' : 'flex flex-col gap-4 sm:gap-5 p-5 sm:p-7',
        isActive
          ? 'border-primary ring-1 ring-primary'
          : 'border-[rgba(235,220,196,.12)] hover:border-[rgba(211,178,123,.35)]'
      )}
      style={{
        background: isActive ? 'rgba(211,178,123,.06)' : 'rgba(255,255,255,.03)',
      }}
    >
      {/* Check badge */}
      <div className={cn(
        'absolute top-3.5 right-3.5 w-[22px] h-[22px] rounded-full bg-primary flex items-center justify-center transition-opacity',
        isActive ? 'opacity-100' : 'opacity-0'
      )}>
        <CheckIcon />
      </div>

      {/* Icon */}
      <div
        className="w-11 h-11 rounded-[10px] flex items-center justify-center shrink-0 transition-colors"
        style={{ background: isActive ? 'rgba(211,178,123,.12)' : 'rgba(211,178,123,.08)' }}
      >
        {icon}
      </div>

      {/* Text */}
      <div>
        <h3 className="font-serif text-[18px] text-white mb-1.5">{title}</h3>
        <p className="text-[12px] text-white/45 font-light leading-[1.6]">{desc}</p>
      </div>
    </button>
  );
}

/* ─── RESULT PRODUCT CARD ────────────────────────────────── */
function ResultProductCard({ title, item, explanation }: {
  title: string; item: ProductResult; explanation?: string;
}) {
  const [showAlt, setShowAlt] = useState(false);
  const bestOffer = item.selected.offers?.sort((a: any, b: any) => a.price - b.price)[0];

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(235,220,196,.15)' }}>
      {/* Header */}
      <div
        className="flex items-center px-5 py-3 border-b"
        style={{ background: 'rgba(211,178,123,.08)', borderColor: 'rgba(235,220,196,.10)' }}
      >
        <span className="frame-label text-primary flex-1">{title}</span>
        <span className="flex items-center gap-1.5 text-[11px] font-mono text-white/45">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M20 6 9 17l-5-5"/></svg>
          Compatible
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex items-center gap-5" style={{ background: 'rgba(255,255,255,.02)' }}>
        {/* Thumbnail */}
        <Link href={`/produit/${item.selected.slug}`} className="w-[72px] h-[72px] rounded-xl bg-white border flex items-center justify-center shrink-0 relative overflow-hidden hover:scale-105 transition-transform" style={{ borderColor: 'rgba(235,220,196,.3)' }}>
          {item.selected.image_url && (
            <Image src={item.selected.image_url} alt={item.selected.name} fill sizes="72px" className="object-contain p-2 mix-blend-multiply" priority unoptimized={false} />
          )}
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <Link href={`/produit/${item.selected.slug}`} className="font-serif text-[19px] text-white mb-1 block hover:text-primary transition-colors">
            {item.selected.name}
          </Link>
          <p className="text-[12px] font-mono text-white/45 mb-2">{item.selected.brand}</p>
          {explanation && (
            <p className="text-[12px] text-white/50 font-light italic">&quot;{explanation}&quot;</p>
          )}
          {item.alternatives.length > 0 && (
            <button
              type="button"
              onClick={() => setShowAlt(v => !v)}
              className="mt-2 text-[11px] font-mono text-primary/70 hover:text-primary transition-colors uppercase tracking-wider"
            >
              {showAlt ? '▲ Masquer' : `▼ ${item.alternatives.length} alternative${item.alternatives.length > 1 ? 's' : ''}`}
            </button>
          )}
        </div>

        {/* Price + CTA */}
        <div className="text-right shrink-0">
          <p className="font-serif text-[24px] text-white mb-2">{item.selected.price} €</p>
          {bestOffer && (
            <a
              href={bestOffer.affiliate_link}
              target="_blank"
              rel="nofollow sponsored noopener"
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-primary text-foreground text-[11px] font-medium uppercase tracking-[.08em] hover:bg-[#E0C28D] transition-colors"
            >
              Voir →
            </a>
          )}
        </div>
      </div>

      {/* Alternatives */}
      <AnimatePresence>
        {showAlt && item.alternatives.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t"
            style={{ borderColor: 'rgba(255,255,255,.06)' }}
          >
            <div className="p-4 flex flex-col gap-3">
              {item.alternatives.map((alt: any) => {
                const altOffer = alt.offers?.sort((a: any, b: any) => a.price - b.price)[0];
                return (
                  <div key={alt.id} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)' }}>
                    <div className="w-10 h-10 rounded-lg bg-white shrink-0 relative overflow-hidden" style={{ border: '1px solid rgba(235,220,196,.2)' }}>
                      {alt.image_url && <Image src={alt.image_url} alt={alt.name} fill sizes="40px" className="object-contain p-1 mix-blend-multiply" priority />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-white truncate">{alt.name}</p>
                      <p className="text-[11px] font-mono text-white/40">{alt.price} €</p>
                    </div>
                    {altOffer && (
                      <a href={altOffer.affiliate_link} target="_blank" rel="nofollow sponsored noopener" className="text-[11px] font-mono text-primary hover:text-primary-hover uppercase tracking-wider">Voir →</a>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── STEP ICON HELPERS ─────────────────────────────────── */
const goldIcon = (path: React.ReactNode) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D3B27B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {path}
  </svg>
);

const dimIcon = (path: React.ReactNode) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.45)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {path}
  </svg>
);

/* ─── MAIN PAGE ──────────────────────────────────────────── */
export default function ConfiguratorPage() {
  const { products } = useProducts();
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

  const updateCtx = (key: keyof UserContext, value: any) => setCtx(prev => ({ ...prev, [key]: value }));

  const calculateResult = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const res = generateRecommendation(products, ctx);
      setResult(res);
      setIsCalculating(false);
      setStep(5);
    }, 2000);
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else calculateResult();
  };

  const STEP_LABELS = ['Mission', 'Espace', 'Budget', 'Style'];

  // Score for results
  const score = result?.matchScore ?? 90;
  const circumference = 2 * Math.PI * 36; // ≈ 226
  const offset = circumference * (1 - score / 100);

  return (
    <div
      className="relative min-h-screen grain flex flex-col text-white"
      style={{
        background: 'radial-gradient(ellipse 60% 50% at 80% 10%, rgba(211,178,123,.12) 0%, transparent 55%), #0A0A0A',
      }}
    >
      {/* ── PROGRESS BAR (below global navbar) ────────────── */}
      {step < 5 && !isCalculating && (
        <div className="pt-24 pb-0 px-5 sm:px-8 flex-shrink-0">
          <div className="max-w-[860px] mx-auto">
            <p className="frame-label text-white/30 mb-6 text-center">Le Labo IA — Configurateur</p>
            <div className="flex items-center gap-0">
              {STEP_LABELS.map((label, i) => {
                const num = i + 1;
                const isActive = num <= step;
                return (
                  <React.Fragment key={label}>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-mono font-semibold transition-all"
                        style={isActive ? { background: '#D3B27B', color: '#0F0F0F' } : { background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.4)' }}
                      >
                        {String(num).padStart(2, '0')}
                      </div>
                      <span className="frame-label hidden sm:block" style={{ color: isActive ? '#D3B27B' : 'rgba(255,255,255,.35)' }}>
                        {label}
                      </span>
                    </div>
                    {i < STEP_LABELS.length - 1 && (
                      <div className="flex-1 h-px mx-4" style={{ background: 'rgba(211,178,123,.15)' }} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── CONTENT ────────────────────────────────────────── */}
      <div className={cn('flex-1 overflow-y-auto px-5 sm:px-8 pb-32', step < 5 ? 'pt-12' : 'pt-28')}>
        <div className="max-w-[860px] mx-auto w-full">

          <AnimatePresence mode="wait">

            {/* ── Loading ─────────────────────────────────── */}
            {isCalculating && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center gap-8 py-20"
              >
                <div className="relative w-20 h-20">
                  <svg width="80" height="80" viewBox="0 0 90 90" className="animate-spin" style={{ animationDuration: '1.4s' }}>
                    <circle cx="45" cy="45" r="36" fill="none" stroke="rgba(211,178,123,.15)" strokeWidth="5"/>
                    <circle cx="45" cy="45" r="36" fill="none" stroke="#D3B27B" strokeWidth="5" strokeLinecap="round" strokeDasharray="226" strokeDashoffset="150"/>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 188 36" width="72" height="14" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <text x="0" y="29" fontFamily="Georgia,serif" fontStyle="italic" fontSize="32" fill="#FAFAFA" letterSpacing="-0.5">Flux</text>
                      <line x1="84" y1="5" x2="84" y2="32" stroke="#D3B27B" strokeWidth="1.5"/>
                      <text x="91" y="28" fontFamily="'JetBrains Mono',monospace" fontSize="15" fill="rgba(250,250,250,.75)" letterSpacing="2">lab</text>
                    </svg>
                  </div>
                </div>
                <div className="text-center">
                  <p className="frame-label text-primary mb-3">Analyse en cours</p>
                  <p className="font-serif text-[24px] text-white">Optimisation budget &amp; compatibilité…</p>
                </div>
              </motion.div>
            )}

            {/* ── STEP 1 — Mission ────────────────────────── */}
            {step === 1 && !isCalculating && (
              <motion.div key="s1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex flex-col gap-10">
                <div>
                  <p className="frame-label text-primary mb-4">Étape 01 · 04</p>
                  <h1 className="font-serif leading-[1.05] tracking-tight text-white" style={{ fontSize: 'clamp(36px,5vw,60px)' }}>
                    Votre <span className="italic text-primary">mission</span><br />principale ?
                  </h1>
                  <p className="text-[16px] text-white/50 font-light leading-[1.65] max-w-[520px] mt-3">Définissons le cœur de votre projet créatif.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <StepCard isActive={ctx.usage === 'streaming'} onClick={() => updateCtx('usage', 'streaming')}
                    icon={goldIcon(<><path d="M23 7 16 12l7 5V7z"/><rect width="15" height="14" x="1" y="5" rx="2" ry="2"/></>)}
                    title="Streaming" desc="Twitch, YouTube Gaming, lives." />
                  <StepCard isActive={ctx.usage === 'podcast'} onClick={() => updateCtx('usage', 'podcast')}
                    icon={dimIcon(<><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></>)}
                    title="Podcast" desc="Voix broadcast, entretiens, audio-only." />
                  <StepCard isActive={ctx.usage === 'music_vocals'} onClick={() => updateCtx('usage', 'music_vocals')}
                    icon={dimIcon(<><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></>)}
                    title="Musique" desc="Chant, production, enregistrement." />
                  <StepCard isActive={ctx.usage === 'video_calls'} onClick={() => updateCtx('usage', 'video_calls')}
                    icon={dimIcon(<><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>)}
                    title="Vidéo & Visio" desc="YouTube, vlogging, conférences pro." />
                </div>
              </motion.div>
            )}

            {/* ── STEP 2 — Espace ─────────────────────────── */}
            {step === 2 && !isCalculating && (
              <motion.div key="s2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex flex-col gap-10">
                <div>
                  <p className="frame-label text-primary mb-4">Étape 02 · 04</p>
                  <h1 className="font-serif leading-[1.05] tracking-tight text-white" style={{ fontSize: 'clamp(36px,5vw,60px)' }}>
                    Votre <span className="italic text-primary">espace</span><br />de création ?
                  </h1>
                  <p className="text-[16px] text-white/50 font-light leading-[1.65] max-w-[520px] mt-3">L&apos;environnement acoustique dicte le choix du micro.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StepCard isActive={ctx.room === 'untreated_bedroom'} onClick={() => updateCtx('room', 'untreated_bedroom')}
                    icon={dimIcon(<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>)}
                    title="Chambre / Salon" desc="Non traité, réverbération naturelle." />
                  <StepCard isActive={ctx.room === 'treated_studio'} onClick={() => updateCtx('room', 'treated_studio')}
                    icon={dimIcon(<><rect x="2" y="2" width="20" height="20" rx="3"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h10"/></>)}
                    title="Studio traité" desc="Acoustique maîtrisée, silencieux." />
                  <StepCard isActive={ctx.room === 'travel'} onClick={() => updateCtx('room', 'travel')}
                    icon={dimIcon(<><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></>)}
                    title="Nomade" desc="En déplacement, hôtels, cafés." />
                </div>

                <div className="pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,.07)' }}>
                  <p className="frame-label text-white/45 mb-5">Votre niveau</p>
                  <div className="flex gap-3">
                    {[
                      { val: 'beginner', label: 'Initié', sub: 'Je débute' },
                      { val: 'intermediate', label: 'Intermédiaire', sub: 'Quelques bases' },
                      { val: 'pro', label: 'Pro', sub: 'Studio régulier' },
                    ].map(item => (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => updateCtx('experience', item.val)}
                        className="flex-1 relative rounded-2xl border transition-all p-4"
                        style={{
                          borderColor: ctx.experience === item.val ? '#D3B27B' : 'rgba(235,220,196,.12)',
                          background: ctx.experience === item.val ? 'rgba(211,178,123,.06)' : 'rgba(255,255,255,.03)',
                          boxShadow: ctx.experience === item.val ? '0 0 0 1px #D3B27B inset' : undefined,
                        }}
                      >
                        {ctx.experience === item.val && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center"><CheckIcon /></div>
                        )}
                        <h4 className="text-[14px] text-white font-medium">{item.label}</h4>
                        <p className="text-[11px] text-white/40 mt-1">{item.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3 — Budget ─────────────────────────── */}
            {step === 3 && !isCalculating && (
              <motion.div key="s3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex flex-col gap-10">
                <div>
                  <p className="frame-label text-primary mb-4">Étape 03 · 04</p>
                  <h1 className="font-serif leading-[1.05] tracking-tight text-white" style={{ fontSize: 'clamp(36px,5vw,60px)' }}>
                    Budget &amp; <span className="italic text-primary">inventaire</span>.
                  </h1>
                  <p className="text-[16px] text-white/50 font-light leading-[1.65] max-w-[520px] mt-3">On optimise l&apos;investissement selon ce que vous avez déjà.</p>
                </div>

                {/* Slider */}
                <div className="rounded-2xl p-8" style={{ border: '1px solid rgba(235,220,196,.12)', background: 'rgba(255,255,255,.03)' }}>
                  <div className="flex items-center justify-between mb-8">
                    <p className="frame-label text-white/45">Budget maximum</p>
                    <p className="font-serif text-white" style={{ fontSize: '40px' }}>
                      {ctx.budget.toLocaleString('fr-FR')} <span className="text-[20px] opacity-50">€</span>
                    </p>
                  </div>
                  <input
                    type="range" min="200" max="5000" step="50"
                    value={ctx.budget}
                    onChange={e => updateCtx('budget', parseInt(e.target.value))}
                    className="w-full h-[2px] rounded-full outline-none cursor-pointer appearance-none"
                    style={{ background: 'rgba(235,220,196,.2)', accentColor: '#D3B27B' }}
                  />
                  <div className="flex justify-between mt-4">
                    <span className="frame-label text-white/30">200 €</span>
                    <span className="frame-label text-white/30">5 000 €</span>
                  </div>
                </div>

                {/* Inventaire */}
                <div className="pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,.07)' }}>
                  <p className="frame-label text-white/45 mb-5">J&apos;ai déjà...</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'hasMic' as keyof UserContext, label: 'Un microphone' },
                      { key: 'hasInterface' as keyof UserContext, label: 'Une interface audio' },
                      { key: 'hasCamera' as keyof UserContext, label: 'Une caméra' },
                      { key: 'hasLights' as keyof UserContext, label: 'Un éclairage' },
                    ].map(item => (
                      <label
                        key={item.key}
                        className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all"
                        style={{ border: `1px solid ${ctx[item.key] ? '#D3B27B' : 'rgba(235,220,196,.12)'}`, background: 'rgba(255,255,255,.03)' }}
                      >
                        <input
                          type="checkbox"
                          checked={!!ctx[item.key]}
                          onChange={() => updateCtx(item.key, !ctx[item.key])}
                          className="w-4 h-4 rounded cursor-pointer accent-primary shrink-0"
                          style={{ accentColor: '#D3B27B' }}
                        />
                        <span className="text-[13px] text-white/75">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 4 — Style ──────────────────────────── */}
            {step === 4 && !isCalculating && (
              <motion.div key="s4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex flex-col gap-10">
                <div>
                  <p className="frame-label text-primary mb-4">Étape 04 · 04</p>
                  <h1 className="font-serif leading-[1.05] tracking-tight text-white" style={{ fontSize: 'clamp(36px,5vw,60px)' }}>
                    Votre <span className="italic text-primary">style</span><br />&amp; vos préférences.
                  </h1>
                  <p className="text-[16px] text-white/50 font-light leading-[1.65] max-w-[520px] mt-3">Pour personnaliser la recommandation finale.</p>
                </div>

                {/* OS */}
                <div>
                  <p className="frame-label text-white/45 mb-4">Système principal</p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { val: 'mac', label: 'Mac (Apple)' },
                      { val: 'pc', label: 'PC (Windows)' },
                    ].map(item => (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => updateCtx('computer', item.val)}
                        className="relative flex items-center gap-4 p-5 rounded-2xl border transition-all"
                        style={{
                          borderColor: ctx.computer === item.val ? '#D3B27B' : 'rgba(235,220,196,.12)',
                          background: ctx.computer === item.val ? 'rgba(211,178,123,.06)' : 'rgba(255,255,255,.03)',
                          boxShadow: ctx.computer === item.val ? '0 0 0 1px #D3B27B inset' : undefined,
                        }}
                      >
                        {ctx.computer === item.val && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center"><CheckIcon /></div>
                        )}
                        {ctx.computer === item.val
                          ? goldIcon(<><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>)
                          : dimIcon(<><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>)
                        }
                        <span className="font-serif text-[17px] text-white">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ambiance */}
                <div>
                  <p className="frame-label text-white/45 mb-4">Ambiance du setup</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { val: 'minimalist', label: 'Minimaliste' },
                      { val: 'rgb_gamer', label: 'Gamer / RGB' },
                      { val: 'pro_studio', label: 'Pro Studio' },
                      { val: 'vintage', label: 'Vintage' },
                    ].map(item => (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => updateCtx('vibe', item.val)}
                        className="relative text-center p-5 rounded-2xl border transition-all"
                        style={{
                          borderColor: ctx.vibe === item.val ? '#D3B27B' : 'rgba(235,220,196,.12)',
                          background: ctx.vibe === item.val ? 'rgba(211,178,123,.06)' : 'rgba(255,255,255,.03)',
                          boxShadow: ctx.vibe === item.val ? '0 0 0 1px #D3B27B inset' : undefined,
                        }}
                      >
                        {ctx.vibe === item.val && (
                          <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center"><CheckIcon /></div>
                        )}
                        <p className="text-[11px] font-medium mt-1" style={{ color: ctx.vibe === item.val ? '#FAFAFA' : 'rgba(255,255,255,.65)' }}>
                          {item.label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 5 — Résultats ──────────────────────── */}
            {step === 5 && result && !isCalculating && (
              <motion.div key="s5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-2 h-2 rounded-full bg-green-400" style={{ boxShadow: '0 0 10px rgba(34,197,94,.6)' }} />
                    <span className="frame-label text-green-400">Analyse complète</span>
                  </div>
                  <h1 className="font-serif text-white mb-3" style={{ fontSize: 'clamp(36px,5vw,60px)', lineHeight: 1.05 }}>
                    Votre setup <span className="italic text-primary">sur-mesure.</span>
                  </h1>
                  <p className="text-[16px] text-white/50 font-light">
                    Budget utilisé : <span className="text-primary font-mono">{result.budgetUtilization}%</span>
                    {' '}· Total estimé : <span className="text-white font-mono">{result.totalCost} €</span>
                  </p>
                </div>

                <div className="grid grid-cols-12 gap-6">
                  {/* Stack cards */}
                  <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
                    {result.mic && <ResultProductCard title="Microphone" item={result.mic} explanation={result.explanations[result.mic.selected.id]} />}
                    {result.audioInterface && <ResultProductCard title="Interface Audio" item={result.audioInterface} explanation={result.explanations[result.audioInterface.selected.id]} />}
                    {result.headphones && <ResultProductCard title="Casque Studio" item={result.headphones} explanation={result.explanations[result.headphones.selected.id]} />}
                    {result.camera && <ResultProductCard title="Caméra" item={result.camera} explanation={result.explanations[result.camera.selected.id]} />}
                    {result.lights.map((light: any) => (
                      <ResultProductCard key={light.selected.id} title="Éclairage" item={light} explanation={result.explanations[light.selected.id]} />
                    ))}
                    {result.acousticTreatment && <ResultProductCard title="Traitement Acoustique" item={result.acousticTreatment} explanation={result.explanations[result.acousticTreatment.selected.id]} />}
                  </div>

                  {/* Sidebar */}
                  <div className="col-span-12 lg:col-span-4">
                    <div className="lg:sticky lg:top-24 rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(235,220,196,.15)' }}>
                      {/* Score ring */}
                      <div className="flex items-center gap-5 p-6 border-b" style={{ background: 'rgba(211,178,123,.08)', borderColor: 'rgba(235,220,196,.10)' }}>
                        <div className="relative w-[72px] h-[72px] shrink-0">
                          <svg width="72" height="72" viewBox="0 0 90 90" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="45" cy="45" r="36" fill="none" stroke="rgba(211,178,123,.15)" strokeWidth="6"/>
                            <circle
                              cx="45" cy="45" r="36" fill="none"
                              stroke="#D3B27B" strokeWidth="6" strokeLinecap="round"
                              strokeDasharray={circumference}
                              strokeDashoffset={offset}
                              style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-serif text-[18px] text-white">{score}</span>
                          </div>
                        </div>
                        <div>
                          <p className="frame-label text-white/45 mb-1">Score synergie</p>
                          <p className="font-serif text-[16px] text-white">
                            Excellente<br /><span className="italic text-primary">compatibilité</span>
                          </p>
                        </div>
                      </div>

                      {/* Items list */}
                      <div className="p-5 flex flex-col gap-2.5">
                        {result.mic && (
                          <div className="flex justify-between items-baseline pb-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                            <span className="text-[13px] text-white/55">Microphone</span>
                            <span className="font-mono text-[13px] text-white/75">{result.mic.selected.price} €</span>
                          </div>
                        )}
                        {result.audioInterface && (
                          <div className="flex justify-between items-baseline pb-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                            <span className="text-[13px] text-white/55">Interface audio</span>
                            <span className="font-mono text-[13px] text-white/75">{result.audioInterface.selected.price} €</span>
                          </div>
                        )}
                        {result.headphones && (
                          <div className="flex justify-between items-baseline pb-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                            <span className="text-[13px] text-white/55">Casque studio</span>
                            <span className="font-mono text-[13px] text-white/75">{result.headphones.selected.price} €</span>
                          </div>
                        )}
                        {result.camera && (
                          <div className="flex justify-between items-baseline pb-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,.06)' }}>
                            <span className="text-[13px] text-white/55">Caméra</span>
                            <span className="font-mono text-[13px] text-white/75">{result.camera.selected.price} €</span>
                          </div>
                        )}
                        <div className="flex justify-between items-baseline pt-1">
                          <span className="text-[14px] text-white font-medium">Total estimé</span>
                          <span className="font-serif text-[22px] text-primary">{result.totalCost} €</span>
                        </div>
                      </div>

                      {/* Restart */}
                      <div className="px-5 pb-5">
                        <button
                          type="button"
                          onClick={() => { setStep(1); setResult(null); }}
                          className="w-full h-11 rounded-full font-mono text-[12px] uppercase tracking-[.1em] transition-all text-white/65 hover:text-white"
                          style={{ border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.06)' }}
                        >
                          Recommencer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* ── BOTTOM NAV ─────────────────────────────────────── */}
      {step < 5 && !isCalculating && (
        <div
          className="fixed bottom-0 left-0 w-full flex-shrink-0 border-t flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 z-40"
          style={{ borderColor: 'rgba(255,255,255,.07)', background: 'rgba(10,10,10,.85)', backdropFilter: 'blur(16px)' }}
        >
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep(s => Math.max(1, s - 1))}
            className="inline-flex items-center gap-2 h-[52px] px-5 sm:px-7 rounded-full font-medium text-[13px] uppercase tracking-[.1em] transition-all"
            style={{
              background: 'transparent',
              color: step === 1 ? 'rgba(255,255,255,.25)' : 'rgba(255,255,255,.55)',
              cursor: step === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="m15 18-6-6 6-6"/></svg>
            Retour
          </button>

          <div className="flex items-center gap-4">
            <span className="frame-label text-white/25 hidden sm:block">
              {String(step).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2.5 h-[52px] px-5 sm:px-7 rounded-full font-medium text-[13px] uppercase tracking-[.1em] text-foreground transition-all hover:shadow-btn"
              style={{ background: '#D3B27B' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#E0C28D')}
              onMouseLeave={e => (e.currentTarget.style.background = '#D3B27B')}
            >
              <span>{step === totalSteps ? 'Générer mon setup' : 'Étape suivante'}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
