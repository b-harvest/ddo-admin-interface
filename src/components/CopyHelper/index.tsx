import { useCopyClipboard } from 'components/CopyHelper/hooks'
import Icon from 'components/Icon'
import { ButtonHTMLAttributes, useCallback } from 'react'
import { vibrate } from 'utils/hardware'

interface BaseProps {
  toCopy: string
  color?: string
  iconPosition?: 'left' | 'right'
}

type CopyHelperProps = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>

export default function CopyHelper({ color, toCopy, children, iconPosition }: CopyHelperProps) {
  const [isCopied, setCopied] = useCopyClipboard()
  const copy = useCallback(() => {
    vibrate(50)
    setCopied(toCopy)
  }, [toCopy, setCopied])

  return (
    <div
      className="relative shrink-0 flex justify-start items-center text-black dark:text-white cursor-pointer"
      onClick={copy}
    >
      {iconPosition === 'left' ? isCopied ? <Icon type="success" className="mr-2" /> : null : null}
      {isCopied ? 'Copied' : children}
      {iconPosition === 'right' ? isCopied ? <Icon type="success" className="ml-2" /> : null : null}
    </div>
  )
}
