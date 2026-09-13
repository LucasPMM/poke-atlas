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

export const pokemonSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
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
  names: z.array(z.object({ name: z.string(), language: namedResourceSchema }))
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
    min_level: number | null
    trigger: z.infer<typeof namedResourceSchema> | null
  }> | null
  evolves_to: Array<ChainLinkDto>
}

const chainLinkSchema: z.ZodType<ChainLinkDto> = z.lazy(() =>
  z.object({
    species: namedResourceSchema,
    evolution_details: z
      .array(
        z.object({
          min_level: z.number().nullable(),
          trigger: namedResourceSchema.nullable()
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
