import BigNumber from 'bignumber.js'
import useAsset from 'hooks/useAsset'
import { useAtom } from 'jotai'
import { useCallback, useMemo } from 'react'
import { allPairInfoAtomRef, allPairLiveAtomRef } from 'state/atoms'

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

  const getTVLUSDbyDenom = useCallback(
    (denom: string) => {
      const tvl = allPairLiveAtom.reduce((tvl, pair) => {
        const reserveByPair = pair.totalReserved
          .filter((item) => item.denom === denom)
          .reduce((accm, item) => accm.plus(new BigNumber(item.amount)), new BigNumber(0))
        return tvl.plus(reserveByPair)
      }, new BigNumber(0))

      const baseAsset = allAsset.find((item) => item.denom === denom)
      const exponent = baseAsset?.exponent ?? 0
      const priceOracle = baseAsset?.live?.priceOracle ?? 0
      return tvl.dividedBy(10 ** exponent).multipliedBy(priceOracle)
    },
    [allPairLiveAtom, allAsset]
  )

  const tvlUSD = useMemo(() => {
    return allPairLiveAtom.reduce((tvl, pair) => {
      const reserveByPair = pair.totalReserved.reduce((accm, reserve) => {
        const baseAsset = allAsset.find((item) => item.denom === reserve.denom)
        const exponent = baseAsset?.exponent ?? 0
        const priceOracle = baseAsset?.live?.priceOracle ?? 0
        const reserveUSD = new BigNumber(reserve.amount).dividedBy(10 ** exponent).multipliedBy(priceOracle)
        return accm.plus(reserveUSD)
      }, new BigNumber(0))
      return tvl.plus(reserveByPair)
    }, new BigNumber(0))
  }, [allPairLiveAtom, allAsset])

  const getVol24USDbyDenom = useCallback(
    (denom: string, exponent: number) => {
      return allPairLiveAtom
        .filter((pair) => pair.baseDenom === denom || pair.quoteDenom === denom)
        .reduce((accm, pair) => {
          const vol24 = new BigNumber(pair.vol_24).dividedBy(10 ** exponent) // in baseDenom
          const baseAsset = pair.totalReserved.find((item) => item.denom === pair.baseDenom)
          const vol24USD = vol24.multipliedBy(new BigNumber(baseAsset ? baseAsset.priceOracle : 0))
          return accm.plus(vol24USD)
        }, new BigNumber(0))
    },
    [allPairLiveAtom]
  )

  return { allPairInfoAtom, allPairLiveAtom, tvlUSD, getTVLUSDbyDenom, getVol24USDbyDenom }
}

export default usePair
