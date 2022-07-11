import BigNumber from 'bignumber.js'
import { useAllFarmStaked } from 'data/useAPI'
import { useAllFarmRewardsLCD } from 'data/useLCD'
import useAsset from 'hooks/useAsset'
import { useMemo } from 'react'
import type {
  FarmRewardLCD,
  FarmRewardsLCDRaw,
  FarmStaked,
  FarmStakedRaw,
  HarvestableStaked,
  HarvestableStakedRaw,
} from 'types/account'
import type { APIHookReturn, LCDHookReturn } from 'types/api'

const useAccountData = (address: string) => {
  const { findAssetByDenom } = useAsset()

  // fetching farm stake amount & rewards to claim
  const { data: allFarmingStakedData, error: allFarmingStakedDataError }: APIHookReturn<FarmStakedRaw[]> =
    useAllFarmStaked({
      address,
      fetch: address !== '',
    })

  // console.log('allFarmingStakedData', allFarmingStakedData)

  const { data: allFarmRewardsLCDData, error: allFarmingStakedLCDError }: LCDHookReturn<FarmRewardsLCDRaw> =
    useAllFarmRewardsLCD({
      address,
      fetch: address !== '',
    })

  console.log('allFarmRewardsLCDData', allFarmRewardsLCDData)

  // using data
  // backend - staked amount
  const allFarmStaked = useMemo(() => {
    return (
      (allFarmingStakedData?.data.map((item) => {
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
      }) as FarmStaked[]) ?? ([] as FarmStaked[])
    )
  }, [allFarmingStakedData, findAssetByDenom])

  // backend - rewards total
  const totalFarmRewards = useMemo(() => {
    return (
      allFarmStaked?.reduce((accm, pool) => {
        const totalRewardAmountByPool =
          pool.harvestable?.reduce((sum, har) => sum.plus(har.rewardAmount), new BigNumber(0)) ?? new BigNumber(0)
        return accm.plus(totalRewardAmountByPool)
      }, new BigNumber(0)) ?? new BigNumber(0)
    )
  }, [allFarmStaked])

  // on-chain - rewards total
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

  const totalFarmRewardsLCD = useMemo(() => {
    return (
      allFarmRewardsLCD?.reduce((accm, reward) => {
        const totalRewardsByPool = reward.rewards.reduce((a, re) => a.plus(re.amount), new BigNumber(0))
        return accm.plus(totalRewardsByPool)
      }, new BigNumber(0)) ?? new BigNumber(0)
    )
  }, [allFarmRewardsLCD])

  return { allFarmStaked, totalFarmRewards, allFarmRewardsLCD, totalFarmRewardsLCD }
}

export default useAccountData
