import usePages from 'pages/hooks/usePages'
import { ReactNode } from 'react'

export default function AppPage({ children, className }: { children: ReactNode; className?: string }) {
  const { pageName } = usePages()

  return (
    <div className={`${className} relative px-4 pt-[2rem] pb-[calc(2.5rem+8px+4rem)] overflow-hidden md:px-12`}>
      <h2 className="block TYPO-H2 text-black text-left mb-8 dark:text-white" style={{ wordBreak: 'keep-all' }}>
        {pageName}
      </h2>
      {children}
    </div>
  )
}
