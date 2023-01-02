import Icon, { IconType } from 'components/Icon'

interface IconButtonProps {
  type: IconType
  label?: string
  showLabel?: boolean
  onClick?: () => void
  className?: string
  iconClassName?: string
}

export default function IconButton({
  type,
  label = `${type}`,
  showLabel = false,
  onClick = () => {},
  className = '',
  iconClassName = '',
}: IconButtonProps) {
  return (
    <button type="button" onClick={onClick} className={`${className} flex justify-center items-center overflow-hidden`}>
      <Icon type={type} className={iconClassName} />
      <div className={showLabel ? 'ml-1' : 'sr-only'}>{label}</div>
    </button>
  )
}
