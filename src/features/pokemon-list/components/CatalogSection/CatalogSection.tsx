import { ShouldRender } from '@/components/ui/ShouldRender'
import { Text } from '@/components/ui/Text'
import { useI18n } from '@/lib/i18n'
import { useCatalogUrlFilters } from '../../hooks/useCatalogUrlFilters'
import { CatalogControls } from '../CatalogControls'
import { DefaultCatalogResults } from '../DefaultCatalogResults'
import { FilteredCatalogResults } from '../FilteredCatalogResults'

export const CatalogSection = () => {
  const { t } = useI18n()
  const controls = useCatalogUrlFilters()
  const { filters } = controls
  const isFiltered =
    filters.search.length > 0 ||
    filters.type.length > 0 ||
    filters.generation.length > 0 ||
    filters.ability.length > 0 ||
    filters.sort !== 'number-asc'

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
        <Link
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-muted"
          to="/compare"
        >
          <Icon name="layers" size={18} />
          {t('compare.open')}
          <Icon name="arrowUpRight" size={16} />
        </Link>
      </div>

      <CatalogControls {...controls} />
      <ShouldRender if={isFiltered}>
        <FilteredCatalogResults
          filters={filters}
          key={JSON.stringify(filters)}
          onClearFilters={controls.clearAll}
        />
      </ShouldRender>
      <ShouldRender if={!isFiltered}>
        <DefaultCatalogResults />
      </ShouldRender>
    </section>
  )
}

import { Link } from 'react-router'
import { Icon } from '@/components/ui/Icon'
