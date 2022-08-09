import BigNumber from 'bignumber.js'
import useAsset from 'hooks/useAsset'
import { useAtom } from 'jotai'
import { useCallback, useMemo } from 'react'
import { allPairInfoAtomRef, allPairLiveAtomRef } from 'state/atoms'
import type { PairDetail, PairInfo, PairLive, PoolInPair } from 'types/pair'

const usePair = () => {
  const [allPairInfoAtom] = useAtom(allPairInfoAtomRef)
  const [allPairLiveAtom] = useAtom(allPairLiveAtomRef)
  const { allAsset, findAssetByDenom } = useAsset()

  const allPairLive = useMemo(() => {
    return allPairLiveAtom.map((pair) => {
      const baseExpo = findAssetByDenom(pair.baseDenom)?.exponent ?? 0
      const quoteExpo = findAssetByDenom(pair.quoteDenom)?.exponent ?? 0
      const diffExpo = baseExpo - quoteExpo

      return {
        ...pair,
        lastPrice: new BigNumber(pair.lastPrice).multipliedBy(10 ** diffExpo),
        predPrice: new BigNumber(pair.predPrice).multipliedBy(10 ** diffExpo),
        high_24: new BigNumber(pair.high_24),
        low_24: new BigNumber(pair.low_24),
        vol_24: new BigNumber(pair.vol_24),
        totalReserved: pair.totalReserved.map((item) => {
          const exponent = findAssetByDenom(item.denom)?.exponent ?? 0
          return {
            ...item,
            priceOracle: new BigNumber(item.priceOracle),
            amount: new BigNumber(item.amount).dividedBy(10 ** exponent),
          }
        }),
      }
    }) as PairLive[]
  }, [allPairLiveAtom, findAssetByDenom])

  const allPairInfo = useMemo(() => {
    return allPairInfoAtom.map((pair) => {
      const baseExpo = findAssetByDenom(pair.baseDenom)?.exponent ?? 0
      const quoteExpo = findAssetByDenom(pair.quoteDenom)?.exponent ?? 0
      const diffExpo = baseExpo - quoteExpo

      return {
        ...pair,
        lastPrice: new BigNumber(pair.lastPrice).multipliedBy(10 ** diffExpo),
        pools: pair.pools.map((item) => {
          return {
            ...item,
            totalSupply: new BigNumber(item.totalSupply),
            reserved: item.reserved.map((reserve) => {
              const exponent = findAssetByDenom(reserve.denom)?.exponent ?? 0
              return { ...reserve, amount: new BigNumber(reserve.amount).dividedBy(10 ** exponent) }
            }),
          }
        }),
      }
    }) as PairInfo[]
  }, [allPairInfoAtom, findAssetByDenom])

  const allPair = useMemo<PairDetail[]>(() => {
    return allPairLive
      .filter((pair) => allPairInfo.find((info) => info.pairId === pair.pairId))
      .map((pair) => {
        const pairInfo = allPairInfo.find((info) => info.pairId === pair.pairId)
        const baseAsset = findAssetByDenom(pair.baseDenom)
        const quoteAsset = findAssetByDenom(pair.quoteDenom)
        const exponentDiff = (baseAsset?.exponent ?? 0) - (quoteAsset?.exponent ?? 0)

        const tvlUSD = pair.totalReserved.reduce((accm, item) => {
          const valueUSD = item.amount.multipliedBy(item.priceOracle)
          return accm.plus(valueUSD)
        }, new BigNumber(0))

        const baseDenomPrice = baseAsset?.live?.priceOracle ?? new BigNumber(0)
        const vol24USD = pair.vol_24.multipliedBy(baseDenomPrice)
        const volTvlRatio = vol24USD.div(tvlUSD).toNumber() * 100

        const pools = pairInfo?.pools ?? []

        return {
          ...pair,
          baseAsset,
          quoteAsset,
          exponentDiff,
          tvlUSD,
          vol24USD,
          volTvlRatio,
          pools,
          assetTickers: [
            { logoUrl: baseAsset?.logoUrl ?? '', ticker: baseAsset?.ticker ?? '' },
            { logoUrl: quoteAsset?.logoUrl ?? '', ticker: quoteAsset?.ticker ?? '' },
          ],
          // poolAsset: pools[0] ? findAssetByDenom(pools[0].poolDenom) : undefined,
        }
      })
  }, [allPairLive, allPairInfo, findAssetByDenom])

  const findPairById = useCallback((pairId: number) => allPair.find((pair) => pair.pairId === pairId), [allPair])

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
      return allPair
        .filter((pair) => pair.baseDenom === denom || pair.quoteDenom === denom)
        .reduce((accm, pair) => {
          // const vol24 = pair.vol_24 // vol_24 in baseDenom
          // const baseAsset = pair.totalReserved.find((item) => item.denom === pair.baseDenom)
          // const vol24USD = vol24.multipliedBy(baseAsset?.priceOracle ?? 0)
          return accm.plus(pair.vol24USD)
        }, new BigNumber(0))
    },
    [allPair]
  )

  const allPoolsInPairs = useMemo(() => {
    return allPairInfo.reduce((accm: PoolInPair[], pair) => {
      return accm.concat(pair.pools.map((pool) => ({ ...pool, pairId: pair.pairId })))
    }, [])
  }, [allPairInfo])

  const findPoolFromPairsByDenom = useCallback(
    (denom: string) => allPoolsInPairs.find((pool) => pool.poolDenom === denom),
    [allPoolsInPairs]
  )

  const findPoolFromPairsByPoolId = useCallback(
    (poolId: number) => allPoolsInPairs.find((pool) => pool.poolId === poolId),
    [allPoolsInPairs]
  )

  // const getPoolAssets = useCallback(
  //   (denom: string) =>
  //     findPoolFromPairsByDenom(denom)?.reserved.map((reserve) => {
  //       const asset = findAssetByDenom(reserve.denom)
  //       return {
  //         ...reserve,
  //         ...(asset ?? {}),
  //       }
  //     }) ?? [],
  //   [findPoolFromPairsByDenom, findAssetByDenom]
  // )

  // const getAssetTickers = useCallback(
  //   (item: Asset) => {
  //     return item.isPoolToken
  //       ? getPoolAssets(item.denom).map((asset) => ({ logoUrl: asset?.logoUrl ?? '', ticker: asset?.ticker ?? '' }))
  //       : [{ logoUrl: item.logoUrl, ticker: item.ticker }]
  //   },
  //   [getPoolAssets]
  // )

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

  return {
    allPairLive,
    allPairInfo,
    allPair,
    findPairById,
    tvlUSD,
    getTVLUSDbyDenom,
    getVol24USDbyDenom,
    allPoolsInPairs,
    findPoolFromPairsByDenom,
    findPoolFromPairsByPoolId,
    // getPoolAssets,
    // getAssetTickers,
  }
}

export default usePair
