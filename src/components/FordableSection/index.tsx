import Icon from 'components/Icon'
import { ReactNode, useState } from 'react'

interface FoldableSectionProps {
  children: ReactNode
  label?: string
  defaultIsOpen?: boolean
}

export default function FoldableSection({ children, label, defaultIsOpen = true }: FoldableSectionProps) {
  const [isOpen, setIsOpen] = useState<boolean>(defaultIsOpen)
  const onFoldButtonClick = () => setIsOpen(!isOpen)

  return (
    <section className="w-full h-min">
      <header className="flex justify-between items-center text-black text-left dark:text-white mb-4">
        <h3 className="flex justify-start items-center TYPO-H3 ">{label ?? ''}</h3>
        <button type="button" onClick={onFoldButtonClick}>
          <Icon type={isOpen ? `expandless` : `expandmore`} className="w-6 h-6" />
        </button>
      </header>

      <div
        className={`overflow-hidden transition-all ease-out origin-top duration-[200ms] delay-[cubic-bezier(0, 1, 0, 1)] ${
          isOpen ? 'max-h-min scale-y-100' : 'max-h-0 scale-y-0'
        }`}
      >
        {children}
      </div>
    </section>
  )
}
