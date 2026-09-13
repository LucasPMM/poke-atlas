import { useQueries, useQuery } from '@tanstack/react-query'
import {
  evolutionChainOptions,
  pokemonSpeciesOptions,
  pokemonTypeOptions
} from '@/api/pokemon'
import { Button } from '@/components/ui/Button'
import { useI18n } from '@/lib/i18n'
import type { Pokemon } from '@/models/pokemon'
import {
  getPokemonTypeStyle,
  resolvePokemonTypeTheme
} from '../../themes/pokemon-type-theme'
import { EvolutionLine } from '../EvolutionLine'
import { PokemonBiology } from '../PokemonBiology'
import { PokemonHero } from '../PokemonHero'
import { PokemonMoves } from '../PokemonMoves'
import { PokemonProfile } from '../PokemonProfile'
import { PokemonStats } from '../PokemonStats'
import { PokemonVarieties } from '../PokemonVarieties'
import { TypeMatchups } from '../TypeMatchups'

const detailSections = [
  { id: 'profile', label: 'details.profile' },
  { id: 'stats', label: 'details.stats' },
  { id: 'matchups', label: 'details.matchups' },
  { id: 'evolution', label: 'details.evolution' },
  { id: 'biology', label: 'details.biology' },
  { id: 'moves', label: 'details.moves' },
  { id: 'varieties', label: 'details.varieties' }
] as const

export const PokemonDetailsContent = ({
  pokemon,
  backTo
}: {
  pokemon: Pokemon
  backTo: string
}) => {
  const { t } = useI18n()
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
      <nav
        aria-label={t('details.sections')}
        className="sticky top-[var(--header-height)] z-30 mb-5 border-y border-line bg-canvas/95 backdrop-blur-sm"
      >
        <div className="page-container flex gap-1 overflow-x-auto py-2">
          {detailSections.map(({ id, label }) => (
            <Button
              className="shrink-0 whitespace-nowrap px-3 text-sm"
              key={id}
              onClick={() =>
                document
                  .getElementById(id)
                  ?.scrollIntoView({ behavior: 'auto' })
              }
              variant="ghost"
            >
              {t(label)}
            </Button>
          ))}
        </div>
      </nav>
      <div className="page-container grid gap-5 lg:grid-cols-2">
        <div className="detail-section" id="profile">
          <PokemonProfile
            isError={speciesQuery.isError}
            isPending={speciesQuery.isPending}
            pokemon={pokemon}
            retry={() => void speciesQuery.refetch()}
            species={speciesQuery.data}
          />
        </div>
        <div className="detail-section" id="stats">
          <PokemonStats stats={pokemon.stats} />
        </div>
        <div className="detail-section lg:col-span-2" id="matchups">
          <TypeMatchups
            isError={isTypeError}
            isPending={isTypePending && !isTypeError}
            retry={retryTypes}
            types={types}
          />
        </div>
        <div className="detail-section lg:col-span-2">
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
        <div className="detail-section">
          <PokemonBiology
            isError={speciesQuery.isError}
            isPending={speciesQuery.isPending}
            retry={() => void speciesQuery.refetch()}
            species={speciesQuery.data}
          />
        </div>
        <div className="detail-section">
          <PokemonMoves pokemon={pokemon} />
        </div>
        <div className="detail-section lg:col-span-2">
          <PokemonVarieties
            backTo={backTo}
            currentPokemonId={pokemon.id}
            isError={speciesQuery.isError}
            isPending={speciesQuery.isPending}
            retry={() => void speciesQuery.refetch()}
            species={speciesQuery.data}
          />
        </div>
      </div>
    </div>
  )
}
