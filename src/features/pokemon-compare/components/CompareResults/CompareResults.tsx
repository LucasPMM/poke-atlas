import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { pokemonDetailsOptions } from '@/api/pokemon'
import { Button } from '@/components/ui/Button'
import { Image } from '@/components/ui/Image'
import { ShouldRender } from '@/components/ui/ShouldRender'
import { Skeleton } from '@/components/ui/Skeleton'
import { Text } from '@/components/ui/Text'
import {
  getPokemonTypeStyle,
  resolvePokemonTypeTheme
} from '@/features/pokemon-details/themes/pokemon-type-theme'
import { getPokemonStatLabel, getPokemonTypeLabel, useI18n } from '@/lib/i18n'
import type { Pokemon } from '@/models/pokemon'

type CompareResultsProps = { first: string; second: string }

const ComparePokemonCard = ({ pokemon }: { pokemon: Pokemon }) => {
  const { locale, t } = useI18n()
  const name = pokemon.name.replaceAll('-', ' ')
  const formatMeasurement = (value: number) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value)
  const total = pokemon.stats.reduce((sum, stat) => sum + stat.value, 0)

  return (
    <article
      className="pokemon-compare-card min-w-0 rounded-3xl border border-line bg-surface p-5 md:p-7"
      style={getPokemonTypeStyle(
        resolvePokemonTypeTheme(pokemon.types).primary
      )}
    >
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <div className="flex aspect-square w-36 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-surface-muted md:w-44">
          <Image
            alt={t('details.artworkAlt', { name })}
            className="h-full w-full object-contain p-3"
            fallbackLabel={t('details.artworkFallback')}
            src={pokemon.artworkUrl}
          />
        </div>
        <div className="min-w-0 text-center sm:text-left">
          <Text className="text-xs font-medium text-muted" variant="unstyled">
            #{String(pokemon.id).padStart(4, '0')}
          </Text>
          <Text
            as="h2"
            className="mt-1 break-words font-display text-2xl font-medium capitalize md:text-3xl"
            variant="unstyled"
          >
            {name}
          </Text>
          <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
            {pokemon.types.map((type) => (
              <Text
                className="pokemon-type-badge rounded-full px-3 py-1 text-xs font-medium"
                key={type}
                style={getPokemonTypeStyle(type)}
                variant="unstyled"
              >
                {getPokemonTypeLabel(type, t)}
              </Text>
            ))}
          </div>
          <Link
            className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-action underline-offset-4 hover:underline"
            to={`/pokemon/${pokemon.id}`}
          >
            {t('compare.viewDetails')}
          </Link>
        </div>
      </div>
      <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-line pt-5">
        <div>
          <Text as="dt" className="text-xs" variant="muted">
            {t('details.height')}
          </Text>
          <Text
            as="dd"
            className="mt-1 font-semibold tabular-nums"
            variant="unstyled"
          >
            {t('details.meters', {
              value: formatMeasurement(pokemon.heightMeters)
            })}
          </Text>
        </div>
        <div>
          <Text as="dt" className="text-xs" variant="muted">
            {t('details.weight')}
          </Text>
          <Text
            as="dd"
            className="mt-1 font-semibold tabular-nums"
            variant="unstyled"
          >
            {t('details.kilograms', {
              value: formatMeasurement(pokemon.weightKilograms)
            })}
          </Text>
        </div>
        <div>
          <Text as="dt" className="text-xs" variant="muted">
            {t('details.abilities')}
          </Text>
          <Text
            as="dd"
            className="mt-1 break-words text-sm font-medium capitalize"
            variant="unstyled"
          >
            {pokemon.abilities.length > 0
              ? pokemon.abilities
                  .map(({ name: ability }) => ability.replaceAll('-', ' '))
                  .join(', ')
              : t('details.none')}
          </Text>
        </div>
        <div>
          <Text as="dt" className="text-xs" variant="muted">
            {t('compare.total')}
          </Text>
          <Text
            as="dd"
            className="mt-1 font-semibold tabular-nums"
            variant="unstyled"
          >
            {new Intl.NumberFormat(locale).format(total)}
          </Text>
        </div>
      </dl>
    </article>
  )
}

const CompareStatRow = ({
  first,
  second,
  name
}: {
  first: Pokemon
  second: Pokemon
  name: string
}) => {
  const { locale, t } = useI18n()
  const label = getPokemonStatLabel(name, t)
  const firstValue = first.stats.find((stat) => stat.name === name)?.value ?? 0
  const secondValue =
    second.stats.find((stat) => stat.name === name)?.value ?? 0
  const formatNumber = (value: number) =>
    new Intl.NumberFormat(locale).format(value)
  const maximum = Math.max(255, firstValue, secondValue)

  return (
    <li className="grid grid-cols-[minmax(0,1fr)_minmax(5rem,8rem)_minmax(0,1fr)] items-center gap-2 rounded-2xl bg-surface-muted p-3 sm:gap-5 sm:p-4">
      <div className="min-w-0 text-left">
        <Text className="text-sm font-semibold tabular-nums" variant="unstyled">
          {formatNumber(firstValue)}
        </Text>
        <meter
          aria-label={`${first.name}: ${label}`}
          className="pokemon-compare-meter stat-meter mt-2 h-2.5 w-full"
          max={maximum}
          min={0}
          style={getPokemonTypeStyle(
            resolvePokemonTypeTheme(first.types).primary
          )}
          value={firstValue}
        />
      </div>
      <Text
        className="break-words text-center text-xs font-medium capitalize sm:text-sm"
        variant="unstyled"
      >
        {label}
      </Text>
      <div className="min-w-0 text-right">
        <Text className="text-sm font-semibold tabular-nums" variant="unstyled">
          {formatNumber(secondValue)}
        </Text>
        <meter
          aria-label={`${second.name}: ${label}`}
          className="pokemon-compare-meter stat-meter mt-2 h-2.5 w-full"
          max={maximum}
          min={0}
          style={getPokemonTypeStyle(
            resolvePokemonTypeTheme(second.types).primary
          )}
          value={secondValue}
        />
      </div>
    </li>
  )
}

export const CompareResults = ({ first, second }: CompareResultsProps) => {
  const { t } = useI18n()
  const firstQuery = useQuery(pokemonDetailsOptions(first))
  const secondQuery = useQuery(pokemonDetailsOptions(second))
  const isPending = firstQuery.isPending || secondQuery.isPending
  const isError = firstQuery.isError || secondQuery.isError
  const firstPokemon = firstQuery.data
  const secondPokemon = secondQuery.data
  const statNames = Array.from(
    new Set([
      ...(firstPokemon?.stats.map(({ name }) => name) ?? []),
      ...(secondPokemon?.stats.map(({ name }) => name) ?? [])
    ])
  )

  return (
    <div className="mt-8" aria-live="polite">
      <ShouldRender if={isPending && !isError}>
        <div
          aria-label={t('compare.loadingPokemon')}
          className="space-y-5"
          role="status"
        >
          <div className="grid gap-5 lg:grid-cols-2">
            {[0, 1].map((side) => (
              <div className="rounded-3xl bg-surface p-5 md:p-7" key={side}>
                <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                  <Skeleton className="aspect-square w-36 shrink-0 rounded-2xl md:w-44" />
                  <div className="w-full space-y-3 pt-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-8 w-40 max-w-full" />
                    <Skeleton className="h-7 w-20 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-5 border-t border-line pt-5">
                  {[0, 1, 2, 3].map((fact) => (
                    <div className="space-y-2" key={fact}>
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-5 w-24 max-w-full" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-3xl bg-surface p-5 md:p-8">
            <Skeleton className="h-8 w-56 max-w-full" />
            <div className="mt-6 space-y-3">
              {[0, 1, 2, 3, 4, 5].map((row) => (
                <div
                  className="grid grid-cols-[1fr_5rem_1fr] gap-3 rounded-2xl bg-surface-muted p-4"
                  key={row}
                >
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </ShouldRender>
      <ShouldRender if={isError}>
        <div className="rounded-3xl bg-surface p-7">
          <Text className="text-error" variant="unstyled">
            {t('compare.pokemonError')}
          </Text>
          <Button
            className="mt-4"
            onClick={() => {
              if (firstQuery.isError) {
                void firstQuery.refetch()
              }
              if (secondQuery.isError) {
                void secondQuery.refetch()
              }
            }}
          >
            {t('compare.retry')}
          </Button>
        </div>
      </ShouldRender>
      <ShouldRender if={Boolean(firstPokemon && secondPokemon && !isError)}>
        <div className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-2">
            {firstPokemon ? (
              <ComparePokemonCard pokemon={firstPokemon} />
            ) : null}
            {secondPokemon ? (
              <ComparePokemonCard pokemon={secondPokemon} />
            ) : null}
          </div>
          <section className="rounded-3xl bg-surface p-5 md:p-8">
            <Text
              as="h2"
              className="font-display text-2xl font-medium md:text-3xl"
              variant="unstyled"
            >
              {t('compare.stats')}
            </Text>
            <ol className="mt-6 space-y-3">
              {firstPokemon && secondPokemon
                ? statNames.map((name) => (
                    <CompareStatRow
                      first={firstPokemon}
                      key={name}
                      name={name}
                      second={secondPokemon}
                    />
                  ))
                : null}
            </ol>
          </section>
        </div>
      </ShouldRender>
    </div>
  )
}
