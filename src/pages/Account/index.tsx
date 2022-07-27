import AppPage from 'components/AppPage'
// import BlockHeightPolling from 'components/BlockHeightPolling'
import Hr from 'components/Hr'
import SearchInput from 'components/Inputs/SearchInput'
import Sticker from 'components/Sticker'
import { CHAINS_VALID_TIME_DIFF_MAP } from 'constants/chain'
import { DUMMY_ADDRESS } from 'constants/msg'
// import useChain from 'hooks/useChain'
import { useAtom } from 'jotai'
import { useMemo, useState } from 'react'
import { chainIdAtomRef } from 'state/atoms'
import { isTestnet } from 'utils/chain'

import AirdropClaim from './sections/AirdropClaim'
import ClaimableRewards from './sections/ClaimableRewards'
import FarmStakedAmount from './sections/FarmStakedAmount'
import TokenBalance from './sections/TokenBalance'

export default function Accounts() {
  // chainId atom
  const [chainIdAtom] = useAtom(chainIdAtomRef)
  const significantTimeGap = useMemo(() => CHAINS_VALID_TIME_DIFF_MAP[chainIdAtom], [chainIdAtom])

  // address
  const [searchAddress, setSearchAddress] = useState(DUMMY_ADDRESS)
  const [address, setAddress] = useState<undefined | string>(undefined)

  const handleAddressSearch = () => {
    if (address !== searchAddress) setAddress(searchAddress)
  }

  return (
    <AppPage className="pt-[calc(1.5rem+3.25rem)]">
      <div
        className={`fixed left-0 right-0 z-50 w-full translate-y-[28px] md:translate-y-0`}
        style={{ top: `calc(2.5rem + (1rem * 2)${isTestnet(chainIdAtom) ? ' + 1.5rem' : ''})` }}
      >
        <Sticker>
          <div className="flex justify-start items-center px-4 py-3 md:justify-start md:space-x-2 md:px-12">
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

        {/* refactoring wip */}
        {/* <div className="flex justify-start items-start md:items-center md:space-x-4">
          <div className="hidden md:block TYPO-BODY-XS text-grayCRE-400">Latest fetched block</div>
          <BlockHeightPolling onchainBlockHeight={onchainBlockHeight} backendBlockHeight={backendBlockHeight} />
        </div> */}
      </div>

      <div className="flex flex-col justify-start items-stretch space-y-12">
        {/* refactoring wip */}
        <TokenBalance address={address} significantTimeGap={significantTimeGap} />
        <Hr />
        <ClaimableRewards address={address} significantTimeGap={significantTimeGap} />
        <Hr />
        <FarmStakedAmount address={address} significantTimeGap={significantTimeGap} />
        <Hr />
        <AirdropClaim address={address} significantTimeGap={significantTimeGap} />
      </div>
    </AppPage>
  )
}
