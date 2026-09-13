import { useCallback } from 'react'
import { useSearchParams } from 'react-router'
import { type CatalogFilters, isCatalogSort } from '../catalog-filters'

type FilterKey = 'search' | 'type' | 'generation' | 'ability' | 'sort'

export const useCatalogUrlFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const sortParam = searchParams.get('sort')
  const filters: CatalogFilters = {
    search: searchParams.get('search') ?? '',
    type: searchParams.get('type') ?? '',
    generation: searchParams.get('generation') ?? '',
    ability: searchParams.get('ability') ?? '',
    sort: isCatalogSort(sortParam) ? sortParam : 'number-asc'
  }
  const setFilter = useCallback(
    (key: FilterKey, value: string, replace = false) => {
      const next = new URLSearchParams(searchParams)

      if (value.length === 0 || (key === 'sort' && value === 'number-asc')) {
        next.delete(key)
      }

      if (value.length > 0 && (key !== 'sort' || value !== 'number-asc')) {
        next.set(key, value)
      }

      setSearchParams(next, { replace })
    },
    [searchParams, setSearchParams]
  )

  const clearAll = () => {
    setSearchParams(new URLSearchParams())
  }

  const clearFilter = (key: Exclude<FilterKey, 'sort'>) => {
    setFilter(key, '')
  }

  return {
    filters,
    setFilter,
    clearAll,
    clearFilter
  }
}
