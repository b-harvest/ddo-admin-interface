import BigNumber from 'bignumber.js'
import { useAtom } from 'jotai'
import { useCallback } from 'react'
import { allPairInfoAtomRef, allPairLiveAtomRef } from 'state/atoms'

const usePair = () => {
  const [allPairInfoAtom] = useAtom(allPairInfoAtomRef)
  const [allPairLiveAtom] = useAtom(allPairLiveAtomRef)

  const getTVLbyDenom = useCallback(
    (denom: string) => {
      return allPairLiveAtom.reduce((accm, pair) => {
        const reserveByPair = pair.totalReserved
          .filter((item) => item.denom === denom)
          .reduce((accm, item) => accm.plus(new BigNumber(item.amount)), new BigNumber(0))
        return accm.plus(reserveByPair)
      }, new BigNumber(0))
    },
    [allPairLiveAtom]
  )

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

  return { allPairInfoAtom, allPairLiveAtom, getTVLbyDenom, getVol24USDbyDenom }
}

export default usePair
