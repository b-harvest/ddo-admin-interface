import { ReactNode, useEffect, useState } from 'react'
import { AlertStatus } from 'types/alert'

export default function Polling({
  label,
  status = 'info',
  className,
}: {
  label?: string
  status?: AlertStatus
  className?: string
}) {
  const [isMounting, setIsMounting] = useState(false)

  useEffect(() => {
    if (!label) return

    setIsMounting(true)
    const mountingTimer = setTimeout(() => setIsMounting(false), 1000)

    return () => {
      clearTimeout(mountingTimer)
    }
  }, [label])

  return (
    <div className={`${className} flex items-center space-x-2 TYPO-BODY-S ${textCSSByStatus(status)}`}>
      <div className={`${isMounting ? 'opacity-50' : ''}`}>{label}</div>
      <PollingDot status={status}>
        <PollingSpinner status={status} isMounting={isMounting} />
      </PollingDot>
    </div>
  )
}

function PollingDot({ children, status }: { children: ReactNode; status: AlertStatus }) {
  return (
    <div
      className={`${bgCSSByStatus(status)} relative w-2 h-2 min-w-[0.5rem] min-h-[0.5rem] rounded-full`}
      style={{ transition: `background-color ease 250ms` }}
    >
      {children}
    </div>
  )
}

function PollingSpinner({ status, isMounting = false }: { status: AlertStatus; isMounting?: boolean }) {
  return (
    <div
      className={`${
        isMounting ? 'animate-spinning border-l-2' : 'border-l-0'
      } relative -left-[3px] -top-[3px] w-3.5 h-3.5 rounded-full ${borderCSSByStatus(
        status
      )} border-t border-r border-b border-t-transparent border-r-transparent border-b-transparent bg-transparent`}
    >
      <span className="SCREEN-READER">The data is fetching</span>
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
      return 'text-neutral'
  }
}

function bgCSSByStatus(status: AlertStatus) {
  switch (status) {
    case 'info':
      return 'bg-info'
    case 'error':
      return 'bg-error'
    case 'warning':
      return 'bg-warning'
    case 'success':
      return 'bg-success'
    default:
      return 'bg-neutral'
  }
}

function borderCSSByStatus(status: AlertStatus) {
  switch (status) {
    case 'info':
      return 'border-info'
    case 'error':
      return 'border-error'
    case 'warning':
      return 'border-warning'
    case 'success':
      return 'border-success'
    default:
      return 'border-neutral'
  }
}
