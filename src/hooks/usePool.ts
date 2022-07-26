import BigNumber from 'bignumber.js'
import { useAtom } from 'jotai'
import { useCallback, useMemo } from 'react'
import { allPoolLiveAtomRef } from 'state/atoms'
import type { PoolLive } from 'types/pool'

import useAsset from './useAsset'
import usePair from './usePair'

BigNumber.config({ RANGE: 500 })

const usePool = () => {
  const [allPoolLiveAtom] = useAtom(allPoolLiveAtomRef)
  // const [allAssetInfoAtom] = useAtom(allAssetInfoAtomRef)
  //   const [allPairInfoAtom] = useAtom(allPairInfoAtomRef)
  const { findAssetByDenom } = useAsset()
  const { findPairById } = usePair()

  const allPoolLive = useMemo(() => {
    return allPoolLiveAtom.map((pool) => {
      const exponent = findAssetByDenom(pool.poolDenom)?.exponent ?? 0

      return {
        ...pool,
        totalStakedAmount: new BigNumber(pool.totalStakedAmount).dividedBy(10 ** exponent),
        totalQueuedAmount: new BigNumber(pool.totalQueuedAmount).dividedBy(10 ** exponent),
        totalSupplyAmount: new BigNumber(pool.totalSupplyAmount).dividedBy(10 ** exponent),
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
            amount: new BigNumber(item.amount).dividedBy(10 ** exp),
            priceOracle: new BigNumber(item.priceOracle),
          }
        }),
      }
    }) as PoolLive[]
  }, [allPoolLiveAtom, findAssetByDenom])

  const allPools = useMemo(() => {
    return allPoolLive
      .filter((pool) => {
        const pair = findPairById(pool.pairId)
        return pair && findAssetByDenom(pair.baseDenom)?.live && findAssetByDenom(pair.quoteDenom)?.live
      })
      .map((pool) => {
        const pair = findPairById(pool.pairId)
        const tvlUSD = pool.reserved.reduce((accm, item) => {
          return accm.plus(item.amount.multipliedBy(item.priceOracle))
        }, new BigNumber(0))

        const bcre = pool.reserved.find((item) => item.denom === 'ubcre')
        const bcreUSD = bcre?.amount.multipliedBy(bcre.priceOracle) ?? new BigNumber(0)
        const bcreUSDRatio = bcreUSD.dividedBy(tvlUSD)

        return {
          ...pool,
          pair,
          tvlUSD,
          isRanged: pool.poolType === 2,
          bcreUSDRatio,
        }
      })
  }, [allPoolLive, findPairById, findAssetByDenom])

  const findPoolByDenom = useCallback(
    (denom: string) => allPoolLive.find((pool) => pool.poolDenom === denom),
    [allPoolLive]
  )

  return { allPoolLive, allPools, findPoolByDenom }
}

export default usePool
