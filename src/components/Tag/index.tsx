import { ReactNode } from 'react'

export default function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`${className} inline-block px-2 py-0.5 bg-white dark:bg-black rounded-md border border-grayCRE-200 dark:border-0 TYPO-BODY-2XS text-grayCRE-300 FONT-MONO !font-medium !whitespace-nowrap md:TYPO-BODY-XS`}
    >
      {children}
    </span>
  )
}
