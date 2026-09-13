import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '../errors'
import {
  getPokemon,
  getPokemonAbilityMembers,
  getPokemonCatalog,
  getPokemonGenerationMembers,
  getPokemonListPage,
  getPokemonSpecies,
  getPokemonTypeMembers
} from './pokemon.api'

afterEach(() => vi.unstubAllGlobals())

describe('PokéAPI client', () => {
  it('requests and normalizes a Pokémon without leaking DTO fields', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          id: 25,
          name: 'pikachu',
          species: {
            name: 'pikachu',
            url: 'https://pokeapi.co/api/v2/pokemon-species/25/'
          },
          height: 4,
          weight: 60,
          types: [
            {
              slot: 1,
              type: {
                name: 'electric',
                url: 'https://pokeapi.co/api/v2/type/13/'
              }
            }
          ],
          abilities: [],
          stats: [],
          sprites: {
            front_default: null,
            other: { 'official-artwork': { front_default: null } }
          }
        }),
        { status: 200 }
      )
    )
    vi.stubGlobal('fetch', fetchMock)

    const pokemon = await getPokemon('PIKACHU')

    expect(fetchMock.mock.calls[0]?.[0].toString()).toBe(
      'https://pokeapi.co/api/v2/pokemon/pikachu'
    )
    expect(pokemon).toMatchObject({
      id: 25,
      speciesId: 25,
      name: 'pikachu',
      artworkUrl: null
    })
    expect(pokemon).not.toHaveProperty('sprites')
  })

  it('classifies missing resources and invalid payloads', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(new Response(null, { status: 404 }))
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ name: 'pikachu' }), { status: 200 })
        )
    )

    await expect(getPokemon('missing')).rejects.toMatchObject({
      type: 'not-found',
      status: 404
    })
    await expect(getPokemon('pikachu')).rejects.toMatchObject({
      type: 'invalid-data'
    })
  })

  it('classifies transport failures as network errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')))
    await expect(getPokemon('pikachu')).rejects.toMatchObject({
      type: 'network'
    })
  })

  it('validates pagination before making a request', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(getPokemonListPage(-1, 30)).rejects.toBeInstanceOf(ApiError)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rejects a missing species identifier before a network request', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      getPokemonSpecies(undefined as unknown as number)
    ).rejects.toBeInstanceOf(ApiError)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('collects every catalog page for partial search beyond the first page', async () => {
    const resource = (id: number, name: string) => ({
      name,
      url: `https://pokeapi.co/api/v2/pokemon/${id}/`
    })
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            count: 2,
            next: 'https://pokeapi.co/api/v2/pokemon?limit=500&offset=500',
            results: [resource(1, 'bulbasaur')]
          }),
          { status: 200 }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            count: 2,
            next: null,
            results: [resource(25, 'pikachu')]
          }),
          { status: 200 }
        )
      )
    vi.stubGlobal('fetch', fetchMock)

    expect((await getPokemonCatalog()).map(({ name }) => name)).toEqual([
      'bulbasaur',
      'pikachu'
    ])
    expect(fetchMock.mock.calls[1]?.[0].toString()).toContain('offset=500')
  })

  it('normalizes type, generation, and ability memberships', async () => {
    const pokemon = {
      name: 'pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon/25/'
    }
    const species = {
      name: 'pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon-species/25/'
    }
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ pokemon: [{ pokemon }] }), {
            status: 200
          })
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ pokemon_species: [species] }), {
            status: 200
          })
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ pokemon: [{ pokemon }] }), {
            status: 200
          })
        )
    )

    expect(await getPokemonTypeMembers('electric')).toEqual([25])
    expect(await getPokemonGenerationMembers('1')).toEqual([25])
    expect(await getPokemonAbilityMembers('static')).toEqual([25])
  })
})
