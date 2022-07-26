import { HTMLAttributes, ReactNode } from 'react'

export type CardMergedSide = 'top' | 'right' | 'bottom' | 'left' | 'right-bottom' | 'left-top'

type CardProps = {
  children?: ReactNode
  useGlassEffect?: boolean
  className?: string
  merged?: CardMergedSide
} & Omit<HTMLAttributes<HTMLDivElement>, 'className'>

export default function Card({ children, useGlassEffect = false, className = '', merged, ...rest }: CardProps) {
  return (
    <div
      {...rest}
      className={`${className} ${
        useGlassEffect
          ? 'bg-[rgba(217, 217, 217, 0.1)] shadow-[0_1px_1px_1px_rgb(0,0,0,0.1)] dark:shadow-none dark:bg-neutral-800/50 backdrop-blur-[40px]'
          : 'bg-neutral-900 dark:bg-neutral-800'
      } relative flex flex-col p-4 rounded-xl ${getRadiusByMergedSide(merged)} `}
    >
      {children}
    </div>
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
