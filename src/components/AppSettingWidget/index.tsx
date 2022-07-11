import SelectTab from 'components/SelectTab'
import MoreWidget, { PopoverPanelItem } from 'components/Widgets/MoreWidget'
import { useAtom } from 'jotai'
import { useEffect, useMemo } from 'react'
import { isDarkModeAtomRef } from 'state/atoms'

const DARK_MODE_TAB_ITEMS = ['Light', 'Dark']

export default function AppSettingWidget() {
  // popover
  const settingsWidgetPanelItems: PopoverPanelItem[] = [
    {
      label: 'Blog',
      iconType: 'medium',
      link: 'https://crescentnetwork.medium.com/',
    },
    {
      label: 'Logout',
      iconType: 'close',
      onClick: handleLogoutClick,
    },
  ]

  function handleLogoutClick() {
    // logout proceeds..
  }

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

  return (
    <MoreWidget panelItems={settingsWidgetPanelItems}>
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
