import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { pokemonInfiniteListOptions } from '@/api/pokemon'
import { getPokemonListPage } from '@/api/pokemon/pokemon.api'
import { I18nProvider } from '@/lib/i18n'
import type { PokemonListPage } from '@/models/pokemon'
import { CatalogSection } from './CatalogSection'

vi.mock('@/api/pokemon/pokemon.api', () => ({
  getPokemonListPage: vi.fn()
}))

afterEach(() => {
  cleanup()
  vi.resetAllMocks()
  vi.unstubAllGlobals()
})

const renderCatalog = (page?: PokemonListPage) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })

  if (page !== undefined) {
    client.setQueryData(pokemonInfiniteListOptions(24).queryKey, {
      pages: [page],
      pageParams: [0]
    })
  }

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

const pokemonPage = (
  id: number,
  name: string,
  nextOffset: number | null
): PokemonListPage => ({
  count: 2,
  nextOffset,
  results: [{ id, name, artworkUrl: `/artwork/${id}.png` }]
})

const observeIntersections = () => {
  const observers: Array<{
    notify: () => void
    disconnect: ReturnType<typeof vi.fn>
  }> = []

  vi.stubGlobal(
    'IntersectionObserver',
    class {
      readonly disconnect = vi.fn()
      readonly observe = vi.fn()
      readonly notify: () => void

      constructor(callback: IntersectionObserverCallback) {
        this.notify = () =>
          callback(
            [{ isIntersecting: true } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver
          )
        observers.push(this)
      }
    }
  )

  return observers
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

  it('loads the next page from the keyboard-accessible button without IntersectionObserver', async () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    vi.mocked(getPokemonListPage).mockResolvedValue(
      pokemonPage(25, 'pikachu', null)
    )
    renderCatalog(pokemonPage(1, 'bulbasaur', 24))

    fireEvent.click(screen.getByRole('button', { name: 'Load more' }))
    expect(
      await screen.findByRole('link', { name: /pikachu/i })
    ).toBeInTheDocument()
    expect(getPokemonListPage).toHaveBeenCalledWith(
      24,
      24,
      expect.any(AbortSignal)
    )
  })

  it('loads subsequent pages once per intersection and stops at the end', async () => {
    const observers = observeIntersections()
    const deferred = { resolve: (_page: PokemonListPage) => {} }
    const nextPage = new Promise<PokemonListPage>((resolve) => {
      deferred.resolve = resolve
    })
    vi.mocked(getPokemonListPage).mockImplementation((offset) => {
      if (offset === 0) {
        return Promise.resolve(pokemonPage(1, 'bulbasaur', 24))
      }

      return nextPage
    })
    renderCatalog()

    expect(
      await screen.findByRole('link', { name: /bulbasaur/i })
    ).toBeInTheDocument()
    act(() => observers.at(-1)?.notify())
    await waitFor(() => expect(getPokemonListPage).toHaveBeenCalledTimes(2))
    expect(getPokemonListPage).toHaveBeenNthCalledWith(
      2,
      24,
      24,
      expect.any(AbortSignal)
    )
    act(() => observers.at(-1)?.notify())
    expect(getPokemonListPage).toHaveBeenCalledTimes(2)
    expect(screen.getByText('Loading more Pokémon')).toBeInTheDocument()

    act(() => deferred.resolve(pokemonPage(25, 'pikachu', null)))
    expect(
      await screen.findByRole('link', { name: /pikachu/i })
    ).toBeInTheDocument()
    expect(
      screen.getByText("You've reached the end of the collection.")
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Load more' })
    ).not.toBeInTheDocument()
  })

  it('keeps earlier cards and offers retry after a next-page failure', async () => {
    const observers = observeIntersections()
    vi.mocked(getPokemonListPage)
      .mockResolvedValueOnce(pokemonPage(1, 'bulbasaur', 24))
      .mockRejectedValueOnce(new Error('temporary failure'))
      .mockResolvedValueOnce(pokemonPage(25, 'pikachu', null))
    renderCatalog()

    expect(
      await screen.findByRole('link', { name: /bulbasaur/i })
    ).toBeInTheDocument()
    act(() => observers.at(-1)?.notify())
    expect(await screen.findByRole('alert')).toHaveTextContent(
      "We couldn't load more Pokémon."
    )
    expect(screen.getByRole('link', { name: /bulbasaur/i })).toBeInTheDocument()
    act(() => observers.at(-1)?.notify())
    expect(getPokemonListPage).toHaveBeenCalledTimes(2)
    expect(
      screen.queryByRole('button', { name: 'Load more' })
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(
      await screen.findByRole('link', { name: /pikachu/i })
    ).toBeInTheDocument()
  })

  it('offers retry when the first page fails', async () => {
    vi.mocked(getPokemonListPage).mockRejectedValue(new Error('offline'))
    renderCatalog()

    expect(
      await screen.findByText("We couldn't load the collection.")
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Try again' })
    ).toBeInTheDocument()
  })
})
