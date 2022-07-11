import AppChainListBox from 'components/AppChainListBox'
import AppSettingWidget from 'components/AppSettingWidget'
import Logo from 'components/Logo'
import NavigationTab from 'components/NavigationTab'
import { CRESCENT_LOGO_IMG_URL } from 'constants/resources'
import { NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header
      className={`relative flex items-center justify-between w-full p-4 bg-lightCRE dark:bg-neutral-900 border-b border-grayCRE-100 dark:border-grayCRE-400-o shadow-glow-wide-l dark:shadow-none`}
    >
      <div className="grow-0 shrink-0 flex justify-start items-center space-x-6">
        <NavLink to="/" className="flex justify-start items-center space-x-2">
          <Logo className="h-10 py-2" src={CRESCENT_LOGO_IMG_URL} />
          <h1 className="hidden justify-start items-center TYPO-H2 md:inline-flex md:TYPO-H1 dark:text-white">Admin</h1>
        </NavLink>
        <NavigationTab />
      </div>

      <div className="grow shrink flex justify-end items-center space-x-1">
        <AppChainListBox />
        <AppSettingWidget />
      </div>
    </header>
  )
}
