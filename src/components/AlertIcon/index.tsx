import { useAtom } from 'jotai'
import ErrorIcon from 'resources/svgs/icon-error.svg'
import InfoIcon from 'resources/svgs/icon-info.svg'
import NeutralIcon from 'resources/svgs/icon-neutral.svg'
import NeutralDarkIcon from 'resources/svgs/icon-neutral-dark.svg'
import SuccessIcon from 'resources/svgs/icon-success.svg'
import WarningIcon from 'resources/svgs/icon-warning.svg'
import { isDarkModeAtomRef } from 'state/atoms'
import { AlertStatus } from 'types/alert'

/* the below 1px minus is to resolve visual perception issue, 
      which results that the dot looks in the middle */
export default function AlertIcon({ size, status }: { size: string; status: AlertStatus }) {
  const [isDarkModeAtom] = useAtom(isDarkModeAtomRef)
  return (
    <img
      src={getIconSrcByStatus(status, isDarkModeAtom)}
      alt="Success"
      className={`${getSizeClass(size)} block min-w-fit translate-y-[calc(((1.25rem-0.5rem)/2)-1px)]`}
    />
  )
}

function getIconSrcByStatus(status: AlertStatus, isDarkMode: boolean) {
  switch (status) {
    case 'success':
      return SuccessIcon
      break
    case 'info':
      return InfoIcon
      break
    case 'warning':
      return WarningIcon
      break
    case 'error':
      return ErrorIcon
      break
    default:
      return isDarkMode ? NeutralDarkIcon : NeutralIcon
  }
}

function getSizeClass(size: string) {
  switch (size) {
    case 'sm':
      return 'w-3 h-3'
      break
    case 'md':
      return 'w-4 h-4'
      break
    case 'lg':
      return 'w-6 h-6'
      break
    default:
      return 'w-3 h-3'
  }
}
