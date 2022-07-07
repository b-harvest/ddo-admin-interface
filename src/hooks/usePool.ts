import BigNumber from 'bignumber.js'
import { useAtom } from 'jotai'
import { useCallback, useMemo } from 'react'
import { allAssetInfoAtomRef, allPairInfoAtomRef, allPoolLiveAtomRef } from 'state/atoms'
import type { PoolLive } from 'types/pool'

BigNumber.config({ RANGE: 500 })

const usePool = () => {
  const [allPoolLiveAtom] = useAtom(allPoolLiveAtomRef)
  const [allAssetInfoAtom] = useAtom(allAssetInfoAtomRef)
  const [allPairInfoAtom] = useAtom(allPairInfoAtomRef)

  const allPool = useMemo(() => {
    return allPoolLiveAtom.map((pool) => {
      const exponent = allAssetInfoAtom.find((assetInfo) => assetInfo.denom === pool.poolDenom)?.exponent ?? 0

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
      }
    }) as PoolLive[]
  }, [allPoolLiveAtom, allAssetInfoAtom])

  const findPoolByDenom = useCallback((denom: string) => allPool.find((pool) => pool.poolDenom === denom), [])

  return { allPool, findPoolByDenom }
}

export default usePool
