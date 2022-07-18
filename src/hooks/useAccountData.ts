import BigNumber from 'bignumber.js'
import { useAllStaked } from 'data/useAPI'
import { useAllFarmRewardsLCD, useAllStakedLCD } from 'data/useLCD'
import useAsset from 'hooks/useAsset'
import { useMemo } from 'react'
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
// import { isTestnet } from 'utils/chain'

const useAccountData = ({ address, interval = 0 }: { address: string; interval?: number }) => {
  // const [chainIdAtom] = useAtom(chainIdAtomRef)
  // const isOnTestnet = isTestnet(chainIdAtom)
  const { findAssetByDenom } = useAsset()

  // * staked amount
  const { data: allStakedData }: APIHookReturn<StakedRaw[]> = useAllStaked({
    address,
    fetch: address !== '',
  })

  const { data: allStakedLCDData }: LCDHookReturn<StakedLCDMainnetRaw | StakedLCDRaw> = useAllStakedLCD({
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
    // if (isOnTestnet) {
    return (
      ((allStakedLCDData as StakedLCDRaw)?.stakings.map((item) => {
        const exponent = findAssetByDenom(item.staking_coin_denom)?.exponent ?? 0
        return { denom: item.staking_coin_denom, amount: new BigNumber(item.amount).dividedBy(10 ** exponent) }
      }) as StakedByPoolLCD[]) ?? []
    )
    // }

    // return (
    //   ((allStakedLCDData as StakedLCDMainnetRaw)?.staked_coins.map((item) => {
    //     const exponent = findAssetByDenom(item.denom)?.exponent ?? 0
    //     return {
    //       denom: item.denom,
    //       amount: new BigNumber(item.amount).dividedBy(10 ** exponent),
    //     }
    //   }) as StakedByPoolLCD[]) ?? []
    // )
  }, [
    // isOnTestnet,
    allStakedLCDData,
    findAssetByDenom,
  ])

  // * rewards by pool
  const { data: allFarmRewardsLCDData }: LCDHookReturn<FarmRewardLCDMainnetRaw | FarmRewardsLCDRaw> =
    useAllFarmRewardsLCD({
      address,
      fetch: address !== '',
    })

  // backend
  const allFarmRewardsDataTimestamp = allStakedDataTimestamp

  const allFarmRewardsByToken = useMemo(() => {
    const allRewards =
      allStaked?.reduce((accm: (LCDTokenAmountSet & { poolDenom: string })[], pool) => {
        return accm.concat(
          pool.harvestable?.map((item) => ({
            poolDenom: pool.denom,
            denom: item.rewardDenom,
            amount: item.rewardAmount,
          })) ?? []
        )
      }, []) ?? []

    return getTokenWideFarmRewards(allRewards)
  }, [allStaked])

  // onchain
  const allFarmRewardsByTokenLCD = useMemo(() => {
    // if (isOnTestnet) {
    const allRewards =
      (allFarmRewardsLCDData as FarmRewardsLCDRaw)?.rewards.reduce(
        (accm: (LCDTokenAmountSet & { poolDenom: string })[], item) => {
          const rewards = item.rewards.map((re) => {
            const exponent = findAssetByDenom(re.denom)?.exponent ?? 0
            return {
              poolDenom: item.staking_coin_denom,
              denom: re.denom,
              amount: new BigNumber(re.amount).dividedBy(10 ** exponent),
            }
          })
          return accm.concat(rewards)
        },
        []
      ) ?? []
    return getTokenWideFarmRewards(allRewards)
    // }

    // const allRewards =
    //   ((allFarmRewardsLCDData as FarmRewardLCDMainnetRaw)?.rewards.map((item) => {
    //     const exponent = findAssetByDenom(item.denom)?.exponent ?? 0
    //     return {
    //       poolDenom: 'Unknown',
    //       denom: item.denom,
    //       amount: new BigNumber(item.amount).dividedBy(10 ** exponent),
    //     }
    //   }) as (LCDTokenAmountSet & { poolDenom: string })[]) ?? []
    // return getTokenWideFarmRewards(allRewards)
  }, [
    // isOnTestnet,
    allFarmRewardsLCDData,
    findAssetByDenom,
  ])

  return {
    allStakedDataTimestamp,
    allStaked,
    allStakedLCD,
    allFarmRewardsDataTimestamp,
    allFarmRewardsByToken,
    allFarmRewardsByTokenLCD,
  }
}

export default useAccountData

function getTokenWideFarmRewards(allRewards: (LCDTokenAmountSet & { poolDenom: string })[]) {
  const tokenWideRewards: { [key: string]: (LCDTokenAmountSet & { poolDenom: string })[] } = {}
  allRewards.forEach((item) => {
    const key = tokenWideRewards[item.denom]
    if (key) tokenWideRewards[item.denom].push(item)
    else tokenWideRewards[item.denom] = [item]
  })
  return tokenWideRewards
}
