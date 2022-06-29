import SelectTab from 'components/SelectTab'
import MoreWidget, { PopoverPanelItem } from 'components/Widgets/MoreWidget'
import { MAINNET_CHAIN_NAME, TESTNET_CHAIN_NAME } from 'constants/names'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { ChainName, chainNameAtomRef } from 'state/atoms'

const CHAINS: { chainName: ChainName; label: string }[] = [
  { chainName: MAINNET_CHAIN_NAME, label: 'Mainnet' },
  { chainName: TESTNET_CHAIN_NAME, label: 'Testnet' },
]

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

  const colorBodyByChain = (chainName: ChainName) => {
    if (chainName === TESTNET_CHAIN_NAME) {
      document.body.classList.add('testnet')
    } else {
      document.body.classList.remove('testnet')
    }
  }

  const handleSelectChain = (index: number) => {
    const chainName = CHAINS[index].chainName
    setChainNameAtom({ chainName })
  }

  useEffect(() => {
    colorBodyByChain(chainNameAtom)
    setChainIndex(CHAINS.findIndex((item) => item.chainName === chainNameAtom))
  }, [chainNameAtom])

  return (
    <MoreWidget panelItems={settingsWidgetPanelItems}>
      <div className="border-t-[1px] border-[rgba(0,0,0,0.5)] mt-2">
        <SelectTab
          tabItems={CHAINS.map((item) => item.label)}
          selectedTabIndex={chainIndex}
          onChange={handleSelectChain}
        />
      </div>
    </MoreWidget>
  )
}
