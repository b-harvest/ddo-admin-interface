import { getPageName } from 'pages'
import { ReactNode } from 'react'
import { useLocation, useParams } from 'react-router-dom'

export default function AppPage({ children, className }: { children: ReactNode; className?: string }) {
  const location = useLocation()
  const params = useParams()

  const pathname = Object.keys(params).length
    ? location.pathname.slice(0, location.pathname.lastIndexOf('/'))
    : location.pathname

  const pageName = getPageName(pathname)

  return (
    <div className={`${className} relative px-4 pt-[2rem] pb-[calc(2.5rem+8px+4rem)] overflow-hidden md:px-12`}>
      <h2 className="block TYPO-H2 text-black text-left mb-8 dark:text-white" style={{ wordBreak: 'keep-all' }}>
        {pageName}
      </h2>
      {children}
    </div>
  )
}
