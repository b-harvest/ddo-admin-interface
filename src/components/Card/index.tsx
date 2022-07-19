import { HTMLAttributes, ReactNode } from 'react'

type CardProps = {
  children?: ReactNode
  className?: string
} & Omit<HTMLAttributes<HTMLDivElement>, 'className'>

export default function Card({ children, className = '', ...rest }: CardProps) {
  return (
    <div {...rest} className={`${className} flex flex-col w-full bg-neutral-900 p-4 rounded-xl dark:bg-neutral-800`}>
      {children}
    </div>
  )
}
