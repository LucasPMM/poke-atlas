import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { pokemonCatalogOptions } from '@/api/pokemon'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { ShouldRender } from '@/components/ui/ShouldRender'
import { Skeleton } from '@/components/ui/Skeleton'
import { Text } from '@/components/ui/Text'
import { useI18n } from '@/lib/i18n'

type CompareValues = { first: string; second: string }

type CompareFormProps = CompareValues & {
  onCompare: (values: CompareValues) => void
}

export const CompareForm = ({ first, second, onCompare }: CompareFormProps) => {
  const { t } = useI18n()
  const catalogQuery = useQuery(pokemonCatalogOptions())
  const schema = useMemo(
    () =>
      z
        .object({
          first: z.string().min(1, t('compare.required')),
          second: z.string().min(1, t('compare.required'))
        })
        .refine(
          ({ first: firstId, second: secondId }) =>
            firstId.length === 0 ||
            secondId.length === 0 ||
            firstId !== secondId,
          { message: t('compare.same'), path: ['second'] }
        ),
    [t]
  )
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<CompareValues>({
    defaultValues: { first, second },
    resolver: zodResolver(schema)
  })
  const options = useMemo(
    () => [
      { value: '', label: t('compare.choose') },
      ...(catalogQuery.data ?? []).map(({ id, name }) => ({
        value: String(id),
        label: `#${String(id).padStart(4, '0')} · ${name.replaceAll('-', ' ')}`
      }))
    ],
    [catalogQuery.data, t]
  )

  return (
    <form
      className="mt-8 rounded-3xl bg-surface p-5 md:p-7"
      onSubmit={handleSubmit(onCompare)}
    >
      <div className="grid gap-5 md:grid-cols-[1fr_1fr_auto] md:items-end">
        {(['first', 'second'] as const).map((fieldName) => (
          <div className="min-w-0" key={fieldName}>
            <label
              className="mb-2 block text-sm font-medium text-ink"
              htmlFor={`compare-${fieldName}`}
            >
              {t(`compare.${fieldName}`)}
            </label>
            <Controller
              control={control}
              name={fieldName}
              render={({ field }) => (
                <Select
                  ariaLabel={t(`compare.${fieldName}`)}
                  inputId={`compare-${fieldName}`}
                  disabled={catalogQuery.isPending || catalogQuery.isError}
                  loading={catalogQuery.isPending}
                  onChange={field.onChange}
                  options={options}
                  searchable
                  value={field.value}
                  variant="field"
                />
              )}
            />
            <ShouldRender if={Boolean(errors[fieldName])}>
              <Text className="mt-2 text-sm text-error" variant="unstyled">
                {errors[fieldName]?.message}
              </Text>
            </ShouldRender>
          </div>
        ))}
        <Button
          className="w-full md:w-auto"
          disabled={catalogQuery.isPending || catalogQuery.isError}
          type="submit"
        >
          {t('compare.action')}
        </Button>
      </div>
      <ShouldRender if={catalogQuery.isPending}>
        <div
          aria-label={t('compare.loadingCatalog')}
          className="mt-4 flex gap-3"
          role="status"
        >
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </ShouldRender>
      <ShouldRender if={catalogQuery.isError}>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Text className="text-sm text-error" variant="unstyled">
            {t('compare.catalogError')}
          </Text>
          <Button onClick={() => void catalogQuery.refetch()} variant="outline">
            {t('compare.retry')}
          </Button>
        </div>
      </ShouldRender>
    </form>
  )
}
