import { act, cleanup, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter, useNavigate } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'
import { useCatalogUrlFilters } from './useCatalogUrlFilters'

afterEach(() => {
  cleanup()
})

describe('catalog URL filters', () => {
  it('commits a search term to the URL', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter>{children}</MemoryRouter>
    )
    const { result } = renderHook(useCatalogUrlFilters, { wrapper })

    act(() => result.current.setFilter('search', 'pika', true))
    expect(result.current.filters.search).toBe('pika')
  })

  it('restores a prior URL search', () => {
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
  })
})
