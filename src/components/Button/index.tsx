type ButtonColor = 'primary' | 'danger' | 'neutral' | 'tranparent'
type ButtonSize = 'xs' | 'sm' | 'md'

type ButtonProps = {
  onClick: () => void
  label: string
  isLoading: boolean
  disabled?: boolean
  size?: ButtonSize
  color?: ButtonColor
}

export default function Button({ onClick, label, isLoading, disabled, size = 'md', color = 'primary' }: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`relative w-full TYPO-BODY-M !font-bold whitespace-pre rounded-xl transition-opacity ${getColorCSS(
        color,
        disabled || isLoading
      )} ${getPadCssBySize(size)} ${disabled || isLoading ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
      onClick={onClick}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-b-[3px] rounded-full border-grayCRE-100-l dark:border-grayCRE-500-d animate-spin"></div>
        </div>
      ) : (
        label
      )}
    </button>
  )
}

function getColorCSS(color: ButtonColor, disabled?: boolean) {
  switch (color) {
    case 'primary':
      return `text-neutral-900 bg-yellowCRE ${
        disabled ? '' : 'shadow-glow-thin-l hover:text-neutral-600 hover:bg-yellowCRE-active'
      }`
    case 'danger':
      return `text-white bg-danger dark:bg-dangerDark ${
        disabled ? '' : 'hover:text-grayCRE-200 hover:bg-error dark:hover:bg-danger'
      }`
    case 'neutral':
      return `text-neutral-900 bg-grayCRE-200 dark:bg-grayCRE-300 ${
        disabled ? '' : 'hover:text-neutral-600 hover:bg-grayCRE-100 dark:hover:bg-grayCRE-200'
      }`
    case 'tranparent':
      return `text-black dark:text-white bg-transparent hover:text-info dark:hover:text-info`
    default:
      return `text-neutral-900 bg-yellowCRE ${
        disabled ? '' : 'shadow-glow-thin-l hover:text-neutral-600 hover:bg-yellowCRE-active'
      }`
  }
}

function getPadCssBySize(size: ButtonSize) {
  switch (size) {
    case 'xs':
      return 'px-2 py-1'
    case 'sm':
      return 'px-4 py-2'
    case 'md':
      return 'px-8 py-4'
    default:
      return 'px-8 py-4'
  }
}
