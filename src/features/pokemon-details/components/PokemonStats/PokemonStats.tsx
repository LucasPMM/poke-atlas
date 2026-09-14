import { Text } from '@/components/ui/Text'
import { getPokemonStatLabel, useI18n } from '@/lib/i18n'
import type { PokemonStat } from '@/models/pokemon'

export const PokemonStats = ({
  stats
}: {
  stats: ReadonlyArray<PokemonStat>
}) => {
  const { locale, t } = useI18n()
  const total = stats.reduce((sum, stat) => sum + stat.value, 0)
  const formatNumber = (value: number) =>
    new Intl.NumberFormat(locale).format(value)

  return (
    <section className="h-full rounded-3xl bg-surface p-6 md:p-8">
      <div className="flex items-end justify-between gap-4">
        <Text
          as="h2"
          className="font-display text-2xl font-medium md:text-3xl"
          variant="unstyled"
        >
          {t('details.stats')}
        </Text>
        <div className="text-right">
          <Text className="text-xs" variant="muted">
            {t('details.statTotal')}
          </Text>
          <Text
            className="font-display text-2xl font-medium"
            variant="unstyled"
          >
            {formatNumber(total)}
          </Text>
        </div>
      </div>
      <div className="mt-7 space-y-5">
        {stats.map((stat) => {
          const label = getPokemonStatLabel(stat.name, t)
          const maximum = Math.max(255, stat.value)

          return (
            <div
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2"
              key={stat.name}
            >
              <Text
                className="text-sm font-medium capitalize"
                variant="unstyled"
              >
                {label}
              </Text>
              <Text
                className="text-sm font-semibold tabular-nums"
                variant="unstyled"
              >
                {formatNumber(stat.value)}
              </Text>
              <meter
                aria-label={label}
                className="stat-meter col-span-2 h-2.5 w-full"
                max={maximum}
                min={0}
                value={stat.value}
              >
                {formatNumber(stat.value)}
              </meter>
            </div>
          )
        })}
      </div>
    </section>
  )
}
