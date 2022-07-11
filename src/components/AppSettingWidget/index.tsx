import SelectTab from 'components/SelectTab'
import MoreWidget, { PopoverPanelItem } from 'components/Widgets/MoreWidget'
import { CHAIN_IDS } from 'constants/chain'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { ChainId, chainIdAtomRef } from 'state/atoms'

const CHAINS: { chainId: ChainId; label: string }[] = [
  { chainId: CHAIN_IDS.MAINNET, label: 'Mainnet' },
  { chainId: CHAIN_IDS.MOONCAT, label: 'Testnet' },
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
  const [chainIdAtom, setChainIdAtom] = useAtom(chainIdAtomRef)

  const colorBodyByChain = (chainId: ChainId) => {
    if (chainId === CHAIN_IDS.MOONCAT) {
      document.body.classList.add('testnet')
    } else {
      document.body.classList.remove('testnet')
    }
  }

  const handleSelectChain = (index: number) => {
    const chainId = CHAINS[index].chainId
    setChainIdAtom({ chainId })
  }

  useEffect(() => {
    colorBodyByChain(chainIdAtom)
    setChainIndex(CHAINS.findIndex((item) => item.chainId === chainIdAtom))
  }, [chainIdAtom])

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
