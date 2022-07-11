import BigNumber from 'bignumber.js'
import { useAtom } from 'jotai'
import { useCallback, useMemo } from 'react'
import { allAssetInfoAtomRef, allAssetLiveAtomRef } from 'state/atoms'
import type { Asset, AssetLive } from 'types/asset'

const useAsset = () => {
  const [allAssetLiveAtom] = useAtom(allAssetLiveAtomRef)
  const [allAssetInfoAtom] = useAtom(allAssetInfoAtomRef)

  const isPoolToken = useCallback((denom: string) => denom.includes('pool'), [])

  const allAssetLive = useMemo(() => {
    return allAssetLiveAtom.map((asset) => ({ ...asset, priceOracle: new BigNumber(asset.priceOracle) })) as AssetLive[]
  }, [allAssetLiveAtom])

  const allAsset = useMemo(() => {
    return allAssetInfoAtom.map((assetInfo) => {
      const live = allAssetLive.find((item) => item.denom === assetInfo.denom)

      return {
        ...assetInfo,
        live,
        isPoolToken: isPoolToken(assetInfo.denom),
      }
    }) as Asset[]
  }, [allAssetInfoAtom, allAssetLive])

  const findAssetByDenom = useCallback(
    (denom: string) => {
      return allAsset.find((item) => item.denom === denom)
    },
    [allAsset]
  )

  return { allAssetLive, allAsset, findAssetByDenom, isPoolToken }
}

export default useAsset
