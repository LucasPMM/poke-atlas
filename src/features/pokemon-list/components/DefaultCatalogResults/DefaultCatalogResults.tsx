import { useInfiniteQuery } from '@tanstack/react-query'
import { useCallback, useRef } from 'react'
import { pokemonInfiniteListOptions } from '@/api/pokemon'
import { Button } from '@/components/ui/Button'
import { ShouldRender } from '@/components/ui/ShouldRender'
import { Text } from '@/components/ui/Text'
import { PokemonCard } from '@/features/pokemon-list/components/PokemonCard'
import { PokemonCardSkeleton } from '@/features/pokemon-list/components/PokemonCardSkeleton'
import { useLoadMoreOnIntersect } from '@/features/pokemon-list/hooks/useLoadMoreOnIntersect'
import { useI18n } from '@/lib/i18n'

const PAGE_SIZE = 24
const skeletons = Array.from({ length: PAGE_SIZE }, (_, index) => index)

export const DefaultCatalogResults = () => {
  const { t } = useI18n()
  const pokemonQuery = useInfiniteQuery(pokemonInfiniteListOptions(PAGE_SIZE))
  const pokemon = pokemonQuery.data?.pages.flatMap((page) => page.results) ?? []
  const nextOffset = pokemonQuery.data?.pages.at(-1)?.nextOffset ?? null
  const requestedOffsetRef = useRef<number | null>(null)
  const requestNextPage = useCallback(() => {
    if (
      !pokemonQuery.hasNextPage ||
      pokemonQuery.isFetching ||
      pokemonQuery.isFetchNextPageError ||
      nextOffset === null ||
      requestedOffsetRef.current === nextOffset
    ) {
      return
    }

    requestedOffsetRef.current = nextOffset
    void pokemonQuery.fetchNextPage()
  }, [
    nextOffset,
    pokemonQuery.fetchNextPage,
    pokemonQuery.hasNextPage,
    pokemonQuery.isFetchNextPageError,
    pokemonQuery.isFetching
  ])
  const sentinelRef = useLoadMoreOnIntersect(
    pokemonQuery.hasNextPage &&
      !pokemonQuery.isFetching &&
      !pokemonQuery.isFetchNextPageError,
    requestNextPage
  )

  return (
    <>
      <ShouldRender if={pokemonQuery.isPending}>
        <div
          aria-busy="true"
          aria-label={t('list.loading')}
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

      <ShouldRender
        if={pokemonQuery.isError && pokemonQuery.data === undefined}
      >
        <div className="mt-9 rounded-2xl bg-surface p-6">
          <Text>{t('list.error')}</Text>
          <Button className="mt-5" onClick={() => void pokemonQuery.refetch()}>
            {t('list.retry')}
          </Button>
        </div>
      </ShouldRender>

      <ShouldRender
        if={pokemonQuery.data !== undefined && pokemon.length === 0}
      >
        <div className="mt-9 rounded-2xl bg-surface p-6">
          <Text variant="muted">{t('list.empty')}</Text>
          <Button
            className="mt-5"
            onClick={() => void pokemonQuery.refetch()}
            variant="outline"
          >
            {t('list.retry')}
          </Button>
        </div>
      </ShouldRender>

      <ShouldRender if={pokemon.length > 0}>
        <div className="catalog-results-enter mt-9 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {pokemon.map((entry) => (
            <PokemonCard key={entry.id} pokemon={entry} />
          ))}
          <ShouldRender if={pokemonQuery.isFetchingNextPage}>
            {skeletons.map((index) => (
              <PokemonCardSkeleton key={`more-${index}`} />
            ))}
          </ShouldRender>
        </div>
      </ShouldRender>

      <ShouldRender if={pokemonQuery.isFetchNextPageError}>
        <div className="mt-8 rounded-2xl bg-surface p-6" role="alert">
          <Text>{t('list.moreError')}</Text>
          <Button
            className="mt-5"
            onClick={() => void pokemonQuery.fetchNextPage()}
          >
            {t('list.retry')}
          </Button>
        </div>
      </ShouldRender>

      <ShouldRender
        if={pokemonQuery.hasNextPage && !pokemonQuery.isFetchNextPageError}
      >
        <div className="mt-8 flex justify-center" ref={sentinelRef}>
          <Button
            aria-label={
              pokemonQuery.isFetchingNextPage
                ? t('list.loadingMore')
                : t('list.more')
            }
            disabled={pokemonQuery.isFetching}
            onClick={requestNextPage}
            variant="outline"
          >
            {pokemonQuery.isFetchingNextPage
              ? t('list.loadingMore')
              : t('list.more')}
          </Button>
        </div>
      </ShouldRender>

      <ShouldRender if={pokemon.length > 0 && !pokemonQuery.hasNextPage}>
        <Text className="mt-8 text-center" variant="muted">
          {t('list.end')}
        </Text>
      </ShouldRender>
    </>
  )
}
