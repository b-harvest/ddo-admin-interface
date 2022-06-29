import { getPageName } from 'pages'
import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

export default function AppPage({ children, className }: { children: ReactNode; className?: string }) {
  const location = useLocation()
  const pageName = getPageName(location.pathname)

  return (
    <div className={`${className} relative px-4 pt-[2rem] pb-[calc(2.25rem+2rem)] `}>
      <h2 className="block TYPO-H2 text-black text-left mb-8">{pageName}</h2>
      {children}
    </div>
  )
}
