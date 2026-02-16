import React from 'react';
import { VerticalType } from './types';
import { Mic, Video, Radio, BookOpen } from 'lucide-react';

export const APP_NAME = "Fluxlab";

export const NAVIGATION_LINKS = [
  { label: 'Audio', href: '#audio', icon: <Mic className="w-4 h-4" /> },
  { label: 'Vidéo', href: '#video', icon: <Video className="w-4 h-4" /> },
  { label: 'Streaming', href: '#streaming', icon: <Radio className="w-4 h-4" /> },
  { label: 'Guides & Tutos', href: '#guides', icon: <BookOpen className="w-4 h-4" /> },
];

export const VERTICAL_CONFIG = {
  [VerticalType.Audio]: {
    title: "Studio & Son",
    subtitle: "Audio",
    description: "Microphones, Interfaces et Monitoring. La pureté du signal avant tout.",
    // Tons Or / Ambre
    gradient: "from-amber-100/60 to-orange-100/60",
    border: "border-amber-200/50",
    icon: <Mic className="w-6 h-6 text-amber-700" />,
    accent: "text-amber-800",
    bgHover: "hover:bg-amber-50/80",
    slug: "audio",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800"
  },
  [VerticalType.Video]: {
    title: "Image & Lumière",
    subtitle: "Vidéo",
    description: "Caméras, Objectifs et Éclairage. Sublimez votre rendu visuel.",
    // Tons Pierre / Minéral
    gradient: "from-stone-100/60 to-zinc-200/60",
    border: "border-stone-200/50",
    icon: <Video className="w-6 h-6 text-stone-600" />,
    accent: "text-stone-800",
    bgHover: "hover:bg-stone-50/80",
    slug: "video",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800"
  },
  [VerticalType.Streaming]: {
    title: "Live & Interaction",
    subtitle: "Streaming",
    description: "Captation, Contrôle et Diffusion. Le setup pour le direct.",
    // Tons Terre Cuite / Rose doux
    gradient: "from-rose-100/60 to-orange-100/60",
    border: "border-rose-200/50",
    icon: <Radio className="w-6 h-6 text-rose-700" />,
    accent: "text-rose-800",
    bgHover: "hover:bg-rose-50/80",
    slug: "streaming",
    image: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&q=80&w=800"
  }
};