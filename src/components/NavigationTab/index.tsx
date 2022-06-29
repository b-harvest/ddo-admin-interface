import { pages } from 'pages'
import { NavLink } from 'react-router-dom'

// const getPageLabel = (page: string) => `${page.charAt(0).toUpperCase()}${page.slice(1)}`

// helpers
const getNavLinkClass = (isActive: boolean): string => (isActive ? `bg-grayCRE-200-o !font-bold` : `!font-medium`)

interface NavigationTabProps {
  onClick?: () => void
}

export default function NavigationTab({ onClick }: NavigationTabProps) {
  return (
    <nav className="fixed bottom-4 right-4 w-fit bg-lightCRE rounded-xl border-grayCRE-100 border shadow-lg md:static md:border-0 md:shadow-none">
      <ul className={`flex justify-end items-center md:space-x-6 md:justify-start`}>
        {pages.map((page) => (
          <li className="p-1 md:p-0" key={page.path}>
            <NavLink
              id={`${page.label}-nav-link`}
              to={`${page.path}`}
              onClick={onClick}
              className={(isActive) =>
                `TYPO-BODY-M rounded-xl px-4 py-2 md:bg-transparent ${getNavLinkClass(isActive)}`
              }
            >
              {page.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
