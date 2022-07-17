import { ReactNode } from 'react'

export default function Indicator({
  title,
  label,
  children,
  className,
  light = false,
}: {
  title?: string
  label?: string
  children: ReactNode
  className?: string
  light?: boolean
}) {
  return (
    <div className={`text-white text-left ${className}`}>
      {title && (
        <div
          className={`${
            light ? 'text-grayCRE-300 dark:text-grayCRE-400' : 'text-grayCRE-400-o'
          } TYPO-BODY-M !font-medium mb-2`}
        >
          {title}
        </div>
      )}
      <div className="flex flex-col justify-start items-start space-y-2">
        {children}
        {label && <div className="TYPO-BODY-XS !font-medium">{label}</div>}
      </div>
    </div>
  )
}
