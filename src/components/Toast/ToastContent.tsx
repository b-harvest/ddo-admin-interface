import AlertIcon from 'components/AlertIcon'
import type { AlertStatus } from 'types/alert'

interface ToastContentProps {
  status: AlertStatus
  msg: string
}
export default function ToastContent({ status, msg }: ToastContentProps) {
  return (
    <div className={`relative flex justify-start items-start TYPO-BODY-S text-${status} !font-medium`}>
      <AlertIcon size="sm" status={status} />
      <div>{msg}</div>
    </div>
  )
}
