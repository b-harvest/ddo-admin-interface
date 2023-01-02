//import AppChainListBox from 'components/AppChainListBox'
import AppSettingWidget from 'components/AppSettingWidget'
import Logo from 'components/Logo'
import NavigationTab from 'components/NavigationTab'
import { BHARVEST_LOGO_IMG_URL } from 'constants/resources'
import { useAtom } from 'jotai'
import { NavLink } from 'react-router-dom'
import { authTokenAtomRef } from 'state/atoms'
import { vibrate } from 'utils/hardware'

export default function Header() {
  const [authTokenAtom] = useAtom(authTokenAtomRef)

  return (
    <header
      className={`relative flex items-center justify-between space-x-4 w-full p-4 bg-lightCRE dark:bg-neutral-900 border-b border-grayCRE-100 dark:border-grayCRE-400-o shadow-glow-wide-l dark:shadow-none`}
    >
      <div className="grow shrink flex justify-start items-center space-x-6">
        <NavLink to="/" className="grow-0 shrink-0 flex justify-start items-center space-x-2">
          <Logo className="h-10 py-2" src={BHARVEST_LOGO_IMG_URL} />
          <h1 className="hidden justify-start items-center TYPO-H2 md:inline-flex md:TYPO-H1 dark:text-white">VO</h1>
        </NavLink>
        {authTokenAtom && <NavigationTab onClick={() => vibrate(200)} />}
      </div>

      <div className="grow-0 shrink-0 flex justify-end items-center space-x-1">
        {/* mainnet/testnet 선택 박스 */}
        {/* {authTokenAtom && <AppChainListBox />} */}
        {/* 햄버거 메뉴 */}
        <AppSettingWidget />
      </div>
    </header>
  )
}
