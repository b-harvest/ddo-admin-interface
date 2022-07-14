import { useCopyClipboard } from 'components/CopyHelper/hooks'
import Icon from 'components/Icon'
import { ButtonHTMLAttributes, useCallback } from 'react'

const Copied = () => (
  <div className="shrink-0 flex items-stretch text-black dark:text-white">
    <Icon type={`copy`} />
    Copied
  </div>
)

interface BaseProps {
  toCopy: string
  color?: string
  iconSize?: number
  iconPosition?: 'left' | 'right'
}
export type CopyHelperProps = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>

export default function CopyHelper({ color, toCopy, children, iconSize, iconPosition }: CopyHelperProps) {
  const [isCopied, setCopied] = useCopyClipboard()
  const copy = useCallback(() => {
    setCopied(toCopy)
  }, [toCopy, setCopied])

  return (
    <div className="cursor-pointer" onClick={copy}>
      {iconPosition === 'left' ? isCopied ? <Copied /> : <Icon type="error" /> : null}
      {iconPosition === 'left' && <>&nbsp;</>}
      {isCopied ? '' : children}
      {iconPosition === 'right' && <>&nbsp;</>}
      {iconPosition === 'right' ? isCopied ? <Copied /> : <Icon type="error" /> : null}
    </div>
  )
}
