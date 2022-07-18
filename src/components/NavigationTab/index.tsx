import { pages } from 'pages'
import { NavLink } from 'react-router-dom'

// const getPageLabel = (page: string) => `${page.charAt(0).toUpperCase()}${page.slice(1)}`

// helpers
const getNavLinkClass = (isActive: boolean): string =>
  isActive ? `bg-grayCRE-200-o !font-black dark:!text-grayCRE-200` : `!font-medium`

interface NavigationTabProps {
  onClick?: () => void
}

export default function NavigationTab({ onClick }: NavigationTabProps) {
  return (
    <nav className="fixed bottom-8 right-4 w-fit max-w-[calc(100vw-2rem)] overflow-x-scroll bg-lightCRE rounded-xl border-2 border-grayCRE-100 shadow-lg md:static md:border-0 md:shadow-none dark:bg-neutral-900 dark:border-grayCRE-400">
      <ul
        className={`w-fit min-w-fit flex flex-nowrap justify-between items-center md:space-x-6 md:justify-start p-[2px] md:p-0`}
      >
        {pages.map((page) => (
          <li className="shrink-0" key={page.path}>
            <NavLink
              id={`${page.label}-nav-link`}
              to={`${page.path}`}
              onClick={onClick}
              className={(isActive) =>
                `TYPO-BODY-M rounded-lg px-4 py-2 md:bg-transparent text-black dark:text-grayCRE-400 ${getNavLinkClass(
                  isActive
                )}`
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
