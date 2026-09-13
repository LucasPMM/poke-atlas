import clsx from 'clsx'
import type { ReactNode } from 'react'

type TextProps = {
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3'
  children: ReactNode
  className?: string
  variant?: 'body' | 'muted' | 'eyebrow' | 'heading' | 'display'
}

const styles = {
  body: 'text-base leading-7 text-ink',
  muted: 'text-base leading-7 text-muted',
  eyebrow: 'text-xs font-medium uppercase tracking-[0.17em] text-action',
  heading:
    'font-display text-3xl font-medium tracking-[-0.03em] text-ink md:text-5xl',
  display:
    'font-display text-5xl font-medium leading-[1.05] tracking-[-0.05em] text-ink md:text-7xl'
}

export const Text = ({
  as: Element = 'p',
  children,
  className,
  variant = 'body'
}: TextProps) => {
  return (
    <Element className={clsx(styles[variant], className)}>{children}</Element>
  )
}
