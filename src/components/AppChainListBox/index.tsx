import { Listbox } from '@headlessui/react'
import Icon from 'components/Icon'
import { CHAIN_IDS } from 'constants/chain'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { ChainId, chainIdAtomRef } from 'state/atoms'

interface ChainOption {
  chainId: ChainId
  label: string
}

const CHAINS: ChainOption[] = [
  { chainId: CHAIN_IDS.MAINNET, label: 'Mainnet' },
  { chainId: CHAIN_IDS.MOONCAT, label: 'Testnet' },
]

export default function AppChainListBox() {
  // chain state
  const [chainIdAtom, setChainIdAtom] = useAtom(chainIdAtomRef)

  const [chainIndex, setChainIndex] = useState<number>(0)

  const onChange = (index: number) => {
    const chainId = CHAINS[index].chainId
    setChainIdAtom({ chainId })
  }

  const colorBodyByChain = (chainId: ChainId) => {
    if (chainId === CHAIN_IDS.MOONCAT) {
      document.body.classList.add('testnet')
    } else {
      document.body.classList.remove('testnet')
    }
  }

  useEffect(() => {
    colorBodyByChain(chainIdAtom)
    setChainIndex(CHAINS.findIndex((item) => item.chainId === chainIdAtom))
  }, [chainIdAtom])

  return (
    <div className="relative w-full max-w-[160px]">
      <Listbox value={chainIndex} onChange={onChange}>
        <Listbox.Button
          className={({ open }) =>
            `w-full rounded-lg bg-grayCRE-200 text-left text-grayCRE-400 px-4 py-2 outline-0 transition-all hover:bg-grayCRE-200 ${
              open ? '!bg-grayCRE-100 dark:!bg-neutral-600 rounded-b-none' : ''
            } dark:bg-neutral-700 dark:text-grayCRE-200`
          }
        >
          {({ open }) => {
            return (
              <div className="flex justify-between items-center space-x-4">
                <div className="grow shrink">
                  <div className="flex items-center overflow-hidden TYPO-BODY-S !leading-[1.25rem] !font-bold whitespace-nowrap md:!leading-[1.5rem]">
                    {CHAINS[chainIndex].label}
                  </div>
                </div>
                <div className="grow-0 shrink-0">
                  <Icon type={open ? `expandless` : `expandmore`} className="w-6 h-6" />
                </div>
              </div>
            )
          }}
        </Listbox.Button>

        <Listbox.Options
          className={`absolute w-full rounded-lg rounded-t-none bg-white border-2 border-t-0 border-grayCRE-100 max-h-48 overflow-y-auto outline-0 transition-all dark:bg-black dark:border-neutral-600`}
        >
          {CHAINS.map((chain: ChainOption, index) => (
            <Listbox.Option
              key={index}
              value={index}
              className={({ active }) =>
                `TYPO-BODY-XS text-grayCRE-500 dark:text-grayCRE-400 cursor-pointer px-4 py-2 outline-0 md:TYPO-BODY-S ${
                  active ? 'bg-grayCRE-100 dark:bg-grayCRE-400-o dark:!text-grayCRE-200' : ''
                }`
              }
            >
              <div className="flex">
                {/* <CoinLogo logoUrl={asset?.logoUrl} ticker={asset?.ticker} css={'w-5 h-5 mr-1'} /> */}
                <div> {chain.label}</div>
              </div>
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  )
}
