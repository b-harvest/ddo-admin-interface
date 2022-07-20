import { HTMLAttributes, ReactNode } from 'react'

export type CardMergedSide = 'top' | 'right' | 'bottom' | 'left' | 'right-bottom' | 'left-top'

type CardProps = {
  children?: ReactNode
  className?: string
  merged?: CardMergedSide
} & Omit<HTMLAttributes<HTMLDivElement>, 'className'>

export default function Card({ children, className = '', merged, ...rest }: CardProps) {
  return (
    <div
      {...rest}
      className={`${className} flex flex-col bg-neutral-900 p-4 rounded-xl ${getRadiusByMergedSide(
        merged
      )} dark:bg-neutral-800`}
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
