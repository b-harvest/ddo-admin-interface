import BigNumber from 'bignumber.js'
import { POOL_TOKEN_EXPONENT, TokenTypes } from 'constants/asset'
import { useAtom } from 'jotai'
import { useCallback, useMemo } from 'react'
import { allAssetInfoAtomRef, allAssetLiveAtomRef } from 'state/atoms'
import type { Asset, AssetLive } from 'types/asset'
import { getOriginPoolDenom, getTokenType } from 'utils/asset'

const useAsset = () => {
  const [allAssetLiveAtom] = useAtom(allAssetLiveAtomRef)
  const [allAssetInfoAtom] = useAtom(allAssetInfoAtomRef)

  const isPoolToken = useCallback((denom: string) => denom.includes('pool'), [])

  const allAssetLive = useMemo(() => {
    return allAssetLiveAtom.map((asset) => ({
      ...asset,
      priceOracle: new BigNumber(asset.priceOracle),
      updateTimestamp: asset.updateTimestamp * 1000,
    })) as AssetLive[]
  }, [allAssetLiveAtom])

  const allAsset = useMemo<Asset[]>(() => {
    return allAssetInfoAtom.map((assetInfo) => {
      const live = allAssetLive.find((item) => item.denom === assetInfo.denom)
      const tokenType = getTokenType(assetInfo)
      const originPoolDenom = getOriginPoolDenom(assetInfo, tokenType)

      return {
        ...assetInfo,
        exponent: isPoolToken(assetInfo.denom) ? POOL_TOKEN_EXPONENT : assetInfo.exponent,
        live,
        isPoolToken: tokenType === TokenTypes.POOL,
        tokenType,
        originPoolDenom,
      }
    })
  }, [allAssetInfoAtom, allAssetLive, isPoolToken])

  const findAssetByDenom = useCallback(
    (denom: string) => {
      return allAsset.find((item) => item.denom === denom)
    },
    [allAsset]
  )

  const cre = useMemo(() => findAssetByDenom('ucre'), [findAssetByDenom])

  return { allAssetLive, allAsset, findAssetByDenom, isPoolToken, cre }
}

export default useAsset
