import { useEffect, useRef } from 'react'

export const useLoadMoreOnIntersect = (
  enabled: boolean,
  onIntersect: () => void
) => {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current

    if (
      !enabled ||
      sentinel === null ||
      typeof IntersectionObserver === 'undefined'
    ) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onIntersect()
        }
      },
      { rootMargin: '320px 0px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [enabled, onIntersect])

  return sentinelRef
}
