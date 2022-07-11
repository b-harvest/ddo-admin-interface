import { CHAIN_IDS } from 'constants/chain'
import { useAllAssetInfo } from 'hooks/useAPI'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { allAssetInfoAtomRef, chainIdAtomRef, isTestnetAtomRef } from 'state/atoms'
import type { APIHookReturn } from 'types/api'
import type { AssetInfo } from 'types/asset'

export default function StateUpdater(): null {
  const [chainIdAtom] = useAtom(chainIdAtomRef)
  const [, setIsTestnetAtom] = useAtom(isTestnetAtomRef)
  const [, setAllAssetInfoAtom] = useAtom(allAssetInfoAtomRef)

  const {
    data: allAssetInfoData,
  }: // isError: allAssetInfoIsError,
  // isLoading: allAssetInfoIsLoading,
  APIHookReturn<AssetInfo[]> = useAllAssetInfo(0) // to be 6000

  useEffect(() => {
    setIsTestnetAtom(chainIdAtom === CHAIN_IDS.MOONCAT)
    console.log('chainIdAtom', chainIdAtom)
  }, [chainIdAtom, setIsTestnetAtom])

  useEffect(() => {
    const assetInfos = allAssetInfoData.data
    setAllAssetInfoAtom(assetInfos)
    console.log('useAllAssetInfo', allAssetInfoData)
  }, [allAssetInfoData, setAllAssetInfoAtom])

  return null
}
