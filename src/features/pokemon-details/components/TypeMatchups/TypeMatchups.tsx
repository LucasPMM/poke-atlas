import { ShouldRender } from '@/components/ui/ShouldRender'
import { Skeleton } from '@/components/ui/Skeleton'
import { Text } from '@/components/ui/Text'
import { getPokemonTypeLabel, type TranslationKey, useI18n } from '@/lib/i18n'
import type { PokemonType } from '@/models/pokemon'
import {
  calculateTypeEffectiveness,
  type TypeMatchup
} from '../../type-effectiveness'
import { SectionError } from '../SectionError'

type TypeMatchupsProps = {
  types: ReadonlyArray<PokemonType>
  isPending: boolean
  isError: boolean
  retry: () => void
}

const MatchupGroup = ({
  heading,
  matchups
}: {
  heading: TranslationKey
  matchups: ReadonlyArray<TypeMatchup>
}) => {
  const { locale, t } = useI18n()

  return (
    <div>
      <Text
        as="h3"
        className="text-sm font-medium text-muted"
        variant="unstyled"
      >
        {t(heading)}
      </Text>
      <div className="mt-3 flex flex-wrap gap-2">
        {matchups.map(({ name, multiplier }) => (
          <Text
            className="rounded-full border border-line bg-surface-muted px-3 py-2 text-sm font-medium"
            key={name}
            variant="unstyled"
          >
            {getPokemonTypeLabel(name, t)} ·{' '}
            {t('details.multiplier', {
              value: new Intl.NumberFormat(locale, {
                maximumFractionDigits: 2
              }).format(multiplier)
            })}
          </Text>
        ))}
        <ShouldRender if={matchups.length === 0}>
          <Text variant="muted">{t('details.none')}</Text>
        </ShouldRender>
      </div>
    </div>
  )
}

export const TypeMatchups = ({
  types,
  isPending,
  isError,
  retry
}: TypeMatchupsProps) => {
  const { t } = useI18n()
  const matchups = calculateTypeEffectiveness(types)

  return (
    <section className="rounded-3xl bg-surface p-6 md:p-8">
      <Text
        as="h2"
        className="font-display text-2xl font-medium md:text-3xl"
        variant="unstyled"
      >
        {t('details.matchups')}
      </Text>
      <ShouldRender if={isPending}>
        <div
          aria-label={t('details.loadingMatchups')}
          className="mt-7 grid gap-6"
          role="status"
        >
          {[0, 1, 2].map((index) => (
            <div key={index}>
              <Skeleton className="h-4 w-28" />
              <div className="mt-3 flex gap-2">
                <Skeleton className="h-9 w-24 rounded-full" />
                <Skeleton className="h-9 w-28 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </ShouldRender>
      <ShouldRender if={isError}>
        <div className="mt-6">
          <SectionError retry={retry} />
        </div>
      </ShouldRender>
      <ShouldRender if={!isPending && !isError}>
        <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <MatchupGroup
            heading="details.weaknesses"
            matchups={matchups.weaknesses}
          />
          <MatchupGroup
            heading="details.resistances"
            matchups={matchups.resistances}
          />
          <MatchupGroup
            heading="details.immunities"
            matchups={matchups.immunities}
          />
        </div>
      </ShouldRender>
    </section>
  )
}
