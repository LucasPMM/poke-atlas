import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { useDebouncedValue } from '@/lib/debounce/useDebouncedValue'
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
  const [searchDraft, setSearchDraftState] = useState(filters.search)
  const [isSearchDirty, setIsSearchDirty] = useState(false)
  const debouncedSearch = useDebouncedValue(searchDraft)
  const setSearchDraft = (value: string) => {
    setSearchDraftState(value)
    setIsSearchDirty(true)
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

  useEffect(() => {
    setSearchDraftState(filters.search)
    setIsSearchDirty(false)
  }, [filters.search])

  useEffect(() => {
    if (!isSearchDirty || debouncedSearch !== searchDraft) {
      return
    }

    const normalized = debouncedSearch.trim()

    if (normalized === filters.search) {
      return
    }

    setFilter('search', normalized, true)
  }, [debouncedSearch, filters.search, isSearchDirty, searchDraft, setFilter])

  const clearAll = () => {
    setSearchDraftState('')
    setIsSearchDirty(false)
    setSearchParams(new URLSearchParams())
  }

  const clearFilter = (key: Exclude<FilterKey, 'sort'>) => {
    if (key === 'search') {
      setSearchDraftState('')
      setIsSearchDirty(false)
    }

    setFilter(key, '')
  }

  return {
    filters,
    searchDraft,
    setSearchDraft,
    setFilter,
    clearAll,
    clearFilter
  }
}
