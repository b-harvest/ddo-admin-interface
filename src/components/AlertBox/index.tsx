import AlertIcon from 'components/AlertIcon'
import { CSSProperties, ReactElement } from 'react'
import type { AlertStatus } from 'types/alert'
interface AlertBoxProps {
  msg: string
  status: AlertStatus
  isActive?: boolean
}

export default function AlertBox({ msg, status, isActive = true }: AlertBoxProps) {
  return (
    <div
      className={`${
        isActive ? 'block opacity-1' : 'hidden opacity-0'
      } w-full relative flex justify-start items-start transition-opacity px-4 py-2 rounded-lg border ${getCSSClassbyStatus(
        status
      )}`}
    >
      <AlertIcon size="sm" status={status} />
      <AlertBoxMsg status={status} msg={msg} />
    </div>
  )
}

function getCSSClassbyStatus(status: AlertStatus) {
  switch (status) {
    case 'info':
      return `bg-[#F3F6FF] dark:bg-info-o border-info`
      break
    case 'success':
      return `bg-[#F5FBF8] dark:bg-success-o border-success`
      break
    case 'error':
      return `bg-[#FDF4F4] dark:bg-error-o border-error`
      break
    case 'warning':
      return `bg-[#FFFAF1] dark:bg-warning-o border-warning`
      break
    default:
      return ''
  }
}

function AlertBoxMsg({ status, msg }: AlertBoxProps) {
  const className = `TYPO-BODY-S FONT-MONO !font-bold text-left whitespace-pre-line ml-2`
  const style = { wordBreak: 'keep-all' } as CSSProperties

  // without returning the JSX element directly, the Tailwind colors dont work
  let html: ReactElement

  switch (status) {
    case 'error':
      html = (
        <div style={style} className={`${className} !text-error`}>
          {msg}
        </div>
      )
      break
    case 'success':
      html = (
        <div style={style} className={`${className} !text-success`}>
          {msg}
        </div>
      )
      break

    case 'warning':
      html = (
        <div style={style} className={`${className} !text-warning`}>
          {msg}
        </div>
      )
      break

    case 'info':
      html = (
        <div style={style} className={`${className} !text-info`}>
          {msg}
        </div>
      )
      break
    default:
      html = (
        <div style={style} className={className}>
          {msg}
        </div>
      )
  }

  return html
}
