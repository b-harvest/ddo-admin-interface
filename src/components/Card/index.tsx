import { HTMLAttributes, ReactNode } from 'react'

export type CardMergedSide = 'top' | 'right' | 'bottom' | 'left' | 'right-bottom' | 'left-top'

type CardProps = {
  children?: ReactNode
  useGlassEffect?: boolean
  saturated?: boolean
  className?: string
  merged?: CardMergedSide
} & Omit<HTMLAttributes<HTMLDivElement>, 'className'>

export default function Card({
  children,
  useGlassEffect = false,
  saturated = false,
  className = '',
  merged,
  ...rest
}: CardProps) {
  return (
    <div
      {...rest}
      className={`bg-grayCRE-200-o dark:bg-neutral-800/50 ${
        saturated ? (useGlassEffect ? '!bg-white/50 dark:!bg-neutral-900/50' : '!bg-white dark:!bg-neutral-900') : ''
      } ${useGlassEffect ? 'backdrop-blur-[40px]' : ''} relative flex flex-col p-4 rounded-xl ${getRadiusByMergedSide(
        merged
      )} ${className}`}
    >
      {children}
    </div>
    // border border-[rgba(0,0,0,0.05)]
  )
}

function getRadiusByMergedSide(merged?: CardMergedSide) {
  switch (merged) {
    case 'top':
      return `rounded-t-none`
    case 'right':
      return `rounded-r-none`
    case 'bottom':
      return `rounded-b-none`
    case 'left':
      return `rounded-l-none`
    case 'right-bottom':
      return `rounded-b-none md:rounded-l-xl md:rounded-r-none`
    case 'left-top':
      return `rounded-t-none md:rounded-r-xl md:rounded-l-none`
    default:
      return ''
  }
}
