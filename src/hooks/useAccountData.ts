import BigNumber from 'bignumber.js'
import { useAllStaked } from 'data/useAPI'
import { useAllFarmRewardsLCD, useAllStakedLCD } from 'data/useLCD'
import useAsset from 'hooks/useAsset'
import { useMemo } from 'react'
import type {
  FarmRewardLCD,
  FarmRewardsLCDRaw,
  HarvestableStaked,
  HarvestableStakedRaw,
  Staked,
  StakedLCDRaw,
  StakedRaw,
} from 'types/account'
import type { APIHookReturn, LCDHookReturn } from 'types/api'

const useAccountData = (address: string) => {
  const { findAssetByDenom } = useAsset()

  // backend - staked amount & farm rewards to claim
  const { data: allStakedData, error: allStakedDataError }: APIHookReturn<StakedRaw[]> = useAllStaked({
    address,
    fetch: address !== '',
  })

  // staked amount
  const allStaked = useMemo(() => {
    return (
      (allStakedData?.data.map((item) => {
        const exponent = findAssetByDenom(item.denom)?.exponent ?? 0

        return {
          ...item,
          queuedAmount: new BigNumber(item.queuedAmount).dividedBy(10 ** exponent),
          stakedAmount: new BigNumber(item.stakedAmount).dividedBy(10 ** exponent),
          harvestable: item.harvestable.map((har: HarvestableStakedRaw) => {
            const rewardExponent = findAssetByDenom(har.rewardDenom)?.exponent ?? 0

            return {
              rewardDenom: har.rewardDenom,
              rewardAmount: new BigNumber(har.rewardAmount).dividedBy(10 ** rewardExponent),
            } as HarvestableStaked
          }),
        }
      }) as Staked[]) ?? ([] as Staked[])
    )
  }, [allStakedData, findAssetByDenom])

  // rewards total
  const totalFarmRewards = useMemo(() => {
    return (
      allStaked?.reduce((accm, pool) => {
        const totalRewardAmountByPool =
          pool.harvestable?.reduce((sum, har) => sum.plus(har.rewardAmount), new BigNumber(0)) ?? new BigNumber(0)
        return accm.plus(totalRewardAmountByPool)
      }, new BigNumber(0)) ?? new BigNumber(0)
    )
  }, [allStaked])

  // on-chain - farm rewards
  const { data: allStakedLCDData, error: allStakedLCDDataError }: LCDHookReturn<StakedLCDRaw> = useAllStakedLCD({
    address,
    fetch: address !== '',
  })

  const { data: allFarmRewardsLCDData, error: allFarmRewardsLCDDataError }: LCDHookReturn<FarmRewardsLCDRaw> =
    useAllFarmRewardsLCD({
      address,
      fetch: address !== '',
    })

  console.log('allFarmRewardsLCDData', allFarmRewardsLCDData)
  console.log('allStakedLCDData', allStakedLCDData)

  // all rewards list re-typed
  const allFarmRewardsLCD = useMemo(() => {
    const rewards =
      (allFarmRewardsLCDData?.rewards.map((reward) => {
        return {
          ...reward,
          rewards: reward.rewards.map((item) => {
            const exponent = findAssetByDenom(item.denom)?.exponent ?? 0
            return {
              denom: item.denom,
              amount: new BigNumber(item.amount).dividedBy(10 ** exponent),
            }
          }),
        }
      }) as FarmRewardLCD[]) ?? []

    return rewards
  }, [allFarmRewardsLCDData, findAssetByDenom])

  // rewards total
  const totalFarmRewardsLCD = useMemo(() => {
    return (
      allFarmRewardsLCD?.reduce((accm, reward) => {
        const totalRewardsByPool = reward.rewards.reduce((a, re) => a.plus(re.amount), new BigNumber(0))
        return accm.plus(totalRewardsByPool)
      }, new BigNumber(0)) ?? new BigNumber(0)
    )
  }, [allFarmRewardsLCD])

  return { allStaked, totalFarmRewards, allFarmRewardsLCD, totalFarmRewardsLCD }
}

export default useAccountData
