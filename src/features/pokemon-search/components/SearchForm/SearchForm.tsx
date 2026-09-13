import { zodResolver } from '@hookform/resolvers/zod'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { TextInput } from '@/components/ui/TextInput'
import { useI18n } from '@/lib/i18n'
import { scrollToSection } from '@/lib/motion/scroll-to-section'

type SearchValues = { query: string }

export const SearchForm = () => {
  const { t } = useI18n()
  const navigate = useNavigate()
  const schema = useMemo(
    () => z.object({ query: z.string().trim().min(1, t('search.required')) }),
    [t]
  )
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SearchValues>({ resolver: zodResolver(schema) })
  const onSubmit = ({ query }: SearchValues) => {
    const search = new URLSearchParams({ search: query.trim() })
    navigate({ pathname: '/', search: search.toString() })
    scrollToSection('catalog')
  }

  return (
    <form
      className="mt-8 flex max-w-xl flex-col items-start gap-3 sm:flex-row sm:items-end"
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextInput
        error={errors.query?.message}
        id="pokemon-search"
        label={t('search.label')}
        placeholder={t('search.placeholder')}
        {...register('query')}
      />
      <Button className="w-full sm:mb-0 sm:w-auto sm:px-6" type="submit">
        <Icon name="search" size={17} />
        {t('search.action')}
      </Button>
    </form>
  )
}
