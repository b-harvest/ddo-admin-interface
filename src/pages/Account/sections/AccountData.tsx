import Hr from 'components/Hr'
// import Loader from 'components/Loader'
import { CHAINS_VALID_TIME_DIFF_MAP } from 'constants/chain'
import useAccountData from 'hooks/useAccountData'
import { useAtom } from 'jotai'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { chainIdAtomRef } from 'state/atoms'

import AirdropClaim from './AirdropClaim'
import ClaimableRewards from './ClaimableRewards'
import FarmStakedAmount from './FarmStakedAmount'
import TokenBalance from './TokenBalance'

export default function AccountData({ address }: { address: string }) {
  const [chainIdAtom] = useAtom(chainIdAtomRef)
  const significantTimeGap = useMemo(() => CHAINS_VALID_TIME_DIFF_MAP[chainIdAtom], [chainIdAtom])

  const {
    allBalanceTimestamp,
    allBalance,
    allBalanceLCD,
    allStakedDataTimestamp,
    allStaked,
    farmPositionLCD,
    allFarmRewardsDataTimestamp,
    allFarmRewardsByToken,
    allFarmRewardsByTokenLCD,
    airdropClaimDataTimestamp,
    airdropClaim,
    airdropClaimLCD,
    isLoading,
  } = useAccountData({
    address,
    interval: 5000,
  })

  const { id }: { id?: string } = useParams()
  const [showLoader, setShowLoader] = useState<boolean>(id !== undefined)
  useEffect(() => {
    if (isLoading === false) setTimeout(() => setShowLoader(isLoading), 600)
    else setShowLoader(isLoading)
  }, [isLoading])

  return (
    <div className="flex flex-col justify-start items-stretch space-y-12">
      {/* refactoring wip */}
      <TokenBalance
        isLoading={showLoader}
        backendTimestamp={allBalanceTimestamp}
        backendData={allBalance}
        onchainData={allBalanceLCD}
        significantTimeGap={significantTimeGap}
      />
      <Hr />
      <FarmStakedAmount
        isLoading={showLoader}
        backendTimestamp={allStakedDataTimestamp}
        backendData={allStaked}
        onchainData={farmPositionLCD}
        significantTimeGap={significantTimeGap}
      />
      <Hr />
      <ClaimableRewards
        isLoading={showLoader}
        backendTimestamp={allFarmRewardsDataTimestamp}
        backendData={allFarmRewardsByToken}
        onchainData={allFarmRewardsByTokenLCD}
        significantTimeGap={significantTimeGap}
      />
      <Hr />
      <AirdropClaim
        isLoading={showLoader}
        backendTimestamp={airdropClaimDataTimestamp}
        backendData={airdropClaim}
        onchainData={airdropClaimLCD}
        significantTimeGap={significantTimeGap}
      />
    </div>
  )
}
