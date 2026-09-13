import { useQuery } from '@tanstack/react-query'
import { useRef } from 'react'
import { pokemonAbilityNamesOptions } from '@/api/pokemon'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Select, type SelectOption } from '@/components/ui/Select'
import { ShouldRender } from '@/components/ui/ShouldRender'
import { Text } from '@/components/ui/Text'
import { TextInput } from '@/components/ui/TextInput'
import {
  getPokemonTypeLabel,
  POKEMON_TYPES,
  type TranslationKey,
  useI18n
} from '@/lib/i18n'
import {
  type CatalogFilters,
  type CatalogSort,
  SORT_VALUES
} from '../../catalog-filters'

type FilterKey = 'search' | 'type' | 'generation' | 'ability' | 'sort'
type ChipKey = Exclude<FilterKey, 'sort'>
type CatalogControlsProps = {
  filters: CatalogFilters
  searchDraft: string
  setSearchDraft: (value: string) => void
  setFilter: (key: FilterKey, value: string) => void
  clearFilter: (key: ChipKey) => void
  clearAll: () => void
}

type FilterFieldsProps = Pick<CatalogControlsProps, 'filters' | 'setFilter'> & {
  abilityNames: ReadonlyArray<string>
  abilityLoading: boolean
  abilityUnavailable: boolean
}

const FilterFields = ({
  abilityNames,
  abilityLoading,
  abilityUnavailable,
  filters,
  setFilter
}: FilterFieldsProps) => {
  const { t } = useI18n()
  const typeOptions: Array<SelectOption<string>> = [
    { value: '', label: t('filters.allTypes') },
    ...POKEMON_TYPES.map((type) => ({
      value: type,
      label: t(`types.${type}`)
    }))
  ]
  const generationOptions: Array<SelectOption<string>> = [
    { value: '', label: t('filters.allGenerations') },
    ...Array.from({ length: 9 }, (_, index) => ({
      value: String(index + 1),
      label: t('filters.generationValue', { number: index + 1 })
    }))
  ]
  const abilityOptions: Array<SelectOption<string>> = [
    { value: '', label: t('filters.allAbilities') },
    ...(filters.ability.length > 0 && !abilityNames.includes(filters.ability)
      ? [
          {
            value: filters.ability,
            label: filters.ability.replaceAll('-', ' ')
          }
        ]
      : []),
    ...abilityNames.map((ability) => ({
      value: ability,
      label: ability.replaceAll('-', ' ')
    }))
  ]
  const sortKeys: Record<CatalogSort, TranslationKey> = {
    'number-asc': 'filters.sortNumberAsc',
    'number-desc': 'filters.sortNumberDesc',
    'name-asc': 'filters.sortNameAsc',
    'name-desc': 'filters.sortNameDesc'
  }
  const sortOptions: Array<SelectOption<CatalogSort>> = SORT_VALUES.map(
    (sort) => ({ value: sort, label: t(sortKeys[sort]) })
  )

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div>
        <Text
          as="span"
          className="mb-2 block text-sm font-medium text-ink"
          variant="unstyled"
        >
          {t('filters.type')}
        </Text>
        <Select
          ariaLabel={t('filters.type')}
          onChange={(value) => setFilter('type', value)}
          options={typeOptions}
          value={filters.type}
          variant="field"
        />
      </div>
      <div>
        <Text
          as="span"
          className="mb-2 block text-sm font-medium text-ink"
          variant="unstyled"
        >
          {t('filters.generation')}
        </Text>
        <Select
          ariaLabel={t('filters.generation')}
          onChange={(value) => setFilter('generation', value)}
          options={generationOptions}
          value={filters.generation}
          variant="field"
        />
      </div>
      <div>
        <Text
          as="span"
          className="mb-2 block text-sm font-medium text-ink"
          variant="unstyled"
        >
          {t('filters.ability')}
        </Text>
        <Select
          ariaLabel={t('filters.ability')}
          disabled={abilityLoading || abilityUnavailable}
          loading={abilityLoading}
          onChange={(value) => setFilter('ability', value)}
          options={abilityOptions}
          searchable
          value={filters.ability}
          variant="field"
        />
      </div>
      <div>
        <Text
          as="span"
          className="mb-2 block text-sm font-medium text-ink"
          variant="unstyled"
        >
          {t('filters.sort')}
        </Text>
        <Select
          ariaLabel={t('filters.sort')}
          onChange={(value) => setFilter('sort', value)}
          options={sortOptions}
          value={filters.sort}
          variant="field"
        />
      </div>
    </div>
  )
}

export const CatalogControls = ({
  filters,
  searchDraft,
  setSearchDraft,
  setFilter,
  clearFilter,
  clearAll
}: CatalogControlsProps) => {
  const { t } = useI18n()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const abilityQuery = useQuery(pokemonAbilityNamesOptions())
  const abilityNames = abilityQuery.data ?? []
  const typeLabel = getPokemonTypeLabel(filters.type, t)
  const chips: Array<{
    key: ChipKey
    value: string
    displayValue: string
    label: string
  }> = [
    {
      key: 'search',
      value: filters.search,
      displayValue: filters.search,
      label: t('filters.search')
    },
    {
      key: 'type',
      value: filters.type,
      displayValue: typeLabel,
      label: t('filters.type')
    },
    {
      key: 'generation',
      value: filters.generation,
      displayValue: filters.generation,
      label: t('filters.generation')
    },
    {
      key: 'ability',
      value: filters.ability,
      displayValue: filters.ability.replaceAll('-', ' '),
      label: t('filters.ability')
    }
  ]
  const activeChips = chips.filter(({ value }) => value.length > 0)

  return (
    <div className="mt-9">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex min-w-0 flex-1 items-end gap-2">
          <TextInput
            id="catalog-search"
            label={t('filters.search')}
            onChange={(event) => setSearchDraft(event.target.value)}
            placeholder={t('search.placeholder')}
            type="search"
            value={searchDraft}
          />
          <Button
            aria-label={t('filters.clearSearch')}
            className="!h-12 !w-12 shrink-0 !px-0"
            disabled={searchDraft.length === 0}
            onClick={() => setSearchDraft('')}
            variant="outline"
          >
            <Icon name="x" size={18} />
          </Button>
        </div>
        <Button
          className="md:hidden"
          onClick={() => dialogRef.current?.showModal()}
          variant="outline"
        >
          <Icon name="sliders" size={18} />
          {t('filters.open')}
        </Button>
      </div>

      <div className="mt-5 hidden md:block">
        <FilterFields
          abilityNames={abilityNames}
          abilityLoading={abilityQuery.isPending}
          abilityUnavailable={abilityQuery.isError}
          filters={filters}
          setFilter={setFilter}
        />
      </div>

      <ShouldRender if={abilityQuery.isError}>
        <div className="mt-3 flex items-center gap-3">
          <Text className="text-sm" variant="muted">
            {t('filters.abilityOptionsError')}
          </Text>
          <Button onClick={() => void abilityQuery.refetch()} variant="ghost">
            {t('list.retry')}
          </Button>
        </div>
      </ShouldRender>

      <ShouldRender if={activeChips.length > 0}>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {activeChips.map(({ key, displayValue, label }) => (
            <Button
              aria-label={t('filters.remove', { label, value: displayValue })}
              className="min-h-9 rounded-full px-3 py-1 text-xs"
              key={key}
              onClick={() => clearFilter(key)}
              variant="outline"
            >
              {label}: {displayValue}
              <Icon name="x" size={14} />
            </Button>
          ))}
          <Button
            className="min-h-9 px-3 py-1 text-xs"
            onClick={clearAll}
            variant="ghost"
          >
            {t('filters.clearAll')}
          </Button>
        </div>
      </ShouldRender>

      <dialog
        aria-label={t('filters.open')}
        className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[85vh] w-full max-w-none overflow-y-auto rounded-t-3xl border-0 bg-surface p-5 text-ink backdrop:bg-ink/50 md:hidden"
        ref={dialogRef}
      >
        <div className="mb-6 flex items-center justify-between">
          <Text
            as="h3"
            className="font-display text-xl font-medium"
            variant="unstyled"
          >
            {t('filters.open')}
          </Text>
          <Button
            aria-label={t('filters.close')}
            className="!w-11 !px-0"
            onClick={() => dialogRef.current?.close()}
            variant="outline"
          >
            <Icon name="x" size={18} />
          </Button>
        </div>
        <FilterFields
          abilityNames={abilityNames}
          abilityLoading={abilityQuery.isPending}
          abilityUnavailable={abilityQuery.isError}
          filters={filters}
          setFilter={setFilter}
        />
        <Button
          className="mt-7 w-full"
          onClick={() => dialogRef.current?.close()}
        >
          {t('filters.showResults')}
        </Button>
      </dialog>
    </div>
  )
}
