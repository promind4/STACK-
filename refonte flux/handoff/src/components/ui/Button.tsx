import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

/* ─── VARIANTS ───────────────────────────────────────────── */
const base =
  'inline-flex items-center justify-center gap-2.5 font-medium ' +
  'uppercase tracking-[0.1em] text-[13px] transition-all duration-200 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ' +
  'disabled:pointer-events-none disabled:opacity-40'

const variants = {
  primary:
    'h-14 px-8 rounded-full bg-primary text-primary-foreground ' +
    'hover:bg-primary-hover hover:shadow-btn active:scale-[.98]',

  ghost:
    'h-14 px-8 rounded-full border border-white/20 text-white ' +
    'hover:bg-white/5 hover:border-white/40',

  outline:
    'h-12 px-6 rounded-full border border-border text-foreground ' +
    'hover:border-primary hover:text-primary',

  'outline-dark':
    'h-12 px-6 rounded-full border border-white/15 text-white/80 ' +
    'hover:border-primary/60 hover:text-primary',

  /** Nav CTA: "Le Labo IA" pill with inner arrow circle */
  'pill-icon':
    'h-10 pl-5 pr-2 rounded-full bg-primary text-primary-foreground ' +
    'hover:bg-primary-hover text-[12px]',
} as const

const sizes = {
  sm: 'h-10 px-5 text-[12px]',
  md: 'h-12 px-7',
  lg: 'h-14 px-9',
} as const

/* ─── PROPS ──────────────────────────────────────────────── */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  /** Show animated arrow nudge */
  withArrow?: boolean
}

/* ─── COMPONENT ──────────────────────────────────────────── */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size, withArrow, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], size && sizes[size], className)}
      {...props}
    >
      {children}
      {withArrow && (
        <svg
          width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
          className="group-hover:animate-nudge"
          aria-hidden
        >
          <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
        </svg>
      )}
    </button>
  )
)
Button.displayName = 'Button'

/* ─── LABO CTA (nav variant with circle icon) ─────────────── */
export function LaboButton({ className, children = 'Le Labo IA', ...props }: ButtonProps) {
  return (
    <Button variant="pill-icon" className={cn('group', className)} {...props}>
      <span>{children}</span>
      <span className="w-6 h-6 rounded-full bg-foreground text-primary flex items-center justify-center shrink-0">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
        </svg>
      </span>
    </Button>
  )
}
