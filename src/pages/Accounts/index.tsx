import BigNumber from 'bignumber.js'
import AlertBox from 'components/AlertBox'
import AppPage from 'components/AppPage'
import Hr from 'components/Hr'
import SearchInput from 'components/Inputs/SearchInput'
import Sticker from 'components/Sticker'
import { CHAINS_VALID_TIME_DIFF_MAP } from 'constants/chain'
import { DUMMY_ADDRESS } from 'constants/msg'
import { useLatestBlockLCD } from 'data/useLCD'
import useChain from 'hooks/useChain'
import { useAtom } from 'jotai'
import { useMemo, useState } from 'react'
import { chainIdAtomRef } from 'state/atoms'
import type { LCDHookReturn } from 'types/api'
import type { BlockLCD } from 'types/block'
import { isTestnet } from 'utils/chain'

import ClaimableRewards from './components/ClaimableRewards'
import FarmStakedAmount from './components/FarmStakedAmount'
import TokenBalance from './components/TokenBalance'

export default function Accounts() {
  // chainId atom
  const [chainIdAtom] = useAtom(chainIdAtomRef)

  const significantTimeGap = useMemo(() => CHAINS_VALID_TIME_DIFF_MAP[chainIdAtom], [chainIdAtom])

  // block
  const { findChainById } = useChain()
  const { data: latestBlockLCDData }: LCDHookReturn<BlockLCD> = useLatestBlockLCD({})

  const { backendBlockHeight, onchainBlockHeight } = useMemo(() => {
    const backendBlockHeightRaw = findChainById(chainIdAtom)?.live?.height
    const backendBlockHeight = backendBlockHeightRaw ? new BigNumber(backendBlockHeightRaw).toFormat() : 'NA'

    const onchainBlockHeightRaw = latestBlockLCDData?.block.header.height
    const onchainBlockHeight = onchainBlockHeightRaw ? new BigNumber(onchainBlockHeightRaw).toFormat() : 'NA'

    return { backendBlockHeight, onchainBlockHeight }
  }, [chainIdAtom, findChainById, latestBlockLCDData])

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
            <span className="TYPO-BODY-XS text-black dark:text-white !font-black !font-mono text-left">
              {address ?? 'No address yet'}
            </span>
          </div>
        </Sticker>
      </div>

      <div className="flex flex-col justify-start items-stretch space-y-4 mb-12">
        <SearchInput
          placeholder="Address"
          keyword={searchAddress}
          onChange={setSearchAddress}
          onSearch={handleAddressSearch}
        />
        <AlertBox
          msg={`Block height \non-chain ${onchainBlockHeight} \nback-end ${backendBlockHeight}`}
          status="info"
          isActive={true}
        />
      </div>

      <div className="flex flex-col justify-start items-stretch space-y-12">
        <TokenBalance address={address} significantTimeGap={significantTimeGap} />
        <Hr />
        <ClaimableRewards address={address} significantTimeGap={significantTimeGap} />
        <Hr />
        <FarmStakedAmount address={address} significantTimeGap={significantTimeGap} />
      </div>
    </AppPage>
  )
}
