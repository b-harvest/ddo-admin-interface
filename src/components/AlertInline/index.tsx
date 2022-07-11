import AlertIcon from 'components/AlertIcon'
import { CSSProperties, ReactElement } from 'react'
import type { AlertStatus } from 'types/alert'
interface AlertInlineProps {
  msg: string
  status: AlertStatus
  isActive?: boolean
}

export default function AlertInline({ msg, status, isActive = true }: AlertInlineProps) {
  return (
    <div
      className={`${
        isActive ? 'block' : 'hidden opacity-0'
      } relative flex justify-start items-start transition-opacity`}
    >
      <AlertIcon size="sm" status={status} />
      <AlertInlineMsg status={status} msg={msg} />
    </div>
  )
}

function AlertInlineMsg({ status, msg }: AlertInlineProps) {
  const className = `TYPO-BODY-XS !font-bold text-left ml-2`
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
