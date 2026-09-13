import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { Link, MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  evolutionChainOptions,
  pokemonDetailsOptions,
  pokemonSpeciesOptions,
  pokemonTypeOptions
} from '@/api/pokemon'
import { I18nProvider } from '@/lib/i18n'
import type {
  EvolutionChain,
  Pokemon,
  PokemonSpecies,
  PokemonType
} from '@/models/pokemon'
import { PokemonDetailsPage } from './PokemonDetailsPage'

const pokemon = (id: number, name: string): Pokemon => ({
  id,
  speciesId: id,
  name,
  artworkUrl: null,
  spriteUrl: null,
  types: [],
  abilities: [],
  stats: [],
  moves: [],
  moveVersion: null,
  heightMeters: 1,
  weightKilograms: 10
})

const species = (id: number, name: string): PokemonSpecies => ({
  id,
  name,
  generation: 1,
  evolutionChainId: null,
  names: { en: name },
  genera: { en: 'Mouse Pokémon' },
  flavorTexts: { en: 'It stores electricity in its cheeks.' },
  genderRate: 4,
  eggGroups: ['ground'],
  captureRate: 190,
  growthRate: 'medium',
  varieties: [{ id, name, isDefault: true }]
})

const createClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } })

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('Pokémon detail navigation', () => {
  it('scrolls to the top on entry and when the Pokémon ID changes', () => {
    const scrollTo = vi.fn()
    vi.stubGlobal('scrollTo', scrollTo)
    const client = createClient()
    client.setQueryData(
      pokemonDetailsOptions('1').queryKey,
      pokemon(1, 'bulbasaur')
    )
    client.setQueryData(
      pokemonDetailsOptions('2').queryKey,
      pokemon(2, 'ivysaur')
    )
    client.setQueryData(
      pokemonSpeciesOptions(1).queryKey,
      species(1, 'bulbasaur')
    )
    client.setQueryData(
      pokemonSpeciesOptions(2).queryKey,
      species(2, 'ivysaur')
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

  it('renders the full profile, combined type relations, stats, and branched evolution links', () => {
    vi.stubGlobal('scrollTo', vi.fn())
    const client = createClient()
    const pikachu: Pokemon = {
      ...pokemon(25, 'pikachu'),
      types: ['electric'],
      abilities: [
        { name: 'static', isHidden: false },
        { name: 'lightning-rod', isHidden: true }
      ],
      stats: [{ name: 'hp', value: 35 }],
      moves: [{ name: 'thunderbolt', level: 26 }],
      moveVersion: 'scarlet-violet',
      heightMeters: 0.4,
      weightKilograms: 6
    }
    const pikachuSpecies = {
      ...species(25, 'Pikachu'),
      evolutionChainId: 10,
      varieties: [
        { id: 25, name: 'pikachu', isDefault: true },
        { id: 10080, name: 'pikachu-rock-star', isDefault: false }
      ]
    }
    const electric: PokemonType = {
      id: 13,
      name: 'electric',
      doubleDamageFrom: ['ground'],
      halfDamageFrom: ['electric', 'flying', 'steel'],
      noDamageFrom: []
    }
    const chain: EvolutionChain = {
      id: 10,
      root: {
        id: 172,
        name: 'pichu',
        artworkUrl: '/172.png',
        methods: [],
        evolvesTo: [
          {
            id: 25,
            name: 'pikachu',
            artworkUrl: '/25.png',
            methods: [
              {
                trigger: 'level-up',
                requirements: [{ kind: 'level', value: 16 }]
              }
            ],
            evolvesTo: [
              {
                id: 26,
                name: 'raichu',
                artworkUrl: '/26.png',
                methods: [{ trigger: 'use-item', requirements: [] }],
                evolvesTo: []
              }
            ]
          }
        ]
      }
    }
    client.setQueryData(pokemonDetailsOptions('25').queryKey, pikachu)
    client.setQueryData(pokemonSpeciesOptions(25).queryKey, pikachuSpecies)
    client.setQueryData(pokemonTypeOptions('electric').queryKey, electric)
    client.setQueryData(evolutionChainOptions(10).queryKey, chain)

    render(
      <QueryClientProvider client={client}>
        <I18nProvider>
          <MemoryRouter
            initialEntries={[
              {
                pathname: '/pokemon/25',
                state: { from: '/?search=pika' }
              }
            ]}
          >
            <Routes>
              <Route element={<PokemonDetailsPage />} path="/pokemon/:id" />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      </QueryClientProvider>
    )

    expect(screen.getByRole('heading', { name: 'Pikachu' })).toBeInTheDocument()
    expect(screen.getByText('Mouse Pokémon')).toBeInTheDocument()
    expect(screen.getByText('Generation 1')).toBeInTheDocument()
    expect(screen.getByText(/lightning rod · Hidden/)).toBeInTheDocument()
    expect(screen.getByRole('meter', { name: 'HP' })).toHaveAttribute(
      'value',
      '35'
    )
    expect(screen.getByText('Ground · 2×')).toBeInTheDocument()
    expect(screen.getByText('Level 16')).toBeInTheDocument()
    expect(screen.getByText('Female 50% · Male 50%')).toBeInTheDocument()
    expect(screen.getByText('190 / 255')).toBeInTheDocument()
    expect(screen.getByText('Field')).toBeInTheDocument()
    expect(screen.getByText(/thunderbolt/i)).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /pikachu rock star/i })
    ).toHaveAttribute('href', '/pokemon/10080')
    expect(screen.getByRole('link', { name: /raichu/i })).toHaveAttribute(
      'href',
      '/pokemon/26'
    )
    expect(
      screen.getByRole('link', { name: 'Back to collection' })
    ).toHaveAttribute('href', '/?search=pika')
    const profile = document.getElementById('profile')
    const scrollIntoView = vi.fn()
    Object.defineProperty(profile, 'scrollIntoView', { value: scrollIntoView })
    fireEvent.click(screen.getByRole('button', { name: 'Profile' }))
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto' })
  })

  it('shows a loading shell and a recoverable not-found state', async () => {
    vi.stubGlobal('scrollTo', vi.fn())
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 404 }))
    vi.stubGlobal('fetch', fetchMock)

    render(
      <QueryClientProvider client={createClient()}>
        <I18nProvider>
          <MemoryRouter initialEntries={['/pokemon/999999']}>
            <Routes>
              <Route element={<PokemonDetailsPage />} path="/pokemon/:id" />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      </QueryClientProvider>
    )

    expect(screen.getByRole('status')).toHaveTextContent('Loading Pokémon')
    expect(
      await screen.findByRole('heading', {
        name: 'This Pokémon was not found.'
      })
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
  })

  it('keeps an alternate form name while loading the shared species record', () => {
    vi.stubGlobal('scrollTo', vi.fn())
    const client = createClient()
    client.setQueryData(pokemonDetailsOptions('10080').queryKey, {
      ...pokemon(10080, 'pikachu-rock-star'),
      speciesId: 25
    })
    client.setQueryData(
      pokemonSpeciesOptions(25).queryKey,
      species(25, 'Pikachu')
    )

    render(
      <QueryClientProvider client={client}>
        <I18nProvider>
          <MemoryRouter initialEntries={['/pokemon/10080']}>
            <Routes>
              <Route element={<PokemonDetailsPage />} path="/pokemon/:id" />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      </QueryClientProvider>
    )

    expect(
      screen.getByRole('heading', { name: 'pikachu rock star' })
    ).toBeInTheDocument()
    expect(screen.getByText('Mouse Pokémon')).toBeInTheDocument()
  })

  it('labels a species with no gender correctly', () => {
    vi.stubGlobal('scrollTo', vi.fn())
    const client = createClient()
    client.setQueryData(
      pokemonDetailsOptions('132').queryKey,
      pokemon(132, 'ditto')
    )
    client.setQueryData(pokemonSpeciesOptions(132).queryKey, {
      ...species(132, 'Ditto'),
      genderRate: -1
    })

    render(
      <QueryClientProvider client={client}>
        <I18nProvider>
          <MemoryRouter initialEntries={['/pokemon/132']}>
            <Routes>
              <Route element={<PokemonDetailsPage />} path="/pokemon/:id" />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      </QueryClientProvider>
    )

    expect(screen.getByText('Genderless')).toBeInTheDocument()
  })

  it('keeps the profile visible when type data fails and offers a section retry', async () => {
    vi.stubGlobal('scrollTo', vi.fn())
    const client = createClient()
    const electric: PokemonType = {
      id: 13,
      name: 'electric',
      doubleDamageFrom: ['ground'],
      halfDamageFrom: [],
      noDamageFrom: []
    }
    client.setQueryData(pokemonDetailsOptions('25').queryKey, {
      ...pokemon(25, 'pikachu'),
      types: ['electric']
    })
    client.setQueryData(
      pokemonSpeciesOptions(25).queryKey,
      species(25, 'Pikachu')
    )
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: electric.id,
            name: electric.name,
            damage_relations: {
              double_damage_from: [
                {
                  name: 'ground',
                  url: 'https://pokeapi.co/api/v2/type/5/'
                }
              ],
              half_damage_from: [],
              no_damage_from: []
            }
          }),
          { status: 200 }
        )
      )
    vi.stubGlobal('fetch', fetchMock)

    render(
      <QueryClientProvider client={client}>
        <I18nProvider>
          <MemoryRouter initialEntries={['/pokemon/25']}>
            <Routes>
              <Route element={<PokemonDetailsPage />} path="/pokemon/:id" />
            </Routes>
          </MemoryRouter>
        </I18nProvider>
      </QueryClientProvider>
    )

    expect(screen.getByRole('heading', { name: 'Pikachu' })).toBeInTheDocument()
    expect(await screen.findByRole('alert')).toHaveTextContent(
      "This section couldn't be loaded."
    )
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByText('Ground · 2×')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
