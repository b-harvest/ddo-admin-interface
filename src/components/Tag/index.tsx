import { ReactNode } from 'react'

export default function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`${className} inline-block px-1 py-0.5 bg-white rounded-md TYPO-BODY-2XS text-grayCRE-400 font-mono !font-medium !whitespace-nowrap md:TYPO-BODY-XS`}
    >
      {children}
    </span>
  )
}
