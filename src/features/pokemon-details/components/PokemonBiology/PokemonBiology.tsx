import { ShouldRender } from '@/components/ui/ShouldRender'
import { Skeleton } from '@/components/ui/Skeleton'
import { Text } from '@/components/ui/Text'
import { type TranslationKey, useI18n } from '@/lib/i18n'
import type { PokemonSpecies } from '@/models/pokemon'
import { SectionError } from '../SectionError'

type PokemonBiologyProps = {
  species?: PokemonSpecies
  isPending: boolean
  isError: boolean
  retry: () => void
}

const eggGroupKeys: Record<string, TranslationKey> = {
  monster: 'details.eggGroup.monster',
  water1: 'details.eggGroup.water1',
  water2: 'details.eggGroup.water2',
  water3: 'details.eggGroup.water3',
  bug: 'details.eggGroup.bug',
  flying: 'details.eggGroup.flying',
  field: 'details.eggGroup.field',
  ground: 'details.eggGroup.field',
  fairy: 'details.eggGroup.fairy',
  grass: 'details.eggGroup.grass',
  plant: 'details.eggGroup.grass',
  'human-like': 'details.eggGroup.humanLike',
  humanshape: 'details.eggGroup.humanLike',
  mineral: 'details.eggGroup.mineral',
  amorphous: 'details.eggGroup.amorphous',
  indeterminate: 'details.eggGroup.amorphous',
  ditto: 'details.eggGroup.ditto',
  dragon: 'details.eggGroup.dragon',
  'no-eggs': 'details.eggGroup.noEggs'
}

const growthKeys: Record<string, TranslationKey> = {
  slow: 'details.growth.slow',
  medium: 'details.growth.medium',
  fast: 'details.growth.fast',
  'medium-slow': 'details.growth.mediumSlow',
  'slow-then-very-fast': 'details.growth.fluctuating',
  'fast-then-very-slow': 'details.growth.erratic'
}

export const PokemonBiology = ({
  species,
  isPending,
  isError,
  retry
}: PokemonBiologyProps) => {
  const { locale, t } = useI18n()
  const formatNumber = (value: number) =>
    new Intl.NumberFormat(locale).format(value)
  const femalePercent =
    species?.genderRate !== null &&
    species?.genderRate !== undefined &&
    species.genderRate >= 0
      ? species.genderRate * 12.5
      : null
  const formatPercent = (value: number) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value)
  const growthKey = species?.growthRate ? growthKeys[species.growthRate] : null

  return (
    <section
      className="flex h-full flex-col rounded-3xl bg-surface p-6 md:p-8"
      id="biology"
    >
      <Text
        as="h2"
        className="font-display text-2xl font-medium md:text-3xl"
        variant="unstyled"
      >
        {t('details.biology')}
      </Text>
      <ShouldRender if={isPending}>
        <div
          aria-label={t('details.loadingBiology')}
          className="mt-6 grid grid-cols-2 gap-5"
          role="status"
        >
          {[0, 1, 2, 3].map((index) => (
            <div key={index}>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-3 h-6 w-32" />
            </div>
          ))}
        </div>
      </ShouldRender>
      <ShouldRender if={isError}>
        <div className="mt-6">
          <SectionError retry={retry} />
        </div>
      </ShouldRender>
      <ShouldRender if={Boolean(species)}>
        <dl className="mt-6 grid gap-x-6 gap-y-6 sm:grid-cols-2">
          <div>
            <Text as="dt" className="text-sm" variant="muted">
              {t('details.gender')}
            </Text>
            <Text as="dd" className="mt-2 font-medium" variant="unstyled">
              {species?.genderRate === -1
                ? t('details.genderless')
                : femalePercent === null
                  ? t('details.genderUnknown')
                  : t('details.genderRatio', {
                      female: formatPercent(femalePercent),
                      male: formatPercent(100 - femalePercent)
                    })}
            </Text>
          </div>
          <div>
            <Text as="dt" className="text-sm" variant="muted">
              {t('details.eggGroups')}
            </Text>
            <Text as="dd" className="mt-2 font-medium" variant="unstyled">
              {species?.eggGroups.length
                ? species.eggGroups
                    .map((group) =>
                      eggGroupKeys[group]
                        ? t(eggGroupKeys[group])
                        : group.replaceAll('-', ' ')
                    )
                    .join(', ')
                : t('details.none')}
            </Text>
          </div>
          <div>
            <Text as="dt" className="text-sm" variant="muted">
              {t('details.captureRate')}
            </Text>
            <Text as="dd" className="mt-2 font-medium" variant="unstyled">
              {species?.captureRate === null ||
              species?.captureRate === undefined
                ? t('details.unknown')
                : t('details.captureRateValue', {
                    value: formatNumber(species.captureRate)
                  })}
            </Text>
          </div>
          <div>
            <Text as="dt" className="text-sm" variant="muted">
              {t('details.growthRate')}
            </Text>
            <Text
              as="dd"
              className="mt-2 font-medium capitalize"
              variant="unstyled"
            >
              {growthKey
                ? t(growthKey)
                : (species?.growthRate?.replaceAll('-', ' ') ??
                  t('details.unknown'))}
            </Text>
          </div>
        </dl>
      </ShouldRender>
      <ShouldRender if={Boolean(species)}>
        <div className="mt-auto grid gap-5 pt-7 sm:grid-cols-2">
          <ShouldRender if={femalePercent !== null}>
            <div className="rounded-2xl bg-surface-muted p-4">
              <Text className="text-sm font-medium" variant="unstyled">
                {t('details.genderDistribution')}
              </Text>
              <meter
                aria-label={t('details.genderRatio', {
                  female: formatPercent(femalePercent ?? 0),
                  male: formatPercent(100 - (femalePercent ?? 0))
                })}
                className="stat-meter mt-4 h-2.5 w-full"
                max={100}
                min={0}
                value={femalePercent ?? 0}
              />
            </div>
          </ShouldRender>
          <ShouldRender
            if={
              species?.captureRate !== null &&
              species?.captureRate !== undefined
            }
          >
            <div className="rounded-2xl bg-surface-muted p-4">
              <Text className="text-sm font-medium" variant="unstyled">
                {t('details.captureScale')}
              </Text>
              <meter
                aria-label={t('details.captureRate')}
                className="stat-meter mt-4 h-2.5 w-full"
                max={255}
                min={0}
                value={species?.captureRate ?? 0}
              />
            </div>
          </ShouldRender>
        </div>
      </ShouldRender>
    </section>
  )
}
