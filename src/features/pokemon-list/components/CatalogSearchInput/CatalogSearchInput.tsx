import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { TextInput } from '@/components/ui/TextInput'
import { useDebouncedValue } from '@/lib/debounce/useDebouncedValue'
import { useI18n } from '@/lib/i18n'

type CatalogSearchInputProps = {
  search: string
  onCommit: (value: string) => void
}

export const CatalogSearchInput = ({
  search,
  onCommit
}: CatalogSearchInputProps) => {
  const { t } = useI18n()
  const [draft, setDraft] = useState(search)
  const [isDirty, setIsDirty] = useState(false)
  const debouncedDraft = useDebouncedValue(draft)

  useEffect(() => {
    setDraft(search)
    setIsDirty(false)
  }, [search])

  useEffect(() => {
    if (!isDirty || debouncedDraft !== draft) {
      return
    }

    const normalized = debouncedDraft.trim()

    if (normalized !== search) {
      onCommit(normalized)
    }
  }, [debouncedDraft, draft, isDirty, onCommit, search])

  const updateDraft = (value: string) => {
    setDraft(value)
    setIsDirty(true)
  }

  const clear = () => {
    setDraft('')
    setIsDirty(false)

    if (search.length > 0) {
      onCommit('')
    }
  }

  return (
    <div className="flex min-w-0 flex-1 items-end gap-2">
      <TextInput
        id="catalog-search"
        label={t('filters.search')}
        onChange={(event) => updateDraft(event.target.value)}
        placeholder={t('search.placeholder')}
        type="search"
        value={draft}
      />
      <Button
        aria-label={t('filters.clearSearch')}
        className="!h-12 !w-12 shrink-0 !px-0"
        disabled={draft.length === 0}
        onClick={clear}
        variant="outline"
      >
        <Icon name="x" size={18} />
      </Button>
    </div>
  )
}
