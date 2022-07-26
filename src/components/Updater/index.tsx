import { useEffect, useState } from 'react'
import { AlertStatus } from 'types/alert'

export default function Updater({
  label,
  labelPrefix = '',
  status = 'info',
  className,
  onClick,
}: {
  label?: string | JSX.Element
  labelPrefix?: string | JSX.Element
  status?: AlertStatus
  className?: string
  onClick?: () => void
}) {
  const [isMounting, setIsMounting] = useState<boolean>(false)
  const [mountedLabel, setMountedLabel] = useState<string | JSX.Element>('')

  useEffect(() => {
    if (!label) return

    setIsMounting(true)
    const mountingTimer = setTimeout(() => setIsMounting(false), 1000)
    const labelTimer = setTimeout(() => setMountedLabel(label), 500)

    return () => {
      clearTimeout(mountingTimer)
      clearTimeout(labelTimer)
    }
  }, [label])

  return (
    <div
      className={`${className} w-full flex items-center space-x-2 TYPO-BODY-XS ${textCSSByStatus(status)} ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div
        className={`w-full flex justify-between items-center transition-opacity hover:opacity-50 ${
          isMounting ? 'opacity-50' : ''
        }`}
      >
        <span className="whitespace-pre-wrap">{labelPrefix}</span>
        <span className={`!font-bold ${isMounting ? 'animate-update' : ''}`}>{mountedLabel}</span>
      </div>
    </div>
  )
}

function textCSSByStatus(status: AlertStatus) {
  switch (status) {
    case 'info':
      return 'text-info'
    case 'error':
      return 'text-error'
    case 'warning':
      return 'text-warning'
    case 'success':
      return 'text-success'
    default:
      return 'text-black dark:text-white'
  }
}
