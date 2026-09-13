import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { pokemonListOptions } from '@/api/pokemon'
import { I18nProvider } from '@/lib/i18n'
import type { PokemonListPage } from '@/models/pokemon'
import { CatalogSection } from './CatalogSection'

const renderCatalog = (page: PokemonListPage) => {
  const client = new QueryClient()
  client.setQueryData(pokemonListOptions(0, 24).queryKey, page)

  return render(
    <QueryClientProvider client={client}>
      <I18nProvider>
        <MemoryRouter>
          <CatalogSection />
        </MemoryRouter>
      </I18nProvider>
    </QueryClientProvider>
  )
}

describe('CatalogSection', () => {
  it('renders normalized cards with a detail link and an artwork fallback', () => {
    renderCatalog({
      count: 1,
      nextOffset: null,
      results: [{ id: 1, name: 'bulbasaur', artworkUrl: '/missing.png' }]
    })

    const card = screen.getByRole('link', { name: /bulbasaur/i })
    expect(card).toHaveAttribute('href', '/pokemon/1')
    expect(screen.getByText('#0001')).toBeInTheDocument()

    fireEvent.error(screen.getByRole('img', { name: /bulbasaur/i }))
    expect(screen.getByRole('img', { name: /bulbasaur/i })).toBeInTheDocument()
  })

  it('shows an empty state for a valid empty page', () => {
    renderCatalog({ count: 0, nextOffset: null, results: [] })
    expect(
      screen.getByText('No Pokémon are available right now.')
    ).toBeInTheDocument()
  })
})
