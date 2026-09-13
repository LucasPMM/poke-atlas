import { Link } from 'react-router'
import { getOfficialArtworkUrl } from '@/api/pokemon/artwork'
import { Image } from '@/components/ui/Image'
import { ShouldRender } from '@/components/ui/ShouldRender'
import { Skeleton } from '@/components/ui/Skeleton'
import { Text } from '@/components/ui/Text'
import { useI18n } from '@/lib/i18n'
import type { PokemonSpecies } from '@/models/pokemon'
import { SectionError } from '../SectionError'

type PokemonVarietiesProps = {
  species?: PokemonSpecies
  currentPokemonId: number
  backTo: string
  isPending: boolean
  isError: boolean
  retry: () => void
}

export const PokemonVarieties = ({
  species,
  currentPokemonId,
  backTo,
  isPending,
  isError,
  retry
}: PokemonVarietiesProps) => {
  const { t } = useI18n()

  return (
    <section className="rounded-3xl bg-surface p-6 md:p-8" id="varieties">
      <Text
        as="h2"
        className="font-display text-2xl font-medium md:text-3xl"
        variant="unstyled"
      >
        {t('details.varieties')}
      </Text>
      <Text className="mt-3 text-sm" variant="muted">
        {t('details.varietiesDescription')}
      </Text>
      <ShouldRender if={isPending}>
        <div
          aria-label={t('details.loadingVarieties')}
          className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
          role="status"
        >
          {[0, 1].map((index) => (
            <Skeleton className="h-44 rounded-2xl" key={index} />
          ))}
        </div>
      </ShouldRender>
      <ShouldRender if={isError}>
        <div className="mt-6">
          <SectionError retry={retry} />
        </div>
      </ShouldRender>
      <ShouldRender if={Boolean(species) && species?.varieties.length === 0}>
        <Text className="mt-6" variant="muted">
          {t('details.noVarieties')}
        </Text>
      </ShouldRender>
      <ShouldRender
        if={Boolean(species) && (species?.varieties.length ?? 0) > 0}
      >
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {species?.varieties.map((variety) => {
            const name = variety.name.replaceAll('-', ' ')

            return (
              <li key={variety.id}>
                <Link
                  aria-current={
                    variety.id === currentPokemonId ? 'page' : undefined
                  }
                  className="pokemon-evolution-card group flex h-full flex-col items-center rounded-2xl border border-line bg-surface p-3 text-center transition-[border-color,box-shadow] duration-200 motion-reduce:transition-none"
                  state={{ from: backTo }}
                  to={`/pokemon/${variety.id}`}
                >
                  <Image
                    alt={t('details.artworkAlt', { name })}
                    className="aspect-square w-full object-contain p-2 transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none"
                    fallbackLabel={t('details.artworkFallback')}
                    src={getOfficialArtworkUrl(variety.id)}
                  />
                  <Text
                    className="mt-1 text-sm font-medium capitalize"
                    variant="unstyled"
                  >
                    {name}
                  </Text>
                  <ShouldRender if={variety.isDefault}>
                    <Text className="mt-1 text-xs" variant="muted">
                      {t('details.defaultVariety')}
                    </Text>
                  </ShouldRender>
                </Link>
              </li>
            )
          })}
        </ul>
      </ShouldRender>
    </section>
  )
}
