import { useAtom } from 'jotai'
import { useCallback, useMemo } from 'react'
import { allAssetInfoAtomRef, allAssetLiveAtomRef } from 'state/atoms'
import { Asset } from 'types/asset'

const useAsset = () => {
  const [allAssetLiveAtom] = useAtom(allAssetLiveAtomRef)
  const [allAssetInfoAtom] = useAtom(allAssetInfoAtomRef)

  const allAsset = useMemo(() => {
    return allAssetInfoAtom.map((assetInfo) => {
      return {
        ...assetInfo,
        live: allAssetLiveAtom.find((item) => item.denom === assetInfo.denom),
      }
    }) as Asset[]
  }, [allAssetInfoAtom, allAssetLiveAtom])

  const findAssetByDenom = useCallback(
    (denom: string) => {
      return allAsset.find((item) => item.denom === denom) ?? null
    },
    [allAsset]
  )

  return { allAsset, findAssetByDenom }
}

export default useAsset
