import { useQuery } from '@tanstack/react-query'
import { useCallback, useRef, useState } from 'react'
import {
  pokemonAbilityMembersOptions,
  pokemonCatalogOptions,
  pokemonGenerationMembersOptions,
  pokemonTypeMembersOptions
} from '@/api/pokemon'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { ShouldRender } from '@/components/ui/ShouldRender'
import { Text } from '@/components/ui/Text'
import { useI18n } from '@/lib/i18n'
import { type CatalogFilters, filterCatalog } from '../../catalog-filters'
import { useLoadMoreOnIntersect } from '../../hooks/useLoadMoreOnIntersect'
import { PokemonCard } from '../PokemonCard'
import { PokemonCardSkeleton } from '../PokemonCardSkeleton'

const PAGE_SIZE = 24
const skeletons = Array.from({ length: PAGE_SIZE }, (_, index) => index)

export const FilteredCatalogResults = ({
  filters,
  onClearFilters
}: {
  filters: CatalogFilters
  onClearFilters: () => void
}) => {
  const { locale, t } = useI18n()
  const catalogQuery = useQuery(pokemonCatalogOptions())
  const typeQuery = useQuery({
    ...pokemonTypeMembersOptions(filters.type),
    enabled: filters.type.length > 0
  })
  const generationQuery = useQuery({
    ...pokemonGenerationMembersOptions(filters.generation),
    enabled: filters.generation.length > 0
  })
  const abilityQuery = useQuery({
    ...pokemonAbilityMembersOptions(filters.ability),
    enabled: filters.ability.length > 0
  })
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const requestedCountRef = useRef(0)
  const isPending =
    catalogQuery.isPending ||
    (filters.type.length > 0 && typeQuery.isPending) ||
    (filters.generation.length > 0 && generationQuery.isPending) ||
    (filters.ability.length > 0 && abilityQuery.isPending)
  const isError =
    catalogQuery.isError ||
    (filters.type.length > 0 && typeQuery.isError) ||
    (filters.generation.length > 0 && generationQuery.isError) ||
    (filters.ability.length > 0 && abilityQuery.isError)
  const results =
    isPending || isError
      ? []
      : filterCatalog(catalogQuery.data ?? [], filters, {
          type: filters.type.length > 0 ? new Set(typeQuery.data ?? []) : null,
          generation:
            filters.generation.length > 0
              ? new Set(generationQuery.data ?? [])
              : null,
          ability:
            filters.ability.length > 0 ? new Set(abilityQuery.data ?? []) : null
        })
  const hasMore = visibleCount < results.length
  const loadMore = useCallback(() => {
    if (
      requestedCountRef.current === visibleCount ||
      visibleCount >= results.length
    ) {
      return
    }

    requestedCountRef.current = visibleCount
    setVisibleCount(Math.min(visibleCount + PAGE_SIZE, results.length))
  }, [results.length, visibleCount])
  const sentinelRef = useLoadMoreOnIntersect(hasMore, loadMore)
  const retry = () => {
    void catalogQuery.refetch()

    if (filters.type.length > 0) {
      void typeQuery.refetch()
    }

    if (filters.generation.length > 0) {
      void generationQuery.refetch()
    }

    if (filters.ability.length > 0) {
      void abilityQuery.refetch()
    }
  }

  return (
    <>
      <ShouldRender if={isPending && !isError}>
        <div
          aria-busy="true"
          aria-label={t('filters.loading')}
          className="mt-9"
          role="status"
        >
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {skeletons.map((index) => (
              <PokemonCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </ShouldRender>

      <ShouldRender if={isError}>
        <div className="mt-9 rounded-2xl bg-surface p-6" role="alert">
          <Text>{t('filters.error')}</Text>
          <Button className="mt-5" onClick={retry}>
            {t('list.retry')}
          </Button>
        </div>
      </ShouldRender>

      <ShouldRender if={!isPending && !isError}>
        <div aria-live="polite">
          <Text className="mt-9" variant="muted">
            {t('filters.resultCount', {
              count: new Intl.NumberFormat(locale).format(results.length)
            })}
          </Text>
        </div>
      </ShouldRender>

      <ShouldRender if={!isPending && !isError && results.length === 0}>
        <div className="mt-5 flex flex-col items-start rounded-2xl bg-surface p-6">
          <Icon className="text-action" name="search" size={24} />
          <Text className="mt-4" variant="muted">
            {t('filters.empty')}
          </Text>
          <Button className="mt-5" onClick={onClearFilters} variant="outline">
            {t('filters.clearAll')}
          </Button>
        </div>
      </ShouldRender>

      <ShouldRender if={results.length > 0}>
        <div className="catalog-results-enter mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {results.slice(0, visibleCount).map((entry) => (
            <PokemonCard key={entry.id} pokemon={entry} />
          ))}
        </div>
      </ShouldRender>

      <ShouldRender if={hasMore}>
        <div className="mt-8 flex justify-center" ref={sentinelRef}>
          <Button onClick={loadMore} variant="outline">
            {t('list.more')}
          </Button>
        </div>
      </ShouldRender>

      <ShouldRender if={results.length > 0 && !hasMore}>
        <Text className="mt-8 text-center" variant="muted">
          {t('list.end')}
        </Text>
      </ShouldRender>
    </>
  )
}
