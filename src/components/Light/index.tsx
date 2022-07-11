import { ReactElement } from 'react'
import type { AlertStatus } from 'types/alert'

type LightColor = AlertStatus
type LightSize = 'sm' | 'md' | 'lg'

interface LightProps {
  size?: LightSize
  color?: LightColor
  className?: string
}

export default function Light({ color, size = 'md', className = '' }: LightProps) {
  const calcClassName = `${className} shrink-0 grow-0 inline-block rounded-full shadow-md ${getSizeClass(size)}`

  let html: ReactElement

  switch (color) {
    case 'error':
      html = <div className={`${calcClassName} bg-error shadow-error`}></div>
      break
    case 'success':
      html = <div className={`${calcClassName} bg-success shadow-success`}></div>
      break

    case 'warning':
      html = <div className={`${calcClassName} bg-warning shadow-warning`}></div>
      break

    case 'info':
      html = <div className={`${calcClassName} bg-info shadow-info`}></div>
      break
    default:
      html = <div className={calcClassName}></div>
  }

  return html
}

// the below function is not available since Tailwind color utils get compiled before DOM update
// function getColorClass(color: LightColor) {
//   return `bg-${color}  shadow-${color}`
// }

function getSizeClass(size: string) {
  switch (size) {
    case 'sm':
      return 'w-2 h-2'
      break
    case 'md':
      return 'w-4 h-4'
      break
    case 'lg':
      return 'w-6 h-6'
      break
    default:
      return 'w-4 h-4'
  }
}
