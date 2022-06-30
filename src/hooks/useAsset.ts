import { useAtom } from 'jotai'
import { useCallback } from 'react'
import { allAssetInfoAtomRef } from 'state/atoms'

const useAsset = () => {
  const [allAssetInfoAtom] = useAtom(allAssetInfoAtomRef)

  const findAssetInfoByDenom = useCallback(
    (denom: string) => {
      return allAssetInfoAtom.find((item) => item.denom === denom) ?? null
    },
    [allAssetInfoAtom]
  )

  return { findAssetInfoByDenom }
}

export default useAsset
