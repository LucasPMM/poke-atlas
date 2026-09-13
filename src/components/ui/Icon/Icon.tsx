import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Compass,
  Layers3,
  type LucideProps,
  Moon,
  Search,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Waypoints,
  X
} from 'lucide-react'

const icons = {
  arrowDownRight: ArrowDownRight,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  arrowUpRight: ArrowUpRight,
  chevronDown: ChevronDown,
  compass: Compass,
  layers: Layers3,
  moon: Moon,
  search: Search,
  sliders: SlidersHorizontal,
  sparkles: Sparkles,
  sun: Sun,
  waypoints: Waypoints,
  x: X
}

export type IconName = keyof typeof icons

type IconProps = LucideProps & { name: IconName }

export const Icon = ({ name, ...props }: IconProps) => {
  const Glyph = icons[name]
  return <Glyph aria-hidden="true" {...props} />
}
