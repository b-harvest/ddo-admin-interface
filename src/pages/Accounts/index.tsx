import AppPage from 'components/AppPage'
import Hr from 'components/Hr'
import SearchInput from 'components/Inputs/SearchInput'
import Sticker from 'components/Sticker'
import { toastSuccess } from 'components/Toast/generator'
import { CHAINS_VALID_TIME_DIFF_MAP } from 'constants/chain'
import { DUMMY_ADDRESS } from 'constants/msg'
import useChain from 'hooks/useChain'
import { useAtom } from 'jotai'
import BlockHeightPolling from 'pages/components/BlockHeightPolling'
import { useMemo, useState } from 'react'
import { chainIdAtomRef } from 'state/atoms'
import { isTestnet } from 'utils/chain'

import ClaimableRewards from './sections/ClaimableRewards'
import FarmStakedAmount from './sections/FarmStakedAmount'
import TokenBalance from './sections/TokenBalance'

export default function Accounts() {
  // chainId atom
  const [chainIdAtom] = useAtom(chainIdAtomRef)

  const significantTimeGap = useMemo(() => CHAINS_VALID_TIME_DIFF_MAP[chainIdAtom], [chainIdAtom])

  // fetching interval
  const [interval, setInterval] = useState<number>(15)
  const toggleInterval = () => {
    const newInterval = interval >= 15 ? 5 : interval + 5
    setInterval(newInterval)
    toastSuccess(`Fetching interval set to ${newInterval}s`)
  }

  // block
  const { backendBlockHeight, onchainBlockHeight } = useChain({ interval: interval * 1000 })

  // address
  const [searchAddress, setSearchAddress] = useState(DUMMY_ADDRESS)
  const [address, setAddress] = useState<undefined | string>(undefined)
  const handleAddressSearch = () => setAddress(searchAddress)

  return (
    <AppPage className="pt-[calc(2rem+3.25rem)]">
      <div
        className="fixed left-0 right-0 z-50 w-full"
        style={{ top: `calc(2.5rem + (1rem * 2)${isTestnet(chainIdAtom) ? ' + 1.5rem' : ''})` }}
      >
        <Sticker>
          <div className="flex justify-start items-center px-4 py-4 md:justify-end md:space-x-2 md:px-12">
            <span className="hidden TYPO-BODY-XS text-grayCRE-400 dark:text-grayCRE-300 !font-medium md:block">
              Current Address
            </span>
            <span className="TYPO-BODY-XS text-black dark:text-white !font-black FONT-MONO text-left">
              {address ?? 'No address yet'}
            </span>
          </div>
        </Sticker>
      </div>

      <div className="flex flex-col justify-start items-stretch space-y-4 mb-20">
        <SearchInput
          placeholder="Address"
          keyword={searchAddress}
          onChange={setSearchAddress}
          onSearch={handleAddressSearch}
        />

        <div className="flex justify-between items-start md:items-center space-x-4">
          <BlockHeightPolling onchainBlockHeight={onchainBlockHeight} backendBlockHeight={backendBlockHeight} />
          <button
            type="button"
            onClick={toggleInterval}
            className="shrink-0 grow-0 basis-auto outline-none TYPO-BODY-S italic !font-bold text-left text-black dark:text-white bg-transparent p-3 rounded-xl hover:bg-grayCRE-200-o dark:hover:bg-grayCRE-400-o"
          >
            <span className="hidden md:inline-block mr-2">Fetching</span>
            every {interval}s
          </button>
        </div>
      </div>

      <div className="flex flex-col justify-start items-stretch space-y-12">
        <TokenBalance interval={interval * 1000} address={address} significantTimeGap={significantTimeGap} />
        <Hr />
        <ClaimableRewards interval={interval * 1000} address={address} significantTimeGap={significantTimeGap} />
        <Hr />
        <FarmStakedAmount interval={interval * 1000} address={address} significantTimeGap={significantTimeGap} />
      </div>
    </AppPage>
  )
}
