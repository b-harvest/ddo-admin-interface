import useSignOut from 'components/AppSettingWidget/useSignOut'
import SelectTab from 'components/SelectTab'
import MoreWidget, { PopoverPanelItem } from 'components/Widgets/MoreWidget'
import { useAtom } from 'jotai'
import { useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { isDarkModeAtomRef, userAtomRef } from 'state/atoms'

const DARK_MODE_TAB_ITEMS = ['Light', 'Dark']
const clientId = process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID

export default function AppSettingWidget() {
  // dark mode
  const [isDarkModeAtom, setIsDarkModeAtom] = useAtom(isDarkModeAtomRef)

  const darkModeTabIndex = useMemo(() => (isDarkModeAtom ? 1 : 0), [isDarkModeAtom])

  const handleDarkModeSelect = (index: number) => {
    setIsDarkModeAtom({ isDarkMode: index === 1 })
  }

  const colorBodyDarkIf = (isDarkMode: boolean) => {
    isDarkMode ? document.body.classList.add('dark') : document.body.classList.remove('dark')
  }

  useEffect(() => {
    colorBodyDarkIf(isDarkModeAtom)
  }, [isDarkModeAtom])

  // auth
  const [userAtom] = useAtom(userAtomRef)

  const history = useHistory()
  const goToSignIn = () => history.push('/auth')
  const { signOut } = useSignOut({ clientId, onComplete: goToSignIn })

  // popover
  const settingsWidgetPanelItems: PopoverPanelItem[] = [
    {
      label: 'Blog',
      value: 'blog',
      iconType: 'medium',
      link: 'https://crescentnetwork.medium.com/',
    },
    {
      label: 'Log out',
      value: 'logout',
      iconType: 'close',
      onClick: signOut,
    },
  ]

  return (
    <MoreWidget panelItems={settingsWidgetPanelItems} excludedItems={userAtom ? [] : ['logout']}>
      <SelectTab
        label="Theme"
        tabItems={DARK_MODE_TAB_ITEMS}
        selectedTabIndex={darkModeTabIndex}
        onChange={handleDarkModeSelect}
        className="border-t border-grayCRE-200 dark:border-grayCRE-400 mt-2"
      />
    </MoreWidget>
  )
}
