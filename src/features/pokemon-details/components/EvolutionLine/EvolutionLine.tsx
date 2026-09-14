import { Link } from 'react-router'
import { Image } from '@/components/ui/Image'
import { ShouldRender } from '@/components/ui/ShouldRender'
import { Skeleton } from '@/components/ui/Skeleton'
import { Text } from '@/components/ui/Text'
import { getPokemonTypeLabel, type TranslationKey, useI18n } from '@/lib/i18n'
import type {
  EvolutionChain,
  EvolutionNode,
  EvolutionRequirement
} from '@/models/pokemon'
import { SectionError } from '../SectionError'

type EvolutionLineProps = {
  chain?: EvolutionChain
  currentSpeciesId: number
  backTo: string
  isPending: boolean
  isError: boolean
  retry: () => void
}

type StageEntry = { node: EvolutionNode; parent: EvolutionNode | null }

const getEvolutionStages = (root: EvolutionNode): Array<Array<StageEntry>> => {
  const collect = (
    entries: Array<StageEntry>,
    stages: Array<Array<StageEntry>>
  ): Array<Array<StageEntry>> => {
    if (entries.length === 0) {
      return stages
    }

    const next = entries.flatMap(({ node }) =>
      node.evolvesTo.map((child) => ({ node: child, parent: node }))
    )
    return collect(next, [...stages, entries])
  }

  return collect([{ node: root, parent: null }], [])
}

const triggerLabels: Record<string, TranslationKey> = {
  'level-up': 'details.evolutionLevelUp',
  trade: 'details.evolutionTrade',
  'use-item': 'details.evolutionItem'
}

const requirementLabels: Record<EvolutionRequirement['kind'], TranslationKey> =
  {
    level: 'details.evolutionLevel',
    item: 'details.evolutionRequiresItem',
    heldItem: 'details.evolutionHeldItem',
    happiness: 'details.evolutionHappiness',
    affection: 'details.evolutionAffection',
    beauty: 'details.evolutionBeauty',
    time: 'details.evolutionTime',
    knownMove: 'details.evolutionKnownMove',
    knownMoveType: 'details.evolutionKnownMoveType',
    location: 'details.evolutionLocation',
    gender: 'details.evolutionGender',
    specialRock: 'details.evolutionSpecialRock',
    rain: 'details.evolutionRain',
    multiplayer: 'details.evolutionMultiplayer',
    partySpecies: 'details.evolutionPartySpecies',
    partyType: 'details.evolutionPartyType',
    relativeStats: 'details.evolutionRelativeStats',
    tradeSpecies: 'details.evolutionTradeSpecies',
    upsideDown: 'details.evolutionUpsideDown',
    region: 'details.evolutionRegion',
    baseForm: 'details.evolutionBaseForm',
    evolvedForm: 'details.evolutionEvolvedForm',
    usedMove: 'details.evolutionUsedMove',
    moveCount: 'details.evolutionMoveCount',
    steps: 'details.evolutionSteps',
    damageTaken: 'details.evolutionDamageTaken'
  }

const timeLabels: Record<string, TranslationKey> = {
  day: 'details.evolutionDay',
  night: 'details.evolutionNight',
  dusk: 'details.evolutionDusk'
}

const EvolutionStageCard = ({
  node,
  parent,
  showParent,
  currentSpeciesId,
  backTo
}: {
  node: EvolutionNode
  parent: EvolutionNode | null
  showParent: boolean
  currentSpeciesId: number
  backTo: string
}) => {
  const { t } = useI18n()
  const name = node.name.replaceAll('-', ' ')
  const formatRequirement = ({ kind, value }: EvolutionRequirement) => {
    if (kind === 'gender') {
      return value === 1
        ? t('details.evolutionFemale')
        : t('details.evolutionMale')
    }

    if (kind === 'relativeStats') {
      return t(
        value === 1
          ? 'details.evolutionAttackGreater'
          : value === -1
            ? 'details.evolutionDefenseGreater'
            : 'details.evolutionStatsEqual'
      )
    }

    const timeLabel = kind === 'time' ? timeLabels[String(value)] : undefined
    const readableValue = timeLabel
      ? t(timeLabel)
      : kind === 'knownMoveType' || kind === 'partyType'
        ? getPokemonTypeLabel(String(value), t)
        : String(value).replaceAll('-', ' ')

    return t(requirementLabels[kind], {
      level: value,
      value: readableValue
    })
  }

  return (
    <li className="min-w-0">
      <Link
        aria-current={node.id === currentSpeciesId ? 'page' : undefined}
        className="pokemon-evolution-card group flex h-full min-w-0 flex-col items-center rounded-2xl border border-line bg-surface p-3 text-center transition-[border-color,box-shadow] duration-200 motion-reduce:transition-none sm:p-4"
        state={{ from: backTo }}
        to={`/pokemon/${node.id}`}
      >
        <div className="flex aspect-square w-full max-w-28 items-center justify-center overflow-hidden rounded-xl bg-surface-muted">
          <Image
            alt={t('details.artworkAlt', { name })}
            className="h-full w-full object-contain p-2 transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none"
            fallbackLabel={t('details.artworkFallback')}
            src={node.artworkUrl}
          />
        </div>
        <Text className="mt-2 text-xs text-muted" variant="unstyled">
          #{String(node.id).padStart(4, '0')}
        </Text>
        <Text
          className="mt-1 break-words text-sm font-medium capitalize"
          variant="unstyled"
        >
          {name}
        </Text>
        <ShouldRender if={showParent && parent !== null}>
          <Text className="mt-1 text-xs" variant="muted">
            {t('details.evolutionFrom', {
              name: parent?.name.replaceAll('-', ' ') ?? ''
            })}
          </Text>
        </ShouldRender>
        <ShouldRender if={node.methods.length > 0}>
          <div className="mt-auto flex w-full flex-col items-center gap-2 border-t border-line pt-3 text-center">
            {node.methods.map((method, methodIndex) => (
              <div
                className="flex flex-wrap justify-center gap-1"
                key={`${method.trigger}-${method.requirements.map(({ kind, value }) => `${kind}:${value}`).join('|')}`}
              >
                <ShouldRender if={methodIndex > 0}>
                  <Text className="w-full text-xs" variant="muted">
                    {t('details.evolutionOr')}
                  </Text>
                </ShouldRender>
                <Text
                  className="rounded-full bg-surface-muted px-2 py-1 text-xs font-medium text-muted"
                  variant="unstyled"
                >
                  {t(
                    method.trigger
                      ? (triggerLabels[method.trigger] ??
                          'details.evolutionSpecial')
                      : 'details.evolutionSpecial'
                  )}
                </Text>
                {method.requirements.map((requirement) => (
                  <Text
                    className="rounded-full bg-surface-muted px-2 py-1 text-xs font-medium text-muted"
                    key={`${requirement.kind}-${requirement.value}`}
                    variant="unstyled"
                  >
                    {formatRequirement(requirement)}
                  </Text>
                ))}
              </div>
            ))}
          </div>
        </ShouldRender>
      </Link>
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
  const stages = chain ? getEvolutionStages(chain.root) : []

  return (
    <section className="rounded-3xl bg-surface p-6 md:p-8" id="evolution">
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
          className="mt-7 space-y-5"
          role="status"
        >
          <Skeleton className="mx-auto h-52 w-40 rounded-2xl" />
          <Skeleton className="mx-auto h-5 w-28" />
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <Skeleton className="h-64 rounded-2xl" key={index} />
            ))}
          </div>
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
        <div className="mt-7 space-y-5">
          {stages.map((stage, index) => {
            const parentCount = new Set(stage.map(({ parent }) => parent?.id))
              .size
            const columns =
              stage.length === 1
                ? 'max-w-44 grid-cols-1'
                : stage.length === 2
                  ? 'max-w-2xl grid-cols-2'
                  : stage.length === 3
                    ? 'max-w-3xl grid-cols-2 sm:grid-cols-3'
                    : 'max-w-5xl grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'

            return (
              <div key={stage.map(({ node }) => node.id).join('-')}>
                <ShouldRender if={index > 0}>
                  <div
                    aria-hidden="true"
                    className="mx-auto mb-4 h-6 w-px bg-line"
                  />
                </ShouldRender>
                <Text
                  as="h3"
                  className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-muted"
                  variant="unstyled"
                >
                  {t('details.evolutionStage', { number: index + 1 })}
                </Text>
                <ul className={`mx-auto mt-4 grid w-full gap-3 ${columns}`}>
                  {stage.map(({ node, parent }) => (
                    <EvolutionStageCard
                      backTo={backTo}
                      currentSpeciesId={currentSpeciesId}
                      key={node.id}
                      node={node}
                      parent={parent}
                      showParent={parentCount > 1}
                    />
                  ))}
                </ul>
              </div>
            )
          })}
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
