import { useQuery } from '@tanstack/react-query'
import { pokemonListOptions } from '@/api/pokemon'
import { Button } from '@/components/ui/Button'
import { ShouldRender } from '@/components/ui/ShouldRender'
import { Text } from '@/components/ui/Text'
import { PokemonCard } from '@/features/pokemon-list/components/PokemonCard'
import { PokemonCardSkeleton } from '@/features/pokemon-list/components/PokemonCardSkeleton'
import { useI18n } from '@/lib/i18n'

const PAGE_SIZE = 24
const skeletons = Array.from({ length: PAGE_SIZE }, (_, index) => index)

export const CatalogSection = () => {
  const { t } = useI18n()
  const pokemonQuery = useQuery(pokemonListOptions(0, PAGE_SIZE))

  return (
    <section
      className="page-container pb-16 pt-8 md:pb-24 md:pt-16"
      id="catalog"
    >
      <div className="max-w-2xl">
        <Text variant="eyebrow">{t('list.eyebrow')}</Text>
        <Text as="h2" className="mt-4" variant="heading">
          {t('list.title')}
        </Text>
        <Text className="mt-4" variant="muted">
          {t('list.description')}
        </Text>
      </div>

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

      <ShouldRender if={pokemonQuery.isError}>
        <div className="mt-9 rounded-2xl bg-surface p-6">
          <Text>{t('list.error')}</Text>
          <Button className="mt-5" onClick={() => void pokemonQuery.refetch()}>
            {t('list.retry')}
          </Button>
        </div>
      </ShouldRender>

      <ShouldRender
        if={pokemonQuery.isSuccess && pokemonQuery.data.results.length === 0}
      >
        <Text className="mt-9" variant="muted">
          {t('list.empty')}
        </Text>
      </ShouldRender>

      <ShouldRender
        if={pokemonQuery.isSuccess && pokemonQuery.data.results.length > 0}
      >
        <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {pokemonQuery.data?.results.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      </ShouldRender>
    </section>
  )
}
