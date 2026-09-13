import clsx from 'clsx'
import { type ComponentPropsWithRef, useState } from 'react'
import { Icon } from '../Icon'

type ImageProps = Omit<ComponentPropsWithRef<'img'>, 'src'> & {
  src?: string | null
  fallbackLabel: string
}

export const Image = ({
  alt,
  className,
  fallbackLabel,
  onError,
  src,
  ...props
}: ImageProps) => {
  const [failedSource, setFailedSource] = useState<string | null>(null)

  if (!src || failedSource === src) {
    return (
      <div
        aria-hidden={alt === ''}
        aria-label={alt === '' ? undefined : alt || fallbackLabel}
        className={clsx(
          'inline-flex items-center justify-center rounded-2xl bg-surface-muted text-muted',
          className
        )}
        role="img"
      >
        <Icon name="sparkles" size={28} />
      </div>
    )
  }

  return (
    <img
      alt={alt}
      className={className}
      decoding="async"
      loading="lazy"
      onError={(event) => {
        setFailedSource(src)
        onError?.(event)
      }}
      src={src}
      {...props}
    />
  )
}
