import BigNumber from 'bignumber.js'
import { useAllStaked } from 'data/useAPI'
import { useAllFarmRewardsLCD, useAllStakedLCD } from 'data/useLCD'
import useAsset from 'hooks/useAsset'
import { useAtom } from 'jotai'
import { useMemo } from 'react'
import { isTestnetAtomRef } from 'state/atoms'
import type {
  FarmRewardLCDMainnetRaw,
  FarmRewardsLCDRaw,
  HarvestableStaked,
  HarvestableStakedRaw,
  LCDTokenAmountSet,
  Staked,
  StakedByPoolLCD,
  StakedLCDMainnetRaw,
  StakedLCDRaw,
  StakedRaw,
} from 'types/account'
import type { APIHookReturn, LCDHookReturn } from 'types/api'

const useAccountData = (address: string) => {
  const [isTestnetAtom] = useAtom(isTestnetAtomRef)
  const { findAssetByDenom } = useAsset()

  // * staked amount
  const { data: allStakedData, error: allStakedDataError }: APIHookReturn<StakedRaw[]> = useAllStaked({
    address,
    fetch: address !== '',
  })

  const { data: allStakedLCDData, error: allStakedLCDDataError }: LCDHookReturn<StakedLCDMainnetRaw | StakedLCDRaw> =
    useAllStakedLCD({
      address,
      fetch: address !== '',
    })

  // backend
  const allStakedDataTimestamp = useMemo(() => (allStakedData?.curTimestamp ?? 0) * 1000, [allStakedData])

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

  // onchain
  const allStakedLCD = useMemo(() => {
    if (isTestnetAtom) {
      return (
        ((allStakedLCDData as StakedLCDRaw)?.stakings.map((item) => {
          const exponent = findAssetByDenom(item.staking_coin_denom)?.exponent ?? 0
          return { denom: item.staking_coin_denom, amount: new BigNumber(item.amount).dividedBy(10 ** exponent) }
        }) as StakedByPoolLCD[]) ?? []
      )
    }

    return (
      ((allStakedLCDData as StakedLCDMainnetRaw)?.staked_coins.map((item) => {
        const exponent = findAssetByDenom(item.denom)?.exponent ?? 0
        return {
          denom: item.denom,
          amount: new BigNumber(item.amount).dividedBy(10 ** exponent),
        }
      }) as StakedByPoolLCD[]) ?? []
    )
  }, [isTestnetAtom, allStakedLCDData, findAssetByDenom])

  // * rewards by pool
  const {
    data: allFarmRewardsLCDData,
    error: allFarmRewardsLCDDataError,
  }: LCDHookReturn<FarmRewardLCDMainnetRaw | FarmRewardsLCDRaw> = useAllFarmRewardsLCD({
    address,
    fetch: address !== '',
  })

  // backend

  // onchain
  const allFarmRewardsLCD = useMemo(() => {
    if (isTestnetAtom) {
      return (
        ((allFarmRewardsLCDData as FarmRewardsLCDRaw)?.rewards.reduce((accm: LCDTokenAmountSet[], item) => {
          const rewards = item.rewards.map((re) => {
            const exponent = findAssetByDenom(re.denom)?.exponent ?? 0
            return { denom: re.denom, amount: new BigNumber(re.amount).dividedBy(10 ** exponent) }
          })
          return accm.concat(rewards)
        }, []) as LCDTokenAmountSet[]) ?? []
      )
    }

    return (
      ((allFarmRewardsLCDData as FarmRewardLCDMainnetRaw)?.rewards.map((item) => {
        const exponent = findAssetByDenom(item.denom)?.exponent ?? 0
        return {
          denom: item.denom,
          amount: new BigNumber(item.amount).dividedBy(10 ** exponent),
        }
      }) as LCDTokenAmountSet[]) ?? []
    )
  }, [isTestnetAtom, allFarmRewardsLCDData, findAssetByDenom])

  // * rewards total
  // backend
  const totalFarmRewards = useMemo(() => {
    return (
      allStaked?.reduce((accm, pool) => {
        const totalRewardAmountByPool =
          pool.harvestable?.reduce((sum, har) => sum.plus(har.rewardAmount), new BigNumber(0)) ?? new BigNumber(0)
        return accm.plus(totalRewardAmountByPool)
      }, new BigNumber(0)) ?? new BigNumber(0)
    )
  }, [allStaked])

  // onchain
  const totalFarmRewardsLCD = useMemo(
    () => allFarmRewardsLCD.reduce((accm, reward) => accm.plus(reward.amount), new BigNumber(0)),
    [allFarmRewardsLCD]
  )

  return { allStakedDataTimestamp, allStaked, totalFarmRewards, allStakedLCD, allFarmRewardsLCD, totalFarmRewardsLCD }
}

export default useAccountData
