import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { pokemonCatalogOptions, pokemonDetailsOptions } from '@/api/pokemon'
import { I18nProvider } from '@/lib/i18n'
import type { Pokemon } from '@/models/pokemon'
import { PokemonComparePage } from './PokemonComparePage'

const pokemon = (id: number, name: string, hp: number): Pokemon => ({
  id,
  speciesId: id,
  name,
  artworkUrl: null,
  spriteUrl: null,
  types: [id === 4 ? 'fire' : 'grass'],
  abilities: [{ name: 'blaze', isHidden: false }],
  stats: [{ name: 'hp', value: hp }],
  moves: [],
  moveVersion: null,
  heightMeters: 0.6,
  weightKilograms: 8.5
})

const renderPage = (url: string) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })
  client.setQueryData(pokemonCatalogOptions().queryKey, [
    { id: 4, name: 'charmander', artworkUrl: '' },
    { id: 1, name: 'bulbasaur', artworkUrl: '' }
  ])
  client.setQueryData(
    pokemonDetailsOptions('4').queryKey,
    pokemon(4, 'charmander', 39)
  )
  client.setQueryData(
    pokemonDetailsOptions('1').queryKey,
    pokemon(1, 'bulbasaur', 45)
  )

  return render(
    <QueryClientProvider client={client}>
      <I18nProvider>
        <MemoryRouter initialEntries={[url]}>
          <Routes>
            <Route element={<PokemonComparePage />} path="/compare" />
          </Routes>
        </MemoryRouter>
      </I18nProvider>
    </QueryClientProvider>
  )
}

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('Pokémon comparison route', () => {
  it('restores both Pokémon and their stats from a shared URL', () => {
    const scrollTo = vi.fn()
    vi.stubGlobal('scrollTo', scrollTo)
    renderPage('/compare?first=4&second=1')

    expect(
      screen.getByRole('heading', { name: 'Compare two Pokémon' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Stats side by side' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('meter', { name: 'charmander: HP' })
    ).toHaveAttribute('value', '39')
    expect(
      screen.getByRole('meter', { name: 'bulbasaur: HP' })
    ).toHaveAttribute('value', '45')
    expect(screen.getAllByRole('link', { name: 'View details' })).toHaveLength(
      2
    )
    expect(scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('ignores malformed IDs and explains duplicate selections before querying', () => {
    vi.stubGlobal('scrollTo', vi.fn())
    const fetch = vi.fn()
    vi.stubGlobal('fetch', fetch)
    const view = renderPage('/compare?first=undefined&second=1')
    expect(
      screen.getByText('Choose two Pokémon to start comparing.')
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Stats side by side' })
    ).not.toBeInTheDocument()
    view.unmount()

    renderPage('/compare?first=4&second=4')
    expect(screen.getByText('Choose different Pokémon.')).toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
  })
})
