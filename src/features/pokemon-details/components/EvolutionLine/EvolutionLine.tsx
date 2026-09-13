import { Link } from 'react-router'
import { Image } from '@/components/ui/Image'
import { ShouldRender } from '@/components/ui/ShouldRender'
import { Skeleton } from '@/components/ui/Skeleton'
import { Text } from '@/components/ui/Text'
import { type TranslationKey, useI18n } from '@/lib/i18n'
import type { EvolutionChain, EvolutionNode } from '@/models/pokemon'
import { SectionError } from '../SectionError'

type EvolutionLineProps = {
  chain?: EvolutionChain
  currentSpeciesId: number
  backTo: string
  isPending: boolean
  isError: boolean
  retry: () => void
}

const triggerLabels: Record<string, TranslationKey> = {
  'level-up': 'details.evolutionLevelUp',
  trade: 'details.evolutionTrade',
  'use-item': 'details.evolutionItem'
}

const EvolutionBranch = ({
  node,
  currentSpeciesId,
  backTo
}: {
  node: EvolutionNode
  currentSpeciesId: number
  backTo: string
}) => {
  const { t } = useI18n()
  const triggerLabel = node.trigger
    ? (triggerLabels[node.trigger] ?? 'details.evolutionSpecial')
    : 'details.evolutionSpecial'
  const method =
    node.minimumLevel !== null
      ? t('details.evolutionLevel', { level: node.minimumLevel })
      : t(triggerLabel)
  const name = node.name.replaceAll('-', ' ')

  return (
    <li
      className={
        node.evolvesTo.length > 0
          ? 'flex w-full flex-col items-center'
          : 'flex min-w-28 flex-col items-center sm:min-w-36'
      }
    >
      <ShouldRender if={node.trigger !== null || node.minimumLevel !== null}>
        <Text
          className="mb-3 rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-muted"
          variant="unstyled"
        >
          {method}
        </Text>
      </ShouldRender>
      <Link
        aria-current={node.id === currentSpeciesId ? 'page' : undefined}
        className="pokemon-evolution-card group flex w-28 flex-col items-center rounded-2xl border border-line bg-surface p-3 text-center transition-[border-color,box-shadow] duration-200 motion-reduce:transition-none sm:w-36"
        state={{ from: backTo }}
        to={`/pokemon/${node.id}`}
      >
        <Image
          alt={t('details.artworkAlt', { name })}
          className="aspect-square w-full object-contain p-1 transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none"
          fallbackLabel={t('details.artworkFallback')}
          src={node.artworkUrl}
        />
        <Text className="mt-2 text-xs text-muted" variant="unstyled">
          #{String(node.id).padStart(4, '0')}
        </Text>
        <Text
          className="mt-1 text-sm font-medium capitalize"
          variant="unstyled"
        >
          {name}
        </Text>
      </Link>
      <ShouldRender if={node.evolvesTo.length > 0}>
        <div className="mt-4 h-6 border-l border-line" aria-hidden="true" />
        <ul className="flex w-full flex-wrap justify-center gap-4">
          {node.evolvesTo.map((child) => (
            <EvolutionBranch
              backTo={backTo}
              currentSpeciesId={currentSpeciesId}
              key={child.id}
              node={child}
            />
          ))}
        </ul>
      </ShouldRender>
    </li>
  )
}

export const EvolutionLine = ({
  chain,
  currentSpeciesId,
  backTo,
  isPending,
  isError,
  retry
}: EvolutionLineProps) => {
  const { t } = useI18n()

  return (
    <section className="rounded-3xl bg-surface p-6 md:p-8">
      <Text
        as="h2"
        className="font-display text-2xl font-medium md:text-3xl"
        variant="unstyled"
      >
        {t('details.evolution')}
      </Text>
      <ShouldRender if={isPending}>
        <div
          aria-label={t('details.loadingEvolution')}
          className="mt-7 flex flex-wrap justify-center gap-4"
          role="status"
        >
          {[0, 1, 2].map((index) => (
            <Skeleton className="h-44 w-36 rounded-2xl" key={index} />
          ))}
        </div>
      </ShouldRender>
      <ShouldRender if={isError}>
        <div className="mt-6">
          <SectionError retry={retry} />
        </div>
      </ShouldRender>
      <ShouldRender if={!isPending && !isError && !chain}>
        <Text className="mt-6" variant="muted">
          {t('details.noEvolution')}
        </Text>
      </ShouldRender>
      <ShouldRender if={!isPending && !isError && Boolean(chain)}>
        <div className="mt-7 overflow-x-auto pb-2">
          <ul className="flex justify-center">
            {chain ? (
              <EvolutionBranch
                backTo={backTo}
                currentSpeciesId={currentSpeciesId}
                node={chain.root}
              />
            ) : null}
          </ul>
          <ShouldRender if={chain?.root.evolvesTo.length === 0}>
            <Text className="mt-4 text-center" variant="muted">
              {t('details.noEvolution')}
            </Text>
          </ShouldRender>
        </div>
      </ShouldRender>
    </section>
  )
}
