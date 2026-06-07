/* ─── FLUXLAB ICONS v1.0 ────────────────────────────────────
   37 icônes SVG custom — stroke 1.5 · round · 24×24
   Usage: <MicBroadcast size={24} className="text-primary" />
   ──────────────────────────────────────────────────────────── */
import { SVGProps } from 'react'

export type IconProps = SVGProps<SVGSVGElement> & { size?: number }

const base: SVGProps<SVGSVGElement> = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const Icon = (d: React.ReactNode, size = 24, props: IconProps) => (
  <svg viewBox="0 0 24 24" width={props.size ?? size} height={props.size ?? size} {...base} {...props}>
    {d}
  </svg>
)

// ─── AUDIO ───────────────────────────────────────────────────

export const MicBroadcast = (p: IconProps) => Icon(<>
  <rect x="7" y="3" width="10" height="11.5" rx="1.5"/>
  <line x1="7" y1="8" x2="17" y2="8"/>
  <line x1="7" y1="11" x2="17" y2="11"/>
  <path d="M12 14.5v4"/><path d="M9.5 21h5"/>
</>, 24, p)

export const MicStudio = (p: IconProps) => Icon(<>
  <rect x="9.5" y="2" width="5" height="12" rx="2.5"/>
  <path d="M6.5 10.5a5.5 5.5 0 0 0 11 0"/>
  <path d="M12 15.5v4"/><path d="M9.5 21h5"/>
</>, 24, p)

export const MicUsb = (p: IconProps) => Icon(<>
  <path d="M9 4.5a3 3 0 0 1 6 0v7a3 3 0 0 1-6 0V4.5z"/>
  <path d="M9 8.5h6"/>
  <path d="M9 11.5a3 3 0 0 0 6 0"/>
  <path d="M10 14.5h4"/><path d="M8 17h8"/><path d="M7 20h10"/>
</>, 24, p)

export const MicLavalier = (p: IconProps) => Icon(<>
  <circle cx="12" cy="5" r="2.5"/>
  <path d="M12 7.5v4"/>
  <path d="M10 11.5c0 1.1.9 2 2 2s2-.9 2-2"/>
  <path d="M12 13.5c0 3-2 4.5-2 6.5"/>
  <circle cx="10" cy="21" r="1.5" fill="currentColor" stroke="none"/>
</>, 24, p)

export const Headphones = (p: IconProps) => Icon(<>
  <path d="M4 12.5a8 8 0 0 1 16 0"/>
  <rect x="2" y="12" width="4" height="7" rx="1.5"/>
  <rect x="18" y="12" width="4" height="7" rx="1.5"/>
  <path d="M2 15.5h4M18 15.5h4"/>
</>, 24, p)

export const InterfaceAudio = (p: IconProps) => Icon(<>
  <rect x="2" y="6.5" width="20" height="11" rx="2"/>
  <circle cx="8" cy="12" r="2.5"/>
  <circle cx="14.5" cy="12" r="2.5"/>
  <line x1="19" y1="9.5" x2="21" y2="9.5"/>
  <line x1="19" y1="12" x2="21" y2="12"/>
  <line x1="19" y1="14.5" x2="21" y2="14.5"/>
</>, 24, p)

export const XlrCable = (p: IconProps) => Icon(<>
  <circle cx="12" cy="10.5" r="6"/>
  <circle cx="10" cy="9" r="1.2"/>
  <circle cx="14" cy="9" r="1.2"/>
  <circle cx="12" cy="12.5" r="1.2"/>
  <path d="M12 16.5v5.5"/>
  <line x1="10" y1="22" x2="14" y2="22"/>
</>, 24, p)

export const Waveform = (p: IconProps) => Icon(<>
  <polyline points="2,12 4.5,12 6,6.5 8,17.5 10,9 12,15 13.5,12 22,12"/>
</>, 24, { ...p, strokeWidth: p.strokeWidth ?? 2 })

export const Speaker = (p: IconProps) => Icon(<>
  <rect x="5" y="3" width="9" height="18" rx="2"/>
  <circle cx="9.5" cy="12" r="3"/>
  <circle cx="9.5" cy="12" r="1"/>
  <path d="M14 9l3-3"/><path d="M14 15l3 3"/>
</>, 24, p)

// ─── VIDEO ───────────────────────────────────────────────────

export const Camera = (p: IconProps) => Icon(<>
  <path d="M2 9a2 2 0 0 1 2-2h1.5L7.5 5h9l2 2H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9z"/>
  <circle cx="12" cy="14" r="3.5"/>
  <circle cx="12" cy="14" r="1.5"/>
</>, 24, p)

export const Lens = (p: IconProps) => Icon(<>
  <circle cx="12" cy="12" r="9"/>
  <circle cx="12" cy="12" r="5"/>
  <circle cx="12" cy="12" r="2"/>
  <line x1="3.5" y1="8" x2="6" y2="8"/>
  <line x1="3.5" y1="16" x2="6" y2="16"/>
</>, 24, p)

export const LightPanel = (p: IconProps) => Icon(<>
  <rect x="3" y="4.5" width="18" height="11" rx="1.5"/>
  <line x1="7.5" y1="8.5" x2="7.5" y2="11.5"/>
  <line x1="11" y1="8.5" x2="11" y2="11.5"/>
  <line x1="14.5" y1="8.5" x2="14.5" y2="11.5"/>
  <line x1="18" y1="8.5" x2="18" y2="11.5"/>
  <path d="M8 15.5v3M12 15.5v3M16 15.5v3"/>
</>, 24, p)

export const Tripod = (p: IconProps) => Icon(<>
  <circle cx="12" cy="4.5" r="2"/>
  <path d="M12 6.5v4"/>
  <path d="M12 10.5L6 21"/><path d="M12 10.5L18 21"/>
  <path d="M12 14L8 21M12 14L16 21"/>
  <line x1="8" y1="18.5" x2="16" y2="18.5"/>
</>, 24, p)

// ─── STREAMING ───────────────────────────────────────────────

export const LiveBroadcast = (p: IconProps) => Icon(<>
  <circle cx="12" cy="12" r="2.5"/>
  <path d="M8 12a4 4 0 0 0 8 0"/>
  <path d="M5 12a7 7 0 0 0 14 0"/>
  <line x1="2" y1="12" x2="5" y2="12"/>
  <line x1="19" y1="12" x2="22" y2="12"/>
</>, 24, p)

export const CaptureCard = (p: IconProps) => Icon(<>
  <rect x="3" y="5" width="18" height="14" rx="2"/>
  <path d="M9 9.5h6"/><path d="M9 12.5h4"/>
  <rect x="14" y="10.5" width="4" height="4" rx="1"/>
  <line x1="3" y1="19" x2="21" y2="19"/>
</>, 24, p)

export const StreamDeck = (p: IconProps) => Icon(<>
  <rect x="3" y="4" width="18" height="16" rx="2"/>
  <rect x="5.5" y="6.5" width="4" height="4" rx="1"/>
  <rect x="10" y="6.5" width="4" height="4" rx="1"/>
  <rect x="14.5" y="6.5" width="4" height="4" rx="1"/>
  <rect x="5.5" y="12" width="4" height="4" rx="1"/>
  <rect x="10" y="12" width="4" height="4" rx="1"/>
  <rect x="14.5" y="12" width="4" height="4" rx="1"/>
</>, 24, p)

// ─── CONCEPT ─────────────────────────────────────────────────

export const Stack = (p: IconProps) => Icon(<>
  <rect x="3" y="4" width="18" height="4" rx="1"/>
  <rect x="3" y="10" width="18" height="4" rx="1"/>
  <rect x="3" y="16" width="18" height="4" rx="1"/>
  <line x1="7" y1="6" x2="11" y2="6"/>
  <line x1="7" y1="12" x2="14" y2="12"/>
  <line x1="7" y1="18" x2="9" y2="18"/>
  <circle cx="18.5" cy="6" r="1"/>
  <circle cx="18.5" cy="18" r="1"/>
</>, 24, p)

export const Lab = (p: IconProps) => Icon(<>
  <path d="M9 3h6"/>
  <path d="M10 3v6L5 17.5A2 2 0 0 0 6.72 20h10.56A2 2 0 0 0 19 17.5L14 9V3"/>
  <path d="M8.5 15.5c1-.8 1.5.4 2.5.4s1.5-1.2 2.5-1.2 1.5 1.2 2.5.8"/>
</>, 24, p)

export const Compatibility = (p: IconProps) => Icon(<>
  <rect x="2" y="9" width="8" height="6" rx="3"/>
  <rect x="14" y="9" width="8" height="6" rx="3"/>
  <line x1="10" y1="12" x2="14" y2="12"/>
  <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none"/>
  <circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none"/>
</>, 24, p)

export const ScoreGauge = (p: IconProps) => Icon(<>
  <path d="M5 17.5A9 9 0 0 1 19 17.5"/>
  <path d="M8 17.5a4 4 0 0 1 8 0"/>
  <line x1="12" y1="12.5" x2="9" y2="17.5"/>
  <circle cx="12" cy="17.5" r="1" fill="currentColor" stroke="none"/>
</>, 24, p)

export const Independence = (p: IconProps) => Icon(<>
  <path d="M12 2.5L4 6.5v5c0 5.25 3.3 9.8 8 11.2 4.7-1.4 8-5.95 8-11.2v-5L12 2.5z"/>
  <path d="M9 11.5l2.5 2.5 4.5-4.5"/>
</>, 24, p)

export const PriceLive = (p: IconProps) => Icon(<>
  <circle cx="12" cy="12" r="9"/>
  <path d="M12 7v5l3 3"/>
  <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/>
</>, 24, p)

export const GuideEditorial = (p: IconProps) => Icon(<>
  <path d="M4 4h7l1.5 2.5H20v13H4z"/>
  <line x1="7.5" y1="10" x2="11" y2="10"/>
  <line x1="7.5" y1="13" x2="13" y2="13"/>
  <line x1="7.5" y1="16" x2="10" y2="16"/>
</>, 24, p)

// ─── UI ──────────────────────────────────────────────────────

export const Search = (p: IconProps) => Icon(<>
  <circle cx="10.5" cy="10.5" r="7"/>
  <path d="M16 16L21.5 21.5"/>
</>, 24, p)

export const FilterSliders = (p: IconProps) => Icon(<>
  <line x1="2" y1="6" x2="22" y2="6"/><circle cx="8" cy="6" r="2"/>
  <line x1="2" y1="12" x2="22" y2="12"/><circle cx="16" cy="12" r="2"/>
  <line x1="2" y1="18" x2="22" y2="18"/><circle cx="5.5" cy="18" r="2"/>
</>, 24, p)

export const Sort = (p: IconProps) => Icon(<>
  <line x1="3" y1="6" x2="21" y2="6"/>
  <line x1="6" y1="12" x2="18" y2="12"/>
  <line x1="9" y1="18" x2="15" y2="18"/>
</>, 24, p)

export const Heart = (p: IconProps) => Icon(<>
  <path d="M20.5 6.5a4.5 4.5 0 0 0-6.4-.1L12 8.6l-2.1-2.2A4.5 4.5 0 0 0 3.5 12.7L12 21l8.5-8.3a4.5 4.5 0 0 0 0-6.2z"/>
</>, 24, p)

export const Share = (p: IconProps) => Icon(<>
  <circle cx="18" cy="5" r="2.5"/>
  <circle cx="6" cy="12" r="2.5"/>
  <circle cx="18" cy="19" r="2.5"/>
  <line x1="8.5" y1="10.8" x2="15.5" y2="6.2"/>
  <line x1="8.5" y1="13.2" x2="15.5" y2="17.8"/>
</>, 24, p)

export const ExternalLink = (p: IconProps) => Icon(<>
  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
  <polyline points="15 3 21 3 21 9"/>
  <line x1="10" y1="14" x2="21" y2="3"/>
</>, 24, p)

export const ArrowRight = (p: IconProps) => Icon(<>
  <line x1="4" y1="12" x2="20" y2="12"/>
  <polyline points="13 5 20 12 13 19"/>
</>, 24, p)

export const ArrowUpRight = (p: IconProps) => Icon(<>
  <line x1="5" y1="19" x2="19" y2="5"/>
  <polyline points="5 5 19 5 19 19"/>
</>, 24, p)

export const Close = (p: IconProps) => Icon(<>
  <line x1="18" y1="6" x2="6" y2="18"/>
  <line x1="6" y1="6" x2="18" y2="18"/>
</>, 24, p)

export const Check = (p: IconProps) => Icon(<>
  <polyline points="20 6 9 17 4 12"/>
</>, 24, p)

export const Star = (p: IconProps) => Icon(<>
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
</>, 24, p)

export const Alert = (p: IconProps) => Icon(<>
  <path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h16.9a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>
  <line x1="12" y1="9" x2="12" y2="13"/>
  <line x1="12" y1="17" x2="12.01" y2="17"/>
</>, 24, p)

export const User = (p: IconProps) => Icon(<>
  <circle cx="12" cy="8" r="4"/>
  <path d="M4 20c0-4 3.6-7.5 8-7.5s8 3.5 8 7.5"/>
</>, 24, p)

export const Menu = (p: IconProps) => Icon(<>
  <line x1="3" y1="8" x2="21" y2="8"/>
  <line x1="3" y1="14" x2="21" y2="14"/>
  <line x1="3" y1="20" x2="15" y2="20"/>
</>, 24, p)
