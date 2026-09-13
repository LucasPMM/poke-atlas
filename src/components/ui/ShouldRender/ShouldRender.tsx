import type { ReactNode } from 'react'

type ShouldRenderProps = {
  if: boolean
  children: ReactNode
}

export const ShouldRender = ({
  if: condition,
  children
}: ShouldRenderProps) => {
  if (!condition) {
    return null
  }

  return <>{children}</>
}
