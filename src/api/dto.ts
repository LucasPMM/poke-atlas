import { z } from 'zod'

export const namedResourceSchema = z.object({
  name: z.string(),
  url: z.string()
})

export const resourceListSchema = z.object({
  count: z.number().int().nonnegative(),
  next: z.string().nullable(),
  results: z.array(namedResourceSchema)
})

export const pokemonMembersSchema = z.object({
  pokemon: z.array(z.object({ pokemon: namedResourceSchema }))
})

export const generationMembersSchema = z.object({
  pokemon_species: z.array(namedResourceSchema)
})

export const pokemonSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  species: namedResourceSchema,
  height: z.number().nonnegative(),
  weight: z.number().nonnegative(),
  types: z.array(z.object({ slot: z.number(), type: namedResourceSchema })),
  abilities: z.array(
    z.object({
      is_hidden: z.boolean(),
      slot: z.number(),
      ability: namedResourceSchema
    })
  ),
  stats: z.array(
    z.object({ base_stat: z.number(), stat: namedResourceSchema })
  ),
  moves: z
    .array(
      z.object({
        move: namedResourceSchema,
        version_group_details: z.array(
          z.object({
            level_learned_at: z.number().int().nonnegative(),
            move_learn_method: namedResourceSchema,
            version_group: namedResourceSchema
          })
        )
      })
    )
    .optional(),
  sprites: z.object({
    front_default: z.string().nullable().optional(),
    other: z
      .object({
        'official-artwork': z
          .object({ front_default: z.string().nullable().optional() })
          .optional()
      })
      .optional()
  })
})

export const speciesSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  generation: namedResourceSchema,
  evolution_chain: z.object({ url: z.string() }).nullable(),
  names: z.array(z.object({ name: z.string(), language: namedResourceSchema })),
  genera: z.array(
    z.object({ genus: z.string(), language: namedResourceSchema })
  ),
  flavor_text_entries: z.array(
    z.object({ flavor_text: z.string(), language: namedResourceSchema })
  ),
  gender_rate: z.number().int().optional(),
  egg_groups: z.array(namedResourceSchema).optional(),
  capture_rate: z.number().int().nonnegative().optional(),
  growth_rate: namedResourceSchema.nullable().optional(),
  varieties: z
    .array(z.object({ is_default: z.boolean(), pokemon: namedResourceSchema }))
    .optional()
})

export const typeSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  damage_relations: z.object({
    double_damage_from: z.array(namedResourceSchema),
    half_damage_from: z.array(namedResourceSchema),
    no_damage_from: z.array(namedResourceSchema)
  })
})

export type ChainLinkDto = {
  species: z.infer<typeof namedResourceSchema>
  evolution_details: Array<{
    min_level?: number | null
    trigger?: z.infer<typeof namedResourceSchema> | null
    item?: z.infer<typeof namedResourceSchema> | null
    held_item?: z.infer<typeof namedResourceSchema> | null
    min_happiness?: number | null
    min_affection?: number | null
    min_beauty?: number | null
    time_of_day?: string
    known_move?: z.infer<typeof namedResourceSchema> | null
    known_move_type?: z.infer<typeof namedResourceSchema> | null
    location?: z.infer<typeof namedResourceSchema> | null
    gender?: number | null
    near_special_rock?: boolean
    needs_overworld_rain?: boolean
    needs_multiplayer?: boolean
    party_species?: z.infer<typeof namedResourceSchema> | null
    party_type?: z.infer<typeof namedResourceSchema> | null
    relative_physical_stats?: number | null
    trade_species?: z.infer<typeof namedResourceSchema> | null
    turn_upside_down?: boolean
    region?: z.infer<typeof namedResourceSchema> | null
    base_form?: z.infer<typeof namedResourceSchema> | null
    evolved_form?: z.infer<typeof namedResourceSchema> | null
    used_move?: z.infer<typeof namedResourceSchema> | null
    min_move_count?: number | null
    min_steps?: number | null
    min_damage_taken?: number | null
  }> | null
  evolves_to: Array<ChainLinkDto>
}

const chainLinkSchema: z.ZodType<ChainLinkDto> = z.lazy(() =>
  z.object({
    species: namedResourceSchema,
    evolution_details: z
      .array(
        z.object({
          min_level: z.number().nullable().optional(),
          trigger: namedResourceSchema.nullable().optional(),
          item: namedResourceSchema.nullable().optional(),
          held_item: namedResourceSchema.nullable().optional(),
          min_happiness: z.number().nullable().optional(),
          min_affection: z.number().nullable().optional(),
          min_beauty: z.number().nullable().optional(),
          time_of_day: z.string().optional(),
          known_move: namedResourceSchema.nullable().optional(),
          known_move_type: namedResourceSchema.nullable().optional(),
          location: namedResourceSchema.nullable().optional(),
          gender: z.number().nullable().optional(),
          near_special_rock: z.boolean().optional(),
          needs_overworld_rain: z.boolean().optional(),
          needs_multiplayer: z.boolean().optional(),
          party_species: namedResourceSchema.nullable().optional(),
          party_type: namedResourceSchema.nullable().optional(),
          relative_physical_stats: z.number().nullable().optional(),
          trade_species: namedResourceSchema.nullable().optional(),
          turn_upside_down: z.boolean().optional(),
          region: namedResourceSchema.nullable().optional(),
          base_form: namedResourceSchema.nullable().optional(),
          evolved_form: namedResourceSchema.nullable().optional(),
          used_move: namedResourceSchema.nullable().optional(),
          min_move_count: z.number().nullable().optional(),
          min_steps: z.number().nullable().optional(),
          min_damage_taken: z.number().nullable().optional()
        })
      )
      .nullable(),
    evolves_to: z.array(chainLinkSchema)
  })
)

export const evolutionChainSchema = z.object({
  id: z.number().int().positive(),
  chain: chainLinkSchema
})

export type ResourceListDto = z.infer<typeof resourceListSchema>
export type PokemonDto = z.infer<typeof pokemonSchema>
export type PokemonSpeciesDto = z.infer<typeof speciesSchema>
export type PokemonTypeDto = z.infer<typeof typeSchema>
export type EvolutionChainDto = z.infer<typeof evolutionChainSchema>
