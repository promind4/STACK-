import React from 'react';
import { CheckCircle2, Mic, Sliders, Laptop, Zap, Cable } from 'lucide-react';

export const WhyUsSection = () => {
    const points = [
        { title: "Indépendance Totale", desc: "Nous ne dépendons pas d'une seule marque. Nous mixons Shure, Sony, Elgato pour le meilleur résultat." },
        { title: "La Logique de Stack", desc: "Nous ne vendons pas juste un produit. Nous construisons votre Stack : Le bon Micro + La bonne Interface + Le bon Logiciel." },
        { title: "Gain de Temps", desc: "Fini les heures perdues sur YouTube. Nos configurations sont testées et validées par des pros." }
    ];

    return (
        <section className="py-24 bg-secondary/20 border-y border-border overflow-hidden">
            <div className="container mx-auto px-6 max-w-[1600px]">
                <div className="flex flex-col lg:flex-row gap-16 items-center">

                    <div className="flex-1 space-y-8">
                        <h2 className="text-3xl md:text-4xl font-bold font-serif">L&apos;Avantage Fluxlab</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            La plupart des sites vous vendent un produit. Nous vous vendons un <strong>résultat</strong>.
                            Notre moteur analyse la compatibilité électrique, audio et logicielle entre des milliers de références.
                        </p>

                        <div className="space-y-6">
                            {points.map((point, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="mt-1">
                                        <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground text-lg mb-1">{point.title}</h4>
                                        <p className="text-muted-foreground">{point.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* VISUAL REPRESENTATION OF THE STACK ENGINE */}
                    <div className="flex-1 w-full flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-md">

                            {/* Background Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 rounded-full blur-[80px] pointer-events-none" />

                            <div className="relative bg-background border border-border rounded-3xl shadow-2xl overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
                                {/* Header Card */}
                                <div className="bg-secondary/50 px-6 py-4 border-b border-border flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-primary fill-current" />
                                        <span className="font-bold text-sm tracking-wide uppercase text-foreground">Analyse Fluxlab</span>
                                    </div>
                                    <div className="px-2 py-1 rounded bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Validé
                                    </div>
                                </div>

                                <div className="p-6 space-y-3">

                                    {/* Item 1: Mic */}
                                    <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-white shadow-sm relative z-10">
                                        <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600 border border-stone-200">
                                            <Mic className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <span className="font-bold text-foreground">Shure SM7B</span>
                                                <span className="text-[10px] font-bold uppercase text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">Source</span>
                                            </div>
                                            <div className="text-xs text-muted-foreground">Microphone Dynamique Cardiorïde</div>
                                        </div>
                                    </div>

                                    {/* Connector Visual */}
                                    <div className="flex items-center justify-center -my-2 relative z-0">
                                        <div className="h-6 w-0.5 bg-border absolute"></div>
                                        <div className="bg-white text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground relative z-10 font-mono flex items-center gap-1">
                                            <Cable className="w-3 h-3" /> Câble XLR
                                        </div>
                                    </div>

                                    {/* Item 2: Interface */}
                                    <div className="flex items-center gap-4 p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 shadow-sm relative z-10">
                                        <div className="w-12 h-12 rounded-xl bg-white border border-emerald-100 flex items-center justify-center text-emerald-600">
                                            <Sliders className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <span className="font-bold text-foreground">Focusrite Scarlett</span>
                                                <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 border border-emerald-200 px-1.5 py-0.5 rounded">Compatible</span>
                                            </div>
                                            <div className="text-xs text-emerald-800 font-medium flex items-center gap-1.5">
                                                <CheckCircle2 className="w-3 h-3" /> Préampli suffisant (+60dB)
                                            </div>
                                        </div>
                                    </div>

                                    {/* Connector Visual */}
                                    <div className="flex items-center justify-center -my-2 relative z-0">
                                        <div className="h-6 w-0.5 bg-border absolute"></div>
                                        <div className="bg-white text-[10px] px-2 py-0.5 rounded-full border border-border text-muted-foreground relative z-10 font-mono flex items-center gap-1">
                                            <Cable className="w-3 h-3" /> USB-C
                                        </div>
                                    </div>

                                    {/* Item 3: Software */}
                                    <div className="flex items-center gap-4 p-4 rounded-2xl border border-primary/30 bg-primary/5 shadow-sm relative z-10">
                                        <div className="w-12 h-12 rounded-xl bg-white border border-primary/20 flex items-center justify-center text-primary">
                                            <Laptop className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <span className="font-bold text-foreground">Ableton Live Lite</span>
                                                <span className="text-[10px] font-bold uppercase text-primary bg-white border border-primary/20 px-1.5 py-0.5 rounded shadow-sm">Bundle</span>
                                            </div>
                                            <div className="text-xs text-foreground/70">Licence offerte avec l&apos;interface</div>
                                        </div>
                                    </div>

                                </div>

                                {/* Footer Score */}
                                <div className="bg-foreground text-white p-6 flex justify-between items-center border-t border-white/10">
                                    <div>
                                        <span className="block text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">Score de synergie</span>
                                        <span className="font-bold text-lg text-white">Excellente compatibilité</span>
                                    </div>
                                    <div className="text-4xl font-bold font-mono text-primary flex items-baseline">
                                        98<span className="text-base text-white/40 ml-1">/100</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};
