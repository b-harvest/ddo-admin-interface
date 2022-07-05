import { ReactNode } from 'react'

interface StickerProps {
  children: ReactNode
  useWidthFull?: boolean
}

export default function Sticker({ children }: StickerProps) {
  return (
    <div
      className={`w-full bg-transparent backdrop-blur-[40px] border-grayCRE-200 border-b-[1px] dark:bg-neutral-900 dark:bg-opacity-30 dark:border-grayCRE-400-o`}
    >
      {children}
    </div>
  )
}
