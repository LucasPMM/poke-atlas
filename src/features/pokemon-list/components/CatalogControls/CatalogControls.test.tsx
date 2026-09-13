import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { pokemonAbilityNamesOptions } from '@/api/pokemon'
import { I18nProvider } from '@/lib/i18n'
import type { CatalogFilters } from '../../catalog-filters'
import { CatalogControls } from './CatalogControls'

const emptyFilters: CatalogFilters = {
  search: '',
  type: '',
  generation: '',
  ability: '',
  sort: 'number-asc'
}

const renderControls = (filters = emptyFilters) => {
  const client = new QueryClient()
  client.setQueryData(pokemonAbilityNamesOptions().queryKey, ['blaze'])
  const setFilter = vi.fn()
  const clearFilter = vi.fn()
  const clearAll = vi.fn()

  render(
    <QueryClientProvider client={client}>
      <I18nProvider>
        <MemoryRouter>
          <CatalogControls
            clearAll={clearAll}
            clearFilter={clearFilter}
            filters={filters}
            setFilter={setFilter}
          />
        </MemoryRouter>
      </I18nProvider>
    </QueryClientProvider>
  )

  return { setFilter, clearFilter, clearAll }
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal')
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'close')
})

describe('CatalogControls', () => {
  it('commits type, generation, ability, and sorting selections', () => {
    const { setFilter } = renderControls()
    const choose = (current: string, option: string) => {
      const selected = screen.getAllByText(current, { exact: true })[0]

      if (selected === undefined) {
        throw new Error(`Missing catalog selection: ${current}`)
      }

      fireEvent.mouseDown(selected)
      fireEvent.click(screen.getByRole('option', { name: option }))
    }

    choose('All types', 'Fire')
    choose('All generations', 'Generation 1')
    choose('All abilities', 'blaze')
    choose('Number ascending', 'Name A–Z')

    expect(setFilter.mock.calls).toEqual([
      ['type', 'fire'],
      ['generation', '1'],
      ['ability', 'blaze'],
      ['sort', 'name-asc']
    ])
  })

  it('removes active chips, resets filters, and opens the mobile dialog', () => {
    const showModal = vi.fn()
    const close = vi.fn()
    HTMLDialogElement.prototype.showModal = showModal
    HTMLDialogElement.prototype.close = close
    const { clearFilter, clearAll } = renderControls({
      ...emptyFilters,
      search: 'pika',
      type: 'fire'
    })

    fireEvent.click(
      screen.getByRole('button', { name: 'Remove Search the collection: pika' })
    )
    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }))
    fireEvent.click(screen.getByRole('button', { name: 'Filters' }))
    fireEvent.click(
      screen.getByRole('button', { name: 'Close filters', hidden: true })
    )

    expect(clearFilter).toHaveBeenCalledWith('search')
    expect(clearAll).toHaveBeenCalledOnce()
    expect(showModal).toHaveBeenCalledOnce()
    expect(close).toHaveBeenCalledOnce()
  })
})
