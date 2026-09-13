import { Skeleton } from '@/components/ui/Skeleton'
import { Text } from '@/components/ui/Text'
import { useI18n } from '@/lib/i18n'

export const PokemonDetailsSkeleton = () => {
  const { t } = useI18n()

  return (
    <section
      className="page-container min-h-[60vh] py-10 pb-16 md:py-16 md:pb-24"
      role="status"
    >
      <Text className="sr-only" variant="unstyled">
        {t('details.loading')}
      </Text>
      <Skeleton className="h-5 w-32" />
      <div className="mt-8 grid items-center gap-8 md:grid-cols-2 md:gap-14">
        <div>
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-5 h-16 w-4/5" />
          <div className="mt-6 flex gap-2">
            <Skeleton className="h-9 w-20 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>
          <Skeleton className="mt-7 h-5 w-full max-w-lg" />
          <Skeleton className="mt-2 h-5 w-4/5 max-w-lg" />
          <div className="mt-8 grid max-w-sm grid-cols-2 gap-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
        <Skeleton className="aspect-square w-full rounded-3xl" />
      </div>
      <div className="mt-12 flex gap-2 overflow-hidden" aria-hidden="true">
        {[0, 1, 2, 3].map((index) => (
          <Skeleton className="h-11 w-28 shrink-0 rounded-lg" key={index} />
        ))}
      </div>
      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-96 rounded-3xl" />
        <Skeleton className="h-56 rounded-3xl lg:col-span-2" />
        <Skeleton className="h-72 rounded-3xl lg:col-span-2" />
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-72 rounded-3xl lg:col-span-2" />
      </div>
    </section>
  )
}
