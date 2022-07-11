import Light from 'components/Light'
import { CSSProperties, ReactElement } from 'react'
import type { STATUS } from 'types/status'

interface NotiLineProps {
  msg: string
  color: STATUS
  isActive?: boolean
}

export default function NotiLine({ msg, color, isActive = true }: NotiLineProps) {
  return (
    <div
      className={`${
        isActive ? 'block' : 'hidden opacity-0'
      } relative flex justify-start items-start transition-opacity`}
    >
      {/* the below 1px minus is to resolve visual perception issue, 
      which results that the dot looks in the middle */}
      <Light color={color} size="sm" className="translate-y-[calc(((1.25rem-0.5rem)/2)-1px)]" />
      <NotiLineMsg color={color} msg={msg} />
    </div>
  )
}

function NotiLineMsg({ color, msg }: NotiLineProps) {
  const className = `TYPO-BODY-XS !font-bold text-left ml-2`
  const style = { wordBreak: 'keep-all' } as CSSProperties

  // without returning the JSX element directly, the Tailwind colors dont work
  let html: ReactElement

  switch (color) {
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
