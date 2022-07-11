import { CHAIN_IDS } from 'constants/chain'
import { useAllAssetInfo, useAllPairInfo, useAllPairLive } from 'hooks/useAPI'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import {
  allAssetInfoAtomRef,
  allPairInfoAtomRef,
  allPairLiveAtomRef,
  chainIdAtomRef,
  isTestnetAtomRef,
} from 'state/atoms'
import type { APIHookReturn } from 'types/api'
import type { AssetInfo } from 'types/asset'
import type { PairInfo, PairLive } from 'types/pair'

export default function StateUpdater(): null {
  const [chainIdAtom] = useAtom(chainIdAtomRef)
  const [, setIsTestnetAtom] = useAtom(isTestnetAtomRef)
  const [, setAllAssetInfoAtom] = useAtom(allAssetInfoAtomRef)
  const [, setAllPairtInfoAtom] = useAtom(allPairInfoAtomRef)
  const [, setAllPairLiveAtom] = useAtom(allPairLiveAtomRef)

  const {
    data: allAssetInfoData,
  }: // isError: allAssetInfoIsError,
  // isLoading: allAssetInfoIsLoading,
  APIHookReturn<AssetInfo[]> = useAllAssetInfo(0) // to be 6000
  const { data: allPairInfoData }: APIHookReturn<PairInfo[]> = useAllPairInfo(0) // to be 6000
  const { data: allPairLiveData }: APIHookReturn<PairLive[]> = useAllPairLive(0) // to be 6000

  useEffect(() => {
    setIsTestnetAtom(chainIdAtom === CHAIN_IDS.MOONCAT)
    console.log('chainIdAtom', chainIdAtom)
  }, [chainIdAtom, setIsTestnetAtom])

  useEffect(() => {
    const allAssetInfo = allAssetInfoData.data
    setAllAssetInfoAtom(allAssetInfo)
    console.log('useAllAssetInfo', allAssetInfoData)

    const allPairInfo = allPairInfoData.data
    setAllPairtInfoAtom(allPairInfo)
    console.log('useAllAssetInfo', allPairInfoData)

    const allPairLive = allPairLiveData.data
    setAllPairLiveAtom(allPairLive)
    console.log('useAllAssetInfo', allPairLiveData)
  }, [allAssetInfoData, setAllAssetInfoAtom, allPairInfoData, setAllPairtInfoAtom, allPairLiveData, setAllPairLiveAtom])

  return null
}
