import BigNumber from 'bignumber.js'
import { POOL_TOKEN_EXPONENT } from 'constants/asset'
import useLiquidStake from 'hooks/useLiquidStake'
import { useAtom } from 'jotai'
import { useCallback, useMemo } from 'react'
import { allPoolLiveAtomRef } from 'state/atoms'
import type { Asset, AssetTicker } from 'types/asset'
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
      const exponentDiff = findPairById(pool.pairId)?.exponentDiff ?? 0

      return {
        ...pool,
        totalStakedAmount: new BigNumber(pool.totalStakedAmount).div(10 ** POOL_TOKEN_EXPONENT),
        totalQueuedAmount: new BigNumber(pool.totalQueuedAmount).div(10 ** POOL_TOKEN_EXPONENT),
        totalSupplyAmount: new BigNumber(pool.totalSupplyAmount).div(10 ** POOL_TOKEN_EXPONENT),
        priceOracle: new BigNumber(pool.priceOracle).multipliedBy(10 ** POOL_TOKEN_EXPONENT),
        apr: new BigNumber(pool.apr),
        RewardsPerToken: pool.RewardsPerToken?.map((reward) => ({
          ...reward,
          rewardAmount: new BigNumber(reward.rewardAmount), // exponent already adjusted?
        })),
        poolPrice: new BigNumber(pool.poolPrice).multipliedBy(10 ** exponentDiff),
        reserved: pool.Reserved.map((item) => {
          const expo = findAssetByDenom(item.denom)?.exponent ?? 0
          return {
            denom: item.denom,
            amount: new BigNumber(item.amount).div(10 ** expo),
            priceOracle: new BigNumber(item.priceOracle),
          }
        }),
      }
    }) as PoolLive[]
  }, [allPoolLiveAtom, findAssetByDenom, findPairById])

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

  const findPoolByDenom = useCallback((denom: string) => allPools.find((pool) => pool.poolDenom === denom), [allPools])

  const getPoolAssets = useCallback<(denom: string) => [AssetTicker, AssetTicker] | null>(
    (denom: string) => {
      const pool = findPoolByDenom(denom)
      const base = pool?.pair.baseAsset
      const quote = pool?.pair.quoteAsset
      return base && quote ? [base, quote] : null
    },
    [findPoolByDenom]
  )

  const getAssetTickers = useCallback<(item: Asset) => AssetTicker[]>(
    (item: Asset) => {
      return item.isPoolToken ? getPoolAssets(item.denom) ?? [] : [{ logoUrl: item.logoUrl, ticker: item.ticker }]
    },
    [getPoolAssets]
  )

  return { allPoolLive, allPools, findPoolByDenom, getAssetTickers }
}

export default usePool
