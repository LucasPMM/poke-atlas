import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { I18nProvider } from '@/lib/i18n'
import { CatalogSearchInput } from './CatalogSearchInput'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('CatalogSearchInput', () => {
  it('updates the typed value immediately while committing only after typing stops', () => {
    vi.useFakeTimers()
    const onCommit = vi.fn()
    const parentRender = vi.fn()
    const Parent = () => {
      parentRender()

      return <CatalogSearchInput onCommit={onCommit} search="" />
    }

    render(
      <I18nProvider>
        <Parent />
      </I18nProvider>
    )

    const input = screen.getByRole('searchbox', {
      name: 'Search the collection'
    })
    fireEvent.change(input, { target: { value: 'p' } })
    expect(input).toHaveValue('p')
    act(() => vi.advanceTimersByTime(200))
    fireEvent.change(input, { target: { value: 'pikachu' } })
    expect(input).toHaveValue('pikachu')
    expect(parentRender).toHaveBeenCalledTimes(1)
    expect(onCommit).not.toHaveBeenCalled()

    act(() => vi.advanceTimersByTime(299))
    expect(onCommit).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(1))
    expect(onCommit).toHaveBeenCalledExactlyOnceWith('pikachu')
  })

  it('replaces a pending draft when navigation changes the URL search', () => {
    vi.useFakeTimers()
    const onCommit = vi.fn()
    const renderSearch = (search: string) => (
      <I18nProvider>
        <CatalogSearchInput onCommit={onCommit} search={search} />
      </I18nProvider>
    )
    const view = render(renderSearch(''))
    const input = screen.getByRole('searchbox', {
      name: 'Search the collection'
    })

    fireEvent.change(input, { target: { value: 'stale' } })
    view.rerender(renderSearch('pikachu'))
    expect(input).toHaveValue('pikachu')
    act(() => vi.advanceTimersByTime(500))
    expect(onCommit).not.toHaveBeenCalled()
  })
})
