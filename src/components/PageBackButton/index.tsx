import Icon from 'components/Icon'
import usePages from 'pages/hooks/usePages'

export default function PageBackButton({ className = '', onClick }: { className?: string; onClick?: () => void }) {
  const { history } = usePages()

  const handleClick = () => {
    history.goBack()
    if (onClick) onClick()
  }

  return (
    <button
      type="button"
      className={`w-10 h-8 flex justify-center items-center outline-none border-0 bg-lightCRE dark:bg-neutral-900 text-black dark:text-white ${className}`}
      onClick={handleClick}
    >
      <span className="sr-only">Go back</span>
      <Icon type="back" />
    </button>
  )
}
