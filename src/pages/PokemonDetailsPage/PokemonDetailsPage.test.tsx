import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { Link, MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { pokemonDetailsOptions } from '@/api/pokemon'
import { I18nProvider } from '@/lib/i18n'
import type { Pokemon } from '@/models/pokemon'
import { PokemonDetailsPage } from './PokemonDetailsPage'

const pokemon = (id: number, name: string): Pokemon => ({
  id,
  name,
  artworkUrl: null,
  spriteUrl: null,
  types: [],
  abilities: [],
  stats: [],
  heightMeters: 1,
  weightKilograms: 10
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('Pokémon detail navigation', () => {
  it('scrolls to the top on entry and when the Pokémon ID changes', () => {
    const scrollTo = vi.fn()
    vi.stubGlobal('scrollTo', scrollTo)
    const client = new QueryClient()
    client.setQueryData(
      pokemonDetailsOptions('1').queryKey,
      pokemon(1, 'bulbasaur')
    )
    client.setQueryData(
      pokemonDetailsOptions('2').queryKey,
      pokemon(2, 'ivysaur')
    )

    render(
      <QueryClientProvider client={client}>
        <I18nProvider>
          <MemoryRouter initialEntries={['/pokemon/1']}>
            <Link to="/pokemon/2">Next Pokémon</Link>
            <Routes>
              <Route element={<PokemonDetailsPage />} path="/pokemon/:id" />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      </QueryClientProvider>
    )

    expect(scrollTo).toHaveBeenCalledWith(0, 0)
    fireEvent.click(screen.getByRole('link', { name: 'Next Pokémon' }))
    expect(scrollTo).toHaveBeenCalledTimes(2)
    expect(screen.getByRole('heading', { name: 'ivysaur' })).toBeInTheDocument()
  })
})
