import BigNumber from 'bignumber.js'
import { useAirdropClaim, useLpFarmStaking } from 'data/useAPI'
import { useBalance } from 'data/useAPI'
import { useAirdropClaimLCD, useAllLpFarmPositionLCD } from 'data/useLCD'
import { useBalanceLCD } from 'data/useLCD'
import useAsset from 'hooks/useAsset'
import { useCallback, useMemo } from 'react'
import type {
  AirdropClaim,
  AirdropClaimLCD,
  AirdropClaimLCDRaw,
  AirdropClaimRaw,
  Balance,
  BalanceLCDRaw,
  BalanceRaw,
  LpFarmPositionsLCDRaw,
  LpFarmRewardRaw,
  LpFarmStaking,
  LpFarmStakingRaw,
  TokenAmountSet,
  TokenAmountSetRaw,
} from 'types/account'
import type { APIHookReturn, LCDHookReturn } from 'types/api'
import { getTokenWideFarmRewards } from 'utils/rewards'

const useAccountData = ({ address, interval = 0 }: { address: string; interval?: number }) => {
  const { findAssetByDenom } = useAsset()

  const getBigNumberedAmountSet = useCallback(
    (item: TokenAmountSetRaw) => {
      const exponent = findAssetByDenom(item.denom)?.exponent ?? 0
      return parseAmountSetToBigNumber(item, exponent)
    },
    [findAssetByDenom]
  )

  const parseDenomAmount = useCallback(
    (str: string) => {
      const amounts = str.match(/\d+/gi)
      const denoms = str.match(/[a-z]+/gi)

      if (!amounts || !denoms) return { denom: '-', amount: new BigNumber(0) }

      const denom = denoms[0]
      return getBigNumberedAmountSet({ denom, amount: amounts[0] })
    },
    [getBigNumberedAmountSet]
  )

  // * balance
  const { data: allBalanceData, isLoading: allBalanceDataLoading }: APIHookReturn<BalanceRaw> = useBalance(
    {
      address,
    },
    interval
  )
  const { data: allBalanceLCDData, isLoading: allBalanceLCDDataLoading }: LCDHookReturn<BalanceLCDRaw> = useBalanceLCD(
    {
      address,
    },
    interval
  )

  const allBalanceTimestamp = useMemo(() => (allBalanceData?.curTimestamp ?? 0) * 1000, [allBalanceData])

  const allBalance = useMemo<Balance>(() => {
    return (
      allBalanceData?.data.asset.map((item) => {
        const set = getBigNumberedAmountSet({ denom: item.denom, amount: item.amount })
        return {
          ...set,
          reserved: item.reserved,
        }
      }) ?? []
    )
  }, [allBalanceData, getBigNumberedAmountSet])

  const allBalanceLCD = useMemo<TokenAmountSet[]>(
    () => allBalanceLCDData?.balances.map(getBigNumberedAmountSet) ?? [],
    [allBalanceLCDData, getBigNumberedAmountSet]
  )

  /** @summary replace above from v3 */
  const { data: allLpFarmStakingData, isLoading: allLpFarmStakingDataLoading }: APIHookReturn<LpFarmStakingRaw[]> =
    useLpFarmStaking(
      {
        address,
      },
      interval
    )

  const {
    data: allLpFarmPositionsLCDData,
    isLoading: allLpFarmPositionsLCDDataLoading,
  }: LCDHookReturn<LpFarmPositionsLCDRaw> = useAllLpFarmPositionLCD(
    {
      address,
    },
    interval
  )

  // backend
  const allLpFarmStakingDataTimestamp = useMemo(
    () => (allLpFarmStakingData?.curTimestamp ?? 0) * 1000,
    [allLpFarmStakingData]
  )

  const allLpFarmStaking = useMemo<LpFarmStaking[]>(() => {
    return (
      allLpFarmStakingData?.data.map((item) => {
        const exponent = findAssetByDenom(item.denom)?.exponent ?? 0

        return {
          denom: item.denom,
          stakedAmount: new BigNumber(item.stakedAmount).dividedBy(10 ** exponent),
          harvestable: item.harvestable.map((har: LpFarmRewardRaw) => {
            const rewardExponent = findAssetByDenom(har.rewardDenom)?.exponent ?? 0
            return {
              rewardDenom: har.rewardDenom,
              rewardAmount: new BigNumber(har.rewardAmount).dividedBy(10 ** rewardExponent),
            }
          }),
        }
      }) ?? []
    )
  }, [allLpFarmStakingData, findAssetByDenom])

  // onchain
  const allLpFarmPositionsLCD = useMemo<TokenAmountSet[]>(
    () =>
      allLpFarmPositionsLCDData?.positions.map((item) =>
        getBigNumberedAmountSet({ denom: item.denom, amount: item.farming_amount })
      ) ?? [],
    [allLpFarmPositionsLCDData?.positions, getBigNumberedAmountSet]
  )

  // * rewards by pool
  // const {
  //   data: allLpFarmRewardsLCDData,
  //   isLoading: allLpFarmRewardsLCDDataLoading,
  // }: LCDHookReturn<LpFarmRewardsLCDRaw> = useAllLpFarmRewardsLCD(
  //   {
  //     address,
  //   },
  //   interval
  // )

  // backend
  const allFarmRewardsDataTimestamp = allLpFarmStakingDataTimestamp

  const allFarmRewardsByToken = useMemo(() => {
    const allRewards =
      allLpFarmStaking?.reduce((accm: (TokenAmountSet & { poolDenom: string })[], pool) => {
        return accm.concat(
          pool.harvestable?.map((item) => ({
            poolDenom: pool.denom,
            denom: item.rewardDenom,
            amount: item.rewardAmount,
          })) ?? []
        )
      }, []) ?? []

    return getTokenWideFarmRewards(allRewards)
  }, [allLpFarmStaking])

  // * airdrop claim
  const { data: airdropClaimData, isLoading: airdropClaimDataLoading }: APIHookReturn<AirdropClaimRaw> =
    useAirdropClaim(
      {
        address,
      },
      interval
    )

  const { data: airdropClaimLCDData, isLoading: airdropClaimLCDDataLoading }: LCDHookReturn<AirdropClaimLCDRaw> =
    useAirdropClaimLCD(
      {
        address,
      },
      interval
    )

  const airdropClaimDataTimestamp = useMemo(() => (airdropClaimData?.curTimestamp ?? 0) * 1000, [airdropClaimData])

  const airdropClaim = useMemo<AirdropClaim | null>(() => {
    const data = airdropClaimData?.data
    if (!data) return null

    const initialClaimableCoins = data.initialClaimableCoins.split(',').map((item) => parseDenomAmount(item))
    const claimableCoins = data.claimableCoins.split(',').map((item) => parseDenomAmount(item))

    return {
      ...data,
      initialClaimableCoins,
      claimableCoins,
      claimedConditions: data.claimedConditions.split(','),
    }
  }, [airdropClaimData, parseDenomAmount])

  const airdropClaimLCD = useMemo<AirdropClaimLCD | null>(() => {
    const data = airdropClaimLCDData?.claim_record
    if (!data) return null

    const initial_claimable_coins = data.initial_claimable_coins.map(getBigNumberedAmountSet)
    const claimable_coins = data.claimable_coins.map(getBigNumberedAmountSet)
    return {
      ...data,
      initial_claimable_coins,
      claimable_coins,
    }
  }, [airdropClaimLCDData, getBigNumberedAmountSet])

  // isLoading
  const isLoading = useMemo<boolean>(
    () =>
      address.length > 0 &&
      (allBalanceDataLoading ||
        allBalanceLCDDataLoading ||
        allLpFarmStakingDataLoading ||
        allLpFarmPositionsLCDDataLoading ||
        airdropClaimDataLoading ||
        airdropClaimLCDDataLoading),
    [
      address,
      allBalanceDataLoading,
      allBalanceLCDDataLoading,
      allLpFarmStakingDataLoading,
      allLpFarmPositionsLCDDataLoading,
      airdropClaimDataLoading,
      airdropClaimLCDDataLoading,
    ]
  )

  return {
    allBalanceTimestamp,
    allBalance,
    allBalanceLCD,
    allLpFarmPositionsLCD,
    allLpFarmStakingDataTimestamp,
    allLpFarmStaking,
    allFarmRewardsDataTimestamp,
    allFarmRewardsByToken,
    airdropClaimDataTimestamp,
    airdropClaim,
    airdropClaimLCD,
    isLoading,
  }
}

export default useAccountData

function parseAmountSetToBigNumber(item: TokenAmountSetRaw, exponent: number): TokenAmountSet {
  return {
    denom: item.denom,
    amount: new BigNumber(item.amount).div(10 ** exponent),
  }
}
