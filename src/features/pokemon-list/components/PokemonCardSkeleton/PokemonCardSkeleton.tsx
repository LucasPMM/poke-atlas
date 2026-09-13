import { Skeleton } from '@/components/ui/Skeleton'

export const PokemonCardSkeleton = () => {
  return (
    <div aria-hidden="true" className="rounded-2xl bg-surface p-3 sm:p-4">
      <Skeleton className="aspect-square w-full rounded-xl" />
      <div className="px-1 pb-1 pt-4">
        <Skeleton className="h-3 w-14 rounded-md" />
        <Skeleton className="mt-2 h-10 w-3/4 rounded-md" />
      </div>
    </div>
  )
}
