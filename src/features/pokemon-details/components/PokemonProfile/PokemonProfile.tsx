import { ShouldRender } from '@/components/ui/ShouldRender'
import { Skeleton } from '@/components/ui/Skeleton'
import { Text } from '@/components/ui/Text'
import { useI18n } from '@/lib/i18n'
import type { Pokemon, PokemonSpecies } from '@/models/pokemon'
import { SectionError } from '../SectionError'

type PokemonProfileProps = {
  pokemon: Pokemon
  species?: PokemonSpecies
  isPending: boolean
  isError: boolean
  retry: () => void
}

export const PokemonProfile = ({
  pokemon,
  species,
  isPending,
  isError,
  retry
}: PokemonProfileProps) => {
  const { locale, t } = useI18n()
  const genus = species?.genera[locale] ?? species?.genera.en ?? null

  return (
    <section className="rounded-3xl bg-surface p-6 md:p-8">
      <Text
        as="h2"
        className="font-display text-2xl font-medium md:text-3xl"
        variant="unstyled"
      >
        {t('details.profile')}
      </Text>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <ShouldRender if={isPending}>
            <div aria-label={t('details.loadingSpecies')} role="status">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-3 h-6 w-40" />
              <Skeleton className="mt-6 h-4 w-24" />
              <Skeleton className="mt-3 h-6 w-28" />
            </div>
          </ShouldRender>
          <ShouldRender if={isError}>
            <SectionError retry={retry} />
          </ShouldRender>
          <ShouldRender if={Boolean(species)}>
            <div className="space-y-5">
              <ShouldRender if={Boolean(genus)}>
                <div>
                  <Text className="text-sm" variant="muted">
                    {t('details.species')}
                  </Text>
                  <Text className="mt-1 font-medium" variant="unstyled">
                    {genus}
                  </Text>
                </div>
              </ShouldRender>
              <div>
                <Text className="text-sm" variant="muted">
                  {t('details.generation')}
                </Text>
                <Text className="mt-1 font-medium" variant="unstyled">
                  {t('filters.generationValue', {
                    number: species?.generation ?? ''
                  })}
                </Text>
              </div>
            </div>
          </ShouldRender>
        </div>
        <div>
          <Text className="text-sm" variant="muted">
            {t('details.abilities')}
          </Text>
          <div className="mt-3 flex flex-wrap gap-2">
            {pokemon.abilities.map((ability) => (
              <Text
                className="rounded-xl bg-surface-muted px-3 py-2 text-sm font-medium capitalize"
                key={ability.name}
                variant="unstyled"
              >
                {ability.name.replaceAll('-', ' ')}
                {ability.isHidden ? ` · ${t('details.hiddenAbility')}` : ''}
              </Text>
            ))}
            <ShouldRender if={pokemon.abilities.length === 0}>
              <Text variant="muted">{t('details.none')}</Text>
            </ShouldRender>
          </div>
        </div>
      </div>
    </section>
  )
}
