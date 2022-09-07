import useSignOut from 'components/AppSettingWidget/useSignOut'
import { useCopyClipboard } from 'components/CopyHelper/hooks'
import SelectTab from 'components/SelectTab'
import MoreWidget, { PopoverPanelItem } from 'components/Widgets/MoreWidget'
import { CRESCENT_ADMIN_DOMAIN } from 'constants/url'
import { useAtom } from 'jotai'
import { useCallback, useEffect, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { isDarkModeAtomRef, userAtomRef } from 'state/atoms'

type DarkModeType = 'dark' | 'light'

const DARK_MODE_TAB_ITEMS: { label: string; value: DarkModeType }[] = [
  {
    label: 'Light',
    value: 'light',
  },
  {
    label: 'Dark',
    value: 'dark',
  },
]
const clientId = process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID

export default function AppSettingWidget() {
  // dark mode
  const [isDarkModeAtom, setIsDarkModeAtom] = useAtom(isDarkModeAtomRef)
  const darkModeTabSelectedValue = useMemo<DarkModeType>(() => (isDarkModeAtom ? 'dark' : 'light'), [isDarkModeAtom])

  const handleDarkModeSelect = (value: DarkModeType) => {
    setIsDarkModeAtom({ isDarkMode: value === 'dark' })
  }

  const colorBodyDarkIf = (isDarkMode: boolean) => {
    isDarkMode ? document.body.classList.add('dark') : document.body.classList.remove('dark')
  }

  useEffect(() => {
    colorBodyDarkIf(isDarkModeAtom)
    return colorBodyDarkIf(isDarkModeAtom)
  }, [isDarkModeAtom])

  // auth
  const [userAtom] = useAtom(userAtomRef)

  const history = useHistory()
  const goToSignIn = () => history.push('/auth')
  const { signOut } = useSignOut({ clientId, onComplete: goToSignIn })

  // copy url
  const location = useLocation()
  const [isCopied, setCopied] = useCopyClipboard()
  const copyCurrentUrl = useCallback(() => {
    setCopied(`${CRESCENT_ADMIN_DOMAIN}${location.pathname}${location.search}`)
  }, [location, setCopied])

  // popover
  const settingsWidgetPanelItems: PopoverPanelItem[] = [
    {
      label: 'Blog',
      value: 'blog',
      iconType: 'medium',
      link: 'https://crescentnetwork.medium.com',
    },
    {
      label: 'DEX',
      value: 'dex',
      iconType: 'link',
      link: 'https://app.crescent.network/swap',
    },
    {
      label: isCopied ? 'Copied' : 'Copy link',
      value: 'link',
      iconType: isCopied ? 'success' : 'copylink',
      onClick: copyCurrentUrl,
    },
    {
      label: 'Token Launch',
      value: 'token launch',
      iconType: 'rocket',
      onClick: () => history.push('/token-launch'),
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
      <SelectTab<DarkModeType>
        label="Theme"
        tabItems={DARK_MODE_TAB_ITEMS}
        selectedValue={darkModeTabSelectedValue}
        onChange={handleDarkModeSelect}
        className="mt-2 border-t border-grayCRE-200 dark:border-grayCRE-400"
      />
    </MoreWidget>
  )
}
