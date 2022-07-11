import BigNumber from 'bignumber.js'
import useAsset from 'hooks/useAsset'
import { useAtom } from 'jotai'
import { useCallback, useMemo } from 'react'
import { allPairInfoAtomRef, allPairLiveAtomRef } from 'state/atoms'
import type { PairInfo, PairLive } from 'types/pair'

const usePair = () => {
  const [allPairInfoAtom] = useAtom(allPairInfoAtomRef)
  const [allPairLiveAtom] = useAtom(allPairLiveAtomRef)
  const { allAsset } = useAsset()

  // the below will be removed
  // const getTVLbyDenom = useCallback(
  //   (denom: string, isUSD = false) => {
  //     const tvl = allPairLiveAtom.reduce((accm, pair) => {
  //       const reserveByPair = pair.totalReserved
  //         .filter((item) => item.denom === denom)
  //         .reduce((accm, item) => accm.plus(new BigNumber(item.amount)), new BigNumber(0))
  //       return accm.plus(reserveByPair)
  //     }, new BigNumber(0))

  //     const exponent = allAsset.find((item) => item.denom === denom)?.exponent ?? 0
  //     const priceOracle = isUSD ? allAsset.find((item) => item.denom === denom)?.live?.priceOracle ?? 0 : 1
  //     return tvl.dividedBy(10 ** exponent).multipliedBy(priceOracle)
  //   },
  //   [allPairLiveAtom, allAsset]
  // )

  const allPairLive = useMemo(() => {
    return allPairLiveAtom.map((pair) => {
      const baseDenomExponent = allAsset.find((asset) => asset.denom === pair.baseDenom)?.exponent ?? 0
      return {
        ...pair,
        lastPrice: new BigNumber(pair.lastPrice),
        predPrice: new BigNumber(pair.predPrice),
        vol_24: new BigNumber(pair.vol_24).dividedBy(10 ** baseDenomExponent),
        totalReserved: pair.totalReserved.map((item) => {
          const exponent = allAsset.find((asset) => asset.denom === item.denom)?.exponent ?? 0
          return {
            ...item,
            priceOracle: new BigNumber(item.priceOracle),
            amount: new BigNumber(item.amount).dividedBy(10 ** exponent),
          }
        }),
      }
    }) as PairLive[]
  }, [allPairLiveAtom, allAsset])

  const allPairInfo = useMemo(() => {
    return allPairInfoAtom.map((pair) => {
      return {
        ...pair,
        lastPrice: new BigNumber(pair.lastPrice),
        pools: pair.pools.map((item) => {
          return {
            ...item,
            totalSupply: new BigNumber(item.totalSupply),
            reserved: item.reserved.map((reserve) => {
              const exponent = allAsset.find((asset) => asset.denom === reserve.denom)?.exponent ?? 0
              return { ...reserve, amount: new BigNumber(reserve.amount).dividedBy(10 ** exponent) }
            }),
          }
        }),
      }
    }) as PairInfo[]
  }, [allPairInfoAtom, allAsset])

  const getTVLUSDbyDenom = useCallback(
    (denom: string) => {
      const tvl = allPairLive.reduce((tvl, pair) => {
        const reserveByPair = pair.totalReserved
          .filter((item) => item.denom === denom)
          .reduce((accm, item) => accm.plus(new BigNumber(item.amount)), new BigNumber(0))
        return tvl.plus(reserveByPair)
      }, new BigNumber(0))

      const baseAsset = allAsset.find((item) => item.denom === denom)
      // const exponent = baseAsset?.exponent ?? 0
      const priceOracle = baseAsset?.live?.priceOracle ?? 0
      return tvl.multipliedBy(priceOracle)
    },
    [allPairLive, allAsset]
  )

  const tvlUSD = useMemo(() => {
    return allPairLive.reduce((tvl, pair) => {
      const reserveByPair = pair.totalReserved.reduce((accm, reserve) => {
        const baseAsset = allAsset.find((item) => item.denom === reserve.denom)
        // const exponent = baseAsset?.exponent ?? 0
        const priceOracle = baseAsset?.live?.priceOracle ?? 0
        const reserveUSD = new BigNumber(reserve.amount).multipliedBy(priceOracle)
        return accm.plus(reserveUSD)
      }, new BigNumber(0))
      return tvl.plus(reserveByPair)
    }, new BigNumber(0))
  }, [allPairLive, allAsset])

  const getVol24USDbyDenom = useCallback(
    (denom: string) => {
      return allPairLive
        .filter((pair) => pair.baseDenom === denom || pair.quoteDenom === denom)
        .reduce((accm, pair) => {
          const vol24 = pair.vol_24 // vol_24 in baseDenom
          const baseAsset = pair.totalReserved.find((item) => item.denom === pair.baseDenom)
          const vol24USD = vol24.multipliedBy(baseAsset?.priceOracle ?? 0)
          return accm.plus(vol24USD)
        }, new BigNumber(0))
    },
    [allPairLive]
  )

  // const getPoolTokenPriceOracle = useCallback(
  //   (denom: string) => {
  //     const pools = allPairInfo.reduce((accm: PoolInPair[], pair) => accm.concat(pair.pools), [])
  //     const pool = pools.find((pool) => pool.poolDenom === denom)

  //     if (!pool) return new BigNumber(0)

  //     const poolReservedUSD = pool.reserved.reduce((accm, reserve) => {
  //       const priceOracle =
  //         allAsset.find((asset) => asset.denom === reserve.denom)?.live?.priceOracle ?? new BigNumber(0)
  //       const reserveUSD = reserve.amount.multipliedBy(priceOracle)
  //       return accm.plus(reserveUSD)
  //     }, new BigNumber(0))

  //     return poolReservedUSD.dividedBy(pool.totalSupply)
  //   },
  //   [allPairInfo, allAsset]
  // )

  return { allPairLive, allPairInfo, tvlUSD, getTVLUSDbyDenom, getVol24USDbyDenom }
}

export default usePair
