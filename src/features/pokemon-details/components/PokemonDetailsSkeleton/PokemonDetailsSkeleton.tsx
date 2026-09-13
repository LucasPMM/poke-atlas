import { Skeleton } from '@/components/ui/Skeleton'
import { Text } from '@/components/ui/Text'
import { useI18n } from '@/lib/i18n'

export const PokemonDetailsSkeleton = () => {
  const { t } = useI18n()

  return (
    <section
      className="page-container min-h-[60vh] py-16 md:py-24"
      role="status"
    >
      <Text className="sr-only" variant="unstyled">
        {t('details.loading')}
      </Text>
      <Skeleton className="h-5 w-32" />
      <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
        <div>
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-6 h-16 w-4/5" />
          <div className="mt-8 grid max-w-sm grid-cols-2 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
        <Skeleton className="aspect-square w-full rounded-3xl" />
      </div>
    </section>
  )
}
