import { Listbox } from '@headlessui/react'
import { EventName } from 'analytics/constants'
import mixpanel from 'analytics/mixpanel'
import Icon from 'components/Icon'
import { CHAIN_IDS as ChainIds } from 'constants/chain'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { ChainId, chainIdAtomRef } from 'state/atoms'

// const CHAINS = [ChainIds.MAINNET, ChainIds.MOONCAT]

const CHAIN_LABELS: { [key in ChainIds]: string } = {
  [ChainIds.MAINNET]: 'Mainnet',
  [ChainIds.MOONCAT]: 'Testnet',
}

export default function AppChainListBox() {
  const [chainIdAtom, setChainIdAtom] = useAtom(chainIdAtomRef)

  const onChange = (chainId: ChainIds) => {
    setChainIdAtom({ chainId })
    mixpanel.track(EventName.CHAIN_CHANGED, { chainId })
  }

  useEffect(() => {
    colorBodyByChain(chainIdAtom)
  }, [chainIdAtom])

  return (
    <div className="relative w-full max-w-[160px]">
      <Listbox value={chainIdAtom} onChange={onChange}>
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
                    {CHAIN_LABELS[chainIdAtom]}
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
          style={{ zIndex: '1' }}
        >
          {Object.values(ChainIds).map((chainId: ChainIds, index) => (
            <Listbox.Option
              key={index}
              value={chainId}
              className={({ active }) =>
                `TYPO-BODY-XS text-grayCRE-500 dark:text-grayCRE-400 cursor-pointer px-4 py-2 outline-0 md:TYPO-BODY-S ${
                  active ? 'bg-grayCRE-100 dark:bg-grayCRE-400-o dark:!text-grayCRE-200' : ''
                }`
              }
            >
              <div className="flex">
                <div> {CHAIN_LABELS[chainId]}</div>
              </div>
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  )
}

function colorBodyByChain(chainId: ChainId) {
  if (chainId === ChainIds.MOONCAT) {
    document.body.classList.add('testnet')
  } else {
    document.body.classList.remove('testnet')
  }
}
