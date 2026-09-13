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
  species: named('pikachu', 25),
  height: 4,
  weight: 60,
  types: [{ slot: 1, type: named('electric', 13) }],
  abilities: [
    { slot: 3, is_hidden: true, ability: named('lightning-rod', 31) },
    { slot: 1, is_hidden: false, ability: named('static', 9) }
  ],
  stats: [{ base_stat: 35, stat: named('hp', 1) }],
  moves: [
    {
      move: named('thunderbolt', 85),
      version_group_details: [
        {
          level_learned_at: 26,
          move_learn_method: named('level-up', 1),
          version_group: named('scarlet-violet', 25)
        },
        {
          level_learned_at: 21,
          move_learn_method: named('level-up', 1),
          version_group: named('sword-shield', 20)
        },
        {
          level_learned_at: 30,
          move_learn_method: named('level-up', 1),
          version_group: named('blue-japan', 46)
        }
      ]
    },
    {
      move: named('quick-attack', 98),
      version_group_details: [
        {
          level_learned_at: 11,
          move_learn_method: named('level-up', 1),
          version_group: named('scarlet-violet', 25)
        }
      ]
    },
    {
      move: named('surf', 57),
      version_group_details: [
        {
          level_learned_at: 0,
          move_learn_method: named('machine', 4),
          version_group: named('scarlet-violet', 25)
        }
      ]
    }
  ],
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
      speciesId: 25,
      name: 'pikachu',
      artworkUrl: 'https://example.com/art.png',
      types: ['electric'],
      heightMeters: 0.4,
      weightKilograms: 6,
      stats: [{ name: 'hp', value: 35 }]
    })
    expect(pokemon.moves).toEqual([
      { name: 'quick-attack', level: 11 },
      { name: 'thunderbolt', level: 26 }
    ])
    expect(pokemon.moveVersion).toBe('scarlet-violet')
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

  it('keeps a variety linked to its base species', () => {
    expect(
      mapPokemon({
        ...pokemonFixture,
        id: 10080,
        name: 'pikachu-rock-star'
      })
    ).toMatchObject({ id: 10080, speciesId: 25, name: 'pikachu-rock-star' })
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
        {
          id: 1,
          name: 'bulbasaur',
          artworkUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png'
        },
        {
          id: 2,
          name: 'ivysaur',
          artworkUrl:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png'
        }
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
      ],
      genera: [{ genus: 'Mouse Pokémon', language: named('en', 9) }],
      flavor_text_entries: [
        {
          flavor_text: 'It stores\n electricity\f in its cheeks.',
          language: named('en', 9)
        }
      ],
      gender_rate: 4,
      egg_groups: [named('field', 5)],
      capture_rate: 190,
      growth_rate: named('medium', 2),
      varieties: [
        { is_default: true, pokemon: named('pikachu', 25) },
        { is_default: false, pokemon: named('pikachu-rock-star', 10080) }
      ]
    }

    expect(mapPokemonSpecies(species)).toMatchObject({
      generation: 1,
      evolutionChainId: 10,
      names: { en: 'Pikachu', fr: 'Pikachu' },
      genera: { en: 'Mouse Pokémon' },
      flavorTexts: { en: 'It stores electricity in its cheeks.' },
      genderRate: 4,
      eggGroups: ['field'],
      captureRate: 190,
      growthRate: 'medium',
      varieties: [
        { id: 25, name: 'pikachu', isDefault: true },
        { id: 10080, name: 'pikachu-rock-star', isDefault: false }
      ]
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
              {
                min_level: null,
                trigger: named('use-item', 3),
                item: named('water-stone', 84)
              }
            ],
            evolves_to: []
          },
          {
            species: named('jolteon', 135),
            evolution_details: [
              {
                min_level: null,
                trigger: named('use-item', 3),
                item: named('thunder-stone', 83)
              }
            ],
            evolves_to: []
          },
          {
            species: named('sylveon', 700),
            evolution_details: [
              {
                min_level: null,
                trigger: named('level-up', 1),
                min_affection: 2,
                known_move_type: named('fairy', 18)
              }
            ],
            evolves_to: []
          }
        ]
      }
    }

    expect(
      mapEvolutionChain(chain).root.evolvesTo.map(({ name }) => name)
    ).toEqual(['vaporeon', 'jolteon', 'sylveon'])
    expect(mapEvolutionChain(chain).root.evolvesTo[0]?.methods).toEqual([
      {
        trigger: 'use-item',
        requirements: [{ kind: 'item', value: 'water-stone' }]
      }
    ])
    expect(mapEvolutionChain(chain).root.evolvesTo[2]?.methods).toEqual([
      {
        trigger: 'level-up',
        requirements: [
          { kind: 'affection', value: 2 },
          { kind: 'knownMoveType', value: 'fairy' }
        ]
      }
    ])
  })
})
