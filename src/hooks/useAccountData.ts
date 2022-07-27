import BigNumber from 'bignumber.js'
import { useAirdropClaim, useAllStaked } from 'data/useAPI'
import { useAllBalance } from 'data/useAPI'
import { useAirdropClaimLCD, useAllFarmRewardsLCD, useAllStakedLCD, useFarmPositionLCD } from 'data/useLCD'
import { useAllBalanceLCD } from 'data/useLCD'
import useAsset from 'hooks/useAsset'
import { useCallback, useMemo } from 'react'
import type {
  AirdropClaimLCDRaw,
  AirdropClaimRaw,
  Balance,
  BalanceLCDRaw,
  BalanceRaw,
  FarmPositionLCDRaw,
  FarmRewardLCDMainnetRaw,
  FarmRewardsLCDRaw,
  HarvestableStaked,
  HarvestableStakedRaw,
  Staked,
  StakedByPoolLCD,
  StakedLCDMainnetRaw,
  StakedLCDRaw,
  StakedRaw,
  TokenAmountSet,
  TokenAmountSetRaw,
} from 'types/account'
// import type { Balance } from 'types/account'
import type { APIHookReturn, LCDHookReturn } from 'types/api'

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
  const { data: allBalanceData }: APIHookReturn<BalanceRaw> = useAllBalance(
    {
      address: address ?? '',
      fetch: address !== undefined,
    },
    interval
  )
  const { data: allBalanceLCDData }: LCDHookReturn<BalanceLCDRaw> = useAllBalanceLCD(
    {
      address: address ?? '',
      fetch: address !== undefined,
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

  // * staked amount
  const { data: allStakedData }: APIHookReturn<StakedRaw[]> = useAllStaked({
    address,
    fetch: address !== '',
  })

  const { data: allStakedLCDData }: LCDHookReturn<StakedLCDMainnetRaw | StakedLCDRaw> = useAllStakedLCD({
    address,
    fetch: address !== '',
  })

  const { data: farmPositionLCDData }: LCDHookReturn<FarmPositionLCDRaw> = useFarmPositionLCD({
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

    // return farmPositionLCDData?.staked_coins
  }, [
    // isOnTestnet,
    allStakedLCDData,
    findAssetByDenom,
  ])

  const farmPositionLCD = useMemo(() => {
    const staked_coins = farmPositionLCDData?.staked_coins.map(getBigNumberedAmountSet) ?? []
    const queued_coins = farmPositionLCDData?.queued_coins.map(getBigNumberedAmountSet) ?? []
    const rewards = farmPositionLCDData?.rewards.map(getBigNumberedAmountSet) ?? []
    return {
      staked_coins,
      queued_coins,
      rewards,
    }
  }, [farmPositionLCDData, getBigNumberedAmountSet])

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
      allStaked?.reduce((accm: (TokenAmountSet & { poolDenom: string })[], pool) => {
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
        (accm: (TokenAmountSet & { poolDenom: string })[], item) => {
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
  }, [
    // isOnTestnet,
    allFarmRewardsLCDData,
    findAssetByDenom,
  ])

  // * airdrop claim
  const { data: airdropClaimData }: APIHookReturn<AirdropClaimRaw> = useAirdropClaim({
    address,
    fetch: address !== '',
  })

  const { data: airdropClaimLCDData }: LCDHookReturn<AirdropClaimLCDRaw> = useAirdropClaimLCD({
    address,
    fetch: address !== '',
  })

  const airdropClaimDataTimestamp = useMemo(() => (airdropClaimData?.curTimestamp ?? 0) * 1000, [airdropClaimData])

  const airdropClaim = useMemo(() => {
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

  const airdropClaimLCD = useMemo(() => {
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

  return {
    allBalanceTimestamp,
    allBalance,
    allBalanceLCD,
    farmPositionLCD,
    allStakedDataTimestamp,
    allStaked,
    allStakedLCD,
    allFarmRewardsDataTimestamp,
    allFarmRewardsByToken,
    allFarmRewardsByTokenLCD,
    airdropClaimDataTimestamp,
    airdropClaim,
    airdropClaimLCD,
  }
}

export default useAccountData

function getTokenWideFarmRewards(allRewards: (TokenAmountSet & { poolDenom: string })[]) {
  const tokenWideRewards: { [key: string]: (TokenAmountSet & { poolDenom: string })[] } = {}
  allRewards.forEach((item) => {
    const key = tokenWideRewards[item.denom]
    if (key) tokenWideRewards[item.denom].push(item)
    else tokenWideRewards[item.denom] = [item]
  })
  return tokenWideRewards
}

function parseAmountSetToBigNumber(item: TokenAmountSetRaw, exponent: number): TokenAmountSet {
  return {
    denom: item.denom,
    amount: new BigNumber(item.amount).div(10 ** exponent),
  }
}
