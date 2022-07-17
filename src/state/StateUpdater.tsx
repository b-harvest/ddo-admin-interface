/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAllAssetInfo, useAllAssetLive, useAllPairInfo, useAllPairLive, useAllPoolLive } from 'data/useAPI'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import {
  allAssetInfoAtomRef,
  allAssetLiveAtomRef,
  allPairInfoAtomRef,
  allPairLiveAtomRef,
  allPoolLiveAtomRef,
} from 'state/atoms'
import type { APIHookReturn } from 'types/api'
import type { AssetInfoRaw, AssetLiveRaw } from 'types/asset'
import type { PairInfoRaw, PairLiveRaw } from 'types/pair'
import type { PoolLiveRaw } from 'types/pool'

export default function StateUpdater(): null {
  // all asset
  const [, setAllAssetInfoAtom] = useAtom(allAssetInfoAtomRef)
  const [, setAllAssetLiveAtom] = useAtom(allAssetLiveAtomRef)

  const { data: allAssetInfoData, isLoading: allAssetInfoIsLoading }: APIHookReturn<AssetInfoRaw[]> =
    useAllAssetInfo(60000) // to be 6000
  const { data: allAssetLiveData, isLoading: allAssetLiveIsLoading }: APIHookReturn<AssetLiveRaw[]> =
    useAllAssetLive(5000) // to be 6000

  // all pair
  const [, setAllPairtInfoAtom] = useAtom(allPairInfoAtomRef)
  const [, setAllPairLiveAtom] = useAtom(allPairLiveAtomRef)

  const { data: allPairInfoData, isLoading: allPairInfoIsLoading }: APIHookReturn<PairInfoRaw[]> = useAllPairInfo(5000) // to be 6000
  const { data: allPairLiveData, isLoading: allPairLiveIsLoading }: APIHookReturn<PairLiveRaw[]> = useAllPairLive(5000) // to be 6000

  // all pool
  const [, setAllPoolLiveAtom] = useAtom(allPoolLiveAtomRef)
  const { data: allPoolLiveData, isLoading: allPoolLiveIsLoading }: APIHookReturn<PoolLiveRaw[]> = useAllPoolLive(5000)

  useEffect(() => {
    if (allAssetInfoData && allAssetLiveData) {
      const allAssetInfo = allAssetInfoData.data ?? []
      setAllAssetInfoAtom(allAssetInfo)
      // console.log('allAssetInfo', allAssetInfoData)

      const allAssetLive = allAssetLiveData.data ?? []
      setAllAssetLiveAtom(allAssetLive)
      // console.log('allAssetLive', allAssetLiveData)
    }

    if (allPairInfoData && allPairLiveData) {
      const allPairInfo = allPairInfoData.data ?? []
      setAllPairtInfoAtom(allPairInfo)
      // console.log('allPairInfo', allPairInfoData)

      const allPairLive = allPairLiveData.data ?? []
      setAllPairLiveAtom(allPairLive)
      // console.log('allPairLive', allPairLiveData)
    }

    if (allPoolLiveData) {
      const allPoolLive = allPoolLiveData.data ?? []
      setAllPoolLiveAtom(allPoolLive)
      // console.log('allPoolLive', allPoolLiveData)
    }
  }, [
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
