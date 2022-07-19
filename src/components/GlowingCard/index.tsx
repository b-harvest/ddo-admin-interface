import { ReactNode } from 'react'

export default function GlowingCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative bg-white dark:bg-neutral-800 text-black dark:text-white rounded-xl shadow-glow-wide-l dark:shadow-glow-wide-d p-8 ${className}`}
    >
      {children}
    </div>
  )
}
