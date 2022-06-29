import { useAllAssetInfo } from 'hooks/useAPI'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { assetInfosAtomRef, chainNameAtomRef } from 'state/atoms'
import type { APIHookReturn } from 'types/api'
import type { AssetInfo } from 'types/asset'

export default function StateUpdater(): null {
  const [chainNameAtom] = useAtom(chainNameAtomRef)
  const [_, setAssetInfosAtom] = useAtom(assetInfosAtomRef)

  const {
    data: allAssetInfoData,
    isError: allAssetInfoIsError,
    isLoading: allAssetInfoIsLoading,
  }: APIHookReturn<AssetInfo[]> = useAllAssetInfo(6000)

  useEffect(() => {
    // the below is tmp for test using swr and jotai
    console.log('chainNameAtom', chainNameAtom)
  }, [chainNameAtom])

  useEffect(() => {
    console.log('useAllAssetInfo', allAssetInfoData)
    const assetInfos = allAssetInfoData.data
    setAssetInfosAtom(assetInfos)
  }, [allAssetInfoData, setAssetInfosAtom])

  return null
}
