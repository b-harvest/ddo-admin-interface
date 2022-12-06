import usePages from 'pages/hooks/usePages'
import { ReactNode } from 'react'

export default function AppPage({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { page } = usePages()

  return (
    <div
      className={`${className} relative w-full max-w-[90rem] m-auto px-4 pt-[2rem] pb-[calc(2.5rem+8px+4rem)] overflow-hidden md:px-12`}
    >
      <h2 className="block TYPO-H2 text-black text-left mb-8 dark:text-white" style={{ wordBreak: 'keep-all' }}>
        {page?.showPageName && page?.pageName}
      </h2>
      {children}
    </div>
  )
}
