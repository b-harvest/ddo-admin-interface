import Icon, { IconType } from 'components/Icon'

interface IconButtonProps {
  type: IconType
  label?: string
  onClick?: () => void
  className?: string
  iconClassName?: string
}

export default function IconButton({
  type,
  label = `${type}`,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClick = () => {},
  className = '',
  iconClassName = '',
}: IconButtonProps) {
  return (
    <button type="button" onClick={onClick} className={`${className} overflow-hidden`}>
      <div className="SCREEN-READER">{label}</div>
      <Icon type={type} className={iconClassName} />
    </button>
  )
}
