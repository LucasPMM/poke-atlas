import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Compass,
  Layers3,
  type LucideProps,
  Moon,
  Search,
  Sparkles,
  Sun,
  Waypoints
} from 'lucide-react'

const icons = {
  arrowDownRight: ArrowDownRight,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  arrowUpRight: ArrowUpRight,
  compass: Compass,
  layers: Layers3,
  moon: Moon,
  search: Search,
  sparkles: Sparkles,
  sun: Sun,
  waypoints: Waypoints
}

export type IconName = keyof typeof icons

type IconProps = LucideProps & { name: IconName }

export const Icon = ({ name, ...props }: IconProps) => {
  const Glyph = icons[name]
  return <Glyph aria-hidden="true" {...props} />
}
