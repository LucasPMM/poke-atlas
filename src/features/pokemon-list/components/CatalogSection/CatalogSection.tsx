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
      </div>

      <CatalogControls {...controls} />
      <ShouldRender if={isFiltered}>
        <FilteredCatalogResults
          filters={filters}
          key={JSON.stringify(filters)}
        />
      </ShouldRender>
      <ShouldRender if={!isFiltered}>
        <DefaultCatalogResults />
      </ShouldRender>
    </section>
  )
}
