import { ReactNode } from 'react'

interface StickerProps {
  children: ReactNode
  useWidthFull?: boolean
}

export default function Sticker({ children }: StickerProps) {
  return (
    <div
      className={`w-full bg-grayCRE-50-0 backdrop-blur-[20px] border-grayCRE-200 border-b-[1px] md:w-fit md:border-[1px] md:rounded-md md:shadow-lg`}
    >
      {children}
    </div>
  )
}
