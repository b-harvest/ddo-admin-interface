type ButtonColor = 'primary' | 'primary-glow' | 'danger' | 'neutral' | 'transparent'
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
      className={`relative w-full whitespace-pre transition-opacity ${getColorCSS(
        color,
        disabled || isLoading
      )} ${getPadCssBySize(size)} ${disabled || isLoading ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
      onClick={onClick}
    >
      {isLoading ? (
        <div className="flex items-center justify-center p-[2px]">
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
      return `text-neutral-900 bg-yellowCRE ${disabled ? '' : 'hover:text-neutral-600 hover:bg-yellowCRE-active'}`
    case 'primary-glow':
      return `text-neutral-900 bg-yellowCRE ${
        disabled ? '' : 'shadow-glow-thin-l hover:text-neutral-600 hover:bg-yellowCRE-active'
      }`
    case 'danger':
      return `text-white bg-danger dark:bg-dangerDark ${
        disabled ? '' : 'hover:text-grayCRE-200 hover:bg-error dark:hover:bg-danger'
      }`
    case 'neutral':
      return `text-neutral-900 bg-grayCRE-200 dark:bg-grayCRE-200 ${
        disabled ? '' : 'hover:text-neutral-600 hover:bg-grayCRE-100 dark:hover:bg-grayCRE-100'
      }`
    case 'transparent':
      return `text-black dark:text-white bg-transparent hover:text-gryCRE-600 dark:hover:text-grayCRE-300`
    default:
      return `text-neutral-900 bg-yellowCRE ${
        disabled ? '' : 'shadow-glow-thin-l hover:text-neutral-600 hover:bg-yellowCRE-active'
      }`
  }
}

function getPadCssBySize(size: ButtonSize) {
  switch (size) {
    case 'xs':
      return 'px-4 py-2 rounded-md TYPO-BODY-S !font-bold'
    case 'sm':
      return 'px-4 py-2 rounded-md TYPO-BODY-M !font-bold'
    case 'md':
      return 'px-8 py-4 rounded-lg TYPO-BODY-M !font-bold'
    default:
      return 'px-8 py-4 rounded-xl TYPO-BODY-M !font-bold'
  }
}
