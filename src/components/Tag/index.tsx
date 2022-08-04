import { ReactNode } from 'react'
import { AlertStatus } from 'types/alert'

export default function Tag({
  children,
  className,
  status,
}: {
  children: ReactNode
  className?: string
  status?: AlertStatus | 'strong'
}) {
  return (
    <span
      className={`${className} inline-block px-2 py-0.5 rounded-md border TYPO-BODY-XS FONT-MONO !font-medium !whitespace-pre ${CSSByStatus(
        status
      )}`}
    >
      {children}
    </span>
  )
}

function CSSByStatus(status?: AlertStatus | 'strong') {
  switch (status) {
    case 'info':
      return `text-info bg-[#F3F6FF] dark:bg-info-o border-info`
    case 'success':
      return `text-success bg-[#F5FBF8] dark:bg-success-o border-success`
    case 'error':
      return `text-error bg-[#FDF4F4] dark:bg-error-o border-error`
    case 'warning':
      return `text-warning bg-[#FFFAF1] dark:bg-warning-o border-warning`
    case 'strong':
      return `text-black bg-glowCRE border-0`
    default:
      return 'text-grayCRE-300 bg-white dark:bg-black border-grayCRE-200 dark:border-0'
  }
}
