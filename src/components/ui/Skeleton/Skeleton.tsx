import clsx from 'clsx'

type SkeletonProps = {
  className?: string
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      aria-hidden="true"
      className={clsx('shimmer block rounded-2xl bg-surface-muted', className)}
    />
  )
}
