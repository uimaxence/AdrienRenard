import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary'

interface BaseProps {
  /** primary = fond orange (CTA principal), secondary = noir & blanc (CTA secondaire) */
  variant?: ButtonVariant
  className?: string
  children: ReactNode
  icon?: ReactNode
}

type ButtonProps =
  | (BaseProps & { as?: 'button' } & ButtonHTMLAttributes<HTMLButtonElement>)
  | (BaseProps & { as: 'a' } & AnchorHTMLAttributes<HTMLAnchorElement>)

function Inner({
  children,
  icon,
  underlineTextOnly,
}: {
  children: ReactNode
  icon?: ReactNode
  underlineTextOnly?: boolean
}) {
  const textContent = underlineTextOnly ? (
    <span className="underline decoration-inherit underline-offset-4">
      {children}
    </span>
  ) : (
    children
  )
  return (
    <span className="flex items-center justify-center gap-2">
      <span
        aria-hidden
        className="inline-flex w-5 shrink-0 items-center justify-center opacity-0"
      >
        {icon ?? '→'}
      </span>
      <span className="transition-transform duration-200 group-hover:-translate-x-0.5">
        {textContent}
      </span>
      <span
        aria-hidden
        className="inline-flex w-5 shrink-0 -translate-x-2 items-center justify-center opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
      >
        {icon ?? '→'}
      </span>
    </span>
  )
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-[#bf5f24] shadow-sm',
  secondary:
    'bg-transparent text-slate-900 hover:text-slate-700',
}

export default function Button({
  variant = 'primary',
  className = '',
  children,
  icon,
  as,
  ...props
}: ButtonProps) {
  const base =
    'group inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold transition-colors duration-150 cursor-pointer'
  const cls = `${base} ${variantStyles[variant]} ${className}`

  const underlineTextOnly = variant === 'secondary'
  if (as === 'a') {
    return (
      <a className={cls} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        <Inner icon={icon} underlineTextOnly={underlineTextOnly}>
          {children}
        </Inner>
      </a>
    )
  }
  return (
    <button className={cls} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      <Inner icon={icon} underlineTextOnly={underlineTextOnly}>
        {children}
      </Inner>
    </button>
  )
}
