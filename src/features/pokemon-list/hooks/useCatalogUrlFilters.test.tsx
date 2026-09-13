import { act, cleanup, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter, useNavigate } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useCatalogUrlFilters } from './useCatalogUrlFilters'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('catalog URL filters', () => {
  it('debounces draft search updates and keeps only the latest term', () => {
    vi.useFakeTimers()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter>{children}</MemoryRouter>
    )
    const { result } = renderHook(useCatalogUrlFilters, { wrapper })

    act(() => result.current.setSearchDraft('p'))
    act(() => vi.advanceTimersByTime(200))
    act(() => result.current.setSearchDraft('pika'))
    act(() => vi.advanceTimersByTime(299))
    expect(result.current.filters.search).toBe('')

    act(() => vi.advanceTimersByTime(1))
    expect(result.current.filters.search).toBe('pika')
  })

  it('restores a prior URL search without a stale debounce overwriting it', () => {
    vi.useFakeTimers()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={['/?search=pikachu', '/']} initialIndex={1}>
        {children}
      </MemoryRouter>
    )
    const { result } = renderHook(
      () => ({ ...useCatalogUrlFilters(), navigate: useNavigate() }),
      { wrapper }
    )

    act(() => result.current.navigate(-1))
    expect(result.current.filters.search).toBe('pikachu')
    expect(result.current.searchDraft).toBe('pikachu')
    act(() => vi.advanceTimersByTime(500))
    expect(result.current.filters.search).toBe('pikachu')
  })
})
