import SelectTab from 'components/SelectTab'
import MoreWidget, { PopoverPanelItem } from 'components/Widgets/MoreWidget'
import { useEffect, useState } from 'react'

const CHAINS = ['mainnet', 'testnet']

export default function AppSettingWidget() {
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

  // chain settings → will be refactored to global state using Jotai
  const [chainIndex, setChainIndex] = useState(0)

  const handleSelectChain = (index: number) => {
    localStorage.setItem('chain-name', CHAINS[index])

    if (CHAINS[index] === 'testnet') {
      document.body.classList.add('testnet')
    } else {
      document.body.classList.remove('testnet')
    }

    setChainIndex(index)
  }

  useEffect(() => {
    const chainName = localStorage.getItem('chain-name') ?? 'mainnet'
    setChainIndex(CHAINS.findIndex((item) => item === chainName))
  }, [])

  return (
    <MoreWidget panelItems={settingsWidgetPanelItems}>
      <div className="border-t-[1px] border-[rgba(0,0,0,0.5)] mt-2">
        <SelectTab tabItems={CHAINS} selectedTabIndex={chainIndex} onChange={handleSelectChain} />
      </div>
    </MoreWidget>
  )
}
