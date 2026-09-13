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
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  pokemonAbilityMembersOptions,
  pokemonCatalogOptions,
  pokemonGenerationMembersOptions,
  pokemonInfiniteListOptions,
  pokemonTypeMembersOptions
} from '@/api/pokemon'
import {
  getPokemonAbilityMembers,
  getPokemonAbilityNames,
  getPokemonCatalog,
  getPokemonGenerationMembers,
  getPokemonListPage,
  getPokemonTypeMembers
} from '@/api/pokemon/pokemon.api'
import { I18nProvider } from '@/lib/i18n'
import type { PokemonListPage, PokemonSummary } from '@/models/pokemon'
import { CatalogSection } from './CatalogSection'

vi.mock('@/api/pokemon/pokemon.api', () => ({
  getPokemonListPage: vi.fn(),
  getPokemonAbilityNames: vi.fn(),
  getPokemonCatalog: vi.fn(),
  getPokemonTypeMembers: vi.fn(),
  getPokemonGenerationMembers: vi.fn(),
  getPokemonAbilityMembers: vi.fn()
}))

beforeEach(() => {
  vi.mocked(getPokemonAbilityNames).mockResolvedValue([])
  vi.mocked(getPokemonCatalog).mockResolvedValue([])
  vi.mocked(getPokemonTypeMembers).mockResolvedValue([])
  vi.mocked(getPokemonGenerationMembers).mockResolvedValue([])
  vi.mocked(getPokemonAbilityMembers).mockResolvedValue([])
})

afterEach(() => {
  cleanup()
  vi.resetAllMocks()
  vi.unstubAllGlobals()
})

const renderCatalog = (
  page?: PokemonListPage,
  path = '/',
  catalog?: Array<PokemonSummary>
) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })

  if (page !== undefined) {
    client.setQueryData(pokemonInfiniteListOptions(24).queryKey, {
      pages: [page],
      pageParams: [0]
    })
  }

  if (catalog !== undefined) {
    client.setQueryData(pokemonCatalogOptions().queryKey, catalog)
  }

  return render(
    <QueryClientProvider client={client}>
      <I18nProvider>
        <MemoryRouter initialEntries={[path]}>
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

  it('searches the complete cached catalog beyond the initial page', () => {
    renderCatalog(pokemonPage(1, 'bulbasaur', null), '/?search=pika', [
      { id: 1, name: 'bulbasaur', artworkUrl: '/1.png' },
      { id: 25, name: 'pikachu', artworkUrl: '/25.png' }
    ])

    expect(screen.getByRole('link', { name: /pikachu/i })).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: /bulbasaur/i })
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('searchbox', { name: 'Search the collection' })
    ).toHaveValue('pika')
    expect(getPokemonListPage).not.toHaveBeenCalled()
  })

  it('shows an empty result and restores the default list when its search chip is removed', () => {
    renderCatalog(pokemonPage(1, 'bulbasaur', null), '/?search=missing', [
      { id: 1, name: 'bulbasaur', artworkUrl: '/1.png' }
    ])

    expect(
      screen.getByText('No Pokémon match these filters.')
    ).toBeInTheDocument()
    fireEvent.click(
      screen.getByRole('button', { name: /Remove Search.*missing/ })
    )
    expect(screen.getByRole('link', { name: /bulbasaur/i })).toBeInTheDocument()
  })

  it('clears a committed search immediately from the text-field action', () => {
    renderCatalog(pokemonPage(1, 'bulbasaur', null), '/?search=pika', [
      { id: 1, name: 'bulbasaur', artworkUrl: '/1.png' },
      { id: 25, name: 'pikachu', artworkUrl: '/25.png' }
    ])

    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(
      screen.getByRole('searchbox', { name: 'Search the collection' })
    ).toHaveValue('')
    expect(screen.getByRole('link', { name: /bulbasaur/i })).toBeInTheDocument()
  })

  it('reveals filtered results in accessible batches of 24', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    const catalog = Array.from({ length: 26 }, (_, index) => ({
      id: index + 1,
      name: `pokemon-${index + 1}`,
      artworkUrl: `/artwork/${index + 1}.png`
    }))
    renderCatalog(undefined, '/?sort=name-asc', catalog)

    expect(screen.getAllByRole('link', { name: /pokemon \d+/i })).toHaveLength(
      24
    )
    fireEvent.click(screen.getByRole('button', { name: 'Load more' }))
    expect(screen.getAllByRole('link', { name: /pokemon \d+/i })).toHaveLength(
      26
    )
  })

  it('retries a failed filtered catalog without dropping the active URL search', async () => {
    vi.mocked(getPokemonCatalog)
      .mockRejectedValueOnce(new Error('temporary outage'))
      .mockResolvedValueOnce([
        { id: 25, name: 'pikachu', artworkUrl: '/25.png' }
      ])
    renderCatalog(pokemonPage(1, 'bulbasaur', null), '/?search=pika')

    expect(await screen.findByRole('alert')).toHaveTextContent(
      "We couldn't apply these filters."
    )
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(
      await screen.findByRole('link', { name: /pikachu/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('searchbox', { name: 'Search the collection' })
    ).toHaveValue('pika')
  })

  it('combines type, generation, and ability filters and clears them', () => {
    const catalog = [
      { id: 1, name: 'bulbasaur', artworkUrl: '/1.png' },
      { id: 4, name: 'charmander', artworkUrl: '/4.png' },
      { id: 25, name: 'pikachu', artworkUrl: '/25.png' }
    ]
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } }
    })
    client.setQueryData(pokemonCatalogOptions().queryKey, catalog)
    client.setQueryData(pokemonTypeMembersOptions('fire').queryKey, [4])
    client.setQueryData(
      pokemonGenerationMembersOptions('1').queryKey,
      [1, 4, 25]
    )
    client.setQueryData(pokemonAbilityMembersOptions('blaze').queryKey, [4])
    client.setQueryData(pokemonInfiniteListOptions(24).queryKey, {
      pages: [pokemonPage(1, 'bulbasaur', null)],
      pageParams: [0]
    })

    render(
      <QueryClientProvider client={client}>
        <I18nProvider>
          <MemoryRouter
            initialEntries={['/?type=fire&generation=1&ability=blaze']}
          >
            <CatalogSection />
          </MemoryRouter>
        </I18nProvider>
      </QueryClientProvider>
    )

    expect(
      screen.getByRole('link', { name: /charmander/i })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: /pikachu/i })
    ).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }))
    expect(screen.getByRole('link', { name: /bulbasaur/i })).toBeInTheDocument()
  })
})
