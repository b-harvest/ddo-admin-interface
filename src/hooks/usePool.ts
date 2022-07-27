import BigNumber from 'bignumber.js'
import useLiquidStake from 'hooks/useLiquidStake'
import { useAtom } from 'jotai'
import { useCallback, useMemo } from 'react'
import { allPoolLiveAtomRef } from 'state/atoms'
import type { PairDetail } from 'types/pair'
import type { PoolDetail, PoolLive } from 'types/pool'

import useAsset from './useAsset'
import usePair from './usePair'

BigNumber.config({ RANGE: 500 })

const usePool = () => {
  const [allPoolLiveAtom] = useAtom(allPoolLiveAtomRef)
  // const [allAssetInfoAtom] = useAtom(allAssetInfoAtomRef)
  //   const [allPairInfoAtom] = useAtom(allPairInfoAtomRef)
  const { findAssetByDenom } = useAsset()
  const { findPairById } = usePair()
  const { liquidStakeAPR } = useLiquidStake()

  const allPoolLive = useMemo(() => {
    return allPoolLiveAtom.map((pool) => {
      const exponent = findAssetByDenom(pool.poolDenom)?.exponent ?? 0

      return {
        ...pool,
        totalStakedAmount: new BigNumber(pool.totalStakedAmount).div(10 ** exponent),
        totalQueuedAmount: new BigNumber(pool.totalQueuedAmount).div(10 ** exponent),
        totalSupplyAmount: new BigNumber(pool.totalSupplyAmount).div(10 ** exponent),
        priceOracle: new BigNumber(pool.priceOracle),
        apr: new BigNumber(pool.apr),
        RewardsPerToken: pool.RewardsPerToken?.map((reward) => ({
          ...reward,
          rewardAmount: new BigNumber(reward.rewardAmount), // exponent already adjusted?
        })),
        poolPrice: new BigNumber(pool.poolPrice),
        reserved: pool.Reserved.map((item) => {
          const exp = findAssetByDenom(item.denom)?.exponent ?? 0
          return {
            denom: item.denom,
            amount: new BigNumber(item.amount).div(10 ** exp),
            priceOracle: new BigNumber(item.priceOracle),
          }
        }),
      }
    }) as PoolLive[]
  }, [allPoolLiveAtom, findAssetByDenom])

  const allPools = useMemo<PoolDetail[]>(() => {
    return allPoolLive
      .filter((pool) => {
        const pair = findPairById(pool.pairId)
        return pair && findAssetByDenom(pair.baseDenom)?.live && findAssetByDenom(pair.quoteDenom)?.live
      })
      .map((pool) => {
        const pair = findPairById(pool.pairId) as PairDetail

        const reserved = pool.reserved.sort((a, _) => (a.denom === pair?.baseDenom ? -1 : 1)) // base, quote
        const base = reserved[0]
        const quote = reserved[1]

        const xRatio = base.amount.div(quote.amount)
        const yRatio = quote.amount.div(base.amount)

        const tvlUSD = pool.reserved.reduce((accm, item) => {
          return accm.plus(item.amount.multipliedBy(item.priceOracle))
        }, new BigNumber(0))

        const isRanged = pool.poolType === 2

        const bcre = pool.reserved.find((item) => item.denom === 'ubcre')
        const bcreUSD = bcre?.amount.multipliedBy(bcre.priceOracle) ?? new BigNumber(0)
        const bcreUSDRatio = bcreUSD.div(tvlUSD)

        const bcreApr = bcreUSD.isZero()
          ? new BigNumber(0)
          : isRanged
          ? bcreUSDRatio.multipliedBy(liquidStakeAPR).multipliedBy(2)
          : new BigNumber(liquidStakeAPR)

        return {
          ...pool,
          pair,
          reserved,
          xRatio,
          yRatio,
          tvlUSD,
          isRanged,
          bcreUSDRatio,
          bcreApr,
        }
      })
  }, [allPoolLive, findPairById, findAssetByDenom, liquidStakeAPR])

  const findPoolByDenom = useCallback(
    (denom: string) => allPoolLive.find((pool) => pool.poolDenom === denom),
    [allPoolLive]
  )

  return { allPoolLive, allPools, findPoolByDenom }
}

export default usePool
