import AppChainListBox from 'components/AppChainListBox'
import AppSettingWidget from 'components/AppSettingWidget'
import Logo from 'components/Logo'
import NavigationTab from 'components/NavigationTab'
import { CRESCENT_LOGO_IMG_URL } from 'constants/resources'

export default function Header() {
  return (
    <header
      className={`relative flex items-center justify-between w-full p-4 bg-lightCRE border-b-grayCRE-100 border-b md:shadow-glow-wide-l`}
    >
      <div className="grow-0 shrink-0 flex justify-start items-center space-x-6">
        <div className="flex justify-start items-center space-x-2">
          <Logo className="h-10 py-2" src={CRESCENT_LOGO_IMG_URL} />
          <h1 className="hidden inline-flex justify-start items-center TYPO-H2 md:block md:TYPO-H1">Admin</h1>
        </div>
        <NavigationTab />
      </div>

      <div className="grow shrink flex justify-end items-center space-x-1">
        <AppChainListBox />
        <AppSettingWidget />
      </div>
    </header>
  )
}
