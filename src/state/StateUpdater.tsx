/* eslint-disable @typescript-eslint/no-unused-vars */
import { CHAIN_IDS } from 'constants/chain'
import {
  useAllAssetInfo,
  useAllAssetLive,
  useAllChainInfo,
  useAllChainLive,
  useAllPairInfo,
  useAllPairLive,
  useAllPoolLive,
} from 'data/useAPI'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import {
  allAssetInfoAtomRef,
  allAssetLiveAtomRef,
  allChainInfoAtomRef,
  allChainLiveAtomRef,
  allPairInfoAtomRef,
  allPairLiveAtomRef,
  allPoolLiveAtomRef,
  chainIdAtomRef,
  isTestnetAtomRef,
} from 'state/atoms'
import type { APIHookReturn } from 'types/api'
import type { AssetInfoRaw, AssetLiveRaw } from 'types/asset'
import type { ChainInfo, ChainLive } from 'types/chain'
import type { PairInfoRaw, PairLiveRaw } from 'types/pair'
import type { PoolLiveRaw } from 'types/pool'

export default function StateUpdater(): null {
  // chain id
  const [chainIdAtom] = useAtom(chainIdAtomRef)
  const [, setIsTestnetAtom] = useAtom(isTestnetAtomRef)

  useEffect(() => {
    setIsTestnetAtom(chainIdAtom === CHAIN_IDS.MOONCAT)
    console.log('chainIdAtom', chainIdAtom)
  }, [chainIdAtom, setIsTestnetAtom])

  // all chain
  const [, setAllChainInfoAtom] = useAtom(allChainInfoAtomRef)
  const [, setAllChainLiveAtom] = useAtom(allChainLiveAtomRef)

  const { data: allChainInfoData, isLoading: allChainInfoIsLoading }: APIHookReturn<ChainInfo[]> = useAllChainInfo(0) // to be 6000
  const { data: allChainLiveData, isLoading: allChainLiveIsLoading }: APIHookReturn<ChainLive[]> = useAllChainLive(0) // to be 6000

  // all asset
  const [, setAllAssetInfoAtom] = useAtom(allAssetInfoAtomRef)
  const [, setAllAssetLiveAtom] = useAtom(allAssetLiveAtomRef)

  const { data: allAssetInfoData, isLoading: allAssetInfoIsLoading }: APIHookReturn<AssetInfoRaw[]> = useAllAssetInfo(0) // to be 6000
  const { data: allAssetLiveData, isLoading: allAssetLiveIsLoading }: APIHookReturn<AssetLiveRaw[]> = useAllAssetLive(0) // to be 6000

  // all pair
  const [, setAllPairtInfoAtom] = useAtom(allPairInfoAtomRef)
  const [, setAllPairLiveAtom] = useAtom(allPairLiveAtomRef)

  const { data: allPairInfoData, isLoading: allPairInfoIsLoading }: APIHookReturn<PairInfoRaw[]> = useAllPairInfo(0) // to be 6000
  const { data: allPairLiveData, isLoading: allPairLiveIsLoading }: APIHookReturn<PairLiveRaw[]> = useAllPairLive(0) // to be 6000

  // all pool
  const [, setAllPoolLiveAtom] = useAtom(allPoolLiveAtomRef)
  const { data: allPoolLiveData, isLoading: allPoolLiveIsLoading }: APIHookReturn<PoolLiveRaw[]> = useAllPoolLive(0)

  useEffect(() => {
    if (allChainInfoData && allChainLiveData) {
      const allChainInfo = allChainInfoData.data ?? []
      setAllChainInfoAtom(allChainInfo)
      console.log('allChainInfo', allChainInfoData)

      const allChainLive = allChainLiveData.data ?? []
      setAllChainLiveAtom(allChainLive)
      console.log('allChainLive', allChainLiveData)
    }

    if (allAssetInfoData && allAssetLiveData) {
      const allAssetInfo = allAssetInfoData.data ?? []
      setAllAssetInfoAtom(allAssetInfo)
      console.log('allAssetInfo', allAssetInfoData)

      const allAssetLive = allAssetLiveData.data ?? []
      setAllAssetLiveAtom(allAssetLive)
      console.log('allAssetLive', allAssetLiveData)
    }

    if (allPairInfoData && allPairLiveData) {
      const allPairInfo = allPairInfoData.data ?? []
      setAllPairtInfoAtom(allPairInfo)
      console.log('allPairInfo', allPairInfoData)

      const allPairLive = allPairLiveData.data ?? []
      setAllPairLiveAtom(allPairLive)
      console.log('allPairLive', allPairLiveData)
    }

    if (allPoolLiveData) {
      const allPoolLive = allPoolLiveData.data ?? []
      setAllPoolLiveAtom(allPoolLive)
      console.log('allPoolLive', allPoolLiveData)
    }
  }, [
    allChainInfoData,
    setAllChainInfoAtom,
    allChainLiveData,
    setAllChainLiveAtom,
    allAssetInfoData,
    setAllAssetInfoAtom,
    allAssetLiveData,
    setAllAssetLiveAtom,
    allPairInfoData,
    setAllPairtInfoAtom,
    allPairLiveData,
    setAllPairLiveAtom,
    allPoolLiveData,
    setAllPoolLiveAtom,
  ])

  return null
}
