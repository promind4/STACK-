"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/Button";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Image from "next/image";
import {
    Menu,
    X,
    ChevronRight,
    Mic,
    Camera,
    Radio,
    Sparkles,
    Search,
} from "lucide-react";

// --- MEGA MENU DATA ---
interface MenuColumnItem {
    label: string;
    desc: string;
    slug: string;
}

interface MenuColumn {
    title: string;
    items: MenuColumnItem[];
}

interface MenuPromo {
    title: string;
    desc: string;
    actionLabel: string;
    target: string;
}

interface MenuItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    targetPage: string;
    columns: MenuColumn[];
    promo: MenuPromo;
}

const MENU_DATA: MenuItem[] = [
    {
        id: "audio",
        label: "Studio & Son",
        icon: <Mic className="w-4 h-4" />,
        targetPage: "/categorie/audio",
        columns: [
            {
                title: "Microphones",
                items: [
                    { label: "Micros Dynamiques", desc: "Pour la voix radio", slug: "micros-dynamiques" },
                    { label: "Micros Condensateurs", desc: "Pour le chant & détails", slug: "micros-condensateurs" },
                    { label: "Micros USB", desc: "Plug & Play", slug: "micros-usb" },
                    { label: "Micros Shotgun", desc: "Pour la vidéo", slug: "micros-shotgun" },
                ],
            },
            {
                title: "Interfaces & Son",
                items: [
                    { label: "Cartes Son USB", desc: "Scarlett, Audient...", slug: "cartes-son" },
                    { label: "Préamplis & Cloudlifter", desc: "Boostez votre gain", slug: "preamplis" },
                    { label: "Casques Studio", desc: "Monitoring précis", slug: "casques-studio" },
                    { label: "Enceintes", desc: "Écoute de référence", slug: "enceintes" },
                ],
            },
            {
                title: "Accessoires",
                items: [
                    { label: "Bras articulés", desc: "Rode, Elgato", slug: "bras-articules" },
                    { label: "Câbles XLR", desc: "Haute qualité", slug: "cable-xlr" },
                    { label: "Traitement Acoustique", desc: "Mousses & Panneaux", slug: "traitement-acoustique" },
                ],
            },
        ],
        promo: {
            title: "Le Labo Fluxlab",
            desc: "Micro, Interface, Casque ? L'IA compose votre studio sur-mesure.",
            actionLabel: "Lancer le Configurateur",
            target: "/configurateur",
        },
    },
    {
        id: "video",
        label: "Image & Lumière",
        icon: <Camera className="w-4 h-4" />,
        targetPage: "/categorie/video",
        columns: [
            {
                title: "Caméras",
                items: [
                    { label: "Hybrides (Mirrorless)", desc: "Sony Alpha, Canon R", slug: "hybrides-mirrorless" },
                    { label: "Webcams Pro", desc: "Elgato Facecam, Razer", slug: "webcams-pro" },
                    { label: "Action Cams", desc: "GoPro, DJI", slug: "action-cams" },
                ],
            },
            {
                title: "Éclairage",
                items: [
                    { label: "Key Lights", desc: "Lumière principale", slug: "keylight" },
                    { label: "Softbox", desc: "Diffusion douce", slug: "softbox" },
                    { label: "RGB & Ambiance", desc: "Tubes LED, Rubans", slug: "rgb-ambiance" },
                ],
            },
            {
                title: "Objectifs",
                items: [
                    { label: "Grand Angle", desc: "Pour le Vlogging", slug: "grand-angle" },
                    { label: "Zooms Polyvalents", desc: "Tout terrain", slug: "zoom-polyvalent" },
                ],
            },
        ],
        promo: {
            title: "Le Labo Fluxlab",
            desc: "Nos algorithmes configurent votre setup idéal gratuitement.",
            actionLabel: "Lancer le Configurateur",
            target: "/configurateur",
        },
    },
    {
        id: "streaming",
        label: "Streaming",
        icon: <Radio className="w-4 h-4" />,
        targetPage: "/categorie/streaming",
        columns: [
            {
                title: "Setup Live",
                items: [
                    { label: "Fonds verts", desc: "Incrustation propre", slug: "fonds-verts" },
                    { label: "Téléprompteurs", desc: "Pour lire vos scripts", slug: "teleprompteurs" },
                    { label: "Câble Management", desc: "Organisation", slug: "cable-management" },
                ],
            },
            {
                title: "Logiciels",
                items: [
                    // { label: "Logiciels & Apps", desc: "OBS, vMix, VoiceMod...", slug: "logiciels-apps" },
                    // { label: "Design & Overlays", desc: "Alertes, Transition, Logos", slug: "design-overlays" },
                ],
            },
            {
                title: "Captation",
                items: [
                    { label: "Stream Deck", desc: "Contrôle total", slug: "stream-deck" },
                ],
            },
        ],
        promo: {
            title: "Le Labo Fluxlab",
            desc: "Besoin d'aide pour streamer ? L'IA construit votre régie.",
            actionLabel: "Lancer le Configurateur",
            target: "/configurateur",
        },
    },
];

export function Navbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 20);
    });

    const handleMouseEnter = (menuId: string) => setActiveMenu(menuId);
    const handleMouseLeave = () => setActiveMenu(null);

    const isTransparent = !isScrolled && !activeMenu;

    return (
        <motion.nav
            onMouseLeave={handleMouseLeave}
            className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${isScrolled || activeMenu
                ? "bg-background/95 backdrop-blur-md border-border shadow-sm"
                : "bg-transparent border-transparent py-2"
                }`}
        >
            <div className="container mx-auto px-6 max-w-[1600px]">
                <div
                    className={`flex items-center justify-between transition-all duration-300 ${isScrolled || activeMenu ? "py-3" : "py-5"
                        }`}
                >
                    {/* LOGO */}
                    <Link href="/" className="flex items-center group z-50 relative">
                        <Image
                            src={isTransparent && pathname === "/configurateur" ? "/branding/logo-light.svg" : "/branding/logo.svg"}
                            alt="Fluxlab"
                            width={150}
                            height={40}
                            className="h-10 w-auto transition-all duration-300"
                            priority
                        />
                    </Link>

                    {/* DESKTOP NAV */}
                    <div className="hidden lg:flex items-center gap-1">
                        {MENU_DATA.map((menu) => (
                            <div
                                key={menu.id}
                                onMouseEnter={() => handleMouseEnter(menu.id)}
                                className="relative px-4 py-2 cursor-pointer group"
                            >
                                <Link
                                    href={menu.targetPage}
                                    className={`text-sm font-semibold transition-colors ${activeMenu === menu.id
                                        ? "text-primary"
                                        : "text-foreground hover:text-primary"
                                        }`}
                                >
                                    {menu.label}
                                </Link>

                                {activeMenu === menu.id && (
                                    <motion.div
                                        layoutId="underline"
                                        className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"
                                    />
                                )}
                            </div>
                        ))}
                        <Link
                            href="/guides"
                            className="text-sm font-semibold text-foreground hover:text-primary px-4 py-2 transition-colors"
                        >
                            Guides &amp; Tutos
                        </Link>
                    </div>

                    <div className="hidden lg:flex items-center gap-4 z-50 relative">
                        <Link href="/configurateur">
                            <Button variant="primary" size="sm" className="group">
                                Le Labo IA
                                <Sparkles className="w-4 h-4 ml-1 opacity-70" />
                            </Button>
                        </Link>
                    </div>

                    {/* MOBILE TOGGLE */}
                    <button
                        className="lg:hidden p-2 z-50 text-foreground"
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
                        className="hidden md:block absolute top-full left-0 w-full bg-white backdrop-blur-xl border-b border-border shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden"
                    >
                        <div className="container mx-auto px-6 max-w-[1600px] py-12 text-foreground">
                            {MENU_DATA.map((menu) => {
                                if (menu.id !== activeMenu) return null;
                                return (
                                    <div key={menu.id} className="grid grid-cols-12 gap-8">
                                        {menu.columns.map((col, idx) => (
                                            <div key={idx} className="col-span-3 space-y-6">
                                                <h4 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
                                                    <span className="w-1 h-4 bg-primary/50 rounded-full" />
                                                    {col.title}
                                                </h4>
                                                <ul className="space-y-4">
                                                    {col.items.map((item, itemIdx) => (
                                                        <li key={itemIdx} className="group/item">
                                                            <Link
                                                                href={`/categorie/${item.slug}`}
                                                                className="block"
                                                                onClick={() => setActiveMenu(null)}
                                                            >
                                                                <div className="font-medium text-sm text-foreground/80 group-hover/item:text-primary transition-colors">
                                                                    {item.label}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground group-hover/item:text-muted-foreground/80">
                                                                    {item.desc}
                                                                </div>
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                        {/* Promo */}
                                        <div className="col-span-3">
                                            <Link
                                                href={menu.promo.target}
                                                className="bg-[#E8DCC4]/30 rounded-xl p-6 h-full border border-primary/20 flex flex-col items-center justify-center text-center group/promo hover:bg-[#E8DCC4]/50 transition-colors relative overflow-hidden block"
                                                onClick={() => setActiveMenu(null)}
                                            >
                                                <div className="absolute top-0 right-0 p-20 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                                <div className="relative z-10">
                                                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 mx-auto group-hover/promo:scale-110 transition-transform duration-500">
                                                        <Sparkles className="w-8 h-8 text-primary" />
                                                    </div>
                                                    <h4 className="font-bold text-lg mb-2">
                                                        {menu.promo.title}
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                                                        {menu.promo.desc}
                                                    </p>
                                                    <Button size="sm" className="w-full">
                                                        {menu.promo.actionLabel}
                                                    </Button>
                                                </div>
                                            </Link>
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
                        animate={{ opacity: 1, height: "100vh" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden fixed top-[60px] left-0 w-full bg-background z-40 overflow-y-auto pb-20 border-t border-border"
                    >
                        <div className="flex flex-col p-6 space-y-6">
                            {MENU_DATA.map((menu) => (
                                <div key={menu.id} className="space-y-4">
                                    <Link
                                        href={menu.targetPage}
                                        className="text-xl font-bold text-foreground"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {menu.label}
                                    </Link>
                                    <div className="pl-12 grid gap-3">
                                        {menu.columns.map((col) => (
                                            <div key={col.title}>
                                                <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2 block">
                                                    {col.title}
                                                </span>
                                                <ul className="space-y-2 mb-4">
                                                    {col.items.slice(0, 3).map((item) => (
                                                        <li key={item.label}>
                                                            <Link
                                                                href={`/categorie/${item.slug}`}
                                                                className="text-sm text-muted-foreground"
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                            >
                                                                {item.label}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="h-px w-full bg-border" />
                                </div>
                            ))}
                            <Link
                                href="/guides"
                                className="flex items-center gap-3 text-xl font-bold text-foreground"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Guides &amp; Tutos
                            </Link>
                            <div className="bg-secondary/30 p-4 rounded-xl border border-border">
                                <h4 className="font-bold mb-2 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-primary" /> Le Labo Fluxlab
                                </h4>
                                <p className="text-xs text-muted-foreground mb-3">
                                    Laissez l&apos;IA configurer votre setup.
                                </p>
                                <Link href="/configurateur" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="primary" size="sm" className="w-full">
                                        Lancer l&apos;outil
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
