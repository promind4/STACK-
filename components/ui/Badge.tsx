import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import type { BadgeVariant } from '@/types/fluxlab'

/* ─── PRODUCT BADGE ──────────────────────────────────────── */
const badgeStyles: Record<BadgeVariant, string> = {
  new:
    'bg-white/95 text-foreground border border-border/70',
  bestseller:
    'bg-foreground text-white',
  promo:
    'bg-primary text-white',
  out_of_stock:
    'bg-foreground/10 text-foreground/65 border border-foreground/15',
  choix:
    'bg-primary text-foreground',
  'coup-de-coeur':
    'bg-white border border-primary/40 text-primary',
}

const badgeLabels: Record<BadgeVariant, string> = {
  new:         'Nouveau',
  bestseller:  'Meilleure vente',
  promo:       '',            // set via promoLabel prop
  out_of_stock: 'Rupture',
  choix:          'Notre choix',
  'coup-de-coeur': 'Coup de cœur',
}

interface ProductBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant: BadgeVariant
  promoLabel?: string
}

export function ProductBadge({ variant, promoLabel, className, ...props }: ProductBadgeProps) {
  const label = variant === 'promo' ? (promoLabel ?? '−% Promo') : badgeLabels[variant]
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-md',
        'font-mono text-[10px] font-semibold uppercase tracking-[0.12em]',
        'backdrop-blur',
        badgeStyles[variant],
        className
      )}
      {...props}
    >
      {label}
    </span>
  )
}

/* ─── STATUS BADGE (stock, compatibilité…) ───────────────── */
type StatusVariant = 'in_stock' | 'compatible' | 'cloudlifter' | 'unavailable' | 'live'

const statusStyles: Record<StatusVariant, string> = {
  in_stock:    'bg-green-50 border-green-200 text-green-700',
  compatible:  'bg-green-50 border-green-200 text-green-700',
  cloudlifter: 'bg-amber-50 border-amber-200 text-amber-700',
  unavailable: 'bg-foreground/5 border-foreground/15 text-foreground/50',
  live:        'bg-primary/10 border-primary/30 text-primary',
}

const statusDot: Record<StatusVariant, string | null> = {
  in_stock:    'bg-green-500',
  compatible:  null,
  cloudlifter: null,
  unavailable: null,
  live:        'bg-green-400',
}

interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant: StatusVariant
  label: string
}

export function StatusBadge({ variant, label, className, ...props }: StatusBadgeProps) {
  const dot = statusDot[variant]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full',
        'border font-mono text-[10px] uppercase tracking-[0.12em]',
        statusStyles[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('block w-1.5 h-1.5 rounded-full', dot)}
          style={variant === 'in_stock' || variant === 'live' ? { boxShadow: '0 0 6px currentColor' } : {}}
        />
      )}
      {!dot && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          {variant === 'compatible' ? <path d="M20 6 9 17l-5-5"/> : <><path d="M12 9v4"/><circle cx="12" cy="17" r="1"/></>}
        </svg>
      )}
      {label}
    </span>
  )
}

/* ─── FILTER CHIP ────────────────────────────────────────── */
interface FilterChipProps extends HTMLAttributes<HTMLSpanElement> {
  label: string
  onRemove?: () => void
}

export function FilterChip({ label, onRemove, className, ...props }: FilterChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full',
        'bg-accent font-mono text-[11px] text-foreground',
        className
      )}
      {...props}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:text-primary transition-colors"
          aria-label={`Retirer le filtre ${label}`}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>
      )}
    </span>
  )
}

/* ─── FRAME LABEL (eyebrow) ──────────────────────────────── */
interface FrameLabelProps extends HTMLAttributes<HTMLParagraphElement> {
  withRule?: boolean
}

export function FrameLabel({ children, withRule, className, ...props }: FrameLabelProps) {
  return (
    <p
      className={cn(
        'frame-label text-primary flex items-center gap-3',
        className
      )}
      {...props}
    >
      {withRule && <span className="block w-8 h-px bg-primary" aria-hidden />}
      {children}
    </p>
  )
}
