import clsx from 'clsx'
import type { ComponentPropsWithRef } from 'react'

type ButtonProps = ComponentPropsWithRef<'button'> & {
  variant?: 'primary' | 'outline' | 'ghost'
}

const styles = {
  primary: 'bg-action text-action-contrast hover:bg-action-hover',
  outline: 'border border-line bg-surface text-ink hover:bg-surface-muted',
  ghost: 'text-ink hover:bg-surface-muted'
}

export const Button = ({
  className,
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm transition-[background-color,transform] duration-150 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100',
        styles[variant],
        className
      )}
      type={type}
      {...props}
    />
  )
}
