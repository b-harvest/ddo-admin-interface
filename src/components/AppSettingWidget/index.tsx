import SelectTab from 'components/SelectTab'
import MoreWidget, { PopoverPanelItem } from 'components/Widgets/MoreWidget'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { ChainName, chainNameAtomRef } from 'state/atoms'

const CHAINS: ChainName[] = ['mainnet', 'testnet']

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

  // tab
  const [chainIndex, setChainIndex] = useState(0)

  // chain state
  const [chainNameAtom, setChainNameAtom] = useAtom(chainNameAtomRef)

  const colorBodyByChain = (chainName: string) => {
    if (chainName === 'testnet') {
      document.body.classList.add('testnet')
    } else {
      document.body.classList.remove('testnet')
    }
  }

  const handleSelectChain = (index: number) => {
    const chainName = CHAINS[index]
    setChainNameAtom({ chainName })
  }

  useEffect(() => {
    colorBodyByChain(chainNameAtom)
    setChainIndex(CHAINS.findIndex((item) => item === chainNameAtom))
  }, [chainNameAtom])

  return (
    <MoreWidget panelItems={settingsWidgetPanelItems}>
      <div className="border-t-[1px] border-[rgba(0,0,0,0.5)] mt-2">
        <SelectTab tabItems={CHAINS} selectedTabIndex={chainIndex} onChange={handleSelectChain} />
      </div>
    </MoreWidget>
  )
}
