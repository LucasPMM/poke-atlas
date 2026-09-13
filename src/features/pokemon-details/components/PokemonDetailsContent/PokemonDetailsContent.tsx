import { useQueries, useQuery } from '@tanstack/react-query'
import {
  evolutionChainOptions,
  pokemonSpeciesOptions,
  pokemonTypeOptions
} from '@/api/pokemon'
import type { Pokemon } from '@/models/pokemon'
import {
  getPokemonTypeStyle,
  resolvePokemonTypeTheme
} from '../../themes/pokemon-type-theme'
import { EvolutionLine } from '../EvolutionLine'
import { PokemonHero } from '../PokemonHero'
import { PokemonProfile } from '../PokemonProfile'
import { PokemonStats } from '../PokemonStats'
import { TypeMatchups } from '../TypeMatchups'

export const PokemonDetailsContent = ({
  pokemon,
  backTo
}: {
  pokemon: Pokemon
  backTo: string
}) => {
  const speciesQuery = useQuery(pokemonSpeciesOptions(pokemon.speciesId))
  const typeQueries = useQueries({
    queries: pokemon.types.map((type) => pokemonTypeOptions(type))
  })
  const chainId = speciesQuery.data?.evolutionChainId ?? null
  const evolutionQuery = useQuery({
    ...evolutionChainOptions(chainId ?? 0),
    enabled: chainId !== null
  })
  const theme = resolvePokemonTypeTheme(pokemon.types)
  const isTypePending = typeQueries.some((query) => query.isPending)
  const isTypeError = typeQueries.some((query) => query.isError)
  const types = typeQueries.flatMap((query) => (query.data ? [query.data] : []))
  const retryTypes = () => {
    typeQueries
      .filter((query) => query.isError)
      .forEach((query) => {
        void query.refetch()
      })
  }
  const retryEvolution = () => {
    if (speciesQuery.isError) {
      void speciesQuery.refetch()
    }

    if (evolutionQuery.isError) {
      void evolutionQuery.refetch()
    }
  }

  return (
    <div
      className="pokemon-detail min-h-[60vh] pb-16 md:pb-24"
      data-primary-type={theme.primary}
      data-secondary-type={theme.secondary ?? undefined}
      style={getPokemonTypeStyle(theme.primary)}
    >
      <PokemonHero
        backTo={backTo}
        pokemon={pokemon}
        species={speciesQuery.data}
      />
      <div className="page-container grid gap-5 lg:grid-cols-2">
        <PokemonProfile
          isError={speciesQuery.isError}
          isPending={speciesQuery.isPending}
          pokemon={pokemon}
          retry={() => void speciesQuery.refetch()}
          species={speciesQuery.data}
        />
        <PokemonStats stats={pokemon.stats} />
        <div className="lg:col-span-2">
          <TypeMatchups
            isError={isTypeError}
            isPending={isTypePending && !isTypeError}
            retry={retryTypes}
            types={types}
          />
        </div>
        <div className="lg:col-span-2">
          <EvolutionLine
            backTo={backTo}
            chain={evolutionQuery.data}
            currentSpeciesId={pokemon.speciesId}
            isError={speciesQuery.isError || evolutionQuery.isError}
            isPending={
              speciesQuery.isPending ||
              (chainId !== null && evolutionQuery.isPending)
            }
            retry={retryEvolution}
          />
        </div>
      </div>
    </div>
  )
}
