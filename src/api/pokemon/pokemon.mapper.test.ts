import { describe, expect, it } from 'vitest'
import type {
  EvolutionChainDto,
  PokemonDto,
  PokemonSpeciesDto,
  PokemonTypeDto,
  ResourceListDto
} from '../dto'
import {
  mapEvolutionChain,
  mapPokemon,
  mapPokemonList,
  mapPokemonSpecies,
  mapPokemonType
} from './pokemon.mapper'

const named = (name: string, id: number) => ({
  name,
  url: `https://pokeapi.co/api/v2/pokemon/${id}/`
})

const pokemonFixture: PokemonDto = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  types: [{ slot: 1, type: named('electric', 13) }],
  abilities: [
    { slot: 3, is_hidden: true, ability: named('lightning-rod', 31) },
    { slot: 1, is_hidden: false, ability: named('static', 9) }
  ],
  stats: [{ base_stat: 35, stat: named('hp', 1) }],
  sprites: {
    front_default: 'https://example.com/sprite.png',
    other: {
      'official-artwork': { front_default: 'https://example.com/art.png' }
    }
  }
}

describe('Pokémon response mapping', () => {
  it('normalizes artwork, abilities, stats, and units', () => {
    const pokemon = mapPokemon(pokemonFixture)

    expect(pokemon).toMatchObject({
      id: 25,
      name: 'pikachu',
      artworkUrl: 'https://example.com/art.png',
      types: ['electric'],
      heightMeters: 0.4,
      weightKilograms: 6,
      stats: [{ name: 'hp', value: 35 }]
    })
    expect(pokemon.abilities).toEqual([
      { name: 'static', isHidden: false },
      { name: 'lightning-rod', isHidden: true }
    ])
  })

  it('uses a sprite when official artwork is missing', () => {
    expect(
      mapPokemon({
        ...pokemonFixture,
        sprites: { front_default: 'sprite.png' }
      }).artworkUrl
    ).toBe('sprite.png')
    expect(
      mapPokemon({ ...pokemonFixture, sprites: { front_default: null } })
        .artworkUrl
    ).toBeNull()
  })

  it('normalizes page navigation and resource IDs', () => {
    const page: ResourceListDto = {
      count: 2,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=30&limit=30',
      results: [named('bulbasaur', 1), named('ivysaur', 2)]
    }

    expect(mapPokemonList(page)).toEqual({
      count: 2,
      nextOffset: 30,
      results: [
        { id: 1, name: 'bulbasaur' },
        { id: 2, name: 'ivysaur' }
      ]
    })
  })

  it('normalizes species names and evolution chain reference', () => {
    const species: PokemonSpeciesDto = {
      id: 25,
      name: 'pikachu',
      generation: named('generation-i', 1),
      evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/10/' },
      names: [
        { name: 'Pikachu', language: named('en', 9) },
        { name: 'Pikachu', language: named('fr', 5) }
      ]
    }

    expect(mapPokemonSpecies(species)).toMatchObject({
      generation: 'generation-i',
      evolutionChainId: 10,
      names: { en: 'Pikachu', fr: 'Pikachu' }
    })
  })

  it('normalizes type damage relations', () => {
    const type: PokemonTypeDto = {
      id: 13,
      name: 'electric',
      damage_relations: {
        double_damage_from: [named('ground', 5)],
        half_damage_from: [named('electric', 13)],
        no_damage_from: []
      }
    }

    expect(mapPokemonType(type)).toMatchObject({
      doubleDamageFrom: ['ground'],
      halfDamageFrom: ['electric'],
      noDamageFrom: []
    })
  })

  it('preserves branches in evolution chains', () => {
    const chain: EvolutionChainDto = {
      id: 67,
      chain: {
        species: named('eevee', 133),
        evolution_details: null,
        evolves_to: [
          {
            species: named('vaporeon', 134),
            evolution_details: [
              { min_level: null, trigger: named('use-item', 3) }
            ],
            evolves_to: []
          },
          {
            species: named('jolteon', 135),
            evolution_details: [
              { min_level: null, trigger: named('use-item', 3) }
            ],
            evolves_to: []
          }
        ]
      }
    }

    expect(
      mapEvolutionChain(chain).root.evolvesTo.map(({ name }) => name)
    ).toEqual(['vaporeon', 'jolteon'])
  })
})
